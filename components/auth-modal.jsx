'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, Users, Building, Heart, Loader2, CheckCircle, AlertTriangle } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

export function AuthModal({ isOpen, onClose, mode }) {
  const { signUp, signIn, loading } = useAuth()
  const [userType, setUserType] = useState('victim')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    organization: '',
    phone: '',
    location: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validation
    if (mode === 'signup') {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        return
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters')
        return
      }
      if (!formData.full_name.trim()) {
        setError('Full name is required')
        return
      }
      if (!formData.phone.trim()) {
        setError('Phone number is required')
        return
      }
      if (!formData.location.trim()) {
        setError('Location is required')
        return
      }
      if ((userType === 'ngo' || userType === 'government') && !formData.organization.trim()) {
        setError('Organization name is required for NGO and Government users')
        return
      }
    }

    try {
      if (mode === 'signup') {
        await signUp(formData.email, formData.password, {
          full_name: formData.full_name,
          phone: formData.phone,
          location: formData.location,
          organization: formData.organization || undefined,
          role: userType,
          verification_status: 'pending'
        })
        setSuccess('Account created successfully! Please check your email to verify your account.')
        
        // Reset form
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          full_name: '',
          organization: '',
          phone: '',
          location: ''
        })
        
        // Close modal after 3 seconds
        setTimeout(() => {
          onClose()
        }, 3000)
      } else {
        await signIn(formData.email, formData.password)
        setSuccess('Signed in successfully!')
        onClose()
      }
    } catch (err) {
      setError(err.message || 'An error occurred during authentication')
    }
  }

  const userTypes = [
    {
      id: 'victim',
      title: 'Emergency Victim',
      description: 'Need immediate assistance or resources',
      icon: Heart,
      color: 'bg-red-100 text-red-700 border-red-200'
    },
    {
      id: 'volunteer',
      title: 'Volunteer',
      description: 'Want to help during emergencies',
      icon: Users,
      color: 'bg-blue-100 text-blue-700 border-blue-200'
    },
    {
      id: 'ngo',
      title: 'NGO/Relief Organization',
      description: 'Coordinate relief efforts and resources',
      icon: Building,
      color: 'bg-green-100 text-green-700 border-green-200'
    },
    {
      id: 'government',
      title: 'Government Agency',
      description: 'Official emergency response coordination',
      icon: Shield,
      color: 'bg-purple-100 text-purple-700 border-purple-200'
    }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {mode === 'signin' ? 'Sign In to ResQHub 2.0' : 'Join ResQHub 2.0'}
          </DialogTitle>
        </DialogHeader>

        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'signup' && (
            <div>
              <Label className="text-base font-semibold mb-4 block">Select Your Role</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {userTypes.map((type) => (
                  <Card 
                    key={type.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      userType === type.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                    }`}
                    onClick={() => setUserType(type.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${type.color}`}>
                          <type.icon className="w-4 h-4" />
                        </div>
                        <CardTitle className="text-sm">{type.title}</CardTitle>
                      </div>
                      <CardDescription className="text-xs">
                        {type.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mode === 'signup' && (
              <div>
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  required
                />
              </div>
            )}
            
            <div className={mode === 'signin' ? 'md:col-span-2' : ''}>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                minLength={6}
              />
            </div>
            
            {mode === 'signup' && (
              <div>
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  required
                  minLength={6}
                />
              </div>
            )}
          </div>

          {mode === 'signup' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="location">Location/City *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="New York, NY"
                    required
                  />
                </div>
              </div>

              {(userType === 'ngo' || userType === 'government') && (
                <div>
                  <Label htmlFor="organization">Organization Name *</Label>
                  <Input
                    id="organization"
                    value={formData.organization}
                    onChange={(e) => setFormData({...formData, organization: e.target.value})}
                    placeholder="Red Cross, FEMA, etc."
                    required
                  />
                </div>
              )}
            </>
          )}

          <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </Button>

          <div className="text-center text-sm text-gray-600">
            {mode === 'signin' ? (
              <p>Don't have an account? <button type="button" className="text-red-600 hover:underline">Sign up</button></p>
            ) : (
              <p>Already have an account? <button type="button" className="text-red-600 hover:underline">Sign in</button></p>
            )}
          </div>
        </form>

        {mode === 'signup' && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Account Verification Process</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Email verification required for all accounts</li>
              <li>• NGO and Government accounts require manual verification</li>
              <li>• Verification typically takes 24-48 hours</li>
              <li>• Full platform access granted after verification</li>
            </ul>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
