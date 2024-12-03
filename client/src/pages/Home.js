import React from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  Box,
  Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { backgroundImage } from '../assets/images';

const HeroSection = styled('div')(({ theme }) => ({
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '70vh',
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  marginTop: '-90px',
  paddingTop: '90px',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  }
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  }
}));

function Home() {
  const features = [
    {
      title: "Live Auctions",
      description: "Participate in real-time bidding on exclusive items",
      image: "https://source.unsplash.com/800x600/?auction",
      link: "/auctions"
    },
    {
      title: "Premium Items",
      description: "Discover high-value and rare collectibles",
      image: "https://source.unsplash.com/800x600/?luxury",
      link: "/auctions"
    },
    {
      title: "Secure Bidding",
      description: "Safe and transparent auction process",
      image: "https://source.unsplash.com/800x600/?security",
      link: "/about"
    }
  ];

  return (
    <>
      <HeroSection>
        <Container>
          <Box sx={{ 
            position: 'relative', 
            zIndex: 2, 
            color: 'white',
            textAlign: 'center'
          }}>
            <Typography variant="h2" component="h1" gutterBottom>
              Welcome to Auction Elite
            </Typography>
            <Typography variant="h5" gutterBottom>
              Discover Exclusive Auctions and Unique Items
            </Typography>
            <Button 
              variant="contained" 
              size="large" 
              component={Link} 
              to="/auctions"
              sx={{ mt: 4 }}
            >
              Explore Auctions
            </Button>
          </Box>
        </Container>
      </HeroSection>

      <Container sx={{ my: 8 }}>
        {/* Features Section */}
        <Typography variant="h3" align="center" gutterBottom>
          Why Choose Us
        </Typography>
        <Typography variant="h6" align="center" color="textSecondary" paragraph>
          Experience the finest online auction platform
        </Typography>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {features.map((feature, index) => (
            <Grid item key={index} xs={12} md={4}>
              <FeatureCard>
                <CardMedia
                  component="img"
                  height="200"
                  image={feature.image}
                  alt={feature.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    {feature.description}
                  </Typography>
                  <Button 
                    component={Link} 
                    to={feature.link} 
                    color="primary"
                  >
                    Learn More
                  </Button>
                </CardContent>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>

        {/* Call to Action Section */}
        <Paper 
          sx={{ 
            mt: 8, 
            py: 6, 
            px: 4, 
            textAlign: 'center',
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            color: 'white'
          }}
        >
          <Typography variant="h4" gutterBottom>
            Ready to Start Bidding?
          </Typography>
          <Typography variant="h6" paragraph>
            Join our community of auction enthusiasts and start bidding on exclusive items.
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            component={Link} 
            to="/register"
            sx={{ 
              mt: 2,
              backgroundColor: 'white',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'grey.100'
              }
            }}
          >
            Get Started
          </Button>
        </Paper>
      </Container>
    </>
  );
}

export default Home; 
