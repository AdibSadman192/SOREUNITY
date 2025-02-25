import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // For auth pages, we don't redirect if there's no session
  // Instead, we let the page handle the authentication flow

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <main className="w-full max-w-md p-6">
        {children}
      </main>
    </div>
  )
}