import { auth, currentUser } from '@clerk/nextjs/server'
import { createAdminClient } from './supabase/admin'
import type { PortalUser } from './types'

export async function getPortalUser(): Promise<PortalUser | null> {
  const { userId } = await auth()
  if (!userId) return null

  const supabase = createAdminClient()

  const { data: existing } = await supabase
    .from('users')
    .select('*')
    .eq('clerk_user_id', userId)
    .single()

  if (existing) return existing as PortalUser

  // First access after sign-up — create the record if webhook was delayed
  const clerkUser = await currentUser()
  if (!clerkUser) return null

  const email = clerkUser.emailAddresses[0]?.emailAddress ?? ''
  const full_name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || null

  const { data: created } = await supabase
    .from('users')
    .upsert({ clerk_user_id: userId, email, full_name, role: 'client', status: 'active' }, { onConflict: 'clerk_user_id' })
    .select()
    .single()

  return created as PortalUser | null
}
