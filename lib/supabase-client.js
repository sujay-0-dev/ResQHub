import { createClient } from '@supabase/supabase-js'

// Development fallback configuration
const isDevelopment = process.env.NODE_ENV === 'development'

// Get environment variables with proper fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if we have valid Supabase configuration
const hasValidConfig = supabaseUrl && 
                      supabaseAnonKey && 
                      supabaseUrl !== 'your_supabase_project_url' &&
                      supabaseAnonKey !== 'your_supabase_anon_key' &&
                      supabaseUrl.startsWith('https://') &&
                      supabaseUrl.includes('.supabase.co')

// Create a mock client for development when no real Supabase is configured
const createMockSupabaseClient = () => {
  console.warn('🔧 ResQHub 2.0: Running in demo mode. Configure Supabase for full functionality.')
  
  return {
    auth: {
      signUp: async (credentials) => {
        console.log('Demo: Sign up attempted with:', credentials.email)
        return { 
          data: { 
            user: { 
              id: 'demo-user-id', 
              email: credentials.email,
              created_at: new Date().toISOString()
            },
            session: null
          }, 
          error: null 
        }
      },
      signInWithPassword: async (credentials) => {
        console.log('Demo: Sign in attempted with:', credentials.email)
        return { 
          data: { 
            user: { 
              id: 'demo-user-id', 
              email: credentials.email,
              created_at: new Date().toISOString()
            },
            session: {
              access_token: 'demo-token',
              user: { 
                id: 'demo-user-id', 
                email: credentials.email 
              }
            }
          }, 
          error: null 
        }
      },
      signOut: async () => {
        console.log('Demo: Sign out')
        return { error: null }
      },
      getUser: async () => {
        return { 
          data: { user: null }, 
          error: null 
        }
      },
      getSession: async () => {
        return { 
          data: { session: null }, 
          error: null 
        }
      },
      onAuthStateChange: (callback) => {
        console.log('Demo: Auth state change listener registered')
        // Simulate initial state
        setTimeout(() => callback('SIGNED_OUT', null), 100)
        return { 
          data: { 
            subscription: { 
              unsubscribe: () => console.log('Demo: Auth listener unsubscribed') 
            } 
          } 
        }
      }
    },
    from: (table) => ({
      select: (columns = '*') => ({
        eq: (column, value) => ({
          single: async () => {
            console.log(`Demo: SELECT ${columns} FROM ${table} WHERE ${column} = ${value}`)
            return { 
              data: null, 
              error: { message: 'Demo mode: Database not configured' } 
            }
          },
          limit: (count) => ({
            async then(resolve) {
              console.log(`Demo: SELECT ${columns} FROM ${table} LIMIT ${count}`)
              resolve({ data: [], error: null })
            }
          })
        }),
        limit: (count) => ({
          async then(resolve) {
            console.log(`Demo: SELECT ${columns} FROM ${table} LIMIT ${count}`)
            resolve({ data: [], error: null })
          }
        }),
        async then(resolve) {
          console.log(`Demo: SELECT ${columns} FROM ${table}`)
          resolve({ data: [], error: null })
        }
      }),
      insert: (data) => ({
        select: (columns = '*') => ({
          single: async () => {
            console.log(`Demo: INSERT INTO ${table}`, data)
            return { 
              data: { id: 'demo-id', ...data }, 
              error: null 
            }
          }
        })
      }),
      update: (data) => ({
        eq: (column, value) => ({
          select: (columns = '*') => ({
            single: async () => {
              console.log(`Demo: UPDATE ${table} SET`, data, `WHERE ${column} = ${value}`)
              return { 
                data: { id: value, ...data }, 
                error: null 
              }
            }
          })
        })
      })
    })
  }
}

// Export the appropriate client
export const supabase = (() => {
  // If we don't have valid config, use mock client
  if (!hasValidConfig) {
    return createMockSupabaseClient()
  }

  // Create real Supabase client
  try {
    return createClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.error('Failed to create Supabase client:', error)
    return createMockSupabaseClient()
  }
})()

// Auth helper functions with improved error handling
export const signUp = async (email, password, userData) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('SignUp error:', error)
    throw new Error(error.message || 'Failed to create account')
  }
}

export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('SignIn error:', error)
    throw new Error(error.message || 'Failed to sign in')
  }
}

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (error) {
    console.error('SignOut error:', error)
    throw new Error(error.message || 'Failed to sign out')
  }
}

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  } catch (error) {
    console.error('GetCurrentUser error:', error)
    return null
  }
}

export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
    
    return data
  } catch (error) {
    console.error('GetUserProfile error:', error)
    return null
  }
}

export const updateUserProfile = async (userId, updates) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('UpdateUserProfile error:', error)
    throw new Error(error.message || 'Failed to update profile')
  }
}

export const createUserProfile = async (profile) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([profile])
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('CreateUserProfile error:', error)
    throw new Error(error.message || 'Failed to create profile')
  }
}

// Role-based access control
export const hasPermission = (userRole, requiredRole) => {
  return requiredRole.includes(userRole)
}

export const isGovernmentUser = (userRole) => {
  return userRole === 'government'
}

export const isNGOUser = (userRole) => {
  return userRole === 'ngo'
}

export const canManageAlerts = (userRole) => {
  return ['government', 'ngo'].includes(userRole)
}

export const canViewAnalytics = (userRole) => {
  return ['government', 'ngo'].includes(userRole)
}

// Helper to check if we're in demo mode
export const isDemoMode = () => !hasValidConfig

// Helper to get configuration status
export const getConfigStatus = () => ({
  hasValidConfig,
  isDemoMode: !hasValidConfig,
  supabaseUrl: hasValidConfig ? supabaseUrl : 'Not configured',
  configuredCorrectly: hasValidConfig
})
