'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  INITIAL_EXPENSES,
  type ExpenseItem,
} from '@/lib/data/sample-data'
import { formatCurrency, formatDate } from '@/lib/utils'
import {
  TrendingDown,
  Plus,
  Search,
  Calendar,
  Banknote,
  Building,
  Coffee,
  Package,
  Truck,
  Wrench,
  Zap,
  Users,
  Trash2,
  FileText,
} from 'lucide-react'
import { toast } from 'sonner'

const EXPENSE_CATEGORIES = [
  { name: 'Material / Stock Purchase', icon: Truck, color: 'text-purple-600 bg-purple-50' },
  { name: 'Shop Rent', icon: Building, color: 'text-indigo-600 bg-indigo-50' },
  { name: 'Electricity & Utilities', icon: Zap, color: 'text-amber-600 bg-amber-50' },
  { name: 'Staff Salaries', icon: Users, color: 'text-blue-600 bg-blue-50' },
  { name: 'Chai & Daily Refreshments', icon: Coffee, color: 'text-orange-600 bg-orange-50' },
  { name: 'Packaging & Bags', icon: Package, color: 'text-pink-600 bg-pink-50' },
  { name: 'Freight & Cargo', icon: Truck, color: 'text-emerald-600 bg-emerald-50' },
  { name: 'Shop Maintenance', icon: Wrench, color: 'text-slate-600 bg-slate-100' },
]

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<ExpenseItem[]>(INITIAL_EXPENSES)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // KPIs
  const totalExpenses = useMemo(() => {
    return expenses.reduce((sum, e) => sum + e.amount, 0)
  }, [expenses])

  const todayExpenses = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    return expenses
      .filter((e) => e.expense_date === today)
      .reduce((sum, e) => sum + e.amount, 0)
  }, [expenses])

  // Filtered
  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const q = searchQuery.toLowerCase()
      const matchesSearch =
        e.title.toLowerCase().includes(q) ||
        e.category_name.toLowerCase().includes(q) ||
        (e.reference_no && e.reference_no.toLowerCase().includes(q)) ||
        (e.supplier_name && e.supplier_name.toLowerCase().includes(q))
      const matchesCategory =
        selectedCategory === 'all' || e.category_name === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [expenses, searchQuery, selectedCategory])

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id))
    toast.success('Expense record removed')
  }

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <TrendingDown className="w-7 h-7 text-red-600" />
            <span>Daily Expenses & Purchases</span>
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Track shop overheads, bills, and wholesale material/stock purchases from suppliers
          </p>
        </div>
        <Link
          href="/expenses/new"
          prefetch={true}
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-red-100 text-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Record New Expense</span>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Expenses Logged</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">{formatCurrency(totalExpenses)}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Today's Expenses</p>
            <p className="text-xl font-bold text-indigo-600 mt-0.5">{formatCurrency(todayExpenses)}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Banknote className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Records</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">{expenses.length} entries</p>
          </div>
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Categories
        </button>
        {EXPENSE_CATEGORIES.map((c) => {
          const Icon = c.icon
          const isSelected = selectedCategory === c.name
          return (
            <button
              key={c.name}
              onClick={() => setSelectedCategory(c.name)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{c.name}</span>
            </button>
          )
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, category, supplier, voucher #..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <p className="text-xs text-slate-500">
          Showing <span className="font-bold text-slate-900">{filteredExpenses.length}</span> recorded expenses
        </p>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500 tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Expense / Purchase Particulars</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Date</th>
                <th className="px-4 py-3.5">Payment Method</th>
                <th className="px-4 py-3.5">Reference #</th>
                <th className="px-4 py-3.5 text-right">Amount (PKR)</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                    <TrendingDown className="w-8 h-8 mx-auto mb-2 opacity-40 text-red-500" />
                    No expenses recorded for this filter.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4 font-semibold text-slate-900 max-w-sm">
                      <p className="text-sm">{exp.title}</p>
                      {exp.supplier_name && (
                        <div className="flex items-center gap-1.5 mt-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100/60 px-2.5 py-0.5 rounded-md w-fit">
                          <Truck className="w-3 h-3 text-indigo-600" />
                          <span>Supplier: {exp.supplier_name}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 text-xs">
                      <span className="inline-block px-2.5 py-1 rounded-lg font-medium bg-slate-100 text-slate-700">
                        {exp.category_name}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500">
                      {formatDate(exp.expense_date)}
                    </td>
                    <td className="px-4 py-4 text-xs">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold ${
                          exp.payment_method === 'cash'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                            : 'bg-amber-50 text-amber-800 border border-amber-200/60'
                        }`}
                      >
                        {exp.payment_method === 'cash' ? (
                          <>
                            <Banknote className="w-3 h-3" />
                            <span>Cash</span>
                          </>
                        ) : (
                          <>
                            <FileText className="w-3 h-3" />
                            <span>Udhaar (Credit)</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-mono text-xs text-slate-400">
                      {exp.reference_no || '—'}
                    </td>
                    <td className="px-4 py-4 text-right font-bold text-red-600 text-sm">
                      -{formatCurrency(exp.amount)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleDeleteExpense(exp.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
