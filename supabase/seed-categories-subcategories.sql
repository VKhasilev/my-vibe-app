-- VibeShop: Categories and Subcategories seed data
-- Run this AFTER supabase/schema.sql in Supabase SQL Editor.
-- Uses ON CONFLICT DO NOTHING so safe to run multiple times.

-- ========== CATEGORIES ==========
insert into public.categories (id, name_en, name_he, icon, slug) values
  ('diy-flavors-components', 'DIY Flavors & Components', 'טעמים וחלקים לעשה זאת בעצמך', 'Wrench', 'diy-flavors-components'),
  ('electronic-cigarettes',  'Electronic Cigarettes',    'סיגריות אלקטרוניות',          'Zap',    'electronic-cigarettes'),
  ('coils-pods',             'Coils & Pods',             'סלילים ופודים',                'Battery','coils-pods'),
  ('tanks',                  'Tanks',                    'טנקים',                         'Droplet','tanks'),
  ('accessories',            'Accessories',              'אביזרים',                       'Package','accessories'),
  ('flavors',                'Flavors',                  'טעמים',                         'Sparkles','flavors'),
  ('tobacco-substitutes',    'Tobacco Substitutes',      'תחליפי טבק',                    'Leaf',   'tobacco-substitutes')
on conflict (id) do nothing;

-- ========== SUBCATEGORIES ==========

-- DIY Flavors & Components
insert into public.subcategories (id, category_id, name_en, name_he, slug) values
  ('ciggy-flavors', 'diy-flavors-components', 'Ciggy Flavors', 'טעמי Ciggy', 'ciggy-flavors'),
  ('lume-flavors', 'diy-flavors-components', 'Lume Flavors', 'טעמי Lume', 'lume-flavors'),
  ('aisu-flavors', 'diy-flavors-components', 'Aisu Flavors', 'טעמי Aisu', 'aisu-flavors'),
  ('iceix-flavors', 'diy-flavors-components', 'IceIX Flavors', 'טעמי IceIX', 'iceix-flavors'),
  ('pg-vg-nicotine', 'diy-flavors-components', 'PG/VG & Nicotine', 'פרופילן/גליצרין וניקוטין', 'pg-vg-nicotine'),
  ('bottles', 'diy-flavors-components', 'Bottles', 'בקבוקים', 'bottles'),
  ('syringes', 'diy-flavors-components', 'Syringes', 'מזרקים', 'syringes')
on conflict (id) do nothing;

-- Electronic Cigarettes
insert into public.subcategories (id, category_id, name_en, name_he, slug) values
  ('pod-kits', 'electronic-cigarettes', 'Pod Kits', 'ערכות פודים', 'pod-kits'),
  ('advanced-kits', 'electronic-cigarettes', 'Advanced Kits', 'ערכות מתקדמות', 'advanced-kits'),
  ('advanced-mods', 'electronic-cigarettes', 'Advanced Mods', 'מודים מתקדמים', 'advanced-mods'),
  ('empty-disposables', 'electronic-cigarettes', 'Disposables Empty', 'סיג"א חד פעמיות ריקות', 'empty-disposables'),
  ('prefilled-disposables', 'electronic-cigarettes', 'Disposables Prefilled', 'סיג"א חד פעמיות עם נוזל', 'prefilled-disposables'),
  ('cbd-vaporizers', 'electronic-cigarettes', 'CBD Pens', 'מכשירי אידוי CBD', 'cbd-vaporizers')
on conflict (id) do nothing;

-- Coils & Pods
insert into public.subcategories (id, category_id, name_en, name_he, slug) values
  ('aspire-coils', 'coils-pods', 'Aspire', 'Aspire', 'aspire-coils'),
  ('bmor-coils', 'coils-pods', 'Bmor', 'Bmor', 'bmor-coils'),
  ('ciggy-coils', 'coils-pods', 'Ciggy', 'Ciggy', 'ciggy-coils'),
  ('freemax-coils', 'coils-pods', 'Freemax', 'Freemax', 'freemax-coils'),
  ('geekvape-coils', 'coils-pods', 'Geekvape', 'Geekvape', 'geekvape-coils'),
  ('lost-vape-coils', 'coils-pods', 'Lost Vape', 'Lost Vape', 'lost-vape-coils'),
  ('mipod-coils', 'coils-pods', 'Mi-Pod', 'Mi-Pod', 'mipod-coils'),
  ('nevoks-coils', 'coils-pods', 'Nevoks', 'Nevoks', 'nevoks-coils'),
  ('oxva-coils', 'coils-pods', 'OXVA', 'OXVA', 'oxva-coils'),
  ('obs-coils', 'coils-pods', 'OBS', 'OBS', 'obs-coils'),
  ('smok-coils', 'coils-pods', 'Smok', 'Smok', 'smok-coils'),
  ('vaporesso-coils', 'coils-pods', 'Vaporesso', 'Vaporesso', 'vaporesso-coils'),
  ('voopoo-coils', 'coils-pods', 'Voopoo', 'Voopoo', 'voopoo-coils'),
  ('justfog-coils', 'coils-pods', 'Justfog', 'Justfog', 'justfog-coils')
on conflict (id) do nothing;

-- Tanks
insert into public.subcategories (id, category_id, name_en, name_he, slug) values
  ('sub-ohm-tanks', 'tanks', 'Sub-Ohm tanks', 'טנקים SUB OHM', 'sub-ohm-tanks'),
  ('mtl-tanks', 'tanks', 'MTL tanks', 'טנקים MTL', 'mtl-tanks')
on conflict (id) do nothing;

-- Accessories
insert into public.subcategories (id, category_id, name_en, name_he, slug) values
  ('batteries', 'accessories', 'Batteries', 'סוללות', 'batteries'),
  ('chargers', 'accessories', 'Chargers', 'מטענים', 'chargers'),
  ('replacement-glass', 'accessories', 'Glasses', 'זכוכיות החלפה', 'replacement-glass'),
  ('cotton', 'accessories', 'Cotton', 'כותנה', 'cotton'),
  ('replacement-drip-tips', 'accessories', 'Drip Tips', 'פיות מתחלפות', 'replacement-drip-tips'),
  ('thread-adapters', 'accessories', 'Adapters', 'מתאמי הברגה', 'thread-adapters')
on conflict (id) do nothing;

-- Flavors
insert into public.subcategories (id, category_id, name_en, name_he, slug) values
  ('cig-flavors', 'flavors', 'CIG', 'CIG', 'cig-flavors'),
  ('capella-flavors', 'flavors', 'Capella', 'Capella', 'capella-flavors'),
  ('flavorah-flavors', 'flavors', 'Flavorah', 'Flavorah', 'flavorah-flavors'),
  ('tpa-flavors', 'flavors', 'TPA', 'TPA', 'tpa-flavors'),
  ('inawera-flavors', 'flavors', 'Inawera', 'Inawera', 'inawera-flavors'),
  ('flavor-enhancers', 'flavors', 'Flavor Enhancers', 'משפרי טעם', 'flavor-enhancers'),
  ('iff-flavors', 'flavors', 'IFF', 'IFF', 'iff-flavors'),
  ('smoke-flavors', 'flavors', 'Smoke Flavors', 'Smoke Flavors', 'smoke-flavors'),
  ('flavourart-flavors', 'flavors', 'FlavourArt', 'FlavourArt', 'flavourart-flavors'),
  ('raw-flavors', 'flavors', 'Raw Flavors', 'Raw Flavors', 'raw-flavors'),
  ('vampire-vape-flavors', 'flavors', 'Vampire Vape', 'Vampire Vape', 'vampire-vape-flavors'),
  ('riot-squad-flavors', 'flavors', 'Riot Squad', 'Riot Squad', 'riot-squad-flavors')
on conflict (id) do nothing;

-- Tobacco Substitutes
insert into public.subcategories (id, category_id, name_en, name_he, slug) values
  ('neafs-heating-sticks', 'tobacco-substitutes', 'HNB Sticks', 'מקלות לחימום', 'neafs-heating-sticks'),
  ('tobacco-heating-devices', 'tobacco-substitutes', 'HNB Devices', 'מכשירים לחימום טבק', 'tobacco-heating-devices'),
  ('zylo-nicotine-pouches', 'tobacco-substitutes', 'Nicotine pouches', 'שקיקי ניקוטין', 'zylo-nicotine-pouches')
on conflict (id) do nothing;
