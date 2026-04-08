import api, { setAuthToken } from './api';

export const unifiedLogin = async (data) => {
  const response = await api.post('/unified-auth/login', data);
  const result = response.data;

  if (result?.token && result?.role) {
    setAuthToken(result.token, result.role);
  }

  return result;
};