'use client';

import { useSyncExternalStore } from 'react';

interface SceneBackgroundProps {
  imageSrc?: string;
  videoWebmSrc?: string;
  videoMp4Src?: string;
  altText?: string;
}

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  mediaQuery.addEventListener('change', callback);
  return () => mediaQuery.removeEventListener('change', callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getReducedMotionServerSnapshot() {
  return true; // Default to static poster during SSR to avoid hydration mismatch and autoplay flash
}

export function SceneBackground({
  imageSrc = '/landing/scene.jpg',
  videoWebmSrc = '/landing/scene.webm',
  videoMp4Src = '/landing/scene.mp4',
  altText = 'A warm, cozy study room with a chess board set mid-game on a wooden table, a friendly companion on the left holding coffee and an empty chair on the right inviting you to play.',
}: SceneBackgroundProps) {
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  return (
    <div className="absolute inset-0 z-0 h-full w-full overflow-hidden select-none">
      {/* Background Media: Video or Poster Image */}
      {!prefersReducedMotion ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={imageSrc}
          className="absolute inset-0 h-full w-full object-cover object-center"
          aria-hidden="true"
        >
          <source src={videoWebmSrc} type="video/webm" />
          <source src={videoMp4Src} type="video/mp4" />
          {/* Fallback image inside video element */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageSrc} alt={altText} className="h-full w-full object-cover object-center" />
        </video>
      ) : (
        /* Poster Image for SSR and reduced motion */
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={imageSrc}
          alt={altText}
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      )}

      {/* Atmospheric Warm Vignette & Gradient Overlays for High Contrast & Readability */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#140b07]/90 via-[#140b07]/20 to-[#140b07]/75"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(20,11,7,0.7)_100%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 backdrop-brightness-[0.92] backdrop-contrast-[1.03]"
        aria-hidden="true"
      />
    </div>
  );
}
