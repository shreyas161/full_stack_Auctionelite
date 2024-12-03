import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { backgroundImage } from '../assets/images';

const HeroWrapper = styled('div')(({ theme }) => ({
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '60vh',
  display: 'flex',
  alignItems: 'flex-start',
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

function HeroSection({ title, subtitle }) {
  return (
    <HeroWrapper>
      <Container>
        <Box sx={{ 
          position: 'relative', 
          zIndex: 2, 
          color: 'white', 
          textAlign: 'center',
          mt: 8
        }}>
          <Typography variant="h2" component="h1" gutterBottom>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="h6">
              {subtitle}
            </Typography>
          )}
        </Box>
      </Container>
    </HeroWrapper>
  );
}

export default HeroSection; 