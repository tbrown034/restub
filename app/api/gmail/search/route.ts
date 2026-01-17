import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { google } from 'googleapis';
import { authOptions } from '@/lib/auth';

export interface TicketEmail {
  id: string;
  threadId: string;
  from: string;
  subject: string;
  date: string;
  snippet: string;
  body: string;
  source: string;
  purchaseScore: number; // Legacy score (kept for backwards compatibility)
  // Dual-path scoring (new system)
  senderScore: number;
  subjectScore: number;
  totalScore: number;
  tier: number; // 1, 2, 3, or 0 (unknown)
}

// TIER 1: Major Resale Platforms (highest trust) - Score: +40
const TIER_1_PROVIDERS = [
  { name: 'ticketmaster', domains: ['ticketmaster.com', 'livenation.com', 'ticketexchange.com'] },
  { name: 'stubhub', domains: ['stubhub.com'] },
  { name: 'seatgeek', domains: ['seatgeek.com'] },
  { name: 'axs', domains: ['axs.com'] },
  { name: 'vividseats', domains: ['vividseats.com'] },
  { name: 'gametime', domains: ['gametime.co', 'gametime.com'] },
] as const;

// TIER 2: League & Team Official - Score: +30
const TIER_2_PROVIDERS = [
  // League apps
  { name: 'mlb', domains: ['mlb.com', 'ballparkapp.com'] },
  { name: 'nba', domains: ['nba.com', 'nbatickets.com'] },
  { name: 'nfl', domains: ['nfl.com'] },
  { name: 'nhl', domains: ['nhl.com'] },
  { name: 'mls', domains: ['mlssoccer.com'] },
  // Team-specific (Chicago + others user may have)
  { name: 'bulls', domains: ['bulls.com'] },
  { name: 'cubs', domains: ['cubs.com'] },
  { name: 'bears', domains: ['bears.com'] },
  { name: 'blackhawks', domains: ['blackhawks.com'] },
  { name: 'whitesox', domains: ['whitesox.com', 'chisoxbaseball.com'] },
  { name: 'steelers', domains: ['steelers.com'] },
  { name: 'braves', domains: ['braves.com', 'atlantabraves.com'] },
  { name: 'rockies', domains: ['rockies.com', 'coloradorockies.com'] },
  { name: 'redsox', domains: ['redsox.com'] },
] as const;

// TIER 3: Other/Specialty - Score: +20
const TIER_3_PROVIDERS = [
  // Motorsports
  { name: 'nascar', domains: ['nascar.com', 'racingamerica.com'] },
  { name: 'f1', domains: ['formula1.com', 'f1experiences.com', 'f1authentics.com'] },
  { name: 'indycar', domains: ['indycar.com', 'ims.com'] },
  // College
  { name: 'ncaa', domains: ['ncaa.com', 'paciolan.com', 'tickets.com', 'etix.com'] },
  // Minor league
  { name: 'milb', domains: ['milb.com'] },
  { name: 'gleague', domains: ['gleague.nba.com'] },
  // Other
  { name: 'tickpick', domains: ['tickpick.com'] },
  { name: 'viagogo', domains: ['viagogo.com'] },
  { name: 'eventbrite', domains: ['eventbrite.com'] },
] as const;

// Combined for Gmail search query
const ALL_PROVIDERS = [...TIER_1_PROVIDERS, ...TIER_2_PROVIDERS, ...TIER_3_PROVIDERS];

// Quick pre-filter: regex patterns that indicate ACTUAL purchase or transfer
const PURCHASE_INDICATORS = [
  /order\s*(#|number|confirmation)/i,
  /confirmation\s*(#|number|code)/i,
  /total:?\s*\$[\d,.]+/i,
  /\$[\d,.]+\s*(total|paid)/i,
  /section\s*[\w\d]+/i,
  /row\s*[\w\d]+/i,
  /seat[s]?\s*[\w\d]+/i,
  /barcode|qr\s*code/i,
  /e-?ticket|mobile\s*entry/i,
  /your\s*tickets?\s*(are|is)\s*ready/i,
  /tickets?\s*(confirmed|delivered)/i,
  // Ticket transfers (very important!)
  /sent\s*you\s*\d*\s*tickets?/i,
  /ticket\s*transfer/i,
  /tickets?\s*transferred/i,
  /accepted\s*(your|their)?\s*tickets?/i,
  /you('re|r)?\s*(going|in)\s*(to|the)/i,
  /started\s*the\s*party/i,
  /join(ed)?\s*(the|your)?\s*party/i,
  // Event confirmations
  /your\s*event/i,
  /event\s*details/i,
  /upcoming\s*event/i,
  // Receipt/billing patterns
  /billing\s*review/i,
  /ticket\s*price/i,
  /total\s*fees/i,
  /order\s*total/i,
  /total\s*payment/i,
  // Access patterns
  /view\s*(your\s*)?(tickets?|seats?)/i,
  /access\s*(your\s*)?tickets?/i,
  /manage\s*(your\s*)?tickets?/i,
  // Game day patterns
  /game\s*day\s*info/i,
  /entry\s*instructions/i,
  /gate\s*\d+/i,
];

// Patterns that indicate marketing/promotional (NOT purchases)
const MARKETING_INDICATORS = [
  /unsubscribe/i,
  /don't miss/i,
  /limited time/i,
  /sale ends/i,
  /% off/i,
  /promo code/i,
  /use code/i,
  /shop now/i,
  /buy now/i,
  /on sale/i,
  /presale/i,
  /newsletter/i,
  // Browsing/viewing indicators (NOT purchases)
  /still available/i,
  /tickets? available/i,
  /get tickets/i,
  /find tickets/i,
  /browse tickets/i,
  /similar events/i,
  /you might like/i,
  /recommended for you/i,
  /based on your interest/i,
  /password reset/i,
  /password.*updated/i,
  /terms.*privacy/i,
  /privacy.*notice/i,
  /account.*change/i,
];

// Get sender tier and score
function getSenderScore(from: string): { name: string; tier: number; score: number } {
  const fromLower = from.toLowerCase();

  for (const provider of TIER_1_PROVIDERS) {
    if (provider.domains.some(domain => fromLower.includes(domain))) {
      return { name: provider.name, tier: 1, score: 40 };
    }
  }

  for (const provider of TIER_2_PROVIDERS) {
    if (provider.domains.some(domain => fromLower.includes(domain))) {
      return { name: provider.name, tier: 2, score: 30 };
    }
  }

  for (const provider of TIER_3_PROVIDERS) {
    if (provider.domains.some(domain => fromLower.includes(domain))) {
      return { name: provider.name, tier: 3, score: 20 };
    }
  }

  return { name: 'other', tier: 0, score: 0 };
}

function identifySource(from: string): string {
  return getSenderScore(from).name;
}

// Subject keyword scoring (Path B of dual-path system)
function calculateSubjectScore(subject: string): number {
  const subjectLower = subject.toLowerCase();
  let score = 0;

  // HIGH-confidence: Strong purchase/transfer indicators
  if (/order\s*(confirmed|confirmation)/i.test(subjectLower)) score += 35;
  if (/sent\s+you\s+\d*\s*tickets?/i.test(subjectLower)) score += 40; // Transfers are very reliable
  if (/just\s+sent\s+you/i.test(subjectLower)) score += 40; // "Name Just Sent You X Tickets"
  if (/your\s+tickets?\s+(are|is)\s+ready/i.test(subjectLower)) score += 35;
  if (/tickets?\s+(confirmed|delivered)/i.test(subjectLower)) score += 30; // Includes "Tickets Delivered"
  if (/receipt\s+for/i.test(subjectLower)) score += 30;
  if (/view\s+and\s+save\s+your\s+tickets/i.test(subjectLower)) score += 30; // "View and Save Your Tickets"
  if (/mobile\s+entry/i.test(subjectLower)) score += 25; // Mobile entry tickets
  if (/e-?ticket/i.test(subjectLower)) score += 25; // E-tickets
  if (/get\s+into.*with\s+your\s+phone/i.test(subjectLower)) score += 35; // "Get into X with your phone!" = mobile entry
  if (/with\s+your\s+phone/i.test(subjectLower)) score += 20; // Mobile entry pattern

  // MEDIUM-confidence: Likely purchase
  if (/your\s+tickets?/i.test(subjectLower) && !/available/i.test(subjectLower)) score += 20;
  if (/confirmation\s*(#|number|code)/i.test(subjectLower)) score += 25;
  if (/transfer/i.test(subjectLower)) score += 20;
  if (/order\s*#?\s*\d+/i.test(subjectLower)) score += 25; // Order numbers
  if (/game\s*day/i.test(subjectLower)) score += 20; // "Game Day" reminders often contain ticket info
  if (/upcoming\s*(game|event)/i.test(subjectLower)) score += 15;
  if (/reminder.*ticket/i.test(subjectLower)) score += 20;
  if (/access\s*your\s*tickets?/i.test(subjectLower)) score += 25;

  // MLB Ballpark specific patterns
  if (/ballpark/i.test(subjectLower)) score += 15;
  if (/wrigley|soldier\s*field|united\s*center/i.test(subjectLower)) score += 20; // Chicago venues
  if (/coors\s*field/i.test(subjectLower)) score += 20; // Colorado venue

  // LOW-confidence: May indicate purchase
  if (/vs\.?|versus|@/i.test(subjectLower)) score += 10; // Include "@" for away games
  if (/section|row/i.test(subjectLower)) score += 15;
  if (/you('re|r)?\s*(going|in)/i.test(subjectLower)) score += 15;
  if (/cubs|bears|bulls|blackhawks|white\s*sox/i.test(subjectLower)) score += 10; // Chicago teams
  if (/rockies|vikings|packers|steelers/i.test(subjectLower)) score += 10; // Opponent teams

  // NEGATIVE indicators in subject (reduce score)
  if (/still\s+available/i.test(subjectLower)) score -= 30;
  if (/get\s+tickets/i.test(subjectLower)) score -= 20;
  if (/password/i.test(subjectLower)) score -= 40;
  if (/terms|privacy/i.test(subjectLower)) score -= 40;

  return score;
}

// DUAL-PATH SCORING: Combines sender tier + subject keywords
// See docs/TICKET_SEARCH_STRATEGY.md for detailed scoring logic
function calculateDualPathScore(from: string, subject: string, snippet: string, body: string): {
  senderScore: number;
  subjectScore: number;
  totalScore: number;
  shouldVerify: boolean;
} {
  const text = `${subject} ${snippet} ${body}`.toLowerCase();

  // PATH A: Sender score
  const { score: senderScore } = getSenderScore(from);

  // PATH B: Subject score
  const subjectScore = calculateSubjectScore(subject);

  // Additional body-based indicators (boost, not primary)
  let bodyBoost = 0;
  for (const pattern of PURCHASE_INDICATORS) {
    if (pattern.test(text)) {
      bodyBoost += 5; // Lower weight than subject
    }
  }

  // Marketing penalty
  let marketingPenalty = 0;
  for (const pattern of MARKETING_INDICATORS) {
    if (pattern.test(text)) {
      marketingPenalty += 15;
    }
  }

  const totalScore = senderScore + subjectScore + bodyBoost - marketingPenalty;

  // VERIFY THRESHOLDS:
  // - totalScore >= 50 → VERIFY (high confidence from any source)
  // - totalScore >= 40 && senderScore > 0 && subjectScore > 0 → VERIFY (known provider + purchase keywords)
  // - Tier 1 providers (Ticketmaster, etc.) get lower threshold since they're high-trust
  const isTier1 = senderScore >= 40;
  const shouldVerify =
    totalScore >= 50 ||
    (totalScore >= 40 && senderScore > 0 && subjectScore > 0) ||
    (isTier1 && totalScore >= 35); // Tier 1 gets benefit of doubt

  return { senderScore, subjectScore, totalScore, shouldVerify };
}

// Legacy function for backwards compatibility
function calculatePurchaseScore(subject: string, snippet: string, body: string): number {
  const text = `${subject} ${snippet} ${body}`.toLowerCase();
  let score = 0;

  for (const pattern of PURCHASE_INDICATORS) {
    if (pattern.test(text)) {
      score += 10;
    }
  }

  for (const pattern of MARKETING_INDICATORS) {
    if (pattern.test(text)) {
      score -= 15;
    }
  }

  if (text.includes('your tickets')) score += 15;
  if (text.includes('order confirmed')) score += 20;
  if (text.includes('receipt')) score += 10;

  return score;
}

function decodeBase64Url(data: string): string {
  const base64 = data.replace(/-/g, '+').replace(/_/g, '/');
  try {
    return Buffer.from(base64, 'base64').toString('utf-8');
  } catch {
    return '';
  }
}

interface EmailPart {
  mimeType?: string | null;
  body?: { data?: string | null } | null;
  parts?: EmailPart[] | null;
}

interface EmailPayload extends EmailPart {
  headers?: Array<{ name?: string | null; value?: string | null }> | null;
}

function extractBody(payload: EmailPayload): string {
  if (payload.body?.data) {
    return decodeBase64Url(payload.body.data);
  }
  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === 'text/html' && part.body?.data) {
        return decodeBase64Url(part.body.data);
      }
      if (part.parts) {
        const nested = extractBody(part);
        if (nested) return nested;
      }
    }
    for (const part of payload.parts) {
      if (part.mimeType === 'text/plain' && part.body?.data) {
        return decodeBase64Url(part.body.data);
      }
    }
  }
  return '';
}

// Strip HTML for cleaner pre-filtering
function stripHtml(html: string): string {
  let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  text = text.replace(/<[^>]+>/g, ' ');
  text = text.replace(/&nbsp;/g, ' ');
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/\s+/g, ' ').trim();
  return text;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated. Please connect your Gmail account.' },
        { status: 401 }
      );
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: session.accessToken });
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    // DUAL-PATH SEARCH: Sender-based + Subject-based, last 2 years
    const providerDomains = ALL_PROVIDERS.flatMap(p => p.domains);
    const fromQuery = providerDomains.map(d => `from:${d}`).join(' OR ');

    // Subject-based search catches tickets from unknown providers
    const subjectTerms = [
      'order confirmed',
      'your tickets',
      'tickets confirmed',
      'ticket confirmation',
      'sent you tickets',
      'e-ticket',
      'mobile entry',
      'view your tickets',
    ];
    const subjectQuery = subjectTerms.map(t => `subject:"${t}"`).join(' OR ');

    // Combine: (from providers) OR (subject has ticket terms)
    const searchQuery = `((${fromQuery}) OR (${subjectQuery})) newer_than:2y`;

    console.log(`Searching Gmail with query: ${searchQuery}`);
    console.log(`Providers: Tier1=${TIER_1_PROVIDERS.length}, Tier2=${TIER_2_PROVIDERS.length}, Tier3=${TIER_3_PROVIDERS.length}`);

    const searchResponse = await gmail.users.messages.list({
      userId: 'me',
      q: searchQuery,
      maxResults: 200, // Increased to catch more potential tickets
    });

    const messages = searchResponse.data.messages || [];
    console.log(`Found ${messages.length} emails from ticket providers`);

    const ticketEmails: TicketEmail[] = [];

    for (const message of messages) {
      if (!message.id) continue;

      const msgResponse = await gmail.users.messages.get({
        userId: 'me',
        id: message.id,
        format: 'full',
      });

      const msg = msgResponse.data;
      const headers = msg.payload?.headers || [];

      const getHeader = (name: string) =>
        headers.find(h => h.name?.toLowerCase() === name.toLowerCase())?.value || '';

      const from = getHeader('From');
      const subject = getHeader('Subject');
      const date = getHeader('Date');
      const snippet = msg.snippet || '';
      const bodyHtml = msg.payload ? extractBody(msg.payload as EmailPayload) : '';
      const bodyText = stripHtml(bodyHtml);

      // DUAL-PATH SCORING: Sender tier + Subject keywords
      const { senderScore, subjectScore, totalScore, shouldVerify } = calculateDualPathScore(from, subject, snippet, bodyText);
      const { tier } = getSenderScore(from);
      const purchaseScore = calculatePurchaseScore(subject, snippet, bodyText); // Legacy

      if (!shouldVerify) {
        console.log(`Skipping: "${subject}" (sender=${senderScore}, subject=${subjectScore}, total=${totalScore})`);
        continue;
      }

      console.log(`Including: "${subject}" (tier=${tier}, sender=${senderScore}, subject=${subjectScore}, total=${totalScore})`);

      ticketEmails.push({
        id: message.id,
        threadId: message.threadId || '',
        from,
        subject,
        date,
        snippet,
        body: bodyHtml, // Keep HTML for AI parsing
        source: identifySource(from),
        purchaseScore,
        senderScore,
        subjectScore,
        totalScore,
        tier,
      });
    }

    // Sort by total score (most likely purchases first)
    ticketEmails.sort((a, b) => b.totalScore - a.totalScore);

    console.log(`Returning ${ticketEmails.length} likely purchase emails`);

    return NextResponse.json({
      success: true,
      count: ticketEmails.length,
      emails: ticketEmails,
    });
  } catch (error) {
    console.error('Gmail search error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    if (errorMessage.includes('invalid_grant') || errorMessage.includes('Token has been expired')) {
      return NextResponse.json(
        { error: 'Gmail access expired. Please reconnect your account.' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: `Failed to search Gmail: ${errorMessage}` },
      { status: 500 }
    );
  }
}
