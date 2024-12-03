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

function Navbar() {
  const { currentUser, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          bgcolor: 'black',
          backgroundColor: 'black !important',
          minHeight: '48px',
        }}
      >
        <Container>
          <Toolbar 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              minHeight: '48px !important',
              py: 0.5
            }}
          >
            <Box 
              component={Link} 
              to="/"
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                textDecoration: 'none',
                flexGrow: 1
              }}
            >
              <img 
                src="/images/logo.png" 
                alt="Auction Elite Logo"
                style={{
                  height: '40px',
                  marginRight: '10px'
                }}
              />
            </Box>
            <Box>
              {currentUser ? (
                <>
                  {isAdmin && (
                    <Button 
                      sx={{ color: '#ffffff !important' }} 
                      component={StyledLink} 
                      to="/admin"
                    >
                      Admin Dashboard
                    </Button>
                  )}
                  <Button 
                    variant="outlined" 
                    sx={{ 
                      color: '#ffffff !important',
                      borderColor: '#ffffff',
                      ml: 2,
                      '&:hover': {
                        borderColor: '#ffffff',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                      }
                    }} 
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    sx={{ color: '#ffffff !important' }} 
                    component={StyledLink} 
                    to="/login"
                  >
                    Login
                  </Button>
                  <Button 
                    sx={{ color: '#ffffff !important' }} 
                    component={StyledLink} 
                    to="/register"
                  >
                    Register
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Toolbar 
        sx={{ 
          minHeight: '48px !important',
          height: '48px'
        }} 
      />
    </Box>
  );
}

export default Navbar; 