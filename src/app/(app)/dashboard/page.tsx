import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import type { Database } from '@/lib/supabase/database.types'
import Link from 'next/link'
import {
  TrendingUp, Users, AlertTriangle,
  PlusCircle, Package, ReceiptText, ArrowRight,
} from 'lucide-react'
import { getUser } from '@/lib/actions/auth'
import SalesChart from './_components/sales-chart'
import QuickActions from './_components/quick-actions'

export const metadata = { title: 'Dashboard' }

type Invoice    = Database['public']['Tables']['invoices']['Row']
type Product    = Database['public']['Tables']['products']['Row']
type Customer   = Database['public']['Tables']['customers']['Row']

interface RecentInvoice extends Invoice {
  customers: { name: string; phone: string | null } | null
}

async function getDashboardData() {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    .toISOString().split('T')[0]

  const [
    { data: todayInvoices },
    { data: recentInvoices },
    { data: lowStockProducts },
    { data: pendingDues },
    { data: salesLast7Days },
  ] = await Promise.all([
    supabase
      .from('invoices')
      .select('total_amount, amount_paid, payment_method')
      .eq('status', 'finalized')
      .gte('finalized_at', `${today}T00:00:00`)
      .lte('finalized_at', `${today}T23:59:59`),

    supabase
      .from('invoices')
      .select(`
        id, invoice_number, status, payment_status, total_amount, amount_due,
        created_at, finalized_at,
        customers(name, phone)
      `)
      .neq('status', 'draft')
      .order('created_at', { ascending: false })
      .limit(10),

    supabase
      .from('products')
      .select('id, name, stock_quantity, low_stock_threshold, unit')
      .eq('is_active', true)
      .eq('has_variants', false)
      .limit(5),

    supabase
      .from('customers')
      .select('outstanding_balance')
      .gt('outstanding_balance', 0),

    supabase
      .from('invoices')
      .select('total_amount, finalized_at')
      .eq('status', 'finalized')
      .gte('finalized_at', `${sevenDaysAgo}T00:00:00`)
      .order('finalized_at', { ascending: true }),
  ])

  const todayList = (todayInvoices ?? []) as Pick<Invoice, 'total_amount' | 'amount_paid' | 'payment_method'>[]
  const todaySales = todayList.reduce((s, i) => s + Number(i.total_amount), 0)
  const todayCash = todayList
    .filter((i) => i.payment_method === 'cash')
    .reduce((s, i) => s + Number(i.amount_paid), 0)

  const customerList = (pendingDues ?? []) as Pick<Customer, 'outstanding_balance'>[]
  const totalDues = customerList.reduce((s, c) => s + Number(c.outstanding_balance), 0)

  // Build 7-day chart data
  const chartMap: Record<string, number> = {}
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    const key = d.toISOString().split('T')[0]
    chartMap[key] = 0
  }
  const salesList = (salesLast7Days ?? []) as Pick<Invoice, 'total_amount' | 'finalized_at'>[]
  salesList.forEach((inv) => {
    const key = (inv.finalized_at ?? '').split('T')[0]
    if (key in chartMap) chartMap[key] += Number(inv.total_amount)
  })
  const chartData = Object.entries(chartMap).map(([date, amount]) => ({
    date,
    label: new Date(date).toLocaleDateString('en-PK', { weekday: 'short' }),
    amount,
  }))

  return {
    todaySales,
    todayCash,
    totalDues,
    todayInvoiceCount: todayList.length,
    recentInvoices: (recentInvoices ?? []) as RecentInvoice[],
    lowStockProducts: (lowStockProducts ?? []) as Pick<Product, 'id' | 'name' | 'stock_quantity' | 'low_stock_threshold' | 'unit'>[],
    chartData,
  }
}

export default async function DashboardPage() {
  const [user, data] = await Promise.all([getUser(), getDashboardData()])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'

  const stats = [
    {
      label: "Today's Sales",
      value: formatCurrency(data.todaySales),
      sub: `${data.todayInvoiceCount} invoices`,
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-100',
    },
    {
      label: 'Cash Received Today',
      value: formatCurrency(data.todayCash),
      sub: 'Cash payments only',
      icon: TrendingUp,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
    },
    {
      label: 'Customer Dues',
      value: formatCurrency(data.totalDues),
      sub: 'Total outstanding',
      icon: Users,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      border: 'border-orange-100',
    },
    {
      label: 'Low Stock Items',
      value: data.lowStockProducts.length.toString(),
      sub: 'Needs restocking',
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-100',
    },
  ]

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="text-slate-500 mt-0.5">
            Good {greeting}, {user?.full_name?.split(' ')[0] ?? 'there'} 👋
          </p>
        </div>
        <Link
          href="/billing"
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 text-sm"
        >
          <PlusCircle className="w-4 h-4" />
          New Bill
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="stat-card">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 ${stat.bg} ${stat.border} border rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 leading-tight">{stat.value}</p>
              <p className="text-sm font-medium text-slate-700 mt-1">{stat.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{stat.sub}</p>
            </div>
          )
        })}
      </div>

      {/* Quick actions */}
      <QuickActions isOwner={user?.role === 'owner'} />

      {/* Chart + Low stock row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Sales — Last 7 Days</h2>
              <p className="text-sm text-slate-500">Revenue trend</p>
            </div>
          </div>
          <SalesChart data={data.chartData} />
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Low Stock</h2>
            <Link href="/products?filter=low_stock" className="text-xs text-indigo-600 font-medium hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {data.lowStockProducts.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Package className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">All items well stocked!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.lowStockProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-slate-800 truncate max-w-[140px]">{p.name}</p>
                    <p className="text-xs text-slate-500">Min: {p.low_stock_threshold} {p.unit}</p>
                  </div>
                  <span className="text-sm font-bold text-red-600">{p.stock_quantity} left</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent invoices */}
      <div className="card">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-50">
          <h2 className="text-lg font-semibold text-slate-900">Recent Invoices</h2>
          <Link href="/invoices" className="text-xs text-indigo-600 font-medium hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {data.recentInvoices.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <ReceiptText className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-base font-medium">No invoices yet</p>
            <p className="text-sm mt-1">Create your first bill to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.recentInvoices.map((inv) => (
                  <tr key={inv.id}>
                    <td className="font-mono text-xs font-semibold text-indigo-700">{inv.invoice_number}</td>
                    <td>
                      <p className="font-medium text-slate-800">
                        {inv.customers?.name ?? 'Walk-in'}
                      </p>
                    </td>
                    <td className="font-semibold">{formatCurrency(Number(inv.total_amount))}</td>
                    <td>
                      <span className={`badge-${inv.payment_status}`}>
                        {inv.payment_status.charAt(0).toUpperCase() + inv.payment_status.slice(1)}
                      </span>
                    </td>
                    <td className="text-slate-500 text-xs">{formatDateTime(inv.created_at)}</td>
                    <td>
                      <Link href={`/invoices/${inv.id}`} className="text-indigo-600 hover:text-indigo-800 text-xs font-medium">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
