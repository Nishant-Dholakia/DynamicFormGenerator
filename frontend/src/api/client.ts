import axios from 'axios';

// Vite reads environment variables prefixed with VITE_
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Crucial for cookie-based JWT authentication
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor for logging/debugging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data || '');
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor for centralized error management
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status} ${response.config.url}`, response.data || '');
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;
    
    console.error(`[API Error] ${status || 'Network Error'}`, data || error.message);

    let userMessage = 'An unexpected error occurred. Please try again.';

    if (status === 401) {
      userMessage = 'Your session has expired. Please log in again to continue.';
    } else if (status === 403) {
      userMessage = 'Access Denied: You do not have permission to view or manage this resource.';
    } else if (status === 404) {
      if (data && typeof data === 'object' && data.message) {
        userMessage = data.message;
      } else {
        userMessage = 'The requested resource could not be found.';
      }
    } else if (status === 409) {
      if (data && typeof data === 'object' && data.message) {
        userMessage = data.message;
      } else {
        userMessage = 'Conflict: The username or email already exists.';
      }
    } else if (status === 500) {
      if (typeof data === 'string' && data.includes('User not found') && error.config?.url?.includes('/form/get/')) {
        userMessage = 'Form not found! The form ID might be incorrect or deleted.';
      } else if (data && typeof data === 'object' && data.message) {
        userMessage = `Server error: ${data.message}`;
      } else {
        userMessage = 'A server error occurred. Please try again later.';
      }
    } else if (!status) {
      userMessage = 'Network error: Please check your internet connection and verify the backend is running.';
    } else {
      if (data && typeof data === 'object' && data.message) {
        userMessage = data.message;
      } else if (typeof data === 'string' && data.trim().length > 0) {
        userMessage = data;
      } else {
        userMessage = `Error (${status}): ${error.message}`;
      }
    }

    return Promise.reject(new Error(userMessage));
  }
);

export default apiClient;
