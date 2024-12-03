import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Tabs, 
  Tab, 
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
  Chip 
} from '@mui/material';
import { ref, onValue } from 'firebase/database';
import { rtdb } from '../config/firebase';
import { Link } from 'react-router-dom';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import { formatPrice } from '../utils/formatPrice';

function PrivateAuctions() {
  const [value, setValue] = useState(0);
  const [auctions, setAuctions] = useState({
    live: [],
    upcoming: [],
    past: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auctionsRef = ref(rtdb, 'items');
    const unsubscribe = onValue(auctionsRef, (snapshot) => {
      const items = [];
      snapshot.forEach((child) => {
        items.push({ id: child.key, ...child.val() });
      });
      
      // Categorize auctions
      const now = new Date().getTime();
      const categorizedAuctions = items.reduce((acc, auction) => {
        const auctionTime = new Date(auction.auctionDate).getTime();
        const endTime = auctionTime + (2 * 60 * 60 * 1000); // 2 hours duration

        if (now < auctionTime) {
          acc.upcoming.push(auction);
        } else if (now >= auctionTime && now <= endTime) {
          acc.live.push(auction);
        } else {
          acc.past.push(auction);
        }
        return acc;
      }, { live: [], upcoming: [], past: [] });

      setAuctions(categorizedAuctions);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const renderAuctionCard = (auction) => (
    <Grid item xs={12} sm={6} md={4} key={auction.id}>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardMedia
          component="img"
          height="200"
          image={auction.images?.[0] || '/assets/images/default-auction.jpg'}
          alt={auction.title}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" gutterBottom>
            {auction.title}
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            Starting Price: {formatPrice(auction.startingPrice)}
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            Current Price: {formatPrice(auction.currentPrice || auction.startingPrice)}
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Chip
              icon={value === 0 ? <LiveTvIcon /> : <AccessTimeIcon />}
              label={value === 0 ? 'LIVE NOW' : new Date(auction.auctionDate).toLocaleDateString()}
              color={value === 0 ? 'error' : 'default'}
            />
          </Box>
          <Button
            component={Link}
            to={`/item/${auction.id}`}
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            {value === 0 ? 'Join Auction' : 'View Details'}
          </Button>
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <Container sx={{ mt: 12, mb: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Auction Dashboard
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label={`Live Auctions (${auctions.live.length})`} />
          <Tab label={`Upcoming Auctions (${auctions.upcoming.length})`} />
          <Tab label={`Past Auctions (${auctions.past.length})`} />
        </Tabs>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          {value === 0 && (
            <Grid container spacing={3}>
              {auctions.live.map(renderAuctionCard)}
            </Grid>
          )}
          {value === 1 && (
            <Grid container spacing={3}>
              {auctions.upcoming.map(renderAuctionCard)}
            </Grid>
          )}
          {value === 2 && (
            <Grid container spacing={3}>
              {auctions.past.map(renderAuctionCard)}
            </Grid>
          )}
        </Box>
      )}
    </Container>
  );
}

export default PrivateAuctions; 