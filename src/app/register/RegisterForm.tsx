'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function RegisterForm() {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/play';

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [persona, setPersona] = useState('coach');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username.trim(),
            preferred_persona: persona,
          },
        },
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      // Check if session was returned immediately (auto-confirm)
      if (data.session) {
        const safeReturnTo =
          returnTo.startsWith('/') && !returnTo.startsWith('//') ? returnTo : '/play';
        window.location.href = safeReturnTo;
      } else {
        setSuccessMsg(
          'Registration successful! Please check your email inbox to confirm your account.',
        );
        setLoading(false);
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'An unexpected error occurred.');
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg('');
    try {
      const safeReturnTo =
        returnTo.startsWith('/') && !returnTo.startsWith('//') ? returnTo : '/play';
      const redirectTo = `${window.location.origin}/auth/callback?returnTo=${encodeURIComponent(safeReturnTo)}`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
        },
      });

      if (error) {
        setErrorMsg(error.message);
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to initiate Google sign-in.');
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#140b07] px-4 py-12 text-[#fdfbf7] selection:bg-amber-500/30">
      {/* Ambient background glow */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,119,6,0.12)_0%,transparent_70%)]"
        aria-hidden="true"
      />

      {/* Brand Header */}
      <div className="relative z-10 mb-8 text-center">
        <Link
          href="/"
          className="text-cozy-parchment inline-flex items-center gap-2.5 rounded-lg px-2 py-1 transition duration-200 hover:text-amber-300 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
          aria-label="Chessie Home"
        >
          <span
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-400/30 bg-amber-500/20 text-amber-300 shadow-inner"
            aria-hidden="true"
          >
            <svg
              className="h-5 w-5 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M19.5 21a.75.75 0 0 1-.75.75H5.25a.75.75 0 0 1 0-1.5h13.5a.75.75 0 0 1 .75.75zm-2.45-3.08-1.07-2.68c-.12-.3-.38-.52-.7-.59l-1.95-.44a.75.75 0 0 1-.58-.73v-.53c0-.3.18-.58.46-.7l2.84-1.22c.98-.42 1.45-1.54 1.07-2.54l-.45-1.18c-.28-.75-.95-1.27-1.74-1.37l-1.3-.16a7.2 7.2 0 0 0-2.33.27l-.63.17c-.38.1-.78-.05-.98-.38l-.68-1.14a2.25 2.25 0 0 0-1.93-1.09h-.18a2.25 2.25 0 0 0-2.25 2.25v2.42c0 .6.24 1.17.66 1.6l1.24 1.24c.26.26.4.61.4.98v1.36c0 .32-.14.63-.39.84l-1.23 1.03c-.49.4-.77 1.01-.77 1.65v.5c0 .41.34.75.75.75h10.9c.41 0 .76-.3.8-.71z" />
            </svg>
          </span>
          <span className="font-display text-2xl font-semibold tracking-wide text-[#fdfbf7]">
            Chessie
          </span>
        </Link>
      </div>

      {/* Cozy Auth Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-[#5a3a29]/40 bg-[#23140e]/80 p-8 shadow-[0_16px_40px_-8px_rgba(20,11,7,0.7)] backdrop-blur-xl">
        <h1 className="font-display mb-2 text-center text-3xl font-semibold tracking-tight text-[#fdfbf7]">
          Pull up a chair
        </h1>
        <p className="mb-6 text-center font-sans text-sm text-[#e6d7c3]/80">
          Create an account to track your progress and play with your companion.
        </p>

        {errorMsg && (
          <div
            role="alert"
            className="mb-6 rounded-lg border border-red-500/40 bg-red-950/40 p-3.5 text-sm text-red-200 shadow-sm"
          >
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div
            role="status"
            className="mb-6 rounded-lg border border-emerald-500/40 bg-emerald-950/40 p-3.5 text-sm text-emerald-200 shadow-sm"
          >
            {successMsg}
          </div>
        )}

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-[#e6d7c3]/30 bg-[#140b07]/50 px-4 py-2.5 text-sm font-medium text-[#fdfbf7] shadow-sm transition-all duration-200 hover:border-amber-400/60 hover:bg-[#140b07]/80 hover:text-amber-200 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#23140e] focus-visible:outline-none active:scale-[0.99]"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 12s.7 2.3 1.9 4.7l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
            />
          </svg>
          <span>Register with Google</span>
        </button>

        {/* Divider */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="w-full border-t border-[#5a3a29]/50" />
          <span className="relative bg-[#23140e] px-3 font-sans text-xs tracking-wider text-[#e6d7c3]/60 uppercase">
            Or with email
          </span>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="username" className="mb-1.5 block text-xs font-medium text-[#e6d7c3]">
              Player username
            </label>
            <input
              id="username"
              type="text"
              required
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. PawnMaster"
              className="w-full rounded-lg border border-[#5a3a29] bg-[#140b07]/70 px-3.5 py-2.5 text-sm text-[#fdfbf7] placeholder-[#e6d7c3]/40 transition-colors focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="reg-email" className="mb-1.5 block text-xs font-medium text-[#e6d7c3]">
              Email address
            </label>
            <input
              id="reg-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-[#5a3a29] bg-[#140b07]/70 px-3.5 py-2.5 text-sm text-[#fdfbf7] placeholder-[#e6d7c3]/40 transition-colors focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="reg-password"
              className="mb-1.5 block text-xs font-medium text-[#e6d7c3]"
            >
              Password
            </label>
            <input
              id="reg-password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full rounded-lg border border-[#5a3a29] bg-[#140b07]/70 px-3.5 py-2.5 text-sm text-[#fdfbf7] placeholder-[#e6d7c3]/40 transition-colors focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="persona" className="mb-1.5 block text-xs font-medium text-[#e6d7c3]">
              Preferred Companion Persona
            </label>
            <select
              id="persona"
              value={persona}
              onChange={(e) => setPersona(e.target.value)}
              className="w-full rounded-lg border border-[#5a3a29] bg-[#140b07]/70 px-3.5 py-2.5 text-sm text-[#fdfbf7] transition-colors focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none"
            >
              <option value="coach">Coach (Constructive & Focused)</option>
              <option value="friend">Friend (Warm & Casual banter)</option>
              <option value="teacher">Teacher (Gentle & Educational)</option>
              <option value="parent">Parent (Nurturing & Patient)</option>
              <option value="rival">Rival (Spirited & Competitive)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 px-4 py-2.5 text-sm font-semibold text-[#140b07] shadow-lg shadow-amber-900/30 transition-all duration-200 hover:from-amber-400 hover:to-amber-300 focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#23140e] focus-visible:outline-none active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-stone-950 border-t-transparent" />
                Creating account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Switch to Login */}
        <p className="mt-6 text-center text-xs text-[#e6d7c3]/70">
          Already have an account?{' '}
          <Link
            href={`/login?returnTo=${encodeURIComponent(returnTo)}`}
            className="rounded font-semibold text-amber-400 transition-colors hover:text-amber-300 hover:underline focus-visible:ring-1 focus-visible:ring-amber-400 focus-visible:outline-none"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
