'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Transaction } from './TransactionModal'
import TransactionModal from './TransactionModal'

export default function TransactionList() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [selectedType, setSelectedType] = useState<'all' | 'income' | 'expense'>('all')
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 })

  useEffect(() => {
    fetchTransactions()
  }, [])

  useEffect(() => {
    calculateSummary()
  }, [transactions])

  const calculateSummary = () => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
    setSummary({
      income,
      expense,
      balance: income - expense
    })
  }

  const fetchTransactions = async () => {
    try {
      setIsLoading(true)
      let query = supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false })

      if (dateRange.start) {
        query = query.gte('date', dateRange.start)
      }
      if (dateRange.end) {
        query = query.lte('date', dateRange.end)
      }
      if (selectedType !== 'all') {
        query = query.eq('type', selectedType)
      }

      const { data, error } = await query

      if (error) throw error

      if (data) {
        setTransactions(data)
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveTransaction = async (transaction: Transaction) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([transaction])
        .select()

      if (error) throw error

      if (data) {
        setTransactions([data[0], ...transactions])
      }
    } catch (error) {
      console.error('Error saving transaction:', error)
    }
  }

  const handleFilterChange = () => {
    fetchTransactions()
  }

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="p-4">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h3 className="text-lg font-medium text-gray-900">Recent Transactions</h3>
            <p className="mt-2 text-sm text-gray-500">A list of all financial transactions.</p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
              Record Transaction
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-green-800">Total Income</h4>
            <p className="mt-2 text-2xl font-semibold text-green-900">${summary.income.toFixed(2)}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-red-800">Total Expenses</h4>
            <p className="mt-2 text-2xl font-semibold text-red-900">${summary.expense.toFixed(2)}</p>
          </div>
          <div className={`p-4 rounded-lg ${summary.balance >= 0 ? 'bg-blue-50' : 'bg-orange-50'}`}>
            <h4 className={`text-sm font-medium ${summary.balance >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>Balance</h4>
            <p className={`mt-2 text-2xl font-semibold ${summary.balance >= 0 ? 'text-blue-900' : 'text-orange-900'}`}>
              ${Math.abs(summary.balance).toFixed(2)}
              <span className="text-sm font-normal ml-1">{summary.balance >= 0 ? 'Surplus' : 'Deficit'}</span>
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              id="start-date"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              onBlur={handleFilterChange}
            />
          </div>
          <div>
            <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              id="end-date"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              onBlur={handleFilterChange}
            />
          </div>
          <div>
            <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700">Type</label>
            <select
              id="type-filter"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value as 'all' | 'income' | 'expense')
                handleFilterChange()
              }}
            >
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Date</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Description</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {isLoading ? (
                  <tr>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-6" colSpan={5}>
                      Loading transactions...
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-6" colSpan={5}>
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{transaction.description}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                        >
                          {transaction.type}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        ${transaction.amount.toFixed(2)}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          type="button"
                          className="text-indigo-600 hover:text-indigo-900"
                          onClick={() => console.log('View details:', transaction.id)}
                        >
                          View details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTransaction}
      />
    </div>
  )
}