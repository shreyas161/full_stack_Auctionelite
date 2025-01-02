import React from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button,
  Box 
} from '@mui/material';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';

function MyAuctions() {
  return (
    <>
      <HeroSection 
        title="My Auctions" 
        subtitle="Track your auction activities"
      />
      <Container sx={{ my: 8 }}>
        <Typography variant="h4" gutterBottom align="center">
          My Active Bids
        </Typography>
        <Grid container spacing={4}>
          {/* Add your auction items here */}
        </Grid>

        <Typography variant="h4" gutterBottom align="center" sx={{ mt: 8 }}>
          My Won Auctions
        </Typography>
        <Grid container spacing={4}>
          {/* Add won auction items here */}
        </Grid>
      </Container>
    </>
  );
}

export default MyAuctions; 