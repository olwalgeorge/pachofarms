// Sample data for seeding the PachoFarms database

const productsData = [
  {
    name: 'Ghost Pepper',
    description: 'Extremely hot pepper known for its intense heat',
    category: 'pepper',
    variety: 'Ghost Pepper',
    origin: 'Indian',
    price: 15.99,
    unit: 'per oz',
    stock: 25,
    min_stock: 5,
    max_stock: 100,
    status: 'active',
    tags: '["hot", "spicy", "rare"]',
    nutrition_info: '{"heat": "1,000,000+ SHU"}',
    growing_info: '{"climate": "hot and humid"}'
  },
  {
    name: 'Scotch Bonnet',
    description: 'Caribbean hot pepper with fruity flavor',
    category: 'pepper',
    variety: 'Scotch Bonnet',
    origin: 'Caribbean',
    price: 12.99,
    unit: 'per oz',
    stock: 30,
    min_stock: 5,
    max_stock: 100,
    status: 'active',
    tags: '["hot", "caribbean", "fruity"]',
    nutrition_info: '{"heat": "100,000-350,000 SHU"}',
    growing_info: '{"climate": "tropical"}'
  },
  {
    name: 'African Bird Eye',
    description: 'Small but mighty African chili',
    category: 'pepper',
    variety: 'Bird Eye',
    origin: 'African',
    price: 18.99,
    unit: 'per oz',
    stock: 15,
    min_stock: 5,
    max_stock: 100,
    status: 'active',
    tags: '["hot", "small", "intense"]',
    nutrition_info: '{"heat": "50,000-100,000 SHU"}',
    growing_info: '{"climate": "hot and dry"}'
  },
  {
    name: 'Thai Basil',
    description: 'Aromatic Asian herb with anise flavor',
    category: 'herb',
    variety: 'Thai Basil',
    origin: 'Asian',
    price: 8.99,
    unit: 'per bunch',
    stock: 20,
    min_stock: 10,
    max_stock: 50,
    status: 'active',
    tags: '["herb", "aromatic", "asian"]',
    nutrition_info: '{"vitamins": "A, K"}',
    growing_info: '{"climate": "warm and humid"}'
  },
  {
    name: 'Lemongrass',
    description: 'Citrusy aromatic grass used in cooking',
    category: 'herb',
    variety: 'Lemongrass',
    origin: 'Asian',
    price: 6.99,
    unit: 'per stalk',
    stock: 40,
    min_stock: 10,
    max_stock: 100,
    status: 'active',
    tags: '["herb", "citrus", "aromatic"]',
    nutrition_info: '{"antioxidants": "high"}',
    growing_info: '{"climate": "tropical"}'
  },
  {
    name: 'Habanero Orange',
    description: 'Classic orange habanero with fruity heat',
    category: 'pepper',
    variety: 'Habanero',
    origin: 'Mexican',
    price: 10.99,
    unit: 'per oz',
    stock: 35,
    min_stock: 8,
    max_stock: 80,
    status: 'active',
    tags: '["hot", "fruity", "classic"]',
    nutrition_info: '{"heat": "100,000-350,000 SHU", "vitamin_c": "high"}',
    growing_info: '{"climate": "warm and sunny", "days_to_harvest": "90-100"}'
  },
  {
    name: 'Carolina Reaper',
    description: 'World\'s hottest pepper - handle with extreme care',
    category: 'pepper',
    variety: 'Carolina Reaper',
    origin: 'American',
    price: 25.99,
    unit: 'per oz',
    stock: 10,
    min_stock: 2,
    max_stock: 25,
    status: 'active',
    tags: '["extreme", "hottest", "rare"]',
    nutrition_info: '{"heat": "2,200,000+ SHU"}',
    growing_info: '{"climate": "hot and humid", "days_to_harvest": "120+"}'
  }
];

const fieldsData = [
  {
    name: 'North Field',
    size: '2.5 acres',
    location: 'North section of farm',
    soil_type: 'Clay Loam',
    soil_ph: 6.5,
    status: 'active',
    crop: 'Ghost Peppers',
    progress: 75,
    temperature: '85°F',
    humidity: '70%',
    notes: 'Primary pepper growing field'
  },
  {
    name: 'Greenhouse A',
    size: '0.5 acres',
    location: 'Main greenhouse facility',
    soil_type: 'Controlled Mix',
    soil_ph: 6.8,
    status: 'active',
    crop: 'Thai Basil',
    progress: 60,
    temperature: '75°F',
    humidity: '65%',
    notes: 'Climate controlled herb production'
  },
  {
    name: 'South Field',
    size: '3.0 acres',
    location: 'Southern section',
    soil_type: 'Sandy Loam',
    soil_ph: 6.2,
    status: 'active',
    crop: 'Mixed Vegetables',
    progress: 45,
    temperature: '78°F',
    humidity: '60%',
    notes: 'Diverse crop rotation field'
  },
  {
    name: 'Greenhouse B',
    size: '0.3 acres',
    location: 'Secondary greenhouse',
    soil_type: 'Hydroponic',
    soil_ph: 6.0,
    status: 'active',
    crop: 'Carolina Reapers',
    progress: 30,
    temperature: '88°F',
    humidity: '75%',
    notes: 'Specialized facility for extreme heat varieties'
  }
];

const customersData = [
  {
    name: 'Spice Masters Restaurant',
    email: 'orders@spicemasters.com',
    phone: '555-0123',
    address: '123 Main St',
    city: 'Atlanta',
    state: 'GA',
    zip_code: '30309',
    customer_type: 'business',
    status: 'active',
    lead_score: 95,
    notes: 'Regular bulk buyer of hot peppers'
  },
  {
    name: 'Maria Rodriguez',
    email: 'maria.r@email.com',
    phone: '555-0456',
    address: '456 Oak Ave',
    city: 'Miami',
    state: 'FL',
    zip_code: '33101',
    customer_type: 'individual',
    status: 'active',
    lead_score: 80,
    notes: 'Loyal customer, prefers organic products'
  },
  {
    name: 'Global Foods Inc',
    email: 'procurement@globalfoods.com',
    phone: '555-0789',
    address: '789 Industrial Blvd',
    city: 'Houston',
    state: 'TX',
    zip_code: '77001',
    customer_type: 'business',
    status: 'active',
    lead_score: 90,
    notes: 'Large distributor, seasonal orders'
  },
  {
    name: 'Pepper Paradise Store',
    email: 'buying@pepperparadise.com',
    phone: '555-0321',
    address: '321 Spice Lane',
    city: 'Phoenix',
    state: 'AZ',
    zip_code: '85001',
    customer_type: 'business',
    status: 'active',
    lead_score: 85,
    notes: 'Specialty store focusing on rare pepper varieties'
  }
];

// Care Programs data that align with unified calendar types
const careProgramsData = [
  {
    name: 'Organic Fertilizer Program',
    type: 'fertilization',
    field_name: 'North Field',
    product: 'Organic Compost Blend',
    dosage: '2 lbs per 100 sq ft',
    frequency: 'bi-weekly',
    status: 'active',
    next_application_days: 7,
    notes: 'Custom organic blend for optimal pepper growth'
  },
  {
    name: 'Integrated Pest Management',
    type: 'pest_control',
    field_name: 'Greenhouse A',
    product: 'Neem Oil Solution',
    dosage: '1 tbsp per gallon',
    frequency: 'weekly',
    status: 'active',
    next_application_days: 3,
    notes: 'Preventive pest control using organic methods'
  },
  {
    name: 'Soil Conditioning Program',
    type: 'soil_conditioning',
    field_name: 'South Field',
    product: 'pH Buffer Mix',
    dosage: '5 lbs per 1000 sq ft',
    frequency: 'monthly',
    status: 'active',
    next_application_days: 14,
    notes: 'Maintain optimal soil pH for pepper cultivation'
  },
  {
    name: 'Disease Prevention Spray',
    type: 'disease_control',
    field_name: 'Greenhouse B',
    product: 'Copper Fungicide',
    dosage: '2 tsp per gallon',
    frequency: 'bi-weekly',
    status: 'active',
    next_application_days: 10,
    notes: 'Preventive treatment against fungal diseases'
  }
];

module.exports = {
  productsData,
  fieldsData,
  customersData,
  careProgramsData
};
