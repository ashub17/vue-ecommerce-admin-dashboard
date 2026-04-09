export const ORDER_STATUS_OPTIONS = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
];

export const PAYMENT_STATUS_OPTIONS = ['unpaid', 'paid', 'failed', 'refunded'];

export function orderStatusBadgeClass(status) {
  const map = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  return map[status] || 'bg-gray-100 text-gray-600';
}

export function paymentStatusBadgeClass(status) {
  const map = {
    unpaid: 'bg-yellow-100 text-yellow-700',
    paid: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
    refunded: 'bg-gray-100 text-gray-700',
  };

  return map[status] || 'bg-gray-100 text-gray-600';
}
