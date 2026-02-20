-- VibeShop: Products seed data
-- Run this AFTER supabase/schema.sql and supabase/seed-categories-subcategories.sql

INSERT INTO public.products (name_en, name_he, price, category_id, subcategory_id, specs, stock_status) VALUES

-- Pod Kits (Electronic Cigarettes)
('Vaporesso Xros 5 Mini Pod Kit', 'Vaporesso Xros 5 Mini Pod Kit', 110, 'electronic-cigarettes', 'pod-kits', 
'{"colors": ["Carbon Black", "Flowing Blue", "Flowing Green", "Flowing Pink", "Mist Black", "Mist White", "Retro Orange", "Sky Blue", "Titanium Silver", "שחור"]}'::jsonb, 'in_stock'),

('Vaporesso XROS Pro 2 Pod Kit', 'Vaporesso XROS Pro 2 Pod Kit', 180, 'electronic-cigarettes', 'pod-kits', 
'{"colors": ["Dawn Purple", "Gem Green", "Glittering Black", "Glittering Gold", "Glittering Silver", "Moonlit Pink", "Storm Blue"]}'::jsonb, 'in_stock'),

-- Advanced Kits (Electronic Cigarettes)
('Lost Vape Thelema Solo 100W Kit', 'Lost Vape Thelema Solo 100W Kit', 325, 'electronic-cigarettes', 'advanced-kits', 
'{"colors": ["Alluring Silver", "Black Carbon Fiber", "Cernunnos Gray", "Phantom Black"], "power": "100W"}'::jsonb, 'in_stock'),

('Lost Vape Centaurus M200 Kit', 'Lost Vape Centaurus M200 Kit', 400, 'electronic-cigarettes', 'advanced-kits', 
'{"colors": ["Asakusa Bloom", "Galaxy Black", "Moonlit Spire", "Sakura Fuji", "Samurai Will"], "power": "200W"}'::jsonb, 'in_stock'),

-- Disposables Prefilled (Electronic Cigarettes)
('Sweet Party 50000 Puffs Vape', 'Sweet Party 50000 Puffs Vape', 110, 'electronic-cigarettes', 'prefilled-disposables', 
'{"puffs": 50000, "type": "Liquid Included"}'::jsonb, 'in_stock'),

('Peakly Vape 60000 Puffs', 'ערכת וייפ Peakly עד 60000 שאיפות', 80, 'electronic-cigarettes', 'prefilled-disposables', 
'{"puffs": 60000}'::jsonb, 'in_stock'),

-- Coils & Pods (Vaporesso)
('Vaporesso Luxe X Pods 5ml', 'Vaporesso Luxe X Pods 5ml', 35, 'coils-pods', 'vaporesso-coils', 
'{"resistance": ["0.4ohm", "0.6ohm", "0.8ohm"], "volume": "5ml"}'::jsonb, 'in_stock'),

('Vaporesso GTX Coils (5pcs)', 'Vaporesso GTX Coils (5pcs)', 65, 'coils-pods', 'vaporesso-coils', 
'{"resistance": ["0.4ohm Mesh", "0.6ohm Mesh", "0.8ohm Mesh", "0.15ohm Dual Mesh", "0.20ohm Dual Mesh", "0.30ohm Dual Mesh"], "quantity": "5pcs"}'::jsonb, 'in_stock'),

-- Coils & Pods (Lost Vape)
('Lost Vape UB Max Coils 3pcs', 'Lost Vape UB Max Coils 3pcs', 55, 'coils-pods', 'lost-vape-coils', 
'{"resistance": ["X1 0.15ohm", "X2 0.2ohm", "X3 0.3ohm"], "quantity": "3pcs"}'::jsonb, 'in_stock'),

('Lost Vape Galaxy T360 Replacement Pods', 'Lost Vape Galaxy T360 Pods', 70, 'coils-pods', 'lost-vape-coils', 
'{"compatibility": "Galaxy T360"}'::jsonb, 'in_stock'),

-- Tanks
('Lost Vape Centaurus Sub Ohm Tank', 'Lost Vape Centaurus Tank', 140, 'tanks', 'sub-ohm-tanks', 
'{"type": "Sub Ohm", "threading": "510"}'::jsonb, 'in_stock'),

('MTL Replacement Tank 2ml', 'טנק MTL חלופי', 95, 'tanks', 'mtl-tanks', 
'{"type": "MTL", "volume": "2ml"}'::jsonb, 'in_stock'),

-- Base Components (DIY Flavors & Components)
('Vegetable Glycerin 70ml', '70 מ"ל גליצרין צמחי USP/EP בבקבוק 100 מ"ל', 30, 'diy-flavors-components', 'pg-vg-nicotine', 
'{"volume": "70ml", "bottle_size": "100ml", "purity": "USP/EP"}'::jsonb, 'in_stock'),

('Propylene Glycol 500ml', '500 מ"ל פרופילן גליקול USP', 35, 'diy-flavors-components', 'pg-vg-nicotine', 
'{"volume": "500ml", "purity": "USP"}'::jsonb, 'in_stock'),

-- Bottles & Syringes (DIY Flavors & Components)
('LDPE Empty Bottle 60ml', 'בקבוק ריק 60 מ"ל', 5, 'diy-flavors-components', 'bottles', 
'{"material": "LDPE", "volume": "60ml"}'::jsonb, 'in_stock'),

('Gorilla Bottle 120ml', 'בקבוק גורילה 120 מ"ל', 8, 'diy-flavors-components', 'bottles', 
'{"material": "PET", "volume": "120ml"}'::jsonb, 'in_stock'),

('Plastic Syringe 5ml', 'מזרק פלסטיק 5 מ"ל', 3, 'diy-flavors-components', 'syringes', 
'{"volume": "5ml"}'::jsonb, 'in_stock'),

('Plastic Syringe 10ml', 'מזרק פלסטיק 10 מ"ל', 4, 'diy-flavors-components', 'syringes', 
'{"volume": "10ml"}'::jsonb, 'in_stock'),

-- Flavors (DIY Flavors & Components - Ciggy & Lume)
('20ML Ciggy Flavor Shots', '20ML Ciggy Flavor Shots', 40, 'diy-flavors-components', 'ciggy-flavors', 
'{"volume": "20ml"}'::jsonb, 'in_stock'),

('30ML Ciggy Flavor Shots', '30ML Ciggy Flavor Shots', 60, 'diy-flavors-components', 'ciggy-flavors', 
'{"volume": "30ml"}'::jsonb, 'in_stock'),

('Lume Flavor Shot 15ml (Nic Salt)', '15 מ"ל תמצית לום / Lume בבקבוק 30 מ"ל עם 20 מ"ג ניק. מלח', 45, 'diy-flavors-components', 'lume-flavors', 
'{"volume": "15ml", "nicotine": "20mg Nic Salt", "bottle_size": "30ml"}'::jsonb, 'in_stock'),

('Lume Flavor Shot 30ml (3mg Nic)', '30 מ"ל תמצית לום / Lume בבקבוק 100 מ"ל עם 3 מ"ג ניקוטין', 50, 'diy-flavors-components', 'lume-flavors', 
'{"volume": "30ml", "nicotine": "3mg", "bottle_size": "100ml"}'::jsonb, 'in_stock'),

-- Accessories
('Sony VTC6 18650 Battery', 'Sony VTC6 18650 3000mAh 20A/30A Battery', 50, 'accessories', 'batteries', 
'{"capacity": "3000mAh", "model": "18650", "discharge": "20A/30A"}'::jsonb, 'in_stock'),

('Samsung 25R 18650 Battery', 'Samsung 25R 18650 2500mAh Battery', 45, 'accessories', 'batteries', 
'{"capacity": "2500mAh", "model": "18650"}'::jsonb, 'in_stock'),

('Lost Vape Centaurus Replacement Glass', 'Lost Vape Centaurus Tank Replacement Bubble Glass 5ml', 15, 'accessories', 'replacement-glass', 
'{"volume": "5ml", "type": "Bubble Glass"}'::jsonb, 'in_stock'),

('Generic Replacement Glass 2ml', 'זכוכית חלופית 2 מ"ל', 15, 'accessories', 'replacement-glass', 
'{"volume": "2ml", "type": "Straight Glass"}'::jsonb, 'in_stock'),

-- Flavor Essences (Flavors)
('WS-23 Cooler Ice Ciggy', 'WS-23 (20%) Cooler / Ice Ciggy קולר אייס קור', 35, 'flavors', 'cig-flavors', 
'{"concentration": "20%", "volumes": ["30ml", "50ml", "100ml", "500ml", "1 Liter", "5 Liter"]}'::jsonb, 'in_stock'),

('Super Sweet Sweetener Ciggy', 'Super Sweet ממתיק Ciggy', 25, 'flavors', 'flavor-enhancers', 
'{"type": "Sweetener", "volumes": ["30ml", "50ml", "100ml", "500ml", "1 Liter", "5 Liter"]}'::jsonb, 'in_stock'),

-- Tobacco substitutes (HNB Sticks)
('Neafs Heating Sticks Blue', 'מקלות לחימום Neafs Blue', 25, 'tobacco-substitutes', 'neafs-heating-sticks', 
'{"flavor": "Tobacco", "quantity": "20 sticks"}'::jsonb, 'in_stock'),

('Neafs Heating Sticks Menthol', 'מקלות לחימום Neafs Menthol', 25, 'tobacco-substitutes', 'neafs-heating-sticks', 
'{"flavor": "Menthol", "quantity": "20 sticks"}'::jsonb, 'in_stock');

-- Note: To make this script idempotent (safe to run multiple times), add a unique constraint:
-- ALTER TABLE public.products ADD CONSTRAINT products_name_en_unique UNIQUE (name_en);
-- Then change the INSERT to: INSERT INTO ... VALUES ... ON CONFLICT (name_en) DO NOTHING;
