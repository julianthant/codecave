import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { User, ArrowLeft } from 'lucide-react'

export default function ProfileNotFound() {
  return (
    <div className="flex justify-center items-center bg-gray-50 px-4 min-h-screen">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="flex justify-center items-center bg-gray-100 rounded-full w-16 h-16">
              <User className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <h1 className="mb-2 font-bold text-gray-900 text-2xl">
            Profile Not Found
          </h1>
          <p className="mb-6 text-gray-600">
            Sorry, we couldn&apos;t find the profile you&apos;re looking for.
            The user might not exist or the profile may have been removed.
          </p>
          <Link href="/feed">
            <Button className="bg-orange-600 hover:bg-orange-700 w-full">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Feed
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
