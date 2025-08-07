'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertTriangle, MapPin, Navigation, RefreshCw, Zap, Droplets, Wind, Thermometer } from 'lucide-react'
import { useLocation } from '@/hooks/use-location'
import { useDisasters } from '@/hooks/use-disasters'

export function RealTimeDashboard() {
  const { location, accuracy, loading: locationLoading, address, getAccuracyStatus } = useLocation()
  const { disasters, loading: disastersLoading, refreshDisasters } = useDisasters()
  const [nearbyDisasters, setNearbyDisasters] = useState([])

  // Calculate distance between two coordinates
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371 // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  // Filter disasters within 500km of user location
  useEffect(() => {
    if (location && disasters.length > 0) {
      const nearby = disasters.filter(disaster => {
        if (!disaster.coordinates) return false
        const distance = calculateDistance(
          location.lat, location.lng,
          disaster.coordinates.lat, disaster.coordinates.lng
        )
        return distance <= 500 // Within 500km
      }).map(disaster => ({
        ...disaster,
        distance: calculateDistance(
          location.lat, location.lng,
          disaster.coordinates.lat, disaster.coordinates.lng
        )
      })).sort((a, b) => a.distance - b.distance)

      setNearbyDisasters(nearby)
    }
  }, [location, disasters])

  const getDisasterIcon = (type) => {
    switch (type) {
      case 'earthquake': return AlertTriangle
      case 'flood': return Droplets
      case 'wildfire': return Zap
      case 'hurricane': return Wind
      case 'tornado': return Wind
      case 'heatwave': return Thermometer
      default: return AlertTriangle
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'extreme': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'moderate': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'low': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDistance = (distance) => {
    if (distance < 1) return `${Math.round(distance * 1000)}m away`
    return `${Math.round(distance)}km away`
  }

  const accuracyStatus = getAccuracyStatus()

  return (
    <div className="space-y-6">
      {/* Real-time Location Status */}
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Navigation className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Real-Time Location</CardTitle>
                <CardDescription>Live GPS tracking for emergency response</CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600 font-medium">Live</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {locationLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
              <span className="ml-3 text-gray-600">Acquiring precise location...</span>
            </div>
          ) : location ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Current Coordinates</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg font-mono text-sm">
                    {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Address</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg text-sm">
                    {address || 'Resolving address...'}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Badge className={accuracyStatus.color}>
                    GPS Accuracy: {accuracyStatus.text} ({accuracy?.toFixed(0)}m)
                  </Badge>
                  <Badge className="bg-green-100 text-green-800">
                    <MapPin className="w-3 h-3 mr-1" />
                    Location Active
                  </Badge>
                </div>
                <span className="text-xs text-gray-500">
                  Updated: {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <p className="text-red-600 font-medium">Location access required</p>
              <p className="text-sm text-gray-600 mt-1">Please enable location services for emergency tracking</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Real-time Disaster Alerts */}
      <Card className="border-2 border-red-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Live Disaster Monitoring</CardTitle>
                <CardDescription>Real-time natural disaster tracking and alerts</CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshDisasters}
                disabled={disastersLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${disastersLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-red-600 font-medium">Live</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {disastersLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center space-x-3 p-4 border rounded-lg">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : nearbyDisasters.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">
                  Disasters Near You ({nearbyDisasters.length})
                </h4>
                <Badge className="bg-blue-100 text-blue-800">
                  Within 500km radius
                </Badge>
              </div>
              
              {nearbyDisasters.slice(0, 5).map((disaster) => {
                const IconComponent = getDisasterIcon(disaster.type)
                return (
                  <div key={disaster.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          disaster.severity === 'extreme' || disaster.severity === 'high' 
                            ? 'bg-red-100' : disaster.severity === 'moderate' 
                            ? 'bg-orange-100' : 'bg-yellow-100'
                        }`}>
                          <IconComponent className={`w-5 h-5 ${
                            disaster.severity === 'extreme' || disaster.severity === 'high' 
                              ? 'text-red-600' : disaster.severity === 'moderate' 
                              ? 'text-orange-600' : 'text-yellow-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900 capitalize">
                            {disaster.type.replace(/([A-Z])/g, ' $1')} - {disaster.location}
                          </h5>
                          <p className="text-sm text-gray-600 mt-1">
                            {disaster.description}
                          </p>
                          <div className="flex items-center space-x-3 mt-2">
                            <Badge className={getSeverityColor(disaster.severity)}>
                              {disaster.severity.toUpperCase()}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {formatDistance(disaster.distance)}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(disaster.timestamp).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {disaster.instructions && disaster.instructions.length > 0 && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <h6 className="text-sm font-medium text-gray-900 mb-2">Safety Instructions:</h6>
                        <ul className="text-sm text-gray-700 space-y-1">
                          {disaster.instructions.slice(0, 2).map((instruction, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                              <span>{instruction}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h4 className="font-medium text-gray-900 mb-2">No Active Disasters Nearby</h4>
              <p className="text-sm text-gray-600">
                No natural disasters detected within 500km of your location
              </p>
              <Badge className="bg-green-100 text-green-800 mt-3">
                All Clear in Your Area
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Global Disaster Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Global Disaster Summary</CardTitle>
          <CardDescription>Worldwide natural disaster activity in the last 24 hours</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {disasters.filter(d => d.type === 'earthquake').length}
              </div>
              <div className="text-sm text-red-700">Earthquakes</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {disasters.filter(d => d.type === 'flood').length}
              </div>
              <div className="text-sm text-blue-700">Floods</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {disasters.filter(d => d.type === 'wildfire').length}
              </div>
              <div className="text-sm text-orange-700">Wildfires</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {disasters.filter(d => ['hurricane', 'tornado'].includes(d.type)).length}
              </div>
              <div className="text-sm text-purple-700">Storms</div>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Data sources: USGS, NOAA, NASA FIRMS, National Weather Service
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Last updated: {new Date().toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
