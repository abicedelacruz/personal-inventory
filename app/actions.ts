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
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Handled in Middleware
          }
        },
      },
    }
  )
}

export async function addInventoryItem(formData: FormData) {
  const supabase = await getSupabase()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const item_name = formData.get('item_name') as string
  const description = formData.get('description') as string
  const serial_number = formData.get('serial_number') as string

  const { error } = await supabase.from('inventory').insert([
    {
      user_id: user.id,
      item_name,
      description,
      serial_number,
    },
  ])

  if (error) {
    console.error('Insert Error:', error)
    throw new Error(error.message)
  }

  revalidatePath('/')
}
