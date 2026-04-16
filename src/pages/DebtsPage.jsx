import { useEffect, useState } from 'react';
import api from '../api/client';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import { currency, dateValue } from '../utils/format';

const DebtsPage = () => {
  const [debts, setDebts] = useState([]);

  const loadDebts = async () => {
    const { data } = await api.get('/debts');
    setDebts(data);
  };

  useEffect(() => {
    loadDebts();
  }, []);

  const handlePayment = async (debt) => {
    const amount = window.prompt('Enter payment amount', 0);
    if (!amount) {
      return;
    }

    await api.post(`/debts/${debt.id}/payments`, {
      amount: Number(amount),
      paymentDate: new Date().toISOString().slice(0, 10),
      method: 'cash',
      notes: 'Manual payment update'
    });
    loadDebts();
  };

  return (
    <div className="space-y-6">
      <div className="panel p-6">
        <h2 className="page-title">Debt Tracking</h2>
        <p className="mt-2 text-sm text-slate-500">Review overdue balances, due dates, and post incoming payments.</p>
        <div className="mt-6">
          <DataTable
            rows={debts}
            columns={[
              { key: 'business_name', label: 'Customer' },
              { key: 'phone', label: 'Phone' },
              { key: 'amount', label: 'Debt', render: (row) => currency(row.amount) },
              { key: 'amount_paid', label: 'Paid', render: (row) => currency(row.amount_paid) },
              { key: 'due_date', label: 'Due Date', render: (row) => dateValue(row.due_date) },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
              { key: 'actions', label: 'Actions', render: (row) => <button className="btn-secondary px-3 py-2" onClick={() => handlePayment(row)}>Add Payment</button> }
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default DebtsPage;
