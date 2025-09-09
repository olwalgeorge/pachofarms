require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function checkCarePrograms() {
  try {
    console.log('🔍 Checking Care Programs in Database...\n');
    
    const carePrograms = await sql`
      SELECT 
        cp.id,
        cp.name,
        cp.type,
        cp.product,
        cp.dosage,
        cp.frequency,
        cp.status,
        cp.next_application,
        cp.notes,
        f.name as field_name
      FROM care_programs cp
      LEFT JOIN fields f ON cp.field_id = f.id
      ORDER BY cp.created_at
    `;
    
    console.log(`📊 Found ${carePrograms.length} care programs:\n`);
    
    carePrograms.forEach((program, index) => {
      console.log(`${index + 1}. ${program.name}`);
      console.log(`   Type: ${program.type}`);
      console.log(`   Field: ${program.field_name}`);
      console.log(`   Product: ${program.product}`);
      console.log(`   Dosage: ${program.dosage}`);
      console.log(`   Frequency: ${program.frequency}`);
      console.log(`   Status: ${program.status}`);
      console.log(`   Next Application: ${program.next_application}`);
      console.log(`   Notes: ${program.notes}`);
      console.log('');
    });
    
    // Check field operations for comparison
    console.log('🔧 Field Operations for Reference:');
    const fieldOps = await sql`
      SELECT 
        fo.title,
        fo.type,
        fo.status,
        fo.due_date,
        f.name as field_name
      FROM field_operations fo
      LEFT JOIN fields f ON fo.field_id = f.id
      ORDER BY fo.created_at
    `;
    
    fieldOps.forEach((op, index) => {
      console.log(`${index + 1}. ${op.title} (${op.type}) - ${op.field_name}`);
      console.log(`   Status: ${op.status}, Due: ${op.due_date}`);
    });
    
  } catch (error) {
    console.error('Error checking care programs:', error);
  }
}

checkCarePrograms();
