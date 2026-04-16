import { useEffect, useMemo, useState } from 'react';
import api from '../api/client';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import { currency, dateValue } from '../utils/format';

const initialInvoice = {
  customerId: '',
  invoiceDate: new Date().toISOString().slice(0, 10),
  dueDate: new Date().toISOString().slice(0, 10),
  amountPaid: 0,
  discount: 0,
  tax: 0,
  notes: '',
  items: [{ productId: '', quantity: 1, unitPrice: 0 }]
};

const InvoicesPage = () => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [form, setForm] = useState(initialInvoice);

  const loadPageData = async () => {
    const [customersRes, productsRes, invoicesRes] = await Promise.all([
      api.get('/customers'),
      api.get('/products'),
      api.get('/invoices')
    ]);
    setCustomers(customersRes.data);
    setProducts(productsRes.data);
    setInvoices(invoicesRes.data);
  };

  useEffect(() => {
    loadPageData();
  }, []);

  const totals = useMemo(() => {
    const subtotal = form.items.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.unitPrice || 0), 0);
    const total = subtotal - Number(form.discount || 0) + Number(form.tax || 0);
    return { subtotal, total };
  }, [form]);

  const updateItem = (index, nextValues) => {
    const nextItems = [...form.items];
    nextItems[index] = { ...nextItems[index], ...nextValues };
    setForm({ ...form, items: nextItems });
  };

  const addItem = () => {
    setForm({ ...form, items: [...form.items, { productId: '', quantity: 1, unitPrice: 0 }] });
  };

  const handleProductSelect = (index, productId) => {
    const selected = products.find((product) => String(product.id) === productId);
    updateItem(index, {
      productId,
      unitPrice: selected?.price_per_m2 || 0
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await api.post('/invoices', {
      ...form,
      items: form.items.map((item) => ({
        ...item,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice)
      }))
    });
    setForm(initialInvoice);
    loadPageData();
  };

  const updatePaymentStatus = async (invoice) => {
    const nextPaid = window.prompt('Enter the total paid amount for this invoice', invoice.amount_paid);
    if (nextPaid === null) {
      return;
    }
    await api.patch(`/invoices/${invoice.id}/payment`, { amountPaid: Number(nextPaid) });
    loadPageData();
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
        <div className="panel p-6">
          <h2 className="page-title">Create Invoice</h2>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <select className="input" required value={form.customerId} onChange={(e) => setForm({ ...form, customerId: e.target.value })}>
              <option value="">Select customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>{customer.business_name}</option>
              ))}
            </select>
            <div className="grid gap-4 md:grid-cols-2">
              <input className="input" required type="date" value={form.invoiceDate} onChange={(e) => setForm({ ...form, invoiceDate: e.target.value })} />
              <input className="input" required type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
            </div>

            <div className="space-y-3">
              {form.items.map((item, index) => (
                <div key={index} className="grid gap-3 rounded-2xl border border-slate-200 p-4 md:grid-cols-[1.6fr_0.6fr_0.7fr]">
                  <select className="input" required value={item.productId} onChange={(e) => handleProductSelect(index, e.target.value)}>
                    <option value="">Select product</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} ({product.quantity_in_stock} in stock)
                      </option>
                    ))}
                  </select>
                  <input className="input" min="1" required step="0.01" type="number" value={item.quantity} onChange={(e) => updateItem(index, { quantity: e.target.value })} />
                  <input className="input" min="0" required step="0.01" type="number" value={item.unitPrice} onChange={(e) => updateItem(index, { unitPrice: e.target.value })} />
                </div>
              ))}
              <button className="btn-secondary" onClick={addItem} type="button">Add Product Line</button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <input className="input" min="0" step="0.01" type="number" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} placeholder="Discount" />
              <input className="input" min="0" step="0.01" type="number" value={form.tax} onChange={(e) => setForm({ ...form, tax: e.target.value })} placeholder="Tax" />
              <input className="input" min="0" step="0.01" type="number" value={form.amountPaid} onChange={(e) => setForm({ ...form, amountPaid: e.target.value })} placeholder="Amount paid" />
            </div>

            <textarea className="input min-h-28" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Invoice notes" />

            <div className="rounded-2xl bg-slate-50 p-4 text-sm">
              <p>Subtotal: <span className="font-semibold">{currency(totals.subtotal)}</span></p>
              <p className="mt-2">Grand Total: <span className="font-semibold">{currency(totals.total)}</span></p>
            </div>

            <button className="btn-primary" type="submit">Save Invoice</button>
          </form>
        </div>

        <div className="panel p-6">
          <h2 className="page-title">Invoice Register</h2>
          <div className="mt-6">
            <DataTable
              rows={invoices}
              columns={[
                { key: 'invoice_number', label: 'Invoice #' },
                { key: 'business_name', label: 'Customer' },
                { key: 'invoice_date', label: 'Date', render: (row) => dateValue(row.invoice_date) },
                { key: 'due_date', label: 'Due', render: (row) => dateValue(row.due_date) },
                { key: 'total_amount', label: 'Total', render: (row) => currency(row.total_amount) },
                { key: 'payment_status', label: 'Status', render: (row) => <StatusBadge status={row.payment_status} /> },
                {
                  key: 'actions',
                  label: 'Actions',
                  render: (row) => <button className="btn-secondary px-3 py-2" onClick={() => updatePaymentStatus(row)}>Update Payment</button>
                }
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicesPage;
