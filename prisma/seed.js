const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Sample products for the farm
  const products = [
    {
      name: 'Ghost Pepper',
      description: 'Extremely hot pepper originating from India. Perfect for those who love extreme heat.',
      category: 'pepper',
      variety: 'Bhut Jolokia',
      origin: 'Asian',
      price: 25.99,
      unit: 'per lb',
      stock: 50,
      minStock: 10,
      maxStock: 200,
      status: 'active',
      tags: JSON.stringify(['hot', 'spicy', 'premium', 'exotic']),
      nutritionInfo: JSON.stringify({
        vitamins: ['Vitamin C', 'Vitamin A'],
        scoville: '1,000,000+ SHU',
        capsaicin: 'Very High'
      }),
      growingInfo: JSON.stringify({
        season: 'Summer',
        growingTime: '120-140 days',
        difficulty: 'Advanced'
      })
    },
    {
      name: 'Scotch Bonnet',
      description: 'Caribbean hot pepper with fruity flavor and intense heat.',
      category: 'pepper',
      variety: 'Scotch Bonnet',
      origin: 'Caribbean',
      price: 18.99,
      unit: 'per lb',
      stock: 75,
      minStock: 15,
      maxStock: 150,
      status: 'active',
      tags: JSON.stringify(['hot', 'caribbean', 'fruity', 'traditional']),
      nutritionInfo: JSON.stringify({
        vitamins: ['Vitamin C', 'Vitamin A'],
        scoville: '100,000-350,000 SHU',
        flavor: 'Fruity and sweet'
      }),
      growingInfo: JSON.stringify({
        season: 'Summer',
        growingTime: '90-120 days',
        difficulty: 'Intermediate'
      })
    },
    {
      name: 'Habanero Orange',
      description: 'Classic orange habanero with citrusy heat and bright flavor.',
      category: 'pepper',
      variety: 'Habanero',
      origin: 'Caribbean',
      price: 15.99,
      unit: 'per lb',
      stock: 100,
      minStock: 20,
      maxStock: 200,
      status: 'active',
      tags: JSON.stringify(['hot', 'citrusy', 'popular', 'versatile']),
      nutritionInfo: JSON.stringify({
        vitamins: ['Vitamin C', 'Vitamin A'],
        scoville: '100,000-350,000 SHU',
        flavor: 'Citrusy and floral'
      }),
      growingInfo: JSON.stringify({
        season: 'Summer',
        growingTime: '75-100 days',
        difficulty: 'Beginner'
      })
    },
    {
      name: 'African Bird\'s Eye',
      description: 'Small but mighty African chili pepper with intense heat.',
      category: 'pepper',
      variety: 'Piri Piri',
      origin: 'African',
      price: 22.99,
      unit: 'per lb',
      stock: 40,
      minStock: 8,
      maxStock: 120,
      status: 'active',
      tags: JSON.stringify(['hot', 'african', 'small', 'intense']),
      nutritionInfo: JSON.stringify({
        vitamins: ['Vitamin C', 'Vitamin A'],
        scoville: '50,000-175,000 SHU',
        flavor: 'Sharp and smoky'
      }),
      growingInfo: JSON.stringify({
        season: 'Summer',
        growingTime: '80-100 days',
        difficulty: 'Intermediate'
      })
    },
    {
      name: 'Thai Dragon',
      description: 'Fiery Asian chili pepper perfect for authentic Thai cuisine.',
      category: 'pepper',
      variety: 'Thai Hot',
      origin: 'Asian',
      price: 16.99,
      unit: 'per lb',
      stock: 65,
      minStock: 12,
      maxStock: 150,
      status: 'active',
      tags: JSON.stringify(['hot', 'asian', 'authentic', 'cuisine']),
      nutritionInfo: JSON.stringify({
        vitamins: ['Vitamin C', 'Vitamin A'],
        scoville: '50,000-100,000 SHU',
        flavor: 'Clean heat'
      }),
      growingInfo: JSON.stringify({
        season: 'Summer',
        growingTime: '70-85 days',
        difficulty: 'Beginner'
      })
    },
    {
      name: 'Caribbean Red Hot',
      description: 'Blend of Caribbean hot peppers perfect for hot sauces.',
      category: 'pepper',
      variety: 'Mixed Variety',
      origin: 'Caribbean',
      price: 19.99,
      unit: 'per lb',
      stock: 85,
      minStock: 15,
      maxStock: 180,
      status: 'active',
      tags: JSON.stringify(['hot', 'blend', 'sauce', 'caribbean']),
      nutritionInfo: JSON.stringify({
        vitamins: ['Vitamin C', 'Vitamin A'],
        scoville: '30,000-200,000 SHU',
        flavor: 'Complex and fruity'
      }),
      growingInfo: JSON.stringify({
        season: 'Summer',
        growingTime: '80-110 days',
        difficulty: 'Intermediate'
      })
    },
    {
      name: 'Mild Poblano',
      description: 'Large, mild pepper perfect for stuffing and roasting.',
      category: 'pepper',
      variety: 'Poblano',
      origin: 'Mexican',
      price: 8.99,
      unit: 'per lb',
      stock: 120,
      minStock: 25,
      maxStock: 250,
      status: 'active',
      tags: JSON.stringify(['mild', 'large', 'stuffing', 'roasting']),
      nutritionInfo: JSON.stringify({
        vitamins: ['Vitamin C', 'Vitamin A'],
        scoville: '1,000-2,000 SHU',
        flavor: 'Mild and earthy'
      }),
      growingInfo: JSON.stringify({
        season: 'Summer',
        growingTime: '65-85 days',
        difficulty: 'Beginner'
      })
    },
    {
      name: 'Jalapeño Fresh',
      description: 'Classic fresh jalapeños with medium heat and great flavor.',
      category: 'pepper',
      variety: 'Jalapeño',
      origin: 'Mexican',
      price: 6.99,
      unit: 'per lb',
      stock: 200,
      minStock: 40,
      maxStock: 400,
      status: 'active',
      tags: JSON.stringify(['medium', 'fresh', 'popular', 'versatile']),
      nutritionInfo: JSON.stringify({
        vitamins: ['Vitamin C', 'Vitamin A'],
        scoville: '2,500-8,000 SHU',
        flavor: 'Fresh and grassy'
      }),
      growingInfo: JSON.stringify({
        season: 'Summer',
        growingTime: '65-75 days',
        difficulty: 'Beginner'
      })
    },
    {
      name: 'Organic Cilantro',
      description: 'Fresh organic cilantro perfect for garnishing and cooking.',
      category: 'herb',
      variety: 'Standard',
      origin: 'Local',
      price: 3.99,
      unit: 'per bunch',
      stock: 80,
      minStock: 20,
      maxStock: 150,
      status: 'active',
      tags: JSON.stringify(['organic', 'fresh', 'herb', 'garnish']),
      nutritionInfo: JSON.stringify({
        vitamins: ['Vitamin K', 'Vitamin C', 'Vitamin A'],
        minerals: ['Potassium', 'Manganese'],
        antioxidants: 'High'
      }),
      growingInfo: JSON.stringify({
        season: 'Spring/Fall',
        growingTime: '40-50 days',
        difficulty: 'Beginner'
      })
    },
    {
      name: 'Thai Basil',
      description: 'Aromatic Thai basil with distinctive anise flavor.',
      category: 'herb',
      variety: 'Thai Sweet Basil',
      origin: 'Asian',
      price: 4.99,
      unit: 'per bunch',
      stock: 60,
      minStock: 15,
      maxStock: 120,
      status: 'active',
      tags: JSON.stringify(['aromatic', 'thai', 'anise', 'cooking']),
      nutritionInfo: JSON.stringify({
        vitamins: ['Vitamin K', 'Vitamin A'],
        flavor: 'Anise and clove',
        essential_oils: 'High'
      }),
      growingInfo: JSON.stringify({
        season: 'Summer',
        growingTime: '60-75 days',
        difficulty: 'Beginner'
      })
    }
  ];

  // Insert products
  for (const product of products) {
    await prisma.product.create({
      data: product
    });
  }

  // Sample fields
  const fields = [
    {
      name: 'Field A - African Varieties',
      size: '2.5 acres',
      location: 'North Section',
      soilType: 'Loamy',
      soilPh: 6.5,
      status: 'active',
      crop: 'Hot Peppers',
      progress: 75,
      temperature: '78°F',
      humidity: '65%',
      notes: 'Focused on African pepper varieties including Bird\'s Eye and other traditional peppers.'
    },
    {
      name: 'Field B - Asian Mix',
      size: '1.8 acres',
      location: 'East Section',
      soilType: 'Sandy Loam',
      soilPh: 6.2,
      status: 'active',
      crop: 'Asian Peppers & Herbs',
      progress: 60,
      temperature: '76°F',
      humidity: '70%',
      notes: 'Growing Thai peppers, Asian herbs, and specialty varieties for ethnic cuisine.'
    },
    {
      name: 'Field C - Caribbean Heat',
      size: '3.0 acres',
      location: 'South Section',
      soilType: 'Clay Loam',
      soilPh: 6.8,
      status: 'active',
      crop: 'Caribbean Peppers',
      progress: 85,
      temperature: '80°F',
      humidity: '68%',
      notes: 'Specializing in Scotch Bonnets, Habaneros, and other Caribbean varieties.'
    }
  ];

  for (const field of fields) {
    await prisma.field.create({
      data: field
    });
  }

  // Sample customers
  const customers = [
    {
      name: 'Hot Sauce Heaven',
      email: 'orders@hotsauceheaven.com',
      phone: '(555) 123-4567',
      address: '123 Spice Street',
      city: 'Phoenix',
      state: 'AZ',
      zipCode: '85001',
      customerType: 'business',
      status: 'active',
      leadScore: 95
    },
    {
      name: 'Maria Rodriguez',
      email: 'maria.rodriguez@email.com',
      phone: '(555) 234-5678',
      address: '456 Pepper Lane',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      customerType: 'individual',
      status: 'active',
      leadScore: 75
    },
    {
      name: 'Spice Market Restaurant',
      email: 'chef@spicemarket.com',
      phone: '(555) 345-6789',
      address: '789 Flavor Ave',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101',
      customerType: 'restaurant',
      status: 'active',
      leadScore: 88
    }
  ];

  for (const customer of customers) {
    await prisma.customer.create({
      data: customer
    });
  }

  console.log('Database seeded successfully!');
  console.log(`Created ${products.length} products`);
  console.log(`Created ${fields.length} fields`);
  console.log(`Created ${customers.length} customers`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
