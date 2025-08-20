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
    password: '123456Aa'
  },
  {
    id: '2',
    email: 'admin@olahealth.com',
    name: 'Jane Doe',
    role: 'Admin' as UserRole,
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    password: '123456Aa'
  },
  {
    id: '3',
    email: 'provideradmin@olahealth.com',
    name: 'Dr. Michael Brown',
    role: 'Provider-Admin' as UserRole,
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    password: '123456Aa'
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
    password: '123456Aa'
  },
  {
    id: '5',
    email: 'manager@olahealth.com',
    name: 'Robert Wilson',
    role: 'Manager' as UserRole,
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    password: '123456Aa'
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
    password: '123456Aa'
  }
]

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  console.log('useAuth: Hook called, current state:', { user: !!user, loading })

  useEffect(() => {
    console.log('useAuth: useEffect running - initializing auth')
    
    // Check for stored session first
    const storedUser = localStorage.getItem('user_session')
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        console.log('useAuth: Found stored user session:', userData.email)
        setUser(userData)
        setLoading(false)
        return
      } catch (error) {
        console.error('Error parsing stored user:', error)
        localStorage.removeItem('user_session')
      }
    }
    
    // No stored session found
    console.log('useAuth: No stored session, checking Supabase')
    
    // Set up Supabase auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('useAuth: Supabase auth state change:', event, 'session:', !!session)
      
      if (session?.user) {
        console.log('useAuth: Supabase session found, fetching profile')
        await fetchUserProfile(session.user)
      } else {
        console.log('useAuth: No Supabase session')
        setUser(null)
        setLoading(false)
      }
    })

    // Check for existing Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('useAuth: Initial Supabase session check:', !!session)
      if (session?.user) {
        fetchUserProfile(session.user)
      } else {
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
    console.log('signIn: Starting sign-in for:', email)
    setLoading(true)
    
    try {
      // Check for demo/mock users first
      const mockUser = mockUsers.find(u => u.email === email && u.password === password)
      
      if (mockUser) {
        console.log('signIn: Demo user found, signing in')
        const authUser = {
          id: mockUser.id,
          email: mockUser.email,
          profile: mockUser
        }
        
        // Store in localStorage and set state
        localStorage.setItem('user_session', JSON.stringify(authUser))
        setUser(authUser)
        setLoading(false)
        
        console.log('signIn: Demo user sign-in successful')
        return { data: { user: { id: mockUser.id, email: mockUser.email } }, error: null }
      }
      
      // Try Supabase authentication for real users
      console.log('signIn: Trying Supabase authentication')
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        console.log('signIn: Supabase error:', error.message)
        setLoading(false)
        return { data, error }
      }
      
      console.log('signIn: Supabase sign-in successful')
      return { data, error }
      
    } catch (error) {
      console.error('signIn: Unexpected error:', error)
      setLoading(false)
      return { data: null, error: error as any }
    }
  }

  const signUp = async (email: string, password: string, userData: Partial<UserProfile>) => {
    setLoading(true)
    
    try {
      const redirectUrl = `${window.location.origin}/`
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: userData.name,
            role: userData.role
          }
        }
      })

      if (error) {
        console.error('SignUp error:', error)
        setLoading(false)
        return { data, error }
      }

      // Don't try to create profile manually since trigger handles it
      setLoading(false)
      return { data, error }
    } catch (error) {
      console.error('SignUp exception:', error)
      setLoading(false)
      return { data: null, error }
    }
  }

  const signOut = async () => {
    console.log('signOut: Starting sign out process')
    
    try {
      // Clear user state
      setUser(null)
      
      // Clear stored session
      localStorage.removeItem('user_session')
      
      // Sign out from Supabase (for real users)
      await supabase.auth.signOut()
      
      console.log('signOut: Sign out complete')
      
      // Reload page to ensure clean state
      window.location.reload()
      
      return { error: null }
    } catch (error) {
      console.error('signOut: Error during sign out:', error)
      // Even if there's an error, clear local state and reload
      setUser(null)
      localStorage.removeItem('user_session')
      window.location.reload()
      return { error: null }
    }
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