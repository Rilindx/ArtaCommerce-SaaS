const StatCard = ({ title, value, hint }) => {
  return (
    <div className="panel p-6">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <h3 className="mt-3 text-3xl font-extrabold text-slate-900">{value}</h3>
      <p className="mt-2 text-sm text-slate-500">{hint}</p>
    </div>
  );
};

export default StatCard;
