import api from './axios';

export function getAdminDashboard() {
  return api.get('/admin/dashboard');
}
