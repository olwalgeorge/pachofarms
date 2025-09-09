#!/usr/bin/env node

const { neon } = require('@neondatabase/serverless');

// Load environment variables
require('dotenv').config();

async function checkDatabase() {
  try {
    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    const sql = neon(databaseUrl);
    
    console.log('📊 Checking existing database schema...');
    
    // Check tables
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;
    
    console.log('\n📋 Existing tables:');
    for (const table of tables) {
      console.log(`  📄 ${table.table_name}`);
      
      // Get columns for each table
      const columns = await sql`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = ${table.table_name}
        ORDER BY ordinal_position
      `;
      
      for (const col of columns) {
        console.log(`    - ${col.column_name} (${col.data_type}${col.is_nullable === 'NO' ? ', NOT NULL' : ''})`);
      }
    }
    
    // Check data
    if (tables.some(t => t.table_name === 'care_programs')) {
      const carePrograms = await sql`SELECT COUNT(*) as count FROM care_programs`;
      console.log(`\n🌿 Care programs count: ${carePrograms[0].count}`);
    }
    
    if (tables.some(t => t.table_name === 'fields')) {
      const fields = await sql`SELECT COUNT(*) as count FROM fields`;
      console.log(`🌾 Fields count: ${fields[0].count}`);
    }
    
  } catch (error) {
    console.error('❌ Database check failed:', error);
  }
}

if (require.main === module) {
  checkDatabase();
}

module.exports = checkDatabase;
