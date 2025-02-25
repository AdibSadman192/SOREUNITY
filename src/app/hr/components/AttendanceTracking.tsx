'use client';

import { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  timeIn: string;
  timeOut: string;
  status: string;
}

export default function AttendanceTracking() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [open, setOpen] = useState(false);
  const [currentDate] = useState(new Date().toISOString().split('T')[0]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const record = {
      id: Date.now().toString(),
      employeeId: formData.get('employeeId') as string,
      employeeName: formData.get('employeeName') as string,
      date: formData.get('date') as string,
      timeIn: formData.get('timeIn') as string,
      timeOut: formData.get('timeOut') as string,
      status: 'Present',
    };

    setRecords([...records, record]);
    handleClose();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Daily Attendance</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
        >
          Add Attendance
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time In</TableCell>
              <TableCell>Time Out</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.employeeId}</TableCell>
                <TableCell>{record.employeeName}</TableCell>
                <TableCell>{record.date}</TableCell>
                <TableCell>{record.timeIn}</TableCell>
                <TableCell>{record.timeOut}</TableCell>
                <TableCell>{record.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Add Attendance Record</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              name="employeeId"
              label="Employee ID"
              type="text"
              fullWidth
              required
            />
            <TextField
              margin="dense"
              name="employeeName"
              label="Employee Name"
              type="text"
              fullWidth
              required
            />
            <TextField
              margin="dense"
              name="date"
              label="Date"
              type="date"
              fullWidth
              required
              defaultValue={currentDate}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              margin="dense"
              name="timeIn"
              label="Time In"
              type="time"
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              margin="dense"
              name="timeOut"
              label="Time Out"
              type="time"
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Add</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}