import { test, expect } from '@playwright/test';

test.describe('Landing Page E2E & Accessibility', () => {
  test('renders all visual elements, overlay text, and accessible roles', async ({ page }) => {
    await page.goto('/');

    // 1. Verify page title & metadata
    await expect(page).toHaveTitle(/Chessie — Wanna Play\?/i);

    // 2. Verify banner & branding
    const brandLink = page.getByRole('link', { name: /chessie home/i });
    await expect(brandLink).toBeVisible();

    // 3. Verify hero overlay typography
    const heading = page.getByRole('heading', { name: 'Wanna play?', level: 1 });
    await expect(heading).toBeVisible();

    const subtitle = page.getByText("Let's have a game?");
    await expect(subtitle).toBeVisible();

    // 4. Verify navigation buttons
    const loginBtn = page.getByRole('link', { name: 'Log in' });
    await expect(loginBtn).toBeVisible();

    const registerBtn = page.getByRole('link', { name: 'Register now' });
    await expect(registerBtn).toBeVisible();

    // 5. Verify Play button
    const playBtn = page.getByRole('link', { name: 'Play' });
    await expect(playBtn).toBeVisible();
    await expect(playBtn).toHaveAttribute('href', '/play');
  });

  test('supports sequential keyboard navigation and skip link', async ({ page }) => {
    await page.goto('/');

    // Press Tab from initial page load -> focuses Skip Link
    await page.keyboard.press('Tab');
    const skipLink = page.getByRole('link', { name: /skip to main content/i });
    await expect(skipLink).toBeFocused();

    // Tab to Brand Link
    await page.keyboard.press('Tab');
    const brandLink = page.getByRole('link', { name: /chessie home/i });
    await expect(brandLink).toBeFocused();

    // Tab to Log in
    await page.keyboard.press('Tab');
    const loginBtn = page.getByRole('link', { name: 'Log in' });
    await expect(loginBtn).toBeFocused();

    // Tab to Register now
    await page.keyboard.press('Tab');
    const registerBtn = page.getByRole('link', { name: 'Register now' });
    await expect(registerBtn).toBeFocused();

    // Tab to Play
    await page.keyboard.press('Tab');
    const playBtn = page.getByRole('link', { name: 'Play' });
    await expect(playBtn).toBeFocused();
  });

  test('respects prefers-reduced-motion by disabling animations and video autoplay', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    // Video should not be playing when reduced motion is requested
    const video = page.locator('video');
    await expect(video).toHaveCount(0);

    // Static poster image must be rendered
    const posterImg = page.locator('img[src="/landing/scene.jpg"]');
    await expect(posterImg).toBeVisible();
  });

  test('renders responsively on mobile without horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Verify all key elements are visible on small viewport
    await expect(page.getByRole('heading', { name: 'Wanna play?' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Play' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Log in' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Register now' })).toBeVisible();

    // Verify zero horizontal scroll
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  test('Auth Guard intercepts unauthenticated requests to /play, /game/*, and /review/*', async ({
    page,
  }) => {
    // 1. Direct navigation to /play redirects to /login?returnTo=%2Fplay
    await page.goto('/play');
    await expect(page).toHaveURL(/\/login\?returnTo=%2Fplay/);
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();

    // 2. Direct navigation to /game/xyz redirects to /login?returnTo=%2Fgame%2Fxyz
    await page.goto('/game/xyz-123');
    await expect(page).toHaveURL(/\/login\?returnTo=%2Fgame%2Fxyz-123/);

    // 3. Direct navigation to /review/abc redirects to /login?returnTo=%2Freview%2Fabc
    await page.goto('/review/abc-456');
    await expect(page).toHaveURL(/\/login\?returnTo=%2Freview%2Fabc-456/);

    // 4. Clicking Play button on landing page redirects unauthenticated user to login
    await page.goto('/');
    // force: true because the Play button has an infinite pulse animation
    // that Playwright's actionability check considers "not stable"
    await page.getByRole('link', { name: 'Play' }).click({ force: true });
    await expect(page).toHaveURL(/\/login\?returnTo=%2Fplay/);

    // 5. Clicking Register now link preserves returnTo parameter
    await page.getByRole('link', { name: /register now/i }).click();
    await expect(page).toHaveURL(/\/register\?returnTo=%2Fplay/);
    await expect(page.getByRole('heading', { name: /pull up a chair/i })).toBeVisible();
  });
});
