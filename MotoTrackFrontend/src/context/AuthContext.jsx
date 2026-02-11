import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { findUserByCredentials, findUserById } from '../data/users';

// Create auth context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing user session on app load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      // Verify the user still exists in our "database"
      const verifiedUser = findUserById(user.id);
      if (verifiedUser) {
        setCurrentUser(verifiedUser);
      } else {
        // User no longer exists, clear localStorage
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (email, password) => {
    const user = findUserByCredentials(email, password);
    if (user) {
      // Store user in localStorage (in a real app, store a token instead)
      const { password: _, ...userWithoutPassword } = user;
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      setCurrentUser(user);
      
      // Redirect based on user role
      if (user.role === 'admin') {
        navigate('/panel/admin');
      } else if (user.role === 'empleado') {
        navigate('/panel/empleado');
      } else if (user.role === 'ciudadano') {
        navigate('/panel/ciudadano');
      }
      
      return user;
    }
    return null;
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
    navigate('/login');
  };

  const value = {
    currentUser,
    login,
    logout,
    loading,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;