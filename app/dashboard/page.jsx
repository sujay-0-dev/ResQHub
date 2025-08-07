'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertTriangle, MapPin, Users, Package, Phone, QrCode, Activity, Shield, Clock, TrendingUp } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { ProtectedRoute } from '@/components/protected-route'
import { RealTimeDashboard } from '@/components/real-time-dashboard'

function DashboardContent() {
  const { user, profile, signOut } = useAuth()

  const stats = {
    activeAlerts: 12,
    totalVolunteers: 15247,
    resourceRequests: 89,
    resolvedCases: 1456,
    ngoPartners: 342,
    governmentAgencies: 28
  }

  const recentAlerts = [
    {
      id: '1',
      type: 'wildfire',
      location: 'Los Angeles County',
      severity: 'high',
      time: '2 hours ago',
      status: 'active'
    },
    {
      id: '2',
      type: 'flood',
      location: 'Houston Metro',
      severity: 'moderate',
      time: '4 hours ago',
      status: 'monitoring'
    },
    {
      id: '3',
      type: 'earthquake',
      location: 'San Francisco Bay',
      severity: 'low',
      time: '6 hours ago',
      status: 'resolved'
    }
  ]

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'moderate': return 'bg-orange-100 text-orange-800'
      case 'low': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-red-100 text-red-800'
      case 'monitoring': return 'bg-blue-100 text-blue-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'government': return 'bg-purple-100 text-purple-800'
      case 'ngo': return 'bg-green-100 text-green-800'
      case 'volunteer': return 'bg-blue-100 text-blue-800'
      case 'victim': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ResQHub 2.0 Dashboard</h1>
                <p className="text-sm text-gray-600">Emergency Response Command Center</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Badge className={getRoleColor(profile?.role || '')}>
                  {profile?.role?.toUpperCase()}
                </Badge>
                <Badge className={`${
                  profile?.verification_status === 'verified' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {profile?.verification_status === 'verified' ? '✓ Verified' : '⏳ Pending'}
                </Badge>
              </div>
              <Badge className="bg-green-100 text-green-800">
                <Activity className="w-3 h-3 mr-1" />
                System Online
              </Badge>
              <Button variant="outline" size="sm">
                <Phone className="w-4 h-4 mr-2" />
                Emergency Hotline
              </Button>
              <Button variant="outline" size="sm" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* User Welcome Section */}
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Welcome back, {profile?.full_name}
              </h2>
              <p className="text-gray-600 mt-1">
                {profile?.organization && `${profile.organization} • `}
                {profile?.location}
              </p>
              <div className="flex items-center space-x-4 mt-2">
                <Badge className={getRoleColor(profile?.role || '')}>
                  {profile?.role?.replace('_', ' ').toUpperCase()} USER
                </Badge>
                <span className="text-sm text-gray-500">
                  Last active: {profile?.last_active ? new Date(profile.last_active).toLocaleDateString() : 'Today'}
                </span>
              </div>
            </div>
            {profile?.verification_status === 'pending' && (
              <div className="text-right">
                <Badge className="bg-yellow-100 text-yellow-800 mb-2">
                  ⏳ Verification Pending
                </Badge>
                <p className="text-sm text-gray-600">
                  Your account is under review.<br />
                  Full access will be granted after verification.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <div>
                  <div className="text-2xl font-bold text-red-600">{stats.activeAlerts}</div>
                  <div className="text-xs text-gray-600">Active Alerts</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-blue-600">{stats.totalVolunteers.toLocaleString()}</div>
                  <div className="text-xs text-gray-600">Volunteers</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-orange-600" />
                <div>
                  <div className="text-2xl font-bold text-orange-600">{stats.resourceRequests}</div>
                  <div className="text-xs text-gray-600">Resource Requests</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-green-600">{stats.resolvedCases.toLocaleString()}</div>
                  <div className="text-xs text-gray-600">Resolved Cases</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold text-purple-600">{stats.ngoPartners}</div>
                  <div className="text-xs text-gray-600">NGO Partners</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-indigo-600" />
                <div>
                  <div className="text-2xl font-bold text-indigo-600">{stats.governmentAgencies}</div>
                  <div className="text-xs text-gray-600">Gov Agencies</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Content */}
        <Tabs defaultValue="realtime" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="realtime">Real-Time</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="alerts">Live Alerts</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="coordination">Coordination</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="realtime" className="space-y-6">
            <RealTimeDashboard />
          </TabsContent>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <span>Recent Emergency Alerts</span>
                  </CardTitle>
                  <CardDescription>Latest disaster notifications and status updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentAlerts.map((alert) => (
                      <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          <div>
                            <div className="font-medium text-sm capitalize">{alert.type} - {alert.location}</div>
                            <div className="text-xs text-gray-500">{alert.time}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                          <Badge className={getStatusColor(alert.status)}>
                            {alert.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View All Alerts
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-blue-600" />
                    <span>Quick Actions</span>
                  </CardTitle>
                  <CardDescription>Emergency response tools and functions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      className="h-20 flex flex-col items-center justify-center bg-red-600 hover:bg-red-700"
                      disabled={profile?.verification_status !== 'verified'}
                    >
                      <AlertTriangle className="w-6 h-6 mb-1" />
                      <span className="text-xs">Send Alert</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                      <MapPin className="w-6 h-6 mb-1" />
                      <span className="text-xs">View Map</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col items-center justify-center"
                      disabled={!['government', 'ngo'].includes(profile?.role || '')}
                    >
                      <Users className="w-6 h-6 mb-1" />
                      <span className="text-xs">Deploy Teams</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                      <Package className="w-6 h-6 mb-1" />
                      <span className="text-xs">Manage Resources</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  <span>System Status</span>
                </CardTitle>
                <CardDescription>Real-time platform health and performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Activity className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-green-600">99.9%</div>
                    <div className="text-sm text-gray-600">Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Clock className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-blue-600">1.2s</div>
                    <div className="text-sm text-gray-600">Response Time</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Users className="w-8 h-8 text-purple-600" />
                    </div>
                    <div className="text-2xl font-bold text-purple-600">2,847</div>
                    <div className="text-sm text-gray-600">Active Users</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Shield className="w-8 h-8 text-orange-600" />
                    </div>
                    <div className="text-2xl font-bold text-orange-600">100%</div>
                    <div className="text-sm text-gray-600">Security Score</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tab contents remain the same... */}
          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <CardTitle>Live Emergency Alerts</CardTitle>
                <CardDescription>Real-time monitoring of all active emergency situations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Alert Management System</h3>
                  <p className="text-gray-600 mb-4">Comprehensive emergency alert dashboard would be implemented here</p>
                  <Button disabled={profile?.verification_status !== 'verified'}>
                    Access Alert System
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources">
            <Card>
              <CardHeader>
                <CardTitle>Resource Management</CardTitle>
                <CardDescription>Track and coordinate emergency resources and supplies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Resource Coordination Hub</h3>
                  <p className="text-gray-600 mb-4">Advanced resource tracking and distribution system</p>
                  <Button>Manage Resources</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="coordination">
            <Card>
              <CardHeader>
                <CardTitle>Multi-Agency Coordination</CardTitle>
                <CardDescription>Collaborate with government agencies, NGOs, and volunteers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Coordination Center</h3>
                  <p className="text-gray-600 mb-4">Inter-agency communication and coordination platform</p>
                  <Button disabled={!['government', 'ngo'].includes(profile?.role || '')}>
                    Access Coordination Tools
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics & Reporting</CardTitle>
                <CardDescription>Data-driven insights for emergency response optimization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Dashboard</h3>
                  <p className="text-gray-600 mb-4">Comprehensive reporting and performance analytics</p>
                  <Button disabled={!['government', 'ngo'].includes(profile?.role || '')}>
                    View Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
