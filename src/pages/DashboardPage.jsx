import { useEffect, useState } from 'react';
import api from '../api/client';
import StatCard from '../components/StatCard';
import { currency } from '../utils/format';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalDebts: 0,
    paidInvoices: 0,
    unpaidInvoices: 0,
    workersToPayThisWeek: 0,
    totalProfit: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      const { data } = await api.get('/dashboard');
      setStats(data);
    };
    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="panel bg-hero-grid p-8 text-white">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-200">Operations Overview</p>
        <h2 className="mt-3 text-4xl font-extrabold">Arta Ceramics control center</h2>
        <p className="mt-4 max-w-2xl text-sm text-slate-200">
          Watch debt exposure, paid invoices, payroll obligations, and collected profit from a single dashboard built for warehouse decisions.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <StatCard title="Total Customers" value={stats.totalCustomers} hint="All active customer records" />
        <StatCard title="Total Debts" value={currency(stats.totalDebts)} hint="Outstanding balances across customers" />
        <StatCard title="Paid Invoices" value={stats.paidInvoices} hint="Invoices marked fully paid" />
        <StatCard title="Unpaid Invoices" value={stats.unpaidInvoices} hint="Open and partially paid invoices" />
        <StatCard title="Workers To Pay This Week" value={stats.workersToPayThisWeek} hint="Upcoming payroll obligations" />
        <StatCard title="Total Profit" value={currency(stats.totalProfit)} hint="Collected invoice value to date" />
      </div>
    </div>
  );
};

export default DashboardPage;
