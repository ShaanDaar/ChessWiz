import { describe, it, expect } from 'vitest';
import { isProtectedRoute, isAuthRoute, getAuthRedirect } from '../authGuard';

describe('Auth Guard Logic', () => {
  describe('isProtectedRoute', () => {
    it('identifies /play and its subpaths as protected', () => {
      expect(isProtectedRoute('/play')).toBe(true);
      expect(isProtectedRoute('/play/casual')).toBe(true);
      expect(isProtectedRoute('/play/ranked')).toBe(true);
    });

    it('identifies /game and its subpaths as protected', () => {
      expect(isProtectedRoute('/game')).toBe(true);
      expect(isProtectedRoute('/game/12345')).toBe(true);
      expect(isProtectedRoute('/game/live/abc')).toBe(true);
    });

    it('identifies /review and its subpaths as protected', () => {
      expect(isProtectedRoute('/review')).toBe(true);
      expect(isProtectedRoute('/review/session-xyz')).toBe(true);
      expect(isProtectedRoute('/review/report/999')).toBe(true);
    });

    it('identifies public routes as unprotected', () => {
      expect(isProtectedRoute('/')).toBe(false);
      expect(isProtectedRoute('/login')).toBe(false);
      expect(isProtectedRoute('/register')).toBe(false);
      expect(isProtectedRoute('/api/health')).toBe(false);
    });
  });

  describe('isAuthRoute', () => {
    it('identifies login and register routes', () => {
      expect(isAuthRoute('/login')).toBe(true);
      expect(isAuthRoute('/register')).toBe(true);
      expect(isAuthRoute('/login/oauth')).toBe(true);
      expect(isAuthRoute('/register/verify')).toBe(true);
    });

    it('identifies non-auth routes as false', () => {
      expect(isAuthRoute('/')).toBe(false);
      expect(isAuthRoute('/play')).toBe(false);
      expect(isAuthRoute('/game/123')).toBe(false);
    });
  });

  describe('getAuthRedirect', () => {
    it('redirects unauthenticated users from protected routes to /login with returnTo', () => {
      expect(getAuthRedirect('/play', false)).toBe('/login?returnTo=%2Fplay');
      expect(getAuthRedirect('/game/123', false)).toBe('/login?returnTo=%2Fgame%2F123');
      expect(getAuthRedirect('/review/abc', false)).toBe('/login?returnTo=%2Freview%2Fabc');
    });

    it('allows unauthenticated users to access public routes without redirect', () => {
      expect(getAuthRedirect('/', false)).toBeNull();
      expect(getAuthRedirect('/login', false)).toBeNull();
      expect(getAuthRedirect('/register', false)).toBeNull();
    });

    it('redirects authenticated users visiting /login or /register to /play by default', () => {
      expect(getAuthRedirect('/login', true)).toBe('/play');
      expect(getAuthRedirect('/register', true)).toBe('/play');
    });

    it('redirects authenticated users visiting /login to returnTo if valid internal path', () => {
      expect(getAuthRedirect('/login', true, '/review/session-123')).toBe('/review/session-123');
      expect(getAuthRedirect('/login', true, '/game/custom')).toBe('/game/custom');
    });

    it('prevents open redirect attacks by falling back to /play for external returnTo targets', () => {
      expect(getAuthRedirect('/login', true, 'https://malicious.com')).toBe('/play');
      expect(getAuthRedirect('/login', true, '//malicious.com')).toBe('/play');
    });

    it('allows authenticated users to access protected routes without redirect', () => {
      expect(getAuthRedirect('/play', true)).toBeNull();
      expect(getAuthRedirect('/game/123', true)).toBeNull();
      expect(getAuthRedirect('/review/abc', true)).toBeNull();
    });
  });
});
