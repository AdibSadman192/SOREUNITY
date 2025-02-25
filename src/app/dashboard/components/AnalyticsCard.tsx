'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js'

type AnalyticsData = {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  growth: number;
};

export default function AnalyticsCard() {
  const [data, setData] = useState<AnalyticsData>({
    totalSales: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    growth: 0,
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('amount, created_at')
          .gte('created_at', new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString());

        if (ordersError) throw ordersError;

        const { data: lastMonthOrders, error: lastMonthError } = await supabase
          .from('orders')
          .select('amount')
          .gte('created_at', new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString())
          .lt('created_at', new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString());

        if (lastMonthError) throw lastMonthError;

        const totalSales = orders?.reduce((sum, order) => sum + (order.amount || 0), 0) || 0;
        const lastMonthSales = lastMonthOrders?.reduce((sum, order) => sum + (order.amount || 0), 0) || 0;
        const growth = lastMonthSales ? ((totalSales - lastMonthSales) / lastMonthSales) * 100 : 0;

        setData({
          totalSales,
          totalOrders: orders?.length || 0,
          averageOrderValue: orders?.length ? totalSales / orders.length : 0,
          growth: Math.round(growth * 100) / 100,
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
    // Set up real-time subscription for analytics updates
    const channel = supabase
      .channel('analytics')
      .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
        fetchAnalytics();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-24 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Total Sales</h3>
        <p className="mt-2 text-3xl font-semibold text-gray-900">
          ${data.totalSales.toLocaleString()}
        </p>
        <div className="mt-2 flex items-center text-sm">
          <span className="text-green-600">
            ↑{data.growth}%
          </span>
          <span className="ml-2 text-gray-500">from last month</span>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
        <p className="mt-2 text-3xl font-semibold text-gray-900">
          {data.totalOrders}
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Avg. ${data.averageOrderValue} per order
        </p>
      </div>
    </div>
  );
}