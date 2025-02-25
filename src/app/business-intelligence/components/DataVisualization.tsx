'use client';

import React, { useState } from 'react';
import { Card, Grid, Typography, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import dynamic from 'next/dynamic';

const LineChart = dynamic(() => import('@mui/x-charts/LineChart').then(mod => mod.LineChart), { ssr: false });
const BarChart = dynamic(() => import('@mui/x-charts/BarChart').then(mod => mod.BarChart), { ssr: false });
const PieChart = dynamic(() => import('@mui/x-charts/PieChart').then(mod => mod.PieChart), { ssr: false });

export interface DataVisualizationProps {
  data?: any;
}

export const DataVisualization: React.FC<DataVisualizationProps> = ({ data }) => {
  const [visualType, setVisualType] = useState('realtime');
  const [dataSource, setDataSource] = useState('sales');

  // Sample data - replace with real-time data from your backend
  const sampleData = {
    sales: {
      realtime: [
        { timestamp: '2024-01-01T10:00:00', value: 1000 },
        { timestamp: '2024-01-01T11:00:00', value: 1200 },
        { timestamp: '2024-01-01T12:00:00', value: 800 },
        { timestamp: '2024-01-01T13:00:00', value: 1500 },
        { timestamp: '2024-01-01T14:00:00', value: 2000 },
      ],
      distribution: [
        { category: 'Online', value: 5000 },
        { category: 'In-Store', value: 3000 },
        { category: 'Mobile', value: 2000 },
      ]
    },
    inventory: {
      realtime: [
        { timestamp: '2024-01-01T10:00:00', value: 500 },
        { timestamp: '2024-01-01T11:00:00', value: 480 },
        { timestamp: '2024-01-01T12:00:00', value: 520 },
        { timestamp: '2024-01-01T13:00:00', value: 450 },
        { timestamp: '2024-01-01T14:00:00', value: 400 },
      ],
      distribution: [
        { category: 'Electronics', value: 2000 },
        { category: 'Clothing', value: 1500 },
        { category: 'Food', value: 1000 },
      ]
    }
  };

  const renderVisualization = () => {
    if (visualType === 'realtime') {
      return (
        <LineChart
          xAxis={[{ 
            data: sampleData[dataSource as keyof typeof sampleData].realtime.map(d => new Date(d.timestamp)),
            label: 'Time'
          }]}
          series={[{
            data: sampleData[dataSource as keyof typeof sampleData].realtime.map(d => d.value),
            area: true,
          }]}
          height={400}
        />
      );
    } else {
      return (
        <PieChart
          series={[{
            data: sampleData[dataSource as keyof typeof sampleData].distribution.map(d => ({
              id: d.category,
              value: d.value,
              label: d.category
            })),
          }]}
          height={400}
        />
      );
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Data Visualization
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Visualization Type</InputLabel>
            <Select
              value={visualType}
              label="Visualization Type"
              onChange={(e) => setVisualType(e.target.value)}
            >
              <MenuItem value="realtime">Real-time Trend</MenuItem>
              <MenuItem value="distribution">Distribution Analysis</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Data Source</InputLabel>
            <Select
              value={dataSource}
              label="Data Source"
              onChange={(e) => setDataSource(e.target.value)}
            >
              <MenuItem value="sales">Sales Data</MenuItem>
              <MenuItem value="inventory">Inventory Data</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {dataSource.charAt(0).toUpperCase() + dataSource.slice(1)} {visualType === 'realtime' ? 'Trend' : 'Distribution'}
            </Typography>
            {renderVisualization()}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};