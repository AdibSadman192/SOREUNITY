'use client';

import { useState } from 'react';
import { Card, CardContent, Grid, Typography, Box, Tabs, Tab, Paper } from '@mui/material';
import AdvancedAnalytics from './components/AdvancedAnalytics';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const mockData = [
  { month: 'Jan', sales: 4000, profit: 2400, inventory: 300 },
  { month: 'Feb', sales: 3000, profit: 1398, inventory: 280 },
  { month: 'Mar', sales: 2000, profit: 9800, inventory: 250 },
  { month: 'Apr', sales: 2780, profit: 3908, inventory: 290 },
  { month: 'May', sales: 1890, profit: 4800, inventory: 310 },
  { month: 'Jun', sales: 2390, profit: 3800, inventory: 270 },
];

const categoryData = [
  { name: 'Electronics', value: 400 },
  { name: 'Clothing', value: 300 },
  { name: 'Food', value: 200 },
  { name: 'Books', value: 150 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`bi-tabpanel-${index}`}
      aria-labelledby={`bi-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function BusinessIntelligence() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const KPICard = ({ title, value, trend }: { title: string; value: string; trend: string }) => (
    <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
      <Typography variant="subtitle1" color="textSecondary">
        {title}
      </Typography>
      <Typography variant="h4" sx={{ my: 1 }}>
        {value}
      </Typography>
      <Typography variant="body2" color={trend.startsWith('+') ? 'success.main' : 'error.main'}>
        {trend}
      </Typography>
    </Paper>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Business Intelligence Dashboard
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Overview" />
          <Tab label="Sales Analytics" />
          <Tab label="Inventory Insights" />
          <Tab label="Advanced Analytics" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <KPICard title="Total Revenue" value="$24,890" trend="+12.5%" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <KPICard title="Total Orders" value="1,284" trend="+8.2%" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <KPICard title="Average Order Value" value="$195" trend="+5.8%" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <KPICard title="Customer Growth" value="+156" trend="+15.3%" />
            </Grid>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Revenue Overview
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="sales" fill="#8884d8" />
                      <Bar dataKey="profit" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Sales by Category
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Trend Analysis
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="sales" stroke="#8884d8" />
                      <Line type="monotone" dataKey="profit" stroke="#82ca9d" />
                      <Line type="monotone" dataKey="inventory" stroke="#ffc658" />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6">Sales Analytics Content</Typography>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6">Inventory Insights Content</Typography>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <AdvancedAnalytics />
      </TabPanel>
    </Box>
  );
}