import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Helper to set Authorization header
const getAuthConfig = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// Nearby artisans (no auth)
export const getNearbyArtisans = async (lat, lng) => {
  const res = await axios.get(`${API_URL}/artisans/nearby?lat=${lat}&lng=${lng}`);
  return res.data;
};

// Upload artisan portfolio
export const uploadPortfolio = async (artisanId, files, token) => {
  const formData = new FormData();
  files.forEach(file => formData.append('images', file));

  const res = await axios.post(`${API_URL}/artisans/portfolio/${artisanId}`, formData, getAuthConfig(token));
  return res.data;
};

// Add a service to artisan
export const addArtisanService = async (artisanId, serviceData, token) => {
  const res = await axios.post(`${API_URL}/artisans/${artisanId}/add-service`, serviceData, getAuthConfig(token));
  return res.data;
};

// Upload images for a specific artisan service
export const uploadServiceImages = async (artisanId, serviceId, files, token) => {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));

  const res = await axios.post(
    `${API_URL}/artisans/${artisanId}/service/${serviceId}/upload`,
    formData,
    {
      ...getAuthConfig(token),
      headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};



// Get orders for a specific artisan
// Get orders for a specific artisan (with customer + service populated)
export const getArtisanOrders = async (artisanId, token) => {
  const res = await axios.get(`${API_URL}/orders/artisan/${artisanId}`, getAuthConfig(token));
  return res.data; // { orders: [...] }
};



// Get all services for an artisan
export const getArtisanServices = async (artisanId, token) => {
  const res = await axios.get(`${API_URL}/artisans/${artisanId}/services`, getAuthConfig(token));
  return res.data;
};