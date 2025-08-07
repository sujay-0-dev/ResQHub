'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Cloud, Thermometer, Wind, Droplets, Zap } from 'lucide-react'

export function DisasterAlerts() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  // Simulate fetching disaster data from APIs like OpenWeatherMap, USGS, etc.
  useEffect(() => {
    const fetchDisasterData = async () => {
      setLoading(true)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock disaster data - in real app, this would come from multiple APIs
      const mockAlerts = [
        {
          id: '1',
          type: 'wildfire',
          severity: 'high',
          location: 'Los Angeles County, CA',
          description: 'Fast-moving wildfire threatening residential areas',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          affectedArea: '15,000 acres',
          instructions: [
            'Evacuate immediately if in evacuation zone',
            'Keep emergency kit ready',
            'Monitor local emergency broadcasts',
            'Avoid outdoor activities'
          ]
        },
        {
          id: '2',
          type: 'flood',
          severity: 'moderate',
          location: 'Houston, TX',
          description: 'Heavy rainfall causing urban flooding',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          affectedArea: 'Downtown area',
          instructions: [
            'Avoid driving through flooded roads',
            'Move to higher ground if necessary',
            'Stay indoors until conditions improve',
            'Have emergency supplies ready'
          ]
        },
        {
          id: '3',
          type: 'earthquake',
          severity: 'low',
          location: 'San Francisco Bay Area, CA',
          description: 'Minor earthquake detected, no immediate threat',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          affectedArea: 'Bay Area region',
          instructions: [
            'Check for structural damage',
            'Be prepared for aftershocks',
            'Review emergency plans',
            'Secure loose objects'
          ]
        }
      ]
      
      setAlerts(mockAlerts)
      setLoading(false)
    }

    fetchDisasterData()
    
    // Set up real-time updates every 5 minutes
    const interval = setInterval(fetchDisasterData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const getAlertIcon = (type) => {
    switch (type) {
      case 'earthquake': return AlertTriangle
      case 'flood': return Droplets
      case 'wildfire': return Zap
      case 'hurricane': return Wind
      case 'tornado': return Wind
      case 'heatwave': return Thermometer
      default: return Cloud
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'low': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'moderate': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'extreme': return 'bg-purple-100 text-purple-800 border-purple-200'
    }
  }

  const getTimeAgo = (timestamp) => {
    const now = new Date()
    const alertTime = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - alertTime.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Less than 1 hour ago'
    if (diffInHours === 1) return '1 hour ago'
    return `${diffInHours} hours ago`
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-r from-red-50 to-orange-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <h2 className="text-3xl font-bold text-gray-900">Live Disaster Monitoring</h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real-time natural disaster tracking and alerts powered by multiple government and weather APIs
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {alerts.map((alert) => {
                const IconComponent = getAlertIcon(alert.type)
                return (
                  <Card key={alert.id} className="border-2 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            alert.severity === 'high' || alert.severity === 'extreme' 
                              ? 'bg-red-100' : alert.severity === 'moderate' 
                              ? 'bg-orange-100' : 'bg-yellow-100'
                          }`}>
                            <IconComponent className={`w-5 h-5 ${
                              alert.severity === 'high' || alert.severity === 'extreme' 
                                ? 'text-red-600' : alert.severity === 'moderate' 
                                ? 'text-orange-600' : 'text-yellow-600'
                            }`} />
                          </div>
                          <div>
                            <CardTitle className="text-lg capitalize">
                              {alert.type.replace(/([A-Z])/g, ' $1')}
                            </CardTitle>
                            <CardDescription className="text-sm">
                              {alert.location}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-700">{alert.description}</p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Affected: {alert.affectedArea}</span>
                        <span>{getTimeAgo(alert.timestamp)}</span>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold mb-2">Safety Instructions:</h4>
                        <ul className="text-xs space-y-1">
                          {alert.instructions.slice(0, 2).map((instruction, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                              <span>{instruction}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Button variant="outline" size="sm" className="w-full text-xs">
                        View Full Alert Details
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <div className="text-center">
              <div className="inline-flex items-center space-x-4 bg-white rounded-lg p-4 shadow-sm border">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Live Monitoring Active</span>
                </div>
                <div className="text-xs text-gray-500">
                  Data sources: USGS, NOAA, OpenWeatherMap, Local Emergency Services
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
