BEGIN;

DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS stalls CASCADE;
DROP TABLE IF EXISTS vendors CASCADE;
DROP TABLE IF EXISTS menu_categories CASCADE;
DROP TABLE IF EXISTS system_settings CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
 id SERIAL PRIMARY KEY,
 full_name VARCHAR(100) NOT NULL,
 email VARCHAR(150) NOT NULL UNIQUE,
 password_hash VARCHAR(255) NOT NULL,
 role VARCHAR(20) NOT NULL CHECK (role IN ('STUDENT','FACULTY','VENDOR','ADMIN')),
 is_active BOOLEAN NOT NULL DEFAULT TRUE,
 notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE menu_categories (
 id SERIAL PRIMARY KEY,
 name VARCHAR(80) NOT NULL UNIQUE,
 is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE vendors (
 id SERIAL PRIMARY KEY,
 user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
 business_name VARCHAR(120) NOT NULL,
 status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','SUSPENDED')),
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE stalls (
 id SERIAL PRIMARY KEY,
 vendor_id INTEGER REFERENCES vendors(id) ON DELETE SET NULL,
 name VARCHAR(120) NOT NULL,
 location VARCHAR(150) NOT NULL,
 category VARCHAR(80),
 opening_time TIME NOT NULL DEFAULT '08:00',
 closing_time TIME NOT NULL DEFAULT '20:00',
 service_charge_percent NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (service_charge_percent BETWEEN 0 AND 100),
 status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','SUSPENDED','INACTIVE')),
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE menu_items (
 id SERIAL PRIMARY KEY,
 stall_id INTEGER NOT NULL REFERENCES stalls(id) ON DELETE CASCADE,
 category_id INTEGER REFERENCES menu_categories(id) ON DELETE SET NULL,
 name VARCHAR(120) NOT NULL,
 description TEXT,
 price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
 prep_time_minutes INTEGER NOT NULL DEFAULT 10 CHECK (prep_time_minutes > 0),
 is_available BOOLEAN NOT NULL DEFAULT TRUE,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
 id SERIAL PRIMARY KEY,
 order_code VARCHAR(30) NOT NULL UNIQUE,
 user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
 stall_id INTEGER NOT NULL REFERENCES stalls(id) ON DELETE RESTRICT,
 status VARCHAR(20) NOT NULL DEFAULT 'PAYMENT_PENDING'
   CHECK (status IN ('PAYMENT_PENDING','PAYMENT_FAILED','RECEIVED','PREPARING','READY','COMPLETED','CANCELLED')),
 pickup_token VARCHAR(40) UNIQUE,
 pickup_start TIMESTAMP,
 pickup_end TIMESTAMP,
 subtotal NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
 service_charge NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (service_charge >= 0),
 total_amount NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
 estimated_ready_at TIMESTAMP,
 estimated_prep_minutes INTEGER CHECK (estimated_prep_minutes IS NULL OR estimated_prep_minutes > 0),
 placed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
 id SERIAL PRIMARY KEY,
 order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
 menu_item_id INTEGER REFERENCES menu_items(id) ON DELETE SET NULL,
 item_name VARCHAR(120) NOT NULL,
 unit_price NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
 quantity INTEGER NOT NULL CHECK (quantity > 0),
 line_total NUMERIC(10,2) NOT NULL CHECK (line_total >= 0)
);

CREATE TABLE payments (
 id SERIAL PRIMARY KEY,
 order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
 payment_method VARCHAR(30) NOT NULL CHECK (payment_method IN ('BKASH_SANDBOX','SSLCOMMERZ_SANDBOX')),
 transaction_reference VARCHAR(120) UNIQUE,
 amount NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
 status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','SUCCESS','FAILED','DISPUTED')),
 failure_reason TEXT,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
 id SERIAL PRIMARY KEY,
 user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
 notification_type VARCHAR(30) NOT NULL CHECK (notification_type IN ('ORDER_CONFIRMED','ORDER_READY','PAYMENT_FAILED')),
 message TEXT NOT NULL,
 delivery_status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (delivery_status IN ('PENDING','SENT','FAILED')),
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE system_settings (
 id SERIAL PRIMARY KEY,
 setting_key VARCHAR(100) NOT NULL UNIQUE,
 setting_value VARCHAR(255) NOT NULL,
 description TEXT,
 updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_menu_items_stall_id ON menu_items(stall_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_stall_id ON orders(stall_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_status ON payments(status);

-- admin@northsouth.edu    / Admin123!
-- vendor1@northsouth.edu  / Vendor123!
-- student1@northsouth.edu / Student123!
-- faculty1@northsouth.edu / Faculty123!
INSERT INTO users (full_name,email,password_hash,role) VALUES
('System Admin','admin@northsouth.edu','$2b$10$fJR/NnA7Ih0Pho4nrs3XiuFQYdZLIqQ341gc9yhe309VD8TPST1EK','ADMIN'),
('Arafat Vendor','vendor1@northsouth.edu','$2b$10$0up69nvMIp9en6avZmq4xOlxSOfmQpeLbjngPZPPkELelGychPvN2','VENDOR'),
('Sajida Student','student1@northsouth.edu','$2b$10$3HaVJNcJSD/cQL7YTdsUIOVyaSOVmq8E5GPFsdtsFCIjLamiiuNdq','STUDENT'),
('Faculty Demo','faculty1@northsouth.edu','$2b$10$zdiJO6NsisBsb.R/maduyuGo77YxXar6aPS16uRUx546w5NozCfKy','FACULTY');

INSERT INTO menu_categories (name) VALUES ('Rice'),('Snacks'),('Drinks');
INSERT INTO vendors (user_id,business_name,status) VALUES (2,'Campus Food Corner','ACTIVE');
INSERT INTO stalls (vendor_id,name,location,category,opening_time,closing_time,service_charge_percent,status) VALUES
(1,'Food Corner A','NSU Cafeteria - Ground Floor','Main Meals','08:00','20:00',0,'ACTIVE');

INSERT INTO menu_items (stall_id,category_id,name,description,price,prep_time_minutes,is_available) VALUES
(1,1,'Chicken Fried Rice','Rice with chicken and vegetables',180.00,15,TRUE),
(1,2,'Chicken Burger','Chicken patty burger',150.00,10,TRUE),
(1,3,'Soft Drink','Chilled soft drink',40.00,2,TRUE);

INSERT INTO orders (order_code,user_id,stall_id,status,pickup_token,pickup_start,pickup_end,subtotal,service_charge,total_amount,estimated_ready_at,estimated_prep_minutes) VALUES
('ORD-1001',3,1,'RECEIVED','NSU-A7K2',
 CURRENT_TIMESTAMP + INTERVAL '15 minutes',
 CURRENT_TIMESTAMP + INTERVAL '30 minutes',
 180.00,0.00,180.00,CURRENT_TIMESTAMP + INTERVAL '15 minutes',15);

INSERT INTO order_items (order_id,menu_item_id,item_name,unit_price,quantity,line_total) VALUES
(1,1,'Chicken Fried Rice',180.00,1,180.00);

INSERT INTO payments (order_id,payment_method,transaction_reference,amount,status,failure_reason) VALUES
(1,'BKASH_SANDBOX','BKASH-TEST-10001',180.00,'SUCCESS',NULL);

INSERT INTO notifications (user_id,order_id,notification_type,message,delivery_status) VALUES
(3,1,'ORDER_CONFIRMED','Your order ORD-1001 is confirmed. Pickup token: NSU-A7K2','SENT');

INSERT INTO orders (order_code,user_id,stall_id,status,subtotal,service_charge,total_amount,estimated_prep_minutes) VALUES
('ORD-1002',4,1,'PAYMENT_FAILED',150.00,0.00,150.00,10);

INSERT INTO order_items (order_id,menu_item_id,item_name,unit_price,quantity,line_total) VALUES
(2,2,'Chicken Burger',150.00,1,150.00);

INSERT INTO payments (order_id,payment_method,transaction_reference,amount,status,failure_reason) VALUES
(2,'SSLCOMMERZ_SANDBOX','SSL-TEST-10002',150.00,'FAILED','Sandbox payment simulation failed');

INSERT INTO notifications (user_id,order_id,notification_type,message,delivery_status) VALUES
(4,2,'PAYMENT_FAILED','Payment failed for order ORD-1002. Please try again.','SENT');

INSERT INTO system_settings (setting_key,setting_value,description) VALUES
('default_service_charge_percent','0','Default service charge percentage'),
('notification_provider','FIREBASE','Push notification provider'),
('system_status','ACTIVE','Overall platform status');

COMMIT;
