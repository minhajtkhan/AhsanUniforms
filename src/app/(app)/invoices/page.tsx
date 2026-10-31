'use client'

import { useState, useMemo } from 'react'
import {
  INITIAL_INVOICES,
  type InvoiceItem,
} from '@/lib/data/sample-data'
import {
  formatCurrency,
  formatDateTime,
  getPaymentStatusColor,
  getPaymentMethodLabel,
} from '@/lib/utils'
import {
  ReceiptText,
  Search,
  Filter,
  Printer,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  DollarSign,
  TrendingUp,
  FileText,
} from 'lucide-react'
import { toast } from 'sonner'

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<InvoiceItem[]>(INITIAL_INVOICES)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'partial' | 'unpaid'>('all')

  // Selected invoice for receipt/details modal
  const [viewInvoice, setViewInvoice] = useState<InvoiceItem | null>(null)

  // KPIs
  const totalRevenue = useMemo(() => {
    return invoices.reduce((sum, inv) => sum + inv.total_amount, 0)
  }, [invoices])

  const totalCollected = useMemo(() => {
    return invoices.reduce((sum, inv) => sum + inv.amount_paid, 0)
  }, [invoices])

  const totalDues = useMemo(() => {
    return invoices.reduce((sum, inv) => sum + inv.amount_due, 0)
  }, [invoices])

  // Filtered
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const q = searchQuery.toLowerCase()
      const matchesSearch =
        inv.invoice_number.toLowerCase().includes(q) ||
        inv.customer_name.toLowerCase().includes(q)
      const matchesStatus =
        statusFilter === 'all' || inv.payment_status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [invoices, searchQuery, statusFilter])

  const handleMarkAsPaid = (invId: string) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invId
          ? { ...inv, payment_status: 'paid', amount_paid: inv.total_amount, amount_due: 0 }
          : inv
      )
    )
    if (viewInvoice?.id === invId) {
      setViewInvoice((prev) =>
        prev
          ? { ...prev, payment_status: 'paid', amount_paid: prev.total_amount, amount_due: 0 }
          : null
      )
    }
    toast.success('Invoice marked as fully paid!')
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <ReceiptText className="w-7 h-7 text-indigo-600" />
            <span>Invoices & Sales History</span>
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            View, filter, print receipts, and manage payment settlements
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Invoices</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{invoices.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Billed</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">{formatCurrency(totalRevenue)}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cash Collected</p>
            <p className="text-xl font-bold text-blue-600 mt-0.5">{formatCurrency(totalCollected)}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Dues</p>
            <p className="text-xl font-bold text-orange-600 mt-0.5">{formatCurrency(totalDues)}</p>
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
            placeholder="Search by invoice # (e.g. AS-2026) or customer name..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
          />
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              statusFilter === 'all' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('paid')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              statusFilter === 'paid' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Paid
          </button>
          <button
            onClick={() => setStatusFilter('partial')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              statusFilter === 'partial' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Partial
          </button>
          <button
            onClick={() => setStatusFilter('unpaid')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              statusFilter === 'unpaid' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Unpaid
          </button>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500 tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Invoice #</th>
                <th className="px-4 py-3.5">Date & Time</th>
                <th className="px-4 py-3.5">Customer</th>
                <th className="px-4 py-3.5">Payment Method</th>
                <th className="px-4 py-3.5 text-right">Total Bill</th>
                <th className="px-4 py-3.5 text-right">Paid</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-400">
                    <ReceiptText className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    No invoices found.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-indigo-600">
                      {inv.invoice_number}
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500">
                      {formatDateTime(inv.created_at)}
                    </td>
                    <td className="px-4 py-4 font-medium text-slate-800">
                      <div>{inv.customer_name}</div>
                      {inv.customer_phone && (
                        <div className="text-[11px] text-slate-400 font-normal">{inv.customer_phone}</div>
                      )}
                    </td>
                    <td className="px-4 py-4 text-xs">
                      <span className="capitalize px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                        {getPaymentMethodLabel(inv.payment_method)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right font-bold text-slate-900">
                      {formatCurrency(inv.total_amount)}
                    </td>
                    <td className="px-4 py-4 text-right text-xs">
                      <div className="font-semibold text-slate-800">{formatCurrency(inv.amount_paid)}</div>
                      {inv.amount_due > 0 && (
                        <div className="text-orange-600 font-medium">Due: {formatCurrency(inv.amount_due)}</div>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ${getPaymentStatusColor(
                          inv.payment_status
                        )}`}
                      >
                        {inv.payment_status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setViewInvoice(inv)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs transition-colors cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Receipt</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* INVOICE DETAILS & RECEIPT MODAL */}
      {viewInvoice && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <ReceiptText className="w-5 h-5 text-indigo-600" />
                <span>Invoice #{viewInvoice.invoice_number}</span>
              </h3>
              <button onClick={() => setViewInvoice(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Receipt */}
            <div className="p-4 bg-slate-50 rounded-xl font-mono text-xs text-slate-800 space-y-2 border border-slate-200">
              <div className="text-center">
                <p className="font-bold text-sm tracking-wider uppercase">Ahsan Shop</p>
                <p className="text-[10px] text-slate-500">Stationery & School Uniforms Retailer</p>
                <p className="text-[10px] text-slate-500">Ph: 0308-7350410</p>
              </div>

              <div className="border-t border-b border-dashed border-slate-300 py-1.5 space-y-0.5 text-[11px]">
                <div className="flex justify-between">
                  <span>Bill No:</span>
                  <span className="font-bold">{viewInvoice.invoice_number}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{formatDateTime(viewInvoice.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Customer:</span>
                  <span>{viewInvoice.customer_name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="uppercase font-bold">{viewInvoice.payment_status}</span>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-1 pt-1">
                {viewInvoice.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-[11px]">
                    <span className="truncate max-w-[190px]">
                      {item.quantity}x {item.product_name}
                    </span>
                    <span>Rs. {item.total_price}</span>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="border-t border-dashed border-slate-300 pt-2 space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>Rs. {viewInvoice.subtotal}</span>
                </div>
                {viewInvoice.discount_amount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount:</span>
                    <span>-Rs. {viewInvoice.discount_amount}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-xs pt-1 border-t border-slate-300">
                  <span>Total Amount:</span>
                  <span>Rs. {viewInvoice.total_amount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Paid Amount:</span>
                  <span>Rs. {viewInvoice.amount_paid}</span>
                </div>
                {viewInvoice.amount_due > 0 && (
                  <div className="flex justify-between text-orange-700 font-bold">
                    <span>Remaining Due:</span>
                    <span>Rs. {viewInvoice.amount_due}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Bill</span>
              </button>

              {viewInvoice.payment_status !== 'paid' && (
                <button
                  onClick={() => handleMarkAsPaid(viewInvoice.id)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm cursor-pointer"
                >
                  Mark Full Paid
                </button>
              )}

              <button
                onClick={() => setViewInvoice(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
