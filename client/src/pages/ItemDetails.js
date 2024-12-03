import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  Chip,
  CircularProgress,
  Box,
  Divider,
  Avatar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth, rtdb } from '../config/firebase';
import { ref, onValue, update, off, push, set } from 'firebase/database';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow
} from '@mui/material';

const useStyles = styled((theme) => ({
  root: {
    marginTop: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(3),
  },
  image: {
    width: '100%',
    height: 'auto',
    maxHeight: 400,
    objectFit: 'cover',
  },
  bidSection: {
    marginTop: theme.spacing(3),
  },
  chip: {
    margin: theme.spacing(1),
  },
  timer: {
    marginTop: theme.spacing(2),
  }
}));

function ItemDetails() {
  const classes = useStyles();
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [item, setItem] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState('');
  const [loading, setLoading] = useState(true);
  const [bidHistory, setBidHistory] = useState([]);

  useEffect(() => {
    const itemRef = ref(rtdb, `items/${id}`);
    const bidHistoryRef = ref(rtdb, `bids/${id}`);
    
    const unsubscribeItem = onValue(itemRef, (snapshot) => {
      if (snapshot.exists()) {
        setItem({ id: snapshot.key, ...snapshot.val() });
        setLoading(false);
      } else {
        setError('Item not found');
        setLoading(false);
      }
    });

    const unsubscribeBids = onValue(bidHistoryRef, (snapshot) => {
      if (snapshot.exists()) {
        const bids = [];
        snapshot.forEach((childSnapshot) => {
          bids.push({
            id: childSnapshot.key,
            ...childSnapshot.val(),
            timestamp: new Date(childSnapshot.val().timestamp).toLocaleString()
          });
        });
        setBidHistory(bids.reverse());
      }
    });

    return () => {
      off(itemRef);
      off(bidHistoryRef);
    };
  }, [id]);

  useEffect(() => {
    if (item) {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const auctionTime = new Date(item.auctionDate).getTime();
        const distance = auctionTime - now;

        if (distance < 0) {
          clearInterval(timer);
          setTimeLeft('Auction ended');
        } else {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          setTimeLeft(`${days}d ${hours}h ${minutes}m`);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [item]);

  const handleBid = async (e) => {
    e.preventDefault();
    try {
      const itemRef = ref(rtdb, `items/${id}`);
      const bidHistoryRef = ref(rtdb, `bids/${id}`);
      const newBid = parseFloat(bidAmount);

      if (newBid <= item.currentPrice) {
        setError('Bid must be higher than current price');
        return;
      }

      await update(itemRef, {
        currentPrice: newBid,
        registeredBidders: [...(item.registeredBidders || []), currentUser.uid],
        lastBidder: currentUser.uid
      });

      const newBidRef = push(bidHistoryRef);
      await set(newBidRef, {
        amount: newBid,
        bidder: currentUser.uid,
        bidderEmail: currentUser.email,
        timestamp: new Date().toISOString()
      });

      setBidAmount('');
      setError('');
    } catch (error) {
      setError('Failed to place bid');
    }
  };

  if (loading) return <CircularProgress />;
  if (!item) return <Typography>Item not found</Typography>;

  return (
    <Container className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <img 
              src={item.image || item.images?.[0]} 
              alt={item.title} 
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom>
              {item.title}
            </Typography>
            <Typography variant="body1" paragraph>
              {item.description}
            </Typography>

            <Box sx={{ my: 3 }}>
              <Typography variant="h6" gutterBottom>
                Auction Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography color="textSecondary">Starting Price</Typography>
                  <Typography variant="h6">₹{item.startingPrice?.toLocaleString('en-IN')}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="textSecondary">Current Bid</Typography>
                  <Typography variant="h6" color="primary">
                    ₹{item.currentPrice?.toLocaleString('en-IN') || item.startingPrice?.toLocaleString('en-IN')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="textSecondary">Location</Typography>
                  <Typography>{item.location}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="textSecondary">Seller</Typography>
                  <Typography>{item.seller}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="textSecondary">Condition</Typography>
                  <Typography>{item.condition}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="textSecondary">Auction Duration</Typography>
                  <Typography>{item.auctionDuration}</Typography>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ my: 3 }}>
              <Typography variant="h6" gutterBottom>
                Time Remaining
              </Typography>
              <Chip
                icon={<AccessTimeIcon />}
                label={timeLeft}
                color="primary"
                sx={{ fontSize: '1.1rem', py: 2 }}
              />
            </Box>

            {item.status === 'live' && (
              <Box sx={{ mt: 4 }}>
                <TextField
                  fullWidth
                  label="Your Bid (₹)"
                  variant="outlined"
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  InputProps={{
                    startAdornment: <Typography>₹</Typography>,
                    inputProps: { 
                      min: (item.currentPrice || item.startingPrice) + 1,
                      step: 100 // Minimum bid increment
                    }
                  }}
                  helperText={`Minimum bid: ₹${((item.currentPrice || item.startingPrice) + 100).toLocaleString('en-IN')}`}
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  onClick={handleBid}
                  disabled={!bidAmount || parseFloat(bidAmount) <= item.currentPrice}
                >
                  Place Bid
                </Button>
              </Box>
            )}

            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Bid History
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Bidder</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bidHistory.map((bid) => (
                  <TableRow key={bid.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2 }}>
                          <PersonIcon />
                        </Avatar>
                        {bid.bidderEmail}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      ₹{bid.amount.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell align="right">{bid.timestamp}</TableCell>
                  </TableRow>
                ))}
                {bidHistory.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No bids yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Additional Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Auction Details
                </Typography>
                <Typography variant="body1" paragraph>
                  • Started: {new Date(item.createdAt).toLocaleString()}
                </Typography>
                <Typography variant="body1" paragraph>
                  • Duration: {item.auctionDuration}
                </Typography>
                <Typography variant="body1">
                  • Location: {item.location}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Item Information
                </Typography>
                <Typography variant="body1" paragraph>
                  • Condition: {item.condition}
                </Typography>
                <Typography variant="body1" paragraph>
                  • Seller: {item.seller}
                </Typography>
                <Typography variant="body1">
                  • Category: {item.category}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="body2" color="textSecondary">
            By placing a bid, you agree to our terms and conditions. All bids are final and binding.
            The highest bid at the end of the auction will be declared the winner.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default ItemDetails; 
