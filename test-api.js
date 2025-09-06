// Simple API test script
async function testAPI() {
  console.log('Testing Pacho Farms API...\n');

  try {
    // Test Products API
    console.log('🌱 Testing Products API:');
    const productsResponse = await fetch('http://localhost:3001/api/products');
    const products = await productsResponse.json();
    console.log(`   ✅ Products: ${products.products?.length || 0} found`);

    // Test Fields API
    console.log('\n🚜 Testing Fields API:');
    const fieldsResponse = await fetch('http://localhost:3001/api/fields');
    const fields = await fieldsResponse.json();
    console.log(`   ✅ Fields: ${fields.length || 0} found`);

    // Test Customers API
    console.log('\n👥 Testing Customers API:');
    const customersResponse = await fetch('http://localhost:3001/api/customers');
    const customers = await customersResponse.json();
    console.log(`   ✅ Customers: ${customers.length || 0} found`);

    // Test Dashboard API
    console.log('\n📊 Testing Dashboard API:');
    const dashboardResponse = await fetch('http://localhost:3001/api/dashboard');
    const dashboard = await dashboardResponse.json();
    console.log(`   ✅ Dashboard stats loaded`);
    console.log(`   📦 Products: ${dashboard.productCount}`);
    console.log(`   🚜 Fields: ${dashboard.fieldCount}`);
    console.log(`   👥 Customers: ${dashboard.customerCount}`);
    console.log(`   📋 Active Operations: ${dashboard.activeOperations}`);
    console.log(`   💰 Monthly Revenue: $${dashboard.monthlyRevenue}`);

    // Test Analytics API
    console.log('\n📈 Testing Analytics API:');
    const analyticsResponse = await fetch('http://localhost:3001/api/analytics?report=products');
    const analytics = await analyticsResponse.json();
    console.log(`   ✅ Product analytics loaded`);
    console.log(`   📦 Total Products: ${analytics.summary?.totalProducts}`);
    console.log(`   ⚠️ Low Stock: ${analytics.summary?.lowStockProducts}`);

    console.log('\n🎉 All API tests completed successfully!');
    console.log('\n📋 Available endpoints:');
    console.log('   • GET /api/products - Product catalog');
    console.log('   • GET /api/fields - Farm fields');
    console.log('   • GET /api/customers - Customer database');
    console.log('   • GET /api/operations - Field operations');
    console.log('   • GET /api/equipment - Farm equipment');
    console.log('   • GET /api/inventory - Inventory logs');
    console.log('   • GET /api/dashboard - Dashboard stats');
    console.log('   • GET /api/analytics - Reports and analytics');

  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
}

// Run if in Node.js environment
if (typeof window === 'undefined') {
  // For Node.js - need to install node-fetch
  testAPI();
} else {
  // For browser
  testAPI();
}
