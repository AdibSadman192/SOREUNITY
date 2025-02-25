'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Box, CircularProgress, Alert } from '@mui/material';

interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskSpace: number;
  activeUsers: number;
  responseTime: number;
}

interface SystemAlert {
  severity: 'error' | 'warning' | 'info' | 'success';
  message: string;
  timestamp: Date;
}

export default function SystemHealth() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpuUsage: 0,
    memoryUsage: 0,
    diskSpace: 0,
    activeUsers: 0,
    responseTime: 0
  });

  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulated metrics update
    const updateMetrics = () => {
      setMetrics({
        cpuUsage: Math.random() * 100,
        memoryUsage: Math.random() * 100,
        diskSpace: Math.random() * 100,
        activeUsers: Math.floor(Math.random() * 1000),
        responseTime: Math.random() * 1000
      });

      // Simulate random alerts
      if (Math.random() > 0.8) {
        const newAlert: SystemAlert = {
          severity: Math.random() > 0.5 ? 'warning' : 'error',
          message: `System alert: High ${Math.random() > 0.5 ? 'CPU' : 'Memory'} usage detected`,
          timestamp: new Date()
        };
        setAlerts(prev => [newAlert, ...prev].slice(0, 5));
      }

      setIsLoading(false);
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        System Health & Monitoring
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Real-time Metrics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2">CPU Usage</Typography>
                  <CircularProgress
                    variant="determinate"
                    value={metrics.cpuUsage}
                    color={metrics.cpuUsage > 80 ? 'error' : 'primary'}
                  />
                  <Typography>{Math.round(metrics.cpuUsage)}%</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2">Memory Usage</Typography>
                  <CircularProgress
                    variant="determinate"
                    value={metrics.memoryUsage}
                    color={metrics.memoryUsage > 80 ? 'error' : 'primary'}
                  />
                  <Typography>{Math.round(metrics.memoryUsage)}%</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2">Disk Space</Typography>
                  <CircularProgress
                    variant="determinate"
                    value={metrics.diskSpace}
                    color={metrics.diskSpace > 90 ? 'error' : 'primary'}
                  />
                  <Typography>{Math.round(metrics.diskSpace)}%</Typography>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2">Active Users</Typography>
                <Typography variant="h6">{metrics.activeUsers}</Typography>

                <Typography variant="subtitle2" sx={{ mt: 2 }}>
                  Average Response Time
                </Typography>
                <Typography variant="h6">{Math.round(metrics.responseTime)}ms</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                System Alerts
              </Typography>
              {alerts.length === 0 ? (
                <Typography color="text.secondary">No active alerts</Typography>
              ) : (
                alerts.map((alert, index) => (
                  <Alert
                    key={index}
                    severity={alert.severity}
                    sx={{ mb: 1 }}
                  >
                    {alert.message}
                    <Typography variant="caption" display="block">
                      {alert.timestamp.toLocaleTimeString()}
                    </Typography>
                  </Alert>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}