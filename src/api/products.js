import api from './axios';

export function getProducts(params = {}) {
  return api.get('/admin/products', { params });
}

export function getProduct(id) {
  return api.get(`/admin/products/${id}`);
}

export function createProduct(payload) {
  return api.post('/admin/products', payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function updateProduct(id, payload) {
  return api.post(`/admin/products/${id}`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    params: {
      _method: 'PUT',
    },
  });
}

export function deleteProduct(id) {
  return api.delete(`/admin/products/${id}`);
}
