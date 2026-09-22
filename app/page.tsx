'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [items, setItems] = useState<any[]>([])
  const [itemName, setItemName] = useState('')
  const [description, setDescription] = useState('')
  const [serialNumber, setSerialNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )

  useEffect(() => {
    async function loadData() {
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
    }
    loadData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setLoading(true)

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
      
      const { data } = await supabase
        .from('inventory')
        .select('*')
        .order('created_at', { ascending: false })
      if (data) setItems(data)
    }
    setLoading(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!user) return <div className="p-8 text-center text-gray-500">Loading profile...</div>

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm border">
        <div>
          <h1 className="text-xl font-bold">Personal Property Inventory</h1>
          <p className="text-sm text-gray-500">Logged in as: {user.email}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="text-sm text-red-600 hover:text-red-800 font-medium"
        >
          Sign Out
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
        <h2 className="text-lg font-semibold mb-4">Add Item to Inventory</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
            <input
              type="text"
              required
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="e.g. Dell XPS 15 Laptop"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description / Condition</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="e.g. Good condition, minor scratches"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number / Asset Tag</label>
            <input
              type="text"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="e.g. SN-8839201"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2.5 rounded-md font-semibold text-sm hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? 'Adding Item...' : 'Add to Inventory'}
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold mb-4">Your Property List ({items.length})</h2>
        {items.length === 0 ? (
          <p className="text-gray-500 text-sm">No items added yet.</p>
        ) : (
          <div className="divide-y">
            {items.map((item) => (
              <div key={item.id} className="py-3 flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-900">{item.item_name}</p>
                  <p className="text-sm text-gray-600">{item.description || 'No description'}</p>
                  {item.serial_number && (
                    <p className="text-xs text-gray-400 mt-0.5">S/N: {item.serial_number}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
