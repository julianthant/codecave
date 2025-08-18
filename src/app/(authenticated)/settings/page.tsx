import { Metadata } from 'next'
import { SettingsContainer } from '@/components/settings/settings-container'

export const metadata: Metadata = {
  title: 'Settings | CodeCave',
  description: 'Manage your account settings and preferences',
}

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Settings
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>
        
        <SettingsContainer />
      </div>
    </div>
  )
}