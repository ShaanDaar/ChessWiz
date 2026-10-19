import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from './database.types';
import { getAuthRedirect } from '@/features/auth/logic/authGuard';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl =
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    'https://placeholder.supabase.co';
  const supabaseAnonKey =
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    'placeholder-anon-key';

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // Fetch current user from Supabase session (validated on server)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const redirectPath = getAuthRedirect(
    request.nextUrl.pathname,
    Boolean(user),
    request.nextUrl.searchParams.get('returnTo'),
  );

  if (redirectPath) {
    const redirectUrl = request.nextUrl.clone();
    const [path, query] = redirectPath.split('?');
    redirectUrl.pathname = path;
    redirectUrl.search = query ? `?${query}` : '';
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}
