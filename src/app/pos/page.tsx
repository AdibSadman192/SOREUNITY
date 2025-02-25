import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import POSClient from './components/POSClient'

export default async function POSSystem() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="space-y-6">
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <h2 className="text-lg font-medium text-gray-900">Point of Sale</h2>
        <div className="mt-3 text-sm text-gray-500">
          <p>Process sales and manage transactions</p>
        </div>
      </div>

      <POSClient />
    </div>
  )
}