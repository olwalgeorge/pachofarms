require('dotenv').config();
const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

// Get database URL from environment
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create Neon SQL client
const sql = neon(databaseUrl);

async function setupSchema() {
  try {
    console.log('Setting up database schema...');
    
    // Enable UUID extension
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    
    // Products table
    console.log('Creating products table...');
    await sql`
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
      )
    `;
    
    // Fields table
    console.log('Creating fields table...');
    await sql`
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
      )
    `;
    
    // Customers table
    console.log('Creating customers table...');
    await sql`
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
      )
    `;
    
    // Orders table
    console.log('Creating orders table...');
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
          id VARCHAR(255) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
          customer_id VARCHAR(255) REFERENCES customers(id) ON DELETE CASCADE,
          order_number VARCHAR(255) UNIQUE NOT NULL,
          status VARCHAR(255) DEFAULT 'pending',
          total DECIMAL(10,2) NOT NULL,
          subtotal DECIMAL(10,2),
          tax DECIMAL(10,2),
          shipping DECIMAL(10,2),
          discount DECIMAL(10,2),
          order_date TIMESTAMP DEFAULT NOW(),
          delivery_date TIMESTAMP,
          shipping_address TEXT,
          billing_address TEXT,
          payment_method VARCHAR(255),
          payment_status VARCHAR(255) DEFAULT 'pending',
          notes TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
      )
    `;
    
    // Field Operations table
    console.log('Creating field_operations table...');
    await sql`
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
      )
    `;
    
    // Care Programs table
    console.log('Creating care_programs table...');
    await sql`
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
      )
    `;
    
    // Inventory Logs table
    console.log('Creating inventory_logs table...');
    await sql`
      CREATE TABLE IF NOT EXISTS inventory_logs (
          id VARCHAR(255) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
          product_id VARCHAR(255) REFERENCES products(id) ON DELETE CASCADE,
          type VARCHAR(255) NOT NULL,
          quantity INTEGER NOT NULL,
          reason VARCHAR(255),
          reference VARCHAR(255),
          previous_stock INTEGER,
          new_stock INTEGER,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
      )
    `;
    
    console.log('Database schema setup completed successfully!');
  } catch (error) {
    console.error('Error setting up schema:', error);
    throw error;
  }
}

// Run the schema setup function
if (require.main === module) {
  setupSchema()
    .then(() => {
      console.log('Schema setup complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Schema setup failed:', error);
      process.exit(1);
    });
}

module.exports = { setupSchema };
