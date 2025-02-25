'use client';

import React, { useState } from 'react';
import { Card, Grid, Typography, Box } from '@mui/material';
import dynamic from 'next/dynamic';

// Dynamically import charts to reduce initial bundle size
const LineChart = dynamic(() => import('@mui/x-charts/LineChart').then(mod => mod.LineChart), { ssr: false });
const BarChart = dynamic(() => import('@mui/x-charts/BarChart').then(mod => mod.BarChart), { ssr: false });

export interface AnalyticsDashboardProps {
  data?: any;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ data }) => {
  const [timeRange, setTimeRange] = useState('7d');

  // Sample data - replace with real data from your backend
  const sampleData = {
    sales: [
      { date: '2024-01-01', value: 1000 },
      { date: '2024-01-02', value: 1200 },
      { date: '2024-01-03', value: 800 },
      { date: '2024-01-04', value: 1500 },
      { date: '2024-01-05', value: 2000 },
    ],
    revenue: [
      { date: '2024-01-01', value: 5000 },
      { date: '2024-01-02', value: 6000 },
      { date: '2024-01-03', value: 4000 },
      { date: '2024-01-04', value: 7500 },
      { date: '2024-01-05', value: 10000 },
    ]
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Business Analytics Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Sales Trend
            </Typography>
            <LineChart
              xAxis={[{ data: sampleData.sales.map(d => new Date(d.date)) }]}
              series={[{
                data: sampleData.sales.map(d => d.value),
                area: true,
              }]}
              height={300}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Revenue Analysis
            </Typography>
            <BarChart
              xAxis={[{ data: sampleData.revenue.map(d => new Date(d.date)) }]}
              series={[{
                data: sampleData.revenue.map(d => d.value),
              }]}
              height={300}
            />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};