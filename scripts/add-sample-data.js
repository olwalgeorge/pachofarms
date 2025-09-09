#!/usr/bin/env node

const { neon } = require('@neondatabase/serverless');

// Load environment variables
require('dotenv').config();

async function addSampleData() {
  try {
    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    const sql = neon(databaseUrl);
    
    console.log('🌱 Adding sample care programs...');
    
    // First check if we have any fields to reference
    const existingFields = await sql`SELECT id, name FROM fields LIMIT 3`;
    
    if (existingFields.length === 0) {
      console.log('📄 No fields found, creating sample fields first...');
      
      await sql`
        INSERT INTO fields (id, name, size, location, status, "createdAt", "updatedAt") VALUES 
            ('field-1', 'Field A - African Varieties', '2.5 acres', 'North Section', 'active', NOW(), NOW()),
            ('field-2', 'Field B - Asian Mix', '1.8 acres', 'East Section', 'active', NOW(), NOW()),
            ('field-3', 'Field C - Caribbean Heat', '3.2 acres', 'South Section', 'active', NOW(), NOW())
        ON CONFLICT (id) DO NOTHING
      `;
      
      console.log('✅ Sample fields created');
    } else {
      console.log(`📄 Found ${existingFields.length} existing fields`);
    }
    
    // Get field IDs to use
    const fields = await sql`SELECT id FROM fields LIMIT 3`;
    const fieldIds = fields.map(f => f.id);
    
    if (fieldIds.length > 0) {
      // Insert sample care programs using existing field IDs
      await sql`
        INSERT INTO care_programs (id, name, type, field_id, product, dosage, frequency, status, next_application, notes, created_at, updated_at) VALUES 
            ('care-1', 'Organic Pest Control Program', 'spray', ${fieldIds[0]}, 'Neem Oil Solution', '2ml/L', 'weekly', 'active', '2024-02-22 07:00:00', 'Apply early morning or late evening to avoid leaf burn', NOW(), NOW()),
            ('care-2', 'Nutrient Boost Program', 'fertilizer', ${fieldIds[1] || fieldIds[0]}, 'NPK 10-10-10', '50g per plant', 'bi-weekly', 'active', '2024-02-29 08:00:00', 'Water thoroughly after application', NOW(), NOW()),
            ('care-3', 'Morning Irrigation Schedule', 'watering', ${fieldIds[0]}, 'Drip Irrigation System', '2L per plant', 'daily', 'active', '2024-02-23 06:00:00', 'Check for proper water distribution', NOW(), NOW())
        ON CONFLICT (id) DO NOTHING
      `;
      
      console.log('✅ Sample care programs created');
    }
    
    // Verify the data
    const carePrograms = await sql`SELECT COUNT(*) as count FROM care_programs`;
    console.log(`🌿 Total care programs: ${carePrograms[0].count}`);
    
    const samplePrograms = await sql`
      SELECT cp.name, cp.type, f.name as field_name 
      FROM care_programs cp 
      LEFT JOIN fields f ON cp.field_id = f.id 
      LIMIT 5
    `;
    
    console.log('\n📋 Sample care programs:');
    samplePrograms.forEach(program => {
      console.log(`  • ${program.name} (${program.type}) - Field: ${program.field_name || 'N/A'}`);
    });
    
    console.log('\n🎉 Sample data ready! You can now test:');
    console.log('   GET /api/care-programs');
    console.log('   View in the admin dashboard calendar');
    
  } catch (error) {
    console.error('❌ Failed to add sample data:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  addSampleData();
}

module.exports = addSampleData;
