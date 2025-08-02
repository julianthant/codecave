import { cn } from '@/lib/utils'
import { Check, X } from 'lucide-react'
import Image from 'next/image'

export function TeamInvitation() {
  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="relative bg-zinc-50 dark:bg-zinc-900 shadow-[0_1px_6px_0_rgba(0,0,0,0.02)] p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl">
        <div className="flex items-center gap-4">
          <div className="relative flex-shrink-0 w-10 h-10">
            <Image
              src="https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-01-n0x8HFv8EUetf9z6ht0wScJKoTHqf8.png"
              alt="Sarah Chen"
              sizes="40px"
              fill
              className="rounded-full object-cover"
            />
            <div className="right-0 bottom-0 absolute bg-green-500 rounded-full ring-2 ring-white dark:ring-zinc-950 w-2.5 h-2.5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center gap-4">
              <div>
                <p className="font-medium text-zinc-700 dark:text-zinc-300 text-sm">
                  Team Invitation
                </p>
                <p className="mt-0.5 text-[13px] text-zinc-500 dark:text-zinc-400">
                  Kokonut invited you to join{' '}
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">
                    Design Team
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex justify-center items-center hover:bg-red-50 dark:hover:bg-red-950/50 p-0 rounded-lg w-8 h-8 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 dark:text-zinc-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <button
              type="button"
              className={cn(
                'flex justify-center items-center p-0 rounded-lg w-8 h-8',
                'hover:bg-emerald-50 dark:hover:bg-emerald-950/50',
                'text-zinc-400 hover:text-emerald-600',
                'dark:text-zinc-500 dark:hover:text-emerald-400',
                'transition-colors'
              )}
            >
              <Check className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mt-2 ml-14">
          <p className="text-[12px] text-zinc-400 dark:text-zinc-500">
            Invited 5 minutes ago
          </p>
        </div>
      </div>
    </div>
  )
}
