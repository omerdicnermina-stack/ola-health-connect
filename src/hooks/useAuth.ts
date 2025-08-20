import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured, type UserProfile, type AuthUser } from '@/lib/supabase'
import { User as SupabaseUser } from '@supabase/supabase-js'

// Mock users for when Supabase is not configured
const mockUsers: (UserProfile & { password: string })[] = [
  {
    id: '1',
    email: 'superadmin@olahealth.com',
    name: 'John Smith',
    role: 'Super Admin',
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    password: 'password'
  },
  {
    id: '2',
    email: 'admin@olahealth.com',
    name: 'Jane Doe',
    role: 'Admin',
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    password: 'password'
  },
  {
    id: '3',
    email: 'provideradmin@olahealth.com',
    name: 'Dr. Michael Brown',
    role: 'Provider-Admin',
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    password: 'password'
  },
  {
    id: '4',
    email: 'provider@olahealth.com',
    name: 'Dr. Sarah Johnson',
    role: 'Provider',
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
    role: 'Manager',
    is_active: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    password: 'password'
  },
  {
    id: '6',
    email: 'hr@olahealth.com',
    name: 'Mary Wilson',
    role: 'HR Manager',
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

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
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
        .eq('id', supabaseUser.id)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        setLoading(false)
        return
      }

      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email!,
        profile
      })
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    
    // Check if it's a demo account first
    const mockUser = mockUsers.find(u => u.email === email && u.password === password)
    
    if (mockUser) {
      const authUser = {
        id: mockUser.id,
        email: mockUser.email,
        profile: mockUser
      }
      setUser(authUser)
      setLoading(false)
      return { data: { user: { id: mockUser.id, email: mockUser.email } }, error: null }
    }

    // Otherwise try Supabase authentication
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        setLoading(false)
      }
      
      return { data, error }
    } catch (error) {
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
          id: data.user.id,
          email,
          ...userData
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