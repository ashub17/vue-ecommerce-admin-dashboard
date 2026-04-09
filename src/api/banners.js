import api from './axios';

export function getBanners(params = {}) {
  return api.get('/admin/banners', { params });
}

export function getBanner(id) {
  return api.get(`/admin/banners/${id}`);
}

export function createBanner(payload) {
  return api.post('/admin/banners', payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function updateBanner(id, payload) {
  return api.post(`/admin/banners/${id}`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function deleteBanner(id) {
  return api.delete(`/admin/banners/${id}`);
}
