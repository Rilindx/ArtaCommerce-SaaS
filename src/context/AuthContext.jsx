import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('arta_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('arta_token')) {
      return;
    }

    const syncProfile = async () => {
      try {
        const { data } = await api.get('/auth/me');
        setUser(data.user);
      } catch (error) {
        localStorage.removeItem('arta_token');
        localStorage.removeItem('arta_user');
        setUser(null);
      }
    };

    syncProfile();
  }, []);

  const login = async (values) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', values);
      localStorage.setItem('arta_token', data.token);
      localStorage.setItem('arta_user', JSON.stringify(data.user));
      setUser(data.user);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('arta_token');
    localStorage.removeItem('arta_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: Boolean(user) }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
