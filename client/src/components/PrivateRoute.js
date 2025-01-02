import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress } from '@mui/material';
import { ref, get } from 'firebase/database';
import { rtdb } from '../config/firebase';

function PrivateRoute({ children, requireAdmin }) {
  const { currentUser } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (currentUser) {
        const userRef = ref(rtdb, `users/${currentUser.uid}`);
        const snapshot = await get(userRef);
        const userData = snapshot.val();
        setIsAdmin(userData?.role === 'admin');
      }
      setLoading(false);
    };

    checkAdminStatus();
  }, [currentUser]);

  if (loading) {
    return <CircularProgress />;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
}

export default PrivateRoute; 