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
  TextField,
  MenuItem,
  CircularProgress,
  Divider,
  Paper,
  Skeleton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { auth, rtdb } from '../config/firebase';
import { ref, get, query, orderByChild } from 'firebase/database';
import { backgroundImage } from '../assets/images';
import GavelIcon from '@mui/icons-material/Gavel';
import PeopleIcon from '@mui/icons-material/People';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { formatPrice } from '../utils/formatPrice';
import { auctionItems } from '../data/auctionItems';
import HeroSection from '../components/HeroSection';

const FilterSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1]
}));

const StatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[4],
  },
  '& .MuiSvgIcon-root': {
    fontSize: '2.5rem',
    marginBottom: theme.spacing(2),
    color: theme.palette.primary.main,
  }
}));

const HistoryCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  transition: 'transform 0.2s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateX(10px)',
    boxShadow: theme.shadows[3],
  }
}));

const ImageWithFallback = ({ src, alt, height }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <>
      {loading && <Skeleton variant="rectangular" height={height} animation="wave" />}
      <img
        src={error ? `https://source.unsplash.com/400x300/?${alt.toLowerCase()}` : src}
        alt={alt}
        style={{ 
          display: loading ? 'none' : 'block',
          width: '100%',
          height: height,
          objectFit: 'cover'
        }}
        onLoad={() => setLoading(false)}
        onError={(e) => {
          setError(true);
          setLoading(false);
        }}
      />
    </>
  );
};

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1]
}));

function Auctions() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: 'all',
    status: 'all'
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const itemsRef = ref(rtdb, 'items');
      const itemsQuery = query(itemsRef, orderByChild('createdAt'));
      const snapshot = await get(itemsQuery);
      const itemsList = [];
      snapshot.forEach((child) => {
        itemsList.push({ id: child.key, ...child.val() });
      });
      setItems(itemsList.reverse());
      setLoading(false);
    } catch (error) {
      console.error('Error fetching items:', error);
      setLoading(false);
    }
  };

  const handleFilterChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value
    });
  };

  const filteredItems = items.filter(item => {
    if (filters.category !== 'all' && item.category !== filters.category) return false;
    if (filters.status !== 'all') {
      switch (filters.status) {
        case 'live':
          if (item.status !== 'live') return false;
          break;
        case 'upcoming':
          if (item.status !== 'upcoming') return false;
          break;
        case 'completed':
          if (item.status !== 'completed') return false;
          break;
        default:
          break;
      }
    }
    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number);
      if (item.currentPrice < min || item.currentPrice > max) return false;
    }
    return true;
  });

  // Dummy data for statistics
  const stats = [
    {
      icon: <GavelIcon />,
      value: "1,234+",
      label: "Successful Auctions"
    },
    {
      icon: <PeopleIcon />,
      value: "50,000+",
      label: "Active Bidders"
    },
    {
      icon: <LocalAtmIcon />,
      value: "₹10 Crore+",
      label: "Total Sales"
    },
    {
      icon: <EmojiEventsIcon />,
      value: "98%",
      label: "Satisfaction Rate"
    }
  ];

  // Dummy data for auction history
  const auctionHistory = [
    {
      id: 1,
      title: "Vintage Rolex Watch",
      finalPrice: "₹1,25,000",
      winner: "John D.",
      date: "2023-11-25",
      bidders: 45
    },
    {
      id: 2,
      title: "Beachfront Villa",
      finalPrice: "₹2.5 Crore",
      winner: "Sarah M.",
      date: "2023-11-20",
      bidders: 32
    },
    {
      id: 3,
      title: "Classic Ferrari",
      finalPrice: "₹8,75,000",
      winner: "Michael R.",
      date: "2023-11-15",
      bidders: 67
    }
  ];

  const renderHistoryCard = (auction) => (
    <HistoryCard key={auction.id} elevation={1}>
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={12} sm={4}>
          <Typography variant="h6">{auction.title}</Typography>
          <Typography variant="body2" color="textSecondary">
            {auction.date}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Typography variant="subtitle1" color="primary">
            Final Price: {auction.finalPrice}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Typography variant="body1">
            Winner: {auction.winner}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {auction.bidders} bidders
          </Typography>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button
            variant="outlined"
            color="primary"
            component={Link}
            to={`/item/${auction.id}`}
            fullWidth
          >
            View Details
          </Button>
        </Grid>
      </Grid>
    </HistoryCard>
  );

  return (
    <>
      <HeroSection 
        title="Live Auctions" 
        subtitle="Discover and bid on unique items from around the world"
      />

      <Container sx={{ my: 8 }}>
        {/* Statistics Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" gutterBottom align="center" sx={{ mb: 4 }}>
            Our Track Record
          </Typography>
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <StatCard elevation={2}>
                  {stat.icon}
                  <Typography variant="h4" component="div" color="primary" gutterBottom>
                    {stat.value}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    {stat.label}
                  </Typography>
                </StatCard>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Recent History Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" gutterBottom>
            Recent Auction History
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 4 }}>
            Notable sales from our recent auctions
          </Typography>
          {auctionHistory.map((auction) => renderHistoryCard(auction))}
        </Box>


        {/* Current Auctions Grid */}
        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={4}>
            {filteredItems.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={item.images?.[0] || auctionItems[item.category] || auctionItems.art}
                    alt={item.title}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      Starting Price: {formatPrice(item.startingPrice)}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      Current Price: {formatPrice(item.currentPrice || item.startingPrice)}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      Status: {item.status}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      Ends: {new Date(item.auctionDate).toLocaleDateString()}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      component={Link}
                      to={`/item/${item.id}`}
                      sx={{ mt: 2 }}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Auction Categories Section */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Auction Categories
          </Typography>
          <Grid container spacing={3}>
            {/* Live Auction Card */}
            <Grid item xs={12} sm={4}>
              <Card sx={{ height: '100%' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image="/images/auction-hammer.jpg"
                  alt="Live Auction"
                  sx={{
                    objectFit: 'cover',
                    objectPosition: 'center'
                  }}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Current Live Auction
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Ends in: 2h 15m
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => navigate('/auctions/live')}
                  >
                    Join Live Auction
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Upcoming Auctions Card */}
            <Grid item xs={12} sm={4}>
              <Card 
                sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)'
                  }
                }}
                onClick={() => navigate('/upcoming-auctions')}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image="/images/upcoming-auction.jpg"
                  alt="Upcoming Auctions"
                  sx={{
                    objectFit: 'cover',
                    objectPosition: 'center'
                  }}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Upcoming Auctions
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    See what's coming soon
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    View Schedule
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Past Auctions Card */}
            <Grid item xs={12} sm={4}>
              <Card sx={{ height: '100%' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image="/images/past-auction.jpg"
                  alt="Past Auctions"
                  sx={{
                    objectFit: 'cover',
                    objectPosition: 'center'
                  }}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Past Auctions
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    View completed auctions and results
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => navigate('/auctions/past')}
                  >
                    View History
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
}

export default Auctions; 