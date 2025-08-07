'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, MapPin, Users, Shield, Zap, Globe, Phone, QrCode } from 'lucide-react'
import Link from 'next/link'
import { AuthModal } from '@/components/auth-modal'
import { useAuth } from '@/hooks/use-auth'
import { SetupNotice } from '@/components/setup-notice'

export default function HomePage() {
  const { user, profile, signOut } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState('signin')

  const handleAuth = (mode) => {
    setAuthMode(mode)
    setShowAuthModal(true)
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  // If user is authenticated, redirect to dashboard
  useEffect(() => {
    if (user && profile) {
      window.location.href = '/dashboard'
    }
  }, [user, profile])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
      <SetupNotice />
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ResQHub 2.0</h1>
              <p className="text-xs text-gray-600">Emergency Response Platform</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <div className="flex items-center space-x-2">
                  <Badge className={`${
                    profile?.verification_status === 'verified' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {profile?.verification_status === 'verified' ? '✓ Verified' : '⏳ Pending'}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    Welcome, {profile?.full_name}
                  </span>
                </div>
                <Button variant="outline" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => handleAuth('signin')}>
                  Sign In
                </Button>
                <Button onClick={() => handleAuth('signup')} className="bg-red-600 hover:bg-red-700">
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 bg-red-100 text-red-800 border-red-200">
            🚨 Real-Time Emergency Response System
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Coordinating Chaos
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
              Into Action
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            ResQHub 2.0 connects victims, volunteers, NGOs, and government bodies in real-time during emergencies. 
            AI-powered prioritization, offline capabilities, and verified resource coordination save lives when every second counts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" onClick={() => handleAuth('signup')} className="bg-red-600 hover:bg-red-700 text-lg px-8 py-4">
              Join Emergency Network
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4">
              View Live Map
            </Button>
          </div>
          
          {/* Live Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">24/7</div>
              <div className="text-sm text-gray-600">Active Monitoring</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">15,000+</div>
              <div className="text-sm text-gray-600">Verified Volunteers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">500+</div>
              <div className="text-sm text-gray-600">Partner NGOs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">50+</div>
              <div className="text-sm text-gray-600">Government Bodies</div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Government Bodies & NGOs Choose ResQHub 2.0
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built for real-world emergency response with enterprise-grade reliability and government compliance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-red-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle>AI-Driven Priority System</CardTitle>
                <CardDescription>
                  Machine learning algorithms automatically prioritize emergency requests based on severity, location, and available resources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Real-time severity assessment</li>
                  <li>• Resource optimization</li>
                  <li>• Predictive response planning</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Precision Location Services</CardTitle>
                <CardDescription>
                  100% accurate location tracking with offline capabilities for areas with poor connectivity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• GPS + Network triangulation</li>
                  <li>• Offline location caching</li>
                  <li>• GeoFencing alerts</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Multi-Stakeholder Coordination</CardTitle>
                <CardDescription>
                  Unified platform connecting government agencies, NGOs, volunteers, and affected communities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Role-based access control</li>
                  <li>• Inter-agency communication</li>
                  <li>• Resource sharing protocols</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-purple-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Phone className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Automated Alert System</CardTitle>
                <CardDescription>
                  SMS, email, and push notifications with intelligent routing to relevant stakeholders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Multi-channel notifications</li>
                  <li>• Escalation protocols</li>
                  <li>• Delivery confirmation</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-orange-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Offline-First PWA</CardTitle>
                <CardDescription>
                  Critical functionality works without internet connection using advanced caching and sync
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Service worker technology</li>
                  <li>• Local data storage</li>
                  <li>• Automatic sync when online</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-indigo-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <QrCode className="w-6 h-6 text-indigo-600" />
                </div>
                <CardTitle>QR Identity System</CardTitle>
                <CardDescription>
                  Unique QR codes for displaced individuals to track aid distribution and medical needs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Digital identity management</li>
                  <li>• Aid tracking & distribution</li>
                  <li>• Medical history access</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Government Benefits Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Government & NGO Benefits
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Designed to meet the specific needs of government agencies and non-profit organizations
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-blue-900 mb-6">For Government Bodies</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Centralized Command & Control</h4>
                    <p className="text-gray-600">Single dashboard for monitoring all emergency activities across jurisdictions</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Compliance & Reporting</h4>
                    <p className="text-gray-600">Automated reports for disaster response accountability and funding justification</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Resource Optimization</h4>
                    <p className="text-gray-600">AI-driven allocation of personnel, equipment, and supplies for maximum impact</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Inter-Agency Coordination</h4>
                    <p className="text-gray-600">Seamless communication between federal, state, and local agencies</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-green-900 mb-6">For NGOs & Relief Organizations</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Verified Volunteer Network</h4>
                    <p className="text-gray-600">Access to pre-screened, trained volunteers with skill-based matching</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Donation Transparency</h4>
                    <p className="text-gray-600">Real-time tracking of aid distribution with donor reporting capabilities</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Collaborative Operations</h4>
                    <p className="text-gray-600">Coordinate with other NGOs to avoid duplication and maximize coverage</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Impact Measurement</h4>
                    <p className="text-gray-600">Data-driven insights on program effectiveness and community impact</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-red-600 to-orange-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Emergency Response?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of organizations already using ResQHub 2.0 to save lives and coordinate disaster response effectively.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={() => handleAuth('signup')} className="text-lg px-8 py-4">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-red-600">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">ResQHub 2.0</span>
              </div>
              <p className="text-gray-400 text-sm">
                Coordinating chaos into action during emergencies worldwide.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Emergency Map</li>
                <li>Resource Finder</li>
                <li>Volunteer Network</li>
                <li>Alert System</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Organizations</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Government Solutions</li>
                <li>NGO Partnership</li>
                <li>API Access</li>
                <li>Custom Integration</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>24/7 Emergency Line</li>
                <li>Documentation</li>
                <li>Training Programs</li>
                <li>Community Forum</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 ResQHub 2.0. Built to save lives. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        mode={authMode}
      />
    </div>
  )
}
