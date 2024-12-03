import React from 'react';
import { Container, Grid, Typography, Link, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

const FooterWrapper = styled('footer')(({ theme }) => ({
  backgroundColor: '#333',
  color: 'white',
  padding: theme.spacing(6, 0),
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 1
  }
}));

const ContentWrapper = styled(Box)({
  position: 'relative',
  zIndex: 2
});

const SocialIcon = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  marginRight: theme.spacing(2),
  cursor: 'pointer',
  '&:hover': {
    color: theme.palette.primary.main
  }
}));

function Footer() {
  return (
    <FooterWrapper>
      <ContentWrapper>
        <Container>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                About Us
              </Typography>
              <Typography paragraph>
                At Auction Elite, our mission is to provide an easy-to-use platform 
                that brings the excitement of live auctions right to your fingertips. 
                Whether you're a seasoned bidder or new to the world of auctions, 
                we offer a wide range of categories that cater to all interests and budgets.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <SocialIcon>
                  <TwitterIcon />
                </SocialIcon>
                <SocialIcon>
                  <FacebookIcon />
                </SocialIcon>
                <SocialIcon>
                  <InstagramIcon />
                </SocialIcon>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Site Links
              </Typography>
              <Box component="nav">
                <Link href="/" color="inherit" display="block" sx={{ mb: 1 }}>
                  Home
                </Link>
                <Link href="/about" color="inherit" display="block" sx={{ mb: 1 }}>
                  About
                </Link>
                <Link href="/auctions" color="inherit" display="block" sx={{ mb: 1 }}>
                  Auctions
                </Link>
                <Link href="/contact" color="inherit" display="block" sx={{ mb: 1 }}>
                  Contact
                </Link>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Have Questions?
              </Typography>
              <Box>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <LocationOnIcon sx={{ mr: 2 }} />
                  <Typography>
                    203 Fake St. Mountain View, San Francisco, California, USA
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <PhoneIcon sx={{ mr: 2 }} />
                  <Typography>
                    +2 392 3929 210
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <EmailIcon sx={{ mr: 2 }} />
                  <Typography>
                    info@auctionelite.com
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </ContentWrapper>
    </FooterWrapper>
  );
}

export default Footer; 