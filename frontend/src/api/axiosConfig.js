import axios from 'axios';
//https://artsanconnectltd-3io0.onrender.com/api
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // backend URL
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;