import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { PlayDashboardClient } from './PlayDashboardClient';

export const metadata = {
  title: 'Play — Chessie',
  description: 'Your cozy chessboard table and companion parlor.',
};

export default async function PlayPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?returnTo=/play');
  }

  // Fetch user profile from database
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

  const username =
    profile?.username ||
    user.user_metadata?.username ||
    user.user_metadata?.name ||
    user.email?.split('@')[0] ||
    'Player';

  const preferredPersona = profile?.preferred_persona || 'coach';
  const ratingEstimate = profile?.rating_estimate || 1200;

  return (
    <PlayDashboardClient
      userEmail={user.email || ''}
      username={username}
      preferredPersona={preferredPersona}
      ratingEstimate={ratingEstimate}
    />
  );
}
