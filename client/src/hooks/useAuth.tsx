import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, AuthState } from '../types';
import { authAPI } from '../services/api';

const AuthContext = createContext<{
  auth: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
} | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('mono vault_token'),
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    const token = localStorage.getItem('mono vault_token');
    if (token) {
      // Verify token and get user info
      authAPI.verifyToken(token)
        .then((user) => {
          setAuth({
            user,
            token,
            isLoading: false,
            isAuthenticated: true,
          });
        })
        .catch(() => {
          localStorage.removeItem('mono vault_token');
          setAuth({
            user: null,
            token: null,
            isLoading: false,
            isAuthenticated: false,
          });
        });
    } else {
      setAuth(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      localStorage.setItem('mono vault_token', response.token);
      setAuth({
        user: response.user,
        token: response.token,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await authAPI.register(name, email, password);
      localStorage.setItem('mono vault_token', response.token);
      setAuth({
        user: response.user,
        token: response.token,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('mono vault_token');
    setAuth({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};