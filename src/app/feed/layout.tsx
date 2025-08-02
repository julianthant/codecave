import Navbar from '@/components/feed/navbar'

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main className="bg-gray-50 pt-16 md:pt-16 pb-16 md:pb-0 min-h-screen">
        {children}
      </main>
    </>
  )
}
