import { useEffect, useState } from 'react';
import api from '../api/client';
import DataTable from '../components/DataTable';
import { currency } from '../utils/format';

const initialForm = {
  businessName: '',
  contactName: '',
  phone: '',
  address: '',
  debtBalance: 0,
  notes: ''
};

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const loadCustomers = async () => {
    const { data } = await api.get('/customers');
    setCustomers(data);
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (editingId) {
      await api.put(`/customers/${editingId}`, form);
    } else {
      await api.post('/customers', form);
    }
    resetForm();
    loadCustomers();
  };

  const handleEdit = (customer) => {
    setEditingId(customer.id);
    setForm({
      businessName: customer.business_name,
      contactName: customer.contact_name || '',
      phone: customer.phone,
      address: customer.address,
      debtBalance: customer.debt_balance,
      notes: customer.notes || ''
    });
  };

  const handleView = async (id) => {
    const { data } = await api.get(`/customers/${id}`);
    setSelectedCustomer(data);
  };

  const handleDelete = async (id) => {
    await api.delete(`/customers/${id}`);
    if (selectedCustomer?.id === id) {
      setSelectedCustomer(null);
    }
    loadCustomers();
  };

  const columns = [
    { key: 'business_name', label: 'Business Name' },
    { key: 'contact_name', label: 'Contact' },
    { key: 'phone', label: 'Phone' },
    { key: 'address', label: 'Address' },
    { key: 'debt_balance', label: 'Debt', render: (row) => currency(row.debt_balance) },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <button className="btn-secondary px-3 py-2" onClick={() => handleView(row.id)}>View</button>
          <button className="btn-secondary px-3 py-2" onClick={() => handleEdit(row)}>Edit</button>
          <button className="rounded-2xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700" onClick={() => handleDelete(row.id)}>Delete</button>
        </div>
      )
    }
  ];

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="panel p-6">
        <h2 className="page-title">{editingId ? 'Edit Customer' : 'Add Customer'}</h2>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input className="input" placeholder="Business name" required value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} />
          <input className="input" placeholder="Contact name" value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} />
          <input className="input" placeholder="Phone" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input className="input" placeholder="Address" required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <input className="input" min="0" placeholder="Debt balance" step="0.01" type="number" value={form.debtBalance} onChange={(e) => setForm({ ...form, debtBalance: e.target.value })} />
          <textarea className="input min-h-28" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <div className="flex gap-3">
            <button className="btn-primary" type="submit">{editingId ? 'Update Customer' : 'Save Customer'}</button>
            <button className="btn-secondary" onClick={resetForm} type="button">Clear</button>
          </div>
        </form>
      </div>

      <div className="space-y-6">
        <div className="panel p-6">
          <h2 className="page-title">Customers List</h2>
          <div className="mt-6">
            <DataTable columns={columns} rows={customers} />
          </div>
        </div>

        {selectedCustomer ? (
          <div className="panel p-6">
            <h3 className="text-xl font-bold text-slate-900">{selectedCustomer.business_name}</h3>
            <p className="mt-2 text-sm text-slate-500">{selectedCustomer.address}</p>
            <p className="mt-2 text-sm text-slate-600">Phone: {selectedCustomer.phone}</p>
            <p className="mt-2 text-sm font-semibold text-slate-800">Debt Balance: {currency(selectedCustomer.debt_balance)}</p>
            <div className="mt-5">
              <p className="text-sm font-semibold text-slate-700">Recent Payments</p>
              <div className="mt-3 space-y-2">
                {selectedCustomer.payments.length === 0 ? <p className="text-sm text-slate-500">No payment history yet.</p> : null}
                {selectedCustomer.payments.slice(0, 4).map((payment) => (
                  <div key={payment.id} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm">
                    {currency(payment.amount)} on {new Date(payment.payment_date).toLocaleDateString()}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CustomersPage;
