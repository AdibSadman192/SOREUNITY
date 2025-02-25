'use client';

import React, { useState } from 'react';
import { Card, Grid, Typography, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import dynamic from 'next/dynamic';

const ScatterChart = dynamic(() => import('@mui/x-charts/ScatterChart').then(mod => mod.ScatterChart), { ssr: false });

export interface PredictiveModelsProps {
  data?: any;
}

export const PredictiveModels: React.FC<PredictiveModelsProps> = ({ data }) => {
  const [modelType, setModelType] = useState('sales');
  const [predictionPeriod, setPredictionPeriod] = useState('30d');

  // Sample prediction data - replace with actual ML model predictions
  const predictionData = {
    sales: [
      { actual: 1000, predicted: 1100, date: '2024-01-01' },
      { actual: 1200, predicted: 1250, date: '2024-01-02' },
      { actual: 800, predicted: 900, date: '2024-01-03' },
      { actual: 1500, predicted: 1400, date: '2024-01-04' },
      { actual: 2000, predicted: 1900, date: '2024-01-05' },
    ],
    inventory: [
      { actual: 500, predicted: 450, date: '2024-01-01' },
      { actual: 480, predicted: 460, date: '2024-01-02' },
      { actual: 520, predicted: 500, date: '2024-01-03' },
      { actual: 450, predicted: 440, date: '2024-01-04' },
      { actual: 400, predicted: 420, date: '2024-01-05' },
    ]
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Predictive Analytics
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Model Type</InputLabel>
            <Select
              value={modelType}
              label="Model Type"
              onChange={(e) => setModelType(e.target.value)}
            >
              <MenuItem value="sales">Sales Forecast</MenuItem>
              <MenuItem value="inventory">Inventory Optimization</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Prediction Period</InputLabel>
            <Select
              value={predictionPeriod}
              label="Prediction Period"
              onChange={(e) => setPredictionPeriod(e.target.value)}
            >
              <MenuItem value="7d">7 Days</MenuItem>
              <MenuItem value="30d">30 Days</MenuItem>
              <MenuItem value="90d">90 Days</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {modelType === 'sales' ? 'Sales Forecast' : 'Inventory Optimization'}
            </Typography>
            <ScatterChart
              height={400}
              series={[
                {
                  label: 'Actual',
                  data: predictionData[modelType as keyof typeof predictionData].map((d, index) => ({
                    id: index,
                    x: new Date(d.date).getTime(),
                    y: d.actual
                  })),
                },
                {
                  label: 'Predicted',
                  data: predictionData[modelType as keyof typeof predictionData].map((d, index) => ({
                    id: index,
                    x: new Date(d.date).getTime(),
                    y: d.predicted
                  })),
                }
              ]}
            />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};