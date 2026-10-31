'use client'

import { useState } from 'react'
import { formatCurrency } from '@/lib/utils'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  CheckCircle2,
  Lock,
  ArrowUpRight,
  PieChart,
  ShoppingBag,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from 'recharts'

const CHART_DATA = [
  { day: 'Mon', sales: 18500, expenses: 3200 },
  { day: 'Tue', sales: 24200, expenses: 2300 },
  { day: 'Wed', sales: 29800, expenses: 8400 },
  { day: 'Thu', sales: 21500, expenses: 1850 },
  { day: 'Fri', sales: 38200, expenses: 4500 },
  { day: 'Sat', sales: 44600, expenses: 5200 },
  { day: 'Sun', sales: 31000, expenses: 2900 },
]

const TOP_PRODUCTS = [
  { name: 'Double A Photocopy Paper A4 80gsm Ream', qty: 64, revenue: 99200, profit: 25600 },
  { name: 'Boys School Uniform White Shirt (Size 30)', qty: 48, revenue: 45600, profit: 15840 },
  { name: 'Boys School Uniform Grey Trousers (Size 32)', qty: 32, revenue: 43200, profit: 16000 },
  { name: 'Classmate 4-Line English Exercise Copy (120 Pgs)', qty: 280, revenue: 36400, profit: 12600 },
  { name: 'Piano Crystal Ballpoint Blue 0.8mm (Box 10)', qty: 95, revenue: 20900, profit: 6650 },
]

export default function ReportsPage() {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week')

  // Daily Closing Register state
  const [openingCash, setOpeningCash] = useState<number>(5000)
  const cashSales = 24200
  const cashExpenses = 2300
  const expectedCash = openingCash + cashSales - cashExpenses
  const [actualCash, setActualCash] = useState<string>('26900')
  const [closingNotes, setClosingNotes] = useState('Counter register balanced smoothly. Cash matched drawer.')
  const [isClosed, setIsClosed] = useState(false)

  const actualNum = parseFloat(actualCash) || 0
  const discrepancy = actualNum - expectedCash

  // Summary figures
  const grossSales = 207800
  const cogs = 131110
  const grossProfit = grossSales - cogs
  const totalExpenses = 28350
  const netProfit = grossProfit - totalExpenses

  const handleCloseRegister = () => {
    setIsClosed(true)
    toast.success('Daily cash register closed & reconciled successfully!')
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <BarChart3 className="w-7 h-7 text-indigo-600" />
            <span>Financial Reports & Analytics</span>
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Profit & Loss statements, sales performance, and daily cash drawer reconciliation
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm text-xs font-semibold">
          {(['week', 'month', 'year'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3.5 py-1.5 rounded-lg capitalize transition-colors cursor-pointer ${
                period === p ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              This {p}
            </button>
          ))}
        </div>
      </div>

      {/* P&L Executive Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gross Sales Revenue</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(grossSales)}</p>
          <p className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1.5">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+14.8% vs last week</span>
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cost of Goods Sold (COGS)</p>
          <p className="text-2xl font-bold text-slate-600 mt-1">{formatCurrency(cogs)}</p>
          <p className="text-xs text-slate-400 mt-1.5">Wholesale stock inventory cost</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Operating Expenses</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{formatCurrency(totalExpenses)}</p>
          <p className="text-xs text-slate-400 mt-1.5">Rent, bills, staff tea & salaries</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 text-white p-5 rounded-2xl shadow-md space-y-1">
          <p className="text-xs font-semibold text-indigo-200 uppercase tracking-wider">Net Business Profit</p>
          <p className="text-2xl font-bold text-white mt-1">{formatCurrency(netProfit)}</p>
          <p className="text-xs text-emerald-300 font-medium">Net Margin: {Math.round((netProfit / grossSales) * 100)}%</p>
        </div>
      </div>

      {/* Revenue vs Expenses Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <span>Daily Sales vs Expenses (Past 7 Days)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">PKR values compared across shop counter days</p>
          </div>
          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
            Total Revenue: {formatCurrency(grossSales)}
          </span>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `Rs.${v / 1000}k`} />
              <Tooltip
                formatter={(val: any) => formatCurrency(Number(val))}
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="sales" name="Sales Revenue" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expenses" name="Shop Expenses" fill="#f97316" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: Daily Register Closing (Left) & Top Products (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Daily Cash Closing Reconciliation (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-indigo-600" />
                <span>Daily Register Closing</span>
              </h2>
              <p className="text-xs text-slate-400">Cash drawer balancing for today</p>
            </div>
            {isClosed && (
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Reconciled</span>
              </span>
            )}
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500">Opening Cash Drawer:</span>
              <input
                type="number"
                disabled={isClosed}
                value={openingCash}
                onChange={(e) => setOpeningCash(parseFloat(e.target.value) || 0)}
                className="w-28 text-right px-2 py-1 border border-slate-200 rounded-lg font-semibold"
              />
            </div>
            <div className="flex justify-between py-1 text-emerald-600">
              <span>+ Cash Sales Today:</span>
              <span className="font-semibold">{formatCurrency(cashSales)}</span>
            </div>
            <div className="flex justify-between py-1 text-red-600">
              <span>- Petty Expenses Paid:</span>
              <span className="font-semibold">-{formatCurrency(cashExpenses)}</span>
            </div>
            <div className="flex justify-between py-2 border-t border-b border-dashed border-slate-200 font-bold text-sm text-slate-900">
              <span>Expected Cash in Drawer:</span>
              <span className="text-indigo-600">{formatCurrency(expectedCash)}</span>
            </div>

            <div className="space-y-1 pt-1">
              <label className="block font-semibold text-slate-700">Actual Counted Cash (Rs.)</label>
              <input
                type="number"
                disabled={isClosed}
                value={actualCash}
                onChange={(e) => setActualCash(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-base font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Discrepancy Alert */}
            <div
              className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between ${
                discrepancy === 0
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : discrepancy > 0
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              <span>Discrepancy:</span>
              <span>
                {discrepancy === 0
                  ? 'Exact Match (Rs. 0)'
                  : discrepancy > 0
                  ? `+${formatCurrency(discrepancy)} (Over)`
                  : `-${formatCurrency(Math.abs(discrepancy))} (Short)`}
              </span>
            </div>

            <div>
              <label className="block text-slate-500 mb-1">Closing Notes</label>
              <textarea
                rows={2}
                disabled={isClosed}
                value={closingNotes}
                onChange={(e) => setClosingNotes(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs focus:outline-none"
              />
            </div>

            <button
              onClick={handleCloseRegister}
              disabled={isClosed}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-semibold py-2.5 rounded-xl transition-all shadow text-sm cursor-pointer"
            >
              {isClosed ? 'Register Closed' : 'Close Drawer & Save'}
            </button>
          </div>
        </div>

        {/* Top Selling Products (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-indigo-600" />
                <span>Top 5 Best-Selling Items</span>
              </h2>
              <p className="text-xs text-slate-400">By sales volume and gross profitability</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {TOP_PRODUCTS.map((prod, index) => (
              <div key={index} className="py-3 flex items-center justify-between text-xs gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </span>
                  <div className="truncate">
                    <p className="font-semibold text-slate-900 truncate">{prod.name}</p>
                    <p className="text-slate-400 mt-0.5">{prod.qty} units sold</p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-slate-900">{formatCurrency(prod.revenue)}</p>
                  <p className="text-emerald-600 font-medium">Profit: {formatCurrency(prod.profit)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
