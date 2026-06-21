-- Personal OS — Training Tracker schema
-- Run this in Supabase SQL Editor when you're ready to add cloud sync.
-- For now the app works entirely on localStorage — this is optional.

create table if not exists training_logs (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references auth.users(id) on delete cascade,
  date       date not null,
  data       jsonb not null default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, date)
);

create table if not exists cycles (
  id           uuid default gen_random_uuid() primary key,
  user_id      uuid references auth.users(id) on delete cascade,
  name         text not null,
  start_date   date not null,
  weeks        int  not null,
  cycle_number int  not null,
  created_at   timestamptz default now()
);

-- Row-level security: users can only see their own data
alter table training_logs enable row level security;
alter table cycles        enable row level security;

create policy "own logs"   on training_logs for all using (auth.uid() = user_id);
create policy "own cycles" on cycles        for all using (auth.uid() = user_id);
