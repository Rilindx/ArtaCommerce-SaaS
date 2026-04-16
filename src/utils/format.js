export const currency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(Number(value || 0));

export const dateValue = (value) => (value ? new Date(value).toLocaleDateString() : '-');
