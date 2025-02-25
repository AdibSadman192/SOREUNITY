'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useSession } from '@/components/providers/SessionProvider'

type Customer = {
  id: string
  name: string
  email: string
  phone: string
  address: string
  created_at: string
}

export default function CustomerList() {
  const { session } = useSession()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (session) {
      fetchCustomers()
    }
  }, [session])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      if (data) {
        setCustomers(data)
      }
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching customers:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return (
      <div className="text-center py-4">
        <p>Please sign in to view customers.</p>
      </div>
    )
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      {error && (
        <div className="p-4 bg-red-50 text-red-700">{error}</div>
      )}
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Customers</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">A list of all customers.</p>
      </div>
      <div className="border-t border-gray-200">
        {loading ? (
          <div className="text-center py-4">Loading customers...</div>
        ) : customers.length === 0 ? (
          <div className="text-center py-4">No customers found.</div>
        ) : (
          <ul role="list" className="divide-y divide-gray-200">
            {customers.map((customer) => (
              <li key={customer.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-indigo-600 truncate">{customer.name}</p>
                    <p className="text-sm text-gray-500">{customer.email}</p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <p className="text-sm text-gray-500">{customer.phone}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{customer.address}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}