import React from 'react';
import HeroSection from '../components/HeroSection';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(8),
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
}));

function AdminPortal() {
  return (
    <>
      <HeroSection 
        title="Admin Dashboard" 
        subtitle="Manage your auction platform"
      />
      <Container>
        <StyledPaper>
          <Typography variant="h4" component="h1" gutterBottom>
            Admin Portal
          </Typography>
          <Box sx={{ mt: 4, width: '100%' }}>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6} md={4}>
                <StyledCard>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Manage Users
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      View and manage user accounts, permissions, and activities.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary">
                      View Users
                    </Button>
                  </CardActions>
                </StyledCard>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <StyledCard>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Manage Auctions
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Monitor and manage all auction listings and bidding activities.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary">
                      View Auctions
                    </Button>
                  </CardActions>
                </StyledCard>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <StyledCard>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      System Analytics
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      View system statistics, user engagement, and auction metrics.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary">
                      View Analytics
                    </Button>
                  </CardActions>
                </StyledCard>
              </Grid>
            </Grid>
          </Box>
        </StyledPaper>
      </Container>
    </>
  );
}

export default AdminPortal; 