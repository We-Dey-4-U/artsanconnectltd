import axios from 'axios';
//http://localhost:5000/api
//https://artsanconnectltd-3io0.onrender.com/api
const api = axios.create({
  baseURL: 'https://artsanconnectltd-3io0.onrender.com/api', // backend URL
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;