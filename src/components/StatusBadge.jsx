const colorMap = {
  paid: 'bg-emerald-100 text-emerald-700',
  unpaid: 'bg-rose-100 text-rose-700',
  partial: 'bg-amber-100 text-amber-700',
  overdue: 'bg-orange-100 text-orange-700'
};

const StatusBadge = ({ status }) => (
  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${colorMap[status] || 'bg-slate-100 text-slate-600'}`}>
    {status}
  </span>
);

export default StatusBadge;
