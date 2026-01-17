import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import Anthropic from '@anthropic-ai/sdk';
import { authOptions } from '@/lib/auth';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface ParsedTicket {
  eventName: string;
  eventDate: string;
  eventTime?: string;
  venue: string;
  city: string;
  section?: string;
  row?: string;
  seat?: string;
  quantity: number;
  orderNumber?: string;
  totalPrice?: string;
  league?: string;
  homeTeam?: string;
  awayTeam?: string;
  confidence: number;
  source: string;
  emailId: string;
  emailSubject: string;
  emailDate: string;
}

interface EmailInput {
  id: string;
  subject: string;
  date: string;
  body: string;
  source: string;
}

// Validate date is reasonable (not Unix epoch, not too old/future)
function isValidDate(dateStr: string): boolean {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return false;
  if (date.getFullYear() <= 1970) return false;
  if (date.getFullYear() < 2020) return false;
  const twoYearsFromNow = new Date();
  twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 2);
  if (date > twoYearsFromNow) return false;
  return true;
}

// Fallback: extract date from email date header
function parseEmailDate(emailDateStr: string): string | null {
  if (!emailDateStr) return null;
  try {
    const date = new Date(emailDateStr);
    if (isNaN(date.getTime())) return null;
    if (date.getFullYear() < 2020) return null;
    return date.toISOString().split('T')[0];
  } catch {
    return null;
  }
}

// Generate key for deduplication (date + teams)
function generateTicketKey(ticket: ParsedTicket): string {
  const normalize = (str: string | undefined) =>
    (str || '').toLowerCase().trim().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');

  const dateKey = ticket.eventDate || '';

  if (ticket.homeTeam && ticket.awayTeam) {
    const teams = [normalize(ticket.homeTeam), normalize(ticket.awayTeam)].sort().join('-');
    return `${dateKey}:${teams}`;
  }

  return `${dateKey}:${normalize(ticket.eventName)}`;
}

// Remove duplicates, keeping the one with more details
function deduplicateTickets(tickets: ParsedTicket[]): ParsedTicket[] {
  const seen = new Map<string, ParsedTicket>();

  for (const ticket of tickets) {
    const key = generateTicketKey(ticket);
    const existing = seen.get(key);

    if (!existing) {
      seen.set(key, ticket);
    } else {
      // Keep whichever has more fields filled in
      const existingScore = Object.values(existing).filter(v => v).length;
      const newScore = Object.values(ticket).filter(v => v).length;
      if (newScore > existingScore) {
        seen.set(key, ticket);
      }
    }
  }

  return Array.from(seen.values());
}

function stripHtml(html: string): string {
  let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  text = text.replace(/<br[^>]*>/gi, '\n');
  text = text.replace(/<\/p>/gi, '\n');
  text = text.replace(/<\/div>/gi, '\n');
  text = text.replace(/<[^>]+>/g, ' ');
  text = text.replace(/&nbsp;/g, ' ');
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#39;/g, "'");
  text = text.replace(/\s+/g, ' ').trim();
  return text;
}

// AI PROMPT - handles purchases, transfers, and various sports
const SYSTEM_PROMPT = `You are a JSON extractor for sports ticket emails. Extract ticket details and return ONLY valid JSON.

IMPORTANT - THESE ALL COUNT AS VALID TICKETS (high confidence):
- Direct purchases (order confirmations with order#/price)
- Ticket TRANSFERS ("Someone sent you tickets") - these are REAL tickets!
- MLB Ballpark "party" invites - these are REAL tickets!
- Mobile entry/QR code emails with specific event
- "View and Save Your Tickets" emails from Ticketmaster - REAL ticket confirmations!
- "Tickets Delivered" or "Your tickets are ready" emails - REAL tickets!
- Minor league, G League, college sports, NASCAR, F1 - ALL valid!
- "You're in the game" or "You're going to" emails with seat info

CAUTION - THESE NEED VERIFICATION (lower confidence unless has order#/price/seat):
- "Event lineup" or "upcoming event" emails - often BOOKMARKS, not actual purchases!
- Game day reminders - could be marketing if no purchase proof

RULES:
1. Return ONLY a JSON object - no explanations, no markdown, just raw JSON
2. If clearly NOT a ticket (marketing, newsletter, password reset), return: {"confidence": 0}
3. eventDate must be YYYY-MM-DD format (the game date, NOT the email date)
4. Ticket transfers should get confidence 0.7+ if they mention a specific event
5. CRITICAL: "Your event lineup" or "upcoming events" emails are usually BOOKMARKS, not purchases!
   - If subject contains "event lineup" AND body has NO order#/price/seat info → confidence: 0.3
   - Only give 0.6+ if there's PROOF of purchase (order number, price paid, seat assignment)

CONFIDENCE SCORING:
- 0.9: Has order number + price + seat info (DEFINITE purchase)
- 0.8: "View and Save Your Tickets" or "Tickets Delivered" with event details
- 0.7-0.8: Has 2 of: order number, price, seat info (LIKELY purchase)
- 0.6-0.7: Is a ticket transfer with specific event details
- 0.5: Has event name + date (Team vs Team format)
- 0.3-0.4: "Event lineup" or reminder WITHOUT purchase proof (probably bookmark)
- 0: Marketing, sales promotions, newsletters, password resets, "tickets on sale", sweepstakes

JSON SCHEMA:
{
  "eventName": "Team A vs Team B",
  "eventDate": "YYYY-MM-DD",
  "eventTime": "7:00 PM" or null,
  "venue": "Stadium Name",
  "city": "City, State",
  "section": "string or null",
  "row": "string or null",
  "seat": "string or null",
  "quantity": number,
  "orderNumber": "string or null",
  "totalPrice": "$XX.XX or null",
  "league": "NFL|NBA|MLB|NHL|NCAA|NASCAR|F1|MLS|MINOR" or null,
  "homeTeam": "team name or null",
  "awayTeam": "team name or null",
  "confidence": 0.0 to 1.0
}`;

async function parseEmailWithAI(email: EmailInput): Promise<ParsedTicket | null> {
  const plainText = stripHtml(email.body).slice(0, 6000); // Shorter for faster processing

  // Debug: Log email content for investigation
  if (email.subject.includes('View and Save Your Tickets') || email.subject.includes('Order Confirmed')) {
    console.log(`\n=== DEBUG: ${email.subject} ===`);
    console.log(`Content preview (first 800 chars): ${plainText.slice(0, 800)}`);
    console.log(`=================================\n`);
  }

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 512, // Smaller for faster response
      messages: [
        {
          role: 'user',
          content: `${SYSTEM_PROMPT}

Subject: ${email.subject}
Source: ${email.source}

Email Content:
${plainText}`
        }
      ]
    });

    const content = message.content[0];
    if (content.type !== 'text') return null;

    // Extract JSON from response
    let jsonText = content.text.trim();

    // Find JSON object if AI included extra text
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.log(`No JSON in response for: "${email.subject}"`);
      return null;
    }
    jsonText = jsonMatch[0];

    const parsed = JSON.parse(jsonText);

    // Filter low confidence - threshold 0.4 balances false positives vs missed tickets
    // See docs/TICKET_SEARCH_STRATEGY.md for tradeoff analysis
    if (parsed.confidence < 0.4) {
      console.log(`Low confidence (${parsed.confidence}) for: "${email.subject}"`);
      return null;
    }

    // Validate/fix date
    let eventDate = parsed.eventDate;
    if (!isValidDate(eventDate)) {
      const fallback = parseEmailDate(email.date);
      if (fallback) {
        console.log(`Using email date as fallback for: "${email.subject}"`);
        eventDate = fallback;
      } else {
        console.log(`Invalid date for: "${email.subject}"`);
        return null;
      }
    }

    return {
      ...parsed,
      eventDate,
      source: email.source,
      emailId: email.id,
      emailSubject: email.subject,
      emailDate: email.date,
    };
  } catch (error) {
    console.error(`Parse error for "${email.subject}":`, error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { emails } = await request.json() as { emails: EmailInput[] };

    if (!emails || !Array.isArray(emails)) {
      return NextResponse.json(
        { error: 'Invalid request: emails array required' },
        { status: 400 }
      );
    }

    console.log(`Parsing ${emails.length} emails with AI...`);

    // Parse each email
    const parsedTickets: ParsedTicket[] = [];
    for (const email of emails) {
      const parsed = await parseEmailWithAI(email);
      if (parsed) {
        parsedTickets.push(parsed);
        console.log(`Found ticket: ${parsed.eventName} on ${parsed.eventDate}`);
      }
    }

    // Remove duplicates
    const uniqueTickets = deduplicateTickets(parsedTickets);

    // Sort by date (newest first)
    uniqueTickets.sort((a, b) =>
      new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
    );

    console.log(`Result: ${uniqueTickets.length} unique tickets from ${emails.length} emails`);

    return NextResponse.json({
      success: true,
      count: uniqueTickets.length,
      tickets: uniqueTickets,
      stats: {
        emailsParsed: emails.length,
        ticketsFound: parsedTickets.length,
        duplicatesRemoved: parsedTickets.length - uniqueTickets.length,
      },
    });
  } catch (error) {
    console.error('Parse error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to parse emails: ${errorMessage}` },
      { status: 500 }
    );
  }
}
