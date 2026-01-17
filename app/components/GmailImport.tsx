'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import type { ParsedTicket } from '../api/gmail/parse/route';
import type { TicketEmail } from '../api/gmail/search/route';
import { saveGame } from '../assist/actions';
import type { SavedGame } from '@/lib/types';

type ImportStep = 'connect' | 'searching' | 'parsing' | 'review' | 'importing' | 'complete';

export function GmailImport() {
  const { data: session, status } = useSession();
  const [step, setStep] = useState<ImportStep>('connect');
  const [tickets, setTickets] = useState<ParsedTicket[]>([]);
  const [selectedTickets, setSelectedTickets] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [importedCount, setImportedCount] = useState(0);
  const [searchMessageIndex, setSearchMessageIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Cycle through search messages and track elapsed time
  useEffect(() => {
    if (step === 'searching' || step === 'parsing') {
      setElapsedSeconds(0);

      // Message cycling interval
      const messageInterval = setInterval(() => {
        setSearchMessageIndex(prev => (prev + 1) % 6);
      }, 2000);

      // Elapsed time counter
      const timeInterval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);

      return () => {
        clearInterval(messageInterval);
        clearInterval(timeInterval);
      };
    }
  }, [step]);

  const handleConnect = async () => {
    await signIn('google', { callbackUrl: '/profile' });
  };

  const handleDisconnect = async () => {
    await signOut({ callbackUrl: '/profile' });
  };

  const handleSearch = async () => {
    setError(null);
    setStep('searching');

    try {
      const response = await fetch('/api/gmail/search');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to search emails');
      }

      if (data.count === 0) {
        setError('No ticket confirmation emails found in the last 2 years.');
        setStep('connect');
        return;
      }

      // Now parse the emails
      setStep('parsing');
      setProgress({ current: 0, total: data.count });

      const parseResponse = await fetch('/api/gmail/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emails: data.emails.map((e: TicketEmail) => ({
            id: e.id,
            subject: e.subject,
            date: e.date,
            body: e.body,
            source: e.source,
          })),
        }),
      });

      const parseData = await parseResponse.json();

      if (!parseResponse.ok) {
        throw new Error(parseData.error || 'Failed to parse emails');
      }

      if (parseData.count === 0) {
        setError('No sports tickets found in your emails. Only concerts or other events were detected.');
        setStep('connect');
        return;
      }

      setTickets(parseData.tickets);
      // Select all by default
      setSelectedTickets(new Set(parseData.tickets.map((t: ParsedTicket) => t.emailId)));
      setStep('review');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setStep('connect');
    }
  };

  const toggleTicket = (emailId: string) => {
    const newSelected = new Set(selectedTickets);
    if (newSelected.has(emailId)) {
      newSelected.delete(emailId);
    } else {
      newSelected.add(emailId);
    }
    setSelectedTickets(newSelected);
  };

  const handleImport = async () => {
    setStep('importing');
    setProgress({ current: 0, total: selectedTickets.size });

    const ticketsToImport = tickets.filter(t => selectedTickets.has(t.emailId));
    let imported = 0;

    for (const ticket of ticketsToImport) {
      try {
        const game: SavedGame = {
          id: crypto.randomUUID(),
          league: ticket.league || 'other',
          homeTeam: ticket.homeTeam || ticket.eventName,
          awayTeam: ticket.awayTeam || '',
          date: ticket.eventDate,
          venue: `${ticket.venue}, ${ticket.city}`,
          description: `Imported from ${ticket.source}. ${ticket.section ? `Section ${ticket.section}` : ''} ${ticket.row ? `Row ${ticket.row}` : ''} ${ticket.seat ? `Seat ${ticket.seat}` : ''}`.trim(),
          gameDetails: ticket.orderNumber ? `Order #${ticket.orderNumber}` : undefined,
          sourceUrl: undefined,
          sourceName: ticket.source,
          savedAt: new Date().toISOString(),
        };

        await saveGame(game);
        imported++;
        setProgress({ current: imported, total: ticketsToImport.length });
      } catch (err) {
        console.error('Failed to import ticket:', err);
      }
    }

    setImportedCount(imported);
    setStep('complete');

    // Trigger refresh
    window.dispatchEvent(new Event('restub-game-added'));
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const getLeagueBadgeColor = (league?: string) => {
    const colors: Record<string, string> = {
      NFL: 'bg-blue-500',
      NBA: 'bg-orange-500',
      MLB: 'bg-green-500',
      NHL: 'bg-purple-500',
      NCAA: 'bg-red-500',
      MLS: 'bg-emerald-500',
    };
    return colors[league || ''] || 'bg-gray-500';
  };

  // Not authenticated
  if (status === 'loading') {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center gap-3">
          <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-600 dark:text-gray-400">Loading...</span>
        </div>
      </div>
    );
  }

  // Connect step
  if (step === 'connect') {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
            <svg className="w-6 h-6 text-red-600 dark:text-red-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Import from Gmail</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Auto-detect tickets from StubHub, Ticketmaster, SeatGeek & more
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {session ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-green-700 dark:text-green-400">
                Connected as {session.user?.email}
              </span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSearch}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Scan for Tickets
              </button>
              <button
                onClick={handleDisconnect}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Disconnect
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleConnect}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="font-medium text-gray-700 dark:text-gray-300">Connect Gmail</span>
          </button>
        )}

        <p className="mt-4 text-xs text-gray-500 dark:text-gray-500 text-center">
          Read-only access. We only search for ticket confirmation emails.
        </p>
      </div>
    );
  }

  // Searching/Parsing step - Enhanced Progressive Loading
  if (step === 'searching' || step === 'parsing') {
    const searchProviders = [
      { name: 'Ticketmaster', color: 'bg-blue-500' },
      { name: 'StubHub', color: 'bg-purple-500' },
      { name: 'SeatGeek', color: 'bg-green-500' },
      { name: 'MLB Ballpark', color: 'bg-red-500' },
      { name: 'NFL', color: 'bg-blue-700' },
    ];

    const searchMessages = [
      'Checking Ticketmaster confirmations...',
      'Scanning StubHub purchases...',
      'Looking for SeatGeek tickets...',
      'Searching league apps...',
      'Finding ticket transfers...',
      'Almost there...',
    ];

    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          {/* Animated Provider Icons */}
          <div className="flex justify-center gap-2 mb-4">
            {searchProviders.map((provider, idx) => (
              <div
                key={provider.name}
                className={`w-3 h-3 rounded-full ${provider.color} animate-pulse`}
                style={{ animationDelay: `${idx * 150}ms` }}
                title={provider.name}
              />
            ))}
          </div>

          {/* Dual-ring Spinner */}
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-700 rounded-full" />
            <div className="absolute inset-0 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <div className="absolute inset-2 border-4 border-orange-300 border-b-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          </div>

          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            {step === 'searching' ? 'Searching your inbox...' : 'Analyzing tickets...'}
          </h3>

          {/* Dynamic Progress Message - uses state-based cycling */}
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 h-5 transition-all duration-300">
            {step === 'searching' ? searchMessages[searchMessageIndex] : `Found ${progress.total} emails, parsing for sports tickets...`}
          </p>

          {/* Shimmer Progress Bar - always visible during search/parse */}
          <div className="mt-3">
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-500 relative overflow-hidden"
                style={{
                  width: step === 'parsing'
                    ? '80%'
                    : `${Math.min(70, 20 + (searchMessageIndex * 10))}%`
                }}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              {step === 'searching'
                ? `Searching 30+ ticket providers...`
                : `Scanning ${progress.total} potential ticket emails`}
            </p>
          </div>

          {/* Provider Status Pills */}
          {step === 'searching' && (
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {searchProviders.map((provider, idx) => (
                <span
                  key={provider.name}
                  className={`text-xs px-2 py-1 rounded-full transition-all duration-300 ${
                    idx === searchMessageIndex % searchProviders.length
                      ? `${provider.color} text-white`
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {provider.name}
                </span>
              ))}
            </div>
          )}

          {/* Elapsed Time Display */}
          {elapsedSeconds > 0 && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
              {elapsedSeconds}s elapsed
            </p>
          )}
        </div>
      </div>
    );
  }

  // Review step
  if (step === 'review') {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Found {tickets.length} Sports Tickets
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {selectedTickets.size} selected for import
            </p>
          </div>
          <button
            onClick={() => setStep('connect')}
            className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Cancel
          </button>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto mb-4">
          {tickets.map((ticket) => (
            <label
              key={ticket.emailId}
              className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                selectedTickets.has(ticket.emailId)
                  ? 'bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-300 dark:border-orange-700'
                  : 'bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedTickets.has(ticket.emailId)}
                onChange={() => toggleTicket(ticket.emailId)}
                className="mt-1 w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  {ticket.league && (
                    <span className={`px-2 py-0.5 text-xs font-bold text-white rounded ${getLeagueBadgeColor(ticket.league)}`}>
                      {ticket.league}
                    </span>
                  )}
                  <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    via {ticket.source}
                  </span>
                  {/* Confidence indicator */}
                  <span className={`ml-auto px-1.5 py-0.5 text-xs rounded ${
                    ticket.confidence >= 0.8
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : ticket.confidence >= 0.6
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}>
                    {ticket.confidence >= 0.8 ? 'High' : ticket.confidence >= 0.6 ? 'Med' : 'Low'} conf
                  </span>
                </div>
                <p className="font-medium text-gray-900 dark:text-white truncate">
                  {ticket.eventName}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(ticket.eventDate)}{ticket.eventTime ? ` at ${ticket.eventTime}` : ''} - {ticket.venue}
                </p>
                {(ticket.section || ticket.row || ticket.seat || ticket.totalPrice) && (
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {[
                      ticket.section && `Sec ${ticket.section}`,
                      ticket.row && `Row ${ticket.row}`,
                      ticket.seat && `Seat ${ticket.seat}`,
                      ticket.totalPrice && `${ticket.totalPrice}`,
                    ].filter(Boolean).join(' / ')}
                  </p>
                )}
                {ticket.orderNumber && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Order #{ticket.orderNumber}
                  </p>
                )}
              </div>
            </label>
          ))}
        </div>

        {/* Confidence summary */}
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600 dark:text-gray-400">Verification Summary</span>
            <div className="flex gap-3">
              <span className="text-green-600 dark:text-green-400">
                {tickets.filter(t => t.confidence >= 0.8).length} high
              </span>
              <span className="text-yellow-600 dark:text-yellow-400">
                {tickets.filter(t => t.confidence >= 0.6 && t.confidence < 0.8).length} medium
              </span>
              <span className="text-gray-500">
                {tickets.filter(t => t.confidence < 0.6).length} low
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleImport}
          disabled={selectedTickets.size === 0}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Import {selectedTickets.size} Game{selectedTickets.size !== 1 ? 's' : ''}
        </button>
      </div>
    );
  }

  // Importing step
  if (step === 'importing') {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            Importing games...
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {progress.current} of {progress.total} complete
          </p>
          <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500 transition-all duration-300"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Complete step
  if (step === 'complete') {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            Import Complete!
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Successfully imported {importedCount} game{importedCount !== 1 ? 's' : ''} from your email
          </p>
          <button
            onClick={() => {
              setStep('connect');
              setTickets([]);
              setSelectedTickets(new Set());
            }}
            className="px-4 py-2 text-sm text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
          >
            Import More
          </button>
        </div>
      </div>
    );
  }

  return null;
}
