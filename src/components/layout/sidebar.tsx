'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/contexts/auth-context'
import { logoutAction } from '@/lib/actions/auth'
import {
  LayoutDashboard,
  ReceiptText,
  Package,
  Users,
  TrendingDown,
  BarChart3,
  Settings,
  ShoppingBag,
  LogOut,
  PlusCircle,
  Truck,
  X,
  Menu,
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { href: '/dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/billing',    label: 'New Bill',    icon: PlusCircle, highlight: true },
  { href: '/invoices',   label: 'Invoices',    icon: ReceiptText },
  { href: '/products',   label: 'Products',    icon: Package },
  { href: '/customers',  label: 'Customers',   icon: Users },
  { href: '/expenses',   label: 'Expenses',    icon: TrendingDown },
  { href: '/suppliers',  label: 'Suppliers',   icon: Truck },
  { href: '/reports',    label: 'Reports',     icon: BarChart3, ownerOnly: true },
  { href: '/settings',   label: 'Settings',    icon: Settings,  ownerOnly: true },
]

interface SidebarProps {
  onClose?: () => void
}

function SidebarContent({ onClose }: SidebarProps) {
  const pathname = usePathname()
  const { user, isOwner } = useAuth()

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-900/30">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-sm leading-tight">Ahsan Shop</p>
            <p className="text-slate-400 text-xs">Billing System</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-white lg:hidden">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          if (item.ownerOnly && !isOwner) return null
          const isActive = item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              onClick={onClose}
              className={cn(
                'sidebar-link group transition-all duration-150',
                isActive && 'active shadow-sm',
                item.highlight && !isActive && 'text-indigo-300 hover:text-white hover:bg-indigo-600/30'
              )}
            >
              <Icon className={cn('w-5 h-5 flex-shrink-0 transition-transform duration-150 group-hover:scale-110', isActive && 'text-white')} />
              <span>{item.label}</span>
              {item.highlight && !isActive && (
                <span className="ml-auto w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-slate-700/50">
        {user && (
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            {user.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatar_url}
                alt={user.full_name}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-slate-600 shadow-sm"
              />
            ) : (
              <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {user.full_name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{user.full_name}</p>
              <p className="text-slate-400 text-xs capitalize">{user.role}</p>
            </div>
          </div>
        )}
        <form action={logoutAction}>
          <button
            type="submit"
            className="sidebar-link w-full text-slate-400 hover:text-red-400 hover:bg-red-400/10"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </div>
  )
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          'sidebar lg:hidden transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent onClose={() => setMobileOpen(false)} />
      </aside>

      {/* Desktop sidebar */}
      <aside className="sidebar hidden lg:flex">
        <SidebarContent />
      </aside>
    </>
  )
}
