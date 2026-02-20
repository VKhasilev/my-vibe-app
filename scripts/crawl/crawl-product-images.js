#!/usr/bin/env node
/**
 * Crawl a site to discover product images and full product details (name, price, description).
 * Reads category URLs from config; outputs crawled-products.json (SQL-ready format) and
 * optionally product-image-urls.json for download-product-images.js.
 *
 * Usage:
 *   node scripts/crawl/crawl-product-images.js --config scripts/crawl/crawl-config.json
 *   node scripts/crawl/crawl-product-images.js --config scripts/crawl/diy-crawl-config.json --images-only
 *
 * Config must contain "categories": [ { "url", "category_id", "subcategory_id"? }, ... ]
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import * as cheerio from 'cheerio'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..', '..')

const DEFAULT_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9,he;q=0.8',
  'Referer': 'https://www.cig.co.il/',
}

const DEFAULT_DELAY_MS = 600

/** Skip these pathnames (section/nav pages, not product listings). */
const SKIP_PATHS = new Set(['diy', 'register', 'myorders', 'login', 'cart', 'checkout', 'account', 'search', ''])

const DEFAULT_CONFIG = {
  baseUrl: 'https://www.cig.co.il',
  /** Required: list of category listing pages and their DB category/subcategory ids. */
  categories: [],
  /** Output directory for all artifacts (relative to project root). Default: scripts/crawl/output */
  outputDir: 'scripts/crawl/output',
  /** If true, only extract image URLs from listing (no product page fetch, no details). */
  imagesOnly: false,
  /** Selectors for listing page (CS-Cart / cig.co.il). */
  productCardLinkSelector: 'a[href*=".html"]',
  productCardImageSelector: 'img[src*="thumbnails"], img[src*="/detailed/"]',
  /** Selectors for product detail page. */
  productTitleSelector: 'h1, .ty-product-block-title',
  productPriceSelector: '.ty-price-num, .ty-price .ty-list-price, .ty-price, [class*="ty-price"]',
  productDescriptionSelector: 'meta[name="description"]',
  /** Main product image on product page (prefer 600px width / large thumbnail over listing thumbnail). */
  productImageSelector: '.ty-product-img img[src*="thumbnails"], .ty-product-img img[src*="detailed"], img.cm-image[src*="600"], img[src*="/600/"], .ty-pict.cm-image[src*="detailed"], img[src*="thumbnails"]',
  /** Leave image URL as-is (thumbnail URLs work; "full size" variant often 404). Set to false to try converting thumbnail path to full-size. */
  keepOriginalImageUrl: true,
  maxProducts: 2000,
  delayMs: DEFAULT_DELAY_MS,
  resolveImageUrl: (src, pageUrl) => {
    if (!src || src.startsWith('data:')) return null
    try { return new URL(src, pageUrl).href } catch { return null }
  },
}

function parseArgs() {
  const args = process.argv.slice(2)
  let configPath = null
  let imagesOnly = false
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--config' && args[i + 1]) configPath = path.resolve(ROOT, args[i + 1])
    if (args[i] === '--images-only') imagesOnly = true
  }
  return { configPath, imagesOnly }
}

function loadConfig(configPath) {
  const base = { ...DEFAULT_CONFIG }
  const pathToUse = configPath || path.join(__dirname, 'crawl-config.json')
  if (fs.existsSync(pathToUse)) {
    const custom = JSON.parse(fs.readFileSync(pathToUse, 'utf8'))
    Object.assign(base, custom)
  } else if (!configPath) {
    console.warn('No crawl-config.json found; using defaults. Create from crawl-config.example.json in scripts/crawl/')
  }
  return base
}

async function fetchHtml(url) {
  const res = await fetch(url, { headers: DEFAULT_HEADERS, redirect: 'follow' })
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`)
  return res.text()
}

function slugFromUrl(url) {
  try {
    const pathname = new URL(url).pathname
    const segment = pathname.split('/').filter(Boolean).pop() || ''
    return segment.replace(/\.html$/i, '')
  } catch {
    return null
  }
}

/** Remove duplicate .webp (e.g. .webp.webp or .jpg.webp) so the URL resolves; site often adds .webp and causes 404. */
function normalizeImageUrl(url) {
  if (!url || typeof url !== 'string') return url
  return url.replace(/\.(webp|jpg|jpeg|png|gif)\.webp$/i, '.$1')
}

/** Parse price from text (e.g. "₪ 45.00" or "45,00"). */
function parsePrice(text) {
  if (text == null) return null
  const cleaned = String(text).replace(/[^\d.,]/g, '').replace(',', '.')
  const num = parseFloat(cleaned)
  return Number.isFinite(num) ? num : null
}

/** Strip HTML and normalize whitespace. */
function stripHtml(html) {
  if (!html) return ''
  return String(html).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

/** Extract product cards from listing: { slug, productUrl, imageUrl }[]. */
function extractProductCardsFromListing($, pageUrl, config) {
  const entries = []
  const seen = new Set()
  const { productCardLinkSelector, productCardImageSelector, resolveImageUrl } = config

  $(productCardLinkSelector).each((_, el) => {
    const $a = $(el)
    const href = $a.attr('href')
    if (!href) return
    const $img = $a.find(productCardImageSelector).first()
    if (!$img.length) return
    const src = $img.attr('src') || $img.attr('data-src')
    const imgUrl = resolveImageUrl(src, pageUrl)
    if (!imgUrl || imgUrl.includes('logo') || imgUrl.includes('placeholder')) return
    try {
      const full = new URL(href, pageUrl).href
      const slug = slugFromUrl(full)
      if (!slug || SKIP_PATHS.has(slug) || slug.length < 4) return
      if (seen.has(slug)) return
      seen.add(slug)
      let finalImg = imgUrl || ''
      if (finalImg.includes('/thumbnails/'))
        finalImg = finalImg.replace(/\/thumbnails\/\d+\/\d+/, '') || finalImg
      finalImg = normalizeImageUrl(finalImg)
      entries.push({ slug, productUrl: full, imageUrl: finalImg })
    } catch (_) {}
  })
  return entries
}

/** Extract product details from product page HTML. */
function extractProductDetails(html, productUrl, listingImageUrl, config) {
  const $ = cheerio.load(html)
  const slug = slugFromUrl(productUrl)

  let name_en = ''
  const $title = $(config.productTitleSelector).first()
  if ($title.length) {
    name_en = stripHtml($title.html() || '').trim()
    if (name_en.length > 500) name_en = name_en.slice(0, 500)
  }
  if (!name_en && slug) name_en = slug.replace(/-/g, ' ')

  let description_en = null
  const $meta = $(config.productDescriptionSelector).first()
  if ($meta.length) {
    const content = $meta.attr('content')
    if (content) description_en = content.trim().slice(0, 2000)
  }

  let price = null
  $(config.productPriceSelector).each((_, el) => {
    const text = $(el).text()
    const p = parsePrice(text)
    if (p != null && p > 0 && p < 100000) {
      price = p
      return false
    }
  })
  if (price == null) {
    const priceBlock = $('[id^="price_update"], .ty-product-block-price').first().text()
    price = parsePrice(priceBlock)
  }
  if (price == null) price = 0

  let imageUrl = null
  let fallbackUrl = null
  const $imgs = $(config.productImageSelector)
  for (let i = 0; i < $imgs.length; i++) {
    const src = $($imgs[i]).attr('src') || $($imgs[i]).attr('data-src') || $($imgs[i]).attr('data-large_image')
    const resolved = config.resolveImageUrl(src, productUrl)
    if (resolved && !resolved.includes('logo') && !resolved.includes('placeholder')) {
      if (resolved.includes('/600/') || resolved.includes('600/450')) {
        imageUrl = resolved
        break
      }
      if (!fallbackUrl) fallbackUrl = resolved
    }
  }
  if (!imageUrl) imageUrl = fallbackUrl
  if (!imageUrl) imageUrl = listingImageUrl
  // Always use full-size image URL: strip /thumbnails/WIDTH/HEIGHT → .../images/detailed/...
  if (imageUrl && imageUrl.includes('/thumbnails/'))
    imageUrl = imageUrl.replace(/\/thumbnails\/\d+\/\d+/, '') || imageUrl
  imageUrl = normalizeImageUrl(imageUrl)

  return {
    slug,
    name_en: name_en || slug,
    name_he: name_en,
    description_en,
    description_he: null,
    price,
    image_url: imageUrl,
    stock_status: 'in_stock',
    specs: null,
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function main() {
  const { configPath, imagesOnly } = parseArgs()
  const config = loadConfig(configPath)
  const categories = config.categories || []
  const imagesOnlyMode = imagesOnly || config.imagesOnly

  const useCategories = categories.length > 0
  const startUrls = config.startUrls || []
  const urlList = useCategories
    ? categories.map((c) => ({ url: c.url, category_id: c.category_id, subcategory_id: c.subcategory_id ?? null }))
    : startUrls.map((url) => ({ url, category_id: 'unknown', subcategory_id: null }))

  if (!urlList.length) {
    console.error('Config must contain "categories": [ { "url", "category_id", "subcategory_id"? }, ... ] or "startUrls": ["..."].')
    console.error('Copy scripts/crawl/crawl-config.example.json to scripts/crawl/crawl-config.json and set your category URLs.')
    process.exit(1)
  }

  if (!useCategories && !imagesOnlyMode) {
    console.warn('No "categories" in config; running in images-only mode. Add categories for full product details.')
    config.imagesOnly = true
  }

  const delay = config.delayMs ?? DEFAULT_DELAY_MS
  const seenSlugs = new Set()
  const products = []
  const imageEntries = []
  const imagesOnlyModeFinal = imagesOnlyMode || config.imagesOnly || !useCategories

  const outDir = path.resolve(ROOT, config.outputDir || 'scripts/crawl/output')
  const crawledFileName = 'crawled-products.json'
  const imageUrlsFileName = 'product-image-urls.json'

  fs.mkdirSync(outDir, { recursive: true })
  for (const f of [crawledFileName, imageUrlsFileName]) {
    const p = path.join(outDir, f)
    if (fs.existsSync(p)) {
      fs.unlinkSync(p)
      console.log('Cleaned up previous output:', path.join(path.relative(ROOT, outDir), f))
    }
  }

  console.log('Crawling', urlList.length, 'URL(s)...', imagesOnlyModeFinal ? '(images only)' : '(full details)')

  for (const cat of urlList) {
    const { url: listUrl, category_id, subcategory_id } = cat
    if (!listUrl) continue
    if (!imagesOnlyModeFinal && category_id === 'unknown') continue
    try {
      const html = await fetchHtml(listUrl)
      const $ = cheerio.load(html)
      const cards = extractProductCardsFromListing($, listUrl, config)

      for (const card of cards) {
        if (products.length >= (config.maxProducts || 2000)) break
        if (seenSlugs.has(card.slug)) continue
        seenSlugs.add(card.slug)

        if (imagesOnlyModeFinal) {
          imageEntries.push({ id: card.slug, url: card.imageUrl })
          console.log(`  [${imageEntries.length}] ${card.slug}`)
          continue
        }

        try {
          await sleep(delay)
          const productHtml = await fetchHtml(card.productUrl)
          const details = extractProductDetails(productHtml, card.productUrl, card.imageUrl, config)
          const record = {
            ...details,
            category_id,
            subcategory_id: subcategory_id || null,
          }
          products.push(record)
          console.log(`  [${products.length}] ${card.slug} | ${record.name_en?.slice(0, 40)}... | ₪${record.price}`)
        } catch (e) {
          console.warn('  Skip', card.slug, e.message)
        }
      }
      await sleep(delay)
    } catch (e) {
      console.warn('Skip category', listUrl, e.message)
    }
  }

  if (imagesOnlyModeFinal) {
    const outPath = path.join(outDir, imageUrlsFileName)
    fs.writeFileSync(outPath, JSON.stringify(imageEntries, null, 2), 'utf8')
    console.log('Wrote', imageEntries.length, 'image URLs to', outPath)
    console.log('Run: node scripts/crawl/download-product-images.js --input', path.join(path.relative(ROOT, outDir), imageUrlsFileName))
    return
  }

  const crawledPath = path.join(outDir, crawledFileName)
  fs.writeFileSync(crawledPath, JSON.stringify(products, null, 2), 'utf8')
  console.log('Wrote', products.length, 'products to', crawledPath)

  const imageList = products.filter((p) => p.image_url).map((p) => ({ id: p.slug, url: p.image_url }))
  if (imageList.length) {
    fs.writeFileSync(path.join(outDir, imageUrlsFileName), JSON.stringify(imageList, null, 2), 'utf8')
    console.log('Also wrote', imageUrlsFileName, 'for download script.')
  }

  console.log('To generate SQL: node scripts/crawl/crawled-products-to-sql.js --output-dir', path.relative(ROOT, outDir))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
