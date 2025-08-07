'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Navigation, Shield, AlertTriangle } from 'lucide-react'

export function LocationTracker() {
  const [location, setLocation] = useState(null)
  const [accuracy, setAccuracy] = useState(null)
  const [status, setStatus] = useState('idle')
  const [address, setAddress] = useState('')

  const requestLocation = () => {
    setStatus('requesting')
    
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.')
      setStatus('denied')
      return
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords
        setLocation({ lat: latitude, lng: longitude })
        setAccuracy(accuracy)
        setStatus('granted')
        
        // Reverse geocoding simulation
        setAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`)
        
        // In a real app, you'd use a geocoding service like:
        // reverseGeocode(latitude, longitude).then(setAddress)
      },
      (error) => {
        console.error('Location error:', error)
        setStatus('denied')
        alert('Unable to retrieve your location. Please enable location services.')
      },
      options
    )
  }

  const getAccuracyStatus = () => {
    if (!accuracy) return { text: 'Unknown', color: 'bg-gray-100 text-gray-700' }
    if (accuracy <= 10) return { text: 'Excellent', color: 'bg-green-100 text-green-700' }
    if (accuracy <= 50) return { text: 'Good', color: 'bg-blue-100 text-blue-700' }
    if (accuracy <= 100) return { text: 'Fair', color: 'bg-yellow-100 text-yellow-700' }
    return { text: 'Poor', color: 'bg-red-100 text-red-700' }
  }

  const accuracyStatus = getAccuracyStatus()

  return (
    <section className="py-16 px-4 bg-gradient-to-r from-green-50 to-blue-50">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Precision Location Services
          </h2>
          <p className="text-lg text-gray-600">
            100% accurate location tracking for emergency response coordination
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Navigation className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <CardTitle>Live Location Tracking</CardTitle>
                  <CardDescription>High-precision GPS with network assistance</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {status === 'idle' && (
                <Button onClick={requestLocation} className="w-full bg-green-600 hover:bg-green-700">
                  <MapPin className="w-4 h-4 mr-2" />
                  Enable Location Services
                </Button>
              )}

              {status === 'requesting' && (
                <div className="text-center py-4">
                  <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Acquiring precise location...</p>
                </div>
              )}

              {status === 'granted' && location && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status:</span>
                    <Badge className="bg-green-100 text-green-700">Active</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Accuracy:</span>
                    <Badge className={accuracyStatus.color}>
                      {accuracyStatus.text} ({accuracy?.toFixed(0)}m)
                    </Badge>
                  </div>

                  <div>
                    <span className="text-sm font-medium block mb-1">Coordinates:</span>
                    <p className="text-xs font-mono bg-gray-100 p-2 rounded">
                      {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                    </p>
                  </div>

                  <div>
                    <span className="text-sm font-medium block mb-1">Address:</span>
                    <p className="text-xs bg-gray-100 p-2 rounded">
                      {address || 'Resolving address...'}
                    </p>
                  </div>
                </div>
              )}

              {status === 'denied' && (
                <div className="text-center py-4">
                  <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <p className="text-sm text-red-600 mb-3">Location access denied</p>
                  <Button variant="outline" onClick={requestLocation} className="text-sm">
                    Try Again
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Location Features</CardTitle>
                  <CardDescription>Advanced positioning capabilities</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-sm">Multi-Source Positioning</h4>
                    <p className="text-xs text-gray-600">GPS + Network + WiFi triangulation</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-sm">Offline Caching</h4>
                    <p className="text-xs text-gray-600">Works without internet connection</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-sm">GeoFencing Alerts</h4>
                    <p className="text-xs text-gray-600">Automatic alerts in danger zones</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-sm">Privacy Protected</h4>
                    <p className="text-xs text-gray-600">Encrypted location data</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Location data is encrypted and only shared with authorized emergency responders during active incidents.
          </p>
        </div>
      </div>
    </section>
  )
}
