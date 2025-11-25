import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': import.meta.env.VITE_API_KEY 
  },
});

export default api;