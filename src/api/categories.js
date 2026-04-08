import api from './axios';

export function getCategories(params = {}) {
  return api.get('/admin/categories', { params });
}

export function getCategory(id) {
  return api.get(`/admin/categories/${id}`);
}

export function createCategory(payload) {
  return api.post('/admin/categories', payload);
}

export function updateCategory(id, payload) {
  return api.put(`/admin/categories/${id}`, payload);
}

export function deleteCategory(id) {
  return api.delete(`/admin/categories/${id}`);
}
