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
    if (!confirm('Are you sure you want to remove this property entry?')) return
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
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="flex items-center space-x-3 text-zinc-400 font-mono text-xs">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>LOADING_PROFILE...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans antialiased selection:bg-white selection:text-black">
      {/* Navbar */}
      <header className="sticky top-0 z-20 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-white flex items-center justify-center font-bold text-black text-xs tracking-wider">
              IP
            </div>
            <div>
              <h1 className="text-xs font-bold uppercase tracking-widest text-white font-mono">
                AssetLedger
              </h1>
              <p className="text-[10px] text-zinc-500 font-mono hidden sm:block">
                PROPERTY LEDGER SYSTEM
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <span className="block text-[9px] font-mono font-semibold text-zinc-500 uppercase tracking-wider">Session</span>
              <span className="block text-xs font-mono text-zinc-300">{user?.email}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="text-xs font-mono px-3 py-1.5 border border-zinc-800 rounded bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all uppercase tracking-wider"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Metric Overview Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-zinc-950 p-5 rounded-lg border border-zinc-800 relative">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Total Registered Items</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl font-mono font-bold text-white">{items.length}</span>
              <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-2.5 py-1 rounded border border-zinc-800">
                STATUS // ACTIVE
              </span>
            </div>
          </div>

          <div className="bg-zinc-950 p-5 rounded-lg border border-zinc-800">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Owner Account</span>
            <div className="mt-2 truncate">
              <span className="text-xs font-mono text-zinc-200">{user?.email}</span>
            </div>
          </div>

          <div className="bg-zinc-950 p-5 rounded-lg border border-zinc-800">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Database Sync</span>
            <div className="mt-2 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              <span className="text-xs font-mono text-zinc-200">CONNECTED TO SUPABASE</span>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Add Item Form */}
          <div className="lg:col-span-4 bg-zinc-950 rounded-lg border border-zinc-800 p-6">
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
              <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Register Property
              </h2>
            </div>
            <p className="text-xs text-zinc-500 mb-6">
              Record hardware or asset details into your personal database.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                  Item Name <span className="text-white">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-black border border-zinc-800 rounded text-white focus:outline-none focus:border-white transition-all font-mono placeholder:text-zinc-700"
                  placeholder="e.g. MacBook Pro 16"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                  Serial Number / Asset Tag
                </label>
                <input
                  type="text"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-black border border-zinc-800 rounded text-zinc-200 font-mono focus:outline-none focus:border-white transition-all placeholder:text-zinc-700"
                  placeholder="e.g. C02G1024MD6M"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                  Description / Condition
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-black border border-zinc-800 rounded text-white focus:outline-none focus:border-white transition-all font-mono placeholder:text-zinc-700 resize-none"
                  placeholder="e.g. M1 Max, 32GB RAM. Slight mark on cover."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-white hover:bg-zinc-200 text-black font-semibold py-3 rounded text-xs uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center space-x-2 mt-2 font-mono"
              >
                {submitting ? (
                  <span>Saving...</span>
                ) : (
                  <span>Add to Ledger</span>
                )}
              </button>
            </form>
          </div>

          {/* Table Section */}
          <div className="lg:col-span-8 bg-zinc-950 rounded-lg border border-zinc-800 overflow-hidden">
            <div className="p-6 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Personal Property List
                </h2>
                <p className="text-xs text-zinc-500">
                  Live inventory entries bound to your account.
                </p>
              </div>

              {/* Filter box */}
              <div className="w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search item or serial..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-black border border-zinc-800 rounded text-zinc-200 focus:outline-none focus:border-white font-mono placeholder:text-zinc-700"
                />
              </div>
            </div>

            {filteredItems.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-zinc-600 font-mono text-sm mb-2">
                  [NO_ENTRIES_FOUND]
                </div>
                <p className="text-xs text-zinc-500">
                  {searchTerm ? 'No results matched your filter query.' : 'Use the form on the left to add your first property item.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black border-b border-zinc-800 text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                      <th className="py-3.5 px-6">Item / Details</th>
                      <th className="py-3.5 px-6">Serial / Tag</th>
                      <th className="py-3.5 px-6">Date Added</th>
                      <th className="py-3.5 px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 text-xs font-mono">
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="hover:bg-zinc-900/50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-semibold text-zinc-100">{item.item_name}</div>
                          {item.description && (
                            <div className="text-zinc-500 text-[11px] mt-0.5 line-clamp-1">
                              {item.description}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          {item.serial_number ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-black text-zinc-300 border border-zinc-800">
                              {item.serial_number}
                            </span>
                          ) : (
                            <span className="text-zinc-700 italic">—</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-zinc-500 text-[11px]">
                          {new Date(item.created_at).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-[11px] text-zinc-500 hover:text-white transition-colors uppercase tracking-wider"
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
