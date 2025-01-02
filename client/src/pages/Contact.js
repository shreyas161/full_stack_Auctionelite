import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper,
  Grid,
  TextField,
  Button
} from '@mui/material';
import HeroSection from '../components/HeroSection';

function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your contact form submission logic here
  };

  return (
    <>
      <HeroSection 
        title="Contact Us" 
        subtitle="Get in touch with our team"
      />
      <Container sx={{ my: 8 }}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom>
              Get In Touch
            </Typography>
            <Typography paragraph>
              Have questions about our auctions? Need help with your account? 
              We're here to help! Fill out the form and we'll get back to you as soon as possible.
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
              <TextField
                fullWidth
                label="Name"
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Message"
                multiline
                rows={4}
                margin="normal"
                required
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                sx={{ mt: 3 }}
              >
                Send Message
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, height: '100%' }}>
              <Typography variant="h5" gutterBottom>
                Contact Information
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6">Address</Typography>
                <Typography color="text.secondary">
                  123 Auction Street<br />
                  Mumbai, Maharashtra<br />
                  India
                </Typography>
              </Box>
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6">Email</Typography>
                <Typography color="text.secondary">
                  support@auctionelite.com
                </Typography>
              </Box>
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6">Phone</Typography>
                <Typography color="text.secondary">
                  +91 123 456 7890
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default Contact; 