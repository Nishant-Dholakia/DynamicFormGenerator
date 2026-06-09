import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/form'; // Update with your backend URL

// Create axios instance with default config for credentials
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // This is equivalent to credentials: 'include' in fetch
  headers: {
    'Content-Type': 'application/json'
  }
});

// Optional: Add request interceptor for debugging
apiClient.interceptors.request.use(
  (config) => {
    console.log('Making API request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log('Authentication failed - user may need to login again');
      // Optionally redirect to login or dispatch logout action
    }
    return Promise.reject(error);
  }
);

export const saveForm = async (formData, userId) => {
  try {
    // Debug: Check if cookies are being sent
    console.log('Cookies before API call:', document.cookie);
    
    // Assign the user to the form
    const formWithUser = {
      ...formData,
      user: { userid: userId }
    };
    
    console.log('Sending form data:', formWithUser);
    
    const response = await apiClient.post('/save', formWithUser);
    return response.data;
  } catch (error) {
    console.error('Error saving form:', error);
    console.error('Error details:', {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers
    });
    throw error;
  }
};

// Export the configured axios instance for other API calls
export default apiClient;