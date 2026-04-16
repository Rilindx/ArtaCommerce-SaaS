import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CustomersPage from './pages/CustomersPage';
import ProductsPage from './pages/ProductsPage';
import InvoicesPage from './pages/InvoicesPage';
import DebtsPage from './pages/DebtsPage';
import WorkersPage from './pages/WorkersPage';
import ReportsPage from './pages/ReportsPage';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="invoices" element={<InvoicesPage />} />
        <Route path="debts" element={<DebtsPage />} />
        <Route path="workers" element={<WorkersPage />} />
        <Route path="reports" element={<ReportsPage />} />
      </Route>
    </Routes>
  );
};

export default App;
