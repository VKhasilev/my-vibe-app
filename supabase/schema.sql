-- VibeShop Supabase Schema
-- Run this first in Supabase SQL Editor to create tables, indexes, and RLS.
-- Then run seed-categories-subcategories.sql to insert initial data.

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- CATEGORIES TABLE
create table if not exists public.categories (
  id text primary key,
  name_en text not null,
  name_he text not null,
  icon text not null,
  slug text not null unique
);

-- SUBCATEGORIES TABLE
create table if not exists public.subcategories (
  id text primary key,
  category_id text not null references public.categories(id) on delete cascade,
  name_en text not null,
  name_he text not null,
  slug text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(category_id, slug)
);

-- PRODUCTS TABLE
create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  name_en text not null,
  name_he text not null,
  description_en text,
  description_he text,
  price numeric(10, 2) not null default 0,
  image_url text,
  category_id text references public.categories(id) on delete set null,
  subcategory_id text references public.subcategories(id) on delete set null,
  stock_status text not null default 'in_stock',
  specs jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes
create index if not exists idx_products_category_id on public.products (category_id);
create index if not exists idx_products_subcategory_id on public.products (subcategory_id);
create index if not exists idx_products_stock_status on public.products (stock_status);
create index if not exists idx_subcategories_category_id on public.subcategories (category_id);

-- Trigger: auto-update updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger update_products_updated_at
  before update on public.products
  for each row
  execute function update_updated_at_column();

-- Row Level Security
alter table public.categories enable row level security;
alter table public.subcategories enable row level security;
alter table public.products enable row level security;

create policy "Categories are viewable by everyone"
  on public.categories for select using (true);

create policy "Subcategories are viewable by everyone"
  on public.subcategories for select using (true);

create policy "Products are viewable by everyone"
  on public.products for select using (true);

create policy "Anyone can insert products"
  on public.products for insert with check (true);

create policy "Anyone can insert subcategories"
  on public.subcategories for insert with check (true);
