// Test script to verify care programs API integration
const testCarePrograms = async () => {
  try {
    console.log('Testing Care Programs API...');
    
    // Test GET care programs
    const getResponse = await fetch('http://localhost:3000/api/care-programs');
    const programs = await getResponse.json();
    console.log('✅ GET care programs:', programs);
    
    // Test POST new care program  
    const newProgram = {
      name: 'Test Spray Program',
      type: 'spray',
      fieldId: 'field-1',
      product: 'Neem Oil',
      dosage: '2ml/L',
      frequency: 'weekly',
      status: 'active',
      nextApplication: new Date().toISOString(),
      notes: 'Test care program for integration'
    };
    
    const postResponse = await fetch('http://localhost:3000/api/care-programs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newProgram)
    });
    
    if (postResponse.ok) {
      const createdProgram = await postResponse.json();
      console.log('✅ POST care program:', createdProgram);
    } else {
      console.log('❌ POST failed:', await postResponse.text());
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Run test if this file is executed directly
if (typeof window !== 'undefined') {
  testCarePrograms();
} else {
  module.exports = testCarePrograms;
}
