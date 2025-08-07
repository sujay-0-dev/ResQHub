'use client'

import { useState, useEffect } from 'react'

export function useDisasters() {
  const [disasters, setDisasters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchDisasters = async () => {
    setLoading(true)
    setError(null)

    try {
      // Fetch from multiple APIs
      const [earthquakeData, weatherData, fireData] = await Promise.allSettled([
        fetchEarthquakes(),
        fetchWeatherAlerts(),
        fetchWildfires()
      ])

      const allDisasters = []

      // Process earthquake data
      if (earthquakeData.status === 'fulfilled') {
        allDisasters.push(...earthquakeData.value)
      }

      // Process weather alerts
      if (weatherData.status === 'fulfilled') {
        allDisasters.push(...weatherData.value)
      }

      // Process wildfire data
      if (fireData.status === 'fulfilled') {
        allDisasters.push(...fireData.value)
      }

      // Sort by severity and time
      allDisasters.sort((a, b) => {
        const severityOrder = { extreme: 4, high: 3, moderate: 2, low: 1 }
        return severityOrder[b.severity] - severityOrder[a.severity] || 
               new Date(b.timestamp) - new Date(a.timestamp)
      })

      setDisasters(allDisasters.slice(0, 10)) // Keep only top 10
    } catch (err) {
      console.error('Error fetching disasters:', err)
      setError('Failed to fetch disaster data')
    } finally {
      setLoading(false)
    }
  }

  const fetchEarthquakes = async () => {
    try {
      const response = await fetch(
        'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_day.geojson'
      )
      const data = await response.json()
      
      return data.features.map(feature => ({
        id: feature.id,
        type: 'earthquake',
        title: feature.properties.title,
        location: feature.properties.place,
        magnitude: feature.properties.mag,
        severity: feature.properties.mag >= 7 ? 'extreme' : 
                 feature.properties.mag >= 6 ? 'high' :
                 feature.properties.mag >= 4 ? 'moderate' : 'low',
        timestamp: new Date(feature.properties.time).toISOString(),
        coordinates: {
          lat: feature.geometry.coordinates[1],
          lng: feature.geometry.coordinates[0]
        },
        description: `Magnitude ${feature.properties.mag} earthquake`,
        instructions: [
          'Drop, Cover, and Hold On',
          'Stay away from windows and heavy objects',
          'If outdoors, move away from buildings',
          'Check for injuries and hazards'
        ]
      }))
    } catch (error) {
      console.error('Error fetching earthquakes:', error)
      return []
    }
  }

  const fetchWeatherAlerts = async () => {
    try {
      const response = await fetch(
        'https://api.weather.gov/alerts/active?status=actual&message_type=alert'
      )
      const data = await response.json()
      
      return data.features.slice(0, 5).map(feature => {
        const props = feature.properties
        return {
          id: props.id,
          type: getWeatherType(props.event),
          title: props.headline,
          location: props.areaDesc,
          severity: getWeatherSeverity(props.severity),
          timestamp: props.sent,
          description: props.description?.substring(0, 200) + '...',
          instructions: props.instruction ? [props.instruction] : [
            'Follow local emergency guidance',
            'Stay informed through official channels',
            'Prepare emergency supplies'
          ]
        }
      })
    } catch (error) {
      console.error('Error fetching weather alerts:', error)
      return []
    }
  }

  const fetchWildfires = async () => {
    try {
      // Using NASA FIRMS API for active fires
      const response = await fetch(
        'https://firms.modaps.eosdis.nasa.gov/api/country/csv/YOUR_API_KEY/USA/1'
      )
      const text = await response.text()
      const lines = text.split('\n').slice(1, 6) // Skip header, take first 5
      
      return lines.filter(line => line.trim()).map((line, index) => {
        const [lat, lng, brightness, scan, track, acq_date, acq_time, satellite, confidence, version, bright_t31, frp, daynight] = line.split(',')
        
        return {
          id: `fire_${index}`,
          type: 'wildfire',
          title: `Active Fire Detection`,
          location: `${parseFloat(lat).toFixed(2)}, ${parseFloat(lng).toFixed(2)}`,
          severity: parseFloat(confidence) > 80 ? 'high' : 
                   parseFloat(confidence) > 50 ? 'moderate' : 'low',
          timestamp: new Date(`${acq_date} ${acq_time}`).toISOString(),
          coordinates: {
            lat: parseFloat(lat),
            lng: parseFloat(lng)
          },
          description: `Fire detected with ${confidence}% confidence`,
          instructions: [
            'Evacuate if in immediate danger',
            'Follow evacuation routes',
            'Monitor air quality',
            'Stay informed through emergency broadcasts'
          ]
        }
      })
    } catch (error) {
      console.error('Error fetching wildfire data:', error)
      return []
    }
  }

  const getWeatherType = (event) => {
    const eventLower = event.toLowerCase()
    if (eventLower.includes('tornado')) return 'tornado'
    if (eventLower.includes('hurricane') || eventLower.includes('tropical')) return 'hurricane'
    if (eventLower.includes('flood')) return 'flood'
    if (eventLower.includes('fire')) return 'wildfire'
    if (eventLower.includes('heat')) return 'heatwave'
    return 'weather'
  }

  const getWeatherSeverity = (severity) => {
    if (!severity) return 'moderate'
    const sev = severity.toLowerCase()
    if (sev.includes('extreme')) return 'extreme'
    if (sev.includes('severe')) return 'high'
    if (sev.includes('moderate')) return 'moderate'
    return 'low'
  }

  useEffect(() => {
    fetchDisasters()
    // Refresh every 5 minutes
    const interval = setInterval(fetchDisasters, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return {
    disasters,
    loading,
    error,
    refreshDisasters: fetchDisasters
  }
}
