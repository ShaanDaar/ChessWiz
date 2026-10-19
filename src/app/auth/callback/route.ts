import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const returnTo = searchParams.get('returnTo') || searchParams.get('next') || '/play';

  // Sanitize returnTo to prevent open redirects
  const safeReturnTo = returnTo.startsWith('/') && !returnTo.startsWith('//') ? returnTo : '/play';

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${safeReturnTo}`);
    }
  }

  // Return the user to an error page or login if code exchange failed
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
