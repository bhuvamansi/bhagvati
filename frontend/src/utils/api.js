import axios from 'axios';

const USER_TOKEN_KEY = 'sbf_user_token';
const ADMIN_TOKEN_KEY = 'sbf_admin_token';

const resolveBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL?.trim();

  if (envUrl) return envUrl.replace(/\/$/, '');

  if (typeof window !== 'undefined') {
    const { origin, hostname } = window.location;
    const isLocal = ['localhost', '127.0.0.1', '0.0.0.0'].includes(hostname);
    return isLocal ? 'http://localhost:5000/api' : `${origin}/api`;
  }

  return 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: resolveBaseUrl(),
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

const extractErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  'Something went wrong';

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(new Error(extractErrorMessage(error)))
);

const request = async (url, options = {}) => {
  const response = await api({
    url,
    method: options.method || 'GET',
    data: options.data,
    params: options.params,
    headers: options.headers,
  });
  return response.data;
};

const getStorage = (key) => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(key);
};

const setStorage = (key, value) => {
  if (typeof window === 'undefined') return;
  if (value) localStorage.setItem(key, value);
  else localStorage.removeItem(key);
};

export const setAuthToken = (token, type = 'user') => {
  const key = type === 'admin' ? ADMIN_TOKEN_KEY : USER_TOKEN_KEY;
  setStorage(key, token);

  const userToken = getStorage(USER_TOKEN_KEY);
  const adminToken = getStorage(ADMIN_TOKEN_KEY);
  const activeToken = adminToken || userToken;

  if (activeToken) api.defaults.headers.common.Authorization = `Bearer ${activeToken}`;
  else delete api.defaults.headers.common.Authorization;
};

export const getStoredToken = () => getStorage(USER_TOKEN_KEY);
export const getStoredAdminToken = () => getStorage(ADMIN_TOKEN_KEY);

const existingAdminToken = getStoredAdminToken();
const existingUserToken = getStoredToken();
if (existingAdminToken || existingUserToken) {
  api.defaults.headers.common.Authorization = `Bearer ${existingAdminToken || existingUserToken}`;
}

export const registerUser = (data) => request('/auth/user/register', { method: 'POST', data });
export const loginUser = (data) => request('/auth/user/login', { method: 'POST', data });
export const logoutUser = async () => {
  const result = await request('/auth/user/logout', { method: 'POST' });
  setAuthToken(null, 'user');
  return result;
};
export const getCurrentUser = () => request('/auth/user/me');
export const forgotUserPassword = (data) => request('/auth/user/forgot-password', { method: 'POST', data });
export const resetUserPassword = (token, data) => request(`/auth/user/reset-password/${token}`, { method: 'PATCH', data });
export const changeUserPassword = (data) => request('/auth/user/change-password', { method: 'PATCH', data });

export const loginAdmin = (data) => request('/auth/login', { method: 'POST', data });
export const logoutAdmin = async () => {
  const result = await request('/auth/logout', { method: 'POST' });
  setAuthToken(null, 'admin');
  return result;
};
export const getCurrentAdmin = () => request('/auth/me');

export const getProducts = (params) => request('/products', { params });
export const getProductById = (id) => request(`/products/${id}`);
export const createProduct = (data) => request('/products', { method: 'POST', data });
export const updateProduct = (id, data) => request(`/products/${id}`, { method: 'PUT', data });
export const deleteProduct = (id) => request(`/products/${id}`, { method: 'DELETE' });

export const getProjects = (params) => request('/projects', { params });
export const getProjectById = (id) => request(`/projects/${id}`);
export const createProject = (data) => request('/projects', { method: 'POST', data });
export const updateProject = (id, data) => request(`/projects/${id}`, { method: 'PATCH', data });
export const deleteProject = (id) => request(`/projects/${id}`, { method: 'DELETE' });

export const getArchives = (params) => request('/archives', { params });
export const getArchiveById = (id) => request(`/archives/${id}`);
export const createArchive = (data) => request('/archives', { method: 'POST', data });
export const updateArchive = (id, data) => request(`/archives/${id}`, { method: 'PATCH', data });
export const deleteArchive = (id) => request(`/archives/${id}`, { method: 'DELETE' });

export const submitContactForm = (data) => request('/contact', { method: 'POST', data });
export const submitBespokeInquiry = (data) => request('/contact', { method: 'POST', data: { ...data, type: 'bespoke' } });
export const getContacts = (params) => request('/contact', { params });
export const updateContactStatus = (id, data) => request(`/contact/${id}/status`, { method: 'PUT', data });
export const deleteContact = (id) => request(`/contact/${id}`, { method: 'DELETE' });

export const subscribeNewsletter = (data) => request('/newsletter/subscribe', { method: 'POST', data });
export const unsubscribeNewsletter = (data) => request('/newsletter/unsubscribe', { method: 'POST', data });
export const getSubscribers = () => request('/newsletter');

export const getFaqs = () => request('/faqs');
export const getSiteSettings = () => request('/site-settings');
export const updateSiteSettings = (data) => request('/site-settings', { method: 'PATCH', data });

export const getAdminAnalytics = () => request('/admin/analytics');
export const getAdminUsers = (params) => request('/admin/users', { params });
export const updateAdminUser = (id, data) => request(`/admin/users/${id}`, { method: 'PATCH', data });

// orders
export const createOrder = (data) => request('/orders', { method: 'POST', data });
export const getMyOrders = () => request('/orders/my-orders');
export const getMyOrderById = (id) => request(`/orders/my-orders/${id}`);

export const getAdminOrders = () => request('/orders');
export const getAdminOrderById = (id) => request(`/orders/${id}`);
export const updateAdminOrderStatus = (id, data) =>
  request(`/orders/${id}/status`, { method: 'PATCH', data });

export default api;