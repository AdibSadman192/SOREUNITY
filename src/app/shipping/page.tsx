'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot
} from '@mui/lab';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AddIcon from '@mui/icons-material/Add';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';

interface ShipmentData {
  id: string;
  orderNumber: string;
  destination: string;
  status: 'pending' | 'in-transit' | 'delivered';
  estimatedDelivery: string;
  trackingEvents?: TrackingEvent[];
}

interface TrackingEvent {
  date: string;
  status: string;
  location: string;
  description: string;
}

const mockShipments: ShipmentData[] = [
  {
    id: '1',
    orderNumber: 'ORD-001',
    destination: 'New York, NY',
    status: 'in-transit',
    estimatedDelivery: '2024-02-20',
    trackingEvents: [
      {
        date: '2024-02-18 14:30',
        status: 'In Transit',
        location: 'Newark, NJ',
        description: 'Package in transit to destination'
      },
      {
        date: '2024-02-18 09:15',
        status: 'Picked Up',
        location: 'Philadelphia, PA',
        description: 'Package picked up by courier'
      }
    ]
  },
  {
    id: '2',
    orderNumber: 'ORD-002',
    destination: 'Los Angeles, CA',
    status: 'pending',
    estimatedDelivery: '2024-02-22'
  },
  {
    id: '3',
    orderNumber: 'ORD-003',
    destination: 'Chicago, IL',
    status: 'delivered',
    estimatedDelivery: '2024-02-18',
    trackingEvents: [
      {
        date: '2024-02-18 15:00',
        status: 'Delivered',
        location: 'Chicago, IL',
        description: 'Package delivered to recipient'
      },
      {
        date: '2024-02-18 08:30',
        status: 'Out for Delivery',
        location: 'Chicago, IL',
        description: 'Package out for delivery'
      }
    ]
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'in-transit':
      return 'info';
    case 'delivered':
      return 'success';
    default:
      return 'default';
  }
};

export default function ShippingDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [shipments, setShipments] = useState<ShipmentData[]>(mockShipments);
  const [selectedShipment, setSelectedShipment] = useState<ShipmentData | null>(null);
  const [trackingDialogOpen, setTrackingDialogOpen] = useState(false);

  const filteredShipments = shipments.filter(shipment =>
    shipment.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shipment.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTrackShipment = (shipment: ShipmentData) => {
    setSelectedShipment(shipment);
    setTrackingDialogOpen(true);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          <LocalShippingIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
          Shipping & Logistics
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Search and Filters */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Search Orders"
                  variant="outlined"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by order number or destination"
                />
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  sx={{ minWidth: '200px' }}
                >
                  New Shipment
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Shipments Table */}
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order Number</TableCell>
                  <TableCell>Destination</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Estimated Delivery</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredShipments.map((shipment) => (
                  <TableRow key={shipment.id}>
                    <TableCell>{shipment.orderNumber}</TableCell>
                    <TableCell>{shipment.destination}</TableCell>
                    <TableCell>
                      <Chip
                        label={shipment.status}
                        color={getStatusColor(shipment.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{shipment.estimatedDelivery}</TableCell>
                    <TableCell>
                      <Button
                        startIcon={<TrackChangesIcon />}
                        onClick={() => handleTrackShipment(shipment)}
                        size="small"
                      >
                        Track
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      {/* Tracking Dialog */}
      <Dialog
        open={trackingDialogOpen}
        onClose={() => setTrackingDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Tracking Details - {selectedShipment?.orderNumber}
        </DialogTitle>
        <DialogContent>
          {selectedShipment?.trackingEvents ? (
            <Timeline>
              {selectedShipment.trackingEvents.map((event, index) => (
                <TimelineItem key={index}>
                  <TimelineSeparator>
                    <TimelineDot color={index === 0 ? 'primary' : 'grey'} />
                    {index < selectedShipment.trackingEvents!.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="subtitle2">{event.date}</Typography>
                    <Typography variant="body1">{event.status}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {event.location} - {event.description}
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          ) : (
            <Typography>No tracking information available</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTrackingDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}