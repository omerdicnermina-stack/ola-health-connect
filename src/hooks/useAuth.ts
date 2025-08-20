import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { User as SupabaseUser } from '@supabase/supabase-js'

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

// Mock users for when Supabase is not configured
const mockUsers: (UserProfile & { password: string })[] = [
  {
    id: '1',
    email: 'superadmin@olahealth.com',
    name: 'John Smith',
    role: 'Super Admin' as UserRole,
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    password: 'password'
  },
  {
    id: '2',
    email: 'admin@olahealth.com',
    name: 'Jane Doe',
    role: 'Admin' as UserRole,
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    password: 'password'
  },
  {
    id: '3',
    email: 'provideradmin@olahealth.com',
    name: 'Dr. Michael Brown',
    role: 'Provider-Admin' as UserRole,
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    password: 'password'
  },
  {
    id: '4',
    email: 'provider@olahealth.com',
    name: 'Dr. Sarah Johnson',
    role: 'Provider' as UserRole,
    is_active: true,
    practice_states: ['CA', 'NY'],
    specialty: 'Family Medicine',
    services: ['Consultation', 'Prescription'],
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    password: 'password'
  },
  {
    id: '5',
    email: 'manager@olahealth.com',
    name: 'Robert Wilson',
    role: 'Manager' as UserRole,
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    password: 'password'
  },
  {
    id: '6',
    email: 'hr@olahealth.com',
    name: 'Mary Wilson',
    role: 'HR Manager' as UserRole,
    organization: 'Hilton Hotel',
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    password: 'password'
  }
]

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  console.log('useAuth: Hook called, current state:', { user: !!user, loading })

  useEffect(() => {
    console.log('useAuth: useEffect running')
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user)
      } else {
        console.log('useAuth: No session, setting loading=false')
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('useAuth: Auth state change:', event)
      if (session?.user) {
        await fetchUserProfile(session.user)
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', supabaseUser.id)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        setLoading(false)
        return
      }

      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email!,
        profile: {
          ...profile,
          role: profile.role as UserRole
        }
      })
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    console.log('signIn: Starting with loading=true')
    setLoading(true)
    
    // Check if it's a demo account first
    const mockUser = mockUsers.find(u => u.email === email && u.password === password)
    console.log('signIn: Found mock user:', !!mockUser)
    
    if (mockUser) {
      const authUser = {
        id: mockUser.id,
        email: mockUser.email,
        profile: mockUser
      }
      console.log('signIn: Setting user state to:', authUser)
      
      // Set user state directly
      setUser(authUser)
      setLoading(false)
      
      console.log('signIn: Mock user sign-in complete')
      return { data: { user: { id: mockUser.id, email: mockUser.email } }, error: null }
    }

    // Otherwise try Supabase authentication
    try {
      console.log('signIn: Trying Supabase authentication')
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        console.log('signIn: Supabase error, setting loading=false')
        setLoading(false)
      }
      
      return { data, error }
    } catch (error) {
      console.log('signIn: Supabase exception, setting loading=false')
      setLoading(false)
      return { data: null, error }
    }
  }

  const signUp = async (email: string, password: string, userData: Partial<UserProfile>) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })

    if (data.user && !error) {
      // Create user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: data.user.id,
          email,
          name: userData.name || '',
          role: userData.role || 'Provider',
          is_active: userData.is_active ?? true,
          organization: userData.organization,
          avatar: userData.avatar,
          practice_states: userData.practice_states,
          specialty: userData.specialty,
          services: userData.services
        })

      if (profileError) {
        console.error('Error creating profile:', profileError)
      }
    }

    return { data, error }
  }

  const signOut = async () => {
    // Clear the user state first (works for both demo and real users)
    setUser(null)
    
    // Try to sign out from Supabase (will silently fail for demo users, which is fine)
    try {
      await supabase.auth.signOut()
    } catch (error) {
      // Ignore errors for demo accounts
    }
    
    return { error: null }
  }

  const hasPermission = (permission: string): boolean => {
    if (!user?.profile) return false

    const rolePermissions: Record<string, string[]> = {
      'Super Admin': ['all'],
      'Admin': ['manage_users', 'view_statistics', 'manage_services', 'manage_plans', 'view_prescriptions', 'virtual_queue'],
      'Provider-Admin': ['manage_users', 'view_statistics', 'manage_services', 'manage_plans', 'view_prescriptions', 'edit_prescriptions', 'view_patients', 'virtual_queue'],
      'Provider': ['view_patients', 'edit_prescriptions', 'virtual_queue'],
      'Manager': ['basic_access'],
      'HR Manager': ['manage_employees', 'assign_plans', 'utilization_report', 'census_upload', 'manage_organization_patients']
    }

    const userPermissions = rolePermissions[user.profile.role] || []
    return userPermissions.includes('all') || userPermissions.includes(permission)
  }

  const canDeleteUser = (targetRole: string): boolean => {
    if (!user?.profile) return false
    
    // Super Admin can delete anyone including other super admins
    if (user.profile.role === 'Super Admin') return true
    
    // Admin can delete everyone except Admins and Super Admins
    if (user.profile.role === 'Admin') {
      return !['Admin', 'Super Admin'].includes(targetRole)
    }
    
    return false
  }

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    hasPermission,
    canDeleteUser,
    isAuthenticated: !!user
  }
}