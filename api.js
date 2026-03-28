/**
 * api.js — Shoplane API configuration
 * Change BASE_URL to point to your deployed backend.
 */
const API_BASE = 'https://shoplane-backend-wqb1.onrender.com/api';

window.ShoplaneAPI = {
  products:      `${API_BASE}/products`,
  product: (id) => `${API_BASE}/products/${id}`,
  orders:        `${API_BASE}/orders`,
};
