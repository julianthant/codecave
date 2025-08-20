import { Metadata } from 'next'
import { SettingsContainer } from '@/components/settings/settings-container'

export const metadata: Metadata = {
  title: 'Settings | CodeCave',
  description: 'Manage your account settings and preferences',
}

export default function SettingsPage() {
  return (
    <div className="bg-gray-50 min-h-[calc(100vh-65px)]">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="font-bold text-gray-900 text-3xl tracking-tight">
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
