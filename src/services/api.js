import axios from 'axios';
import store from '../store';
import { API_BASE_URL } from '../config'; // 引入 API_BASE_URL

// 设置 JWT token 并配置 axios 拦截器
const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

axios.interceptors.request.use(config => {
  const token = store.getState().auth.token;
  setAuthToken(token); // 使用 setAuthToken 函数来设置 Authorization 头
  return config;
});

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000, // 设置超时时间
  headers: {
    'Content-Type': 'application/json',
  },
});

const handleError = (error, errorMessage) => {
  console.error(errorMessage, error);
};

export const login = async (username, password) => {
  try {
    const response = await api.post('/login', { username, password });
    return response;
  } catch (error) {
    handleError(error, 'Error during login:');
  }
};

export const getSubscriptionUrls = async () => {
  try {
    const response = await api.get('/subscriptions');
    return response.data.urls; // 假设返回的格式为 { urls: [...] }
  } catch (error) {
    handleError(error, 'Error fetching subscription URLs:');
  }
};

export const register = async (username, password) => {
  try {
    const response = await api.post('/register', { username, password });
    return response;
  } catch (error) {
    handleError(error, 'Error during registration:');
  }
};
