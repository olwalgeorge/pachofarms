
'use client';
import { useState } from 'react';

interface FieldOperation {
  id: number;
  title: string;
  description: string;
  type: 'planting' | 'harvesting' | 'irrigation' | 'fertilizing' | 'pest-control' | 'weeding' | 'pruning' | 'soil-prep';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'planned' | 'scheduled' | 'in-progress' | 'on-hold' | 'completed' | 'cancelled';
  field: string;
  assignedSupervisor: string;
  assignedWorkers: string[];
  scheduledDate: string;
  estimatedDuration: number;
  actualDuration?: number;
  completionDate?: string;
  requiredMaterials: Material[];
  assignedEquipment: Equipment[];
  skillsRequired: string[];
  weatherDependency: boolean;
  notes: string;
  progressUpdates: ProgressUpdate[];
  createdDate: string;
  createdBy: string;
  laborCost: number;
  materialCost: number;
  totalCost: number;
  expectedYield?: number;
  actualYield?: number;
}

interface Material {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  status: 'available' | 'low-stock' | 'out-of-stock' | 'allocated';
  location: string;
  costPerUnit: number;
  totalCost: number;
  supplier?: string;
  expiryDate?: string;
  lotNumber?: string;
  description?: string;
}

interface Equipment {
  id: number;
  name: string;
  type: string;
  status: 'available' | 'in-use' | 'maintenance' | 'damaged';
  location: string;
  assignedTo?: string;
  operatingCost: number;
  specifications?: string;
}

interface Worker {
  id: number;
  name: string;
  employeeId: string;
  role: 'field-worker' | 'equipment-operator' | 'specialist' | 'team-lead';
  skills: string[];
  availability: 'available' | 'assigned' | 'off-duty' | 'on-leave';
  currentAssignment?: string;
  hourlyRate: number;
  hoursWorked: number;
  efficiency: number;
  experience: string;
  certifications: string[];
  specialties: string[];
}

interface ProgressUpdate {
  id: number;
  operationId: number;
  timestamp: string;
  update: string;
  supervisor: string;
  hoursSpent: number;
  workersInvolved: string[];
  photos?: string[];
  weather?: string;
  challenges?: string;
}

export default function FieldServiceManager() {
  const [activeTab, setActiveTab] = useState('operations');
  const [showAddOperation, setShowAddOperation] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState<FieldOperation | null>(null);
  const [operationFilter, setOperationFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [fieldOperations, setFieldOperations] = useState<FieldOperation[]>([
    {
      id: 1,
      title: 'Field A Planting - African Varieties',
      description: 'Plant Bird\'s Eye Chili seedlings in Field A with proper spacing and irrigation setup',
      type: 'planting',
      priority: 'high',
      status: 'in-progress',
      field: 'Field A - African Varieties',
      assignedSupervisor: 'Joseph Pacho',
      assignedWorkers: ['Maria Santos', 'Carlos Rodriguez', 'Ana Martinez'],
      scheduledDate: '2024-01-22',
      estimatedDuration: 8,
      actualDuration: 6,
      requiredMaterials: [
        { id: 1, name: 'Bird\'s Eye Chili Seedlings', quantity: 500, unit: 'plants', category: 'Seeds & Plants', status: 'available', location: 'Greenhouse A', costPerUnit: 0.75, totalCost: 375.00, supplier: 'Premium Seeds Co' },
        { id: 2, name: 'Organic Compost', quantity: 20, unit: 'bags', category: 'Fertilizers', status: 'available', location: 'Storage Barn', costPerUnit: 12.50, totalCost: 250.00, supplier: 'GreenGrow Supplies' },
        { id: 3, name: 'Drip Irrigation Lines', quantity: 200, unit: 'meters', category: 'Irrigation', status: 'allocated', location: 'Storage A', costPerUnit: 2.25, totalCost: 450.00 }
      ],
      assignedEquipment: [
        { id: 1, name: 'Compact Tractor', type: 'Tractor', status: 'in-use', location: 'Field A', assignedTo: 'Carlos Rodriguez', operatingCost: 25.00 },
        { id: 2, name: 'Planting Tools Set', type: 'Hand Tools', status: 'in-use', location: 'Field A', assignedTo: 'Team', operatingCost: 5.00 }
      ],
      skillsRequired: ['Planting Techniques', 'Irrigation Setup', 'Seedling Care'],
      weatherDependency: true,
      notes: 'Optimal weather conditions. Monitor soil moisture levels during planting.',
      progressUpdates: [
        { id: 1, operationId: 1, timestamp: '2024-01-22 08:00', update: 'Started planting operation. Team assembled and materials distributed.', supervisor: 'Joseph Pacho', hoursSpent: 2, workersInvolved: ['Maria Santos', 'Carlos Rodriguez', 'Ana Martinez'], weather: 'Clear, 24°C' },
        { id: 2, operationId: 1, timestamp: '2024-01-22 12:00', update: 'Completed 60% of planting. Irrigation lines being installed.', supervisor: 'Joseph Pacho', hoursSpent: 4, workersInvolved: ['Maria Santos', 'Carlos Rodriguez'] }
      ],
      createdDate: '2024-01-21',
      createdBy: 'Farm Manager',
      laborCost: 240.00,
      materialCost: 1075.00,
      totalCost: 1345.00,
      expectedYield: 2500
    },
    {
      id: 2,
      title: 'Field B Harvest - Thai Dragon Peppers',
      description: 'Harvest mature Thai Dragon peppers with quality control and proper handling',
      type: 'harvesting',
      priority: 'urgent',
      status: 'scheduled',
      field: 'Field B - Asian Mix',
      assignedSupervisor: 'Sarah Pacho',
      assignedWorkers: ['Miguel Torres', 'Carmen Lopez', 'Roberto Silva', 'Elena Vasquez'],
      scheduledDate: '2024-01-24',
      estimatedDuration: 6,
      requiredMaterials: [
        { id: 4, name: 'Harvest Baskets', quantity: 30, unit: 'pieces', category: 'Harvest Equipment', status: 'available', location: 'Storage D', costPerUnit: 8.00, totalCost: 240.00 },
        { id: 5, name: 'Sorting Trays', quantity: 15, unit: 'pieces', category: 'Harvest Equipment', status: 'available', location: 'Storage D', costPerUnit: 12.00, totalCost: 180.00 },
        { id: 6, name: 'Gloves - Harvest Grade', quantity: 20, unit: 'pairs', category: 'Safety Equipment', status: 'available', location: 'Storage D', costPerUnit: 3.50, totalCost: 70.00 }
      ],
      assignedEquipment: [
        { id: 3, name: 'Transport Cart', type: 'Material Handling', status: 'available', location: 'Field B', operatingCost: 5.00 },
        { id: 4, name: 'Digital Scale', type: 'Weighing Equipment', status: 'available', location: 'Field B', operatingCost: 2.00 }
      ],
      skillsRequired: ['Harvesting Techniques', 'Quality Assessment', 'Post-Harvest Handling'],
      weatherDependency: true,
      notes: 'Peak ripeness achieved. Morning harvest preferred for optimal quality.',
      progressUpdates: [],
      createdDate: '2024-01-20',
      createdBy: 'Field Supervisor',
      laborCost: 320.00,
      materialCost: 490.00,
      totalCost: 817.00,
      expectedYield: 800
    },
    {
      id: 3,
      title: 'Field C Fertilization Program',
      description: 'Apply organic fertilizer blend to enhance soil nutrients for Habanero growth',
      type: 'fertilizing',
      priority: 'medium',
      status: 'planned',
      field: 'Field C - Caribbean Heat',
      assignedSupervisor: 'Dr. Maria Rodriguez',
      assignedWorkers: ['Pedro Gonzalez', 'Sofia Morales'],
      scheduledDate: '2024-01-26',
      estimatedDuration: 4,
      requiredMaterials: [
        { id: 7, name: 'NPK Organic Blend', quantity: 15, unit: 'bags', category: 'Fertilizers', status: 'available', location: 'Storage B', costPerUnit: 18.00, totalCost: 270.00, supplier: 'Organic Solutions' },
        { id: 8, name: 'Calcium Supplement', quantity: 8, unit: 'bags', category: 'Fertilizers', status: 'available', location: 'Storage B', costPerUnit: 22.00, totalCost: 176.00 },
        { id: 9, name: 'Application Spreader', quantity: 2, unit: 'pieces', category: 'Equipment', status: 'available', location: 'Equipment Shed', costPerUnit: 15.00, totalCost: 30.00 }
      ],
      assignedEquipment: [
        { id: 5, name: 'ATV with Spreader', type: 'Utility Vehicle', status: 'available', location: 'Equipment Yard', operatingCost: 18.00 },
        { id: 6, name: 'Soil Testing Kit', type: 'Testing Equipment', status: 'available', location: 'Laboratory', operatingCost: 3.00 }
      ],
      skillsRequired: ['Fertilizer Application', 'Soil Testing', 'Nutrient Management'],
      weatherDependency: true,
      notes: 'Apply when soil moisture is adequate. Avoid application before heavy rain.',
      progressUpdates: [],
      createdDate: '2024-01-19',
      createdBy: 'Agronomist',
      laborCost: 160.00,
      materialCost: 476.00,
      totalCost: 657.00
    },
    {
      id: 4,
      title: 'All Fields Irrigation System Maintenance',
      description: 'Comprehensive maintenance of drip irrigation systems across all production fields',
      type: 'irrigation',
      priority: 'high',
      status: 'scheduled',
      field: 'All Fields',
      assignedSupervisor: 'Mike Thompson',
      assignedWorkers: ['Juan Ramirez', 'Luis Herrera'],
      scheduledDate: '2024-01-25',
      estimatedDuration: 10,
      requiredMaterials: [
        { id: 10, name: 'Drip Emitters', quantity: 200, unit: 'pieces', category: 'Irrigation', status: 'available', location: 'Storage A', costPerUnit: 1.25, totalCost: 250.00 },
        { id: 11, name: 'Irrigation Tubing', quantity: 500, unit: 'meters', category: 'Irrigation', status: 'available', location: 'Storage A', costPerUnit: 0.85, totalCost: 425.00 },
        { id: 12, name: 'Filter Cartridges', quantity: 12, unit: 'pieces', category: 'Irrigation', status: 'low-stock', location: 'Storage A', costPerUnit: 15.00, totalCost: 180.00 }
      ],
      assignedEquipment: [
        { id: 7, name: 'Pressure Testing Equipment', type: 'Testing Equipment', status: 'available', location: 'Workshop', operatingCost: 10.00 },
        { id: 8, name: 'Trenching Tools', type: 'Hand Tools', status: 'available', location: 'Storage A', operatingCost: 8.00 }
      ],
      skillsRequired: ['Irrigation Systems', 'System Diagnostics', 'Preventive Maintenance'],
      weatherDependency: false,
      notes: 'Critical maintenance to ensure optimal water distribution efficiency.',
      progressUpdates: [],
      createdDate: '2024-01-18',
      createdBy: 'Irrigation Manager',
      laborCost: 400.00,
      materialCost: 855.00,
      totalCost: 1273.00
    },
    {
      id: 5,
      title: 'Field A Pest Control Treatment',
      description: 'Organic pest control application for aphid management on young pepper plants',
      type: 'pest-control',
      priority: 'high',
      status: 'on-hold',
      field: 'Field A - African Varieties',
      assignedSupervisor: 'Dr. Maria Rodriguez',
      assignedWorkers: ['Isabella Cruz', 'Diego Martinez'],
      scheduledDate: '2024-01-23',
      estimatedDuration: 3,
      requiredMaterials: [
        { id: 13, name: 'Neem Oil Concentrate', quantity: 5, unit: 'liters', category: 'Pest Control', status: 'available', location: 'Chemical Storage', costPerUnit: 28.00, totalCost: 140.00, supplier: 'BioProtect Solutions', expiryDate: '2025-06-15' },
        { id: 14, name: 'Surfactant Additive', quantity: 2, unit: 'liters', category: 'Pest Control', status: 'available', location: 'Chemical Storage', costPerUnit: 16.00, totalCost: 32.00 },
        { id: 15, name: 'Spray Equipment Cleaning Kit', quantity: 1, unit: 'set', category: 'Maintenance', status: 'available', location: 'Equipment Room', costPerUnit: 45.00, totalCost: 45.00 }
      ],
      assignedEquipment: [
        { id: 9, name: 'Boom Sprayer', type: 'Spray Equipment', status: 'maintenance', location: 'Workshop', operatingCost: 35.00 },
        { id: 10, name: 'Handheld Sprayers', type: 'Spray Equipment', status: 'available', location: 'Chemical Storage', operatingCost: 8.00 }
      ],
      skillsRequired: ['Pest Identification', 'Spray Application', 'Safety Protocols'],
      weatherDependency: true,
      notes: 'On hold due to equipment maintenance. Waiting for sprayer repair completion.',
      progressUpdates: [
        { id: 3, operationId: 5, timestamp: '2024-01-23 09:00', update: 'Operation postponed due to boom sprayer malfunction. Using handheld equipment as backup.', supervisor: 'Dr. Maria Rodriguez', hoursSpent: 1, workersInvolved: ['Isabella Cruz'] }
      ],
      createdDate: '2024-01-22',
      createdBy: 'Plant Health Specialist',
      laborCost: 120.00,
      materialCost: 217.00,
      totalCost: 380.00
    }
  ]);

  const [workers, setWorkers] = useState<Worker[]>([
    {
      id: 1,
      name: 'Maria Santos',
      employeeId: 'FW001',
      role: 'field-worker',
      skills: ['Planting', 'Weeding', 'Basic Irrigation', 'Harvesting'],
      availability: 'assigned',
      currentAssignment: 'Field A Planting',
      hourlyRate: 15.00,
      hoursWorked: 160,
      efficiency: 92,
      experience: '3 years',
      certifications: ['Basic Safety Training', 'Organic Practices Certified'],
      specialties: ['Seedling Care', 'Hand Planting']
    },
    {
      id: 2,
      name: 'Carlos Rodriguez',
      employeeId: 'EO001',
      role: 'equipment-operator',
      skills: ['Tractor Operation', 'Irrigation Systems', 'Equipment Maintenance', 'Heavy Machinery'],
      availability: 'assigned',
      currentAssignment: 'Field A Planting',
      hourlyRate: 22.00,
      hoursWorked: 180,
      efficiency: 95,
      experience: '7 years',
      certifications: ['Heavy Equipment License', 'Irrigation Certification', 'Safety Management'],
      specialties: ['Precision Agriculture', 'System Installation']
    },
    {
      id: 3,
      name: 'Ana Martinez',
      employeeId: 'FW002',
      role: 'field-worker',
      skills: ['Harvesting', 'Quality Control', 'Post-Harvest Handling', 'Packaging'],
      availability: 'assigned',
      currentAssignment: 'Field A Planting',
      hourlyRate: 16.00,
      hoursWorked: 150,
      efficiency: 88,
      experience: '2 years',
      certifications: ['Food Safety Certification', 'Quality Control Training'],
      specialties: ['Harvest Quality', 'Selective Picking']
    },
    {
      id: 4,
      name: 'Miguel Torres',
      employeeId: 'TL001',
      role: 'team-lead',
      skills: ['Team Management', 'Quality Control', 'Training', 'Harvesting Operations'],
      availability: 'available',
      hourlyRate: 20.00,
      hoursWorked: 170,
      efficiency: 91,
      experience: '5 years',
      certifications: ['Team Leadership', 'Quality Assurance', 'Training Certification'],
      specialties: ['Harvest Operations', 'Team Coordination']
    },
    {
      id: 5,
      name: 'Carmen Lopez',
      employeeId: 'FW003',
      role: 'field-worker',
      skills: ['Harvesting', 'Sorting', 'Basic Equipment Operation', 'Field Maintenance'],
      availability: 'available',
      hourlyRate: 15.50,
      hoursWorked: 140,
      efficiency: 85,
      experience: '4 years',
      certifications: ['Basic Safety Training', 'Harvest Techniques'],
      specialties: ['Manual Harvesting', 'Crop Sorting']
    },
    {
      id: 6,
      name: 'Dr. Maria Rodriguez',
      employeeId: 'SP001',
      role: 'specialist',
      skills: ['Agronomy', 'Pest Management', 'Soil Analysis', 'Crop Health Assessment'],
      availability: 'available',
      hourlyRate: 45.00,
      hoursWorked: 120,
      efficiency: 98,
      experience: '12 years',
      certifications: ['PhD Plant Sciences', 'IPM Certified', 'Organic Inspector'],
      specialties: ['Plant Diagnostics', 'Pest Control', 'Soil Health']
    }
  ]);

  const [materials, setMaterials] = useState<Material[]>([
    { id: 1, name: 'Bird\'s Eye Chili Seedlings', quantity: 1200, unit: 'plants', category: 'Seeds & Plants', status: 'available', location: 'Greenhouse A', costPerUnit: 0.75, totalCost: 900.00, supplier: 'Premium Seeds Co' },
    { id: 2, name: 'Habanero Seedlings', quantity: 800, unit: 'plants', category: 'Seeds & Plants', status: 'available', location: 'Greenhouse B', costPerUnit: 0.85, totalCost: 680.00, supplier: 'Premium Seeds Co' },
    { id: 3, name: 'Organic Compost', quantity: 50, unit: 'bags', category: 'Fertilizers', status: 'available', location: 'Storage Barn', costPerUnit: 12.50, totalCost: 625.00, supplier: 'GreenGrow Supplies' },
    { id: 4, name: 'NPK Organic Blend', quantity: 30, unit: 'bags', category: 'Fertilizers', status: 'available', location: 'Storage B', costPerUnit: 18.00, totalCost: 540.00, supplier: 'Organic Solutions' },
    { id: 5, name: 'Drip Irrigation Lines', quantity: 1000, unit: 'meters', category: 'Irrigation', status: 'available', location: 'Storage A', costPerUnit: 2.25, totalCost: 2250.00 },
    { id: 6, name: 'Neem Oil Concentrate', quantity: 20, unit: 'liters', category: 'Pest Control', status: 'available', location: 'Chemical Storage', costPerUnit: 28.00, totalCost: 560.00, supplier: 'BioProtect Solutions', expiryDate: '2025-06-15' },
    { id: 7, name: 'Harvest Baskets', quantity: 100, unit: 'pieces', category: 'Harvest Equipment', status: 'available', location: 'Storage D', costPerUnit: 8.00, totalCost: 800.00 },
    { id: 8, name: 'Safety Gloves', quantity: 80, unit: 'pairs', category: 'Safety Equipment', status: 'available', location: 'Storage D', costPerUnit: 3.50, totalCost: 280.00 }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned': return 'bg-gray-100 text-gray-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'on-hold': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'available': return 'bg-green-100 text-green-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'off-duty': return 'bg-gray-100 text-gray-800';
      case 'on-leave': return 'bg-red-100 text-red-800';
      case 'low-stock': return 'bg-yellow-100 text-yellow-800';
      case 'out-of-stock': return 'bg-red-100 text-red-800';
      case 'allocated': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'urgent': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'planting': return 'ri-seedling-line';
      case 'harvesting': return 'ri-scissors-line';
      case 'irrigation': return 'ri-drop-line';
      case 'fertilizing': return 'ri-leaf-line';
      case 'pest-control': return 'ri-bug-line';
      case 'weeding': return 'ri-plant-line';
      case 'pruning': return 'ri-scissors-2-line';
      case 'soil-prep': return 'ri-shovel-line';
      default: return 'ri-plant-line';
    }
  };

  const filteredOperations = fieldOperations.filter(operation => {
    const matchesFilter = operationFilter === 'all' || operation.status === operationFilter;
    const matchesSearch = operation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         operation.assignedSupervisor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         operation.field.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Agricultural Operations Management</h2>
          <p className="text-gray-600">Labor and materials allocation for field operations</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowScheduler(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-calendar-line mr-2"></i>Operations Calendar
          </button>
          <button
            onClick={() => setShowAddOperation(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-add-line mr-2"></i>New Operation
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <i className="ri-plant-line text-blue-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Operations</p>
              <p className="text-2xl font-bold text-gray-900">
                {fieldOperations.filter(w => ['planned', 'scheduled', 'in-progress'].includes(w.status)).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <i className="ri-user-line text-green-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500">Available Workers</p>
              <p className="text-2xl font-bold text-gray-900">
                {workers.filter(w => w.availability === 'available').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
              <i className="ri-alarm-warning-line text-yellow-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500">Urgent Operations</p>
              <p className="text-2xl font-bold text-gray-900">
                {fieldOperations.filter(w => w.priority === 'urgent' && w.status !== 'completed').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
              <i className="ri-box-line text-purple-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500">Materials Available</p>
              <p className="text-2xl font-bold text-gray-900">
                {materials.filter(m => m.status === 'available').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
              <i className="ri-money-dollar-circle-line text-orange-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Operation Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ${fieldOperations.reduce((sum, w) => sum + w.totalCost, 0).toFixed(0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'operations', name: 'Field Operations', icon: 'ri-plant-line' },
            { id: 'workforce', name: 'Workforce', icon: 'ri-team-line' },
            { id: 'materials', name: 'Materials & Supplies', icon: 'ri-box-line' },
            { id: 'scheduler', name: 'Operations Calendar', icon: 'ri-calendar-line' },
            { id: 'analytics', name: 'Performance Analytics', icon: 'ri-bar-chart-line' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm cursor-pointer ${
                activeTab === tab.id
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <i className={`${tab.icon} mr-2 inline-block`}></i>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Field Operations Tab */}
      {activeTab === 'operations' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Operations</label>
                <div className="relative">
                  <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                    placeholder="Search by title, supervisor, field..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status Filter</label>
                <select
                  value={operationFilter}
                  onChange={(e) => setOperationFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8"
                >
                  <option value="all">All Status</option>
                  <option value="planned">Planned</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="in-progress">In Progress</option>
                  <option value="on-hold">On Hold</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Operation Type</label>
                <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8">
                  <option value="all">All Types</option>
                  <option value="planting">Planting</option>
                  <option value="harvesting">Harvesting</option>
                  <option value="irrigation">Irrigation</option>
                  <option value="fertilizing">Fertilizing</option>
                  <option value="pest-control">Pest Control</option>
                  <option value="weeding">Weeding</option>
                  <option value="pruning">Pruning</option>
                  <option value="soil-prep">Soil Preparation</option>
                </select>
              </div>

              <div className="flex items-end">
                <div className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg w-full">
                  <div className="font-medium">Results: {filteredOperations.length} of {fieldOperations.length}</div>
                  <div className="text-xs text-gray-500">
                    Active: {filteredOperations.filter(w => ['planned', 'scheduled', 'in-progress'].includes(w.status)).length}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Operations List */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {filteredOperations.map((operation) => (
              <div key={operation.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                      <i className={`${getTypeIcon(operation.type)} text-green-600 text-xl`}></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{operation.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{operation.description}</p>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(operation.status)}`}>
                          {operation.status.replace('-', ' ')}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(operation.priority)}`}>
                          {operation.priority}
                        </span>
                        {operation.weatherDependency && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            Weather Dependent
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedOperation(operation)}
                    className="text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <i className="ri-more-line w-5 h-5 flex items-center justify-center"></i>
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Field:</span>
                      <div className="font-medium text-gray-900">{operation.field}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Supervisor:</span>
                      <div className="font-medium text-gray-900">{operation.assignedSupervisor}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Scheduled:</span>
                      <div className="font-medium text-gray-900">{operation.scheduledDate}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Duration:</span>
                      <div className="font-medium text-gray-900">
                        {operation.actualDuration || operation.estimatedDuration}h
                        {operation.actualDuration && ` (Est: ${operation.estimatedDuration}h)`}
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-gray-500 text-sm">Assigned Workers:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {operation.assignedWorkers.slice(0, 3).map((worker, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          {worker}
                        </span>
                      ))}
                      {operation.assignedWorkers.length > 3 && (
                        <span className="text-xs text-gray-500">+{operation.assignedWorkers.length - 3} more</span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Labor Cost:</span>
                      <div className="font-medium text-green-600">${operation.laborCost.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Materials:</span>
                      <div className="font-medium text-blue-600">${operation.materialCost.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Total Cost:</span>
                      <div className="font-medium text-purple-600">${operation.totalCost.toFixed(2)}</div>
                    </div>
                  </div>

                  {(operation.expectedYield || operation.actualYield) && (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Expected Yield:</span>
                        <div className="font-medium text-gray-900">{operation.expectedYield} kg</div>
                      </div>
                      {operation.actualYield && (
                        <div>
                          <span className="text-gray-500">Actual Yield:</span>
                          <div className="font-medium text-green-600">{operation.actualYield} kg</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => setSelectedOperation(operation)}
                    className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors cursor-pointer text-sm whitespace-nowrap"
                  >
                    View Details
                  </button>
                  <button className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors cursor-pointer">
                    <i className="ri-edit-line w-4 h-4 flex items-center justify-center"></i>
                  </button>
                  <button className="px-3 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors cursor-pointer">
                    <i className="ri-calendar-line w-4 h-4 flex items-center justify-center"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Workforce Tab */}
      {activeTab === 'workforce' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {workers.map((worker) => (
              <div key={worker.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                      <i className="ri-user-line text-green-600 text-xl"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{worker.name}</h3>
                      <p className="text-sm text-gray-600">{worker.employeeId} • {worker.role.replace('-', ' ')}</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(worker.availability)}`}>
                        {worker.availability.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Hourly Rate:</span>
                      <div className="font-medium text-green-600">${worker.hourlyRate}/hr</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Experience:</span>
                      <div className="font-medium text-gray-900">{worker.experience}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Hours This Month:</span>
                      <div className="font-medium text-gray-900">{worker.hoursWorked}h</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Efficiency:</span>
                      <div className="flex items-center">
                        <div className="w-12 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className={`h-2 rounded-full ${
                              worker.efficiency >= 90 ? 'bg-green-500' :
                              worker.efficiency >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${worker.efficiency}%` }}
                          ></div>
                        </div>
                        <span className="font-medium text-gray-900">{worker.efficiency}%</span>
                      </div>
                    </div>
                  </div>

                  {worker.currentAssignment && (
                    <div className="text-sm">
                      <span className="text-gray-500">Current Assignment:</span>
                      <div className="font-medium text-blue-600">{worker.currentAssignment}</div>
                    </div>
                  )}

                  <div>
                    <span className="text-gray-500 text-sm">Specialties:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {worker.specialties.slice(0, 2).map((specialty, index) => (
                        <span key={index} className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                          {specialty}
                        </span>
                      ))}
                      {worker.specialties.length > 2 && (
                        <span className="text-xs text-gray-500">+{worker.specialties.length - 2}</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-gray-500 text-sm">Skills:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {worker.skills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          {skill}
                        </span>
                      ))}
                      {worker.skills.length > 3 && (
                        <span className="text-xs text-gray-500">+{worker.skills.length - 3}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex space-x-2">
                  <button className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors cursor-pointer text-sm whitespace-nowrap">
                    View Profile
                  </button>
                  <button className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors cursor-pointer">
                    <i className="ri-user-settings-line w-4 h-4 flex items-center justify-center"></i>
                  </button>
                  <button className="px-3 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors cursor-pointer">
                    <i className="ri-calendar-line w-4 h-4 flex items-center justify-center"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Materials Tab */}
      {activeTab === 'materials' && (
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Cost</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {materials.map((material) => (
                  <tr key={material.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{material.name}</div>
                        {material.expiryDate && (
                          <div className="text-sm text-gray-500">Expires: {material.expiryDate}</div>
                        )}
                        {material.supplier && (
                          <div className="text-sm text-gray-500">Supplier: {material.supplier}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        {material.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {material.quantity} {material.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(material.status)}`}>
                        {material.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {material.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${material.costPerUnit.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      ${material.totalCost.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 cursor-pointer">
                        Edit
                      </button>
                      <button className="text-green-600 hover:text-green-900 cursor-pointer">
                        Allocate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Operation Detail Modal */}
      {selectedOperation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[95vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{selectedOperation.title}</h3>
                <p className="text-gray-600 mt-1">{selectedOperation.field} • {selectedOperation.type}</p>
              </div>
              <button 
                onClick={() => setSelectedOperation(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line w-8 h-8 flex items-center justify-center"></i>
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Operation Details */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Operation Details</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-600">Description:</span>
                      <p className="font-medium text-gray-900">{selectedOperation.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-600">Priority:</span>
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(selectedOperation.priority)}`}>
                          {selectedOperation.priority}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Status:</span>
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedOperation.status)}`}>
                          {selectedOperation.status.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-600">Scheduled Date:</span>
                        <div className="font-medium text-gray-900">{selectedOperation.scheduledDate}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Duration:</span>
                        <div className="font-medium text-gray-900">
                          {selectedOperation.actualDuration || selectedOperation.estimatedDuration}h
                          {selectedOperation.actualDuration && ` (Est: ${selectedOperation.estimatedDuration}h)`}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assigned Workforce */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Assigned Workforce</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-600">Supervisor:</span>
                      <div className="font-medium text-gray-900">{selectedOperation.assignedSupervisor}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Workers:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedOperation.assignedWorkers.map((worker, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            {worker}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Required Materials */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Required Materials</h4>
                  <div className="space-y-2">
                    {selectedOperation.requiredMaterials.map((material) => (
                      <div key={material.id} className="flex items-center justify-between p-3 bg-white rounded border">
                        <div>
                          <div className="font-medium text-gray-900">{material.name}</div>
                          <div className="text-sm text-gray-500">{material.quantity} {material.unit}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">${material.totalCost.toFixed(2)}</div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(material.status)}`}>
                            {material.status.replace('-', ' ')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Labor Cost:</span>
                      <span className="font-medium text-gray-900">${selectedOperation.laborCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Materials:</span>
                      <span className="font-medium text-gray-900">${selectedOperation.materialCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-semibold text-gray-900">Total Cost:</span>
                      <span className="font-semibold text-green-600">${selectedOperation.totalCost.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {(selectedOperation.expectedYield || selectedOperation.actualYield) && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Yield Information</h4>
                    <div className="space-y-3">
                      {selectedOperation.expectedYield && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Expected Yield:</span>
                          <span className="font-medium text-gray-900">{selectedOperation.expectedYield} kg</span>
                        </div>
                      )}
                      {selectedOperation.actualYield && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Actual Yield:</span>
                          <span className="font-medium text-green-600">{selectedOperation.actualYield} kg</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedOperation.skillsRequired.map((skill, index) => (
                      <span key={index} className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Updates */}
            {selectedOperation.progressUpdates.length > 0 && (
              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Progress Updates</h4>
                <div className="space-y-3">
                  {selectedOperation.progressUpdates.map((update) => (
                    <div key={update.id} className="bg-white p-3 rounded border">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium text-gray-900">{update.supervisor}</div>
                        <div className="text-sm text-gray-500">{update.timestamp}</div>
                      </div>
                      <p className="text-gray-700 mb-2">{update.update}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                        <div>Hours spent: {update.hoursSpent}</div>
                        <div>Workers: {update.workersInvolved.length}</div>
                      </div>
                      {update.weather && (
                        <div className="text-sm text-gray-500">Weather: {update.weather}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Notes</h4>
              <p className="text-gray-700">{selectedOperation.notes}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
