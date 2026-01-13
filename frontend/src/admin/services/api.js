import axios from 'axios';

const adminApi = axios.create({
    baseURL: '/api/admin',  // Vite proxy will forward to backend
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Add a request interceptor to include the admin token
adminApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default adminApi;

