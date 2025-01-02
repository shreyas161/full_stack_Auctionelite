import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, rtdb } from '../config/firebase';
import { ref, get } from 'firebase/database';
import { 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  async function checkUserRole(user) {
    if (user) {
      try {
        const userRef = ref(rtdb, `users/${user.uid}`);
        const snapshot = await get(userRef);
        const userData = snapshot.val();

        if (userData?.suspended) {
          setCurrentUser(null);
          setIsAdmin(false);
          await signOut(auth);
          return false;
        }

        setIsAdmin(userData?.role === 'admin');
        return true;
      } catch (error) {
        console.error('Error checking user role:', error);
        return false;
      }
    } else {
      setIsAdmin(false);
      return true;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const isValid = await checkUserRole(user);
        if (isValid) {
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    isAdmin,
    login: async (email, password) => {
      try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const isValid = await checkUserRole(result.user);
        
        if (!isValid) {
          throw new Error('Your account has been suspended. Please contact support.');
        }
        
        return result;
      } catch (error) {
        if (error.code) {
          switch (error.code) {
            case 'auth/user-not-found':
              throw new Error('No account found with this email');
            case 'auth/wrong-password':
              throw new Error('Incorrect password');
            default:
              throw error;
          }
        }
        throw error;
      }
    },
    logout: async () => {
      try {
        await signOut(auth);
        setCurrentUser(null);
        setIsAdmin(false);
      } catch (error) {
        console.error('Logout error:', error);
        throw error;
      }
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthContext; 
