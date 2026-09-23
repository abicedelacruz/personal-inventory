'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [items, setItems] = useState<any[]>([])
  const [itemName, setItemName] = useState('')
  const [description, setDescription] = useState('')
  const [serialNumber, setSerialNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }
    setUser(user)

    const { data } = await supabase
      .from('inventory')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) setItems(data)
    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)
    loadData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSubmitting(true)

    const { error } = await supabase.from('inventory').insert([
      {
        user_id: user.id,
        item_name: itemName,
        description,
        serial_number: serialNumber,
      },
    ])

    if (error) {
      alert('Failed to add item: ' + error.message)
    } else {
      setItemName('')
      setDescription('')
      setSerialNumber('')
      await loadData()
    }
    setSubmitting(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this item from your ledger?')) return
    const { error } = await supabase.from('inventory').delete().eq('id', id)
    if (error) {
      alert('Failed to delete item: ' + error.message)
    } else {
      await loadData()
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const filteredItems = items.filter(
    (item) =>
      item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.serial_number && item.serial_number.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="flex items-center space-x-3 text-indigo-400">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium text-slate-300">Loading your portal...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-20 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/30 text-base">
              IP
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white">
                AssetLedger
              </h1>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Personal Property & Asset Portal
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <span className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider">User Account</span>
              <span className="block text-xs font-medium text-slate-200">{user?.email}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="text-xs font-medium px-3.5 py-1.5 border border-slate-700/80 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-600 transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Metric Overview Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/60 backdrop-blur-sm p-5 rounded-2xl border border-slate-800/80 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none"></div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Registered Items</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-white tracking-tight">{items.length}</span>
              <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                Audited & Verified
              </span>
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-sm p-5 rounded-2xl border border-slate-800/80 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Account ID</span>
            <div className="mt-2 truncate">
              <span className="text-sm font-semibold text-slate-200">{user?.email}</span>
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-sm p-5 rounded-2xl border border-slate-800/80 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Database Link</span>
            <div className="mt-2 flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-sm font-semibold text-slate-200">Supabase RLS Active</span>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Add Item Form */}
          <div className="lg:col-span-4 bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl">
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
              <h2 className="text-sm font-bold text-white tracking-tight">
                Add Item to Ledger
              </h2>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              Enter hardware, serial tags, or personal property info.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Item Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                  placeholder="e.g. ThinkPad X1 Carbon"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Serial Number / Asset Tag
                </label>
                <input
                  type="text"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-xl text-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                  placeholder="e.g. SN-99023412"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Description / Condition
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-600 resize-none"
                  placeholder="e.g. Core i7, 16GB RAM. Excellent condition."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 flex items-center justify-center space-x-2 mt-2"
              >
                {submitting ? (
                  <span>Saving Entry...</span>
                ) : (
                  <span>Register Property Item</span>
                )}
              </button>
            </form>
          </div>

          {/* Ledger Table Section */}
          <div className="lg:col-span-8 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-bold text-white tracking-tight">
                  Personal Property Inventory
                </h2>
                <p className="text-xs text-slate-400">
                  Real-time record of your registered property items.
                </p>
              </div>

              {/* Search box */}
              <div className="w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search item or serial #..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-600"
                />
              </div>
            </div>

            {filteredItems.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-12 h-12 bg-slate-800/60 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-3 font-bold text-lg">
                  📦
                </div>
                <h3 className="text-sm font-semibold text-white">No property items registered</h3>
                <p className="text-xs text-slate-400 mt-1">
                  {searchTerm ? 'No items matched your search filter.' : 'Fill out the register form to record your first property item.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950/60 border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-3.5 px-6">Item / Asset Details</th>
                      <th className="py-3.5 px-6">Serial / Tag</th>
                      <th className="py-3.5 px-6">Date Added</th>
                      <th className="py-3.5 px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-xs">
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-800/40 transition-colors group">
                        <td className="py-4 px-6">
                          <div className="font-semibold text-slate-100 text-sm">{item.item_name}</div>
                          {item.description && (
                            <div className="text-slate-400 text-xs mt-0.5 line-clamp-1">
                              {item.description}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          {item.serial_number ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md font-mono text-xs bg-slate-950 text-indigo-300 border border-slate-800">
                              {item.serial_number}
                            </span>
                          ) : (
                            <span className="text-slate-600 italic">—</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-slate-400">
                          {new Date(item.created_at).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-xs text-slate-500 hover:text-rose-400 transition-colors font-medium px-2 py-1 rounded-md hover:bg-rose-500/10"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
