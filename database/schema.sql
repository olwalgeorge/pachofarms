-- PostgreSQL Schema for PachoFarms
-- This schema replaces Prisma and works with Neon PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(255) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(255),
    variety VARCHAR(255),
    origin VARCHAR(255),
    price DECIMAL(10,2) NOT NULL,
    unit VARCHAR(255),
    stock INTEGER DEFAULT 0,
    min_stock INTEGER DEFAULT 5,
    max_stock INTEGER DEFAULT 100,
    status VARCHAR(255) DEFAULT 'active',
    image VARCHAR(255),
    tags TEXT,
    nutrition_info TEXT,
    growing_info TEXT,
    harvest_date TIMESTAMP,
    expiry_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Fields table
CREATE TABLE IF NOT EXISTS fields (
    id VARCHAR(255) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    name VARCHAR(255) NOT NULL,
    size VARCHAR(255),
    location VARCHAR(255),
    soil_type VARCHAR(255),
    soil_ph DECIMAL(4,2),
    status VARCHAR(255) DEFAULT 'active',
    crop VARCHAR(255),
    planting_date TIMESTAMP,
    expected_harvest TIMESTAMP,
    progress INTEGER DEFAULT 0,
    temperature VARCHAR(255),
    humidity VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Field Operations table
CREATE TABLE IF NOT EXISTS field_operations (
    id VARCHAR(255) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    field_id VARCHAR(255) REFERENCES fields(id) ON DELETE CASCADE,
    type VARCHAR(255),
    status VARCHAR(255) DEFAULT 'pending',
    priority VARCHAR(255) DEFAULT 'medium',
    assigned_to VARCHAR(255),
    estimated_hours INTEGER DEFAULT 1,
    actual_hours DECIMAL(5,2),
    progress INTEGER DEFAULT 0,
    due_date TIMESTAMP NOT NULL,
    completed_at TIMESTAMP,
    tags TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Care Programs table
CREATE TABLE IF NOT EXISTS care_programs (
    id VARCHAR(255) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    field_id VARCHAR(255) REFERENCES fields(id) ON DELETE CASCADE,
    product VARCHAR(255),
    dosage VARCHAR(255),
    frequency VARCHAR(255),
    status VARCHAR(255) DEFAULT 'active',
    next_application TIMESTAMP NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
    id VARCHAR(255) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(255),
    address VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(255),
    zip_code VARCHAR(255),
    customer_type VARCHAR(255) DEFAULT 'individual',
    status VARCHAR(255) DEFAULT 'active',
    lead_score INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(255) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    order_number VARCHAR(255) UNIQUE NOT NULL,
    customer_id VARCHAR(255) REFERENCES customers(id) ON DELETE CASCADE,
    status VARCHAR(255) DEFAULT 'pending',
    total DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) DEFAULT 0,
    shipping DECIMAL(10,2) DEFAULT 0,
    payment_status VARCHAR(255) DEFAULT 'pending',
    payment_method VARCHAR(255),
    shipping_address TEXT,
    order_date TIMESTAMP DEFAULT NOW(),
    shipped_date TIMESTAMP,
    delivered_date TIMESTAMP,
    notes TEXT
);

-- Order Items table
CREATE TABLE IF NOT EXISTS order_items (
    id VARCHAR(255) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    order_id VARCHAR(255) REFERENCES orders(id) ON DELETE CASCADE,
    product_id VARCHAR(255) REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL
);

-- Field Products junction table
CREATE TABLE IF NOT EXISTS field_products (
    id VARCHAR(255) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    field_id VARCHAR(255) REFERENCES fields(id) ON DELETE CASCADE,
    product_id VARCHAR(255) REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 0,
    planted_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(field_id, product_id)
);

-- Inventory Logs table
CREATE TABLE IF NOT EXISTS inventory_logs (
    id VARCHAR(255) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    product_id VARCHAR(255) REFERENCES products(id) ON DELETE CASCADE,
    type VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    reason VARCHAR(255),
    reference VARCHAR(255),
    previous_stock INTEGER NOT NULL,
    new_stock INTEGER NOT NULL,
    performed_by VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Equipment table
CREATE TABLE IF NOT EXISTS equipment (
    id VARCHAR(255) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255),
    model VARCHAR(255),
    serial_number VARCHAR(255),
    status VARCHAR(255) DEFAULT 'operational',
    condition VARCHAR(255) DEFAULT 'good',
    location VARCHAR(255),
    purchase_date TIMESTAMP,
    purchase_price DECIMAL(10,2),
    warranty VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(255),
    role VARCHAR(255) DEFAULT 'worker',
    status VARCHAR(255) DEFAULT 'active',
    hire_date TIMESTAMP,
    salary DECIMAL(10,2),
    permissions TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_care_programs_field_id ON care_programs(field_id);
CREATE INDEX IF NOT EXISTS idx_care_programs_status ON care_programs(status);
CREATE INDEX IF NOT EXISTS idx_care_programs_type ON care_programs(type);
CREATE INDEX IF NOT EXISTS idx_care_programs_next_application ON care_programs(next_application);

CREATE INDEX IF NOT EXISTS idx_field_operations_field_id ON field_operations(field_id);
CREATE INDEX IF NOT EXISTS idx_field_operations_status ON field_operations(status);
CREATE INDEX IF NOT EXISTS idx_field_operations_due_date ON field_operations(due_date);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);

CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Insert some sample data for testing
INSERT INTO fields (id, name, size, location, status) VALUES 
    ('field-1', 'Field A - African Varieties', '2.5 acres', 'North Section', 'active'),
    ('field-2', 'Field B - Asian Mix', '1.8 acres', 'East Section', 'active'),
    ('field-3', 'Field C - Caribbean Heat', '3.2 acres', 'South Section', 'active')
ON CONFLICT (id) DO NOTHING;

-- Insert sample care programs
INSERT INTO care_programs (id, name, type, field_id, product, dosage, frequency, status, next_application, notes) VALUES 
    ('care-1', 'Organic Pest Control Program', 'spray', 'field-1', 'Neem Oil Solution', '2ml/L', 'weekly', 'active', '2024-01-22 07:00:00', 'Apply early morning or late evening to avoid leaf burn'),
    ('care-2', 'Nutrient Boost Program', 'fertilizer', 'field-2', 'NPK 10-10-10', '50g per plant', 'bi-weekly', 'active', '2024-01-29 08:00:00', 'Water thoroughly after application'),
    ('care-3', 'Morning Irrigation Schedule', 'watering', 'field-1', 'Drip Irrigation System', '2L per plant', 'daily', 'active', '2024-01-23 06:00:00', 'Check for proper water distribution')
ON CONFLICT (id) DO NOTHING;
