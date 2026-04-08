import api from './axios';

export function loginRequest(payload) {
  return api.post('/auth/login', payload);
}

export function meRequest() {
  return api.get('/auth/me');
}

export function logoutRequest() {
  return api.post('/auth/logout');
}
