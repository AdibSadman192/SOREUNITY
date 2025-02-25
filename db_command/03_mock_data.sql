-- Mock Data for STOREFRONT Universal ERP System

-- Users
INSERT INTO users (email, full_name, role, password_hash) VALUES
('admin@storefront.com', 'Admin User', 'admin', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4oL4ELyjIS'),
('manager@store1.com', 'Store Manager', 'manager', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4oL4ELyjIS'),
('staff@store1.com', 'Staff Member', 'staff', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4oL4ELyjIS');

-- Stores
INSERT INTO stores (name, address, phone, email, timezone) VALUES
('Main Store', '123 Main St, City, Country', '+1234567890', 'main@storefront.com', 'UTC'),
('Branch Store', '456 Branch St, City, Country', '+1234567891', 'branch@storefront.com', 'UTC');

-- Products
INSERT INTO products (sku, name, description, category, price, cost, tax_rate) VALUES
('PROD001', 'Laptop Pro', 'High-end laptop', 'Electronics', 1299.99, 900.00, 10.00),
('PROD002', 'Smartphone X', 'Latest smartphone', 'Electronics', 999.99, 700.00, 10.00),
('PROD003', 'Office Chair', 'Ergonomic chair', 'Furniture', 199.99, 100.00, 8.00);

-- Inventory
INSERT INTO inventory (store_id, product_id, quantity, min_quantity, max_quantity)
SELECT 
    s.id,
    p.id,
    FLOOR(RANDOM() * 100 + 10),
    5,
    100
FROM stores s
CROSS JOIN products p;

-- Customers
INSERT INTO customers (email, first_name, last_name, phone, address, loyalty_points) VALUES
('john@example.com', 'John', 'Doe', '+1234567892', '789 Customer St, City', 100),
('jane@example.com', 'Jane', 'Smith', '+1234567893', '321 Client St, City', 150);

-- Orders
INSERT INTO orders (customer_id, store_id, total_amount, tax_amount, status, payment_status, payment_method)
SELECT 
    c.id,
    s.id,
    199.99,
    20.00,
    'completed',
    'paid',
    'credit_card'
FROM customers c
CROSS JOIN stores s
LIMIT 2;

-- Order Items
INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price)
SELECT 
    o.id,
    p.id,
    1,
    p.price,
    p.price
FROM orders o
CROSS JOIN products p
LIMIT 3;

-- Employees
INSERT INTO employees (user_id, store_id, position, department, salary, hire_date, status)
SELECT 
    u.id,
    s.id,
    CASE WHEN u.role = 'manager' THEN 'Store Manager' ELSE 'Sales Associate' END,
    'Sales',
    CASE WHEN u.role = 'manager' THEN 60000 ELSE 35000 END,
    CURRENT_DATE - INTERVAL '6 months',
    'active'
FROM users u
CROSS JOIN stores s
WHERE u.role IN ('manager', 'staff')
LIMIT 2;

-- Attendance
INSERT INTO attendance (employee_id, check_in, check_out, status, notes)
SELECT 
    e.id,
    CURRENT_TIMESTAMP - INTERVAL '8 hours',
    CURRENT_TIMESTAMP,
    'present',
    'Regular shift'
FROM employees e;

-- Transactions
INSERT INTO transactions (store_id, type, amount, status, reference_type, reference_id)
SELECT 
    o.store_id,
    'sale',
    o.total_amount,
    'completed',
    'order',
    o.id
FROM orders o;

-- Expenses
INSERT INTO expenses (store_id, category, amount, description, date, status)
SELECT 
    id,
    'Utilities',
    1000.00,
    'Monthly utility payment',
    CURRENT_DATE,
    'paid'
FROM stores;

-- Shipments
INSERT INTO shipments (order_id, carrier, tracking_number, status, shipping_date, estimated_delivery)
SELECT 
    id,
    'FastShip',
    'TRACK' || id,
    'in_transit',
    CURRENT_TIMESTAMP - INTERVAL '2 days',
    CURRENT_TIMESTAMP + INTERVAL '3 days'
FROM orders;

-- Returns
INSERT INTO returns (order_id, customer_id, status, reason, return_date, refund_amount)
SELECT 
    o.id,
    o.customer_id,
    'pending',
    'Wrong size',
    CURRENT_TIMESTAMP,
    o.total_amount
FROM orders o
LIMIT 1;

-- System Logs
INSERT INTO system_logs (level, message, context)
VALUES
('INFO', 'System startup', '{"version": "1.0.0"}'),
('WARNING', 'High CPU usage detected', '{"usage": 85}');

-- Audit Trail
INSERT INTO audit_trail (user_id, action, table_name, record_id, changes)
SELECT 
    u.id,
    'create',
    'orders',
    o.id,
    '{"status": "new"}'
FROM users u
CROSS JOIN orders o
WHERE u.role = 'staff'
LIMIT 1;