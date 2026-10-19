import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/lib/supabase/database.types';

async function seed() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
    console.log('------------------------------------------------------------');
    console.log('Chessie Database Seed:');
    console.log('Skipping live DB seed: Real SUPABASE_URL and KEY not detected.');
    console.log('To run this against a live Supabase instance:');
    console.log('1. Set SUPABASE_URL and SUPABASE_ANON_KEY in your .env.local');
    console.log('2. Run: npm run seed');
    console.log('Alternatively, execute supabase/seed.sql directly in the Supabase SQL editor.');
    console.log('------------------------------------------------------------');
    return;
  }

  console.log(`Connecting to Supabase instance at ${supabaseUrl}...`);
  const supabase = createClient<Database>(supabaseUrl, supabaseKey);

  const demoUserId = '00000000-0000-0000-0000-000000000001';
  const demoGameId = '00000000-0000-0000-0000-000000000002';

  // 1. Seed Profile
  const { error: profileError } = await supabase.from('profiles').upsert({
    id: demoUserId,
    username: 'GrandmasterKasparov',
    rating_estimate: 1850,
    preferred_persona: 'coach',
  });

  if (profileError) {
    console.warn('Profile seed note:', profileError.message);
  } else {
    console.log('✓ Profile seeded successfully.');
  }

  // 2. Seed Game
  const { error: gameError } = await supabase.from('games').upsert({
    id: demoGameId,
    user_id: demoUserId,
    source: 'pgn',
    pgn: '1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Nb8 10. d4 Nbd7',
    result: '1-0',
    time_control: '10+0',
    played_at: new Date(Date.now() - 172800000).toISOString(),
    analysis_json: {
      accuracy: { player: 91.4, opponent: 86.2 },
      blunders: 0,
      mistakes: 1,
      inaccuracies: 2,
    },
    imported_ref: 'seed-game-001',
  });

  if (gameError) {
    console.warn('Game seed note:', gameError.message);
  } else {
    console.log('✓ Game seeded successfully.');
  }

  // 3. Seed Companion Session
  const { error: sessionError } = await supabase.from('companion_sessions').upsert({
    id: '00000000-0000-0000-0000-000000000003',
    game_id: demoGameId,
    persona: 'coach',
  });

  if (sessionError) {
    console.warn('Companion session seed note:', sessionError.message);
  } else {
    console.log('✓ Companion session seeded successfully.');
  }

  console.log('Seed completed.');
}

seed().catch((err) => {
  console.error('Seed execution error:', err);
  process.exit(1);
});
