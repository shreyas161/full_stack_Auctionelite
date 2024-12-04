import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Box, CssBaseline } from '@mui/material';
import theme from './theme';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import ItemDetails from './pages/ItemDetails';
import Auctions from './pages/Auctions';
import Contact from './pages/Contact';
import PrivateRoute from './components/PrivateRoute';
import PrivateAuctions from './pages/PrivateAuctions';
import AdminPortal from './pages/AdminPortal';
import UpcomingAuctions from './pages/UpcomingAuctions';

// Create a separate component for routes
const AppRoutes = () => {
  const { currentUser } = useAuth();
  
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/auctions" element={
        <PrivateRoute>
          <Auctions />
        </PrivateRoute>
      } />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/upcoming-auctions" element={
        <PrivateRoute>
          <UpcomingAuctions />
        </PrivateRoute>
      } />

      {/* Protected routes */}
      <Route path="/home" element={
        <Navigate to="/" replace />
      } />
      <Route path="/auctions/live" element={
        <PrivateRoute>
          <PrivateAuctions />
        </PrivateRoute>
      } />
      <Route path="/item/:id" element={
        <PrivateRoute>
          <ItemDetails />
        </PrivateRoute>
      } />
      <Route path="/admin-portal" element={
        <PrivateRoute>
          <Box sx={{ mt: '-48px' }}>
            <AdminPortal />
          </Box>
        </PrivateRoute>
      } />
      
      {/* Redirect unknown routes */}
      <Route path="*" element={
        <Navigate to={currentUser ? "/home" : "/"} replace />
      } />
    </Routes>
  );
};

// Create a separate component for the app content
const AppContent = () => {
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin-portal';

  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {!isAdminPage && <Navbar />}
      <Box component="main" sx={{ 
        flexGrow: 1,
        pt: isAdminPage ? 0 : { xs: '48px', sm: '48px' }
      }}>
        <AppRoutes />
      </Box>
      <Footer />
    </Box>
  );
};

// Main App component
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 