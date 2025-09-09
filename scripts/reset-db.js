require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function resetDatabase() {
  try {
    console.log('Resetting database...');
    
    // Drop existing tables in correct order (handle foreign key constraints)
    console.log('Dropping existing tables...');
    await sql`DROP TABLE IF EXISTS inventory_logs CASCADE`;
    await sql`DROP TABLE IF EXISTS care_programs CASCADE`;
    await sql`DROP TABLE IF EXISTS field_operations CASCADE`;
    await sql`DROP TABLE IF EXISTS order_items CASCADE`;
    await sql`DROP TABLE IF EXISTS orders CASCADE`;
    await sql`DROP TABLE IF EXISTS field_products CASCADE`;
    await sql`DROP TABLE IF EXISTS customers CASCADE`;
    await sql`DROP TABLE IF EXISTS fields CASCADE`;
    await sql`DROP TABLE IF EXISTS products CASCADE`;
    await sql`DROP TABLE IF EXISTS users CASCADE`;
    
    console.log('Tables dropped successfully!');
    console.log('Database reset complete. Now run: node scripts/setup-schema.js');
    
  } catch (error) {
    console.error('Error resetting database:', error);
  }
}

resetDatabase();
