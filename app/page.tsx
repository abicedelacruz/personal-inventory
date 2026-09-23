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

    const { data, error } = await supabase
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
    if (!confirm('Are you sure you want to delete this item?')) return
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex items-center space-x-3 text-slate-500">
          <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Loading workspace...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200/80 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-semibold text-sm">
              IP
            </div>
            <div>
              <h1 className="text-base font-semibold tracking-tight text-slate-900">
                Property Inventory
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">
                Asset & Hardware Tracking System
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <span className="block text-xs font-medium text-slate-700">Account</span>
              <span className="block text-xs text-slate-500">{user?.email}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="text-xs font-medium px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Items</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl font-bold text-slate-900">{items.length}</span>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                Active
              </span>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Registered Owner</span>
            <div className="mt-2 truncate">
              <span className="text-sm font-semibold text-slate-800">{user?.email}</span>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">System Status</span>
            <div className="mt-2 flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-sm font-semibold text-slate-800">Cloud Sync Active</span>
            </div>
          </div>
        </div>

        {/* Form and Table Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Add Item Panel */}
          <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/80 shadow-sm p-6">
            <h2 className="text-base font-semibold text-slate-900 mb-1">
              Register New Property
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Enter hardware, device, or item details below.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 uppercase tracking-wider mb-1">
                  Item Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all placeholder:text-slate-400"
                  placeholder="e.g. MacBook Pro 16&quot;"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 uppercase tracking-wider mb-1">
                  Serial / Tag Number
                </label>
                <input
                  type="text"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all placeholder:text-slate-400 font-mono"
                  placeholder="e.g. C02G1024MD6M"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 uppercase tracking-wider mb-1">
                  Description / Condition
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all placeholder:text-slate-400"
                  placeholder="e.g. M1 Max, 32GB RAM. Slight wear on palm rest."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded-lg text-sm transition-all shadow-sm disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {submitting ? (
                  <span>Saving Item...</span>
                ) : (
                  <span>Add Property to Ledger</span>
                )}
              </button>
            </form>
          </div>

          {/* Item List Panel */}
          <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Property Ledger
                </h2>
                <p className="text-xs text-slate-500">
                  Your registered personal and company property items.
                </p>
              </div>

              {/* Search input */}
              <div className="w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Filter items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>

            {filteredItems.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400 font-bold">
                  !
                </div>
                <h3 className="text-sm font-medium text-slate-900">No items found</h3>
                <p className="text-xs text-slate-500 mt-1">
                  {searchTerm ? 'No results match your search query.' : 'Use the form to add your first property item.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-6">Item Details</th>
                      <th className="py-3 px-6">Serial / Tag</th>
                      <th className="py-3 px-6">Registered Date</th>
                      <th className="py-3 px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-semibold text-slate-900">{item.item_name}</div>
                          {item.description && (
                            <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                              {item.description}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          {item.serial_number ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono bg-slate-100 text-slate-700 border border-slate-200">
                              {item.serial_number}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400 italic">—</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-xs text-slate-500">
                          {new Date(item.created_at).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-xs text-slate-400 hover:text-rose-600 transition-colors font-medium px-2 py-1 rounded hover:bg-rose-50"
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
