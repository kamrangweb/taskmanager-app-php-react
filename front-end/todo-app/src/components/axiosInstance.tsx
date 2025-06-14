// axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost/php-projects/php-todo-react/back-end/public",
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: false,
    timeout: 10000
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Log the full URL being requested
        const fullUrl = config.baseURL && config.url ? `${config.baseURL}${config.url}` : 'URL not available';
        console.log('Full URL:', fullUrl);
        
        // Add token to request if it exists
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Log request details for debugging
        console.log('=== Request Details ===');
        console.log('URL:', config.url);
        console.log('Full URL:', fullUrl);
        console.log('Method:', config.method);
        console.log('Headers:', config.headers);
        console.log('Data:', config.data);
        
        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        // Log successful response
        console.log('=== Response Details ===');
        console.log('Status:', response.status);
        console.log('Data:', response.data);
        return response;
    },
    (error) => {
        // Log detailed error information
        console.error('=== Error Details ===');
        console.error('Message:', error.message);
        console.error('Status:', error.response?.status);
        console.error('Data:', error.response?.data);
        console.error('Config:', error.config);

        // Handle network errors
        if (!error.response) {
            console.error('Network Error - No response received');
            const attemptedUrl = error.config?.baseURL && error.config?.url 
                ? `${error.config.baseURL}${error.config.url}`
                : 'URL not available';
            console.error('Attempted URL:', attemptedUrl);
            return Promise.reject({
                message: 'Network Error - Unable to reach the server',
                originalError: error
            });
        }

        if (error.response?.status === 401) {
            console.log("Token expired. Redirecting to login...");
            localStorage.removeItem("token");
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
