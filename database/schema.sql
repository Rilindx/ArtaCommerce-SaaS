CREATE DATABASE IF NOT EXISTS arta_ceramics_wms;
USE arta_ceramics_wms;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin') NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  business_name VARCHAR(180) NOT NULL,
  contact_name VARCHAR(120) DEFAULT NULL,
  phone VARCHAR(30) NOT NULL,
  address VARCHAR(255) NOT NULL,
  debt_balance DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  notes TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sku VARCHAR(60) NOT NULL UNIQUE,
  name VARCHAR(160) NOT NULL,
  category VARCHAR(120) DEFAULT 'Tile',
  unit ENUM('m2', 'box', 'piece') NOT NULL DEFAULT 'm2',
  price_per_m2 DECIMAL(12, 2) NOT NULL,
  quantity_in_stock DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  reorder_level DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS invoices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  invoice_number VARCHAR(50) NOT NULL UNIQUE,
  customer_id INT NOT NULL,
  invoice_date DATE NOT NULL,
  due_date DATE NOT NULL,
  subtotal DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  discount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  tax DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  amount_paid DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  payment_status ENUM('paid', 'unpaid', 'partial') NOT NULL DEFAULT 'unpaid',
  notes TEXT DEFAULT NULL,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_invoices_customer FOREIGN KEY (customer_id) REFERENCES customers(id),
  CONSTRAINT fk_invoices_user FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS invoice_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  invoice_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity DECIMAL(12, 2) NOT NULL,
  unit_price DECIMAL(12, 2) NOT NULL,
  line_total DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_invoice_items_invoice FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
  CONSTRAINT fk_invoice_items_product FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS debts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  invoice_id INT DEFAULT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  amount_paid DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  due_date DATE NOT NULL,
  status ENUM('paid', 'unpaid', 'partial', 'overdue') NOT NULL DEFAULT 'unpaid',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_debts_customer FOREIGN KEY (customer_id) REFERENCES customers(id),
  CONSTRAINT fk_debts_invoice FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS debt_payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  debt_id INT NOT NULL,
  customer_id INT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  payment_date DATE NOT NULL,
  method VARCHAR(60) DEFAULT 'cash',
  notes VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_debt_payments_debt FOREIGN KEY (debt_id) REFERENCES debts(id) ON DELETE CASCADE,
  CONSTRAINT fk_debt_payments_customer FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE IF NOT EXISTS workers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  phone VARCHAR(30) DEFAULT NULL,
  role_title VARCHAR(120) DEFAULT NULL,
  salary_amount DECIMAL(12, 2) NOT NULL,
  payment_due_date DATE NOT NULL,
  status ENUM('paid', 'unpaid', 'partial') NOT NULL DEFAULT 'unpaid',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS worker_payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  worker_id INT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  payment_date DATE NOT NULL,
  payment_week_start DATE DEFAULT NULL,
  method VARCHAR(60) DEFAULT 'bank transfer',
  notes VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_worker_payments_worker FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE
);

CREATE INDEX idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX idx_debts_customer_id ON debts(customer_id);
CREATE INDEX idx_debt_payments_customer_id ON debt_payments(customer_id);
CREATE INDEX idx_worker_payments_worker_id ON worker_payments(worker_id);
