import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // In a real app, verify token with backend
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const savedUser = JSON.parse(localStorage.getItem('user'));
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password, selectedRole) => {
    try {
      // Prioritize the role selected in the UI, fallback to email detection
      let role = selectedRole || 'DONOR';
      
      if (!selectedRole) {
        if (email.includes('recipient')) role = 'RECIPIENT';
        if (email.includes('hospital')) role = 'HOSPITAL';
        if (email.includes('admin')) role = 'ADMIN';
      }

      const res = { 
        data: { 
          token: 'mock-jwt-spring-boot-sec', 
          user: { 
            email, 
            role, 
            displayName: email.split('@')[0].toUpperCase(),
            id: Math.floor(Math.random() * 9000) + 1000
          } 
        } 
      };
      
      const { token, user: userData } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
      return userData;
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
