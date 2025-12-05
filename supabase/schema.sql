-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ==========================================
-- SIMPLE USER PROFILES
-- ==========================================
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Users can view and update their own profile
create policy "users_select_own_profile" on public.profiles
  for select using (auth.uid() = id);

create policy "users_update_own_profile" on public.profiles
  for update using (auth.uid() = id);

-- ==========================================
-- TRIGGER: Auto-create profile on signup
-- ==========================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
