'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, CheckCircle, ExternalLink, Copy, Database } from 'lucide-react'
import { getConfigStatus } from '@/lib/supabase-client'

export function SetupNotice() {
  const [configStatus, setConfigStatus] = useState({ hasValidConfig: true, isDemoMode: false })
  const [showSetupGuide, setShowSetupGuide] = useState(false)

  useEffect(() => {
    // Check configuration status
    const status = getConfigStatus()
    setConfigStatus(status)
  }, [])

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  if (configStatus.hasValidConfig) {
    return null // Don't show notice if properly configured
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <Alert className="border-yellow-200 bg-yellow-50">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800">
          <div className="flex items-center justify-between">
            <span className="text-sm">Demo Mode - Supabase not configured</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowSetupGuide(!showSetupGuide)}
              className="ml-2 h-6 text-xs"
            >
              Setup
            </Button>
          </div>
        </AlertDescription>
      </Alert>

      {showSetupGuide && (
        <Card className="mt-2 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Database className="w-5 h-5 mr-2 text-blue-600" />
              Supabase Setup Guide
            </CardTitle>
            <CardDescription>
              Configure Supabase to enable full authentication functionality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">1</span>
                </div>
                <div className="text-sm">
                  <p className="font-medium">Create Supabase Project</p>
                  <p className="text-gray-600">Go to supabase.com and create a new project</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-1 h-7 text-xs"
                    onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Open Supabase
                  </Button>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">2</span>
                </div>
                <div className="text-sm">
                  <p className="font-medium">Get Project Credentials</p>
                  <p className="text-gray-600">Copy URL and anon key from Settings → API</p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">3</span>
                </div>
                <div className="text-sm">
                  <p className="font-medium">Create .env.local file</p>
                  <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span>NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-5 w-5 p-0"
                        onClick={() => copyToClipboard('NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co')}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span>NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-5 w-5 p-0"
                        onClick={() => copyToClipboard('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here')}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">4</span>
                </div>
                <div className="text-sm">
                  <p className="font-medium">Run Database Setup</p>
                  <p className="text-gray-600">Execute the SQL script in your Supabase SQL editor</p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">5</span>
                </div>
                <div className="text-sm">
                  <p className="font-medium">Restart Development Server</p>
                  <p className="text-gray-600">Run <code className="bg-gray-200 px-1 rounded">npm run dev</code> to reload environment variables</p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t">
              <Badge className="bg-blue-100 text-blue-800 text-xs">
                <CheckCircle className="w-3 h-3 mr-1" />
                Currently running in demo mode
              </Badge>
              <p className="text-xs text-gray-600 mt-1">
                All features work in demo mode, but data won't persist
              </p>
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowSetupGuide(false)}
              className="w-full"
            >
              Close Guide
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
