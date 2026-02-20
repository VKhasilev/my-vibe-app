#!/usr/bin/env node
/**
 * Convert crawled-products.json to SQL INSERT statements for public.products.
 * Writes seed-products.sql in the same directory as the input (or --output path).
 *
 * Usage: node scripts/crawl/crawled-products-to-sql.js
 *        node scripts/crawl/crawled-products-to-sql.js --output-dir scripts/crawl/output
 *        node scripts/crawl/crawled-products-to-sql.js --output-dir output/diy
 *        node scripts/crawl/crawled-products-to-sql.js --input path/to/crawled-products.json --output path/to/seed-products.sql
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..', '..')

function parseArgs() {
  const args = process.argv.slice(2)
  let input = path.join(__dirname, 'output', 'crawled-products.json')
  let output = path.join(__dirname, 'output', 'seed-products.sql')
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--output-dir' && args[i + 1]) {
      const dir = path.resolve(ROOT, args[i + 1])
      input = path.join(dir, 'crawled-products.json')
      output = path.join(dir, 'seed-products.sql')
    }
    if (args[i] === '--input' && args[i + 1]) input = path.resolve(ROOT, args[i + 1])
    if (args[i] === '--output' && args[i + 1]) output = path.resolve(ROOT, args[i + 1])
  }
  return { input, output }
}

function escapeSql(str) {
  if (str == null) return 'NULL'
  return "'" + String(str).replace(/'/g, "''") + "'"
}

function run() {
  const { input, output } = parseArgs()
  if (!fs.existsSync(input)) {
    console.error('Input not found:', input)
    process.exit(1)
  }

  const products = JSON.parse(fs.readFileSync(input, 'utf8'))
  const lines = [
    '-- Generated from crawled-products.json. Run after schema and seed-categories-subcategories.sql.',
    '-- Products from crawl; image_url may be external (run download-product-images.js and replace with /product-images/... if needed).',
    '',
    'INSERT INTO public.products (name_en, name_he, description_en, description_he, price, image_url, category_id, subcategory_id, stock_status, specs) VALUES',
  ]

  for (let i = 0; i < products.length; i++) {
    const p = products[i]
    const name_en = escapeSql(p.name_en ?? '')
    const name_he = escapeSql(p.name_he ?? p.name_en ?? '')
    const desc_en = p.description_en != null ? escapeSql(p.description_en) : 'NULL'
    const desc_he = p.description_he != null ? escapeSql(p.description_he) : 'NULL'
    const price = Number(p.price) || 0
    const image_url = p.image_url != null ? escapeSql(p.image_url) : 'NULL'
    const category_id = escapeSql(p.category_id)
    const subcategory_id = p.subcategory_id != null ? escapeSql(p.subcategory_id) : 'NULL'
    const stock_status = escapeSql(p.stock_status ?? 'in_stock')
    const specs = p.specs != null ? `'${JSON.stringify(p.specs).replace(/'/g, "''")}'::jsonb` : 'NULL'

    const row = `(${name_en}, ${name_he}, ${desc_en}, ${desc_he}, ${price}, ${image_url}, ${category_id}, ${subcategory_id}, ${stock_status}, ${specs})`
    lines.push((i < products.length - 1 ? row + ',' : row + ';'))
  }

  fs.mkdirSync(path.dirname(output), { recursive: true })
  fs.writeFileSync(output, lines.join('\n'), 'utf8')
  console.log('Wrote', products.length, 'rows to', output)
}

run()
