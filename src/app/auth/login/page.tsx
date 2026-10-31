'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { loginAction, type LoginState } from '@/lib/actions/auth'
import { Loader2, ShoppingBag, Eye, EyeOff, Mail, Lock, AlertCircle, ShieldCheck } from 'lucide-react'
import { useState } from 'react'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 text-base shadow-lg shadow-indigo-500/30 cursor-pointer relative overflow-hidden group"
    >
      <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl" />
      {pending ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : null}
      {pending ? 'Signing in…' : 'Sign In'}
    </button>
  )
}

const initialState: LoginState = {}

export default function LoginPage() {
  const [state, formAction] = useActionState(loginAction, initialState)
  const [showPassword, setShowPassword] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)

  return (
    <div className="min-h-screen flex">

      {/* ── Left panel — decorative ── */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 flex-col items-center justify-center p-12 overflow-hidden">

        {/* Background orbs */}
        <div className="absolute w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-3xl -top-32 -left-32 pointer-events-none" />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-purple-600/15 blur-3xl -bottom-24 -right-24 pointer-events-none" />
        <div className="absolute w-[300px] h-[300px] rounded-full bg-blue-500/10 blur-2xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Content */}
        <div className="relative z-10 text-center max-w-sm">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 shadow-2xl mb-8">
            <ShoppingBag className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">Ahsan Shop</h1>
          <p className="text-indigo-200 text-lg font-medium mb-10">Billing & Finance System</p>

          {/* Feature pills */}
          <div className="flex flex-col gap-3 text-left">
            {[
              { icon: '📊', label: 'Real-time Sales Dashboard' },
              { icon: '🧾', label: 'Smart Invoice Generation' },
              { icon: '📦', label: 'Inventory & Product Tracking' },
              { icon: '💰', label: 'Expense & Finance Reports' },
            ].map((f) => (
              <div
                key={f.label}
                className="flex items-center gap-3 bg-white/8 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2.5"
              >
                <span className="text-xl">{f.icon}</span>
                <span className="text-sm text-indigo-100 font-medium">{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom badge */}
        <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-2 text-indigo-300/60 text-xs">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>256-bit encrypted · Secure access</span>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 p-6 sm:p-10">

        {/* Mobile logo */}
        <div className="lg:hidden text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-300/50 mb-3">
            <ShoppingBag className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Ahsan Shop</h1>
          <p className="text-slate-500 text-sm mt-0.5">Billing & Finance System</p>
        </div>

        {/* Form card */}
        <div className="w-full max-w-sm animate-fade-in">

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h2>
            <p className="text-slate-500 text-sm">Sign in to access your portal</p>
          </div>

          {/* Error banner */}
          {state.error && (
            <div className="mb-5 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
              <span>{state.error}</span>
            </div>
          )}

          <form action={formAction} className="space-y-5">

            {/* Email / Username */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                Username / Email
              </label>
              <div className={`relative flex items-center rounded-xl border transition-all duration-200 bg-white ${emailFocused ? 'border-indigo-500 ring-4 ring-indigo-500/10 shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}>
                <Mail className={`absolute left-3.5 w-4.5 h-4.5 transition-colors ${emailFocused ? 'text-indigo-500' : 'text-slate-400'}`} />
                <input
                  id="email"
                  name="email"
                  type="text"
                  autoComplete="username"
                  required
                  placeholder="Enter your username or email"
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  className="w-full pl-10 pr-4 py-3 bg-transparent rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                  Password
                </label>
              </div>
              <div className={`relative flex items-center rounded-xl border transition-all duration-200 bg-white ${passwordFocused ? 'border-indigo-500 ring-4 ring-indigo-500/10 shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}>
                <Lock className={`absolute left-3.5 w-4.5 h-4.5 transition-colors ${passwordFocused ? 'text-indigo-500' : 'text-slate-400'}`} />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  className="w-full pl-10 pr-12 py-3 bg-transparent rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded-md focus-visible:ring-2 focus-visible:ring-indigo-400"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-1">
              <SubmitButton />
            </div>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-300" />
            <span>Authorized Access Only · Ahsan Shop Portal</span>
          </div>
        </div>
      </div>
    </div>
  )
}
