'use client'

import { useState, useMemo, useEffect } from 'react'
import {
  INITIAL_PRODUCTS,
  INITIAL_CUSTOMERS,
  INITIAL_CATEGORIES,
  type ProductItem,
  type CustomerItem,
  type CategoryItem,
} from '@/lib/data/sample-data'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import {
  Search,
  Plus,
  Minus,
  Trash2,
  Printer,
  ShoppingBag,
  User,
  Banknote,
  BookOpen,
  CheckCircle2,
  X,
  RotateCcw,
  BookMarked,
  PenTool,
  Pencil,
  Compass,
  Briefcase,
  Shirt,
  Sparkles,
  ClipboardList,
  Layers,
  Palette,
  AlertCircle,
  Package,
  Layers2,
  ArrowRight,
  Smartphone,
  Split,
  Percent,
  Phone,
  Hash,
  Ruler,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  getUniformConfigs,
  matchUniformConfig,
  getUniformPriceForSize,
  type UniformProductConfig,
} from '@/lib/data/uniform-pricing'

interface CartItem {
  product: ProductItem
  quantity: number
  discount: number
  selectedSize?: string
  sizeType?: 'collar' | 'waist'
  sizePrice?: number
  uniformConfigId?: string
}

// Visual styling for large square category boxes
const CATEGORY_VISUALS: Record<
  string,
  { icon: any; color: string; bg: string; border: string }
> = {
  'Notebooks & Copies': {
    icon: BookMarked,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50/70 hover:bg-indigo-50',
    border: 'border-indigo-200/90 hover:border-indigo-400',
  },
  'Ballpoints & Gel Pens': {
    icon: PenTool,
    color: 'text-blue-600',
    bg: 'bg-blue-50/70 hover:bg-blue-50',
    border: 'border-blue-200/90 hover:border-blue-400',
  },
  'Pencils & Erasers': {
    icon: Pencil,
    color: 'text-amber-600',
    bg: 'bg-amber-50/70 hover:bg-amber-50',
    border: 'border-amber-200/90 hover:border-amber-400',
  },
  'Geometry & Geometry Boxes': {
    icon: Compass,
    color: 'text-teal-600',
    bg: 'bg-teal-50/70 hover:bg-teal-50',
    border: 'border-teal-200/90 hover:border-teal-400',
  },
  'School Bags & Pouches': {
    icon: Briefcase,
    color: 'text-purple-600',
    bg: 'bg-purple-50/70 hover:bg-purple-50',
    border: 'border-purple-200/90 hover:border-purple-400',
  },
  'Uniforms - Boys': {
    icon: Shirt,
    color: 'text-sky-600',
    bg: 'bg-sky-50/70 hover:bg-sky-50',
    border: 'border-sky-200/90 hover:border-sky-400',
  },
  'Uniforms - Girls': {
    icon: Sparkles,
    color: 'text-rose-600',
    bg: 'bg-rose-50/70 hover:bg-rose-50',
    border: 'border-rose-200/90 hover:border-rose-400',
  },
  'Exam Supplies & Clipboards': {
    icon: ClipboardList,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50/70 hover:bg-emerald-50',
    border: 'border-emerald-200/90 hover:border-emerald-400',
  },
  'Office Stationery': {
    icon: Layers,
    color: 'text-slate-700',
    bg: 'bg-slate-100/70 hover:bg-slate-100',
    border: 'border-slate-300 hover:border-slate-400',
  },
  'Art & Craft Colors': {
    icon: Palette,
    color: 'text-orange-600',
    bg: 'bg-orange-50/70 hover:bg-orange-50',
    border: 'border-orange-200/90 hover:border-orange-400',
  },
  'Art Supplies': {
    icon: Palette,
    color: 'text-orange-600',
    bg: 'bg-orange-50/70 hover:bg-orange-50',
    border: 'border-orange-200/90 hover:border-orange-400',
  },
}

export default function BillingPage() {
  const [products] = useState<ProductItem[]>(INITIAL_PRODUCTS)
  const [customers, setCustomers] = useState<CustomerItem[]>(INITIAL_CUSTOMERS)
  const [categories] = useState<CategoryItem[]>(INITIAL_CATEGORIES)

  // Direct search bar
  const [directSearch, setDirectSearch] = useState('')

  // Category Modal state
  const [selectedCategoryModal, setSelectedCategoryModal] = useState<CategoryItem | null>(null)
  const [modalSearch, setModalSearch] = useState('')

  // Customer & Name Input in Cart Section
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerItem>(customers[0])
  const [customerName, setCustomerName] = useState(customers[0]?.name || 'Walk-in Customer (General)')

  // Uniform Pricing Matrix configuration from Settings
  const [uniformConfigs, setUniformConfigs] = useState<UniformProductConfig[]>([])

  useEffect(() => {
    setUniformConfigs(getUniformConfigs())
    const handleUpdate = () => {
      setUniformConfigs(getUniformConfigs())
    }
    window.addEventListener('ahsan_uniform_pricing_updated', handleUpdate)
    return () => window.removeEventListener('ahsan_uniform_pricing_updated', handleUpdate)
  }, [])

  // Uniform Size Picker Modal
  const [sizePickerProduct, setSizePickerProduct] = useState<{
    product: ProductItem
    config: UniformProductConfig
  } | null>(null)
  const [selectedSizeForPicker, setSelectedSizeForPicker] = useState<string>('')
  const [pickerQuantity, setPickerQuantity] = useState<number>(1)

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([
    { product: products[0], quantity: 2, discount: 0 },
    { product: products[2], quantity: 1, discount: 0 },
  ])

  // Payment Method: 'cash' | 'easypaisa' | 'credit'
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'easypaisa' | 'credit'>('cash')

  // EasyPaisa state
  const [easypaisaPhone, setEasypaisaPhone] = useState('')
  const [easypaisaTid, setEasypaisaTid] = useState('')

  // Udhaar custom amount states: how much customer gave now & how much they will give later
  const [cashGivenNow, setCashGivenNow] = useState<string>('0')
  const [udhaarLater, setUdhaarLater] = useState<string>('')

  // Financial inputs
  const [discountValue, setDiscountValue] = useState<number>(0)
  const [cashTendered, setCashTendered] = useState<string>('')

  // Khata Management Modals
  const [isReceivePaymentModalOpen, setIsReceivePaymentModalOpen] = useState(false)
  const [paymentReceivedAmount, setPaymentReceivedAmount] = useState<number | ''>('')
  const [paymentReceivedMethod, setPaymentReceivedMethod] = useState<'cash' | 'easypaisa'>('cash')

  const [isAddKhataModalOpen, setIsAddKhataModalOpen] = useState(false)
  const [manualAddKhataAmount, setManualAddKhataAmount] = useState<number | ''>('')
  const [manualAddKhataReason, setManualAddKhataReason] = useState('')

  // Helper to update customer balance everywhere
  const updateCustomerBalance = (customerId: string, newBalance: number) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, outstanding_balance: newBalance } : c))
    )
    setSelectedCustomer((prev) =>
      prev.id === customerId ? { ...prev, outstanding_balance: newBalance } : prev
    )
  }

  // Receipt Modal state
  const [receiptData, setReceiptData] = useState<{
    invoiceNo: string
    date: string
    customerName: string
    customer: CustomerItem
    items: CartItem[]
    subtotal: number
    discount: number
    total: number
    tendered: number
    change: number
    method: 'cash' | 'easypaisa' | 'credit' | 'partial'
    easypaisaPhone?: string
    easypaisaTid?: string
    partialCashPaid?: number
    remainingUdhaar?: number
  } | null>(null)

  // Cart operations
  const addToCart = (
    product: ProductItem,
    customSize?: string,
    customPrice?: number,
    customSizeType?: 'collar' | 'waist',
    customConfigId?: string
  ) => {
    const uConfig = matchUniformConfig(product.name, product.category_name, uniformConfigs)

    // If it's a uniform item and no specific size is provided, open the size picker modal
    if (uConfig && !customSize) {
      setSizePickerProduct({ product, config: uConfig })
      setSelectedSizeForPicker(uConfig.defaultSize)
      setPickerQuantity(1)
      return
    }

    const selectedSize = customSize || (uConfig ? uConfig.defaultSize : undefined)
    const sizeType = customSizeType || (uConfig ? uConfig.sizeType : undefined)
    const sizePrice =
      customPrice !== undefined
        ? customPrice
        : uConfig && selectedSize
        ? getUniformPriceForSize(uConfig, selectedSize)
        : product.selling_price
    const uniformConfigId = customConfigId || (uConfig ? uConfig.id : undefined)

    if (product.stock_quantity <= 0) {
      toast.error(`"${product.name}" is out of stock!`)
      return
    }

    setCart((prev) => {
      const existing = prev.find(
        (item) =>
          item.product.id === product.id &&
          (item.selectedSize || '') === (selectedSize || '')
      )
      if (existing) {
        if (existing.quantity >= product.stock_quantity) {
          toast.error(`Only ${product.stock_quantity} available in stock!`)
          return prev
        }
        return prev.map((item) =>
          item.product.id === product.id &&
          (item.selectedSize || '') === (selectedSize || '')
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [
        ...prev,
        {
          product,
          quantity: 1,
          discount: 0,
          selectedSize,
          sizeType,
          sizePrice,
          uniformConfigId,
        },
      ]
    })

    const sizeNotice = selectedSize
      ? ` (${sizeType === 'collar' ? 'Collar' : 'Waist'}: ${selectedSize})`
      : ''
    toast.success(`Added ${product.name.slice(0, 22)}...${sizeNotice}`)
  }

  // Confirm size from picker modal
  const handleConfirmSizePicker = () => {
    if (!sizePickerProduct) return
    const { product, config } = sizePickerProduct
    const price = getUniformPriceForSize(config, selectedSizeForPicker)

    if (product.stock_quantity <= 0) {
      toast.error(`"${product.name}" is out of stock!`)
      return
    }

    setCart((prev) => {
      const existing = prev.find(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === selectedSizeForPicker
      )
      if (existing) {
        const newQty = existing.quantity + pickerQuantity
        return prev.map((item) =>
          item.product.id === product.id &&
          item.selectedSize === selectedSizeForPicker
            ? { ...item, quantity: newQty }
            : item
        )
      }
      return [
        ...prev,
        {
          product,
          quantity: pickerQuantity,
          discount: 0,
          selectedSize: selectedSizeForPicker,
          sizeType: config.sizeType,
          sizePrice: price,
          uniformConfigId: config.id,
        },
      ]
    })

    toast.success(
      `Added ${pickerQuantity}x ${product.name} (${config.sizeLabel}: ${selectedSizeForPicker}) - ${formatCurrency(
        price * pickerQuantity
      )}`
    )
    setSizePickerProduct(null)
  }

  // Update size directly inside cart line
  const updateCartItemSize = (cartIndex: number, newSize: string) => {
    setCart((prev) =>
      prev.map((item, idx) => {
        if (idx !== cartIndex) return item
        const uConfig =
          uniformConfigs.find((c) => c.id === item.uniformConfigId) ||
          matchUniformConfig(item.product.name, item.product.category_name, uniformConfigs)

        const newPrice = uConfig
          ? getUniformPriceForSize(uConfig, newSize)
          : item.sizePrice || item.product.selling_price

        return {
          ...item,
          selectedSize: newSize,
          sizePrice: newPrice,
        }
      })
    )
    toast.success(`Updated size to ${newSize}`)
  }

  const updateQuantity = (cartIndex: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item, idx) => {
          if (idx === cartIndex) {
            const newQty = item.quantity + delta
            if (newQty > item.product.stock_quantity) {
              toast.error(`Stock limit reached (${item.product.stock_quantity})`)
              return item
            }
            return newQty > 0 ? { ...item, quantity: newQty } : null
          }
          return item
        })
        .filter(Boolean) as CartItem[]
    )
  }

  const removeFromCart = (cartIndex: number) => {
    setCart((prev) => prev.filter((_, idx) => idx !== cartIndex))
  }

  const clearCart = () => {
    setCart([])
    setDiscountValue(0)
    setCashTendered('')
    setCashGivenNow('0')
    setUdhaarLater('')
    setEasypaisaPhone('')
    setEasypaisaTid('')
  }

  // Totals calculations based on size-specific prices
  const subtotal = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + (item.sizePrice ?? item.product.selling_price) * item.quantity,
      0
    )
  }, [cart])

  const total = Math.max(0, subtotal - (discountValue || 0))

  // Freeform Udhaar calculations:
  // How much customer gave now & how much they will give later
  const numericCashGivenNow = Number(cashGivenNow) || 0
  const numericUdhaarLater =
    udhaarLater !== ''
      ? Math.max(0, Number(udhaarLater))
      : Math.max(0, total - numericCashGivenNow)

  const handleCashGivenNowChange = (val: string) => {
    setCashGivenNow(val)
    const cash = val === '' ? 0 : Number(val)
    const later = Math.max(0, total - cash)
    setUdhaarLater(later.toString())
  }

  const handleUdhaarLaterChange = (val: string) => {
    setUdhaarLater(val)
    const later = val === '' ? 0 : Number(val)
    const cash = Math.max(0, total - later)
    setCashGivenNow(cash.toString())
  }

  // Tendered calculation: applies to Cash, or to the Cash Advance portion of Udhaar
  const requiredCashNow =
    paymentMethod === 'cash'
      ? total
      : paymentMethod === 'credit'
      ? numericCashGivenNow
      : 0

  const tenderedNum = parseFloat(cashTendered) || 0
  const changeDue = tenderedNum > requiredCashNow ? tenderedNum - requiredCashNow : 0

  // Direct search matching products
  const directSearchResults = useMemo(() => {
    if (!directSearch.trim()) return []
    const q = directSearch.toLowerCase()
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.barcode && p.barcode.includes(q))
    )
  }, [products, directSearch])

  // Products filtered for the active Category Modal
  const modalProducts = useMemo(() => {
    if (!selectedCategoryModal) return []
    return products.filter((p) => {
      const isCat = p.category_id === selectedCategoryModal.id
      if (!isCat) return false
      if (!modalSearch.trim()) return true
      const q = modalSearch.toLowerCase()
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.barcode && p.barcode.includes(q))
      )
    })
  }, [products, selectedCategoryModal, modalSearch])

  // Count items per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    products.forEach((p) => {
      if (p.category_id) {
        counts[p.category_id] = (counts[p.category_id] || 0) + 1
      }
    })
    return counts
  }, [products])

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Cart is empty. Add products before finalizing bill!')
      return
    }

    if (!customerName.trim()) {
      toast.error('Please enter customer name')
      return
    }

    if (paymentMethod === 'easypaisa' && !easypaisaPhone.trim()) {
      toast.error("Please enter the person's EasyPaisa mobile number")
      return
    }

    if (paymentMethod === 'cash' && tenderedNum > 0 && tenderedNum < total) {
      toast.warning('Tendered cash is less than the total bill!')
    }

    const invoiceNo = `AS-${new Date().getFullYear()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`

    let finalMethod: 'cash' | 'easypaisa' | 'credit' | 'partial' = paymentMethod
    let cashPaid = 0
    let creditRemaining = total

    if (paymentMethod === 'credit') {
      if (numericCashGivenNow > 0 && numericUdhaarLater > 0) {
        finalMethod = 'partial'
        cashPaid = numericCashGivenNow
        creditRemaining = numericUdhaarLater
      } else if (numericCashGivenNow >= total) {
        finalMethod = 'cash'
        cashPaid = total
        creditRemaining = 0
      } else {
        finalMethod = 'credit'
        cashPaid = 0
        creditRemaining = total
      }
    } else if (paymentMethod === 'cash') {
      cashPaid = total
      creditRemaining = 0
    } else if (paymentMethod === 'easypaisa') {
      cashPaid = total
      creditRemaining = 0
    }

    // Automatically update customer's Khata ledger if credit is given
    if (creditRemaining > 0 && selectedCustomer.id !== '00000000-0000-0000-0000-000000000001') {
      const newBal = (selectedCustomer.outstanding_balance || 0) + creditRemaining
      updateCustomerBalance(selectedCustomer.id, newBal)
    }

    setReceiptData({
      invoiceNo,
      date: formatDateTime(new Date()),
      customerName: customerName.trim(),
      customer: selectedCustomer,
      items: [...cart],
      subtotal,
      discount: discountValue,
      total,
      tendered:
        paymentMethod === 'cash'
          ? tenderedNum || total
          : finalMethod === 'partial'
          ? tenderedNum || numericCashGivenNow
          : total,
      change: changeDue,
      method: finalMethod,
      easypaisaPhone: paymentMethod === 'easypaisa' ? easypaisaPhone.trim() : undefined,
      easypaisaTid: paymentMethod === 'easypaisa' ? easypaisaTid.trim() || undefined : undefined,
      partialCashPaid: finalMethod === 'partial' ? numericCashGivenNow : undefined,
      remainingUdhaar: finalMethod === 'partial' ? numericUdhaarLater : undefined,
    })

    const methodLabels: Record<string, string> = {
      cash: 'Cash',
      easypaisa: `EasyPaisa (${easypaisaPhone})`,
      credit: `Full Udhaar (${formatCurrency(total)})`,
      partial: `Partial (${formatCurrency(numericCashGivenNow)} Cash Now + ${formatCurrency(numericUdhaarLater)} Later)`,
    }

    toast.success(`Bill #${invoiceNo} finalized via ${methodLabels[finalMethod]}!`)
  }

  // Khata Payment & Adjustment Handlers
  const handleReceiveKhataPayment = (e: React.FormEvent) => {
    e.preventDefault()
    const amountToPay = Number(paymentReceivedAmount) || 0
    if (amountToPay <= 0) {
      toast.error('Please enter a valid payment amount')
      return
    }
    const currentBal = selectedCustomer.outstanding_balance || 0
    const newBal = Math.max(0, currentBal - amountToPay)
    updateCustomerBalance(selectedCustomer.id, newBal)
    setIsReceivePaymentModalOpen(false)
    toast.success(
      `Received ${formatCurrency(amountToPay)} from ${selectedCustomer.name}! New Khata: ${formatCurrency(newBal)}`
    )
    setPaymentReceivedAmount('')
  }

  const handleAddMoreKhata = (e: React.FormEvent) => {
    e.preventDefault()
    const amountToAdd = Number(manualAddKhataAmount) || 0
    if (amountToAdd <= 0) {
      toast.error('Please enter a valid amount to add')
      return
    }
    const currentBal = selectedCustomer.outstanding_balance || 0
    const newBal = currentBal + amountToAdd
    updateCustomerBalance(selectedCustomer.id, newBal)
    setIsAddKhataModalOpen(false)
    toast.success(
      `Added ${formatCurrency(amountToAdd)} to ${selectedCustomer.name}'s Khata! New Balance: ${formatCurrency(newBal)}`
    )
    setManualAddKhataAmount('')
    setManualAddKhataReason('')
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="w-full h-[calc(100vh-3.5rem)] flex flex-col gap-3 animate-fade-in overflow-hidden">
      {/* ========================================================= */}
      {/* COMPACT TOP BAR: Full width header + Direct Scan Search */}
      {/* ========================================================= */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 pb-1">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>POS Billing Counter</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                TERMINAL
              </span>
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">
              Click a category to select products & build invoice
            </p>
          </div>
        </div>

        {/* Center/Right Barcode & Direct Search */}
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1 max-w-xl justify-end">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={directSearch}
              onChange={(e) => setDirectSearch(e.target.value)}
              placeholder="Direct Search or Scan Barcode..."
              className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
            />
            {directSearch && (
              <button
                onClick={() => setDirectSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Direct Search Dropdown */}
            {directSearch.trim() && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-40 max-h-80 overflow-y-auto space-y-1">
                {directSearchResults.length === 0 ? (
                  <p className="text-xs text-slate-400 p-3 text-center">
                    No matching products found for "{directSearch}"
                  </p>
                ) : (
                  directSearchResults.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => {
                        addToCart(prod)
                        setDirectSearch('')
                      }}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-indigo-50 cursor-pointer transition-colors"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-900">{prod.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {prod.sku} • {prod.category_name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-indigo-600">
                          {formatCurrency(prod.selling_price)}
                        </p>
                        <span className="text-[10px] text-emerald-600 font-medium">
                          {prod.stock_quantity} left
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <button
            onClick={clearCart}
            disabled={cart.length === 0}
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors disabled:opacity-40 cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MAIN POS VIEW: Fills remaining height, zero page scroll */}
      {/* ========================================================= */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
        {/* ========================================================= */}
        {/* LEFT PANE: Large Square Category Boxes (7 cols) */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col h-full min-h-0 bg-white rounded-3xl border border-slate-200/90 shadow-xs p-4">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100 shrink-0">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
              <Layers2 className="w-4 h-4 text-indigo-600" />
              <span>Select Category to Browse & Add Items</span>
            </h2>
            <span className="text-xs text-slate-400 font-medium">
              {categories.length} Categories
            </span>
          </div>

          {/* Category Grid - Scrolls internally within container */}
          <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5 scrollbar-thin">
            {categories.map((cat) => {
              const visual = CATEGORY_VISUALS[cat.name] || {
                icon: Package,
                color: 'text-indigo-600',
                bg: 'bg-indigo-50/70 hover:bg-indigo-50',
                border: 'border-indigo-200/90 hover:border-indigo-400',
              }
              const Icon = visual.icon
              const itemCount = categoryCounts[cat.id] || 0

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategoryModal(cat)
                    setModalSearch('')
                  }}
                  className={`group relative flex flex-col items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer text-center bg-white shadow-xs hover:shadow-md hover:-translate-y-0.5 aspect-square min-h-[140px] ${visual.border}`}
                >
                  {/* Top Item Count Badge */}
                  <div className="w-full flex justify-end">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-700 transition-colors">
                      {itemCount} items
                    </span>
                  </div>

                  {/* Center Large Icon */}
                  <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${visual.bg} ${visual.color}`}
                  >
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
                  </div>

                  {/* Category Title & Action hint */}
                  <div className="space-y-0.5 w-full">
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm leading-tight line-clamp-2 group-hover:text-indigo-600 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-[10px] font-semibold text-slate-400 flex items-center justify-center gap-1 group-hover:text-indigo-500">
                      <span>Browse items</span>
                      <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT PANE: Cart & Checkout Dock (5 cols) */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col h-full min-h-0 bg-white rounded-3xl border border-slate-200/90 shadow-md p-4">
          {/* CUSTOMER SELECTOR & CUSTOMER NAME INPUT */}
          <div className="shrink-0 pb-3 border-b border-slate-100 space-y-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* Account Dropdown */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                    <User className="w-3 h-3 text-indigo-600" />
                    <span>Select Account</span>
                  </label>
                  {selectedCustomer.outstanding_balance > 0 && (
                    <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-full">
                      Khata: {formatCurrency(selectedCustomer.outstanding_balance)}
                    </span>
                  )}
                </div>
                <select
                  value={selectedCustomer.id}
                  onChange={(e) => {
                    const cust = customers.find((c) => c.id === e.target.value)
                    if (cust) {
                      setSelectedCustomer(cust)
                      setCustomerName(cust.name)
                      if (cust.phone && !easypaisaPhone) {
                        setEasypaisaPhone(cust.phone)
                      }
                    }
                  }}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
                >
                  <optgroup label="Walk-in (Cash Sales)">
                    <option value="00000000-0000-0000-0000-000000000001">
                      Walk-in Customer (General / Counter)
                    </option>
                  </optgroup>
                  <optgroup label="Khata Accounts (Customers with Khata/Udhaar)">
                    {customers
                      .filter((c) => c.id !== '00000000-0000-0000-0000-000000000001')
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} {c.outstanding_balance > 0 ? `• Due: Rs. ${c.outstanding_balance}` : '• No Dues'}
                        </option>
                      ))}
                  </optgroup>
                </select>
              </div>

              {/* Direct Name Input */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                  Customer / School Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Zahid, Ali, School"
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* KHATA CUSTOMER DETAILS & QUICK ACTIONS CARD */}
            {selectedCustomer.id !== '00000000-0000-0000-0000-000000000001' && (
              <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-50/90 to-orange-50/70 border border-amber-200/90 shadow-xs space-y-2 animate-fade-in">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-amber-700 shrink-0" />
                      <span className="text-xs font-black text-slate-900 line-clamp-1">
                        {selectedCustomer.name}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-1">
                      📞 {selectedCustomer.phone || 'No phone'} • 📍 {selectedCustomer.address || 'Local area'}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[9px] font-bold text-amber-900/80 block uppercase">
                      Current Khata Due
                    </span>
                    <span
                      className={`text-sm font-black ${
                        selectedCustomer.outstanding_balance > 0
                          ? 'text-red-600'
                          : 'text-emerald-700'
                      }`}
                    >
                      {formatCurrency(selectedCustomer.outstanding_balance)}
                    </span>
                  </div>
                </div>

                {/* Khata Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-amber-200/80">
                  {/* Clear / Pay Due Bills Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentReceivedAmount(selectedCustomer.outstanding_balance)
                      setIsReceivePaymentModalOpen(true)
                    }}
                    disabled={selectedCustomer.outstanding_balance <= 0}
                    className="py-1.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors flex items-center justify-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
                    title="Record customer paying their pending Khata balance"
                  >
                    <Banknote className="w-3.5 h-3.5" />
                    <span>Clear / Pay Dues</span>
                  </button>

                  {/* Add to Khata Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('credit')
                      setIsAddKhataModalOpen(true)
                    }}
                    className="py-1.5 px-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                    title="Add manual past dues or note extra charges to this Khata"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Khata</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Cart Header */}
          <div className="flex items-center justify-between py-2 border-b border-slate-100 shrink-0 text-xs">
            <span className="font-bold text-slate-700 uppercase tracking-wider">
              Cart Items ({cart.reduce((sum, item) => sum + item.quantity, 0)})
            </span>
            <span className="text-slate-400 font-mono text-[11px]">Total (PKR)</span>
          </div>

          {/* Cart Items List - Scrolls internally */}
          <div className="flex-1 min-h-0 overflow-y-auto pr-1 divide-y divide-slate-100 scrollbar-thin">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 py-6 space-y-2">
                <ShoppingBag className="w-9 h-9 text-slate-300" />
                <p className="text-xs font-bold text-slate-600">Cart is empty</p>
                <p className="text-[11px] text-slate-400 text-center max-w-[200px]">
                  Select any category on the left to add items to this bill
                </p>
              </div>
            ) : (
              cart.map((item, idx) => {
                const unitPrice = item.sizePrice ?? item.product.selling_price
                const itemTotal = unitPrice * item.quantity
                const uConfig =
                  item.uniformConfigId
                    ? uniformConfigs.find((c) => c.id === item.uniformConfigId)
                    : matchUniformConfig(item.product.name, item.product.category_name, uniformConfigs)

                return (
                  <div
                    key={`${item.product.id}_${item.selectedSize || ''}_${idx}`}
                    className="py-2.5 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {item.product.name}
                      </p>

                      {/* Size Badge & Quick Switcher for Uniform Items */}
                      {item.selectedSize && (
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span
                            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              item.sizeType === 'collar'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {item.sizeType === 'collar' ? (
                              <Shirt className="w-2.5 h-2.5" />
                            ) : (
                              <Ruler className="w-2.5 h-2.5" />
                            )}
                            <span>
                              {item.sizeType === 'collar' ? 'Collar' : 'Waist'}:{' '}
                              {item.selectedSize}
                            </span>
                          </span>

                          {/* Quick dropdown to change size right inside cart */}
                          {uConfig && (
                            <select
                              value={item.selectedSize}
                              onChange={(e) => updateCartItemSize(idx, e.target.value)}
                              className="text-[10px] bg-slate-50 border border-slate-200 rounded px-1 py-0.5 font-bold text-slate-700 cursor-pointer hover:border-slate-300"
                              title="Switch size"
                            >
                              {uConfig.pricing.map((p) => (
                                <option key={p.size} value={p.size}>
                                  {p.size} ({formatCurrency(p.price)})
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      )}

                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {formatCurrency(unitPrice)} / {item.product.unit}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg shrink-0">
                      <button
                        onClick={() => updateQuantity(idx, -1)}
                        className="w-5 h-5 rounded bg-white text-slate-700 flex items-center justify-center hover:bg-slate-200 text-xs font-bold shadow-2xs cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-slate-900 w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(idx, 1)}
                        className="w-5 h-5 rounded bg-white text-slate-700 flex items-center justify-center hover:bg-slate-200 text-xs font-bold shadow-2xs cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Item Total & Delete */}
                    <div className="text-right flex items-center gap-2 shrink-0">
                      <span className="text-xs font-bold text-slate-900">
                        {formatCurrency(itemTotal)}
                      </span>
                      <button
                        onClick={() => removeFromCart(idx)}
                        className="text-slate-300 hover:text-red-500 transition-colors p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* DOCKED CHECKOUT BOTTOM SECTION */}
          <div className="shrink-0 pt-2.5 border-t border-slate-100 space-y-2">
            {/* PAYMENT METHOD SELECTOR: CASH, EASYPAISA, UDHAAR */}
            <div>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {/* Cash Button */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'cash'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/30'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <Banknote className="w-4 h-4 mb-0.5 text-emerald-600" />
                  <span className="font-bold text-[11px] leading-tight">Cash</span>
                  <span className="text-[9px] text-slate-400">Counter</span>
                </button>

                {/* EasyPaisa Button */}
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('easypaisa')
                    if (selectedCustomer.phone && !easypaisaPhone) {
                      setEasypaisaPhone(selectedCustomer.phone)
                    }
                  }}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'easypaisa'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-600/30'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <Smartphone className="w-4 h-4 mb-0.5 text-emerald-600" />
                  <span className="font-bold text-[11px] leading-tight">EasyPaisa</span>
                  <span className="text-[9px] text-slate-400">Mobile Acc</span>
                </button>

                {/* Udhaar Button */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('credit')}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'credit'
                      ? 'border-amber-500 bg-amber-50 text-amber-950 ring-2 ring-amber-500/30'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <BookOpen className="w-4 h-4 mb-0.5 text-amber-600" />
                  <span className="font-bold text-[11px] leading-tight">Udhaar</span>
                  <span className="text-[9px] text-slate-400">Khata / Split</span>
                </button>
              </div>
            </div>

            {/* EASYPAISA PHONE INPUT SECTION */}
            {paymentMethod === 'easypaisa' && (
              <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200/80 space-y-1.5 animate-fade-in">
                <div className="flex items-center gap-1.5 text-emerald-900 text-xs font-bold">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
                  <span>EasyPaisa Customer Details</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-emerald-800 uppercase">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={easypaisaPhone}
                      onChange={(e) => setEasypaisaPhone(e.target.value)}
                      placeholder="0300-1234567"
                      className="w-full px-2 py-1 bg-white border border-emerald-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-emerald-800 uppercase">
                      Trx ID / TID (Optional)
                    </label>
                    <input
                      type="text"
                      value={easypaisaTid}
                      onChange={(e) => setEasypaisaTid(e.target.value)}
                      placeholder="e.g. TID-984321"
                      className="w-full px-2 py-1 bg-white border border-emerald-200 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* UDHAAR / CUSTOM CASH + KHATA SPLIT INPUTS */}
            {paymentMethod === 'credit' && (
              <div className="bg-amber-50/80 p-2.5 rounded-xl border border-amber-200/90 space-y-2 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-amber-950 text-xs font-bold">
                    <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                    <span>Udhaar Details (Cash Now + Khata Later)</span>
                  </div>
                  <span className="text-[10px] text-amber-800 font-bold">
                    Total: {formatCurrency(total)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-emerald-800 uppercase mb-0.5">
                      Cash Paid Now (Gave Me)
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-600">
                        Rs.
                      </span>
                      <input
                        type="number"
                        min="0"
                        max={total}
                        value={cashGivenNow}
                        onChange={(e) => handleCashGivenNowChange(e.target.value)}
                        placeholder="0"
                        className="w-full pl-8 pr-2 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs font-black text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-amber-900 uppercase mb-0.5">
                      Will Give Later (Udhaar)
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-600">
                        Rs.
                      </span>
                      <input
                        type="number"
                        min="0"
                        max={total}
                        value={udhaarLater !== '' ? udhaarLater : (total - numericCashGivenNow).toString()}
                        onChange={(e) => handleUdhaarLaterChange(e.target.value)}
                        placeholder={total.toString()}
                        className="w-full pl-8 pr-2 py-1.5 bg-white border border-amber-300 rounded-lg text-xs font-black text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-1.5 rounded-lg bg-amber-100/70 text-[10px] text-amber-950 flex items-center justify-between font-semibold">
                  <span>
                    {numericCashGivenNow > 0
                      ? `Cash Received: ${formatCurrency(numericCashGivenNow)}`
                      : '100% Udhaar (No cash received)'}
                  </span>
                  <span className="font-bold text-amber-900">
                    Khata Due: {formatCurrency(numericUdhaarLater)}
                  </span>
                </div>
              </div>
            )}

            {/* Discount & Tendered Inputs */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                  Discount (Rs.)
                </label>
                <input
                  type="number"
                  min="0"
                  value={discountValue || ''}
                  onChange={(e) =>
                    setDiscountValue(parseFloat(e.target.value) || 0)
                  }
                  placeholder="0"
                  className="w-full px-2.5 py-1 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                />
              </div>

              {/* Tendered Input (relevant for Cash or when customer gives cash in Udhaar) */}
              {paymentMethod === 'cash' || (paymentMethod === 'credit' && numericCashGivenNow > 0) ? (
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                    Cash Tendered (Rs.)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={cashTendered}
                    onChange={(e) => setCashTendered(e.target.value)}
                    placeholder={requiredCashNow.toString()}
                    className="w-full px-2.5 py-1 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-emerald-700"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                    Settlement
                  </label>
                  <div className="px-2.5 py-1 bg-slate-50 rounded-lg border border-slate-200 text-[11px] font-bold text-slate-700 truncate">
                    {paymentMethod === 'easypaisa' ? 'Digital Account' : '100% Khata'}
                  </div>
                </div>
              )}
            </div>

            {/* Baqaya (Change to return) */}
            {changeDue > 0 && (
              <div className="px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 flex justify-between items-center text-xs">
                <span className="font-semibold text-emerald-900 text-[11px]">
                  Baqaya (Change to Return):
                </span>
                <span className="font-black text-xs text-emerald-700">
                  {formatCurrency(changeDue)}
                </span>
              </div>
            )}

            {/* Total Payable & Finalize Button */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="text-[10px] text-slate-400 font-medium uppercase">
                  {paymentMethod === 'credit' && numericCashGivenNow > 0
                    ? 'Total Bill / Cash Now'
                    : 'Total Bill'}
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-black text-slate-900 leading-tight">
                    {formatCurrency(total)}
                  </span>
                  {paymentMethod === 'credit' && numericCashGivenNow > 0 && (
                    <span className="text-xs font-bold text-emerald-600">
                      (Cash: {formatCurrency(numericCashGivenNow)})
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className="py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] transition-all shadow-md shadow-indigo-200 flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>
                  Finalize ({paymentMethod === 'credit' && numericCashGivenNow > 0 ? 'Split' : paymentMethod.toUpperCase()})
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* EXPANSIVE FULL-SCREEN CATEGORY PRODUCT SELECTION MODAL */}
      {/* ========================================================= */}
      {selectedCategoryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl w-[96vw] max-w-6xl h-[88vh] max-h-[88vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/90 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-slate-900">
                      {selectedCategoryModal.name}
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-700">
                      {modalProducts.length} items
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Click "Add to Bill" on any product to immediately include it in the customer cart
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{cart.reduce((s, i) => s + i.quantity, 0)} Items in Cart</span>
                </span>
                <button
                  onClick={() => setSelectedCategoryModal(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* In-Modal Search Header */}
            <div className="px-6 py-3 border-b border-slate-100 bg-white shrink-0">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={modalSearch}
                  onChange={(e) => setModalSearch(e.target.value)}
                  placeholder={`Search specifically within ${selectedCategoryModal.name}...`}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50 font-medium"
                />
              </div>
            </div>

            {/* Modal Body: Spacious Responsive Grid */}
            <div className="p-6 overflow-y-auto flex-1 bg-slate-50/40 scrollbar-thin">
              {modalProducts.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12">
                  <Package className="w-14 h-14 mx-auto text-slate-300 mb-2" />
                  <p className="text-base font-bold text-slate-700">No items found</p>
                  <p className="text-xs text-slate-400 mt-1">
                    No products matched your search criteria in this category.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                  {modalProducts.map((p) => {
                    const uConfig = matchUniformConfig(p.name, p.category_name, uniformConfigs)
                    const inCartItems = cart.filter((i) => i.product.id === p.id)
                    const inCartQty = inCartItems.reduce((sum, i) => sum + i.quantity, 0)
                    const isOutOfStock = p.stock_quantity <= 0

                    const minPrice = uConfig ? Math.min(...uConfig.pricing.map((x) => x.price)) : p.selling_price
                    const maxPrice = uConfig ? Math.max(...uConfig.pricing.map((x) => x.price)) : p.selling_price

                    return (
                      <div
                        key={p.id}
                        className={`bg-white rounded-2xl p-4 border transition-all flex flex-col justify-between hover:shadow-md ${
                          inCartQty > 0
                            ? 'border-indigo-500 ring-2 ring-indigo-500/15 shadow-sm'
                            : 'border-slate-200/90 hover:border-slate-300 shadow-xs'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-1 mb-1.5">
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                              {p.sku}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isOutOfStock
                                  ? 'bg-red-100 text-red-700'
                                  : p.stock_quantity <= p.low_stock_threshold
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-emerald-50 text-emerald-700'
                              }`}
                            >
                              {isOutOfStock ? 'Out' : `${p.stock_quantity} left`}
                            </span>
                          </div>

                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-2 leading-snug">
                            {p.name}
                          </h4>

                          {uConfig && (
                            <div className="mt-1 flex items-center gap-1">
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.5 rounded inline-flex items-center gap-1 ${
                                  uConfig.sizeType === 'collar'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}
                              >
                                {uConfig.sizeType === 'collar' ? (
                                  <Shirt className="w-2.5 h-2.5" />
                                ) : (
                                  <Ruler className="w-2.5 h-2.5" />
                                )}
                                <span>{uConfig.sizeLabel} Sized</span>
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                          <div>
                            <span className="text-[10px] text-slate-400 block uppercase font-bold">
                              {uConfig ? 'Rate by Size' : 'Price'}
                            </span>
                            <span className="text-xs sm:text-sm font-black text-slate-900">
                              {uConfig
                                ? `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`
                                : formatCurrency(p.selling_price)}
                            </span>
                          </div>

                          {uConfig ? (
                            <button
                              onClick={() => {
                                setSizePickerProduct({ product: p, config: uConfig })
                                setSelectedSizeForPicker(uConfig.defaultSize)
                                setPickerQuantity(1)
                              }}
                              disabled={isOutOfStock}
                              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-xs disabled:opacity-40 cursor-pointer flex items-center gap-1"
                            >
                              {uConfig.sizeType === 'collar' ? (
                                <Shirt className="w-3.5 h-3.5" />
                              ) : (
                                <Ruler className="w-3.5 h-3.5" />
                              )}
                              <span>Pick Size</span>
                            </button>
                          ) : inCartQty > 0 ? (
                            <div className="flex items-center gap-1.5 bg-indigo-50 px-2 py-1 rounded-xl border border-indigo-200">
                              <span className="text-xs font-bold text-indigo-700">
                                {inCartQty} in cart
                              </span>
                              <button
                                onClick={() => addToCart(p)}
                                disabled={isOutOfStock || inCartQty >= p.stock_quantity}
                                className="w-5 h-5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center text-xs font-bold transition-all disabled:opacity-40 cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => addToCart(p)}
                              disabled={isOutOfStock}
                              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-xs disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add</span>
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-slate-100 bg-white flex justify-between items-center shrink-0">
              <span className="text-xs text-slate-500 font-semibold">
                Showing all items in <span className="text-slate-900 font-bold">{selectedCategoryModal.name}</span>
              </span>
              <button
                onClick={() => setSelectedCategoryModal(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
              >
                Done / Back to Billing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* THERMAL RECEIPT MODAL */}
      {/* ========================================================= */}
      {receiptData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Printable Slip
              </span>
              <button
                onClick={() => setReceiptData(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Thermal Receipt Layout */}
            <div
              id="thermal-receipt"
              className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-300 font-mono text-xs text-slate-800 space-y-3"
            >
              <div className="text-center space-y-0.5">
                <h2 className="text-base font-black text-slate-900 tracking-tight">
                  AHSAN SHOP
                </h2>
                <p className="text-[11px] text-slate-500">
                  Books, Uniforms & Complete Stationery
                </p>
                <p className="text-[11px] text-slate-500">Shop Helpline: 0308-7350410</p>
              </div>

              <div className="border-t border-b border-dashed border-slate-300 py-1.5 space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span>Inv #:</span>
                  <span className="font-bold">{receiptData.invoiceNo}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{receiptData.date}</span>
                </div>
                <div className="flex justify-between">
                  <span>Customer:</span>
                  <span className="font-bold">{receiptData.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment:</span>
                  <span className="font-bold uppercase text-indigo-700">
                    {receiptData.method === 'cash'
                      ? 'CASH'
                      : receiptData.method === 'easypaisa'
                      ? 'EASYPAISA'
                      : receiptData.method === 'partial'
                      ? 'PARTIAL (CASH + UDHAAR)'
                      : 'FULL UDHAAR'}
                  </span>
                </div>
                {receiptData.easypaisaPhone && (
                  <div className="flex justify-between text-emerald-800 font-bold">
                    <span>EasyPaisa Acc:</span>
                    <span>{receiptData.easypaisaPhone}</span>
                  </div>
                )}
                {receiptData.easypaisaTid && (
                  <div className="flex justify-between text-slate-500">
                    <span>TID:</span>
                    <span>{receiptData.easypaisaTid}</span>
                  </div>
                )}
              </div>

              {/* Items List */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[11px] font-bold border-b pb-1">
                  <span>Item</span>
                  <span>Qty × Price = Total</span>
                </div>
                {receiptData.items.map((item, idx) => {
                  const unitPrice = item.sizePrice ?? item.product.selling_price
                  const itemTotal = unitPrice * item.quantity
                  const sizeLabel = item.selectedSize
                    ? ` (${item.sizeType === 'collar' ? 'Collar' : 'Waist'}: ${item.selectedSize})`
                    : ''

                  return (
                    <div
                      key={`${item.product.id}_${item.selectedSize || ''}_${idx}`}
                      className="flex justify-between text-[11px]"
                    >
                      <span className="truncate max-w-[155px]">
                        {item.product.name}
                        {sizeLabel}
                      </span>
                      <span>
                        {item.quantity} × {unitPrice} = {itemTotal}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Summary */}
              <div className="border-t border-dashed border-slate-300 pt-2 space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span>Subtotal:</span>
                  <span>Rs. {receiptData.subtotal}</span>
                </div>
                {receiptData.discount > 0 && (
                  <div className="flex justify-between text-[11px]">
                    <span>Discount:</span>
                    <span>-Rs. {receiptData.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black pt-1 border-t border-slate-300">
                  <span>TOTAL BILL:</span>
                  <span>Rs. {receiptData.total}</span>
                </div>

                {/* Method Specific Breakdown */}
                {receiptData.method === 'cash' && (
                  <>
                    <div className="flex justify-between text-[11px] text-slate-600">
                      <span>Cash Tendered:</span>
                      <span>Rs. {receiptData.tendered}</span>
                    </div>
                    {receiptData.change > 0 && (
                      <div className="flex justify-between text-[11px] font-bold text-emerald-700">
                        <span>Change (Baqaya):</span>
                        <span>Rs. {receiptData.change}</span>
                      </div>
                    )}
                  </>
                )}

                {receiptData.method === 'easypaisa' && (
                  <div className="p-1.5 rounded bg-emerald-100/80 text-emerald-950 text-[11px] font-bold text-center">
                    Paid in full via EasyPaisa: Rs. {receiptData.total}
                  </div>
                )}

                {receiptData.method === 'partial' && (
                  <div className="p-2 rounded bg-amber-50 border border-amber-200 text-amber-950 text-[11px] space-y-0.5">
                    <div className="flex justify-between font-bold text-emerald-700">
                      <span>Cash Paid Now (Gave Me):</span>
                      <span>Rs. {receiptData.partialCashPaid}</span>
                    </div>
                    <div className="flex justify-between font-bold text-amber-900">
                      <span>Will Give Later (Udhaar Khata):</span>
                      <span>Rs. {receiptData.remainingUdhaar}</span>
                    </div>
                    {receiptData.change > 0 && (
                      <div className="flex justify-between text-[10px] text-emerald-800 font-semibold pt-1 border-t border-amber-200">
                        <span>Change Returned:</span>
                        <span>Rs. {receiptData.change}</span>
                      </div>
                    )}
                  </div>
                )}

                {receiptData.method === 'credit' && (
                  <div className="p-1.5 rounded bg-amber-100 text-amber-900 text-[10px] text-center font-bold">
                    100% Bill Added to Customer's Udhaar Ledger
                  </div>
                )}
              </div>

              <div className="text-center pt-2 text-[10px] text-slate-500">
                <p>Thank you for shopping at Ahsan Shop!</p>
                <p>Goods once sold can be exchanged within 3 days.</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Print Receipt</span>
              </button>
              <button
                onClick={() => {
                  setReceiptData(null)
                  clearCart()
                }}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors cursor-pointer"
              >
                New Sale
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CLEAR KHATA / RECEIVE DUE PAYMENT */}
      {/* ========================================================= */}
      {isReceivePaymentModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Banknote className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">
                  Receive Payment / Clear Khata
                </h3>
              </div>
              <button
                onClick={() => setIsReceivePaymentModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Customer Details Box */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-xs space-y-1">
              <p className="font-bold text-slate-900">{selectedCustomer.name}</p>
              <p className="text-slate-600 text-[11px]">
                Phone: {selectedCustomer.phone || 'No phone'} • {selectedCustomer.address || 'Local'}
              </p>
              <div className="flex justify-between items-baseline pt-1 border-t border-amber-200/80">
                <span className="text-amber-900 font-semibold text-[11px]">
                  Pending Khata Dues:
                </span>
                <span className="text-sm font-black text-red-600">
                  {formatCurrency(selectedCustomer.outstanding_balance)}
                </span>
              </div>
            </div>

            <form onSubmit={handleReceiveKhataPayment} className="space-y-3.5">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-bold text-slate-700 uppercase">
                    Amount Paid (Rs.) <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setPaymentReceivedAmount(selectedCustomer.outstanding_balance)}
                    className="text-[10px] font-bold text-emerald-700 hover:underline cursor-pointer"
                  >
                    Pay Full Balance
                  </button>
                </div>
                <input
                  type="number"
                  min="1"
                  max={selectedCustomer.outstanding_balance}
                  required
                  value={paymentReceivedAmount}
                  onChange={(e) =>
                    setPaymentReceivedAmount(
                      e.target.value === '' ? '' : Number(e.target.value)
                    )
                  }
                  placeholder="e.g. 5000"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-base font-black text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentReceivedMethod('cash')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      paymentReceivedMethod === 'cash'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/30'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Cash</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentReceivedMethod('easypaisa')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      paymentReceivedMethod === 'easypaisa'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/30'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>EasyPaisa</span>
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer shadow-xs"
                >
                  Confirm & Clear Khata
                </button>
                <button
                  type="button"
                  onClick={() => setIsReceivePaymentModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: MANUAL ADD TO KHATA / PAST BALANCE ADJUSTMENT */}
      {/* ========================================================= */}
      {isAddKhataModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">
                  Add More to Khata (Balance Debit)
                </h3>
              </div>
              <button
                onClick={() => setIsAddKhataModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-1">
              <p className="font-bold text-slate-900">{selectedCustomer.name}</p>
              <div className="flex justify-between items-baseline pt-1">
                <span className="text-amber-900 font-semibold text-[11px]">
                  Current Khata Balance:
                </span>
                <span className="text-sm font-black text-amber-900">
                  {formatCurrency(selectedCustomer.outstanding_balance)}
                </span>
              </div>
            </div>

            <form onSubmit={handleAddMoreKhata} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Amount to Add (Rs.) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={manualAddKhataAmount}
                  onChange={(e) =>
                    setManualAddKhataAmount(
                      e.target.value === '' ? '' : Number(e.target.value)
                    )
                  }
                  placeholder="e.g. 2000"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-base font-black text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Reason / Ledger Note
                </label>
                <input
                  type="text"
                  value={manualAddKhataReason}
                  onChange={(e) => setManualAddKhataReason(e.target.value)}
                  placeholder="e.g. Past manual notebook ledger transfer"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer shadow-xs"
                >
                  Add to Khata
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddKhataModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* UNIFORM SIZE PICKER MODAL (COLLAR & WAIST SIZES) */}
      {/* ========================================================= */}
      {sizePickerProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-scale-in">
            {/* Header */}
            <div className="flex justify-between items-start pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      sizePickerProduct.config.gender === 'boys'
                        ? 'bg-sky-100 text-sky-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {sizePickerProduct.config.gender === 'boys' ? 'Boys Uniform' : 'Girls Uniform'}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                      sizePickerProduct.config.sizeType === 'collar'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {sizePickerProduct.config.sizeType === 'collar' ? (
                      <Shirt className="w-3 h-3" />
                    ) : (
                      <Ruler className="w-3 h-3" />
                    )}
                    <span>{sizePickerProduct.config.sizeLabel}</span>
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {sizePickerProduct.product.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select {sizePickerProduct.config.sizeLabel}. The bill will calculate according to the size rates configured in Settings.
                </p>
              </div>
              <button
                onClick={() => setSizePickerProduct(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Grid of Sizes */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Select {sizePickerProduct.config.sizeLabel}:
                </label>
                <a
                  href="/settings?tab=uniforms"
                  target="_blank"
                  className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold"
                >
                  Adjust Size Rates in Settings →
                </a>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
                {sizePickerProduct.config.pricing.map((p) => {
                  const isSelected = selectedSizeForPicker === p.size
                  return (
                    <button
                      key={p.size}
                      type="button"
                      onClick={() => setSelectedSizeForPicker(p.size)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/90 ring-2 ring-indigo-500/25 text-indigo-950 font-bold shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-xs font-mono font-bold">{p.size}</span>
                      <span className="text-[11px] font-black text-indigo-600 mt-0.5">
                        {formatCurrency(p.price)}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Selected Preview & Quantity */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">
                  Chosen {sizePickerProduct.config.sizeLabel}
                </span>
                <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                  <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                    {selectedSizeForPicker}
                  </span>
                  <span className="text-indigo-700 font-black">
                    {formatCurrency(
                      getUniformPriceForSize(sizePickerProduct.config, selectedSizeForPicker)
                    )}
                  </span>
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Qty:</span>
                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setPickerQuantity((q) => Math.max(1, q - 1))}
                    className="w-7 h-7 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-7 text-center text-xs font-bold text-slate-900">
                    {pickerQuantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPickerQuantity((q) => q + 1)}
                    className="w-7 h-7 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-500">
                Line Total:{' '}
                <strong className="text-slate-900 text-sm">
                  {formatCurrency(
                    getUniformPriceForSize(sizePickerProduct.config, selectedSizeForPicker) *
                      pickerQuantity
                  )}
                </strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSizePickerProduct(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSizePicker}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-md shadow-indigo-100 flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
