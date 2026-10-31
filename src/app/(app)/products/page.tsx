'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  type ProductItem,
} from '@/lib/data/sample-data'
import { formatCurrency } from '@/lib/utils'
import {
  Package,
  Plus,
  Search,
  AlertTriangle,
  Boxes,
  TrendingUp,
  Tag,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  Barcode,
  Layers,
  Shirt,
} from 'lucide-react'
import { toast } from 'sonner'

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS)
  const [categories] = useState(INITIAL_CATEGORIES)

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all')

  // Stock adjustment modal state
  const [adjustingProduct, setAdjustingProduct] = useState<ProductItem | null>(null)
  const [adjustAmount, setAdjustAmount] = useState<number>(0)

  // Quick stats
  const totalItems = products.length
  const totalStockValue = useMemo(() => {
    return products.reduce((sum, p) => sum + p.cost_price * p.stock_quantity, 0)
  }, [products])
  const lowStockCount = useMemo(() => {
    return products.filter((p) => p.stock_quantity > 0 && p.stock_quantity <= p.low_stock_threshold).length
  }, [products])
  const outOfStockCount = useMemo(() => {
    return products.filter((p) => p.stock_quantity === 0).length
  }, [products])

  // Filtered list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.barcode && p.barcode.includes(searchQuery))
      const matchesCategory =
        selectedCategory === 'all' || p.category_id === selectedCategory
      let matchesStock = true
      if (stockFilter === 'low') {
        matchesStock = p.stock_quantity <= p.low_stock_threshold && p.stock_quantity > 0
      } else if (stockFilter === 'out') {
        matchesStock = p.stock_quantity === 0
      }
      return matchesSearch && matchesCategory && matchesStock
    })
  }, [products, searchQuery, selectedCategory, stockFilter])

  const handleSaveStockAdjustment = () => {
    if (!adjustingProduct) return
    const newQty = Math.max(0, adjustingProduct.stock_quantity + adjustAmount)
    setProducts((prev) =>
      prev.map((p) =>
        p.id === adjustingProduct.id ? { ...p, stock_quantity: newQty } : p
      )
    )
    toast.success(`Stock updated for ${adjustingProduct.name}! New Qty: ${newQty}`)
    setAdjustingProduct(null)
    setAdjustAmount(0)
  }

  const handleDeleteProduct = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      setProducts((prev) => prev.filter((p) => p.id !== id))
      toast.success(`Product deleted`)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <Package className="w-7 h-7 text-indigo-600" />
            <span>Products & Inventory</span>
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Manage stationery, uniforms, copies, and real-time stock levels
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            href="/settings?tab=uniforms"
            className="inline-flex items-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 font-bold px-3.5 py-2.5 rounded-xl transition-all text-xs cursor-pointer shadow-2xs"
          >
            <Shirt className="w-4 h-4 text-amber-600" />
            <span>Uniform Size Pricing</span>
          </Link>
          <Link
            href="/products/new"
            prefetch={true}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-100 text-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Boxes className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Products</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{totalItems}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Inventory Value</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">{formatCurrency(totalStockValue)}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Low Stock Alert</p>
            <p className="text-2xl font-bold text-amber-600 mt-0.5">{lowStockCount}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Out of Stock</p>
            <p className="text-2xl font-bold text-red-600 mt-0.5">{outOfStockCount}</p>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by product name, SKU or barcode..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Stock Filter Pills */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setStockFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                stockFilter === 'all' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStockFilter('low')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                stockFilter === 'low' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Low Stock
            </button>
            <button
              onClick={() => setStockFilter('out')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                stockFilter === 'out' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Out
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500 tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Product Name</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">SKU / Barcode</th>
                <th className="px-4 py-3.5 text-right">Cost</th>
                <th className="px-4 py-3.5 text-right">Selling Price</th>
                <th className="px-4 py-3.5 text-center">Stock</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-400">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    No products found matching your search.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const margin = Math.round(((p.selling_price - p.cost_price) / p.selling_price) * 100)
                  const isLow = p.stock_quantity <= p.low_stock_threshold && p.stock_quantity > 0
                  const isOut = p.stock_quantity === 0
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-4 font-semibold text-slate-900 max-w-xs">
                        <p className="truncate">{p.name}</p>
                        <p className="text-xs text-slate-400 font-normal mt-0.5">Unit: {p.unit}</p>
                      </td>
                      <td className="px-4 py-4 text-xs font-medium text-slate-600">
                        {p.category_name || categories.find((c) => c.id === p.category_id)?.name || 'General'}
                      </td>
                      <td className="px-4 py-4 font-mono text-xs text-slate-500">
                        <div>{p.sku}</div>
                        {p.barcode && <div className="text-[10px] text-slate-400">{p.barcode}</div>}
                      </td>
                      <td className="px-4 py-4 text-right font-medium text-slate-500">
                        {formatCurrency(p.cost_price)}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="font-bold text-slate-900">{formatCurrency(p.selling_price)}</span>
                        <span className="block text-[10px] text-emerald-600 font-medium">+{margin}% margin</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="font-bold text-slate-900 text-sm">{p.stock_quantity}</span>
                        <span className="text-xs text-slate-400 ml-1">{p.unit}s</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                            isOut
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : isLow
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setAdjustingProduct(p)
                              setAdjustAmount(0)
                            }}
                            title="Adjust Stock"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          >
                            <Layers className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            title="Delete Product"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

            {/* ADJUST STOCK MODAL */}
      {adjustingProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">Adjust Stock</h3>
              <button onClick={() => setAdjustingProduct(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800">{adjustingProduct.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">Current Stock: <span className="font-bold text-slate-900">{adjustingProduct.stock_quantity}</span></p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Adjustment Amount (+ to add, - to reduce)
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustAmount((a) => a - 5)}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold"
                >
                  -5
                </button>
                <input
                  type="number"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(parseInt(e.target.value) || 0)}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-center font-bold text-base focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setAdjustAmount((a) => a + 5)}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold"
                >
                  +5
                </button>
              </div>
              <p className="text-xs text-slate-500 text-center mt-2">
                New Stock will be: <span className="font-bold text-indigo-600">{Math.max(0, adjustingProduct.stock_quantity + adjustAmount)}</span>
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSaveStockAdjustment}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-xl text-sm transition-all cursor-pointer"
              >
                Update Stock
              </button>
              <button
                type="button"
                onClick={() => setAdjustingProduct(null)}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
