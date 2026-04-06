-- LogiEdge Billing Dashboard
-- Database Schema Script

CREATE DATABASE logiedge;


CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  address TEXT,
  pan_card VARCHAR(20),
  gstin VARCHAR(20),
  gst_registered BOOLEAN DEFAULT false,
  status VARCHAR(10) DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL,
  status VARCHAR(10) DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE invoices (
  id SERIAL PRIMARY KEY,
  invoice_id VARCHAR(10) UNIQUE NOT NULL,
  customer_id INTEGER REFERENCES customers(id),
  subtotal NUMERIC(10,2),
  gst_amount NUMERIC(10,2) DEFAULT 0,
  total NUMERIC(10,2),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE invoice_items (
  id SERIAL PRIMARY KEY,
  invoice_id INTEGER REFERENCES invoices(id),
  item_id INTEGER REFERENCES items(id),
  quantity INTEGER,
  unit_price NUMERIC(10,2),
  line_total NUMERIC(10,2)
);

-- Data
INSERT INTO customers (name, address, pan_card, gstin, gst_registered, status) VALUES
('Gupta Enterprise Pvt. Ltd.', 'Gurgaon, Haryana', 'BCNSG1234H', '06BCNSG1234H1Z5', true, 'Active'),
('Mahesh Industries Pvt. Ltd.', 'Mumbai, Maharashtra', 'SPMS7234K', '27SPMS7234K1Z3', true, 'Active'),
('Omkar and Brothers Pvt. Ltd.', 'Pune, Maharashtra', 'OMBS1234P', '27OMBS1234P1Z1', false, 'Active'),
('Bhuwan Infotech', 'Delhi', 'BHWN4321Q', '07BHWN4321Q1Z2', false, 'Active'),
('Swastik Software Pvt. Ltd.', 'Jaipur, Rajasthan', 'SWSP5678R', '08SWSP5678R1Z4', true, 'Active');

INSERT INTO items (name, unit_price, status) VALUES
('Laptop', 85000.00, 'Active'),
('LED Monitor', 15000.00, 'Active'),
('Pen Drive', 500.00, 'Active'),
('Mobile Phone', 25000.00, 'Active'),
('Headphones', 3000.00, 'Inactive'),
('Power Bank', 2000.00, 'Active');