#!/usr/bin/env node

const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

async function setupDatabase() {
  try {
    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    console.log('🔌 Connecting to Neon database...');
    const sql = neon(databaseUrl);
    
    // Read the schema file
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📋 Executing database schema...');
    
    // Execute statements one by one
    console.log('� Creating UUID extension...');
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    
    console.log('📝 Creating products table...');
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
    
    console.log('📝 Creating fields table...');
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
    
    console.log('📝 Creating field_operations table...');
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
    
    console.log('📝 Creating care_programs table...');
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
    
    console.log('📝 Creating indexes...');
    // Check table columns before creating indexes
    const careProgColumns = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'care_programs'
    `;
    
    const fieldOpColumns = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'field_operations'
    `;
    
    console.log(`Care programs columns: ${careProgColumns.map(c => c.column_name).join(', ')}`);
    console.log(`Field operations columns: ${fieldOpColumns.map(c => c.column_name).join(', ')}`);
    
    if (careProgColumns.some(c => c.column_name === 'field_id')) {
      await sql`CREATE INDEX IF NOT EXISTS idx_care_programs_field_id ON care_programs(field_id)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_care_programs_status ON care_programs(status)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_care_programs_type ON care_programs(type)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_care_programs_next_application ON care_programs(next_application)`;
    } else {
      console.log('⚠️ Skipping care_programs indexes - field_id column not found');
    }
    
    if (fieldOpColumns.some(c => c.column_name === 'field_id')) {
      await sql`CREATE INDEX IF NOT EXISTS idx_field_operations_field_id ON field_operations(field_id)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_field_operations_status ON field_operations(status)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_field_operations_due_date ON field_operations(due_date)`;
    } else {
      console.log('⚠️ Skipping field_operations indexes - field_id column not found');
    }
    
    console.log('🌱 Inserting sample fields...');
    await sql`
      INSERT INTO fields (id, name, size, location, status) VALUES 
          ('field-1', 'Field A - African Varieties', '2.5 acres', 'North Section', 'active'),
          ('field-2', 'Field B - Asian Mix', '1.8 acres', 'East Section', 'active'),
          ('field-3', 'Field C - Caribbean Heat', '3.2 acres', 'South Section', 'active')
      ON CONFLICT (id) DO NOTHING
    `;
    
    console.log('🌱 Inserting sample care programs...');
    await sql`
      INSERT INTO care_programs (id, name, type, field_id, product, dosage, frequency, status, next_application, notes) VALUES 
          ('care-1', 'Organic Pest Control Program', 'spray', 'field-1', 'Neem Oil Solution', '2ml/L', 'weekly', 'active', '2024-01-22 07:00:00', 'Apply early morning or late evening to avoid leaf burn'),
          ('care-2', 'Nutrient Boost Program', 'fertilizer', 'field-2', 'NPK 10-10-10', '50g per plant', 'bi-weekly', 'active', '2024-01-29 08:00:00', 'Water thoroughly after application'),
          ('care-3', 'Morning Irrigation Schedule', 'watering', 'field-1', 'Drip Irrigation System', '2L per plant', 'daily', 'active', '2024-01-23 06:00:00', 'Check for proper water distribution')
      ON CONFLICT (id) DO NOTHING
    `;
    
    console.log('✅ Database schema setup complete!');
    console.log('🌱 Sample data has been inserted.');
    
    // Verify the setup by checking tables
    console.log('\n📊 Verifying database setup...');
    
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;
    
    console.log('📋 Created tables:');
    tables.forEach(table => {
      console.log(`  ✓ ${table.table_name}`);
    });
    
    // Check care programs
    const carePrograms = await sql`SELECT COUNT(*) as count FROM care_programs`;
    console.log(`\n🌿 Care programs: ${carePrograms[0].count}`);
    
    const fields = await sql`SELECT COUNT(*) as count FROM fields`;
    console.log(`🌾 Fields: ${fields[0].count}`);
    
    console.log('\n🎉 Database is ready to use!');
    console.log('🔗 You can now test the API endpoints:');
    console.log('   GET /api/care-programs');
    console.log('   POST /api/care-programs');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;
