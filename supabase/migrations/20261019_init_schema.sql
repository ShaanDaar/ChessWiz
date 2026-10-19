-- ==============================================================================
-- Chessie Initial Schema Migration
-- Tables: profiles, games, companion_sessions
-- Includes: Row Level Security (RLS) policies, indexes, and auth trigger
-- ==============================================================================

-- 1. Profiles Table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  rating_estimate integer not null default 1200,
  preferred_persona text not null default 'coach',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Games Table
create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  source text not null default 'local', -- 'local', 'chess.com', 'lichess', 'pgn'
  pgn text not null,
  result text, -- '1-0', '0-1', '1/2-1/2', '*'
  time_control text,
  played_at timestamptz not null default now(),
  analysis_json jsonb,
  imported_ref text, -- e.g. chess.com game URL or lichess game ID
  created_at timestamptz not null default now()
);

-- Unique index ensuring imported_ref is unique per user (ignoring nulls)
create unique index if not exists games_user_imported_ref_idx
  on public.games (user_id, imported_ref)
  where imported_ref is not null;

-- Index on user_id and played_at for fast query performance
create index if not exists games_user_played_at_idx
  on public.games (user_id, played_at desc);

-- 3. Companion Sessions Table
create table if not exists public.companion_sessions (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games(id) on delete cascade,
  persona text not null default 'coach',
  created_at timestamptz not null default now()
);

-- Index on game_id
create index if not exists companion_sessions_game_id_idx
  on public.companion_sessions (game_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================================================

alter table public.profiles enable row level security;
alter table public.games enable row level security;
alter table public.companion_sessions enable row level security;

-- Profiles Policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Games Policies
create policy "Users can view their own games"
  on public.games for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert their own games"
  on public.games for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own games"
  on public.games for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own games"
  on public.games for delete
  to authenticated
  using (auth.uid() = user_id);

-- Companion Sessions Policies (Accessible only via owner of the game)
create policy "Users can view companion sessions for their own games"
  on public.companion_sessions for select
  to authenticated
  using (
    exists (
      select 1 from public.games
      where games.id = companion_sessions.game_id
        and games.user_id = auth.uid()
    )
  );

create policy "Users can insert companion sessions for their own games"
  on public.companion_sessions for insert
  to authenticated
  with check (
    exists (
      select 1 from public.games
      where games.id = companion_sessions.game_id
        and games.user_id = auth.uid()
    )
  );

create policy "Users can update companion sessions for their own games"
  on public.companion_sessions for update
  to authenticated
  using (
    exists (
      select 1 from public.games
      where games.id = companion_sessions.game_id
        and games.user_id = auth.uid()
    )
  );

create policy "Users can delete companion sessions for their own games"
  on public.companion_sessions for delete
  to authenticated
  using (
    exists (
      select 1 from public.games
      where games.id = companion_sessions.game_id
        and games.user_id = auth.uid()
    )
  );

-- ==============================================================================
-- AUTOMATIC PROFILE TRIGGER ON AUTH.USERS INSERT
-- ==============================================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, rating_estimate, preferred_persona)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'username',
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1),
      'Player'
    ),
    1200,
    'coach'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger definition
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
