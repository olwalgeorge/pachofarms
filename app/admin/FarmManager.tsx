'use client';
import { useState } from 'react';
import EquipmentManager from './EquipmentManager';
import FieldServiceManager from './FieldServiceManager';
import UnifiedOperationsCalendar from './UnifiedOperationsCalendar';

// Mock current user - in real app, this would come from authentication context
const currentUser = {
  id: 2,
  role: 'supervisor',
  permissions: [
    'field_operations_manage',
    'workers_manage',
    'equipment_use',
    'task_assign',
    'progress_track',
    'field_access_all',
    'field_service_manage'
  ]
};

export default function FarmManager() {
  const [activeSection, setActiveSection] = useState('fields');
  const [selectedField, setSelectedField] = useState<any>(null);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddField, setShowAddField] = useState(false);
  const [showAddProgram, setShowAddProgram] = useState(false);
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [showOperationsCalendar, setShowOperationsCalendar] = useState(false);
  const [showUnifiedCalendar, setShowUnifiedCalendar] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [editingField, setEditingField] = useState<any>(null);
  const [editingProgram, setEditingProgram] = useState<any>(null);
  
  // Add state for program type and field filters
  const [selectedProgramType, setSelectedProgramType] = useState('all');
  const [selectedProgramField, setSelectedProgramField] = useState('all');

  const [fieldOperations, setFieldOperations] = useState([
    {
      id: 1,
      title: 'Field A Irrigation Setup',
      field: 'Field A - African Varieties',
      priority: 'high',
      status: 'planning',
      assignedTo: 'Joseph Pacho',
      dueDate: '2024-01-25',
      progress: 0,
      description: 'Install new drip irrigation system for optimal water distribution',
      tags: ['irrigation', 'infrastructure'],
      estimatedHours: 8,
      actualHours: 0
    },
    {
      id: 2,
      title: 'Pest Control Field B',
      field: 'Field B - Asian Mix',
      priority: 'high',
      status: 'in-progress',
      assignedTo: 'Sarah Pacho',
      dueDate: '2024-01-22',
      progress: 60,
      description: 'Apply organic pest control treatment for aphid prevention',
      tags: ['pest-control', 'organic'],
      estimatedHours: 4,
      actualHours: 2.5
    },
    {
      id: 3,
      title: 'Soil Testing Field C',
      field: 'Field C - Caribbean Heat',
      priority: 'medium',
      status: 'in-progress',
      assignedTo: 'Farm Team',
      dueDate: '2024-01-28',
      progress: 30,
      description: 'Comprehensive soil analysis for pH and nutrient levels',
      tags: ['testing', 'soil-health'],
      estimatedHours: 6,
      actualHours: 1.8
    },
    {
      id: 4,
      title: 'Harvest Preparation Field B',
      field: 'Field B - Asian Mix',
      priority: 'medium',
      status: 'completed',
      assignedTo: 'Joseph Pacho',
      dueDate: '2024-01-20',
      progress: 100,
      description: 'Prepare harvesting equipment and schedule picking team',
      tags: ['harvest', 'preparation'],
      estimatedHours: 3,
      actualHours: 2.8
    },
    {
      id: 5,
      title: 'Fertilizer Application All Fields',
      field: 'All Fields',
      priority: 'low',
      status: 'planning',
      assignedTo: 'Farm Team',
      dueDate: '2024-02-01',
      progress: 0,
      description: 'Quarterly organic fertilizer application across all cultivation areas',
      tags: ['fertilizer', 'maintenance'],
      estimatedHours: 12,
      actualHours: 0
    },
    {
      id: 6,
      title: 'Seedling Transplant Field C',
      field: 'Field C - Caribbean Heat',
      priority: 'high',
      status: 'review',
      assignedTo: 'Sarah Pacho',
      dueDate: '2024-01-24',
      progress: 85,
      description: 'Move greenhouse seedlings to main field cultivation areas',
      tags: ['transplant', 'seedlings'],
      estimatedHours: 5,
      actualHours: 4.2
    }
  ]);

  const [fields, setFields] = useState([
    {
      id: 'A',
      name: 'Field A - African Varieties',
      size: '2.5 acres',
      crop: "Bird's Eye Chili",
      plantingDate: '2024-01-15',
      expectedHarvest: '2024-04-15',
      status: 'growing',
      progress: 65,
      lastWatered: '2024-01-20',
      soilPh: 6.2,
      temperature: '24°C',
      humidity: '68%',
      description:
        'Prime field for African variety cultivation with excellent drainage and optimal sun exposure.',
      irrigation: 'Drip irrigation system installed',
      fertilizer: 'Last application: Organic compost on 2024-01-10',
      notes: 'Plants showing excellent growth. Monitor for pest activity.',
      weatherConditions:
        'Favorable - consistent temperature and adequate rainfall'
    },
    {
      id: 'B',
      name: 'Field B - Asian Mix',
      size: '1.8 acres',
      crop: 'Thai Dragon & Cayenne',
      plantingDate: '2023-12-10',
      expectedHarvest: '2024-03-10',
      status: 'ready',
      progress: 95,
      lastWatered: '2024-01-19',
      soilPh: 6.5,
      temperature: '26°C',
      humidity: '72%',
      description:
        'Mixed cultivation area optimized for Asian pepper varieties.',
      irrigation: 'Sprinkler system with timer controls',
      fertilizer: 'Last application: NPK 10-10-10 on 2024-01-05',
      notes: 'Ready for harvest. Schedule picking team for next week.',
      weatherConditions: 'Excellent - perfect harvest conditions'
    },
    {
      id: 'C',
      name: 'Field C - Caribbean Heat',
      size: '3.2 acres',
      crop: 'Habanero & Scotch Bonnet',
      plantingDate: '2024-02-01',
      expectedHarvest: '2024-05-01',
      status: 'seedling',
      progress: 25,
      lastWatered: '2024-01-20',
      soilPh: 6.8,
      temperature: '23°C',
      humidity: '65%',
      description:
        'Largest field dedicated to high-heat Caribbean varieties.',
      irrigation:
        'Manual watering with planned drip system installation',
      fertilizer: 'Soil preparation with organic matter completed',
      notes: 'Seedlings establishing well. Install irrigation system next week.',
      weatherConditions: 'Good - monitoring for optimal transplant timing'
    }
  ]);

  const [sprayPrograms, setSprayPrograms] = useState([
    {
      id: 1,
      name: 'Organic Pest Control Program',
      type: 'spray',
      product: 'Neem Oil Solution',
      field: 'Field A - African Varieties',
      frequency: 'weekly',
      dosage: '2ml/L',
      startDate: '2024-01-15',
      nextApplication: '2024-01-22',
      status: 'active',
      notes: 'Apply early morning or late evening to avoid leaf burn',
      applications: [
        { date: '2024-01-15', weather: 'Clear', effectiveness: 'Good' },
        { date: '2024-01-08', weather: 'Cloudy', effectiveness: 'Excellent' }
      ]
    },
    {
      id: 2,
      name: 'Nutrient Boost Program',
      type: 'fertilizer',
      product: 'NPK 10-10-10',
      field: 'Field B - Asian Mix',
      frequency: 'bi-weekly',
      dosage: '50g per plant',
      startDate: '2024-01-01',
      nextApplication: '2024-01-29',
      status: 'active',
      notes: 'Water thoroughly after application',
      applications: [
        { date: '2024-01-15', weather: 'Clear', effectiveness: 'Good' },
        { date: '2024-01-01', weather: 'Light rain', effectiveness: 'Excellent' }
      ]
    },
    {
      id: 3,
      name: 'Calcium Deficiency Treatment',
      type: 'fertilizer',
      product: 'California Chloride',
      field: 'Field C - Caribbean Heat',
      frequency: 'monthly',
      dosage: '1g/L foliar spray',
      startDate: '2024-01-10',
      nextApplication: '2024-02-10',
      status: 'active',
      notes: 'Target leaves showing calcium deficiency symptoms',
      applications: [
        { date: '2024-01-10', weather: 'Overcast', effectiveness: 'Good' }
      ]
    },
    {
      id: 4,
      name: 'Morning Irrigation Schedule',
      type: 'watering',
      product: 'Drip Irrigation System',
      field: 'Field A - African Varieties',
      frequency: 'daily',
      dosage: '2L per plant',
      startDate: '2024-01-01',
      nextApplication: '2024-01-22',
      status: 'active',
      notes: 'Water early morning 6:00 AM to reduce evaporation',
      applications: [
        { date: '2024-01-21', weather: 'Clear', effectiveness: 'Excellent' },
        { date: '2024-01-20', weather: 'Overcast', effectiveness: 'Good' },
        { date: '2024-01-19', weather: 'Clear', effectiveness: 'Excellent' }
      ]
    },
    {
      id: 5,
      name: 'Deep Watering Program',
      type: 'watering',
      product: 'Sprinkler System',
      field: 'Field B - Asian Mix',
      frequency: 'bi-weekly',
      dosage: '25L per square meter',
      startDate: '2024-01-08',
      nextApplication: '2024-01-24',
      status: 'active',
      notes: 'Deep watering to encourage root growth, check soil moisture before application',
      applications: [
        { date: '2024-01-08', weather: 'Sunny', effectiveness: 'Excellent' },
        { date: '2023-12-25', weather: 'Cloudy', effectiveness: 'Good' }
      ]
    },
    {
      id: 6,
      name: 'Seedling Hydration Care',
      type: 'watering',
      product: 'Manual Watering',
      field: 'Field C - Caribbean Heat',
      frequency: 'daily',
      dosage: '500ml per plant',
      startDate: '2024-02-01',
      nextApplication: '2024-01-22',
      status: 'active',
      notes: 'Gentle watering for young seedlings, avoid water on leaves',
      applications: [
        { date: '2024-01-21', weather: 'Clear', effectiveness: 'Good' },
        { date: '2024-01-20', weather: 'Cloudy', effectiveness: 'Excellent' }
      ]
    },
    {
      id: 7,
      name: 'Structural Pruning Program',
      type: 'pruning',
      product: 'Pruning Shears & Tools',
      field: 'Field A - African Varieties',
      frequency: 'monthly',
      dosage: 'Remove 20% of lower branches',
      startDate: '2024-01-15',
      nextApplication: '2024-02-15',
      status: 'active',
      notes: 'Focus on removing lower branches, suckers, and diseased foliage. Sterilize tools between plants',
      applications: [
        { date: '2024-01-15', weather: 'Clear', effectiveness: 'Excellent' }
      ]
    },
    {
      id: 8,
      name: 'Harvest Pruning Maintenance',
      type: 'pruning',
      product: 'Hand Pruners',
      field: 'Field B - Asian Mix',
      frequency: 'bi-weekly',
      dosage: 'Light maintenance pruning',
      startDate: '2024-01-08',
      nextApplication: '2024-01-24',
      status: 'active',
      notes: 'Remove spent flowers and damaged branches during harvest season',
      applications: [
        { date: '2024-01-08', weather: 'Sunny', effectiveness: 'Good' },
        { date: '2023-12-25', weather: 'Overcast', effectiveness: 'Excellent' }
      ]
    },
    {
      id: 9,
      name: 'Mulching Application Program',
      type: 'mulching',
      product: 'Organic Straw Mulch',
      field: 'Field C - Caribbean Heat',
      frequency: 'monthly',
      dosage: '5cm thick layer',
      startDate: '2024-01-10',
      nextApplication: '2024-02-10',
      status: 'active',
      notes: 'Apply around base of plants, keep 5cm away from stem to prevent rot',
      applications: [
        { date: '2024-01-10', weather: 'Clear', effectiveness: 'Excellent' }
      ]
    },
    {
      id: 10,
      name: 'Disease Prevention Spray',
      type: 'spray',
      product: 'Copper Fungicide',
      field: 'All Fields',
      frequency: 'bi-weekly',
      dosage: '1.5ml/L water',
      startDate: '2024-01-05',
      nextApplication: '2024-01-26',
      status: 'active',
      notes: 'Apply during cooler hours to prevent fungal diseases. Rotate with other fungicides',
      applications: [
        { date: '2024-01-12', weather: 'Overcast', effectiveness: 'Good' },
        { date: '2024-01-05', weather: 'Clear', effectiveness: 'Excellent' }
      ]
    },
    {
      id: 11,
      name: 'Soil Aeration Program',
      type: 'cultivation',
      product: 'Garden Fork & Cultivator',
      field: 'Field A - African Varieties',
      frequency: 'monthly',
      dosage: 'Light cultivation 2-3 inches deep',
      startDate: '2024-01-01',
      nextApplication: '2024-02-01',
      status: 'active',
      notes: 'Aerate soil carefully around plants without damaging roots. Best after watering',
      applications: [
        { date: '2024-01-01', weather: 'Clear', effectiveness: 'Good' }
      ]
    },
    {
      id: 12,
      name: 'Beneficial Insect Habitat',
      type: 'habitat',
      product: 'Companion Plants & Flowers',
      field: 'Field B - Asian Mix',
      frequency: 'quarterly',
      dosage: 'Plant 5% of field area',
      startDate: '2024-01-01',
      nextApplication: '2024-04-01',
      status: 'active',
      notes: 'Maintain marigolds, basil, and other beneficial plants to attract predatory insects',
      applications: [
        { date: '2024-01-01', weather: 'Clear', effectiveness: 'Excellent' }
      ]
    },
    {
      id: 13,
      name: 'Support Structure Maintenance',
      type: 'support',
      product: 'Stakes & Ties',
      field: 'Field C - Caribbean Heat',
      frequency: 'bi-weekly',
      dosage: 'Check and adjust all plants',
      startDate: '2024-01-15',
      nextApplication: '2024-01-29',
      status: 'active',
      notes: 'Inspect stakes, ties, and cages. Adjust as plants grow, ensure adequate support',
      applications: [
        { date: '2024-01-15', weather: 'Clear', effectiveness: 'Good' }
      ]
    },
    {
      id: 14,
      name: 'Weed Control Program',
      type: 'weeding',
      product: 'Manual Weeding Tools',
      field: 'All Fields',
      frequency: 'weekly',
      dosage: 'Complete field coverage',
      startDate: '2024-01-01',
      nextApplication: '2024-01-22',
      status: 'active',
      notes: 'Remove weeds manually or with hoe. Mulch after weeding to prevent regrowth',
      applications: [
        { date: '2024-01-15', weather: 'Clear', effectiveness: 'Good' },
        { date: '2024-01-08', weather: 'Overcast', effectiveness: 'Excellent' },
        { date: '2024-01-01', weather: 'Clear', effectiveness: 'Good' }
      ]
    }
  ]);

  const [reminders, setReminders] = useState([
    {
      id: 1,
      title: 'Apply Neem Oil Spray - Field A',
      programId: 1,
      dueDate: '2024-01-22',
      priority: 'high',
      status: 'pending',
      type: 'spray',
      field: 'Field A - African Varieties'
    },
    {
      id: 2,
      title: 'NPK Fertilizer Application - Field B',
      programId: 2,
      dueDate: '2024-01-29',
      priority: 'medium',
      status: 'pending',
      type: 'fertilizer',
      field: 'Field B - Asian Mix'
    },
    {
      id: 3,
      title: 'Soil pH Testing - All Fields',
      programId: null,
      dueDate: '2024-01-25',
      priority: 'low',
      status: 'pending',
      type: 'testing',
      field: 'All Fields'
    },
    {
      id: 4,
      title: 'Morning Irrigation - Field A',
      programId: 4,
      dueDate: '2024-01-22',
      priority: 'high',
      status: 'pending',
      type: 'watering',
      field: 'Field A - African Varieties'
    },
    {
      id: 5,
      title: 'Deep Watering - Field B',
      programId: 5,
      dueDate: '2024-01-24',
      priority: 'medium',
      status: 'pending',
      type: 'watering',
      field: 'Field B - Asian Mix'
    },
    {
      id: 6,
      title: 'Seedling Care Watering - Field C',
      programId: 6,
      dueDate: '2024-01-22',
      priority: 'high',
      status: 'pending',
      type: 'watering',
      field: 'Field C - Caribbean Heat'
    },
    {
      id: 7,
      title: 'Weekly Weed Control - All Fields',
      programId: 14,
      dueDate: '2024-01-22',
      priority: 'medium',
      status: 'pending',
      type: 'weeding',
      field: 'All Fields'
    },
    {
      id: 8,
      title: 'Disease Prevention Spray - All Fields',
      programId: 10,
      dueDate: '2024-01-26',
      priority: 'high',
      status: 'pending',
      type: 'spray',
      field: 'All Fields'
    },
    {
      id: 9,
      title: 'Support Structure Check - Field C',
      programId: 13,
      dueDate: '2024-01-29',
      priority: 'medium',
      status: 'pending',
      type: 'support',
      field: 'Field C - Caribbean Heat'
    },
    {
      id: 10,
      title: 'Soil Aeration - Field A',
      programId: 11,
      dueDate: '2024-02-01',
      priority: 'low',
      status: 'pending',
      type: 'cultivation',
      field: 'Field A - African Varieties'
    }
  ]);

  const equipment = [
    {
      id: 1,
      name: 'Tractor John Deere 5055E',
      type: 'Heavy Machinery',
      status: 'operational',
      lastMaintenance: '2024-01-10',
      nextMaintenance: '2024-04-10',
      hoursUsed: 1250
    },
    {
      id: 2,
      name: 'Irrigation System Zone A',
      type: 'Irrigation',
      status: 'operational',
      lastMaintenance: '2023-12-15',
      nextMaintenance: '2024-03-15',
      hoursUsed: 2840
    },
    {
      id: 3,
      name: 'Harvesting Tools Set',
      type: 'Hand Tools',
      status: 'needs-repair',
      lastMaintenance: '2024-01-05',
      nextMaintenance: '2024-02-05',
      hoursUsed: 680
    }
  ];

  const kanbanColumns = [
    { id: 'planning', title: 'Planning', color: 'bg-blue-100 border-blue-300' },
    {
      id: 'in-progress',
      title: 'In Progress',
      color: 'bg-yellow-100 border-yellow-300'
    },
    { id: 'review', title: 'Review', color: 'bg-purple-100 border-purple-300' },
    {
      id: 'completed',
      title: 'Completed',
      color: 'bg-green-100 border-green-300'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'growing':
        return 'bg-blue-100 text-blue-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'seedling':
        return 'bg-yellow-100 text-yellow-800';
      case 'operational':
        return 'bg-green-100 text-green-800';
      case 'needs-repair':
        return 'bg-red-100 text-red-800';
      case 'planning':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'review':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getOperationsByStatus = (status: string) => {
    return fieldOperations.filter((op) => op.status === status);
  };

  const updateOperationStatus = (operationId: number, newStatus: string) => {
    setFieldOperations((prev) =>
      prev.map((op) =>
        op.id === operationId ? { ...op, status: newStatus } : op
      )
    );
  };

  const handleEditOperation = (operation: any) => {
    setEditingTask(operation);
  };

  const handleUpdateOperation = (updatedOperation: any) => {
    setFieldOperations((prev) =>
      prev.map((op) =>
        op.id === updatedOperation.id ? updatedOperation : op
      )
    );
    setEditingTask(null);
  };

  const handleAddTask = (newTask: any) => {
    setFieldOperations((prev) => [...prev, newTask]);
    setShowAddTask(false);
  };

  const handleAddField = (formData: FormData) => {
    const newField = {
      id: String.fromCharCode(65 + fields.length),
      name: formData.get('name') as string,
      size: (formData.get('size') as string) + ' acres',
      crop: formData.get('crop') as string,
      plantingDate: formData.get('plantingDate') as string,
      expectedHarvest: new Date(
        new Date(formData.get('plantingDate') as string).getTime() +
          90 * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split('T')[0],
      status: 'seedling',
      progress: 5,
      lastWatered: new Date().toISOString().split('T')[0],
      soilPh: 6.5,
      temperature: '24°C',
      humidity: '65%',
      description: formData.get('description') as string,
      irrigation: 'Manual watering system',
      fertilizer: 'Organic preparation completed',
      notes: 'New field establishment in progress',
      weatherConditions: 'Monitoring optimal conditions'
    };

    setFields((prev) => [...prev, newField]);
    setShowAddField(false);
  };

  const handleUpdateField = (formData: FormData) => {
    const updatedField = {
      ...editingField,
      name: formData.get('name') as string,
      size: formData.get('size') as string,
      crop: formData.get('crop') as string,
      description: formData.get('description') as string
    };

    setFields((prev) =>
      prev.map((field) =>
        field.id === editingField.id ? updatedField : field
      )
    );
    setEditingField(null);
  };

  const handleAddProgram = (formData: FormData) => {
    const newProgram = {
      id: sprayPrograms.length + 1,
      name: formData.get('name') as string,
      type: formData.get('type') as string,
      product: formData.get('product') as string,
      field: formData.get('field') as string,
      frequency: formData.get('frequency') as string,
      dosage: formData.get('dosage') as string,
      startDate: formData.get('startDate') as string,
      nextApplication: calculateNextApplication(
        formData.get('startDate') as string,
        formData.get('frequency') as string
      ),
      status: 'active',
      notes: formData.get('notes') as string,
      applications: []
    };

    setSprayPrograms((prev) => [...prev, newProgram]);
    setShowAddProgram(false);
  };

  const calculateNextApplication = (startDate: string, frequency: string) => {
    const start = new Date(startDate);
    let days = 7;

    switch (frequency) {
      case 'daily':
        days = 1;
        break;
      case 'weekly':
        days = 7;
        break;
      case 'bi-weekly':
        days = 14;
        break;
      case 'monthly':
        days = 30;
        break;
      default:
        days = 7;
    }

    return new Date(start.getTime() + days * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];
  };

  const completeReminder = (reminderId: number) => {
    setReminders((prev) =>
      prev.map((reminder) =>
        reminder.id === reminderId
          ? { ...reminder, status: 'completed' }
          : reminder
      )
    );
  };

  // New function to add a reminder
  const handleAddReminder = (formData: FormData) => {
    const programName = formData.get('program') as string;
    const program = sprayPrograms.find((p) => p.name === programName);
    const newReminder = {
      id: reminders.length + 1,
      title: formData.get('title') as string,
      programId: program?.id ?? null,
      dueDate: formData.get('dueDate') as string,
      priority: formData.get('priority') as string,
      status: 'pending',
      type: program?.type ?? 'task',
      field: formData.get('field') as string
    };
    setReminders((prev) => [...prev, newReminder]);
    setShowAddReminder(false);
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Add filtered programs function with both type and field filtering
  const filteredPrograms = sprayPrograms.filter(program => {
    const matchesType = selectedProgramType === 'all' || program.type === selectedProgramType;
    const matchesField = selectedProgramField === 'all' || program.field === selectedProgramField;
    return matchesType && matchesField;
  });

  // Check if user has permission
  const hasPermission = (permission: string) => {
    return currentUser.permissions.includes('*') || currentUser.permissions.includes(permission);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Farm Management</h2>
          {currentUser.role === 'supervisor' && (
            <p className="text-sm text-gray-600 mt-1">Field Supervisor - Full Operations Access</p>
          )}
        </div>
        {activeSection === 'fields' && hasPermission('field_operations_manage') && (
          <button
            onClick={() => setShowAddField(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 cursor-pointer whitespace-nowrap"
          >
            <i className="ri-add-line w-4 h-4 flex items-center justify-center mr-2"></i>
            Add Field
          </button>
        )}
        {activeSection === 'programs' && hasPermission('care_programs_manage') && (
          <button
            onClick={() => setShowAddProgram(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 cursor-pointer whitespace-nowrap"
          >
            <i className="ri-add-line w-4 h-4 flex items-center justify-center mr-2"></i>
            Add Program
          </button>
        )}
        {activeSection === 'reminders' && hasPermission('task_assign') && (
          <button
            onClick={() => setShowAddReminder(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 cursor-pointer whitespace-nowrap"
          >
            <i className="ri-add-line w-4 h-4 flex items-center justify-center mr-2"></i>
            Add Reminder
          </button>
        )}
      </div>

      {/* Permission Notice for Users without Access */}
      {currentUser.role === 'worker' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <i className="ri-information-line w-5 h-5 flex items-center justify-center text-blue-600 mr-3"></i>
            <div>
              <p className="text-sm font-medium text-blue-800">Worker Access</p>
              <p className="text-sm text-blue-700">You can view assigned tasks and update your progress. Contact your supervisor for other operations.</p>
            </div>
          </div>
        </div>
      )}

      {currentUser.role === 'agronomist' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <i className="ri-plant-line w-5 h-5 flex items-center justify-center text-green-600 mr-3"></i>
            <div>
              <p className="text-sm font-medium text-green-800">Agronomist Access</p>
              <p className="text-sm text-green-700">You can manage plant care programs, spray schedules, and crop monitoring. Field operations are managed by supervisors.</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs - show different tabs based on role */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { 
              id: 'fields', 
              name: 'Fields', 
              icon: 'ri-plant-line',
              permission: 'field_access_all'
            },
            { 
              id: 'programs',
              name: 'Care Programs',
              icon: 'ri-medicine-bottle-line',
              permission: 'care_programs_manage'
            },
            { 
              id: 'reminders', 
              name: 'Reminders', 
              icon: 'ri-alarm-line',
              permission: 'task_assign'
            },
            { 
              id: 'equipment', 
              name: 'Equipment and Tools', 
              icon: 'ri-tools-line',
              permission: 'equipment_use'
            },
            { 
              id: 'field-service', 
              name: 'Field Service Management', 
              icon: 'ri-service-line',
              permission: 'field_service_manage'
            }
          ].filter(tab => hasPermission(tab.permission)).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm cursor-pointer ${
                activeSection === tab.id
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <i
                className={`${tab.icon} w-4 h-4 flex items-center justify-center mr-2`}
              ></i>
              {tab.name}
            </button>
          ))}
          
          {/* Unified Operations Calendar Button */}
          <button
            onClick={() => setShowUnifiedCalendar(true)}
            className="whitespace-nowrap py-2 border-b-2 font-medium text-sm cursor-pointer border-green-500 text-green-600 bg-green-50 rounded-t-lg px-4"
          >
            <i className="ri-calendar-line mr-2"></i>
            Operations Calendar
          </button>
        </nav>
      </div>

      {/* Show appropriate message for no access */}
      {!hasPermission('field_access_all') && !hasPermission('field_operations_manage') && 
       !hasPermission('care_programs_manage') && !hasPermission('equipment_use') && 
       !hasPermission('field_service_manage') && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <i className="ri-lock-line text-4xl text-gray-400"></i>
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Access Restricted</h3>
          <p className="text-gray-500 mb-4">
            You don't have permission to access farm management features.
          </p>
          <p className="text-sm text-gray-400">
            Contact your administrator if you need access to these features.
          </p>
        </div>
      )}

      {/* Fields Management */}
      {activeSection === 'fields' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {fields.map((field) => (
              <div key={field.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {field.name}
                    </h3>
                    <p className="text-sm text-gray-500">{field.size}</p>
                  </div>
                  <span
                    className={`inline-flex px-2 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                      field.status
                    )}`}
                  >
                    {field.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Growth Progress</span>
                      <span>{field.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${field.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Crop</p>
                      <p className="font-medium">{field.crop}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Expected Harvest</p>
                      <p className="font-medium">{field.expectedHarvest}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <p className="text-gray-500">Soil pH</p>
                      <p className="font-medium">{field.soilPh}</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <p className="text-gray-500">Temp</p>
                      <p className="font-medium">{field.temperature}</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <p className="text-gray-500">Humidity</p>
                      <p className="font-medium">{field.humidity}</p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedField(field)}
                      className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 cursor-pointer whitespace-nowrap text-sm"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => setEditingField(field)}
                      className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 cursor-pointer"
                    >
                      <i className="ri-edit-line w-4 h-4 flex items-center justify-center"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Field Operations Kanban Board */}
      {activeSection === 'operations' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Field Operations Board
            </h3>
            <button
              onClick={() => setShowAddTask(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 cursor-pointer whitespace-nowrap"
            >
              <i className="ri-add-line w-4 h-4 flex items-center justify-center mr-2"></i>
              Add Task
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {kanbanColumns.map((column) => (
              <div
                key={column.id}
                className={`${column.color} rounded-lg p-4 border-2`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-800">
                    {column.title}
                  </h4>
                  <span className="bg-white text-gray-600 text-xs px-2 py-1 rounded-full">
                    {getOperationsByStatus(column.id).length}
                  </span>
                </div>

                <div className="space-y-3">
                  {getOperationsByStatus(column.id).map((operation) => (
                    <div
                      key={operation.id}
                      className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleEditOperation(operation)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium text-gray-900 text-sm leading-tight">
                          {operation.title}
                        </h5>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(
                            operation.priority
                          )}`}
                        >
                          {operation.priority}
                        </span>
                      </div>

                      <p className="text-xs text-gray-600 mb-2">
                        {operation.field}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {operation.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Progress</span>
                          <span>{operation.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div
                            className="bg-green-500 h-1 rounded-full"
                            style={{
                              width: `${operation.progress}%`
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                        <div className="flex items-center">
                          <i className="ri-user-line w-3 h-3 flex items-center justify-center mr-1"></i>
                          <span>{operation.assignedTo}</span>
                        </div>
                        <div className="flex items-center">
                          <i className="ri-calendar-line w-3 h-3 flex items-center justify-center mr-1"></i>
                          <span>{operation.dueDate}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                        <span>
                          {operation.actualHours}h /{' '}
                          {operation.estimatedHours}h
                        </span>
                        <div className="flex space-x-1">
                          {column.id !== 'planning' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const currentIndex = kanbanColumns.findIndex(
                                  (col) => col.id === operation.status
                                );
                                if (currentIndex > 0) {
                                  updateOperationStatus(
                                    operation.id,
                                    kanbanColumns[currentIndex - 1].id
                                  );
                                }
                              }}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <i className="ri-arrow-left-line w-3 h-3 flex items-center justify-center"></i>
                            </button>
                          )}
                          {column.id !== 'completed' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const currentIndex = kanbanColumns.findIndex(
                                  (col) => col.id === operation.status
                                );
                                if (currentIndex < kanbanColumns.length - 1) {
                                  updateOperationStatus(
                                    operation.id,
                                    kanbanColumns[currentIndex + 1].id
                                  );
                                }
                              }}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <i className="ri-arrow-right-line w-3 h-3 flex items-center justify-center"></i>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Care Programs (Spray, Fertilizer & Watering) */}
      {activeSection === 'programs' && (
        <div className="space-y-6">
          {/* Program Filters */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="space-y-4">
              {/* Type Filter */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Filter by Type</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    {
                      type: 'all',
                      name: 'All Programs',
                      color: 'bg-gray-100 text-gray-700'
                    },
                    {
                      type: 'spray',
                      name: 'Spray',
                      color: 'bg-blue-100 text-blue-700'
                    },
                    {
                      type: 'fertilizer',
                      name: 'Fertilizer',
                      color: 'bg-green-100 text-green-700'
                    },
                    {
                      type: 'watering',
                      name: 'Watering',
                      color: 'bg-cyan-100 text-cyan-700'
                    },
                    {
                      type: 'pruning',
                      name: 'Pruning',
                      color: 'bg-purple-100 text-purple-700'
                    },
                    {
                      type: 'mulching',
                      name: 'Mulching',
                      color: 'bg-yellow-100 text-yellow-800'
                    },
                    {
                      type: 'cultivation',
                      name: 'Cultivation',
                      color: 'bg-orange-100 text-orange-700'
                    },
                    {
                      type: 'weeding',
                      name: 'Weeding',
                      color: 'bg-red-100 text-red-700'
                    },
                    {
                      type: 'support',
                      name: 'Support',
                      color: 'bg-indigo-100 text-indigo-700'
                    },
                    {
                      type: 'habitat',
                      name: 'Habitat',
                      color: 'bg-emerald-100 text-emerald-700'
                    }
                  ].map((filter) => (
                    <button
                      key={filter.type}
                      onClick={() => setSelectedProgramType(filter.type)}
                      className={`px-3 py-1 text-xs font-medium rounded-full cursor-pointer transition-colors ${
                        selectedProgramType === filter.type
                          ? filter.color.replace('100', '200').replace('700', '800')
                          : filter.color + ' hover:' + filter.color.replace('100', '50')
                      }`}
                    >
                      {filter.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Field Filter */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Filter by Field</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    {
                      field: 'all',
                      name: 'All Fields',
                      icon: 'ri-grid-line',
                      color: 'bg-gray-100 text-gray-700'
                    },
                    {
                      field: 'Field A - African Varieties',
                      name: 'Field A',
                      icon: 'ri-plant-line',
                      color: 'bg-green-100 text-green-700'
                    },
                    {
                      field: 'Field B - Asian Mix',
                      name: 'Field B',
                      icon: 'ri-leaf-line',
                      color: 'bg-blue-100 text-blue-700'
                    },
                    {
                      field: 'Field C - Caribbean Heat',
                      name: 'Field C',
                      icon: 'ri-fire-line',
                      color: 'bg-red-100 text-red-700'
                    }
                  ].map((filter) => (
                    <button
                      key={filter.field}
                      onClick={() => setSelectedProgramField(filter.field)}
                      className={`px-3 py-1 text-xs font-medium rounded-full cursor-pointer transition-colors flex items-center ${
                        selectedProgramField === filter.field
                          ? filter.color.replace('100', '200').replace('700', '800')
                          : filter.color + ' hover:' + filter.color.replace('100', '50')
                      }`}
                    >
                      <i className={`${filter.icon} mr-1`}></i>
                      {filter.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter Summary */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Showing {filteredPrograms.length} of {sprayPrograms.length} programs
                  {(selectedProgramType !== 'all' || selectedProgramField !== 'all') && (
                    <span className="ml-2 text-green-600">
                      (Filtered by: {selectedProgramType !== 'all' && selectedProgramType}{selectedProgramType !== 'all' && selectedProgramField !== 'all' && ', '}{selectedProgramField !== 'all' && selectedProgramField})
                    </span>
                  )}
                </div>
                {(selectedProgramType !== 'all' || selectedProgramField !== 'all') && (
                  <button
                    onClick={() => {
                      setSelectedProgramType('all');
                      setSelectedProgramField('all');
                    }}
                    className="text-sm text-red-600 hover:text-red-800 cursor-pointer font-medium"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((program) => (
              <div key={program.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {program.name}
                    </h3>
                    <div className="flex items-center space-x-2 mb-1">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          program.type === 'spray'
                            ? 'bg-blue-100 text-blue-800'
                            : program.type === 'fertilizer'
                            ? 'bg-green-100 text-green-800'
                            : program.type === 'watering'
                            ? 'bg-cyan-100 text-cyan-800'
                            : program.type === 'pruning'
                            ? 'bg-purple-100 text-purple-800'
                            : program.type === 'mulching'
                            ? 'bg-yellow-100 text-yellow-800'
                            : program.type === 'cultivation'
                            ? 'bg-orange-100 text-orange-800'
                            : program.type === 'weeding'
                            ? 'bg-red-100 text-red-800'
                            : program.type === 'support'
                            ? 'bg-indigo-100 text-indigo-800'
                            : program.type === 'habitat'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {program.type === 'spray'
                          ? 'Spray'
                          : program.type === 'fertilizer'
                          ? 'Fertilizer'
                          : program.type === 'watering'
                          ? 'Watering'
                          : program.type === 'pruning'
                          ? 'Pruning'
                          : program.type === 'mulching'
                          ? 'Mulching'
                          : program.type === 'cultivation'
                          ? 'Cultivation'
                          : program.type === 'weeding'
                          ? 'Weeding'
                          : program.type === 'support'
                          ? 'Support'
                          : program.type === 'habitat'
                          ? 'Habitat'
                          : program.type.charAt(0).toUpperCase() +
                            program.type.slice(1)}
                      </span>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          program.status
                        )}`}
                      >
                        {program.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{program.field}</p>
                  </div>
                  <button
                    onClick={() => setEditingProgram(program)}
                    className="text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <i className="ri-edit-line w-5 h-5 flex items-center justify-center"></i>
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">
                        {program.type === 'watering'
                          ? 'System'
                          : program.type === 'pruning'
                          ? 'Tools'
                          : program.type === 'mulching'
                          ? 'Material'
                          : program.type === 'cultivation'
                          ? 'Equipment'
                          : program.type === 'weeding'
                          ? 'Method'
                          : program.type === 'support'
                          ? 'Materials'
                          : program.type === 'habitat'
                          ? 'Components'
                          : 'Product'}
                      </p>
                      <p className="font-medium">{program.product}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">
                        {program.type === 'waterer'
                          ? 'Amount'
                          : program.type === 'pruning'
                          ? 'Method'
                          : program.type === 'mulching'
                          ? 'Thickness'
                          : program.type === 'cultivation'
                          ? 'Depth'
                          : program.type === 'weeding'
                          ? 'Coverage'
                          : program.type === 'support'
                          ? 'Action'
                          : program.type === 'habitat'
                          ? 'Coverage'
                          : 'Dosage'}
                      </p>
                      <p className="font-medium">{program.dosage}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Frequency</p>
                      <p className="font-medium capitalize">
                        {program.frequency}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">
                        Next{' '}
                        {program.type === 'watering'
                          ? 'Watering'
                          : program.type === 'pruning'
                          ? 'Pruning'
                          : program.type === 'mulching'
                          ? 'Mulching'
                          : program.type === 'cultivation'
                          ? 'Cultivation'
                          : program.type === 'weeding'
                          ? 'Weeding'
                          : program.type === 'support'
                          ? 'Check'
                          : program.type === 'habitat'
                          ? 'Maintenance'
                          : 'Application'}
                      </p>
                      <p className="font-medium text-orange-600">
                        {program.nextApplication}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <p className="text-gray-500 mb-1">Notes</p>
                    <p className="text-gray-700">{program.notes}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <i className="ri-user-2-line w-5 h-5 text-gray-600"></i>
                    <p className="text-sm text-gray-600">Farm Team</p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <p className="text-gray-500 mb-1">Recent Applications</p>
                    <div className="space-y-1">
                      {program.applications.slice(0, 2).map((app, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-xs text-gray-600"
                        >
                          <span>{app.date}</span>
                          <span
                            className={`px-2 py-1 rounded ${
                              app.effectiveness === 'Excellent'
                                ? 'bg-green-100 text-green-700'
                                : app.effectiveness === 'Good'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {app.effectiveness}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <button className="flex-1 bg-green-600 text-white py-2 px-3 rounded-md hover:bg-green-700 cursor-pointer whitespace-nowrap text-sm">
                      Record{' '}
                      {program.type === 'watering'
                        ? 'Session'
                        : program.type === 'pruning'
                        ? 'Session'
                        : program.type === 'mulching'
                        ? 'Application'
                        : program.type === 'cultivation'
                        ? 'Session'
                        : program.type === 'weeding'
                        ? 'Session'
                        : program.type === 'support'
                        ? 'Check'
                        : program.type === 'habitat'
                        ? 'Maintenance'
                        : 'Application'}
                    </button>
                    <button className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 cursor-pointer">
                      <i className="ri-calendar-line w-4 h-4 flex items-center justify-center"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No programs found message */}
          {filteredPrograms.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <i className="ri-medicine-bottle-line text-4xl text-gray-400"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No programs found</h3>
              <p className="text-gray-500 mb-4">
                {selectedProgramType !== 'all' || selectedProgramField !== 'all'
                  ? `No programs found matching your current filters`
                  : 'No care programs have been created yet'
                }
              </p>
              <button
                onClick={() => {
                  setSelectedProgramType('all');
                  setSelectedProgramField('all');
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Reminders */}
      {activeSection === 'reminders' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <i className="ri-alarm-line w-6 h-6 flex items-center justify-center text-red-600 mr-3"></i>
                <div>
                  <p className="text-sm text-gray-500">Due Today</p>
                  <p className="text-xl font-bold text-gray-900">
                    {reminders.filter(
                      (r) => getDaysUntilDue(r.dueDate) === 0 && r.status === 'pending'
                    ).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <i className="ri-time-line w-6 h-6 flex items-center justify-center text-orange-600 mr-3"></i>
                <div>
                  <p className="text-sm text-gray-500">This Week</p>
                  <p className="text-xl font-bold text-gray-900">
                    {reminders.filter(
                      (r) => getDaysUntilDue(r.dueDate) <= 7 && r.status === 'pending'
                    ).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <i className="ri-check-line w-6 h-6 flex items-center justify-center text-green-600 mr-3"></i>
                <div>
                  <p className="text-sm text-gray-500">Completed</p>
                  <p className="text-xl font-bold text-gray-900">
                    {reminders.filter((r) => r.status === 'completed').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <i className="ri-list-check w-6 h-6 flex items-center justify-center text-blue-600 mr-3"></i>
                <div>
                  <p className="text-sm text-gray-500">Total Active</p>
                  <p className="text-xl font-bold text-gray-900">
                    {reminders.filter((r) => r.status === 'pending').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Upcoming Reminders
              </h3>
            </div>

            <div className="divide-y divide-gray-200">
              {reminders
                .filter((r) => r.status === 'pending')
                .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                .map((reminder) => {
                  const daysUntil = getDaysUntilDue(reminder.dueDate);
                  const isOverdue = daysUntil < 0;
                  const isDueToday = daysUntil === 0;

                  return (
                    <div
                      key={reminder.id}
                      className={`px-6 py-4 hover:bg-gray-50 ${
                        isOverdue ? 'bg-red-50' : isDueToday ? 'bg-orange-50' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              reminder.type === 'spray'
                                ? 'bg-blue-100'
                                : reminder.type === 'fertilizer'
                                ? 'bg-green-100'
                                : reminder.type === 'watering'
                                ? 'bg-cyan-100'
                                : reminder.type === 'pruning'
                                ? 'bg-purple-100'
                                : reminder.type === 'weeding'
                                ? 'bg-red-100'
                                : reminder.type === 'support'
                                ? 'bg-indigo-100'
                                : reminder.type === 'habitat'
                                ? 'bg-emerald-100'
                                : 'bg-gray-100'
                            }`}
                          >
                            <i
                              className={`${
                                reminder.type === 'spray'
                                  ? 'ri-medicine-bottle-line'
                                  : reminder.type === 'fertilizer'
                                  ? 'ri-seedling-line'
                                  : reminder.type === 'watering'
                                  ? 'ri-water-line'
                                  : reminder.type === 'pruning'
                                  ? 'ri-scissors-line'
                                  : reminder.type === 'weeding'
                                  ? 'ri-weeding-line'
                                  : reminder.type === 'support'
                                  ? 'ri-tools-line'
                                  : 'ri-flag-line'
                              } w-5 h-5 flex items-center justify-center text-gray-700`}
                            ></i>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium text-gray-900">
                              {reminder.title}
                            </h4>
                            <p className="text-sm text-gray-500">{reminder.field}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p
                              className={`text-sm font-medium ${
                                isOverdue
                                  ? 'text-red-600'
                                  : isDueToday
                                  ? 'text-orange-600'
                                  : 'text-gray-900'
                              }`}
                            >
                              {reminder.dueDate}
                            </p>
                            <p
                              className={`text-xs ${
                                isOverdue
                                  ? 'text-red-500'
                                  : isDueToday
                                  ? 'text-orange-500'
                                  : 'text-gray-500'
                              }`}
                            >
                              {isOverdue
                                ? `${Math.abs(daysUntil)} days overdue`
                                : isDueToday
                                ? 'Due today'
                                : `${daysUntil} days left`}
                            </p>
                          </div>

                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                              reminder.priority
                            )}`}
                          >
                            {reminder.priority}
                          </span>

                          <button
                            onClick={() => completeReminder(reminder.id)}
                            className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 cursor-pointer text-xs whitespace-nowrap"
                          >
                            Complete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* Equipment Management */}
      {activeSection === 'equipment' && (
        <EquipmentManager />
      )}

      {/* Field Service Management */}
      {activeSection === 'field-service' && (
        <FieldServiceManager />
      )}

      {/* Field Details Modal */}
      {selectedField && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full mx-4 max-h-[95vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold">{selectedField.name}</h3>
                  <p className="text-green-100 mt-1">
                    {selectedField.crop} • {selectedField.size}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedField(null)}
                  className="text-white hover:text-gray-200 cursor-pointer"
                >
                  <i className="ri-close-line w-8 h-8 flex items-center justify-center"></i>
                </button>
              </div>
            </div>

            <div className="flex h-[calc(95vh-120px)]">
              {/* Left Sidebar - Field Overview */}
              <div className="w-80 bg-gray-50 border-r border-gray-200 overflow-y-auto">
                <div className="p-6">
                  {/* Status Badge */}
                  <div className="flex justify-center mb-6">
                    <span
                      className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full ${getStatusColor(
                        selectedField.status
                      )}`}
                    >
                      <i className="ri-plant-line w-4 h-4 flex items-center justify-center mr-2"></i>
                      {selectedField.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Progress Circle */}
                  <div className="text-center mb-6">
                    <div className="relative inline-flex items-center justify-center w-32 h-32">
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          className="text-gray-200"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={`${2 * Math.PI * 56}`}
                          strokeDashoffset={`${
                            2 * Math.PI * 56 * (1 - selectedField.progress / 100)
                          }`}
                          className="text-green-500"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">
                            {selectedField.progress}%
                          </div>
                          <div className="text-xs text-gray-500">Growth</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Key Information */}
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border">
                      <div className="flex items-center mb-2">
                        <i className="ri-calendar-line w-5 h-5 flex items-center justify-center text-blue-500 mr-2"></i>
                        <span className="text-sm font-medium text-gray-700">
                          Timeline
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Planted:</span>
                          <span className="font-medium">{selectedField.plantingDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Harvest:</span>
                          <span className="font-medium">{selectedField.expectedHarvest}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Days Left:</span>
                          <span className="font-medium text-green-600">
                            {Math.ceil(
                              (new Date(selectedField.expectedHarvest).getTime() -
                                new Date().getTime()) /
                                (1000 * 60 * 60 * 24)
                            )}{' '}
                            days
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border">
                      <div className="flex items-center mb-2">
                        <i className="ri-drop-line w-5 h-5 flex items-center justify-center text-blue-500 mr-2"></i>
                        <span className="text-sm font-medium text-gray-700">
                          Last Watered
                        </span>
                      </div>
                      <p className="text-sm font-medium">{selectedField.lastWatered}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {Math.floor(
                          (new Date().getTime() -
                            new Date(selectedField.lastWatered).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )}{' '}
                        days ago
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white rounded-lg p-3 border text-center">
                        <div className="text-lg font-bold text-gray-900">{selectedField.soilPh}</div>
                        <div className="text-xs text-gray-500">Soil pH</div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border text-center">
                        <div className="text-lg font-bold text-gray-900">
                          {selectedField.temperature}
                        </div>
                        <div className="text-xs text-gray-500">Temperature</div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="mt-6 space-y-2">
                    <button
                      onClick={() => {
                        setSelectedField(null);
                        setShowAddTask(true);
                      }}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 cursor-pointer whitespace-nowrap text-sm font-medium"
                    >
                      <i className="ri-add-line w-4 h-4 flex items-center justify-center mr-2"></i>
                      Add Field Task
                    </button>
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 cursor-pointer whitespace-nowrap text-sm font-medium">
                      <i className="ri-edit-line w-4 h-4 flex items-center justify-center mr-2"></i>
                      Edit Field Info
                    </button>
                    <button className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 cursor-pointer whitespace-nowrap text-sm font-medium">
                      <i className="ri-camera-line w-4 h-4 flex items-center justify-center mr-2"></i>
                      Field Photos
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6">
                  {/* Field Description Card */}
                  <div className="bg-white rounded-lg border border-gray-200 mb-6">
                    <div className="border-b border-gray-200 px-6 py-4">
                      <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                        <i className="ri-information-line w-5 h-5 flex items-center justify-center text-blue-500 mr-2"></i>
                        Field Overview
                      </h4>
                    </div>
                    <div className="p-6">
                      <p className="text-gray-700 leading-relaxed mb-4">
                        {selectedField.description}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">
                            Current Conditions
                          </h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center">
                              <i className="ri-temp-hot-line w-4 h-4 flex items-center justify-center text-red-500 mr-2"></i>
                              <span className="text-gray-600">Temperature:</span>
                              <span className="font-medium ml-2">
                                {selectedField.temperature}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <i className="ri-water-percent-line w-4 h-4 flex items-center justify-center text-blue-500 mr-2"></i>
                              <span className="text-gray-600">Humidity:</span>
                              <span className="font-medium ml-2">
                                {selectedField.humidity}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <i className="ri-flask-line w-4 h-4 flex items-center justify-center text-purple-500 mr-2"></i>
                              <span className="text-gray-600">Soil pH:</span>
                              <span className="font-medium ml-2">
                                {selectedField.soilPh}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">
                            Weather Status
                          </h5>
                          <div className="flex items-start">
                            <i className="ri-sun-line w-4 h-4 flex items-center justify-center text-yellow-500 mr-2 mt-0.5"></i>
                            <p className="text-sm text-gray-700">
                              {selectedField.weatherConditions}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Systems & Management */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white rounded-lg border border-gray-200">
                      <div className="border-b border-gray-200 px-6 py-4">
                        <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                          <i className="ri-drop-line w-5 h-5 flex items-center justify-center text-blue-500 mr-2"></i>
                          Irrigation System
                        </h4>
                      </div>
                      <div className="p-6">
                        <p className="text-gray-700 mb-4">{selectedField.irrigation}</p>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                            <span className="text-sm font-medium text-blue-900">
                              System Status
                            </span>
                            <span className="inline-flex px-2 py-1 text-xs font-semibold bg-green-100 text-green-800">
                              Active
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">
                              Next Scheduled
                            </span>
                            <span className="text-sm text-gray-900">Today 6:00 AM</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200">
                      <div className="border-b border-gray-200 px-6 py-4">
                        <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                          <i className="ri-seedling-line w-5 h-5 flex items-center justify-center text-green-500 mr-2"></i>
                          Fertilization
                        </h4>
                      </div>
                      <div className="p-6">
                        <p className="text-gray-700 mb-1">{selectedField.fertilizer}</p>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <span className="text-sm font-medium text-green-900">
                              Last Application
                            </span>
                            <span className="text-sm text-green-700">Jan 10, 2024</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">
                              Next Due
                            </span>
                            <span className="text-sm text-gray-900">Feb 10, 2024</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Field Notes */}
                  <div className="bg-white rounded-lg border border-gray-200 mb-6">
                    <div className="border-b border-gray-200 px-6 py-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                          <i className="ri-sticky-note-line w-5 h-5 flex items-center justify-center text-yellow-500 mr-2"></i>
                          Field Notes &amp; Observations
                        </h4>
                        <button className="text-sm text-green-600 hover:text-green-700 cursor-pointer font-medium">
                          Add Note
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                        <div className="flex items-start">
                          <i className="ri-lightbulb-line w-5 h-5 flex items-center justify-center text-yellow-600 mr-2 mt-0.5"></i>
                          <div>
                            <p className="text-sm text-yellow-800 font-medium">
                              Current Observation
                            </p>
                            <p className="text-sm text-yellow-700 mt-1">
                              {selectedField.notes}
                            </p>
                            <p className="text-xs text-yellow-600 mt-2">
                              Updated 2 days ago
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Related Tasks */}
                  <div className="bg-white rounded-lg border border-gray-200">
                    <div className="border-b border-gray-200 px-6 py-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                          <i className="ri-task-line w-5 h-5 flex items-center justify-center text-purple-500 mr-2"></i>
                          Related Field Operations
                        </h4>
                        <button className="text-sm text-green-600 hover:text-green-700 cursor-pointer font-medium">
                          View All Tasks
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="space-y-3">
                        {fieldOperations
                          .filter((op) => op.field === selectedField.name)
                          .slice(0, 3)
                          .map((operation) => (
                            <div
                              key={operation.id}
                              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                            >
                              <div className="flex items-center">
                                <div
                                  className={`w-3 h-3 rounded-full mr-3 ${getPriorityColor(
                                    operation.priority
                                  )
                                    .replace('text-', 'bg-')
                                    .replace('-600', '-500')}`}
                                ></div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {operation.title}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Due: {operation.dueDate} • {operation.assignedTo}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span
                                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                    operation.status
                                  )}`}
                                >
                                  {operation.status}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {operation.progress}%
                                </span>
                              </div>
                            </div>
                          ))}

                        {fieldOperations.filter((op) => op.field === selectedField.name)
                          .length === 0 && (
                          <div className="text-center py-8">
                            <i className="ri-task-line w-12 h-12 flex items-center justify-center text-gray-300 mx-auto mb-4"></i>
                            <p className="text-gray-500 text-sm">
                              No active operations for this field
                            </p>
                            <button className="mt-2 text-green-600 hover:text-green-700 cursor-pointer text-sm font-medium">
                              Create First Task
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Field Operation Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Edit Field Operation</h3>
              <button
                onClick={() => setEditingTask(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line w-6 h-6 flex items-center justify-center"></i>
              </button>
            </div>

            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const updatedTask = {
                  ...editingTask,
                  title: formData.get('title') as string,
                  field: formData.get('field') as string,
                  priority: formData.get('priority') as string,
                  status: formData.get('status') as string,
                  assignedTo: formData.get('assignedTo') as string,
                  dueDate: formData.get('dueDate') as string,
                  estimatedHours:
                    parseInt(formData.get('estimatedHours') as string) || 0,
                  actualHours:
                    parseFloat(formData.get('actualHours') as string) || 0,
                  progress: parseInt(formData.get('progress') as string) || 0,
                  tags: (formData.get('tags') as string)
                    .split(',')
                    .map((tag) => tag.trim())
                    .filter((tag) => tag),
                  description: formData.get('description') as string
                };
                handleUpdateOperation(updatedTask);
              }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Operation Title
                  </label>
                  <input
                    name="title"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    defaultValue={editingTask.title}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Field
                  </label>
                  <select
                    name="field"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 pr-8"
                    defaultValue={editingTask.field}
                  >
                    <option>Field A - African Varieties</option>
                    <option>Field B - Asian Mix</option>
                    <option>Field C - Caribbean Heat</option>
                    <option>All Fields</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    name="priority"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 pr-8"
                    defaultValue={editingTask.priority}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 pr-8"
                    defaultValue={editingTask.status}
                  >
                    <option value="planning">Planning</option>
                    <option value="in-progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assigned To
                  </label>
                  <select
                    name="assignedTo"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 pr-8"
                    defaultValue={editingTask.assignedTo}
                  >
                    <option>Joseph Pacho</option>
                    <option>Sarah Pacho</option>
                    <option>Farm Team</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    name="dueDate"
                    type="date"
                    className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    defaultValue={editingTask.dueDate}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Hours
                  </label>
                  <input
                    name="estimatedHours"
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    defaultValue={editingTask.estimatedHours}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Actual Hours
                  </label>
                  <input
                    name="actualHours"
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    defaultValue={editingTask.actualHours}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Progress (%)
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    name="progress"
                    type="range"
                    min="0"
                    max="100"
                    className="flex-1"
                    defaultValue={editingTask.progress}
                  />
                  <span className="text-sm font-medium text-gray-700 w-12">
                    {editingTask.progress}%
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  name="tags"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  defaultValue={editingTask.tags.join(', ')}
                  placeholder="Enter tags separated by commas"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={4}
                  defaultValue={editingTask.description}
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="px-6 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 cursor-pointer whitespace-nowrap"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer whitespace-nowrap"
                >
                  Update Operation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Field Modal */}
      {showAddField && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add New Field</h3>
              <button
                onClick={() => setShowAddField(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line w-6 h-6 flex items-center justify-center"></i>
              </button>
            </div>

            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                handleAddField(formData);
              }}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Field Name
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="i.e., Field D - Super Hot Varieties"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Size (acres)
                  </label>
                  <input
                    name="size"
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="i.e., 2.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Crop Type
                  </label>
                  <input
                    name="crop"
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="i.e., Carolina Reaper"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Planting Date
                </label>
                <input
                  name="plantingDate"
                  type="date"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={3}
                  placeholder="Field description and notes..."
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddField(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 cursor-pointer whitespace-nowrap"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer whitespace-nowrap"
                >
                  Add Field
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddTask && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAddTask(false);
            }
          }}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-lg w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add New Field Operation</h3>
              <button
                onClick={() => setShowAddTask(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
                type="button"
              >
                <i className="ri-close-line w-6 h-6 flex items-center justify-center"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Operation Title *
                </label>
                <input
                  id="task-title"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Irrigation System Installation"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Field *
                  </label>
                  <select
                    id="task-field"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 pr-8"
                  >
                    <option value="">Select Field</option>
                    <option value="Field A - African Varieties">
                      Field A - African Varieties
                    </option>
                    <option value="Field B - Asian Mix">Field B - Asian Mix</option>
                    <option value="Field C - Caribbean Heat">
                      Field C - Caribbean Heat
                    </option>
                    <option value="All Fields">All Fields</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority *
                  </label>
                  <select
                    id="task-priority"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 pr-8"
                  >
                    <option value="">Select Priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date *
                  </label>
                  <input
                    id="task-dueDate"
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assigned To *
                  </label>
                  <select
                    id="task-assignedTo"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 pr-8"
                  >
                    <option value="">Select Team Member</option>
                    <option value="Joseph Pacho">Joseph Pacho</option>
                    <option value="Sarah Pacho">Sarah Pacho</option>
                    <option value="Farm Team">Farm Team</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Hours
                  </label>
                  <input
                    id="task-estimatedHours"
                    type="number"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="8"
                    defaultValue="8"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags
                  </label>
                  <input
                    id="task-tags"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="irrigation, infrastructure"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="task-description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={3}
                  placeholder="Operation description and details..."
                  maxLength={500}
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddTask(false)}
                  className="px-6 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 cursor-pointer whitespace-nowrap"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const title = (document.getElementById('task-title') as HTMLInputElement)
                      ?.value;
                    const field = (document.getElementById('task-field') as HTMLSelectElement)
                      ?.value;
                    const priority = (document.getElementById('task-priority') as HTMLSelectElement)
                      ?.value;
                    const dueDate = (document.getElementById('task-dueDate') as HTMLInputElement)
                      ?.value;
                    const assignedTo = (document.getElementById('task-assignedTo') as HTMLSelectElement)
                      ?.value;
                    const estimatedHours = (document.getElementById('task-estimatedHours') as HTMLInputElement)
                      ?.value;
                    const tags = (document.getElementById('task-tags') as HTMLInputElement)
                      ?.value;
                    const description = (document.getElementById('task-description') as HTMLTextAreaElement)
                      ?.value;

                    if (!title || !field || !priority || !dueDate || !assignedTo) {
                      alert('Please fill in all required fields');
                      return;
                    }

                    const newTask = {
                      id: fieldOperations.length + 1,
                      title,
                      field,
                      priority,
                      status: 'planning',
                      assignedTo,
                      dueDate,
                      progress: 0,
                      description: description || '',
                      tags: tags
                        ? tags
                            .split(',')
                            .map((tag) => tag.trim())
                            .filter((tag) => tag)
                        : [],
                      estimatedHours: parseInt(estimatedHours) || 8,
                      actualHours: 0
                    };

                    handleAddTask(newTask);
                  }}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer whitespace-nowrap"
                >
                  Create Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Field Modal */}
      {editingField && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Field</h3>
              <button
                onClick={() => setEditingField(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line w-6 h-6 flex items-center justify-center"></i>
              </button>
            </div>

            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                handleUpdateField(formData);
              }}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Field Name
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  defaultValue={editingField.name}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Size
                  </label>
                  <input
                    name="size"
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    defaultValue={editingField.size}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CropType
                  </label>
                  <input
                    name="crop"
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    defaultValue={editingField.crop}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={3}
                  defaultValue={editingField.description}
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingField(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 cursor-pointer whitespace-nowrap"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer whitespace-nowrap"
                >
                  Update Field
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Program Modal */}
      {showAddProgram && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add Care Program</h3>
              <button
                onClick={() => setShowAddProgram(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line w-6 h-6 flex items-center justify-center"></i>
              </button>
            </div>

            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                handleAddProgram(formData);
              }}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Program Name
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Weekly Irrigation Program"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    name="type"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 pr-8"
                  >
                    <option value="">Select Type</option>
                    <option value="spray">Spray</option>
                    <option value="fertilizer">Fertilizer</option>
                    <option value="watering">Watering</option>
                    <option value="pruning">Pruning</option>
                    <option value="mulching">Mulching</option>
                    <option value="cultivation">Cultivation</option>
                    <option value="weeding">Weeding</option>
                    <option value="support">Support</option>
                    <option value="habitat">Habitat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Field
                  </label>
                  <select
                    name="field"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 pr-8"
                  >
                    <option value="">Select Field</option>
                    <option value="Field A - African Varieties">
                      Field A - African Varieties
                    </option>
                    <option value="Field B - Asian Mix">Field B - Asian Mix</option>
                    <option value="Field C - Caribbean Heat">
                      Field C - Caribbean Heat
                    </option>
                    <option value="All Fields">All Fields</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product/System/Tools
                </label>
                <input
                  name="product"
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="i.e., Neem Oil, NPK 10-10-10, Drip Irrigation, Pruning Shears"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount/Method/Coverage
                  </label>
                  <input
                    name="dosage"
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="i.e., 2ml/L, 50g per plant, Remove 20% lower branches"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Frequency
                  </label>
                  <select
                    name="frequency"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 pr-8"
                  >
                    <option value="">Select Frequency</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="bi-weekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  name="startDate"
                  type="date"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  name="notes"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={3}
                  placeholder="Application instructions, timing notes, precautions, technique details..."
                  maxLength={500}
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddProgram(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 cursor-pointer whitespace-nowrap"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer whitespace-nowrap"
                >
                  Create Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Reminder Modal */}
      {showAddReminder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add Reminder</h3>
              <button
                onClick={() => setShowAddReminder(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line w-6 h-6 flex items-center justify-center"></i>
              </button>
            </div>

            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                handleAddReminder(formData);
              }}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reminder Title
                </label>
                <input
                  name="title"
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="i.e., Apply Neem Oil Spray - Field A"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Program
                  </label>
                  <select
                    name="program"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 pr-8"
                  >
                    <option value="">Select Program</option>
                    <option value="Organic Pest Control Program">Organic Pest Control Program</option>
                    <option value="Nutrient Boost Program">Nutrient Boost Program</option>
                    <option value="Calcium Deficiency Treatment">
                      Calcium Deficiency Treatment
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    name="dueDate"
                    type="date"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  name="priority"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 pr-8"
                >
                  <option value="">Select Priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Field
                </label>
                <select
                  name="field"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 pr-8"
                >
                  <option value="">Select Field</option>
                  <option value="Field A - African Varieties">
                    Field A - African Varieties
                  </option>
                  <option value="Field B - Asian Mix">Field B - Asian Mix</option>
                  <option value="Field C - Caribbean Heat">
                    Field C - Caribbean Heat
                  </option>
                  <option value="All Fields">All Fields</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  name="notes"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={3}
                  placeholder="Reminder details and notes..."
                  maxLength={500}
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddReminder(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 cursor-pointer whitespace-nowrap"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer whitespace-nowrap"
                >
                  Add Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Unified Operations Calendar Modal */}
      {showUnifiedCalendar && (
        <UnifiedOperationsCalendar 
          onClose={() => setShowUnifiedCalendar(false)}
          fieldOperations={fieldOperations}
          setFieldOperations={setFieldOperations}
          sprayPrograms={sprayPrograms}
          setSprayPrograms={setSprayPrograms}
          fields={fields}
          reminders={reminders}
          setReminders={setReminders}
        />
      )}
    </div>
  );
}
