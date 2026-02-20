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
          .order('name_en', { ascending: true })

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
          setData(withIcons)
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
          .order('name_en', { ascending: true })

        if (!isMounted) return

        if (fetchError) {
          console.error('Error fetching subcategories:', fetchError)
          setError(fetchError)
          setData([])
        } else {
          setData(rows)
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
