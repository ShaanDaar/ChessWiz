'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface PlayDashboardClientProps {
  userEmail: string;
  username: string;
  preferredPersona: string;
  ratingEstimate: number;
}

export function PlayDashboardClient({
  userEmail,
  username,
  preferredPersona,
  ratingEstimate,
}: PlayDashboardClientProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#140b07] text-[#fdfbf7] selection:bg-amber-500/30">
      {/* Authenticated Navigation Bar */}
      <header className="flex items-center justify-between border-b border-[#5a3a29]/40 bg-[#1f130b]/70 px-6 py-4 backdrop-blur-md">
        <Link
          href="/"
          className="flex items-center gap-2 text-amber-300 transition-colors hover:text-amber-200"
        >
          <span className="font-display flex h-8 w-8 items-center justify-center rounded-lg border border-amber-400/30 bg-amber-500/20 text-lg font-bold">
            ♞
          </span>
          <span className="font-display text-xl font-semibold tracking-wide text-[#fdfbf7]">
            Chessie
          </span>
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <div className="hidden flex-col text-right sm:flex">
            <span className="font-medium text-[#fdfbf7]">{username}</span>
            <span className="text-xs text-[#e6d7c3]/60">{userEmail}</span>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg border border-[#e6d7c3]/30 px-3.5 py-1.5 text-xs font-medium text-[#e6d7c3] transition-all hover:border-amber-400 hover:text-amber-300 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none sm:text-sm"
          >
            Log out
          </button>
        </div>
      </header>

      {/* Main Play Lounge */}
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 py-12">
        <div className="mb-10 space-y-4 text-center sm:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300">
            Companion Persona: <span className="font-semibold capitalize">{preferredPersona}</span>
          </span>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-[#fdfbf7] sm:text-5xl">
            Welcome, {username}.
          </h1>
          <p className="text-lg text-[#e6d7c3]/80">
            Your rating estimate is{' '}
            <span className="font-semibold text-amber-400">{ratingEstimate}</span>. The board is set
            and warm tea is waiting.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Link
            href="/game/new"
            className="group relative overflow-hidden rounded-2xl border border-[#5a3a29]/60 bg-[#23140e]/70 p-8 shadow-lg transition-all duration-300 hover:border-amber-500/50 hover:bg-[#2b1810] hover:shadow-[0_12px_30px_rgba(217,119,6,0.2)] focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-3xl">♟️</span>
              <span className="text-xs font-semibold tracking-wider text-amber-400 uppercase transition-transform group-hover:translate-x-1">
                Start Game &rarr;
              </span>
            </div>
            <h2 className="font-display mb-2 text-2xl font-semibold text-[#fdfbf7]">
              New Game vs Companion
            </h2>
            <p className="text-sm text-[#e6d7c3]/70">
              Sit across from your {preferredPersona} companion. Play with real-time reactive
              expressions and commentary.
            </p>
          </Link>

          <Link
            href="/review/latest"
            className="group relative overflow-hidden rounded-2xl border border-[#5a3a29]/60 bg-[#23140e]/70 p-8 shadow-lg transition-all duration-300 hover:border-amber-500/50 hover:bg-[#2b1810] hover:shadow-[0_12px_30px_rgba(217,119,6,0.2)] focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-3xl">📊</span>
              <span className="text-xs font-semibold tracking-wider text-amber-400 uppercase transition-transform group-hover:translate-x-1">
                Review &rarr;
              </span>
            </div>
            <h2 className="font-display mb-2 text-2xl font-semibold text-[#fdfbf7]">
              Game Review & Analysis
            </h2>
            <p className="text-sm text-[#e6d7c3]/70">
              Review your moves analyzed by Stockfish with the 10-tier move classification and
              persona debrief.
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
