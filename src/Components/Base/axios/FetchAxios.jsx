import axios from 'axios';
import { getAccessTokenCookie } from '../getAccessTokenCookie.jsx';
import { logoutAxios } from '../BaseFunction.jsx';
import { navigateTo } from '../../../navigateHelper.js';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

export const streamAddress = 'mikhak_backend/api/base/stream/mikhak/api';

const apiUrl = import.meta.env.VITE_BASE_URL_PATH;
export const fetchWithAxios = axios.create({
  baseURL: apiUrl,
  // timeout: 10000,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

fetchWithAxios.interceptors.request.use(
  async (config) => {
    const token = getAccessTokenCookie();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export const refreshAxios = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

export const refreshTokenAxios = async () => {
  try {
    const response = await refreshAxios.post('/refresh', {}, {});
    return response.data;
  } catch (error) {
    console.log('********************');
    return null;
  }
};

fetchWithAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // اگر توکن در حال رفرش شدن است، این درخواست را در صف نگه دار
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              resolve(fetchWithAxios(originalRequest));
            },
            reject: (err) => reject(err),
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshTokenAxios(); // این باید توکن جدید را برگرداند

        if (!newToken) {
          logoutAxios();
          navigateTo('/auth/login');
          return Promise.reject(error);
        }

        processQueue(null, newToken);

        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return fetchWithAxios(originalRequest);
      } catch (err) {
        processQueue(err, null);
        navigateTo('/auth/login');
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
