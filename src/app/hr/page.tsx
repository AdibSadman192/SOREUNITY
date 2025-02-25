'use client';

import { useState } from 'react';
import { Box, Tab, Paper, Typography, Container } from '@mui/material';
import { EmployeeManagement, AttendanceTracking, LeaveManagement } from './components';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import EmployeeDirectory from './components/EmployeeDirectory';

export default function HRDashboard() {
  const [value, setValue] = useState('employees');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        HR Management
      </Typography>

      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <TabList onChange={handleChange} aria-label="HR management tabs" variant="fullWidth">
            <Tab label="Employees" value="employees" />
            <Tab label="Attendance" value="attendance" />
            <Tab label="Leave Management" value="leave" />
            <Tab label="Performance" value="performance" />
          </TabList>
        </Box>

        <TabPanel value="employees">
          <EmployeeManagement />
        </TabPanel>

        <TabPanel value="attendance">
          <AttendanceTracking />
        </TabPanel>

        <TabPanel value="leave">
          <LeaveManagement />
        </TabPanel>

        <TabPanel value="performance">
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Performance Reviews
            </Typography>
            <Typography color="text.secondary">
              Performance review features coming soon...
            </Typography>
          </Paper>
        </TabPanel>
      </TabContext>
    </Container>
  );
}