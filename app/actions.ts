'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getSupabase() {
  const cookieStore = await cookies()
  return createServerClient(
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
}

export async function addItem(formData: FormData) {
  const supabase = await getSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const item_name = formData.get('item_name') as string
  const description = formData.get('description') as string
  const quantity = parseInt(formData.get('quantity') as string) || 1

  if (!item_name) return

  await supabase.from('inventory').insert({
    item_name,
    description,
    quantity,
    assigned_user_id: user.id,
  })

  revalidatePath('/')
}

export async function deleteItem(formData: FormData) {
  const supabase = await getSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const id = formData.get('id') as string
  await supabase.from('inventory').delete().eq('id', id).eq('assigned_user_id', user.id)

  revalidatePath('/')
}
