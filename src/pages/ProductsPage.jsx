import { useEffect, useState } from 'react';
import api from '../api/client';
import DataTable from '../components/DataTable';
import { currency } from '../utils/format';

const initialForm = {
  sku: '',
  name: '',
  category: 'Tile',
  unit: 'm2',
  pricePerM2: '',
  quantityInStock: '',
  reorderLevel: ''
};

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const loadProducts = async () => {
    const { data } = await api.get('/products');
    setProducts(data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (editingId) {
      await api.put(`/products/${editingId}`, form);
    } else {
      await api.post('/products', form);
    }
    resetForm();
    loadProducts();
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      sku: product.sku,
      name: product.name,
      category: product.category,
      unit: product.unit,
      pricePerM2: product.price_per_m2,
      quantityInStock: product.quantity_in_stock,
      reorderLevel: product.reorder_level
    });
  };

  const handleDelete = async (id) => {
    await api.delete(`/products/${id}`);
    loadProducts();
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="panel p-6">
        <h2 className="page-title">{editingId ? 'Edit Product' : 'Add Tile Product'}</h2>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input className="input" placeholder="SKU" required value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
          <input className="input" placeholder="Product name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="input" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <select className="input" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>
            <option value="m2">m2</option>
            <option value="box">box</option>
            <option value="piece">piece</option>
          </select>
          <input className="input" min="0" placeholder="Price per m2" required step="0.01" type="number" value={form.pricePerM2} onChange={(e) => setForm({ ...form, pricePerM2: e.target.value })} />
          <input className="input" min="0" placeholder="Quantity in stock" required step="0.01" type="number" value={form.quantityInStock} onChange={(e) => setForm({ ...form, quantityInStock: e.target.value })} />
          <input className="input" min="0" placeholder="Reorder level" step="0.01" type="number" value={form.reorderLevel} onChange={(e) => setForm({ ...form, reorderLevel: e.target.value })} />
          <div className="flex gap-3">
            <button className="btn-primary" type="submit">{editingId ? 'Update Product' : 'Save Product'}</button>
            <button className="btn-secondary" onClick={resetForm} type="button">Clear</button>
          </div>
        </form>
      </div>

      <div className="panel p-6">
        <h2 className="page-title">Stock Overview</h2>
        <div className="mt-6">
          <DataTable
            rows={products}
            columns={[
              { key: 'sku', label: 'SKU' },
              { key: 'name', label: 'Product' },
              { key: 'price_per_m2', label: 'Price', render: (row) => currency(row.price_per_m2) },
              { key: 'quantity_in_stock', label: 'Stock' },
              { key: 'reorder_level', label: 'Reorder Level' },
              {
                key: 'actions',
                label: 'Actions',
                render: (row) => (
                  <div className="flex gap-2">
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

export default ProductsPage;
