'use client';

import React, { useState } from 'react';
import { Card, Grid, Typography, Box, Button, IconButton, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import dynamic from 'next/dynamic';

const LineChart = dynamic(() => import('@mui/x-charts/LineChart').then(mod => mod.LineChart), { ssr: false });
const BarChart = dynamic(() => import('@mui/x-charts/BarChart').then(mod => mod.BarChart), { ssr: false });
const PieChart = dynamic(() => import('@mui/x-charts/PieChart').then(mod => mod.PieChart), { ssr: false });

export interface CustomDashboardBuilderProps {
  data?: any;
}

interface Widget {
  id: string;
  type: 'line' | 'bar' | 'pie';
  title: string;
  size: 'small' | 'medium' | 'large';
}

export const CustomDashboardBuilder: React.FC<CustomDashboardBuilderProps> = ({ data }) => {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [dashboardTitle, setDashboardTitle] = useState('My Custom Dashboard');

  const addWidget = (type: Widget['type']) => {
    const newWidget: Widget = {
      id: `widget-${Date.now()}`,
      type,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Chart`,
      size: 'medium'
    };
    setWidgets([...widgets, newWidget]);
  };

  const removeWidget = (id: string) => {
    setWidgets(widgets.filter(w => w.id !== id));
  };

  const renderWidget = (widget: Widget) => {
    const chartProps = {
      height: widget.size === 'small' ? 200 : widget.size === 'medium' ? 300 : 400,
      // Sample data - replace with real data
      xAxis: [{ data: [1, 2, 3, 4, 5] }],
      series: [{ data: [2, 5.5, 2, 8.5, 1.5] }]
    };

    return (
      <Card key={widget.id} sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <DragIndicatorIcon sx={{ mr: 1 }} />
          <TextField
            value={widget.title}
            onChange={(e) => {
              const updatedWidgets = widgets.map(w =>
                w.id === widget.id ? { ...w, title: e.target.value } : w
              );
              setWidgets(updatedWidgets);
            }}
            size="small"
            sx={{ flexGrow: 1 }}
          />
          <IconButton onClick={() => removeWidget(widget.id)} size="small">
            <DeleteIcon />
          </IconButton>
        </Box>
        {widget.type === 'line' && <LineChart {...chartProps} />}
        {widget.type === 'bar' && <BarChart {...chartProps} />}
        {widget.type === 'pie' && <PieChart
          series={[{
            data: [
              { id: 0, value: 10, label: 'Series A' },
              { id: 1, value: 15, label: 'Series B' },
              { id: 2, value: 20, label: 'Series C' },
            ],
          }]}
          height={chartProps.height}
        />}
      </Card>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <TextField
          value={dashboardTitle}
          onChange={(e) => setDashboardTitle(e.target.value)}
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Box sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => addWidget('line')}
            sx={{ mr: 1 }}
          >
            Add Line Chart
          </Button>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => addWidget('bar')}
            sx={{ mr: 1 }}
          >
            Add Bar Chart
          </Button>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => addWidget('pie')}
          >
            Add Pie Chart
          </Button>
        </Box>
      </Box>

      <Grid container spacing={2}>
        {widgets.map(widget => (
          <Grid key={widget.id} item xs={12} md={widget.size === 'small' ? 4 : widget.size === 'medium' ? 6 : 12}>
            {renderWidget(widget)}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};