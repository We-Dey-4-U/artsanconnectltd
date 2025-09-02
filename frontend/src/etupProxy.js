// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api', // The path you want to proxy (e.g., '/api/posts')
    createProxyMiddleware({
      target: 'https://blogserver-mb2q.vercel.app', // Your backend API URL
      changeOrigin: true, // Adjust the origin header for the request
      secure: false, // If you're using HTTP, set to false, otherwise true for HTTPS
    })
  );
};