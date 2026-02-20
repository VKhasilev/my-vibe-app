import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useCategories, useSubcategories } from '../hooks/useSupabaseData'

const ADMIN_FLAG_KEY = 'vibeshop-admin'

export default function AdminAddProductPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { categories } = useCategories()
  const [isAuthed, setIsAuthed] = useState(
    () => localStorage.getItem(ADMIN_FLAG_KEY) === 'true'
  )
  const [password, setPassword] = useState('')
  const [form, setForm] = useState({
    name_en: '',
    name_he: '',
    description_en: '',
    description_he: '',
    price: '',
    image_url: '',
    category_id: '',
    subcategory_id: '',
    stock_status: 'in_stock',
    specs: '',
  })
  const { subcategories } = useSubcategories(form.category_id)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('') // 'success' or 'error'

  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'changeme'

  const handleAuth = (e) => {
    e.preventDefault()
    if (password === adminPassword) {
      localStorage.setItem(ADMIN_FLAG_KEY, 'true')
      setIsAuthed(true)
      setMessage('')
      setPassword('')
    } else {
      setMessage('Invalid password')
      setMessageType('error')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => {
      // Reset subcategory_id when category changes
      if (name === 'category_id') {
        return { ...prev, [name]: value, subcategory_id: '' }
      }
      return { ...prev, [name]: value }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setMessageType('')

    // Parse specs JSON if provided
    let specsJson = null
    if (form.specs.trim()) {
      try {
        specsJson = JSON.parse(form.specs)
      } catch (err) {
        setMessage('Invalid JSON in specs field')
        setMessageType('error')
        setLoading(false)
        return
      }
    }

    const { error } = await supabase.from('products').insert({
      name_en: form.name_en,
      name_he: form.name_he,
      description_en: form.description_en || null,
      description_he: form.description_he || null,
      price: Number(form.price) || 0,
      image_url: form.image_url || null,
      category_id: form.category_id || null,
      subcategory_id: form.subcategory_id || null,
      stock_status: form.stock_status,
      specs: specsJson,
    })

    if (error) {
      setMessage(error.message)
      setMessageType('error')
    } else {
      setMessage('Product added successfully!')
      setMessageType('success')
      setForm({
        name_en: '',
        name_he: '',
        description_en: '',
        description_he: '',
        price: '',
        image_url: '',
        category_id: '',
        subcategory_id: '',
        stock_status: 'in_stock',
        specs: '',
      })
    }
    setLoading(false)
  }

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_FLAG_KEY)
    setIsAuthed(false)
    navigate('/')
  }

  if (!isAuthed) {
    return (
      <div className="max-w-md mx-auto py-16">
        <h1 className="text-2xl font-bold text-white mb-4">
          Admin Login
        </h1>
        <form onSubmit={handleAuth} className="space-y-4 glass p-6 rounded-2xl">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-transparent border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Admin password"
            required
          />
          {message && (
            <p className={`text-sm ${messageType === 'error' ? 'text-red-400' : 'text-green-400'}`}>
              {message}
            </p>
          )}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold hover:from-indigo-600 hover:to-purple-600 transition-all"
          >
            Enter
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-16">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">
          Add Product
        </h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-xl glass text-white/80 hover:bg-white/20 transition-colors text-sm"
        >
          Logout
        </button>
      </div>

      <form onSubmit={handleSubmit} className="glass p-6 rounded-2xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white/80 text-sm mb-2">Name (EN) *</label>
            <input
              name="name_en"
              value={form.name_en}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-transparent border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-white/80 text-sm mb-2">Name (HE) *</label>
            <input
              name="name_he"
              value={form.name_he}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-transparent border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-white/80 text-sm mb-2">Description (EN)</label>
          <textarea
            name="description_en"
            value={form.description_en}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-transparent border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-white/80 text-sm mb-2">Description (HE)</label>
          <textarea
            name="description_he"
            value={form.description_he}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-transparent border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white/80 text-sm mb-2">Price *</label>
            <input
              type="number"
              step="0.01"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-transparent border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-white/80 text-sm mb-2">Stock Status</label>
            <select
              name="stock_status"
              value={form.stock_status}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-transparent border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="in_stock" className="bg-slate-900">In Stock</option>
              <option value="out_of_stock" className="bg-slate-900">Out of Stock</option>
              <option value="preorder" className="bg-slate-900">Preorder</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-white/80 text-sm mb-2">Image URL</label>
          <input
            type="url"
            name="image_url"
            value={form.image_url}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-transparent border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white/80 text-sm mb-2">Category</label>
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-transparent border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="" className="bg-slate-900">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-slate-900">
                  {cat.name_en}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-white/80 text-sm mb-2">Subcategory</label>
            <select
              name="subcategory_id"
              value={form.subcategory_id}
              onChange={handleChange}
              disabled={!form.category_id}
              className="w-full px-4 py-3 rounded-xl bg-transparent border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="" className="bg-slate-900">
                {form.category_id ? 'Select subcategory' : 'Select category first'}
              </option>
              {subcategories.map((sub) => (
                <option key={sub.id} value={sub.id} className="bg-slate-900">
                  {sub.name_en}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-white/80 text-sm mb-2">Specs (JSON)</label>
          <textarea
            name="specs"
            value={form.specs}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-transparent border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-mono text-sm"
            placeholder='{"feature1": "value1", "feature2": "value2"}'
          />
          <p className="text-xs text-white/50 mt-1">Optional: JSON object for product specifications</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold hover:from-indigo-600 hover:to-purple-600 disabled:opacity-60 transition-all"
        >
          {loading ? 'Saving…' : 'Save Product'}
        </button>

        {message && (
          <p className={`text-sm mt-2 ${messageType === 'error' ? 'text-red-400' : 'text-green-400'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  )
}
