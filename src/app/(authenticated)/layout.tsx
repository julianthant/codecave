import Navbar from '@/components/feed/navbar/navbar'

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main className="bg-background">{children}</main>
    </>
  )
}
