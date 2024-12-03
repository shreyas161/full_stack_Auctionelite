import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container,
  Box,
  Dialog,
  DialogTitle,
  DialogActions,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const StyledAppBar = styled(AppBar)(({ theme, scrolled }) => ({
  backgroundColor: scrolled ? 'rgba(0, 0, 0, 0.9)' : 'transparent',
  transition: 'all 0.3s ease-in-out',
  boxShadow: scrolled ? '0 0 10px rgba(0,0,0,0.1)' : 'none',
}));

const NavLink = styled(Link)(({ theme }) => ({
  color: '#fff',
  textDecoration: 'none',
  padding: '10px 15px',
  fontSize: '16px',
  fontWeight: 400,
  transition: 'color 0.3s ease',
  '&:hover': {
    color: theme.palette.primary.main,
  }
}));

const BrandLogo = styled(Typography)(({ theme }) => ({
  color: '#fff',
  textDecoration: 'none',
  fontSize: '24px',
  fontWeight: 'bold',
  '&:hover': {
    color: theme.palette.primary.main,
  }
}));

function Navbar() {
  const { currentUser, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoutClick = () => {
    setOpenLogoutDialog(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      await logout();
      setOpenLogoutDialog(false);
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleLogoutCancel = () => {
    setOpenLogoutDialog(false);
  };

  return (
    <>
      <StyledAppBar position="fixed" scrolled={scrolled ? 1 : 0}>
        <Container>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
                Auction House
              </Link>
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <NavLink to="/auctions">Auctions</NavLink>
              <NavLink to="/about">About</NavLink>
              <NavLink to="/contact">Contact</NavLink>
              {currentUser ? (
                <>
                  <NavLink to="/home">Home</NavLink>
                  <Button color="inherit" onClick={handleLogoutClick}>Logout</Button>
                </>
              ) : (
                <>
                  <NavLink to="/login">Login</NavLink>
                  <NavLink to="/register">Register</NavLink>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </StyledAppBar>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={openLogoutDialog}
        onClose={handleLogoutCancel}
      >
        <DialogTitle>
          Are you sure you want to logout?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleLogoutCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogoutConfirm} color="primary" variant="contained">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Navbar; 