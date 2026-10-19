-- ==============================================================================
-- Chessie Seed Data
-- Creates demonstration user profile, sample played game, and companion session
-- ==============================================================================

-- Demo User UUID
do $$
declare
  demo_user_id uuid := '00000000-0000-0000-0000-000000000001';
  demo_game_id uuid := '00000000-0000-0000-0000-000000000002';
begin
  -- 1. Insert Profile
  insert into public.profiles (id, username, rating_estimate, preferred_persona)
  values (demo_user_id, 'GrandmasterKasparov', 1850, 'coach')
  on conflict (id) do update
  set username = excluded.username,
      rating_estimate = excluded.rating_estimate,
      preferred_persona = excluded.preferred_persona;

  -- 2. Insert Sample Game
  insert into public.games (
    id,
    user_id,
    source,
    pgn,
    result,
    time_control,
    played_at,
    analysis_json,
    imported_ref
  )
  values (
    demo_game_id,
    demo_user_id,
    'pgn',
    '1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Nb8 10. d4 Nbd7',
    '1-0',
    '10+0',
    now() - interval '2 days',
    '{"accuracy": {"player": 91.4, "opponent": 86.2}, "blunders": 0, "mistakes": 1, "inaccuracies": 2}'::jsonb,
    'seed-game-001'
  )
  on conflict (id) do nothing;

  -- 3. Insert Companion Session
  insert into public.companion_sessions (id, game_id, persona)
  values (
    '00000000-0000-0000-0000-000000000003',
    demo_game_id,
    'coach'
  )
  on conflict (id) do nothing;
end $$;
