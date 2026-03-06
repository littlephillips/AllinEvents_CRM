export const fmtDate = (ts) => {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const fmtCurrency = (n) =>
  n ? `KES ${Number(n).toLocaleString('en-KE')}` : '—';

export const statusColor = (s) => ({
  'New':       'blue',
  'Contacted': 'yellow',
  'Confirmed': 'green',
  'Cancelled': 'red',
  'Completed': 'purple',
  'Pending':   'yellow',
  'Active':    'green',
  'Inactive':  'gray',
  'Published': 'green',
  'Hidden':    'gray',
  'Qualified': 'purple',
  'Converted': 'green',
  'Closed':    'gray',
}[s] || 'gray');

export const C = {
  yellow: '#FFD23F',
  navy:   '#1F271B',
  blue:   '#2867f0',
  bg:     '#f5f6fa',
  card:   '#ffffff',
  border: '#e5e7eb',
  text:   '#1f2937',
  muted:  '#6b7280',
  green:  '#10b981',
  red:    '#ef4444',
  orange: '#f59e0b',
  purple: '#8b5cf6',
};
