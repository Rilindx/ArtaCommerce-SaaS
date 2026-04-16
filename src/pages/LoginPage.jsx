import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const [form, setForm] = useState({ email: 'admin@artaceramics.com', password: 'Admin@123' });
  const [error, setError] = useState('');

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await login(form);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-hero-grid px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] bg-white shadow-panel lg:grid-cols-[1.2fr_0.8fr]">
        <div className="hidden bg-slate-900 p-10 text-white lg:block">
          <p className="text-xs uppercase tracking-[0.35em] text-brand-300">Arta Ceramics</p>
          <h1 className="mt-6 text-5xl font-extrabold leading-tight">Tile warehouse operations, simplified.</h1>
          <p className="mt-6 max-w-lg text-base text-slate-300">
            Manage stock by square meter, invoice customers, track debts, and stay ahead of payroll deadlines from one clean SaaS workspace.
          </p>
        </div>
        <div className="p-8 sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-700">Admin Login</p>
          <h2 className="mt-4 text-3xl font-extrabold text-slate-900">Welcome back</h2>
          <p className="mt-3 text-sm text-slate-500">Sign in to access the Arta Ceramics Warehouse Management System.</p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
              <input
                className="input"
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
              <input
                className="input"
                type="password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                required
              />
            </div>
            {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
            <button className="btn-primary w-full" disabled={loading} type="submit">
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
