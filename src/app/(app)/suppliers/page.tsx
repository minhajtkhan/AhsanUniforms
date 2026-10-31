'use client'

import { useState, useMemo } from 'react'
import {
  INITIAL_SUPPLIERS,
  type SupplierItem,
} from '@/lib/data/sample-data'
import { formatCurrency } from '@/lib/utils'
import {
  Truck,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  Building,
  DollarSign,
  Calendar,
  X,
  CreditCard,
} from 'lucide-react'
import { toast } from 'sonner'

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<SupplierItem[]>(INITIAL_SUPPLIERS)
  const [searchQuery, setSearchQuery] = useState('')

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [payingSupplier, setPayingSupplier] = useState<SupplierItem | null>(null)
  const [payAmount, setPayAmount] = useState('')

  // New Supplier form
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    contact_person: '',
    phone: '',
    email: '',
    address: '',
    payment_terms: 'Net 30 Days',
    balance: 0,
  })

  // KPIs
  const totalPayable = useMemo(() => {
    return suppliers.reduce((sum, s) => sum + s.balance, 0)
  }, [suppliers])

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((s) => {
      const q = searchQuery.toLowerCase()
      return (
        s.name.toLowerCase().includes(q) ||
        s.contact_person.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q) ||
        s.phone.includes(q)
      )
    })
  }, [suppliers, searchQuery])

  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSupplier.name) {
      toast.error('Please enter supplier company name')
      return
    }

    const created: SupplierItem = {
      id: `sup-${Date.now()}`,
      name: newSupplier.name,
      contact_person: newSupplier.contact_person || 'Representative',
      phone: newSupplier.phone || '—',
      email: newSupplier.email || '—',
      address: newSupplier.address || '—',
      payment_terms: newSupplier.payment_terms,
      balance: Number(newSupplier.balance) || 0,
    }

    setSuppliers((prev) => [created, ...prev])
    setIsAddModalOpen(false)
    toast.success(`Supplier "${created.name}" added successfully!`)
    setNewSupplier({
      name: '',
      contact_person: '',
      phone: '',
      email: '',
      address: '',
      payment_terms: 'Net 30 Days',
      balance: 0,
    })
  }

  const handlePaySupplier = (e: React.FormEvent) => {
    e.preventDefault()
    if (!payingSupplier) return
    const amt = parseFloat(payAmount)
    if (!amt || amt <= 0) {
      toast.error('Please enter a valid payment amount')
      return
    }

    const newBal = Math.max(0, payingSupplier.balance - amt)
    setSuppliers((prev) =>
      prev.map((s) => (s.id === payingSupplier.id ? { ...s, balance: newBal } : s))
    )

    toast.success(`Paid Rs. ${amt} to ${payingSupplier.name}. Remaining owed: Rs. ${newBal}`)
    setPayingSupplier(null)
    setPayAmount('')
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <Truck className="w-7 h-7 text-indigo-600" />
            <span>Suppliers & Wholesale Vendors</span>
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Manage stationery mills, book publishers (Urdu Bazar), and uniform textile distributors
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-100 text-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Supplier</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Suppliers</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{suppliers.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Payable Balance</p>
            <p className="text-xl font-bold text-orange-600 mt-0.5">{formatCurrency(totalPayable)}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Payment Terms</p>
            <p className="text-base font-bold text-slate-900 mt-0.5">Net 15 - 30 Days (Active)</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search suppliers by company name, contact person, or city..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
          />
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500 tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Supplier / Company</th>
                <th className="px-4 py-3.5">Contact Person</th>
                <th className="px-4 py-3.5">Contact Details</th>
                <th className="px-4 py-3.5">Address</th>
                <th className="px-4 py-3.5">Terms</th>
                <th className="px-4 py-3.5 text-right">Owed Balance</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSuppliers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                    <Truck className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    No suppliers found matching your query.
                  </td>
                </tr>
              ) : (
                filteredSuppliers.map((sup) => (
                  <tr key={sup.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4 font-semibold text-slate-900 max-w-xs">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                        <span className="truncate">{sup.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs font-medium text-slate-800">
                      {sup.contact_person}
                    </td>
                    <td className="px-4 py-4 text-xs space-y-0.5">
                      <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{sup.phone}</span>
                      </div>
                      {sup.email && (
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Mail className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[130px]">{sup.email}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500 max-w-xs">
                      <div className="flex items-start gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                        <span className="truncate">{sup.address}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs">
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
                        {sup.payment_terms}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                          sup.balance > 0
                            ? 'bg-orange-50 text-orange-700 border border-orange-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {formatCurrency(sup.balance)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {sup.balance > 0 ? (
                        <button
                          onClick={() => {
                            setPayingSupplier(sup)
                            setPayAmount(sup.balance.toString())
                          }}
                          className="inline-flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors shadow-sm cursor-pointer"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Pay</span>
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">Cleared</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAY SUPPLIER MODAL */}
      {payingSupplier && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-600" />
                <span>Pay Supplier</span>
              </h3>
              <button onClick={() => setPayingSupplier(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
              <p className="font-semibold text-slate-800">{payingSupplier.name}</p>
              <p className="text-orange-700 mt-0.5">
                Current Balance Owed: <span className="font-bold">{formatCurrency(payingSupplier.balance)}</span>
              </p>
            </div>

            <form onSubmit={handlePaySupplier} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Payment Amount (Rs.)</label>
                <input
                  type="number"
                  required
                  min="1"
                  max={payingSupplier.balance}
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  placeholder="Enter amount to pay"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition-all text-sm shadow cursor-pointer"
                >
                  Record Payment
                </button>
                <button
                  type="button"
                  onClick={() => setPayingSupplier(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD SUPPLIER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-600" />
                <span>Add New Supplier</span>
              </h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSupplier} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Company / Vendor Name</label>
                <input
                  type="text"
                  required
                  value={newSupplier.name}
                  onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                  placeholder="e.g. Oxford University Press Distribution"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={newSupplier.contact_person}
                    onChange={(e) => setNewSupplier({ ...newSupplier, contact_person: e.target.value })}
                    placeholder="e.g. Haji Rafiq"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newSupplier.phone}
                    onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                    placeholder="0321-7654321"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Address / Wholesale Market</label>
                <input
                  type="text"
                  value={newSupplier.address}
                  onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                  placeholder="e.g. Shop # 12, Urdu Bazar, Lahore"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Payment Terms</label>
                  <select
                    value={newSupplier.payment_terms}
                    onChange={(e) => setNewSupplier({ ...newSupplier, payment_terms: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="Net 30 Days">Net 30 Days</option>
                    <option value="Net 15 Days">Net 15 Days</option>
                    <option value="Cash on Delivery">Cash on Delivery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Opening Payable (Rs.)</label>
                  <input
                    type="number"
                    min="0"
                    value={newSupplier.balance}
                    onChange={(e) => setNewSupplier({ ...newSupplier, balance: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition-all text-sm shadow cursor-pointer"
                >
                  Save Supplier
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
