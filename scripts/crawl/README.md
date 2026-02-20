# Product crawl, download, and SQL export

All scripts and configs live in **`scripts/crawl/`**. Output goes to **`scripts/crawl/output/`** by default (or to `outputDir` in config).

## 1. Config with category links

Create `scripts/crawl/crawl-config.json` from the example. **Required: `categories`** — list every category/subcategory listing URL and the corresponding DB ids.

```json
{
  "baseUrl": "https://www.cig.co.il",
  "outputDir": "scripts/crawl/output",
  "categories": [
    { "url": "https://www.cig.co.il/diy.html", "category_id": "diy-flavors-components", "subcategory_id": null },
    { "url": "https://www.cig.co.il/diy/ciggy-flavor-shots.html", "category_id": "diy-flavors-components", "subcategory_id": "ciggy-flavors" }
  ],
  "keepOriginalImageUrl": true,
  "maxProducts": 2000,
  "delayMs": 600
}
```

- **outputDir**: directory (relative to project root) for artifacts. Default: `scripts/crawl/output`. Files: `crawled-products.json`, `product-image-urls.json`.
- **url**, **category_id**, **subcategory_id**: category listing URL and DB ids.
- **keepOriginalImageUrl**: `true` (default) keeps the image URL from the listing (avoids 404).

See `crawl-config.example.json` in this folder.

**Per-category configs** (same structure, each with its own `outputDir` and category URLs):

| Config | Output dir | Categories |
|--------|------------|------------|
| `diy-crawl-config.json` | `scripts/crawl/diy` | DIY flavors, bottles, syringes, etc. |
| `electronic-cigarettes-crawl-config.json` | `scripts/crawl/electronic-cigarettes` | CBD pens, disposables, mods, pod kits |
| `coils-crawl-config.json` | `scripts/crawl/coils` | Coils by brand (Aspire, Vaporesso, etc.) |
| `tanks-crawl-config.json` | `scripts/crawl/tanks` | MTL tanks, sub-ohm tanks |
| `accessories-crawl-config.json` | `scripts/crawl/accessories` | Adapters, drip tips, cotton, chargers, batteries |
| `flavors-crawl-config.json` | `scripts/crawl/flavors` | Raw/concentrate flavors (Capella, TPA, etc.) |
| `tobacco-substitutes-crawl-config.json` | `scripts/crawl/tobacco-substitutes` | Nicotine pouches, HNB devices/sticks |

Example: `node scripts/crawl/crawl-product-images.js --config scripts/crawl/electronic-cigarettes-crawl-config.json`

## 2. Crawl for full product details

```bash
node scripts/crawl/crawl-product-images.js --config scripts/crawl/crawl-config.json
```

Or use the DIY config:

```bash
node scripts/crawl/crawl-product-images.js --config scripts/crawl/diy-crawl-config.json
```

Writes `{outputDir}/crawled-products.json` and `{outputDir}/product-image-urls.json`.

## 3. Images-only mode

```bash
node scripts/crawl/crawl-product-images.js --config scripts/crawl/diy-crawl-config.json --images-only
```

## 4. Generate SQL from crawled data

Use the same **outputDir** so the SQL file lives with the crawl artifacts:

```bash
node scripts/crawl/crawled-products-to-sql.js --output-dir scripts/crawl/output
```

Reads `scripts/crawl/output/crawled-products.json` and writes **`scripts/crawl/output/seed-products.sql`**.

Options: `--output-dir path`, `--input path`, `--output path`.

## 5. Download images locally

```bash
node scripts/crawl/download-product-images.js --input scripts/crawl/output/product-image-urls.json
```

If you use the default config, the crawler writes to `scripts/crawl/output/`, so you can run without `--input`:

```bash
node scripts/crawl/download-product-images.js
```

- Saves files under **`public/product-images/{id}.{ext}`**.
- Writes **`scripts/crawl/output/product-images-manifest.json`**.

## Summary

| Step | Command | Output |
|------|--------|--------|
| 1 | Create `scripts/crawl/crawl-config.json` from example | — |
| 2 | `node scripts/crawl/crawl-product-images.js --config scripts/crawl/diy-crawl-config.json` | `scripts/crawl/output/crawled-products.json`, `product-image-urls.json` |
| 3 | `node scripts/crawl/crawled-products-to-sql.js --output-dir scripts/crawl/output` | `scripts/crawl/output/seed-products.sql` |
| 4 | `node scripts/crawl/download-product-images.js` | `public/product-images/*`, `scripts/crawl/output/product-images-manifest.json` |

All crawl artifacts live under **`scripts/crawl/output/`** (or your `outputDir`). Run the generated SQL in Supabase after `schema.sql` and `seed-categories-subcategories.sql`.
