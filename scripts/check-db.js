require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function checkTables() {
  try {
    console.log('Checking database structure...');
    
    // Check if products table exists and its columns
    const productColumns = await sql`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'products' 
      ORDER BY ordinal_position
    `;
    
    console.log('Products table columns:');
    console.log(productColumns);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkTables();
