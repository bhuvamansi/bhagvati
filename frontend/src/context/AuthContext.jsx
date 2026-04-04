import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  getCurrentUser,
  getStoredToken,
  loginUser as loginUserApi,
  logoutUser as logoutUserApi,
  registerUser as registerUserApi,
  setAuthToken,
} from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const response = await getCurrentUser();
    const currentUser = response?.data?.user || null;
    setUser(currentUser);
    return currentUser;
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = getStoredToken();

        if (!token) {
          setUser(null);
          setAuthLoading(false);
          return;
        }

        setAuthToken(token);
        await refreshUser();
      } catch (error) {
        setAuthToken(null);
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    initializeAuth();
  }, [refreshUser]);

  const login = useCallback(async (formData) => {
    const response = await loginUserApi(formData);
    const token = response?.token;
    const loggedInUser = response?.data?.user || null;

    if (token) {
      setAuthToken(token);
    }

    setUser(loggedInUser);
    return response;
  }, []);

  const register = useCallback(async (formData) => {
    const response = await registerUserApi(formData);
    const token = response?.token;
    const newUser = response?.data?.user || null;

    if (token) {
      setAuthToken(token);
    }

    setUser(newUser);
    return response;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUserApi();
    } catch (error) {
      // ignore API logout failure and still clear client state
    } finally {
      setAuthToken(null);
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      authLoading,
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, authLoading, login, register, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};