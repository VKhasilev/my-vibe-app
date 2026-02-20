import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Package, Zap, Battery, Droplet, Wrench, Sparkles, Leaf } from 'lucide-react'

// Map icon strings from DB -> Lucide components
const iconMap = {
  Package,
  Zap,
  Battery,
  Droplet,
  Wrench,
  Sparkles,
  Leaf,
}

// Display order: exactly as provided (DIY → Electronic cigarettes → Coils & Pods → Tanks → Accessories → Flavors → Tobacco substitutes)
const CATEGORY_ORDER = [
  'diy-flavors-components',
  'electronic-cigarettes',
  'coils-pods',
  'tanks',
  'accessories',
  'flavors',
  'tobacco-substitutes',
]

// Subcategory display order per category (ids in order)
const SUBCATEGORY_ORDER_BY_CATEGORY = {
  'diy-flavors-components': ['ciggy-flavors', 'lume-flavors', 'aisu-flavors', 'iceix-flavors', 'pg-vg-nicotine', 'bottles', 'syringes'],
  'electronic-cigarettes': ['pod-kits', 'advanced-kits', 'advanced-mods', 'empty-disposables', 'prefilled-disposables', 'cbd-vaporizers'],
  'coils-pods': ['aspire-coils', 'bmor-coils', 'ciggy-coils', 'freemax-coils', 'geekvape-coils', 'lost-vape-coils', 'mipod-coils', 'nevoks-coils', 'oxva-coils', 'obs-coils', 'smok-coils', 'vaporesso-coils', 'voopoo-coils', 'justfog-coils'],
  'tanks': ['sub-ohm-tanks', 'mtl-tanks'],
  'accessories': ['batteries', 'chargers', 'replacement-glass', 'cotton', 'replacement-drip-tips', 'thread-adapters'],
  'flavors': ['cig-flavors', 'capella-flavors', 'flavorah-flavors', 'tpa-flavors', 'inawera-flavors', 'flavor-enhancers', 'iff-flavors', 'smoke-flavors', 'flavourart-flavors', 'raw-flavors', 'vampire-vape-flavors', 'riot-squad-flavors'],
  'tobacco-substitutes': ['neafs-heating-sticks', 'tobacco-heating-devices', 'zylo-nicotine-pouches'],
}

function sortByOrder(items, orderIds) {
  const byId = new Map(items.map((item) => [item.id, item]))
  const result = []
  for (const id of orderIds) {
    if (byId.has(id)) result.push(byId.get(id))
  }
  // Append any items not in order (e.g. new DB rows) at the end
  for (const item of items) {
    if (!orderIds.includes(item.id)) result.push(item)
  }
  return result
}

export function useCategories() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function fetchCategories() {
      try {
        setLoading(true)
        const { data: rows, error: fetchError } = await supabase
          .from('categories')
          .select('*')

        if (!isMounted) return

        if (fetchError) {
          console.error('Error fetching categories:', fetchError)
          setError(fetchError)
          setData([])
        } else {
          const withIcons = rows.map((row) => ({
            ...row,
            icon: iconMap[row.icon] || Package,
            titleKey: `categories.${row.id.replace(/-/g, '')}`,
          }))
          setData(sortByOrder(withIcons, CATEGORY_ORDER))
        }
      } catch (err) {
        if (!isMounted) return
        console.error('Unexpected error:', err)
        setError(err)
        setData([])
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchCategories()
    return () => {
      isMounted = false
    }
  }, [])

  return { categories: data, loading, error }
}

export function useSubcategories(categoryId) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!categoryId) {
      setData([])
      setLoading(false)
      return
    }

    let isMounted = true

    async function fetchSubcategories() {
      try {
        setLoading(true)
        const { data: rows, error: fetchError } = await supabase
          .from('subcategories')
          .select('*')
          .eq('category_id', categoryId)

        if (!isMounted) return

        if (fetchError) {
          console.error('Error fetching subcategories:', fetchError)
          setError(fetchError)
          setData([])
        } else {
          const order = SUBCATEGORY_ORDER_BY_CATEGORY[categoryId]
          setData(order ? sortByOrder(rows, order) : rows)
        }
      } catch (err) {
        if (!isMounted) return
        console.error('Unexpected error:', err)
        setError(err)
        setData([])
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchSubcategories()
    return () => {
      isMounted = false
    }
  }, [categoryId])

  return { subcategories: data, loading, error }
}

export function useProducts({ categoryId, subcategoryId } = {}) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function fetchProducts() {
      try {
        setLoading(true)
        let query = supabase.from('products').select('*')

        if (categoryId) {
          query = query.eq('category_id', categoryId)
        }
        if (subcategoryId) {
          query = query.eq('subcategory_id', subcategoryId)
        }

        const { data: rows, error: fetchError } = await query.order('name_en', { ascending: true })

        if (!isMounted) return

        if (fetchError) {
          console.error('Error fetching products:', fetchError)
          setError(fetchError)
          setData([])
        } else {
          // Transform products to match expected format
          const transformed = rows.map((product) => ({
            id: product.id,
            nameKey: null, // We'll use name_en/name_he directly
            name_en: product.name_en,
            name_he: product.name_he,
            price: parseFloat(product.price) || 0,
            categoryId: product.category_id,
            subcategoryId: product.subcategory_id,
            image: product.image_url,
            description_en: product.description_en,
            description_he: product.description_he,
            stock_status: product.stock_status,
            specs: product.specs,
          }))
          setData(transformed)
        }
      } catch (err) {
        if (!isMounted) return
        console.error('Unexpected error:', err)
        setError(err)
        setData([])
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchProducts()
    return () => {
      isMounted = false
    }
  }, [categoryId, subcategoryId])

  return { products: data, loading, error }
}
