import { createClient } from '@supabase/supabase-js'

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
}

// Validate URL format
try {
  new URL(supabaseUrl)
} catch (error) {
  throw new Error(`Invalid NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl}`)
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface UserProfile {
  id: string
  email: string
  full_name: string
  phone: string
  location: string
  organization?: string
  role: 'victim' | 'volunteer' | 'ngo' | 'government'
  verification_status: 'pending' | 'verified' | 'rejected'
  created_at: string
  updated_at: string
  last_active: string
  emergency_contact?: string
  skills?: string[]
  certifications?: string[]
  availability_status: 'available' | 'busy' | 'offline'
}

export interface EmergencyAlert {
  id: string
  title: string
  description: string
  alert_type: 'earthquake' | 'flood' | 'wildfire' | 'hurricane' | 'tornado' | 'heatwave'
  severity: 'low' | 'moderate' | 'high' | 'extreme'
  location: string
  coordinates: {
    lat: number
    lng: number
  }
  radius_km: number
  status: 'active' | 'monitoring' | 'resolved'
  created_by: string
  created_at: string
  updated_at: string
  affected_population?: number
  instructions: string[]
}

export interface ResourceRequest {
  id: string
  requester_id: string
  resource_type: 'food' | 'water' | 'shelter' | 'medical' | 'transport' | 'clothing' | 'other'
  description: string
  quantity_needed: number
  urgency: 'low' | 'medium' | 'high' | 'critical'
  location: string
  coordinates: {
    lat: number
    lng: number
  }
  status: 'open' | 'in_progress' | 'fulfilled' | 'cancelled'
  created_at: string
  updated_at: string
  fulfilled_by?: string
  notes?: string
}

// Auth helper functions
export const signUp = async (email: string, password: string, userData: Partial<UserProfile>) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  })
  
  if (error) throw error
  return data
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) throw error
  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
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
}

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const createUserProfile = async (profile: Omit<UserProfile, 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert([profile])
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Role-based access control
export const hasPermission = (userRole: UserProfile['role'], requiredRole: UserProfile['role'][]): boolean => {
  return requiredRole.includes(userRole)
}

export const isGovernmentUser = (userRole: UserProfile['role']): boolean => {
  return userRole === 'government'
}

export const isNGOUser = (userRole: UserProfile['role']): boolean => {
  return userRole === 'ngo'
}

export const canManageAlerts = (userRole: UserProfile['role']): boolean => {
  return ['government', 'ngo'].includes(userRole)
}

export const canViewAnalytics = (userRole: UserProfile['role']): boolean => {
  return ['government', 'ngo'].includes(userRole)
}
