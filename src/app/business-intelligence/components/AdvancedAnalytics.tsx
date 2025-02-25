'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  TextField,
  Autocomplete,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from 'recharts';

// Mock data for predictive analysis
const predictiveData = [
  { month: 'Jul', actual: 3200, predicted: 3300 },
  { month: 'Aug', actual: 3500, predicted: 3600 },
  { month: 'Sep', actual: 3100, predicted: 3200 },
  { month: 'Oct', predicted: 3400 },
  { month: 'Nov', predicted: 3800 },
  { month: 'Dec', predicted: 4100 },
];

// Mock correlation data
const correlationData = [
  { x: 100, y: 200, z: 200 },
  { x: 120, y: 100, z: 260 },
  { x: 170, y: 300, z: 400 },
  { x: 140, y: 250, z: 280 },
  { x: 150, y: 400, z: 500 },
  { x: 110, y: 280, z: 200 },
];

const metrics = [
  'Revenue',
  'Orders',
  'Customer Acquisition',
  'Inventory Turnover',
  'Customer Satisfaction',
];

export default function AdvancedAnalytics() {
  const [selectedMetric, setSelectedMetric] = useState('Revenue');
  const [customMetrics, setCustomMetrics] = useState<string[]>([]);

  const handleMetricChange = (event: any) => {
    setSelectedMetric(event.target.value);
  };

  const handleCustomMetricAdd = (event: any, newValue: string[]) => {
    setCustomMetrics(newValue);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Advanced Analytics & Predictions
      </Typography>

      <Grid container spacing={3}>
        {/* Metric Selection */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Predictive Analysis
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Select Metric</InputLabel>
                <Select
                  value={selectedMetric}
                  label="Select Metric"
                  onChange={handleMetricChange}
                >
                  {metrics.map((metric) => (
                    <MenuItem key={metric} value={metric}>
                      {metric}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={predictiveData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      stroke="#8884d8"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="predicted"
                      stroke="#82ca9d"
                      strokeDasharray="5 5"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Correlation Analysis */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Correlation Analysis
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" dataKey="x" name="Sales" />
                    <YAxis type="number" dataKey="y" name="Revenue" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="Performance" data={correlationData} fill="#8884d8" />
                  </ScatterChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Custom Dashboard Builder */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Custom Dashboard Builder
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Autocomplete
                  multiple
                  options={metrics}
                  value={customMetrics}
                  onChange={handleCustomMetricAdd}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Select Metrics for Custom Dashboard"
                    />
                  )}
                />
              </Box>
              {customMetrics.length > 0 ? (
                <Grid container spacing={2}>
                  {customMetrics.map((metric) => (
                    <Grid item xs={12} md={6} key={metric}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle1">{metric}</Typography>
                          {/* Placeholder for custom metric visualization */}
                          <Box
                            sx={{
                              height: 200,
                              bgcolor: 'action.hover',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Typography color="textSecondary">
                              {metric} Visualization
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography color="textSecondary">
                  Select metrics to build your custom dashboard
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}