const { PrismaClient } = require('@prisma/client');

async function addAdminUser() {
  const prisma = new PrismaClient();

  try {
    console.log('Adding admin user...\n');

    // Check if any users exist
    const userCount = await prisma.user.count();
    console.log(`Current users in database: ${userCount}`);

    // Add admin user if none exists
    if (userCount === 0) {
      const admin = await prisma.user.create({
        data: {
          name: 'Farm Administrator',
          email: 'admin@pachofarms.com',
          phone: '+1 (555) 000-0001',
          role: 'admin',
          status: 'active',
          hireDate: new Date(),
          permissions: JSON.stringify([
            'manage_products',
            'manage_fields', 
            'manage_customers',
            'manage_orders',
            'manage_inventory',
            'manage_equipment',
            'manage_users',
            'view_reports'
          ])
        }
      });

      console.log('✅ Admin user created:');
      console.log(`   Email: ${admin.email}`);
      console.log(`   Role: ${admin.role}`);
      console.log(`   ID: ${admin.id}`);
    } else {
      // Show existing users
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true
        }
      });

      console.log('Existing users:');
      users.forEach(user => {
        console.log(`   - ${user.name} (${user.email}) - Role: ${user.role} - Status: ${user.status}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addAdminUser();
