# Supabase Integration Setup Guide

DB-related SQL scripts in this folder: **`schema.sql`** (tables, indexes, RLS) and **`seed-categories-subcategories.sql`** (categories + subcategories data).

## ✅ What's Been Implemented

All Supabase integration has been completed:

1. ✅ **Supabase Client** (`src/lib/supabaseClient.js`)
2. ✅ **Data Fetching Hooks** (`src/hooks/useSupabaseData.js`)
3. ✅ **Skeleton Loaders** (`src/components/ProductGridSkeleton.jsx`)
4. ✅ **Admin Page** (`src/pages/AdminAddProductPage.jsx`) - Route: `/admin/add-product`
5. ✅ **Updated Components** - All components now fetch from Supabase instead of static files

## 📋 Setup Instructions

### Step 1: Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Get your Supabase credentials:
   - Go to your Supabase Dashboard
   - Navigate to **Settings** → **API**
   - Copy your **Project URL** and **anon public** key

3. Edit `.env.local` and add your credentials:
   ```bash
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   VITE_ADMIN_PASSWORD=your-secure-password-here
   ```

### Step 2: Run SQL in Supabase (schema first, then seed)

All DB scripts live in the **`supabase/`** folder.

1. Open your Supabase Dashboard → **SQL Editor** → **New query**
2. **Run the schema** (tables, indexes, RLS):
   - Open `supabase/schema.sql`, copy its entire contents, paste in the editor, then **Run**
3. **Run the seed** (categories and subcategories):
   - Open `supabase/seed-categories-subcategories.sql`, copy its entire contents, paste in the editor, then **Run**

This will create:
- `categories` and `subcategories` tables (empty until seed runs)
- `products` table
- Indexes, RLS policies, and auto-update triggers
- All category and subcategory seed data (idempotent; safe to run again)

### Step 3: Verify Setup

1. Restart your dev server:
   ```bash
   npm run dev
   ```

2. Check the browser console for any errors

3. Visit `/admin/add-product` and test adding a product

## 🗄️ Database Schema

### Categories Table
- `id` (text, primary key) - e.g., 'tanks', 'electronic-cigarettes'
- `name_en` (text) - English name
- `name_he` (text) - Hebrew name
- `icon` (text) - Icon name (e.g., 'Zap', 'Droplet')
- `slug` (text, unique) - URL-friendly slug

### Subcategories Table
- `id` (text, primary key)
- `category_id` (text) - Foreign key to categories.id
- `name_en`, `name_he`, `slug` - Names and slug per category

### Products Table
- `id` (uuid, primary key) - Auto-generated UUID
- `name_en` (text) - English product name
- `name_he` (text) - Hebrew product name
- `description_en` (text, nullable) - English description
- `description_he` (text, nullable) - Hebrew description
- `price` (numeric) - Product price
- `image_url` (text, nullable) - Product image URL
- `category_id` (text) - Foreign key to categories.id
- `subcategory_id` (text, nullable) - Foreign key to subcategories.id
- `stock_status` (text) - 'in_stock' | 'out_of_stock' | 'preorder'
- `specs` (jsonb, nullable) - JSON object for product specifications
- `created_at` (timestamp) - Auto-generated
- `updated_at` (timestamp) - Auto-updated on changes

## 🔐 Admin Access

The admin page at `/admin/add-product` is protected by a simple password check.

- Default password: `changeme` (if `VITE_ADMIN_PASSWORD` is not set)
- Set `VITE_ADMIN_PASSWORD` in `.env.local` for production
- Password is stored in localStorage after successful login

**Note:** For production, consider implementing proper Supabase Auth instead of this simple password check.

## 📝 Adding Products via Admin Panel

1. Navigate to `/admin/add-product`
2. Enter admin password
3. Fill out the form:
   - **Name (EN)** and **Name (HE)** are required
   - **Price** is required
   - **Category** - Select from dropdown
   - **Subcategory ID** - Enter manually (e.g., 'starter-kits')
   - **Specs (JSON)** - Optional JSON object for features
4. Click **Save Product**

## 🔄 Migration from Static Files

The app now uses Supabase as the primary data source. The old static files (`src/data/products.js` and `src/data/categories.js`) are no longer used for data fetching, but you can keep them as reference or remove them.

## 🚀 Next Steps

1. **Add Products**: Use the admin panel or insert directly via Supabase dashboard
2. **Customize Categories/Subcategories**: Edit in Supabase dashboard or re-run/amend `seed-categories-subcategories.sql`
3. **Image Storage**: Consider using Supabase Storage for product images instead of external URLs
4. **Authentication**: Replace simple password check with Supabase Auth for better security

## 🐛 Troubleshooting

**Error: "Missing Supabase environment variables"**
- Make sure `.env.local` exists and contains `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart your dev server after adding env vars

**Products not showing**
- Check browser console for errors
- Verify RLS policies allow SELECT operations
- Ensure products exist in your Supabase database

**Categories not loading**
- Run `supabase/schema.sql` first, then `supabase/seed-categories-subcategories.sql`
- Check that categories table has data (7 seeded categories)
- Check browser console for fetch errors
