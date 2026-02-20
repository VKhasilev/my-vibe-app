#!/usr/bin/env node
/**
 * Download product images from external URLs (e.g. cig.co.il) and store locally.
 *
 * Usage:
 *   node scripts/crawl/download-product-images.js
 *   node scripts/crawl/download-product-images.js --input scripts/crawl/output/product-image-urls.json
 *
 * Input: product-image-urls.json (or --input path)
 *   Array of { "id": "product-slug-or-id", "url": "https://..." } or simple ["url1", "url2"].
 * Output: public/product-images/{id}.{ext} and scripts/crawl/output/product-images-manifest.json
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..', '..')
const DEFAULT_INPUT = path.join(__dirname, 'output', 'product-image-urls.json')
const OUT_DIR = path.join(ROOT, 'public', 'product-images')

const DEFAULT_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
  'Referer': 'https://www.cig.co.il/',
}

const DELAY_MS = 400

function parseArgs() {
  const args = process.argv.slice(2)
  let inputPath = DEFAULT_INPUT
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--input' && args[i + 1]) {
      inputPath = path.resolve(ROOT, args[i + 1])
      break
    }
  }
  return { inputPath }
}

function loadUrlList(inputPath) {
  if (!fs.existsSync(inputPath)) {
    console.error('Input file not found:', inputPath)
    console.error('Create scripts/crawl/output/product-image-urls.json (run the crawler first) or pass --input path')
    process.exit(1)
  }
  const raw = fs.readFileSync(inputPath, 'utf8')
  const data = JSON.parse(raw)
  if (Array.isArray(data)) {
    return data.map((item, index) =>
      typeof item === 'string'
        ? { id: `product-${index + 1}`, url: item }
        : { id: item.id || `product-${index + 1}`, url: item.url }
    )
  }
  if (data.entries && Array.isArray(data.entries)) {
    return data.entries.map((e) => ({ id: e.id || e.slug || `product-${e.url}`, url: e.url }))
  }
  console.error('Expected JSON array or { "entries": [...] } in', inputPath)
  process.exit(1)
}

function getExtension(url, contentType) {
  try {
    const pathname = new URL(url).pathname
    const ext = path.extname(pathname).toLowerCase().replace(/^\./, '')
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif'].includes(ext)) return ext
  } catch (_) {}
  const map = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/avif': 'avif',
  }
  return map[contentType] || 'jpg'
}

function safeFilename(id) {
  return id.replace(/[^a-zA-Z0-9-_]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'image'
}

async function downloadOne(entry, index, total) {
  const { id, url } = entry
  const safeId = safeFilename(id)
  try {
    const res = await fetch(url, {
      headers: DEFAULT_HEADERS,
      redirect: 'follow',
    })
    if (!res.ok) {
      console.warn(`[${index + 1}/${total}] ${safeId}: HTTP ${res.status} ${url}`)
      return { id: safeId, url, localPath: null, error: `HTTP ${res.status}` }
    }
    const contentType = res.headers.get('content-type') || ''
    const ext = getExtension(url, contentType.split(';')[0].trim())
    const filename = `${safeId}.${ext}`
    const buffer = Buffer.from(await res.arrayBuffer())
    const outPath = path.join(OUT_DIR, filename)
    fs.mkdirSync(OUT_DIR, { recursive: true })
    fs.writeFileSync(outPath, buffer)
    const relativePath = `/product-images/${filename}`
    console.log(`[${index + 1}/${total}] ${safeId} -> ${filename}`)
    return { id: safeId, url, localPath: relativePath, filename }
  } catch (err) {
    console.warn(`[${index + 1}/${total}] ${safeId}: ${err.message}`)
    return { id: safeId, url, localPath: null, error: err.message }
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function main() {
  const { inputPath } = parseArgs()
  const entries = loadUrlList(inputPath)
  console.log('Input:', inputPath, '| Entries:', entries.length)
  console.log('Output dir:', OUT_DIR)

  const manifest = { generated: new Date().toISOString(), baseUrl: '/product-images/', images: [] }

  for (let i = 0; i < entries.length; i++) {
    const result = await downloadOne(entries[i], i, entries.length)
    manifest.images.push(result)
    if (i < entries.length - 1) await sleep(DELAY_MS)
  }

  const manifestDir = path.join(__dirname, 'output')
  fs.mkdirSync(manifestDir, { recursive: true })
  const manifestPath = path.join(manifestDir, 'product-images-manifest.json')
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8')
  console.log('Manifest written:', manifestPath)

  const ok = manifest.images.filter((m) => m.localPath).length
  console.log('Done.', ok, '/', entries.length, 'downloaded.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
