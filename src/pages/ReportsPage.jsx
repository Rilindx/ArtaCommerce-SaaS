import { useEffect, useState } from 'react';
import api from '../api/client';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import { currency, dateValue } from '../utils/format';

const ReportsPage = () => {
  const [report, setReport] = useState({
    daily: {},
    monthly: {},
    debts: [],
    profit: [],
    workerPayments: []
  });

  useEffect(() => {
    const loadReports = async () => {
      const { data } = await api.get('/reports');
      setReport(data);
    };
    loadReports();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="panel p-6">
          <p className="text-sm font-semibold text-slate-500">Daily Report</p>
          <h3 className="mt-3 text-3xl font-extrabold">{currency(report.daily.revenue)}</h3>
          <p className="mt-2 text-sm text-slate-500">Collected today: {currency(report.daily.cash_collected)}</p>
        </div>
        <div className="panel p-6">
          <p className="text-sm font-semibold text-slate-500">Monthly Report</p>
          <h3 className="mt-3 text-3xl font-extrabold">{currency(report.monthly.revenue)}</h3>
          <p className="mt-2 text-sm text-slate-500">Invoices this month: {report.monthly.invoices_count || 0}</p>
        </div>
      </div>

      <div className="panel p-6">
        <h2 className="page-title">Debt Report</h2>
        <div className="mt-6">
          <DataTable
            rows={report.debts}
            columns={[
              { key: 'business_name', label: 'Customer' },
              { key: 'amount', label: 'Amount', render: (row) => currency(row.amount) },
              { key: 'amount_paid', label: 'Paid', render: (row) => currency(row.amount_paid) },
              { key: 'due_date', label: 'Due Date', render: (row) => dateValue(row.due_date) },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> }
            ]}
          />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="panel p-6">
          <h2 className="page-title">Profit Report</h2>
          <div className="mt-6">
            <DataTable
              rows={report.profit}
              columns={[
                { key: 'month', label: 'Month' },
                { key: 'collected_profit', label: 'Collected Profit', render: (row) => currency(row.collected_profit) }
              ]}
            />
          </div>
        </div>
        <div className="panel p-6">
          <h2 className="page-title">Worker Payments Report</h2>
          <div className="mt-6">
            <DataTable
              rows={report.workerPayments}
              columns={[
                { key: 'full_name', label: 'Worker' },
                { key: 'amount', label: 'Amount', render: (row) => currency(row.amount) },
                { key: 'payment_date', label: 'Payment Date', render: (row) => dateValue(row.payment_date) },
                { key: 'method', label: 'Method' }
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
