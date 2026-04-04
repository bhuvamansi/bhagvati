import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  getCurrentAdmin,
  getStoredAdminToken,
  loginAdmin as loginAdminApi,
  logoutAdmin as logoutAdminApi,
  setAuthToken,
} from '../utils/api';

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [adminLoading, setAdminLoading] = useState(true);

  const refreshAdmin = useCallback(async () => {
    const response = await getCurrentAdmin();
    const currentAdmin = response?.data?.admin || null;
    setAdmin(currentAdmin);
    return currentAdmin;
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const token = getStoredAdminToken();
        if (!token) {
          setAdminLoading(false);
          return;
        }
        setAuthToken(token, 'admin');
        await refreshAdmin();
      } catch {
        setAuthToken(null, 'admin');
        setAdmin(null);
      } finally {
        setAdminLoading(false);
      }
    };

    init();
  }, [refreshAdmin]);

  const loginAdmin = useCallback(async (formData) => {
    const response = await loginAdminApi(formData);
    const token = response?.token;
    const currentAdmin = response?.data?.admin || null;
    if (token) setAuthToken(token, 'admin');
    setAdmin(currentAdmin);
    return response;
  }, []);

  const logoutAdmin = useCallback(async () => {
    try {
      await logoutAdminApi();
    } finally {
      setAuthToken(null, 'admin');
      setAdmin(null);
    }
  }, []);

  const value = useMemo(() => ({
    admin,
    isAdminAuthenticated: !!admin,
    adminLoading,
    loginAdmin,
    logoutAdmin,
    refreshAdmin,
  }), [admin, adminLoading, loginAdmin, logoutAdmin, refreshAdmin]);

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within AdminProvider');
  return context;
};
