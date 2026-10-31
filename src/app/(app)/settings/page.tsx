'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Settings,
  Store,
  ReceiptText,
  ShieldCheck,
  Save,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Shirt,
  Sparkles,
  Plus,
  Trash2,
  RotateCcw,
  TrendingUp,
  Percent,
  Check,
  Info,
} from 'lucide-react'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/utils'
import {
  getUniformConfigs,
  saveUniformConfigs,
  resetUniformConfigs,
  type UniformProductConfig,
  type UniformSizePrice,
} from '@/lib/data/uniform-pricing'

function SettingsContent() {
  const searchParams = useSearchParams()
  const initialTab = searchParams.get('tab') === 'uniforms' ? 'uniforms' : 'shop'

  const [activeTab, setActiveTab] = useState<'shop' | 'billing' | 'uniforms' | 'roles'>(initialTab)

  const [settings, setSettings] = useState({
    shopName: 'Ahsan Shop',
    tagline: 'Stationery, Books & School Uniforms Retailer',
    phone: '03087350410',
    email: 'ahsanmukhtiar@gmail.com',
    address: 'Shop # 14, Main Urdu Bazar Market, Islamabad',
    invoicePrefix: 'AS-',
    currencySymbol: 'Rs.',
    taxRate: 0,
    receiptFooter: 'Thank you for shopping at Ahsan Shop! School items exchangeable within 7 days with bill.',
    allowUdhaar: true,
  })

  const [saving, setSaving] = useState(false)

  // Uniform pricing state
  const [uniformConfigs, setUniformConfigs] = useState<UniformProductConfig[]>([])
  const [selectedUniformId, setSelectedUniformId] = useState<string>('uni-boys-shirt')
  const [newSizeName, setNewSizeName] = useState('')
  const [newSizePrice, setNewSizePrice] = useState<number | ''>('')
  const [newSizeCost, setNewSizeCost] = useState<number | ''>('')
  const [hasUniformChanges, setHasUniformChanges] = useState(false)

  useEffect(() => {
    setUniformConfigs(getUniformConfigs())
  }, [])

  const handleGeneralSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      toast.success('Shop configuration and billing settings saved!')
    }, 400)
  }

  // Active uniform config
  const activeUniform = uniformConfigs.find((c) => c.id === selectedUniformId) || uniformConfigs[0]

  // Update a specific size's price in the active uniform
  const handleUpdateSizePrice = (
    size: string,
    field: 'price' | 'costPrice',
    val: number
  ) => {
    setUniformConfigs((prev) =>
      prev.map((c) => {
        if (c.id !== selectedUniformId) return c
        return {
          ...c,
          pricing: c.pricing.map((p) => {
            if (p.size !== size) return p
            return {
              ...p,
              [field]: Math.max(0, val || 0),
            }
          }),
        }
      })
    )
    setHasUniformChanges(true)
  }

  // Delete a size
  const handleDeleteSize = (size: string) => {
    setUniformConfigs((prev) =>
      prev.map((c) => {
        if (c.id !== selectedUniformId) return c
        if (c.pricing.length <= 1) {
          toast.error('Each product must have at least one size!')
          return c
        }
        return {
          ...c,
          pricing: c.pricing.filter((p) => p.size !== size),
        }
      })
    )
    setHasUniformChanges(true)
    toast.success(`Removed size ${size}`)
  }

  // Add a new size
  const handleAddSize = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSizeName.trim()) {
      toast.error('Please enter a size name/number!')
      return
    }
    const priceNum = typeof newSizePrice === 'number' ? newSizePrice : 0
    if (priceNum <= 0) {
      toast.error('Please enter a valid selling price!')
      return
    }

    const formattedSize = newSizeName.includes('"')
      ? newSizeName.trim()
      : `${newSizeName.trim()}"`

    // Check if already exists
    if (activeUniform.pricing.some((p) => p.size.toLowerCase() === formattedSize.toLowerCase())) {
      toast.error(`Size ${formattedSize} already exists for this item!`)
      return
    }

    const costNum = typeof newSizeCost === 'number' ? newSizeCost : Math.round(priceNum * 0.65)

    const newSizeItem: UniformSizePrice = {
      size: formattedSize,
      price: priceNum,
      costPrice: costNum,
    }

    setUniformConfigs((prev) =>
      prev.map((c) => {
        if (c.id !== selectedUniformId) return c
        return {
          ...c,
          pricing: [...c.pricing, newSizeItem],
        }
      })
    )

    setNewSizeName('')
    setNewSizePrice('')
    setNewSizeCost('')
    setHasUniformChanges(true)
    toast.success(`Added size ${formattedSize} (Rs. ${priceNum})`)
  }

  // Quick bulk adjustment
  const handleBulkAdjustment = (delta: number) => {
    setUniformConfigs((prev) =>
      prev.map((c) => {
        if (c.id !== selectedUniformId) return c
        return {
          ...c,
          pricing: c.pricing.map((p) => ({
            ...p,
            price: Math.max(50, p.price + delta),
          })),
        }
      })
    )
    setHasUniformChanges(true)
    toast.success(`Adjusted all sizes in ${activeUniform.name} by ${delta > 0 ? '+' : ''}${delta} Rs`)
  }

  // Reset to factory defaults
  const handleResetDefaults = () => {
    if (window.confirm('Reset all uniform size prices to standard factory defaults?')) {
      const resetData = resetUniformConfigs()
      setUniformConfigs(resetData)
      setHasUniformChanges(false)
      toast.success('Uniform prices reset to factory defaults!')
    }
  }

  // Save all uniform prices
  const handleSaveUniforms = () => {
    saveUniformConfigs(uniformConfigs)
    setHasUniformChanges(false)
    toast.success('Uniform size prices saved successfully! POS bills will now reflect these prices.')
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <Settings className="w-7 h-7 text-indigo-600" />
            <span>Shop Settings & Configuration</span>
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Configure store profile, thermal receipts, uniform size pricing (collar & waist), and staff permissions
          </p>
        </div>

        {activeTab === 'uniforms' ? (
          <button
            onClick={handleSaveUniforms}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-100 text-sm cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Uniform Prices</span>
          </button>
        ) : (
          <button
            onClick={handleGeneralSave}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-100 text-sm cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        )}
      </div>

      {/* Tabs Bar */}
      <div className="flex flex-wrap bg-white p-1 rounded-2xl border border-slate-200 shadow-sm text-sm font-semibold max-w-2xl gap-1">
        <button
          onClick={() => setActiveTab('shop')}
          className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'shop' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Shop Profile</span>
        </button>

        <button
          onClick={() => setActiveTab('uniforms')}
          className={`flex-1 min-w-[170px] py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer relative ${
            activeTab === 'uniforms' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Shirt className="w-4 h-4 text-amber-300" />
          <span>Uniform Size Pricing</span>
          {hasUniformChanges && (
            <span className="w-2 h-2 rounded-full bg-amber-400 absolute right-2 top-2 animate-ping" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('billing')}
          className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'billing' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ReceiptText className="w-4 h-4" />
          <span>Billing & POS</span>
        </button>

        <button
          onClick={() => setActiveTab('roles')}
          className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'roles' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Roles & RBAC</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* UNIFORM SIZE PRICING TAB */}
      {/* ========================================================= */}
      {activeTab === 'uniforms' && (
        <div className="space-y-6">
          {/* Info Banner */}
          <div className="bg-indigo-50 border border-indigo-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                <Shirt className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-indigo-950">
                  Uniform Pricing Matrix: Collar Sizes (Shirts) & Waist Sizes (Pants)
                </h3>
                <p className="text-xs text-indigo-700/90 mt-0.5 max-w-2xl">
                  In Shirts, the billing price varies directly by <strong>Collar Size</strong> (10.5" - 16.0"). In Pants/Shalwar, the price varies by <strong>Waist Size</strong> (20" - 40"). Set your exact selling rates below. When cashier adds a uniform item to the POS cart, the price will automatically match the selected size!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleResetDefaults}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>Reset Defaults</span>
              </button>
              <button
                type="button"
                onClick={handleSaveUniforms}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save All Prices</span>
              </button>
            </div>
          </div>

          {/* Product Selector Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {uniformConfigs.map((cfg) => {
              const isSelected = cfg.id === selectedUniformId
              const isShirt = cfg.type === 'shirt'
              const isBoys = cfg.gender === 'boys'

              const minPrice = Math.min(...cfg.pricing.map((p) => p.price))
              const maxPrice = Math.max(...cfg.pricing.map((p) => p.price))

              return (
                <button
                  key={cfg.id}
                  type="button"
                  onClick={() => setSelectedUniformId(cfg.id)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white border-indigo-600 ring-2 ring-indigo-600/20 shadow-md -translate-y-0.5'
                      : 'bg-white hover:bg-slate-50 border-slate-200 shadow-2xs hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isBoys
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {isBoys ? 'Boys Uniform' : 'Girls Uniform'}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          isShirt
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {cfg.sizeLabel}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 leading-snug">
                      {cfg.name}
                    </h4>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">
                        Price Range
                      </span>
                      <span className="text-xs font-black text-indigo-700">
                        {formatCurrency(minPrice)} - {formatCurrency(maxPrice)}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">
                      {cfg.pricing.length} Sizes
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Active Product Size Table */}
          {activeUniform && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-6">
              {/* Table Header & Quick Bulk Controls */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md ${
                        activeUniform.gender === 'boys'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {activeUniform.gender === 'boys' ? 'Boys' : 'Girls'}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">
                      {activeUniform.name}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Configure prices for each <strong>{activeUniform.sizeLabel}</strong>. Rates update automatically in the POS Cart and Printed Bill.
                  </p>
                </div>

                {/* Bulk Actions */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-semibold text-slate-400 mr-1">Bulk Adjust:</span>
                  <button
                    type="button"
                    onClick={() => handleBulkAdjustment(50)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    +50 Rs
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBulkAdjustment(100)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    +100 Rs
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBulkAdjustment(-50)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    -50 Rs
                  </button>
                </div>
              </div>

              {/* Sizes Grid / Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-y border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Size (Inches)</th>
                      <th className="py-3 px-4">Specification Type</th>
                      <th className="py-3 px-4">Selling Price (Rs.)</th>
                      <th className="py-3 px-4">Cost Price (Rs.)</th>
                      <th className="py-3 px-4 text-center">Profit Margin</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeUniform.pricing.map((p) => {
                      const cost = p.costPrice || 0
                      const profit = p.price - cost
                      const marginPercent = p.price > 0 ? Math.round((profit / p.price) * 100) : 0

                      return (
                        <tr key={p.size} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-900 text-sm">
                            <span className="font-mono bg-slate-100 px-2 py-0.5 rounded-md text-slate-800">
                              {p.size}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1.5">
                              {activeUniform.sizeType === 'collar' ? (
                                <>
                                  <Shirt className="w-3.5 h-3.5 text-amber-600" />
                                  <span>Collar Size</span>
                                </>
                              ) : (
                                <>
                                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                  <span>Waist Size</span>
                                </>
                              )}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1 max-w-[150px]">
                              <span className="text-slate-400 font-bold text-xs">Rs.</span>
                              <input
                                type="number"
                                min="0"
                                value={p.price}
                                onChange={(e) =>
                                  handleUpdateSizePrice(
                                    p.size,
                                    'price',
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1 max-w-[140px]">
                              <span className="text-slate-400 font-semibold text-xs">Rs.</span>
                              <input
                                type="number"
                                min="0"
                                value={p.costPrice || 0}
                                onChange={(e) =>
                                  handleUpdateSizePrice(
                                    p.size,
                                    'costPrice',
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                profit > 0
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              <span>+Rs. {profit}</span>
                              <span className="text-[10px] opacity-75">({marginPercent}%)</span>
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => handleDeleteSize(p.size)}
                              className="text-slate-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                              title="Delete this size"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Add New Size Row */}
              <form
                onSubmit={handleAddSize}
                className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">
                      Add Custom Size to {activeUniform.name}
                    </h5>
                    <p className="text-[11px] text-slate-500">
                      e.g., Collar 16.5" or Waist 42"
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap sm:flex-nowrap">
                  <input
                    type="text"
                    placeholder={`Size (e.g. 16.5")`}
                    value={newSizeName}
                    onChange={(e) => setNewSizeName(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 w-32 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />

                  <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-lg px-2 py-1.5">
                    <span className="text-[10px] font-bold text-slate-400">Rs.</span>
                    <input
                      type="number"
                      placeholder="Sell Price"
                      value={newSizePrice}
                      onChange={(e) =>
                        setNewSizePrice(e.target.value === '' ? '' : parseFloat(e.target.value))
                      }
                      className="text-xs font-bold text-slate-900 w-20 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-lg px-2 py-1.5">
                    <span className="text-[10px] font-semibold text-slate-400">Cost:</span>
                    <input
                      type="number"
                      placeholder="Cost (Opt)"
                      value={newSizeCost}
                      onChange={(e) =>
                        setNewSizeCost(e.target.value === '' ? '' : parseFloat(e.target.value))
                      }
                      className="text-xs text-slate-600 w-16 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
                  >
                    + Add Size
                  </button>
                </div>
              </form>

              {/* Bottom Save Action */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveUniforms}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-emerald-100 flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Uniform Size Pricing</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* SHOP TAB */}
      {/* ========================================================= */}
      {activeTab === 'shop' && (
        <form onSubmit={handleGeneralSave} className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Store className="w-5 h-5 text-indigo-600" />
              <span>General Store Details</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Shop Business Name</label>
                <input
                  type="text"
                  required
                  value={settings.shopName}
                  onChange={(e) => setSettings({ ...settings, shopName: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Shop Tagline</label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Official Phone / Helpline</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Physical Shop Address</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <textarea
                  rows={2}
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </form>
      )}

      {/* ========================================================= */}
      {/* BILLING TAB */}
      {/* ========================================================= */}
      {activeTab === 'billing' && (
        <form onSubmit={handleGeneralSave} className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <ReceiptText className="w-5 h-5 text-indigo-600" />
              <span>POS & Invoice Numbering</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Invoice Number Prefix</label>
                <input
                  type="text"
                  required
                  value={settings.invoicePrefix}
                  onChange={(e) => setSettings({ ...settings, invoicePrefix: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">Example: {settings.invoicePrefix}2026-0001</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Currency Symbol</label>
                <input
                  type="text"
                  required
                  value={settings.currencySymbol}
                  onChange={(e) => setSettings({ ...settings, currencySymbol: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Default Tax Rate (%)</label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={settings.taxRate}
                  onChange={(e) => setSettings({ ...settings, taxRate: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Thermal Receipt Footer Message</label>
              <textarea
                rows={3}
                value={settings.receiptFooter}
                onChange={(e) => setSettings({ ...settings, receiptFooter: e.target.value })}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">Prints at the bottom of every customer receipt.</p>
            </div>
          </div>
        </form>
      )}

      {/* ========================================================= */}
      {/* ROLES TAB */}
      {/* ========================================================= */}
      {activeTab === 'roles' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <h2 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <span>Role-Based Access Control (RBAC)</span>
          </h2>

          <div className="overflow-hidden border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700 uppercase">
                <tr>
                  <th className="px-4 py-3">Permission Feature</th>
                  <th className="px-4 py-3 text-center">Cashier / Staff</th>
                  <th className="px-4 py-3 text-center text-indigo-700 font-bold">Owner / Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr>
                  <td className="px-4 py-3 text-slate-800">Create Bills & Process POS Sales</td>
                  <td className="px-4 py-3 text-center text-emerald-600 font-bold">✓ Allowed</td>
                  <td className="px-4 py-3 text-center text-emerald-600 font-bold">✓ Full Access</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-slate-800">Set Uniform Size Pricing (Collar / Waist)</td>
                  <td className="px-4 py-3 text-center text-slate-400">✗ Restricted</td>
                  <td className="px-4 py-3 text-center text-emerald-600 font-bold">✓ Full Access</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-slate-800">View Products & Stock Quantities</td>
                  <td className="px-4 py-3 text-center text-emerald-600 font-bold">✓ View Only</td>
                  <td className="px-4 py-3 text-center text-emerald-600 font-bold">✓ Full Edit & Add</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-slate-800">Add Customers & Take Payments</td>
                  <td className="px-4 py-3 text-center text-emerald-600 font-bold">✓ Allowed</td>
                  <td className="px-4 py-3 text-center text-emerald-600 font-bold">✓ Full Access</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-slate-800">Financial Reports & Profit & Loss</td>
                  <td className="px-4 py-3 text-center text-slate-400">✗ Restricted</td>
                  <td className="px-4 py-3 text-center text-emerald-600 font-bold">✓ Full Access</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl text-xs text-indigo-900 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              <span>Security Enforced at PostgreSQL Row Level Security (RLS)</span>
            </p>
            <p className="text-slate-600">
              Logged in administrator: <span className="font-bold text-slate-900">Ahsan Mukhtiar</span> (Role: Owner)
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading settings...</div>}>
      <SettingsContent />
    </Suspense>
  )
}
