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
import { ref, get } from 'firebase/database';
import { auth, rtdb } from '../config/firebase';
import ErrorIcon from '@mui/icons-material/Error';

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

const ErrorAlert = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  marginTop: theme.spacing(2),
  backgroundColor: theme.palette.error.light,
  color: theme.palette.error.contrastText,
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1)
}));

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminPasscode, setAdminPasscode] = useState('');
  const [error, setError] = useState('');
  const [userType, setUserType] = useState('user');
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setError('');

      if (userType === 'admin') {
        if (adminPasscode !== "AUCTION") {
          setError('Invalid admin passcode');
          return;
        }
      }

      await login(email, password);
      
      const userRef = ref(rtdb, `users/${auth.currentUser.uid}`);
      const snapshot = await get(userRef);
      const userData = snapshot.val();

      if (!userData) {
        await logout();
        throw new Error('User data not found');
      }

      if (userData.suspended) {
        await logout();
        throw new Error('Your account has been suspended. Please contact support.');
      }

      if (userData.role !== userType) {
        await logout();
        throw new Error(`Invalid login. Please login with correct credentials as ${userData.role}`);
      }

      if (userData.role === 'admin') {
        navigate('/admin-portal');
      } else {
        navigate('/auctions');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Failed to login. Please check your credentials.');
      
      try {
        await logout();
      } catch (logoutError) {
        console.error('Logout error:', logoutError);
      }
    }
  };

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
    setAdminPasscode('');
    setError('');
  };

  return (
    <>
      <HeroSection 
        title="Welcome Back" 
        subtitle="Login to your account"
      />
      <Container component="main" maxWidth="xs">
        <StyledPaper>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          {error && (
            <ErrorAlert>
              <ErrorIcon color="error" />
              <Typography variant="body2">
                {error}
              </Typography>
            </ErrorAlert>
          )}
          <form 
            onSubmit={handleSubmit} 
            autoComplete="off" 
            spellCheck="false"
          >
            <FormControl component="fieldset" sx={{ width: '100%', mb: 2, mt: 1 }}>
              <RadioGroup
                row
                value={userType}
                onChange={handleUserTypeChange}
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
              type="email"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!error && error.includes('email')}
              helperText={error && error.includes('email') ? error : ''}
              InputProps={{
                autoComplete: 'new-email',
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              name="password-field"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!error && error.includes('password')}
              helperText={error && error.includes('password') ? error : ''}
              InputProps={{
                autoComplete: 'new-password',
                form: {
                  autoComplete: 'off'
                }
              }}
            />

            {userType === 'admin' && (
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Admin Passcode"
                type="password"
                value={adminPasscode}
                onChange={(e) => setAdminPasscode(e.target.value)}
                helperText="Enter admin passcode to access admin portal"
                error={error === 'Invalid admin passcode'}
              />
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
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