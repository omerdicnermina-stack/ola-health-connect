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
  const [mounted, setMounted] = useState(false)

  console.log('useAuth: Current state - User:', !!user, 'Loading:', loading, 'Mounted:', mounted)

  useEffect(() => {
    console.log('useAuth: Checking for existing session...')
    
    // Simple check for stored user
    const storedUser = localStorage.getItem('user_session')
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        console.log('useAuth: Found user:', userData.email)
        setUser(userData)
      } catch (error) {
        console.error('useAuth: Error parsing user:', error)
        localStorage.removeItem('user_session')
      }
    } else {
      console.log('useAuth: No stored user found')
    }
    
    setLoading(false)
    setMounted(true)
    console.log('useAuth: Initialization complete')
  }, [])

  // Force re-render after user state changes
  useEffect(() => {
    if (mounted && user) {
      console.log('useAuth: User state changed, forcing re-render for:', user.email)
      // Small delay to ensure state propagation
      setTimeout(() => {
        console.log('useAuth: Re-render complete for user:', user.email)
      }, 50)
    }
  }, [user, mounted])

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
    console.log('signIn: Attempting sign-in for:', email)
    
    // Find demo user
    const mockUser = mockUsers.find(u => u.email === email && u.password === password)
    
    if (mockUser) {
      console.log('signIn: Demo user found:', mockUser.role)
      
      const authUser = {
        id: mockUser.id,
        email: mockUser.email,
        profile: mockUser
      }
      
      // Store and set user
      localStorage.setItem('user_session', JSON.stringify(authUser))
      console.log('signIn: Setting user state...')
      setUser(authUser)
      
      // Force a slight delay to ensure state propagation
      setTimeout(() => {
        console.log('signIn: User state should be updated now')
        // Trigger a state update to force re-render
        setUser(prev => ({ ...prev! }))
      }, 10)
      
      console.log('signIn: User authenticated successfully:', authUser.email, 'Role:', authUser.profile.role)
      return { data: { user: authUser }, error: null }
    }
    
    console.log('signIn: No demo user found with those credentials')
    return { data: null, error: { message: 'Invalid credentials' } }
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
    console.log('signOut: Current user before logout:', user?.email)
    
    // Clear localStorage first
    localStorage.removeItem('user_session')
    console.log('signOut: Cleared localStorage')
    
    // Clear user state
    setUser(null)
    console.log('signOut: Cleared user state')
    
    // Force a small delay to ensure state update, then reload
    setTimeout(() => {
      console.log('signOut: Reloading page for clean state')
      window.location.reload()
    }, 100)
    
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