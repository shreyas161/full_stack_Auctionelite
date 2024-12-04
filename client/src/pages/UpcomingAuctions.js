import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { rtdb } from '../config/firebase';
import { ref, get, query, orderByChild } from 'firebase/database';
import { formatPrice } from '../utils/formatPrice';
import HeroSection from '../components/HeroSection';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { populateUpcomingAuctions } from '../utils/populateDatabase';
import { useAuth } from '../context/AuthContext';
import { notificationService } from '../utils/notificationService';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[4],
  }
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  '& .MuiTableCell-head': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontWeight: 'bold'
  }
}));

const demoAuctions = [
  {
    title: "Vintage Luxury Watch",
    description: "Rare vintage luxury watch in pristine condition",
    startingPrice: "₹50,000",
    date: "April 15, 2024",
    image: "https://source.unsplash.com/800x600/?luxury,watch",
    category: "Jewelry",
    status: "Upcoming"
  },
  {
    title: "Classic Ferrari",
    description: "1965 Ferrari in excellent condition",
    startingPrice: "₹2,500,000",
    date: "April 20, 2024",
    image: "https://source.unsplash.com/800x600/?classic,ferrari",
    category: "Vehicles",
    status: "Upcoming"
  },
  {
    title: "Modern Art Collection",
    description: "Contemporary art from emerging artists",
    startingPrice: "₹75,000",
    date: "April 25, 2024",
    image: "https://source.unsplash.com/800x600/?modern,art",
    category: "Art",
    status: "Upcoming"
  }
];

function UpcomingAuctions() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifiedItem, setNotifiedItem] = useState(null);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const [subscriptionStatus, setSubscriptionStatus] = useState({});

  useEffect(() => {
    fetchUpcomingItems();
  }, []);

  const fetchUpcomingItems = async () => {
    try {
      const itemsRef = ref(rtdb, 'items');
      const itemsQuery = query(itemsRef, orderByChild('status'));
      const snapshot = await get(itemsQuery);
      const itemsList = [];
      
      snapshot.forEach((child) => {
        const item = child.val();
        if (item.status === 'upcoming') {
          itemsList.push({ id: child.key, ...item });
        }
      });
      
      if (itemsList.length === 0) {
        await populateUpcomingAuctions();
        const newSnapshot = await get(itemsQuery);
        newSnapshot.forEach((child) => {
          const item = child.val();
          if (item.status === 'upcoming') {
            itemsList.push({ id: child.key, ...item });
          }
        });
      }
      
      setItems(itemsList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching upcoming items:', error);
      setLoading(false);
    }
  };

  const handleNotify = async (item) => {
    if (!currentUser) {
      setError('Please login to subscribe to notifications');
      return;
    }

    try {
      const success = await notificationService.subscribeToAuction(
        currentUser.uid,
        item.id,
        item
      );

      if (success) {
        setNotifiedItem(item);
        setNotificationOpen(true);
        setSubscriptionStatus(prev => ({
          ...prev,
          [item.id]: true
        }));
      }
    } catch (error) {
      console.error('Error subscribing to notification:', error);
      setError('Failed to subscribe to notifications');
    }
  };

  const handleCloseNotification = () => {
    setNotificationOpen(false);
  };

  // Add notification checking on component mount
  useEffect(() => {
    const checkForNotifications = async () => {
      if (currentUser) {
        const notifications = await notificationService.checkNotifications(currentUser.uid);
        notifications.forEach(notification => {
          // Show notification to user
          new Notification(`Auction Starting Soon: ${notification.auctionTitle}`, {
            body: 'The auction will begin in less than an hour!'
          });
          // Mark notification as sent
          notificationService.markNotificationAsSent(currentUser.uid, notification.id);
        });
      }
    };

    // Check for notifications every minute
    const interval = setInterval(checkForNotifications, 60000);

    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => clearInterval(interval);
  }, [currentUser]);

  return (
    <>
      <HeroSection 
        title="Upcoming Auctions" 
        subtitle="Be the first to bid on these exciting items"
      />

      <Container sx={{ my: 8 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
          Future Auctions
        </Typography>

        {/* Grid view */}
        <Grid container spacing={4}>
          {items.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <StyledCard>
                <CardMedia
                  component="img"
                  height="200"
                  image={item.images?.[0] || '/images/auction-placeholder.jpg'}
                  alt={item.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography color="textSecondary" paragraph>
                    Starting Price: {formatPrice(item.startingPrice)}
                  </Typography>
                  <Typography color="textSecondary" paragraph>
                    Starts: {new Date(item.auctionDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    {item.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      component={Link}
                      to={`/item/${item.id}`}
                      sx={{ flex: 1 }}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleNotify(item)}
                      startIcon={<NotificationsActiveIcon />}
                      disabled={subscriptionStatus[item.id]}
                    >
                      {subscriptionStatus[item.id] ? 'Notification Set' : 'Notify Me'}
                    </Button>
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>

        {/* Table view */}
        <Typography variant="h5" gutterBottom sx={{ mt: 8, mb: 3 }}>
          Upcoming Auctions Schedule
        </Typography>
        
        <StyledTableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Starting Price</TableCell>
                <TableCell>Auction Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {demoAuctions.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.startingPrice}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <IconButton 
                        component={Link} 
                        to={`/item/${index}`}
                        color="primary"
                        size="small"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        size="small"
                        onClick={() => handleNotify(item)}
                      >
                        <NotificationsActiveIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </Container>

      <Snackbar
        open={notificationOpen}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert onClose={handleCloseNotification} severity="success">
          You will be notified when {notifiedItem?.title} becomes available for bidding!
        </Alert>
      </Snackbar>
    </>
  );
}

export default UpcomingAuctions; 