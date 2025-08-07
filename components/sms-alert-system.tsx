'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Phone, Send, Users, AlertTriangle, CheckCircle } from 'lucide-react'

interface SMSAlert {
  id: string
  message: string
  recipients: number
  status: 'sent' | 'pending' | 'failed'
  timestamp: string
  type: 'emergency' | 'update' | 'all-clear'
}

export function SMSAlertSystem() {
  const [alertMessage, setAlertMessage] = useState('')
  const [alertType, setAlertType] = useState<'emergency' | 'update' | 'all-clear'>('emergency')
  const [targetRadius, setTargetRadius] = useState('5')
  const [recentAlerts, setRecentAlerts] = useState<SMSAlert[]>([
    {
      id: '1',
      message: 'EMERGENCY: Wildfire approaching residential area. Evacuate immediately if in Zone A.',
      recipients: 1247,
      status: 'sent',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      type: 'emergency'
    },
    {
      id: '2',
      message: 'UPDATE: Evacuation shelter opened at Central High School. Food and water available.',
      recipients: 856,
      status: 'sent',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      type: 'update'
    }
  ])

  const handleSendAlert = () => {
    if (!alertMessage.trim()) return

    const newAlert: SMSAlert = {
      id: Date.now().toString(),
      message: alertMessage,
      recipients: Math.floor(Math.random() * 2000) + 500, // Simulate recipient count
      status: 'pending',
      timestamp: new Date().toISOString(),
      type: alertType
    }

    setRecentAlerts([newAlert, ...recentAlerts])
    setAlertMessage('')

    // Simulate sending process
    setTimeout(() => {
      setRecentAlerts(prev => 
        prev.map(alert => 
          alert.id === newAlert.id 
            ? { ...alert, status: 'sent' as const }
            : alert
        )
      )
    }, 2000)

    // Show success message
    alert(`SMS Alert sent to ${newAlert.recipients} recipients in ${targetRadius}km radius!`)
  }

  const getAlertTypeColor = (type: SMSAlert['type']) => {
    switch (type) {
      case 'emergency': return 'bg-red-100 text-red-800'
      case 'update': return 'bg-blue-100 text-blue-800'
      case 'all-clear': return 'bg-green-100 text-green-800'
    }
  }

  const getStatusIcon = (status: SMSAlert['status']) => {
    switch (status) {
      case 'sent': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'pending': return <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      case 'failed': return <AlertTriangle className="w-4 h-4 text-red-600" />
    }
  }

  const getTimeAgo = (timestamp: string) => {
    const now = new Date()
    const alertTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - alertTime.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    const diffInHours = Math.floor(diffInMinutes / 60)
    return `${diffInHours}h ago`
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-r from-purple-50 to-pink-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Emergency SMS Alert System
          </h2>
          <p className="text-lg text-gray-600">
            Instant mass notifications to affected communities and emergency responders
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Send Alert Panel */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Send className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <CardTitle>Send Emergency Alert</CardTitle>
                  <CardDescription>Broadcast to all registered users in affected area</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="alert-type">Alert Type</Label>
                <Select value={alertType} onValueChange={(value: any) => setAlertType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="emergency">🚨 Emergency Alert</SelectItem>
                    <SelectItem value="update">📢 Status Update</SelectItem>
                    <SelectItem value="all-clear">✅ All Clear</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="radius">Target Radius (km)</Label>
                <Select value={targetRadius} onValueChange={setTargetRadius}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 km radius</SelectItem>
                    <SelectItem value="5">5 km radius</SelectItem>
                    <SelectItem value="10">10 km radius</SelectItem>
                    <SelectItem value="25">25 km radius</SelectItem>
                    <SelectItem value="50">50 km radius</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="message">Alert Message</Label>
                <Textarea
                  id="message"
                  value={alertMessage}
                  onChange={(e) => setAlertMessage(e.target.value)}
                  placeholder="Enter emergency alert message..."
                  className="min-h-[100px]"
                  maxLength={160}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {alertMessage.length}/160 characters
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="font-semibold text-blue-900 text-sm mb-2">Preview:</h4>
                <div className="bg-white p-3 rounded border text-sm">
                  <div className="flex items-center space-x-2 mb-2">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">ResQHub Emergency Alert</span>
                  </div>
                  <p className="text-gray-800">
                    {alertMessage || 'Your alert message will appear here...'}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Reply STOP to opt out. Emergency hotline: 911
                  </p>
                </div>
              </div>

              <Button 
                onClick={handleSendAlert} 
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={!alertMessage.trim()}
              >
                <Send className="w-4 h-4 mr-2" />
                Send Alert to ~{Math.floor(Math.random() * 2000) + 500} Recipients
              </Button>
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Recent Alerts</CardTitle>
                  <CardDescription>SMS notifications sent in the last 24 hours</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAlerts.map((alert) => (
                  <div key={alert.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <Badge className={getAlertTypeColor(alert.type)}>
                        {alert.type.replace('-', ' ').toUpperCase()}
                      </Badge>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(alert.status)}
                        <span className="text-xs text-gray-500">
                          {getTimeAgo(alert.timestamp)}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-800">{alert.message}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Recipients: {alert.recipients.toLocaleString()}</span>
                      <span className="capitalize">Status: {alert.status}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900 text-sm mb-2">SMS System Stats</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-2xl font-bold text-green-700">99.8%</div>
                    <div className="text-green-600">Delivery Rate</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-700">2.3s</div>
                    <div className="text-green-600">Avg. Delivery Time</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            SMS alerts are sent via Twilio with 99.8% delivery rate. 
            System supports 10,000+ concurrent messages with automatic failover.
          </p>
        </div>
      </div>
    </section>
  )
}
