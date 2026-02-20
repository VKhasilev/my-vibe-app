-- VibeShop Supabase Schema
-- Copy and paste this entire script into Supabase SQL Editor and run it

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- CATEGORIES TABLE
create table if not exists public.categories (
  id text primary key,                -- e.g. 'tanks', 'electronic-cigarettes'
  name_en text not null,
  name_he text not null,
  icon text not null,                 -- e.g. 'Zap', 'Droplet', etc.
  slug text not null unique
);

-- SUBCATEGORIES TABLE
create table if not exists public.subcategories (
  id text primary key,                -- e.g. 'starter-kits', 'replacement-coils'
  category_id text not null references public.categories(id) on delete cascade,
  name_en text not null,
  name_he text not null,
  slug text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(category_id, slug)           -- Ensure unique slug per category
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
  stock_status text not null default 'in_stock', -- e.g. 'in_stock' | 'out_of_stock' | 'preorder'
  specs jsonb,                                   -- arbitrary JSON with product specs
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Helpful indexes for better query performance
create index if not exists idx_products_category_id
  on public.products (category_id);

create index if not exists idx_products_subcategory_id
  on public.products (subcategory_id);

create index if not exists idx_products_stock_status
  on public.products (stock_status);

create index if not exists idx_subcategories_category_id
  on public.subcategories (category_id);

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Trigger to automatically update updated_at
create trigger update_products_updated_at
  before update on public.products
  for each row
  execute function update_updated_at_column();

-- Seed initial categories matching your current structure
insert into public.categories (id, name_en, name_he, icon, slug) values
  ('diy-flavors-components', 'DIY Flavors & Components', 'טעמים וחלקים לעשה זאת בעצמך', 'Wrench', 'diy-flavors-components'),
  ('electronic-cigarettes',  'Electronic Cigarettes',    'סיגריות אלקטרוניות',          'Zap',    'electronic-cigarettes'),
  ('coils-pods',             'Coils & Pods',             'סלילים ופודים',                'Battery','coils-pods'),
  ('tanks',                  'Tanks',                    'טנקים',                         'Droplet','tanks'),
  ('accessories',            'Accessories',              'אביזרים',                       'Package','accessories'),
  ('flavors',                'Flavors',                  'טעמים',                         'Sparkles','flavors'),
  ('tobacco-substitutes',    'Tobacco Substitutes',      'תחליפי טבק',                    'Leaf',   'tobacco-substitutes')
on conflict (id) do nothing;

-- Seed initial subcategories
insert into public.subcategories (id, category_id, name_en, name_he, slug) values
  ('base-liquids', 'diy-flavors-components', 'Base Liquids', 'נוזלי בסיס', 'base-liquids'),
  ('starter-kits', 'electronic-cigarettes', 'Starter Kits', 'ערכות התחלה', 'starter-kits'),
  ('replacement-coils', 'coils-pods', 'Replacement Coils', 'סלילים חלופיים', 'replacement-coils'),
  ('sub-ohm-tanks', 'tanks', 'Sub-Ohm Tanks', 'טנקים תת-אוהם', 'sub-ohm-tanks'),
  ('chargers', 'accessories', 'Chargers', 'מטענים', 'chargers'),
  ('premium-flavors', 'flavors', 'Premium Flavors', 'טעמים פרימיום', 'premium-flavors'),
  ('nicotine-salts', 'tobacco-substitutes', 'Nicotine Salts', 'מלחי ניקוטין', 'nicotine-salts')
on conflict (id) do nothing;

-- Enable Row Level Security (RLS)
alter table public.categories enable row level security;
alter table public.subcategories enable row level security;
alter table public.products enable row level security;

-- RLS Policies: Allow public read access
create policy "Categories are viewable by everyone"
  on public.categories for select
  using (true);

create policy "Subcategories are viewable by everyone"
  on public.subcategories for select
  using (true);

create policy "Products are viewable by everyone"
  on public.products for select
  using (true);

-- RLS Policy: Allow authenticated users to insert products (you can restrict this further)
-- For now, we'll allow inserts from anyone (you can add auth later)
create policy "Anyone can insert products"
  on public.products for insert
  with check (true);

create policy "Anyone can insert subcategories"
  on public.subcategories for insert
  with check (true);

-- Optional: If you want to restrict inserts to authenticated users only, use this instead:
-- create policy "Authenticated users can insert products"
--   on public.products for insert
--   with check (auth.role() = 'authenticated');
