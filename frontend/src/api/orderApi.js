import api from './axiosConfig';

export const createOrder = async (orderData) => {
  const res = await api.post('/orders', orderData); // 👌 correct now
  return res.data;
};

export const getOrders = async () => {
  const res = await api.get('/orders');
  return res.data;
};