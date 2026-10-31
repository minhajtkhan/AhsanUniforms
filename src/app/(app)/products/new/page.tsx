'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { INITIAL_CATEGORIES } from '@/lib/data/sample-data'
import {
  Package,
  ArrowLeft,
  Barcode,
  Sparkles,
  Save,
  Boxes,
  Tag,
  DollarSign,
  AlertCircle,
} from 'lucide-react'
import { toast } from 'sonner'

export default function NewProductPage() {
  const router = useRouter()
  const [categories] = useState(INITIAL_CATEGORIES)

  const [formData, setFormData] = useState({
    name: '',
    category_id: categories[0].id,
    unit: 'piece',
    cost_price: 100,
    selling_price: 150,
    stock_quantity: 25,
    low_stock_threshold: 10,
    sku: '',
    barcode: '',
    description: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Live profit margin calculation
  const cost = Number(formData.cost_price) || 0
  const selling = Number(formData.selling_price) || 0
  const profit = selling - cost
  const margin = selling > 0 ? Math.round((profit / selling) * 100) : 0

  const handleGenerateSKU = () => {
    const cat = categories.find((c) => c.id === formData.category_id)?.name.slice(0, 3).toUpperCase() || 'PRD'
    const namePart = (formData.name.slice(0, 3) || 'ITM').toUpperCase()
    const rand = Math.floor(1000 + Math.random() * 9000)
    setFormData((prev) => ({ ...prev, sku: `${cat}-${namePart}-${rand}` }))
    toast.info('Generated unique SKU!')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast.error('Please enter the product title')
      return
    }

    setIsSubmitting(true)

    // Simulate saving (and if using Supabase client, inserts into DB)
    setTimeout(() => {
      setIsSubmitting(false)
      toast.success(`Product "${formData.name}" created successfully!`)
      router.push('/products')
    }, 400)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Top Bar with Back Link */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <Link
          href="/products"
          prefetch={true}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
        <span className="text-xs text-slate-400 font-medium">Step 1 of 1 — Product Entry</span>
      </div>

      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
          <Package className="w-7 h-7 text-indigo-600" />
          <span>Add New Product</span>
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Enter product details, wholesale cost, selling rate, and initial stock quantities
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* CARD 1: General Details */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Tag className="w-5 h-5 text-indigo-600" />
            <span>Product Identification</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Product Title / Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Oxford Progressive English Book 4 or White Shirt Size 32"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-base text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Unit of Measure
                </label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="piece">Piece (Individual)</option>
                  <option value="pack">Pack / Packet</option>
                  <option value="box">Box</option>
                  <option value="dozen">Dozen</option>
                  <option value="set">Set / Pair</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: Pricing & Profit Margin */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <span>Pricing & Profit Margins (PKR)</span>
            </h2>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full border ${
                profit >= 0
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-red-50 text-red-700 border-red-200'
              }`}
            >
              {profit >= 0 ? `+${margin}% Profit Margin (Rs. ${profit})` : `Loss of Rs. ${Math.abs(profit)}`}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Cost Price (Purchase Rate) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">Rs.</span>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.5"
                  value={formData.cost_price}
                  onChange={(e) => setFormData({ ...formData, cost_price: parseFloat(e.target.value) || 0 })}
                  className="w-full pl-12 pr-4 py-2.5 border border-slate-200 rounded-xl text-base font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Wholesale price bought from vendor</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Selling Price (Retail Counter Rate) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-500 font-bold text-sm">Rs.</span>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.5"
                  value={formData.selling_price}
                  onChange={(e) => setFormData({ ...formData, selling_price: parseFloat(e.target.value) || 0 })}
                  className="w-full pl-12 pr-4 py-2.5 border border-slate-200 rounded-xl text-base font-bold text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Price charged to customer on bill</p>
            </div>
          </div>
        </div>

        {/* CARD 3: Stock Levels */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Boxes className="w-5 h-5 text-indigo-600" />
            <span>Inventory & Stock Thresholds</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Initial Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.stock_quantity}
                onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">Current units in shop shelves or storage</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Low Stock Alert Trigger <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.low_stock_threshold}
                onChange={(e) => setFormData({ ...formData, low_stock_threshold: parseInt(e.target.value) || 10 })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">Alerts dashboard when stock falls to this count</p>
            </div>
          </div>
        </div>

        {/* CARD 4: SKU & Barcode */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Barcode className="w-5 h-5 text-indigo-600" />
            <span>Barcode & SKU Code</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  SKU (Stock Keeping Unit)
                </label>
                <button
                  type="button"
                  onClick={handleGenerateSKU}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Auto-Generate</span>
                </button>
              </div>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="Click auto-generate or enter custom SKU"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Barcode Number (Optional)
              </label>
              <input
                type="text"
                value={formData.barcode}
                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                placeholder="Scan barcode with handheld scanner..."
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-3">
          <Link
            href="/products"
            className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold text-sm transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-indigo-100 text-sm cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Saving Product...' : 'Save & Publish Product'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
