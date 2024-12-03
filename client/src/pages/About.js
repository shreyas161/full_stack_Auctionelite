import React from 'react';
import { Container, Typography, Grid, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
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

const AboutImage = styled('div')({
  backgroundImage: 'url(https://source.unsplash.com/random/800x600/?auction)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '70vh',
  width: '100%',
  borderRadius: '8px'
});

function About() {
  return (
    <>
      <HeroSection>
        <Container>
          <Box sx={{ 
            position: 'relative', 
            zIndex: 2, 
            color: 'white',
            mt: 4
          }}>
            <Typography variant="h2" component="h1" gutterBottom>
              About Us
            </Typography>
            <Typography variant="h6">
              Learn more about Auction Elite
            </Typography>
          </Box>
        </Container>
      </HeroSection>

      <Container sx={{ my: 8 }}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <AboutImage />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom>
              Welcome to Auction Elite
            </Typography>
            <Typography paragraph>
              Welcome to Auction Elite, the ultimate destination for discovering and 
              winning unique items through exciting online auctions. Our platform brings 
              together a diverse range of products, from everyday essentials to rare 
              collectibles, antiques, luxury goods, and even real estate—all at 
              unbeatable prices.
            </Typography>
            <Typography paragraph>
              At Auction Elite, we believe in making the auction experience simple, 
              secure, and enjoyable for everyone. Whether you're a seasoned bidder or 
              new to the world of auctions, our user-friendly platform offers real-time 
              bidding, automated features, and transparent transactions to ensure a 
              smooth experience.
            </Typography>
            <Typography>
              Our mission is to provide a trustworthy and dynamic marketplace where 
              buyers can find exclusive deals, and sellers can connect with a wide 
              audience. Join us today and discover the thrill of bidding, winning, 
              and owning something extraordinary!
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default About; 