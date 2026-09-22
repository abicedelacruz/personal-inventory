import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { addItem, deleteItem } from './actions'

export default async function PersonalPropertyInventory() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {}
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('department')
    .eq('id', user.id)
    .single()

  const { data: items } = await supabase
    .from('inventory')
    .select('id, item_name, description, quantity, created_at')
    .order('created_at', { ascending: true })

  const currentDate = new Date().toLocaleDateString()

  return (
    <main className="max-w-3xl mx-auto p-8 bg-white shadow-md my-8 rounded-lg border text-gray-800 font-sans">
      <h1 className="text-2xl font-bold text-center mb-8 uppercase tracking-wide">
        Personal Property Inventory List
      </h1>

      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
        <div>
          <p><span className="font-semibold">Name:</span> {user.email}</p>
          <p className="mt-2"><span className="font-semibold">Department:</span> {profile?.department || 'N/A'}</p>
        </div>
        <div className="text-right">
          <p><span className="font-semibold">Date:</span> {currentDate}</p>
        </div>
      </div>

      <div className="border border-gray-400 rounded overflow-hidden mb-8">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-400 text-gray-900">
              <th className="p-3 border-r border-gray-400 font-bold">Item Name</th>
              <th className="p-3 border-r border-gray-400 font-bold">Description</th>
              <th className="p-3 border-r border-gray-400 text-center font-bold">Quantity</th>
              <th className="p-3 text-center font-bold">Action</th>
            </tr>
          </thead>
          <tbody>
            {items && items.length > 0 ? (
              items.map((item) => (
                <tr key={item.id} className="border-b border-gray-300">
                  <td className="p-3 border-r border-gray-300 font-medium">{item.item_name}</td>
                  <td className="p-3 border-r border-gray-300 text-gray-600">{item.description || '-'}</td>
                  <td className="p-3 border-r border-gray-300 text-center">{item.quantity}</td>
                  <td className="p-3 text-center">
                    <form action={deleteItem}>
                      <input type="hidden" name="id" value={item.id} />
                      <button type="submit" className="text-red-500 hover:underline text-xs font-semibold">
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-400 italic">
                  No property items logged yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <section className="bg-gray-50 p-4 border border-gray-200 rounded-md">
        <h2 className="text-sm font-bold uppercase text-gray-700 mb-3">Add New Property Item</h2>
        <form action={addItem} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input type="text" name="item_name" placeholder="Item Name (e.g., Desktop)" required className="p-2 border rounded text-sm md:col-span-1" />
          <input type="text" name="description" placeholder="Description (e.g., Black)" className="p-2 border rounded text-sm md:col-span-2" />
          <input type="number" name="quantity" defaultValue={1} min={1} required className="p-2 border rounded text-sm md:col-span-1" />
          <button type="submit" className="md:col-span-4 bg-black text-white py-2 rounded text-sm font-semibold hover:bg-gray-800 transition">
            + Add Item to Inventory
          </button>
        </form>
      </section>
    </main>
  )
}
