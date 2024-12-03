import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledFooter = styled('footer')(({ theme }) => ({
  backgroundColor: '#000',
  color: '#fff',
  padding: theme.spacing(1),  // Reduced from typical 3 or 4 to 1
  marginTop: 'auto',
  minHeight: '40px',  // Reduced height
  display: 'flex',
  alignItems: 'center'
}));

function Footer() {
  return (
    <StyledFooter>
      <Container>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center',
          py: 0.5  // Reduced padding
        }}>
          <Typography variant="body2" align="center">
            © {new Date().getFullYear()} Auction Elite. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </StyledFooter>
  );
}

export default Footer; 