import { useEffect, useState } from 'react';
import api from '../api/client';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import { currency, dateValue } from '../utils/format';

const initialForm = {
  fullName: '',
  phone: '',
  roleTitle: '',
  salaryAmount: '',
  paymentDueDate: new Date().toISOString().slice(0, 10),
  status: 'unpaid'
};

const WorkersPage = () => {
  const [workers, setWorkers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const loadWorkers = async () => {
    const { data } = await api.get('/workers');
    setWorkers(data);
  };

  useEffect(() => {
    loadWorkers();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (editingId) {
      await api.put(`/workers/${editingId}`, form);
    } else {
      await api.post('/workers', form);
    }
    resetForm();
    loadWorkers();
  };

  const handleEdit = (worker) => {
    setEditingId(worker.id);
    setForm({
      fullName: worker.full_name,
      phone: worker.phone || '',
      roleTitle: worker.role_title || '',
      salaryAmount: worker.salary_amount,
      paymentDueDate: worker.payment_due_date?.slice(0, 10),
      status: worker.status
    });
  };

  const handleDelete = async (id) => {
    await api.delete(`/workers/${id}`);
    loadWorkers();
  };

  const recordPayment = async (worker) => {
    await api.post(`/workers/${worker.id}/payments`, {
      amount: worker.salary_amount,
      paymentDate: new Date().toISOString().slice(0, 10),
      paymentWeekStart: new Date().toISOString().slice(0, 10),
      method: 'bank transfer',
      notes: 'Weekly payroll',
      status: 'paid'
    });
    loadWorkers();
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <div className="panel p-6">
        <h2 className="page-title">{editingId ? 'Edit Worker' : 'Add Worker'}</h2>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input className="input" placeholder="Full name" required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          <input className="input" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input className="input" placeholder="Role title" value={form.roleTitle} onChange={(e) => setForm({ ...form, roleTitle: e.target.value })} />
          <input className="input" min="0" placeholder="Salary amount" required step="0.01" type="number" value={form.salaryAmount} onChange={(e) => setForm({ ...form, salaryAmount: e.target.value })} />
          <input className="input" required type="date" value={form.paymentDueDate} onChange={(e) => setForm({ ...form, paymentDueDate: e.target.value })} />
          <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="unpaid">Unpaid</option>
            <option value="partial">Partial</option>
            <option value="paid">Paid</option>
          </select>
          <div className="flex gap-3">
            <button className="btn-primary" type="submit">{editingId ? 'Update Worker' : 'Save Worker'}</button>
            <button className="btn-secondary" onClick={resetForm} type="button">Clear</button>
          </div>
        </form>
      </div>

      <div className="panel p-6">
        <h2 className="page-title">Payroll List</h2>
        <div className="mt-6">
          <DataTable
            rows={workers}
            columns={[
              { key: 'full_name', label: 'Worker' },
              { key: 'role_title', label: 'Role' },
              { key: 'salary_amount', label: 'Salary', render: (row) => currency(row.salary_amount) },
              { key: 'payment_due_date', label: 'Due Date', render: (row) => dateValue(row.payment_due_date) },
              { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
              {
                key: 'actions',
                label: 'Actions',
                render: (row) => (
                  <div className="flex gap-2">
                    <button className="btn-secondary px-3 py-2" onClick={() => recordPayment(row)}>Mark Paid</button>
                    <button className="btn-secondary px-3 py-2" onClick={() => handleEdit(row)}>Edit</button>
                    <button className="rounded-2xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700" onClick={() => handleDelete(row.id)}>Delete</button>
                  </div>
                )
              }
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default WorkersPage;
