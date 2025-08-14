import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type UserRole = 'Admin' | 'Super Admin' | 'Provider' | 'Provider-Admin' | 'Manager' | 'HR Manager'

export interface UserProfile {
  id: string
  email: string
  name: string
  role: UserRole
  organization?: string
  avatar?: string
  is_active: boolean
  practice_states?: string[]
  specialty?: string
  services?: string[]
  created_at: string
  updated_at: string
}

export interface AuthUser {
  id: string
  email: string
  profile: UserProfile
}