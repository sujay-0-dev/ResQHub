'use client'

import { useState, useEffect } from 'react'

export function useLocation() {
  const [location, setLocation] = useState(null)
  const [accuracy, setAccuracy] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [address, setAddress] = useState('')

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.')
      return
    }

    setLoading(true)
    setError(null)

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords
        const newLocation = { lat: latitude, lng: longitude }
        
        setLocation(newLocation)
        setAccuracy(accuracy)
        setLoading(false)
        
        // Reverse geocoding
        try {
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=YOUR_OPENCAGE_API_KEY`
          )
          const data = await response.json()
          if (data.results && data.results.length > 0) {
            setAddress(data.results[0].formatted)
          } else {
            setAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`)
          }
        } catch (err) {
          console.error('Reverse geocoding error:', err)
          setAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`)
        }
      },
      (error) => {
        console.error('Location error:', error)
        setError('Unable to retrieve your location. Please enable location services.')
        setLoading(false)
      },
      options
    )
  }

  // Auto-update location every 30 seconds
  useEffect(() => {
    getCurrentLocation()
    const interval = setInterval(getCurrentLocation, 30000)
    return () => clearInterval(interval)
  }, [])

  const getAccuracyStatus = () => {
    if (!accuracy) return { text: 'Unknown', color: 'bg-gray-100 text-gray-700' }
    if (accuracy <= 10) return { text: 'Excellent', color: 'bg-green-100 text-green-700' }
    if (accuracy <= 50) return { text: 'Good', color: 'bg-blue-100 text-blue-700' }
    if (accuracy <= 100) return { text: 'Fair', color: 'bg-yellow-100 text-yellow-700' }
    return { text: 'Poor', color: 'bg-red-100 text-red-700' }
  }

  return {
    location,
    accuracy,
    error,
    loading,
    address,
    getCurrentLocation,
    getAccuracyStatus
  }
}
