export function buildImageUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;

  const base = import.meta.env.VITE_STORAGE_BASE_URL || 'http://127.0.0.1:8000';
  return `${base}/storage/${path.replace(/^\/+/, '')}`;
}

export function formatCurrency(value, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

export function makeSlug(value = '') {
  return value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}
