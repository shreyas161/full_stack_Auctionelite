import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Button, 
  Container,
  Box
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const StyledLink = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: '#ffffff !important',
  marginLeft: theme.spacing(2)
}));

const LogoImage = styled('img')({
  height: '40px',  // Adjust height as needed
  width: 'auto',
  marginRight: theme.spacing(1)
});

function Navbar() {
  const { currentUser, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ bgcolor: 'black', backgroundColor: 'black !important' }}>
        <Container>
          <Toolbar>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <img src="/images/auction.jpg" alt="Auction Logo" style={{ height: '40px', width: 'auto' }} />
            </Link>
            
            <Box sx={{ flexGrow: 1 }} />

            <Button 
              component={Link} 
              to="/contact"
              sx={{ color: '#ffffff !important', mr: 2 }}
            >
              Contact
            </Button>

            {currentUser ? (
              <>
                {isAdmin ? (
                  <Button 
                    sx={{ color: '#ffffff !important' }} 
                    component={Link} 
                    to="/admin-portal"
                  >
                    Admin Dashboard
                  </Button>
                ) : (
                  <>
                    <Button 
                      sx={{ color: '#ffffff !important' }} 
                      component={Link} 
                      to="/auctions"
                    >
                      Auctions
                    </Button>
                    <Button 
                      sx={{ color: '#ffffff !important' }} 
                      component={Link} 
                      to="/my-auctions"
                    >
                      My Auctions
                    </Button>
                  </>
                )}
                <Button 
                  variant="outlined"
                  onClick={handleLogout}
                  sx={{ 
                    color: '#ffffff !important',
                    borderColor: '#ffffff',
                    ml: 2
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button 
                  component={Link} 
                  to="/login"
                  sx={{ color: '#ffffff !important' }}
                >
                  Login
                </Button>
                <Button 
                  component={Link} 
                  to="/register"
                  sx={{ color: '#ffffff !important' }}
                >
                  Register
                </Button>
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <Toolbar />
    </Box>
  );
}

export default Navbar; 