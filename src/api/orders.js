import api from './axios';

export function getOrders(params = {}) {
  return api.get('/admin/orders', { params });
}

export function getOrder(id) {
  return api.get(`/admin/orders/${id}`);
}

export function updateOrder(id, payload) {
  return api.put(`/admin/orders/${id}`, payload);
}
