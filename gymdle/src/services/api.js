import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_URL_SERVIDOR + '/api', 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': import.meta.env.VITE_API_KEY 
  },
});

export default api;