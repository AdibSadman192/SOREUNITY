'use client';

import React, { useState } from 'react';
import { Card, Grid, Typography, Box, Button, Select, MenuItem, FormControl, InputLabel, TextField } from '@mui/material';
import dynamic from 'next/dynamic';

const LineChart = dynamic(() => import('@mui/x-charts/LineChart').then(mod => mod.LineChart), { ssr: false });
const BarChart = dynamic(() => import('@mui/x-charts/BarChart').then(mod => mod.BarChart), { ssr: false });

export interface ReportGeneratorProps {
  data?: any;
}

interface ReportConfig {
  title: string;
  type: 'sales' | 'inventory' | 'revenue';
  period: 'daily' | 'weekly' | 'monthly';
  format: 'chart' | 'table';
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({ data }) => {
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    title: 'New Report',
    type: 'sales',
    period: 'daily',
    format: 'chart'
  });

  // Sample data - replace with real data from your backend
  const reportData = {
    sales: {
      daily: [
        { date: '2024-01-01', value: 1000 },
        { date: '2024-01-02', value: 1200 },
        { date: '2024-01-03', value: 800 },
        { date: '2024-01-04', value: 1500 },
        { date: '2024-01-05', value: 2000 },
      ],
      weekly: [
        { date: '2024-W1', value: 5000 },
        { date: '2024-W2', value: 5500 },
        { date: '2024-W3', value: 4800 },
        { date: '2024-W4', value: 6000 },
      ],
      monthly: [
        { date: '2024-01', value: 20000 },
        { date: '2024-02', value: 22000 },
        { date: '2024-03', value: 19000 },
      ]
    }
  };

  const handleConfigChange = (field: keyof ReportConfig, value: string) => {
    setReportConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateReport = () => {
    // Implement report generation logic here
    console.log('Generating report with config:', reportConfig);
  };

  const renderReportPreview = () => {
    const data = reportConfig.type === 'sales' ? reportData.sales[reportConfig.period] : [];

    return reportConfig.format === 'chart' ? (
      <LineChart
        xAxis={[{ data: data.map(d => new Date(d.date)) }]}
        series={[{
          data: data.map(d => d.value),
          area: true,
        }]}
        height={400}
      />
    ) : (
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Report Data Table
        </Typography>
        {data.map((row, index) => (
          <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>{row.date}</Typography>
            <Typography>{row.value}</Typography>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Report Generator
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Report Configuration
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <TextField
                label="Report Title"
                value={reportConfig.title}
                onChange={(e) => handleConfigChange('title', e.target.value)}
                fullWidth
              />
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Report Type</InputLabel>
              <Select
                value={reportConfig.type}
                label="Report Type"
                onChange={(e) => handleConfigChange('type', e.target.value)}
              >
                <MenuItem value="sales">Sales Report</MenuItem>
                <MenuItem value="inventory">Inventory Report</MenuItem>
                <MenuItem value="revenue">Revenue Report</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Time Period</InputLabel>
              <Select
                value={reportConfig.period}
                label="Time Period"
                onChange={(e) => handleConfigChange('period', e.target.value)}
              >
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Report Format</InputLabel>
              <Select
                value={reportConfig.format}
                label="Report Format"
                onChange={(e) => handleConfigChange('format', e.target.value)}
              >
                <MenuItem value="chart">Chart</MenuItem>
                <MenuItem value="table">Table</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              color="primary"
              onClick={generateReport}
              fullWidth
            >
              Generate Report
            </Button>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Report Preview
            </Typography>
            {renderReportPreview()}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};