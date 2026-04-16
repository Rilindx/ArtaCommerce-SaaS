import { BarChart3, Boxes, FileText, LayoutDashboard, LogOut, ReceiptText, Users, Wallet } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navigation = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/products', label: 'Products', icon: Boxes },
  { to: '/invoices', label: 'Invoices', icon: ReceiptText },
  { to: '/debts', label: 'Debts', icon: Wallet },
  { to: '/workers', label: 'Workers', icon: Users },
  { to: '/reports', label: 'Reports', icon: BarChart3 }
];

const Layout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto grid min-h-screen max-w-[1600px] lg:grid-cols-[280px_1fr]">
        <aside className="bg-hero-grid px-6 py-8 text-white">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.3em] text-brand-200">Arta Ceramics</p>
            <h1 className="mt-3 text-3xl font-extrabold">Warehouse SaaS</h1>
            <p className="mt-3 text-sm text-slate-200">
              Inventory, invoicing, debts, payroll, and reporting in one operational cockpit.
            </p>
          </div>

          <nav className="mt-8 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                      isActive ? 'bg-white text-slate-900' : 'text-slate-200 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <Icon size={18} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-10 rounded-3xl border border-white/10 bg-white/10 p-5">
            <p className="text-sm font-semibold text-white">{user?.name || 'Admin'}</p>
            <p className="mt-1 text-sm text-brand-100">{user?.email}</p>
            <button onClick={logout} className="mt-4 flex items-center gap-2 text-sm font-semibold text-white">
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </aside>

        <main className="px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
