/**
 * api.js — Shoplane API configuration
 * Change BASE_URL to point to your deployed backend.
 */
const API_BASE = 'http://localhost:8080/api';

window.ShoplaneAPI = {
  products:      `${API_BASE}/products`,
  product: (id) => `${API_BASE}/products/${id}`,
  orders:        `${API_BASE}/orders`,
};
