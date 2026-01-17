/**
 * Test script for ticket search functionality
 * Run with: npx ts-node scripts/test-ticket-search.ts
 *
 * Requires: Valid session with Gmail access token
 */

const BASE_URL = 'http://localhost:3000';

interface TicketEmail {
  id: string;
  subject: string;
  from: string;
  date: string;
  source: string;
  senderScore: number;
  subjectScore: number;
  totalScore: number;
  tier: number;
}

interface ParsedTicket {
  eventName: string;
  eventDate: string;
  venue: string;
  league?: string;
  homeTeam?: string;
  awayTeam?: string;
  section?: string;
  row?: string;
  seat?: string;
  totalPrice?: string;
  confidence: number;
  source: string;
  emailSubject: string;
}

async function testSearch(): Promise<TicketEmail[]> {
  console.log('\n=== PHASE 1: SEARCH ===\n');

  try {
    const response = await fetch(`${BASE_URL}/api/gmail/search`, {
      method: 'GET',
      headers: {
        'Cookie': process.env.SESSION_COOKIE || '',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Search failed:', error);
      return [];
    }

    const data = await response.json();
    console.log(`Found ${data.count} candidate emails\n`);

    // Display each email with scoring breakdown
    data.emails.forEach((email: TicketEmail, i: number) => {
      console.log(`${i + 1}. "${email.subject}"`);
      console.log(`   Sender: ${email.source} (Tier ${email.tier})`);
      console.log(`   Scores: sender=${email.senderScore}, subject=${email.subjectScore}, total=${email.totalScore}`);
      console.log('');
    });

    return data.emails;
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}

async function testParse(emails: TicketEmail[]): Promise<ParsedTicket[]> {
  console.log('\n=== PHASE 2: VERIFY (AI Parse) ===\n');

  if (emails.length === 0) {
    console.log('No emails to parse');
    return [];
  }

  try {
    // We need the full email bodies for parsing, which the search endpoint returns
    const response = await fetch(`${BASE_URL}/api/gmail/parse`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': process.env.SESSION_COOKIE || '',
      },
      body: JSON.stringify({
        emails: emails.map(e => ({
          id: e.id,
          subject: e.subject,
          date: e.date,
          body: '', // This should be populated from search
          source: e.source,
        })),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Parse failed:', error);
      return [];
    }

    const data = await response.json();
    console.log(`Parsed ${data.count} tickets\n`);

    return data.tickets;
  } catch (error) {
    console.error('Parse error:', error);
    return [];
  }
}

function displayResults(tickets: ParsedTicket[]) {
  console.log('\n=== PHASE 3: RESULTS ===\n');

  if (tickets.length === 0) {
    console.log('No tickets found');
    return;
  }

  console.log(`Found ${tickets.length} tickets:\n`);
  console.log('─'.repeat(80));

  tickets.forEach((ticket, i) => {
    console.log(`\n${i + 1}. ${ticket.eventName}`);
    console.log(`   Date: ${ticket.eventDate}`);
    console.log(`   Venue: ${ticket.venue || 'Unknown'}`);
    console.log(`   League: ${ticket.league || 'Unknown'}`);
    if (ticket.homeTeam && ticket.awayTeam) {
      console.log(`   Teams: ${ticket.awayTeam} @ ${ticket.homeTeam}`);
    }
    if (ticket.section || ticket.row || ticket.seat) {
      console.log(`   Seat: Section ${ticket.section || '?'}, Row ${ticket.row || '?'}, Seat ${ticket.seat || '?'}`);
    }
    if (ticket.totalPrice) {
      console.log(`   Price: ${ticket.totalPrice}`);
    }
    console.log(`   Source: ${ticket.source}`);
    console.log(`   Confidence: ${(ticket.confidence * 100).toFixed(0)}%`);
    console.log('─'.repeat(80));
  });
}

async function main() {
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║           RESTUB TICKET SEARCH TEST                            ║');
  console.log('║   Testing 3-Phase Pipeline: SEARCH → VERIFY → DISPLAY          ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');

  // Phase 1: Search
  const emails = await testSearch();

  // Phase 2: Parse (would require session)
  // const tickets = await testParse(emails);

  // Phase 3: Display
  // displayResults(tickets);

  console.log('\nNote: Full test requires valid session cookie.');
  console.log('Set SESSION_COOKIE env var or test via browser.');
}

main().catch(console.error);
