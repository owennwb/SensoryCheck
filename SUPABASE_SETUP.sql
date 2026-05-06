-- =============================================
-- SensoryCheck Database Setup
-- Run this in your Supabase SQL Editor
-- =============================================

-- PROFILES table (extends Supabase auth.users)
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  display_name text,
  sensitivities text[] default '{}',
  created_at timestamp with time zone default now()
);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data->>'display_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- SHOWS table
create table if not exists shows (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  venue text not null,
  city text,
  description text,
  submitted_by uuid references auth.users(id),
  created_at timestamp with time zone default now()
);

-- REVIEWS table
create table if not exists reviews (
  id uuid default gen_random_uuid() primary key,
  show_id uuid references shows(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  display_name text,
  section text default 'Not specified',
  body text not null,
  created_at timestamp with time zone default now()
);

-- RATINGS table (one per review)
create table if not exists ratings (
  id uuid default gen_random_uuid() primary key,
  review_id uuid references reviews(id) on delete cascade not null,
  show_id uuid references shows(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  noise integer check (noise between 1 and 10),
  strobes integer check (strobes between 1 and 10),
  pyro integer check (pyro between 1 and 10),
  smell integer check (smell between 1 and 10),
  crowd integer check (crowd between 1 and 10),
  temp integer check (temp between 1 and 10),
  visual integer check (visual between 1 and 10),
  created_at timestamp with time zone default now()
);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

alter table profiles enable row level security;
alter table shows enable row level security;
alter table reviews enable row level security;
alter table ratings enable row level security;

-- Profiles: users can read all, only edit their own
create policy "Profiles are public" on profiles for select using (true);
create policy "Users update own profile" on profiles for update using (auth.uid() = id);
create policy "Users insert own profile" on profiles for insert with check (auth.uid() = id);

-- Shows: anyone can read, logged in users can add
create policy "Shows are public" on shows for select using (true);
create policy "Logged in users can add shows" on shows for insert with check (auth.role() = 'authenticated');

-- Reviews: anyone can read, logged in users can add their own
create policy "Reviews are public" on reviews for select using (true);
create policy "Users can insert reviews" on reviews for insert with check (auth.uid() = user_id);
create policy "Users can delete own reviews" on reviews for delete using (auth.uid() = user_id);

-- Ratings: anyone can read, logged in users can add their own
create policy "Ratings are public" on ratings for select using (true);
create policy "Users can insert ratings" on ratings for insert with check (auth.uid() = user_id);

-- =============================================
-- SEED DATA — Tournament of Kings
-- =============================================

insert into shows (name, venue, city, description) values
(
  'Tournament of Kings',
  'Excalibur Hotel & Casino',
  'Las Vegas, NV',
  'Medieval dinner show featuring jousting, horses, and heavy use of pyrotechnics including gerb effects mounted in the arena barrier wall. Extremely high sensory intensity.'
),
(
  'Blue Man Group',
  'Luxor Hotel',
  'Las Vegas, NV',
  'High-energy percussion performance with loud drumming, visual chaos, and earplugs provided at the door.'
),
(
  'Cirque du Soleil — O',
  'Bellagio',
  'Las Vegas, NV',
  'Water-based acrobatics show. Relatively sensory-friendly compared to other Vegas productions. Minimal pyro.'
);
