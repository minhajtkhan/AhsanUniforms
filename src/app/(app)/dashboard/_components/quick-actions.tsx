import Link from 'next/link'
import { PlusCircle, Package, TrendingDown, DollarSign } from 'lucide-react'

interface Props {
  isOwner: boolean
}

export default function QuickActions({ isOwner }: Props) {
  void isOwner
  const actions = [
    {
      href: '/billing',
      label: 'New Bill',
      description: 'Create a new invoice',
      icon: PlusCircle,
      color: 'bg-indigo-600 hover:bg-indigo-700',
      textColor: 'text-white',
    },
    {
      href: '/products/new',
      label: 'Add Product',
      description: 'Add to inventory',
      icon: Package,
      color: 'bg-emerald-600 hover:bg-emerald-700',
      textColor: 'text-white',
    },
    {
      href: '/expenses/new',
      label: 'Add Expense',
      description: 'Record a payment',
      icon: TrendingDown,
      color: 'bg-orange-500 hover:bg-orange-600',
      textColor: 'text-white',
    },
    {
      href: '/customers',
      label: 'Receive Payment',
      description: 'Record customer payment',
      icon: DollarSign,
      color: 'bg-sky-600 hover:bg-sky-700',
      textColor: 'text-white',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action) => {
        const Icon = action.icon
        return (
          <Link
            key={action.href}
            href={action.href}
            className={`${action.color} ${action.textColor} rounded-2xl p-5 flex flex-col gap-3 transition-all duration-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0`}
          >
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">{action.label}</p>
              <p className="text-xs opacity-80 mt-0.5">{action.description}</p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
