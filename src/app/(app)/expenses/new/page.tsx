'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  INITIAL_SUPPLIERS,
  type ExpenseItem,
  type SupplierItem,
} from '@/lib/data/sample-data'
import { formatCurrency } from '@/lib/utils'
import {
  ArrowLeft,
  TrendingDown,
  Building2,
  Calendar,
  Banknote,
  FileText,
  UserCheck,
  PlusCircle,
  Truck,
  Phone,
  MapPin,
  Save,
  CheckCircle2,
  AlertCircle,
  Receipt,
  Tag,
} from 'lucide-react'
import { toast } from 'sonner'

const EXPENSE_CATEGORIES = [
  'Material / Stock Purchase',
  'Shop Rent',
  'Electricity & Utilities',
  'Staff Salaries',
  'Chai & Daily Refreshments',
  'Packaging & Bags',
  'Freight & Cargo',
  'Shop Maintenance',
  'Printing & Branding',
  'Miscellaneous',
]

export default function NewExpensePage() {
  const router = useRouter()
  const [suppliers] = useState<SupplierItem[]>(INITIAL_SUPPLIERS)

  // Basic expense state
  const [title, setTitle] = useState('')
  const [categoryName, setCategoryName] = useState('Material / Stock Purchase')
  const [amount, setAmount] = useState<number | ''>(1500)
  const [expenseDate, setExpenseDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'credit'>('cash')
  const [referenceNo, setReferenceNo] = useState('')
  const [notes, setNotes] = useState('')

  // Supplier purchase state
  const [isSupplierPurchase, setIsSupplierPurchase] = useState(true)
  const [supplierMode, setSupplierMode] = useState<'existing' | 'new'>('existing')
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>(
    suppliers[0]?.id || ''
  )

  // New supplier fields
  const [newSupplierName, setNewSupplierName] = useState('')
  const [newSupplierContact, setNewSupplierContact] = useState('')
  const [newSupplierPhone, setNewSupplierPhone] = useState('')
  const [newSupplierAddress, setNewSupplierAddress] = useState('')
  const [newSupplierPaymentTerms, setNewSupplierPaymentTerms] = useState('Net 15 Days')

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Selected supplier details
  const selectedSupplier = suppliers.find((s) => s.id === selectedSupplierId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast.error('Please enter an expense title or description')
      return
    }

    if (!amount || Number(amount) <= 0) {
      toast.error('Please enter a valid expense amount greater than 0')
      return
    }

    let finalSupplierId: string | undefined = undefined
    let finalSupplierName: string | undefined = undefined

    if (isSupplierPurchase) {
      if (supplierMode === 'existing') {
        if (!selectedSupplier) {
          toast.error('Please select a supplier')
          return
        }
        finalSupplierId = selectedSupplier.id
        finalSupplierName = selectedSupplier.name
      } else {
        if (!newSupplierName.trim()) {
          toast.error('Please enter the new supplier company name')
          return
        }
        finalSupplierId = `sup-${Date.now()}`
        finalSupplierName = newSupplierName.trim()
      }
    }

    setIsSubmitting(true)

    const newExpense: ExpenseItem = {
      id: `exp-${Date.now()}`,
      title: title.trim(),
      category_name: categoryName,
      amount: Number(amount),
      expense_date: expenseDate,
      payment_method: paymentMethod,
      reference_no: referenceNo.trim() || undefined,
      notes: notes.trim() || undefined,
      is_supplier_purchase: isSupplierPurchase,
      supplier_id: finalSupplierId,
      supplier_name: finalSupplierName,
    }

    setTimeout(() => {
      setIsSubmitting(false)
      const payLabel = paymentMethod === 'cash' ? 'Cash' : 'Udhaar (Credit)'
      toast.success(
        `Expense of ${formatCurrency(newExpense.amount)} recorded (${payLabel})${
          finalSupplierName ? ` from ${finalSupplierName}` : ''
        }!`
      )
      router.push('/expenses')
    }, 450)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <Link
            href="/expenses"
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors shadow-xs"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-red-100 text-red-700">
                Expense Management
              </span>
              <span className="text-slate-300">/</span>
              <span className="text-xs text-slate-500 font-medium">New Entry</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              Record New Expense / Supplier Purchase
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/expenses"
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 font-semibold text-sm transition-colors"
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm shadow-md shadow-red-200 transition-all cursor-pointer disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Recording...' : 'Record Expense'}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Expense Particulars (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Receipt className="w-5 h-5 text-red-600" />
                <span>Expense Details</span>
              </h2>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Expense Title / Particulars <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Purchased 40 Bundles of Exercise Copies from Urdu Bazar"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-medium placeholder:text-slate-400"
                />
              </div>

              {/* Category & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={categoryName}
                    onChange={(e) => {
                      setCategoryName(e.target.value)
                      if (e.target.value === 'Material / Stock Purchase') {
                        setIsSupplierPurchase(true)
                      }
                    }}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white font-medium"
                  >
                    {EXPENSE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Expense Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      value={expenseDate}
                      onChange={(e) => setExpenseDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Amount & Reference # */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Amount (PKR) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                      Rs.
                    </span>
                    <input
                      type="number"
                      min="1"
                      step="any"
                      required
                      value={amount}
                      onChange={(e) =>
                        setAmount(e.target.value === '' ? '' : Number(e.target.value))
                      }
                      placeholder="0.00"
                      className="w-full pl-11 pr-3.5 py-2.5 border border-slate-200 rounded-xl text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Bill / Reference No.
                  </label>
                  <input
                    type="text"
                    value={referenceNo}
                    onChange={(e) => setReferenceNo(e.target.value)}
                    placeholder="e.g. INV-9042 or BATCH-01"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Payment Method: CASH or UDHAAR ONLY */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Payment Method <span className="text-red-500">*</span>
                  <span className="text-[11px] font-normal text-slate-400 ml-1.5">
                    (Cash or Udhaar / Credit Only)
                  </span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      paymentMethod === 'cash'
                        ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 ring-2 ring-emerald-500/30'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm ${
                        paymentMethod === 'cash'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <Banknote className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Cash Payment</p>
                      <p className="text-xs text-slate-500">Paid immediately from counter cash</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('credit')}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      paymentMethod === 'credit'
                        ? 'border-amber-500 bg-amber-50/70 text-amber-950 ring-2 ring-amber-500/30'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm ${
                        paymentMethod === 'credit'
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Udhaar (Payable)</p>
                      <p className="text-xs text-slate-500">Credit ledger / To be paid later</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Internal Remarks / Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional notes about this expenditure..."
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Supplier Purchase Options (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-base font-bold text-slate-900">
                    Supplier / Raw Material
                  </h2>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSupplierPurchase}
                    onChange={(e) => setIsSupplierPurchase(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 text-slate-600 text-xs">
                <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span>
                  Enable this if purchasing stationery, paper, uniforms, or goods from a supplier.
                  You can link existing suppliers or register a new one.
                </span>
              </div>

              {isSupplierPurchase ? (
                <div className="space-y-4 pt-1">
                  {/* Select Mode: Existing vs New */}
                  <div className="flex p-1 bg-slate-100 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setSupplierMode('existing')}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        supplierMode === 'existing'
                          ? 'bg-white text-indigo-700 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Existing Supplier</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSupplierMode('new')}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        supplierMode === 'new'
                          ? 'bg-white text-indigo-700 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>New Supplier</span>
                    </button>
                  </div>

                  {supplierMode === 'existing' ? (
                    /* Existing Supplier Picker */
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Select Registered Supplier <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={selectedSupplierId}
                          onChange={(e) => setSelectedSupplierId(e.target.value)}
                          className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium"
                        >
                          {suppliers.map((sup) => (
                            <option key={sup.id} value={sup.id}>
                              {sup.name} ({sup.phone})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Selected Supplier Card Preview */}
                      {selectedSupplier && (
                        <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/50 space-y-2.5">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-bold text-sm text-slate-900">
                                {selectedSupplier.name}
                              </p>
                              <p className="text-xs text-indigo-700 font-medium">
                                Contact: {selectedSupplier.contact_person}
                              </p>
                            </div>
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800">
                              {selectedSupplier.payment_terms}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-indigo-100/80 text-xs">
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              <span>{selectedSupplier.phone}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              <span className="truncate">{selectedSupplier.address}</span>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-indigo-100/80 flex justify-between items-center text-xs">
                            <span className="text-slate-500">Current Ledger Balance:</span>
                            <span className="font-bold text-slate-900">
                              {formatCurrency(selectedSupplier.balance)}
                            </span>
                          </div>

                          {paymentMethod === 'credit' && (
                            <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] leading-tight">
                              ⚠️ Since payment is <strong>Udhaar</strong>, this {formatCurrency(Number(amount) || 0)} will be added to your payable balance for this supplier.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* New Supplier Inline Form */
                    <div className="space-y-3 border border-indigo-100 bg-indigo-50/30 p-4 rounded-xl">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 pb-1">
                        <Building2 className="w-4 h-4 text-indigo-600" />
                        <span>Register New Supplier Details</span>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Company / Business Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required={supplierMode === 'new' && isSupplierPurchase}
                          value={newSupplierName}
                          onChange={(e) => setNewSupplierName(e.target.value)}
                          placeholder="e.g. Master Packaging & Paper Mart"
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Contact Person
                          </label>
                          <input
                            type="text"
                            value={newSupplierContact}
                            onChange={(e) => setNewSupplierContact(e.target.value)}
                            placeholder="e.g. Haji Aslam"
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Phone Number
                          </label>
                          <input
                            type="text"
                            value={newSupplierPhone}
                            onChange={(e) => setNewSupplierPhone(e.target.value)}
                            placeholder="0300-1234567"
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          City / Market Address
                        </label>
                        <input
                          type="text"
                          value={newSupplierAddress}
                          onChange={(e) => setNewSupplierAddress(e.target.value)}
                          placeholder="e.g. Urdu Bazar, Lahore"
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Payment Terms
                        </label>
                        <select
                          value={newSupplierPaymentTerms}
                          onChange={(e) => setNewSupplierPaymentTerms(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="Cash on Delivery">Cash on Delivery</option>
                          <option value="Net 7 Days">Net 7 Days</option>
                          <option value="Net 15 Days">Net 15 Days</option>
                          <option value="Net 30 Days">Net 30 Days</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-6 text-center text-slate-400 text-xs">
                  <p>Standard overhead expense (not linked to any supplier)</p>
                </div>
              )}
            </div>

            {/* Expense Summary Box */}
            <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Summary Preview
              </h3>
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-slate-300">Total Expense Amount:</span>
                <span className="text-2xl font-black text-white">
                  {formatCurrency(Number(amount) || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-800">
                <span className="text-slate-400">Payment Status:</span>
                <span
                  className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                    paymentMethod === 'cash'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}
                >
                  {paymentMethod === 'cash' ? 'Cash Paid' : 'Udhaar (Payable)'}
                </span>
              </div>
              {isSupplierPurchase && (
                <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-800">
                  <span className="text-slate-400">Supplier:</span>
                  <span className="font-semibold text-indigo-300 truncate max-w-[200px]">
                    {supplierMode === 'existing'
                      ? selectedSupplier?.name || 'Selected'
                      : newSupplierName || 'New Supplier'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
