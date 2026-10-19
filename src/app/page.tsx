import Link from 'next/link';
import { SceneBackground } from '@/components/landing/SceneBackground';

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden selection:bg-amber-500/30 selection:text-white">
      {/* Skip to Main Content for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-amber-400 focus:px-4 focus:py-2.5 focus:font-semibold focus:text-stone-950 focus:shadow-lg focus:ring-2 focus:ring-amber-300 focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Atmospheric Full-Screen Scene Media Layer */}
      <SceneBackground />

      {/* Top Header & Navigation */}
      <header
        role="banner"
        className="relative z-10 flex w-full items-center justify-between px-6 py-6 sm:px-10 sm:py-8 lg:px-14"
      >
        {/* Brand / Logo */}
        <Link
          href="/"
          className="group text-cozy-parchment flex items-center gap-2.5 rounded-lg px-2 py-1 transition duration-200 hover:text-amber-300 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#140b07] focus-visible:outline-none"
          aria-label="Chessie Home"
        >
          <span
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-400/30 bg-amber-500/20 text-amber-300 shadow-inner transition-all duration-200 group-hover:scale-105 group-hover:border-amber-400"
            aria-hidden="true"
          >
            {/* Chess Knight Icon */}
            <svg
              className="h-5 w-5 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M19.5 21a.75.75 0 0 1-.75.75H5.25a.75.75 0 0 1 0-1.5h13.5a.75.75 0 0 1 .75.75zm-2.45-3.08-1.07-2.68c-.12-.3-.38-.52-.7-.59l-1.95-.44a.75.75 0 0 1-.58-.73v-.53c0-.3.18-.58.46-.7l2.84-1.22c.98-.42 1.45-1.54 1.07-2.54l-.45-1.18c-.28-.75-.95-1.27-1.74-1.37l-1.3-.16a7.2 7.2 0 0 0-2.33.27l-.63.17c-.38.1-.78-.05-.98-.38l-.68-1.14a2.25 2.25 0 0 0-1.93-1.09h-.18a2.25 2.25 0 0 0-2.25 2.25v2.42c0 .6.24 1.17.66 1.6l1.24 1.24c.26.26.4.61.4.98v1.36c0 .32-.14.63-.39.84l-1.23 1.03c-.49.4-.77 1.01-.77 1.65v.5c0 .41.34.75.75.75h10.9c.41 0 .76-.3.8-.71z" />
            </svg>
          </span>
          <span className="font-display text-2xl font-semibold tracking-wide text-[#fdfbf7] drop-shadow-sm">
            Chessie
          </span>
        </Link>

        {/* Top-Right Navigation: Log in & Register now */}
        <nav aria-label="Account Navigation" className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-lg border border-[#e6d7c3]/30 bg-[#140b07]/40 px-4 py-2 text-sm font-medium text-[#fdfbf7] backdrop-blur-md transition-all duration-200 hover:border-amber-400/70 hover:bg-[#140b07]/70 hover:text-amber-300 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#140b07] focus-visible:outline-none active:scale-95 sm:px-5 sm:py-2.5 sm:text-base"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 px-4 py-2 text-sm font-semibold text-[#140b07] shadow-lg shadow-amber-900/30 transition-all duration-200 hover:from-amber-400 hover:to-amber-300 hover:shadow-amber-500/30 focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#140b07] focus-visible:outline-none active:scale-95 sm:px-5 sm:py-2.5 sm:text-base"
          >
            Register now
          </Link>
        </nav>
      </header>

      {/* Center Hero Content: "Wanna play?" Overlay */}
      <main
        id="main-content"
        className="relative z-10 my-auto flex flex-col items-center justify-center px-6 py-8 text-center sm:py-12"
      >
        <div className="max-w-3xl space-y-3 sm:space-y-4">
          <h1 className="font-display text-5xl font-medium tracking-tight text-[#fdfbf7] drop-shadow-[0_4px_16px_rgba(20,11,7,0.9)] sm:text-6xl md:text-7xl lg:text-8xl">
            Wanna play?
          </h1>
          <p className="font-sans text-lg font-normal tracking-wide text-[#f4ecdf]/90 drop-shadow-[0_2px_8px_rgba(20,11,7,0.8)] sm:text-xl md:text-2xl">
            Let&apos;s have a game?
          </p>
        </div>
      </main>

      {/* Bottom Center: Large Play Button with Subtle Pulse */}
      <footer
        role="contentinfo"
        className="relative z-10 flex flex-col items-center justify-center px-6 pb-10 sm:pb-14 md:pb-16"
      >
        <Link
          id="play-button"
          href="/game"
          className="group font-display relative inline-flex min-w-[200px] animate-[pulse-subtle_3s_cubic-bezier(0.4,0,0.6,1)_infinite] items-center justify-center gap-3 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 px-8 py-4 text-2xl font-semibold text-[#140b07] shadow-[0_12px_36px_-4px_rgba(217,119,6,0.65),0_0_30px_6px_rgba(245,158,11,0.35)] transition-all duration-300 hover:scale-105 hover:shadow-[0_18px_48px_-4px_rgba(217,119,6,0.85),0_0_50px_10px_rgba(245,158,11,0.55)] focus-visible:ring-4 focus-visible:ring-amber-300 focus-visible:ring-offset-4 focus-visible:ring-offset-[#140b07] focus-visible:outline-none active:scale-95 motion-reduce:animate-none sm:min-w-[240px] sm:px-12 sm:py-5 sm:text-3xl"
        >
          <span>Play</span>
          <svg
            className="h-6 w-6 fill-current transition-transform duration-200 group-hover:translate-x-1 sm:h-7 sm:w-7"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M5.536 21.886a1.004 1.004 0 0 1-.77-.364 1.007 1.007 0 0 1-.23-.84l1.242-6.208-4.512-4.398a1.002 1.002 0 0 1 .555-1.71l6.233-.906 2.788-5.648a1.006 1.006 0 0 1 1.802 0l2.788 5.648 6.233.906a1.002 1.002 0 0 1 .555 1.71l-4.512 4.398 1.242 6.208a1.007 1.007 0 0 1-1.462 1.062L12 18.898l-5.578 2.932a1.008 1.008 0 0 1-.886.056z" />
          </svg>
        </Link>
      </footer>
    </div>
  );
}
