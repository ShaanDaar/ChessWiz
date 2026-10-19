/**
 * Pure functions for Route Authentication Guard.
 *
 * Protected paths:
 * - /play
 * - /game/*
 * - /review/*
 *
 * Auth paths:
 * - /login
 * - /register
 */

const PROTECTED_PREFIXES = ['/play', '/game', '/review'] as const;
const AUTH_PREFIXES = ['/login', '/register'] as const;

/**
 * Determines whether a pathname requires authentication.
 */
export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/**
 * Determines whether a pathname is an authentication page (login/register).
 */
export function isAuthRoute(pathname: string): boolean {
  return AUTH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

/**
 * Calculates redirect target based on authentication state and requested route.
 *
 * Rules:
 * 1. Unauthenticated users trying to access protected routes are redirected to /login?returnTo=...
 * 2. Authenticated users trying to access /login or /register are redirected to returnTo or /play
 * 3. All other routes require no redirect (returns null).
 */
export function getAuthRedirect(
  pathname: string,
  isAuthenticated: boolean,
  returnTo?: string | null,
): string | null {
  if (!isAuthenticated && isProtectedRoute(pathname)) {
    const encodedReturn = encodeURIComponent(pathname);
    return `/login?returnTo=${encodedReturn}`;
  }

  if (isAuthenticated && isAuthRoute(pathname)) {
    if (
      returnTo &&
      returnTo.startsWith('/') &&
      !returnTo.startsWith('//') &&
      !isAuthRoute(returnTo)
    ) {
      return returnTo;
    }
    return '/play';
  }

  return null;
}
