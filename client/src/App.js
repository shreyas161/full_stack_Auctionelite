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
import MyAuctions from './pages/MyAuctions';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoutes from './pages/AdminRoutes';

// Create a separate component for routes
const AppRoutes = () => {
  const { currentUser, isAdmin } = useAuth();
  
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/contact" element={<Contact />} />

      {/* User routes */}
      <Route path="/auctions" element={
        <PrivateRoute requireAdmin={false}>
          <Auctions />
        </PrivateRoute>
      } />
      <Route path="/my-auctions" element={
        <PrivateRoute requireAdmin={false}>
          <MyAuctions />
        </PrivateRoute>
      } />
      <Route path="/upcoming-auctions" element={
        <PrivateRoute requireAdmin={false}>
          <UpcomingAuctions />
        </PrivateRoute>
      } />

      {/* Admin routes */}
      <Route path="/admin-portal" element={
        <PrivateRoute requireAdmin={true}>
          <AdminDashboard />
        </PrivateRoute>
      } />
      <Route path="/admin/*" element={
        <PrivateRoute requireAdmin={true}>
          <AdminRoutes />
        </PrivateRoute>
      } />

      {/* Redirect unknown routes */}
      <Route path="*" element={
        <Navigate to={isAdmin ? "/admin-portal" : "/"} replace />
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