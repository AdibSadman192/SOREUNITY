'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

type CustomerTransaction = {
  id: string
  date: string
  amount: number
  type: string
  description: string
}

type CustomerDetails = {
  id: string
  name: string
  email: string
  phone: string
  loyalty_points: number
  total_spent: number
  created_at: string
  last_purchase: string
  address?: string
  notes?: string
}

type CustomerDetailsProps = {
  customerId: string
  onClose: () => void
}

export default function CustomerDetails({ customerId, onClose }: CustomerDetailsProps) {
  const [customer, setCustomer] = useState<CustomerDetails | null>(null)
  const [transactions, setTransactions] = useState<CustomerTransaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    fetchCustomerDetails()
    fetchCustomerTransactions()
  }, [customerId])

  const fetchCustomerDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', customerId)
        .single()

      if (error) throw error
      setCustomer(data)
    } catch (error) {
      console.error('Error fetching customer details:', error)
    }
  }

  const fetchCustomerTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('customer_id', customerId)
        .order('date', { ascending: false })

      if (error) throw error
      setTransactions(data || [])
    } catch (error) {
      console.error('Error fetching customer transactions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!customer) return null

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
            <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
              <button
                type="button"
                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={onClose}
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-lg font-semibold leading-6 text-gray-900">
                  Customer Details
                </h3>
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Name</dt>
                      <dd className="mt-1 text-sm text-gray-900">{customer.name}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Email</dt>
                      <dd className="mt-1 text-sm text-gray-900">{customer.email}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Phone</dt>
                      <dd className="mt-1 text-sm text-gray-900">{customer.phone}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Loyalty Points</dt>
                      <dd className="mt-1 text-sm text-gray-900">{customer.loyalty_points}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Total Spent</dt>
                      <dd className="mt-1 text-sm text-gray-900">${customer.total_spent.toFixed(2)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Member Since</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {new Date(customer.created_at).toLocaleDateString()}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900">Recent Transactions</h4>
                  <div className="mt-2 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                      <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-gray-300">
                          <thead>
                            <tr>
                              <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Date</th>
                              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Description</th>
                              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {isLoading ? (
                              <tr>
                                <td colSpan={3} className="py-4 pl-4 pr-3 text-sm text-gray-500">
                                  Loading transactions...
                                </td>
                              </tr>
                            ) : transactions.length === 0 ? (
                              <tr>
                                <td colSpan={3} className="py-4 pl-4 pr-3 text-sm text-gray-500">
                                  No transactions found
                                </td>
                              </tr>
                            ) : (
                              transactions.map((transaction) => (
                                <tr key={transaction.id}>
                                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500">
                                    {new Date(transaction.date).toLocaleDateString()}
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    {transaction.description}
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                    ${transaction.amount.toFixed(2)}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}