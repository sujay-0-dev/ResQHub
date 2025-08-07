'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { supabase, getUserProfile, createUserProfile, isDemoMode } from '../lib/supabase-client'

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isDemo, setIsDemo] = useState(false)

  useEffect(() => {
    // Check if we're in demo mode
    setIsDemo(isDemoMode())

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
        
        if (session?.user) {
          const userProfile = await getUserProfile(session.user.id)
          setProfile(userProfile)
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          const userProfile = await getUserProfile(session.user.id)
          setProfile(userProfile)
        } else {
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email, password, userData) => {
    setLoading(true)
    try {
      if (isDemo) {
        // In demo mode, simulate successful signup
        console.log('Demo mode: Simulating signup for', email)
        const mockUser = {
          id: `demo-${Date.now()}`,
          email,
          created_at: new Date().toISOString()
        }
        const mockProfile = {
          id: mockUser.id,
          email,
          full_name: userData.full_name,
          role: userData.role,
          phone: userData.phone,
          location: userData.location,
          organization: userData.organization,
          verification_status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_active: new Date().toISOString(),
          availability_status: 'available'
        }
        
        setUser(mockUser)
        setProfile(mockProfile)
        return { user: mockUser, session: null }
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.full_name,
            role: userData.role,
            phone: userData.phone,
            location: userData.location,
            organization: userData.organization
          }
        }
      })

      if (error) throw error

      // The user profile will be created automatically by the database trigger
      if (data.user) {
        // Wait a moment for the trigger to complete
        setTimeout(async () => {
          const userProfile = await getUserProfile(data.user.id)
          if (userProfile) {
            // Update with additional data
            const updatedProfile = await supabase
              .from('user_profiles')
              .update({
                phone: userData.phone,
                location: userData.location,
                organization: userData.organization
              })
              .eq('id', data.user.id)
              .select()
              .single()
            
            if (updatedProfile.data) {
              setProfile(updatedProfile.data)
            }
          }
        }, 1000)
      }

      return data
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email, password) => {
    setLoading(true)
    try {
      if (isDemo) {
        // In demo mode, simulate successful signin
        console.log('Demo mode: Simulating signin for', email)
        const mockUser = {
          id: `demo-${Date.now()}`,
          email,
          created_at: new Date().toISOString()
        }
        const mockProfile = {
          id: mockUser.id,
          email,
          full_name: 'Demo User',
          role: 'volunteer',
          phone: '+1 (555) 123-4567',
          location: 'Demo City, Demo State',
          organization: 'Demo Organization',
          verification_status: 'verified',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_active: new Date().toISOString(),
          availability_status: 'available'
        }
        
        setUser(mockUser)
        setProfile(mockProfile)
        return { user: mockUser, session: { access_token: 'demo-token' } }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      if (data.user) {
        const userProfile = await getUserProfile(data.user.id)
        setProfile(userProfile)
        
        // Update last active timestamp
        if (userProfile) {
          await supabase
            .from('user_profiles')
            .update({ last_active: new Date().toISOString() })
            .eq('id', data.user.id)
        }
      }

      return data
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      if (isDemo) {
        console.log('Demo mode: Simulating signout')
        setUser(null)
        setProfile(null)
        return
      }

      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      setUser(null)
      setProfile(null)
    } catch (error) {
      console.error('Sign out error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates) => {
    if (!user || !profile) throw new Error('No user logged in')
    
    try {
      if (isDemo) {
        console.log('Demo mode: Simulating profile update', updates)
        const updatedProfile = { ...profile, ...updates, updated_at: new Date().toISOString() }
        setProfile(updatedProfile)
        return updatedProfile
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error
      
      setProfile(data)
      return data
    } catch (error) {
      console.error('Update profile error:', error)
      throw error
    }
  }

  const refreshProfile = async () => {
    if (!user) return
    
    try {
      if (isDemo) {
        console.log('Demo mode: Profile refresh (no-op)')
        return
      }

      const userProfile = await getUserProfile(user.id)
      setProfile(userProfile)
    } catch (error) {
      console.error('Refresh profile error:', error)
    }
  }

  const value = {
    user,
    profile,
    loading,
    isDemo,
    signUp,
    signIn,
    signOut,
    updateProfile,
    refreshProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
