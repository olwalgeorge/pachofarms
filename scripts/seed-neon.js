require('dotenv').config();
const { neon } = require('@neondatabase/serverless');
const { productsData, fieldsData, customersData, careProgramsData } = require('./seed-data.js');

// Get database URL from environment
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create Neon SQL client
const sql = neon(databaseUrl);

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // First ensure tables exist by running the schema
    console.log('Setting up database schema...');
    
    // Enable UUID extension
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Products
    console.log('Seeding products...');
    for (const product of productsData) {
      await sql`
        INSERT INTO products (
          id, name, description, category, variety, origin, price, unit, 
          stock, min_stock, max_stock, status, tags, nutrition_info, growing_info
        )
        VALUES (
          uuid_generate_v4()::text,
          ${product.name},
          ${product.description},
          ${product.category},
          ${product.variety},
          ${product.origin},
          ${product.price},
          ${product.unit},
          ${product.stock},
          ${product.min_stock},
          ${product.max_stock},
          ${product.status},
          ${product.tags},
          ${product.nutrition_info},
          ${product.growing_info}
        )
      `;
      console.log(`  ✓ Added product: ${product.name}`);
    }

    // Fields
    console.log('Seeding fields...');
    for (const field of fieldsData) {
      await sql`
        INSERT INTO fields (
          id, name, size, location, soil_type, soil_ph, status, crop, 
          progress, temperature, humidity, notes
        )
        VALUES (
          uuid_generate_v4()::text,
          ${field.name},
          ${field.size},
          ${field.location},
          ${field.soil_type},
          ${field.soil_ph},
          ${field.status},
          ${field.crop},
          ${field.progress},
          ${field.temperature},
          ${field.humidity},
          ${field.notes}
        )
      `;
      console.log(`  ✓ Added field: ${field.name}`);
    }

    // Customers
    console.log('Seeding customers...');
    for (const customer of customersData) {
      try {
        await sql`
          INSERT INTO customers (
            id, name, email, phone, address, city, state, zip_code, 
            customer_type, status, lead_score, notes
          )
          VALUES (
            uuid_generate_v4()::text,
            ${customer.name},
            ${customer.email},
            ${customer.phone},
            ${customer.address},
            ${customer.city},
            ${customer.state},
            ${customer.zip_code},
            ${customer.customer_type},
            ${customer.status},
            ${customer.lead_score},
            ${customer.notes}
          )
          ON CONFLICT (email) DO NOTHING
        `;
        console.log(`  ✓ Added customer: ${customer.name}`);
      } catch (error) {
        console.log(`  ⚠ Customer ${customer.name} already exists or error occurred`);
      }
    }

    // Orders
    console.log('Seeding orders...');
    try {
      const orderResult = await sql`
        INSERT INTO orders (id, customer_id, order_number, status, total, order_date, shipping_address, notes)
        SELECT 
          uuid_generate_v4()::text,
          c.id,
          'ORD-' || TO_CHAR(CURRENT_DATE, 'YYMMDD') || '-' || LPAD((ROW_NUMBER() OVER())::text, 6, '0'),
          'completed',
          125.50,
          CURRENT_DATE - INTERVAL '5 days',
          c.address || ', ' || c.city || ', ' || c.state || ' ' || c.zip_code,
          'Bulk order for restaurant'
        FROM customers c
        WHERE c.email = 'orders@spicemasters.com'
        AND NOT EXISTS (SELECT 1 FROM orders WHERE order_number LIKE 'ORD-' || TO_CHAR(CURRENT_DATE, 'YYMMDD') || '%')
        LIMIT 1
        RETURNING id, customer_id
      `;
      
      if (orderResult.length > 0) {
        console.log('  ✓ Added sample order');
      } else {
        console.log('  ⚠ Sample order already exists');
      }
    } catch (error) {
      console.log('  ⚠ Order already exists or error occurred');
    }

    // Field Operations
    console.log('Seeding field operations...');
    try {
      await sql`
        INSERT INTO field_operations (id, title, description, field_id, type, status, priority, assigned_to, estimated_hours, due_date, tags)
        SELECT 
          uuid_generate_v4()::text,
          'Pest Control Treatment',
          'Apply organic pest control to pepper plants',
          f.id,
          'pest_control',
          'pending',
          'high',
          'John Smith',
          3,
          CURRENT_DATE + INTERVAL '2 days',
          '["pest_control", "organic"]'
        FROM fields f 
        WHERE f.name = 'North Field'
        AND NOT EXISTS (SELECT 1 FROM field_operations WHERE title = 'Pest Control Treatment' AND field_id = f.id)
        LIMIT 1
      `;
      console.log('  ✓ Added field operation');
    } catch (error) {
      console.log('  ⚠ Field operation already exists or error occurred');
    }

    // Care Programs
    console.log('Seeding care programs...');
    for (const program of careProgramsData) {
      try {
        const nextAppDate = new Date();
        nextAppDate.setDate(nextAppDate.getDate() + program.next_application_days);
        
        await sql`
          INSERT INTO care_programs (id, name, type, field_id, product, dosage, frequency, status, next_application, notes)
          SELECT 
            uuid_generate_v4()::text,
            ${program.name},
            ${program.type},
            f.id,
            ${program.product},
            ${program.dosage},
            ${program.frequency},
            ${program.status},
            ${nextAppDate.toISOString()},
            ${program.notes}
          FROM fields f 
          WHERE f.name = ${program.field_name}
          AND NOT EXISTS (SELECT 1 FROM care_programs WHERE name = ${program.name} AND field_id = f.id)
          LIMIT 1
        `;
        console.log(`  ✓ Added care program: ${program.name}`);
      } catch (error) {
        console.log(`  ⚠ Care program ${program.name} error: ${error.message}`);
      }
    }

    console.log('Database seeding completed successfully!');
    
    // Summary
    console.log('\n📊 Seeding Summary:');
    console.log(`✓ ${productsData.length} products added`);
    console.log(`✓ ${fieldsData.length} fields added`);
    console.log(`✓ ${customersData.length} customers added`);
    console.log(`✓ ${careProgramsData.length} care programs added`);
    console.log('✓ 1 order with related data');
    console.log('✓ Field operations');
    console.log('\n🎉 Your PachoFarms database is ready to go!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

// Run the seed function
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Seeding complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedDatabase };
