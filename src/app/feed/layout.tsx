import Navbar from '@/components/feed/navbar/navbar'

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main className="bg-gray-50 pb-16 md:pb-0 min-h-[calc(100vh-64px)]">
        {children}
      </main>
    </>
  )
}
