import api from './axios';

export function getContentBlocks(params = {}) {
  return api.get('/admin/content-blocks', { params });
}

export function getContentBlock(id) {
  return api.get(`/admin/content-blocks/${id}`);
}

export function createContentBlock(payload) {
  return api.post('/admin/content-blocks', payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function updateContentBlock(id, payload) {
  return api.post(`/admin/content-blocks/${id}`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function deleteContentBlock(id) {
  return api.delete(`/admin/content-blocks/${id}`);
}
