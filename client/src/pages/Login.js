import React, { useState } from 'react';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import HeroSection from '../components/HeroSection';

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(-16),
  position: 'relative',
  zIndex: 3,
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
}));

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [userType, setUserType] = useState('user');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await login(email, password);
      
      if (userType === 'admin') {
        navigate('/admin-portal');
      } else {
        navigate('/home');
      }
    } catch (error) {
      setError('Failed to login. Please check your credentials.');
    }
  };

  return (
    <>
      <HeroSection 
        title="Welcome Back" 
        subtitle="Login to your account to start bidding"
      />
      <Container component="main" maxWidth="xs">
        <StyledPaper>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
          <form onSubmit={handleSubmit}>
            <FormControl component="fieldset" sx={{ width: '100%', mb: 2, mt: 1 }}>
              <RadioGroup
                row
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                sx={{ justifyContent: 'center' }}
              >
                <FormControlLabel 
                  value="user" 
                  control={<Radio />} 
                  label="User" 
                />
                <FormControlLabel 
                  value="admin" 
                  control={<Radio />} 
                  label="Admin" 
                />
              </RadioGroup>
            </FormControl>

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Email Address"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
            >
              Sign In
            </Button>
          </form>
          <Link to="/register" style={{ marginTop: '20px', textDecoration: 'none' }}>
            Don't have an account? Sign Up
          </Link>
        </StyledPaper>
      </Container>
    </>
  );
}

export default Login; 