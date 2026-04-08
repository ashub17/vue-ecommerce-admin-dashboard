export function buildImageUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;

  const base = import.meta.env.VITE_STORAGE_BASE_URL || '';
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
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
