'use client'

import { useState, useMemo } from 'react'
import {
  INITIAL_CUSTOMERS,
  type CustomerItem,
} from '@/lib/data/sample-data'
import { formatCurrency } from '@/lib/utils'
import {
  Users,
  Plus,
  Search,
  BookOpen,
  DollarSign,
  Phone,
  Mail,
  MapPin,
  X,
  CreditCard,
  Building,
} from 'lucide-react'
import { toast } from 'sonner'

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerItem[]>(INITIAL_CUSTOMERS)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterDuesOnly, setFilterDuesOnly] = useState<'all' | 'dues' | 'clear'>('all')

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [paymentCustomer, setPaymentCustomer] = useState<CustomerItem | null>(null)
  const [paymentAmount, setPaymentAmount] = useState<string>('')
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'jazzcash' | 'bank_transfer'>('cash')

  // New Customer form
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    credit_limit: 15000,
    opening_balance: 0,
    notes: '',
  })

  // KPIs
  const totalCustomers = customers.length
  const totalDues = useMemo(() => {
    return customers.reduce((sum, c) => sum + (c.outstanding_balance || 0), 0)
  }, [customers])
  const customersWithDues = useMemo(() => {
    return customers.filter((c) => (c.outstanding_balance || 0) > 0).length
  }, [customers])

  // Filtered
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const q = searchQuery.toLowerCase()
      const matchesSearch =
        c.name.toLowerCase().includes(q) ||
        (c.phone && c.phone.toLowerCase().includes(q)) ||
        (c.address && c.address.toLowerCase().includes(q)) ||
        (c.notes && c.notes.toLowerCase().includes(q))
      const matchesFilter =
        filterDuesOnly === 'all' ||
        (filterDuesOnly === 'dues' && c.outstanding_balance > 0) ||
        (filterDuesOnly === 'clear' && c.outstanding_balance === 0)
      return matchesSearch && matchesFilter
    })
  }, [customers, searchQuery, filterDuesOnly])

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCustomer.name) {
      toast.error('Please enter customer name')
      return
    }

    const created: CustomerItem = {
      id: `cust-${Date.now()}`,
      name: newCustomer.name,
      phone: newCustomer.phone || null,
      email: newCustomer.email || null,
      address: newCustomer.address || null,
      credit_limit: Number(newCustomer.credit_limit) || 10000,
      outstanding_balance: Number(newCustomer.opening_balance) || 0,
      notes: newCustomer.notes || null,
    }

    setCustomers((prev) => [created, ...prev])
    setIsAddModalOpen(false)
    toast.success(`Customer "${created.name}" registered successfully!`)
    setNewCustomer({
      name: '',
      phone: '',
      email: '',
      address: '',
      credit_limit: 15000,
      opening_balance: 0,
      notes: '',
    })
  }

  const handleReceivePayment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!paymentCustomer) return
    const amt = parseFloat(paymentAmount)
    if (!amt || amt <= 0) {
      toast.error('Please enter a valid payment amount')
      return
    }

    const newBalance = Math.max(0, paymentCustomer.outstanding_balance - amt)
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === paymentCustomer.id ? { ...c, outstanding_balance: newBalance } : c
      )
    )

    toast.success(`Received Rs. ${amt} from ${paymentCustomer.name}! Remaining balance: Rs. ${newBalance}`)
    setPaymentCustomer(null)
    setPaymentAmount('')
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <Users className="w-7 h-7 text-indigo-600" />
            <span>Customers & Khata Ledger</span>
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Manage school accounts, regular parents, credit limits, and outstanding dues (Udhaar)
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-100 text-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Customers</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{totalCustomers}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Outstanding Khata</p>
            <p className="text-xl font-bold text-orange-600 mt-0.5">{formatCurrency(totalDues)}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Accounts with Pending Dues</p>
            <p className="text-2xl font-bold text-red-600 mt-0.5">{customersWithDues}</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, phone number, school or notes..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
          />
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setFilterDuesOnly('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filterDuesOnly === 'all' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Accounts
          </button>
          <button
            onClick={() => setFilterDuesOnly('dues')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filterDuesOnly === 'dues' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            With Dues (Udhaar)
          </button>
          <button
            onClick={() => setFilterDuesOnly('clear')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filterDuesOnly === 'clear' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cleared (Rs. 0)
          </button>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500 tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Customer / Institution</th>
                <th className="px-4 py-3.5">Contact Details</th>
                <th className="px-4 py-3.5">Address</th>
                <th className="px-4 py-3.5 text-right">Credit Limit</th>
                <th className="px-4 py-3.5 text-right">Outstanding Khata</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    No customers found matching your search.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => {
                  const hasDues = c.outstanding_balance > 0
                  return (
                    <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-4 max-w-xs">
                        <div className="font-semibold text-slate-900 flex items-center gap-2">
                          <Building className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <span className="truncate">{c.name}</span>
                        </div>
                        {c.notes && (
                          <p className="text-xs text-slate-400 truncate mt-0.5 ml-6">{c.notes}</p>
                        )}
                      </td>
                      <td className="px-4 py-4 text-xs space-y-0.5">
                        {c.phone && (
                          <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                            <Phone className="w-3.5 h-3.5 text-indigo-500" />
                            <span>{c.phone}</span>
                          </div>
                        )}
                        {c.email && (
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Mail className="w-3.5 h-3.5" />
                            <span className="truncate max-w-[140px]">{c.email}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 text-xs text-slate-500 max-w-xs">
                        {c.address ? (
                          <div className="flex items-start gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                            <span className="truncate">{c.address}</span>
                          </div>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="px-4 py-4 text-right font-medium text-slate-500">
                        {c.credit_limit ? formatCurrency(c.credit_limit) : '—'}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                            hasDues
                              ? 'bg-orange-50 text-orange-700 border border-orange-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {formatCurrency(c.outstanding_balance)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        {hasDues ? (
                          <button
                            onClick={() => {
                              setPaymentCustomer(c)
                              setPaymentAmount(c.outstanding_balance.toString())
                            }}
                            className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors shadow-sm cursor-pointer"
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                            <span>Receive</span>
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">Cleared</span>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECEIVE PAYMENT MODAL */}
      {paymentCustomer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                <span>Receive Khata Payment</span>
              </h3>
              <button onClick={() => setPaymentCustomer(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-orange-50 p-3 rounded-xl border border-orange-100 text-xs">
              <p className="font-semibold text-slate-800">{paymentCustomer.name}</p>
              <p className="text-orange-700 mt-0.5">
                Current Due Balance: <span className="font-bold">{formatCurrency(paymentCustomer.outstanding_balance)}</span>
              </p>
            </div>

            <form onSubmit={handleReceivePayment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Payment Amount (Rs.)</label>
                <input
                  type="number"
                  required
                  min="1"
                  max={paymentCustomer.outstanding_balance}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="Enter amount paid"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-base font-bold text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="cash">Cash Payment</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl transition-all text-sm shadow cursor-pointer"
                >
                  Record Payment
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentCustomer(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD CUSTOMER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-600" />
                <span>Register New Customer</span>
              </h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Customer / School Name</label>
                <input
                  type="text"
                  required
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  placeholder="e.g. Al-Huda Academy or Tariq Mehmood"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    placeholder="0300-1234567"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    placeholder="info@school.com"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Address</label>
                <input
                  type="text"
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                  placeholder="Street / Sector / City"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Credit Limit (Rs.)</label>
                  <input
                    type="number"
                    min="0"
                    value={newCustomer.credit_limit}
                    onChange={(e) => setNewCustomer({ ...newCustomer, credit_limit: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Opening Udhaar (Rs.)</label>
                  <input
                    type="number"
                    min="0"
                    value={newCustomer.opening_balance}
                    onChange={(e) => setNewCustomer({ ...newCustomer, opening_balance: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={newCustomer.notes}
                  onChange={(e) => setNewCustomer({ ...newCustomer, notes: e.target.value })}
                  placeholder="Notes on student classes, uniform requirements..."
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition-all text-sm shadow cursor-pointer"
                >
                  Save Customer
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
