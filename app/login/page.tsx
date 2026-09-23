'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-black font-sans antialiased text-zinc-100">
      {/* Left Branding / Hero Column */}
      <div className="hidden lg:flex lg:col-span-5 xl:col-span-6 bg-zinc-950 border-r border-zinc-800 p-12 flex-col justify-between relative overflow-hidden">
        {/* Subtle monochrome mesh background */}
        <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
        
        <div className="relative z-10 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center font-bold text-black shadow-md text-sm tracking-wider">
            IP
          </div>
          <span className="text-lg font-bold tracking-tight text-white uppercase tracking-widest">
            AssetLedger
          </span>
        </div>

        <div className="relative z-10 max-w-md space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-mono tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
            <span>PROPERTY PORTAL</span>
          </div>
          <h1 className="text-3xl xl:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Precision Property Tracking for Enterprises.
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Record, audit, and organize your hardware, serial tags, and personal inventory seamlessly in one centralized ledger.
          </p>
        </div>

        <div className="relative z-10 text-[11px] font-mono text-zinc-600">
          SYSTEM_VER: 2.4.0 // ENCRYPTED SESSION
        </div>
      </div>

      {/* Right Login Form Column */}
      <div className="lg:col-span-7 xl:col-span-6 flex items-center justify-center p-6 sm:p-12 bg-zinc-900">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo Header */}
          <div className="lg:hidden flex items-center space-x-3 mb-6">
            <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center font-bold text-black text-sm">
              IP
            </div>
            <span className="text-lg font-bold text-white uppercase tracking-wider">AssetLedger</span>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Sign In
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Enter your corporate email and credentials below.
            </p>
          </div>

          {error && (
            <div className="bg-zinc-950 border border-zinc-700 text-zinc-200 text-xs p-4 rounded-lg flex items-start space-x-3 font-mono">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2 font-mono">
                Work Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-white transition-all font-mono"
                placeholder="employee@company.com"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2 font-mono">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-white transition-all font-mono"
                placeholder="••••••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white hover:bg-zinc-200 text-black font-semibold py-3 rounded-lg text-xs uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <span>Access Account</span>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-zinc-800 text-center">
            <p className="text-[11px] text-zinc-500 font-mono">
              Protected by Supabase Auth RLS Policies.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
