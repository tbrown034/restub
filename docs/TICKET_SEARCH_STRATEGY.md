# Ticket Search Strategy

## Goal
Find EVERY possible sporting event ticket from Gmail, including:
- **Primary Leagues**: NFL, NBA, MLB, NHL, NASCAR, F1
- **Secondary**: College sports (NCAA), Minor League, MLS, WNBA
- **Other**: Concerts at stadiums, special events, international sports

---

## CRITICAL: False Positive vs False Negative Tradeoff

### Our Philosophy: LEAN TOWARD INCLUSION
**It's better to show a questionable ticket than to miss a real one.**

- Users can easily uncheck a false positive during import
- Users cannot recover a missed ticket (they don't know it exists)
- Missing memories is worse than extra cleanup work

---

## Architecture: 3-Phase Pipeline

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PHASE 1: SEARCH                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                  │
│  │   TIER 1    │  │   TIER 2    │  │   TIER 3    │                  │
│  │ Major Sites │  │ Team/League │  │   Other     │                  │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘                  │
│         │                │                │                          │
│         └────────────────┴────────────────┘                          │
│                          │                                           │
│              ┌───────────┴───────────┐                               │
│              │  Check BOTH paths:    │                               │
│              │  • FROM: (sender)     │                               │
│              │  • SUBJECT: keywords  │                               │
│              └───────────┬───────────┘                               │
│                          │                                           │
│              ┌───────────┴───────────┐                               │
│              │  Combine scores       │                               │
│              │  confidence >= 0.5    │──── Low score ──→ SKIP        │
│              └───────────┬───────────┘                               │
└──────────────────────────┼──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         PHASE 2: VERIFY                              │
│                                                                      │
│  For each candidate email:                                           │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  Remember: sender, subject                                   │    │
│  │  Read: email body                                            │    │
│  │                                                              │    │
│  │  Extract:                                                    │    │
│  │  • Teams (home vs away)                                      │    │
│  │  • Venue/Stadium                                             │    │
│  │  • Date & Time                                               │    │
│  │  • Seat info (section, row, seat) - if available            │    │
│  │  • Price paid - if available                                 │    │
│  │  • Order/confirmation number - if available                  │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                          │                                           │
│              ┌───────────┴───────────┐                               │
│              │  DEDUPLICATE          │                               │
│              │  Key: date + teams    │                               │
│              │  Keep: most complete  │                               │
│              └───────────┬───────────┘                               │
└──────────────────────────┼──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         PHASE 3: DISPLAY                             │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  Found X Sports Tickets                    [Import All]      │    │
│  ├─────────────────────────────────────────────────────────────┤    │
│  │  ☑ NFL | Bears vs Packers                                    │    │
│  │    Dec 25, 2025 | Soldier Field | Sec 100, Row 5            │    │
│  │    [🔍 AI Lookup] ← Fetches score, summary, link            │    │
│  ├─────────────────────────────────────────────────────────────┤    │
│  │  ☑ NBA | Bulls vs Lakers                                     │    │
│  │    Jan 5, 2026 | United Center | $150                        │    │
│  │    [🔍 AI Lookup]                                            │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  AI Lookup Feature:                                                  │
│  • Fetches game result (score) from reliable sports API/site        │
│  • Generates short game summary                                      │
│  • Provides link to box score/highlights                            │
└─────────────────────────────────────────────────────────────────────┘
```

---

## PHASE 1: SEARCH - Provider Tiers

### Tier 1: Major Resale Platforms (highest trust)
```javascript
const TIER_1 = [
  'ticketmaster.com',
  'stubhub.com',
  'seatgeek.com',
  'axs.com',
  'vividseats.com',
  'gametime.co',
];
```

### Tier 2: League & Team Official
```javascript
const TIER_2 = [
  // League apps
  'mlb.com', 'ballparkapp.com',
  'nba.com', 'nbatickets.com',
  'nfl.com',
  'nhl.com',
  'mlssoccer.com',
  // Team-specific (examples)
  'bulls.com', 'cubs.com', 'bears.com',
];
```

### Tier 3: Other/Specialty
```javascript
const TIER_3 = [
  // Motorsports
  'nascar.com', 'formula1.com', 'indycar.com',
  // College
  'paciolan.com', 'tickets.com', 'etix.com',
  // Minor league
  'milb.com', 'gleague.nba.com',
  // Other
  'eventbrite.com', 'tickpick.com', 'viagogo.com',
];
```

### Dual-Path Scoring

**Path A: Sender Score**
| Sender Domain | Score |
|--------------|-------|
| Tier 1 domain | +40 |
| Tier 2 domain | +30 |
| Tier 3 domain | +20 |
| Unknown | +0 |

**Path B: Subject Score**
| Subject Contains | Score |
|-----------------|-------|
| "your tickets" | +25 |
| "order confirmed" | +25 |
| "sent you tickets" | +30 |
| "confirmation" | +20 |
| "[Team] vs [Team]" | +15 |
| "section" or "row" | +15 |
| "$" + number | +10 |

**Combined Score**
```
finalScore = senderScore + subjectScore
if (finalScore >= 50) → VERIFY
if (finalScore >= 30 && senderScore > 0) → VERIFY
else → SKIP
```

---

## PHASE 2: VERIFY - Body Analysis

### What to Extract
```typescript
interface VerifiedTicket {
  // Required
  eventName: string;        // "Bears vs Packers"
  eventDate: string;        // "2025-12-25"

  // From sender/subject (remembered)
  source: string;           // "ticketmaster"
  emailSubject: string;

  // Extracted from body
  venue?: string;           // "Soldier Field"
  city?: string;            // "Chicago, IL"
  eventTime?: string;       // "7:00 PM"
  section?: string;         // "100"
  row?: string;             // "5"
  seat?: string;            // "12-14"
  quantity?: number;        // 2
  totalPrice?: string;      // "$300.00"
  orderNumber?: string;     // "TM-123456"

  // Metadata
  homeTeam?: string;
  awayTeam?: string;
  league?: string;          // "NFL" | "NBA" | "MLB" | etc.
  confidence: number;       // 0.0 - 1.0
}
```

### Deduplication Logic
```
Key = normalize(eventDate) + ":" + sort([homeTeam, awayTeam]).join("-")

If duplicate found:
  Keep ticket with higher completeness score
  Completeness = count of non-null fields
```

---

## PHASE 3: DISPLAY - AI Lookup Feature

### Per-Ticket AI Lookup Button
When clicked:
1. Takes: team names + date
2. Fetches: game result from reliable source (ESPN, sports-reference.com)
3. Returns:
   - Final score
   - Winner
   - 2-3 sentence game summary
   - Link to full box score

### Data Sources for AI Lookup
| Sport | Source | URL Pattern |
|-------|--------|-------------|
| NFL | ESPN | espn.com/nfl/game/_/gameId/{id} |
| NBA | ESPN | espn.com/nba/game/_/gameId/{id} |
| MLB | ESPN | espn.com/mlb/game/_/gameId/{id} |
| NHL | ESPN | espn.com/nhl/game/_/gameId/{id} |

### AI Lookup Response
```typescript
interface GameLookup {
  found: boolean;
  score?: string;           // "Bears 24, Packers 17"
  winner?: string;          // "Bears"
  summary?: string;         // "Justin Fields threw for 3 TDs..."
  boxScoreUrl?: string;     // Link to full stats
  highlightsUrl?: string;   // Link to video highlights
}
```

---

## Implementation Status

### Completed ✅
- [x] Basic 3-phase pipeline
- [x] Tier 1-3 provider list
- [x] Pre-filter scoring
- [x] AI body parsing with Claude
- [x] Deduplication by date+teams
- [x] Transfer detection
- [x] Minor league support
- [x] Dual-path scoring (sender + subject)
- [x] Progressive loading UI with cycling messages
- [x] Speed tracking (elapsed time display)
- [x] Marketing filter improvements
- [x] "Tickets Delivered", "Mobile Entry", "E-ticket" patterns

### In Progress 🔄
- [ ] AI Lookup feature for game results
- [ ] Investigating missing Cubs/Vikings tickets

### Planned 📋
- [ ] Batch queries for large provider lists
- [ ] User feedback loop (mark false positives)
- [ ] Historical accuracy tracking
- [ ] Async/streaming results for large inboxes

---

## Test Results Log

### Test 1: Initial Implementation
- **Date**: 2026-01-16
- **Emails found**: 22 candidates
- **Tickets parsed**: 5
- **Accuracy**: 40% (2/5 true positives)
- **True Positives**: Bears vs Packers (Dec 19), Bears vs Packers Wild Card (Jan 9)
- **False Positives**: Bulls at Pacers, Capitals at Blackhawks, Timberwolves at Bulls
- **Issue**: "Your event lineup" emails from Stubhub = bookmarks, not purchases

### Test 2: Added Marketing Filters
- **Date**: 2026-01-16
- **Emails found**: 11 candidates
- **Tickets parsed**: 4
- **Accuracy**: 50% (2/4 true positives)
- **Changes**: Added "still available", "password reset", "terms/privacy" filters
- **Result**: Removed 2 false positives but still have 2 remaining

### Test 3: Tightened Subject Scoring
- **Date**: 2026-01-16
- **Emails found**: 6 candidates
- **Tickets parsed**: 3
- **Accuracy**: ~67-100% (2-3/3 true positives)
- **Changes**:
  - "event lineup" score: +20 → 0 (unreliable)
  - "sent you tickets" score: +35 → +40 (transfers are reliable)
  - "view and save your tickets" score: +30 (Ticketmaster confirmations)
  - Require BOTH sender AND subject scores for lower threshold
- **True Positives**: Bears (Dec 19), Bears (Jan 9), possibly Windy City Bulls
- **Missing**: Bears vs Vikings (Sept 8), Cubs at Rockies (Aug 30-31)

### Test 4: Enhanced Coverage
- **Date**: 2026-01-16
- **Emails found**: 27
- **Tickets parsed**: 7 unique
- **Search time**: ~30s
- **True Positives Found**:
  - Bears Jan 2026 (Wild Card) ✅
  - Bears Dec 2025 (Packers) ✅
  - Bears Sep 2025 (Vikings) ✅ NEW!
  - Cubs at Rockies Aug 30-31 ✅ NEW!
  - Red Sox at Cubs Jul 19 ✅ NEW!
  - Windy City Bulls Dec 2025

### Test 5: Mobile Entry Pattern Fix
- **Date**: 2026-01-16
- **Emails found**: 30 (+3)
- **Tickets parsed**: 12 unique (+5)
- **Search time**: ~90s (AI parsing slower with more emails)
- **Confidence breakdown**: 3 high, 9 medium, 0 low
- **Changes**:
  - Added "Get into X with your phone" pattern (+35) for mobile entry
  - Added "with your phone" pattern (+20)
  - Updated AI prompt to recognize "View and Save Your Tickets"
  - Updated AI prompt confidence scoring for ticket delivery emails
- **Results**:
  - HIGH conf (3): All true positives with full seat/price/order info
  - MEDIUM conf (9): Mix - 3 Bears games true, 6 event lineup false positives
- **Issue**: "Event lineup" emails from Stubhub now passing AI but are FALSE POSITIVES

### Test 6: Event Lineup False Positive Fix ✅
- **Date**: 2026-01-16
- **Emails found**: 30
- **Tickets parsed**: 7 unique (-5 false positives!)
- **Search time**: ~100s
- **Confidence breakdown**: 4 high, 3 medium, 0 low
- **Changes**:
  - Updated AI prompt to flag "event lineup" as likely BOOKMARKS (0.3 conf)
  - Added CAUTION section distinguishing bookmarks from purchases
  - Strengthened rule: require order#/price/seat for 0.6+ confidence
- **Results**:
  - FALSE POSITIVES ELIMINATED: Bulls/Pacers, Bruins, Capitals, Timberwolves, 76ers all gone
  - TRUE POSITIVES KEPT: Bears x3, Cubs at Rockies x2, Red Sox at Cubs
  - **Accuracy: ~100% (all 7 are likely true positives)**

### Test 7: Expanded Search (Subject-Based + Team Domains) ✅
- **Date**: 2026-01-16
- **Emails found**: 36 (+6 from Test 6)
- **Tickets parsed**: 6 unique (-1 from Test 6)
- **Search time**: ~100s
- **Confidence breakdown**: 2 high, 4 medium, 0 low
- **Changes Made**:
  1. **Subject-based search added**: Catches emails with "order confirmed", "your tickets", etc.
  2. **Team domains added**: whitesox.com, steelers.com, braves.com, rockies.com, redsox.com
- **Results**:
  - Bears x3 (Jan 9, Dec 19, Sep 7) ✅
  - Cubs at Rockies x2 (Aug 30-31) ✅ with full seat/price details!
  - Red Sox at Cubs (Jul 18) ✅
  - Windy City Bulls → correctly rejected as bookmark (0.3 conf)
- **Key Debug Findings**:
  - "View and Save Your Tickets" body = "Your tickets are waiting for you" + zero-width chars
  - NO game details in email body - just a link to Ticketmaster
  - "Order Confirmed, Trevor" emails rejected at 0 - investigating
  - Sports card purchases (Willie Gault auto, etc.) correctly rejected
- **Still Missing**: Steelers, White Sox, Braves (emails not in search results)

### What Worked ✅
- Tiered sender scoring (Tier 1 = major resale = most reliable)
- Transfer detection ("sent you X tickets" pattern)
- "View and Save Your Tickets" pattern for Ticketmaster
- Marketing filters reducing false positives significantly
- Requiring both sender + subject scores
- "Tickets Delivered" pattern for delivery confirmations
- "Get into X with your phone" mobile entry pattern
- HIGH confidence = has order#, price, seat info = 100% accurate

### What Didn't Work ❌
- "Your event lineup" emails = often bookmarks, not purchases
- Team domain emails (cubs.com, bears.com) = mostly marketing newsletters
- Stubhub "event lineup" has high false positive rate

---

## Pattern Analysis: True vs False Positives

### TRUE POSITIVE Patterns (High Confidence)
Emails that are real ticket purchases share these characteristics:
1. **Order confirmation with details**
   - Has order number (e.g., "Order #nje4xdg")
   - Has price ($150.36, $331.56)
   - Has seat info (Section, Row, Seat)
2. **Ticket transfer notifications**
   - "KEITH A Just Sent You 1 Chicago Bears Tickets"
   - "Keith Brown has accepted their tickets in your party"
3. **Party/group tickets**
   - "You started the party for Boston Red Sox at Chicago Cubs!"
4. **Mobile entry confirmations**
   - "Get into Boston Red Sox at Chicago Cubs with your phone!"

### FALSE POSITIVE Patterns (Medium/Low Confidence)
Emails that look like tickets but aren't:
1. **"Your event lineup" emails**
   - Subject: "Your event lineup: Boston Bruins at Chicago Blackhawks"
   - Source: Stubhub
   - These are BOOKMARKS/WISHLIST, not purchases!
2. **Game reminder emails without ticket proof**
   - "Chicago Cubs: 6 days until next game!"
   - No order number, no seat info
3. **Marketing disguised as confirmations**
   - Has team names but no purchase details

### Key Differentiators
| Attribute | True Positive | False Positive |
|-----------|---------------|----------------|
| Order # | YES | NO |
| Price | YES | NO |
| Seat info | USUALLY | NO |
| Subject pattern | "Sent you tickets", "tickets confirmed" | "event lineup", "upcoming" |
| Source | Ticketmaster transfer, SeatGeek | Stubhub marketing |

### Needs Investigation 🔍

**Problem: "View and Save Your Tickets" emails returning confidence 0**
- These are real Ticketmaster confirmations (score 110)
- But AI returns confidence 0 - WHY?
- Likely cause: Email body contains only a "View tickets" link, no actual game details
- The game info is in Ticketmaster's system, not in the email text
- **Impact**: Missing tickets may be hidden in these emails

**Missing tickets to find:**
- Bears vs Steelers (Nov 23, 2025) - Not in logs, may be in "View and Save" email
- White Sox at Cubs (May 16, 2025) - "Crosstown Classic" - Not in logs
- Braves at Cubs (May 23, 2024) - ~20 months ago, within 2yr window

**Possible causes:**
1. Different ticket provider (added team domains in Test 7)
2. Tickets in generic "View and Save" emails with no body content
3. Purchased through team website with marketing-like subject
4. Email sender domain not in our list

---

## User Confirmed Games (Ground Truth)

This is the complete list of games the user confirms they attended, for testing accuracy.

### NFL Games (Bears)
| Date | Matchup | Venue | Status |
|------|---------|-------|--------|
| Dec 19, 2025 | Bears vs Packers | Soldier Field | Found ✅ (Test 6) |
| Jan 9, 2026 | Bears vs Packers (Wild Card) | Soldier Field | Found ✅ (Test 6) |
| Sept 8, 2025 | Bears vs Vikings | Soldier Field | Found ✅ (Test 6) |
| Nov 23, 2025 | Bears vs Steelers | Soldier Field | Missing ❓ (Not in logs, Test 7 pending) |

### MLB Games (Cubs)
| Date | Matchup | Venue | Price | Seats | Status |
|------|---------|-------|-------|-------|--------|
| Aug 30, 2025 | Cubs at Rockies (Game 1) | Coors Field | - | - | Found ✅ (Test 6) |
| Aug 31, 2025 | Cubs at Rockies (Game 2) | Coors Field | - | - | Found ✅ (Test 6) |
| Jul 19, 2025 | Red Sox at Cubs | Wrigley Field | $331.56 | Sec 312L, Row 2, Seat 10 | Found ✅ (Test 6) |
| May 16, 2025 | White Sox at Cubs | Wrigley Field | $230.76 | Sec 202, Row 1, Seat 5 | Missing ❓ (Test 7 pending) |
| May 23, 2024 | Braves at Cubs | Wrigley Field | $111.60 | Sec 323R, Row 1, Seats 18-19 | Missing ❓ (Test 7 pending) |
| Jun 2, 2021 | Padres at Cubs | Wrigley Field | $319.41 | Sec 218, Row 18 | Outside 2yr window |

### Other Sports (Historical - Outside 2yr Window)
All from Ticketmaster (order format confirms):

**2018:**
| Date | Event | Venue | Details |
|------|-------|-------|---------|
| Dec 17, 2018 | Bulls at OKC Thunder | Chesapeake Arena | Loft 302, Row L, Seat 41 - $20.68 |
| Mar 30, 2018 | OKC Thunder vs Denver Nuggets | Paycom Center | Order #3000-0095-2731-2194-2 |
| Jan 4, 2018 | Jason Isbell and the 400 Unit | The Criterion | Order #59-42047/AGF |

**2017:**
| Date | Event | Venue | Order # |
|------|-------|-------|---------|
| Jul 22, 2017 | CONCACAF Gold Cup Semifinal | AT&T Stadium | 13-35288/DAL |
| Jul 4, 2017 | OKC Dodgers vs Iowa Cubs | Chickasaw Bricktown Ballpark | 34-17732/DAL |
| May 13, 2017 | Oklahoma Craft Beer Festival | Cox Convention Center | 31-22402/DAL |

**Older:**
- Bulls game (5-10 years ago)
- OKC Energy (several years ago)

**Key Insight**: User is a Ticketmaster customer - most historical tickets are from TM.

### Success Metrics Target
- **2025-2026 games**: Should find 9+ tickets (4 NFL + 5 MLB)
- **Accuracy goal**: >90% true positive rate
- **Current status (Test 6)**: 7/9 found (78%), 100% accuracy on found tickets
- **Still missing**: Bears vs Steelers (Nov 23), White Sox at Cubs (May 16), Braves at Cubs (May 2024)
- **Confidence display**: High (0.8+), Medium (0.6-0.8), Low (0.4-0.6)

---

## Scalability & Future Expansion

### Design Principles (KISS)
1. **Modular Provider Lists**: Easy to add new providers
2. **Configurable Scoring**: Weights can be tuned per category
3. **Reusable Patterns**: Same pipeline works for different ticket types
4. **Transparent Logic**: Scoring is explainable ("sender=40, subject=30, total=70")

### Future Ticket Types (Reusable Architecture)
| Category | Example Providers | Pattern Adjustments |
|----------|------------------|---------------------|
| Concerts | Ticketmaster, AXS, Bandsintown | Same scoring, different keywords |
| Movies | Fandango, AMC, Regal | Add movie keywords |
| Theater | Broadway.com, Telecharge | Add show/theater keywords |
| Travel | Airlines, Hotels | New provider tier |
| Events | Eventbrite, Meetup | Lower confidence threshold |

### Expansion Process
1. Add providers to appropriate tier
2. Add category-specific subject keywords
3. Update AI prompt for new ticket types
4. Test with user samples
5. Document patterns that work/fail

---

## UX Improvements Needed

### Progressive Loading (for large inboxes)
```
Phase 1: "Searching Ticketmaster..." (show count)
Phase 2: "Searching StubHub..." (show count)
Phase 3: "Analyzing 15 potential tickets..."
Phase 4: "Found 5 sports tickets!" (show results)
```

### Visual Delight During Wait
- Provider logos appearing as searched
- Running count of emails scanned
- Estimated time remaining
- Fun facts about sports while waiting

### Speed Tracking
- Log time for: search, parse each email, total
- Display to user: "Scanned 100 emails in 8.2 seconds"
- Identify bottlenecks for optimization

---

## Email Pattern Reference

### VALID (capture with confidence 0.5+)
| Pattern | Confidence |
|---------|------------|
| Order confirmation with number | 0.9 |
| Ticket transfer notification | 0.7 |
| "Your event lineup: Team vs Team" | 0.6 |
| Mobile entry / QR code delivery | 0.7 |
| MLB Ballpark party invite | 0.6 |

### INVALID (reject)
| Pattern | Reason |
|---------|--------|
| "Tickets Still Available!" | Marketing |
| "Don't miss [Team]" | Marketing |
| "X% off" / "Promo code" | Promotional |
| Password reset | Account email |
| Newsletter with multiple events | Not a ticket |
