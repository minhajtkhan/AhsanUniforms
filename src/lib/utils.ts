import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, symbol = 'Rs.') {
  return `${symbol} ${amount.toLocaleString('en-PK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function formatDate(date: string | Date, fmt = 'dd MMM yyyy') {
  return format(new Date(date), fmt)
}

export function formatDateTime(date: string | Date) {
  return format(new Date(date), 'dd MMM yyyy, hh:mm a')
}

export function timeAgo(date: string | Date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function getPaymentStatusColor(status: string) {
  switch (status) {
    case 'paid':    return 'text-green-600 bg-green-50 border-green-200'
    case 'partial': return 'text-orange-600 bg-orange-50 border-orange-200'
    case 'unpaid':  return 'text-red-600 bg-red-50 border-red-200'
    case 'overdue': return 'text-red-700 bg-red-100 border-red-300'
    default:        return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

export function getInvoiceStatusColor(status: string) {
  switch (status) {
    case 'finalized':  return 'text-green-700 bg-green-50 border-green-200'
    case 'held':       return 'text-blue-700 bg-blue-50 border-blue-200'
    case 'draft':      return 'text-gray-600 bg-gray-50 border-gray-200'
    case 'cancelled':  return 'text-gray-500 bg-gray-100 border-gray-300'
    case 'returned':   return 'text-purple-700 bg-purple-50 border-purple-200'
    default:           return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

export function getPaymentStatusLabel(status: string) {
  switch (status) {
    case 'paid':    return 'Paid'
    case 'partial': return 'Partial'
    case 'unpaid':  return 'Unpaid'
    case 'overdue': return 'Overdue'
    default:        return status
  }
}

export function getPaymentMethodLabel(method: string) {
  switch (method) {
    case 'cash':      return 'Cash'
    case 'credit':    return 'Udhaar (Credit)'
    case 'easypaisa': return 'EasyPaisa'
    case 'partial':   return 'Partial (Cash + Udhaar)'
    default:          return method === 'credit' ? 'Udhaar' : method
  }
}

export function generateSKU(name: string, category?: string) {
  const prefix = (category?.slice(0, 2) ?? 'PR').toUpperCase()
  const namePart = name.slice(0, 3).toUpperCase()
  const random = Math.floor(Math.random() * 9000) + 1000
  return `${prefix}-${namePart}-${random}`
}

export function calculateInvoiceTotals(
  items: Array<{ unit_price: number; quantity: number; discount_amount: number }>,
  discountType: 'percentage' | 'fixed' | null,
  discountValue: number,
  taxRate: number
) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.unit_price * item.quantity - item.discount_amount,
    0
  )
  const discountAmount =
    discountType === 'percentage'
      ? (subtotal * discountValue) / 100
      : discountType === 'fixed'
      ? discountValue
      : 0
  const afterDiscount = subtotal - discountAmount
  const taxAmount = (afterDiscount * taxRate) / 100
  const total = afterDiscount + taxAmount

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discountAmount: Math.round(discountAmount * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    total: Math.round(total * 100) / 100,
  }
}
