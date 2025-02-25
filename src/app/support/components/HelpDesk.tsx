'use client';

import { useState } from 'react';
import {
  Card,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  SelectChangeEvent,
  Box
} from '@mui/material';

type TicketStatus = 'open' | 'in-progress' | 'resolved';
type TicketPriority = 'low' | 'medium' | 'high';

interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: string;
  createdAt: string;
}

interface NewTicketForm {
  subject: string;
  description: string;
  category: string;
  priority: TicketPriority;
}

const initialFormState: NewTicketForm = {
  subject: '',
  description: '',
  category: '',
  priority: 'medium'
};

const demoTickets: Ticket[] = [
  {
    id: 'TICKET-001',
    subject: 'Cannot access inventory module',
    description: 'Getting an error when trying to access the inventory management section.',
    status: 'open',
    priority: 'high',
    category: 'Technical Issue',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'TICKET-002',
    subject: 'Need help with financial reports',
    description: 'Having trouble generating custom financial reports.',
    status: 'in-progress',
    priority: 'medium',
    category: 'Usage Help',
    createdAt: '2024-01-14T15:45:00Z'
  }
];

export default function HelpDesk() {
  const [tickets, setTickets] = useState<Ticket[]>(demoTickets);
  const [newTicket, setNewTicket] = useState<NewTicketForm>(initialFormState);

  const generateTicketId = (): string => {
    return `TICKET-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
  };

  const handleSubmitTicket = () => {
    const ticket: Ticket = {
      id: generateTicketId(),
      ...newTicket,
      status: 'open',
      createdAt: new Date().toISOString()
    };

    setTickets([ticket, ...tickets]);
    setNewTicket(initialFormState);
  };

  const getStatusColor = (status: TicketStatus): 'error' | 'warning' | 'success' | 'default' => {
    const statusColors = {
      'open': 'error',
      'in-progress': 'warning',
      'resolved': 'success'
    } as const;
    return statusColors[status] || 'default';
  };

  const getPriorityColor = (priority: TicketPriority): 'error' | 'warning' | 'success' | 'default' => {
    const priorityColors = {
      'high': 'error',
      'medium': 'warning',
      'low': 'success'
    } as const;
    return priorityColors[priority] || 'default';
  };

  const handlePriorityChange = (event: SelectChangeEvent<TicketPriority>) => {
    setNewTicket(prev => ({ ...prev, priority: event.target.value as TicketPriority }));
  };

  const handleInputChange = (field: keyof NewTicketForm) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewTicket(prev => ({ ...prev, [field]: event.target.value }));
  };

  const isFormValid = (): boolean => {
    return Boolean(
      newTicket.subject &&
      newTicket.description &&
      newTicket.category
    );
  };

  return (
    <Box className="space-y-6">
      <Card className="p-6">
        <Typography variant="h6" gutterBottom>
          Submit a New Ticket
        </Typography>
        <Box className="space-y-4">
          <TextField
            fullWidth
            label="Subject"
            value={newTicket.subject}
            onChange={handleInputChange('subject')}
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description"
            value={newTicket.description}
            onChange={handleInputChange('description')}
          />
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              fullWidth
              label="Category"
              value={newTicket.category}
              onChange={handleInputChange('category')}
            />
            <FormControl fullWidth>
              <InputLabel id="priority-label">Priority</InputLabel>
              <Select
                labelId="priority-label"
                value={newTicket.priority}
                label="Priority"
                onChange={handlePriorityChange}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Button
            variant="contained"
            onClick={handleSubmitTicket}
            disabled={!isFormValid()}
            fullWidth
          >
            Submit Ticket
          </Button>
        </Box>
      </Card>

      <Typography variant="h6" gutterBottom>
        Your Tickets
      </Typography>

      <Box className="space-y-4">
        {tickets.map((ticket) => (
          <Card key={ticket.id} className="p-4">
            <Box className="flex justify-between items-start mb-2">
              <Box>
                <Typography variant="h6">
                  {ticket.subject}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {ticket.id} - {new Date(ticket.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
              <Box className="flex gap-2">
                <Chip
                  label={ticket.status}
                  color={getStatusColor(ticket.status)}
                  size="small"
                />
                <Chip
                  label={ticket.priority}
                  color={getPriorityColor(ticket.priority)}
                  size="small"
                />
              </Box>
            </Box>
            <Typography variant="body2" gutterBottom>
              {ticket.description}
            </Typography>
            <Chip
              label={ticket.category}
              variant="outlined"
              size="small"
              className="mt-2"
            />
          </Card>
        ))}
      </Box>
    </Box>
  );
}
