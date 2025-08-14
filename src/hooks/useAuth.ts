import { useState, useEffect } from 'react'
import { supabase, type UserProfile, type AuthUser } from '@/lib/supabase'
import { User as SupabaseUser } from '@supabase/supabase-js'

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
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
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
    const { error } = await supabase.auth.signOut()
    return { error }
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