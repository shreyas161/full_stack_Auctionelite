import React from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  TextField, 
  Button, 
  Box,
  Paper,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import { contactBackground } from '../assets/images';

const HeroSection = styled('div')(({ theme }) => ({
  backgroundImage: `url(${contactBackground})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '60vh',
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  marginTop: '-90px',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  }
}));

const ContactCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#f8f9fa',
  borderRadius: '10px',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[4],
  }
}));

const ContactInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  '& .MuiSvgIcon-root': {
    marginRight: theme.spacing(2),
    color: theme.palette.primary.main,
    fontSize: '2rem'
  }
}));

const SocialIcons = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginTop: theme.spacing(3),
  '& .MuiIconButton-root': {
    color: theme.palette.text.secondary,
    transition: 'all 0.3s ease',
    '&:hover': {
      color: theme.palette.primary.main,
      transform: 'translateY(-3px)'
    }
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiOutlinedInput-root': {
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <>
      <HeroSection>
        <Container>
          <Box sx={{ position: 'relative', zIndex: 2, color: 'white', textAlign: 'center' }}>
            <Typography variant="h2" component="h1" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="h6" sx={{ maxWidth: '600px', margin: '0 auto' }}>
              Have questions? We'd love to hear from you. Send us a message
              and we'll respond as soon as possible.
            </Typography>
          </Box>
        </Container>
      </HeroSection>

      <Container sx={{ my: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <ContactCard elevation={1}>
              <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
                Get In Touch
              </Typography>
              <ContactInfo>
                <LocationOnIcon />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Our Location
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    KLE BCA, PCJ Science College,
                    <br /> Hubballi, Karnataka
                  </Typography>
                </Box>
              </ContactInfo>
              <ContactInfo>
                <PhoneIcon />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Phone Number
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    +91 1235 2355 98
                    <br />
                    +91 1235 2355 99
                  </Typography>
                </Box>
              </ContactInfo>
              <ContactInfo>
                <EmailIcon />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Email Address
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    info@auctionelite.com
                    <br />
                    support@auctionelite.com
                  </Typography>
                </Box>
              </ContactInfo>
              <SocialIcons>
                <IconButton>
                  <FacebookIcon />
                </IconButton>
                <IconButton>
                  <TwitterIcon />
                </IconButton>
                <IconButton>
                  <InstagramIcon />
                </IconButton>
              </SocialIcons>
            </ContactCard>
          </Grid>

          <Grid item xs={12} md={8}>
            <ContactCard elevation={1}>
              <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
                Send us a Message
              </Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                      fullWidth
                      label="Your Name"
                      variant="outlined"
                      required
                      placeholder="John Doe"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <StyledTextField
                      fullWidth
                      label="Your Email"
                      variant="outlined"
                      required
                      type="email"
                      placeholder="john@example.com"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <StyledTextField
                      fullWidth
                      label="Subject"
                      variant="outlined"
                      required
                      placeholder="How can we help?"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <StyledTextField
                      fullWidth
                      label="Message"
                      variant="outlined"
                      required
                      multiline
                      rows={4}
                      placeholder="Write your message here..."
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      sx={{
                        py: 1.5,
                        px: 4,
                        fontSize: '1.1rem'
                      }}
                    >
                      Send Message
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </ContactCard>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default Contact; 