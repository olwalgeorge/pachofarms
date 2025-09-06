'use client';

import { useState } from 'react';

interface Equipment {
  id: number;
  name: string;
  category: string;
  status: 'available' | 'in-use' | 'maintenance' | 'damaged';
  location: string;
  lastMaintenance: string;
  nextMaintenance: string;
  assignedTo: string;
  purchaseDate: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  serialNumber: string;
  manufacturer: string;
  model: string;
  notes: string;
  purchasePrice?: number;
  warrantyExpiry?: string;
  operatingHours?: number;
  fuelType?: string;
  specifications?: string;
}

interface MaintenanceRecord {
  id: number;
  equipmentId: number;
  equipmentName: string;
  type: 'routine' | 'repair' | 'inspection' | 'upgrade';
  description: string;
  cost: number;
  performedBy: string;
  date: string;
  hoursAtMaintenance: number;
  nextDueHours?: number;
  partsReplaced: string[];
  notes: string;
  status: 'completed' | 'in-progress' | 'scheduled';
}

interface SprayRecord {
  id: number;
  equipmentId: number;
  equipmentName: string;
  field: string;
  sprayType: string;
  chemical: string;
  mixture: string;
  area: number;
  date: string;
  operator: string;
  startTime: string;
  endTime: string;
  weatherConditions: string;
  notes: string;
}

export default function EquipmentManager() {
  const [equipment, setEquipment] = useState<Equipment[]>([
    {
      id: 1,
      name: "John Deere Tractor 5075E",
      category: "Heavy Machinery",
      status: "available",
      location: "Main Equipment Barn",
      lastMaintenance: "2024-01-15",
      nextMaintenance: "2024-04-15",
      assignedTo: "Farm Team A",
      purchaseDate: "2022-03-10",
      condition: "excellent",
      serialNumber: "JD5075E-2022-001",
      manufacturer: "John Deere",
      model: "5075E",
      notes: "Primary cultivation tractor, 75HP diesel engine",
      purchasePrice: 85000,
      warrantyExpiry: "2025-03-10",
      operatingHours: 1240,
      fuelType: "Diesel",
      specifications: "75HP, 4WD, Hydraulic lift, PTO"
    },
    {
      id: 2,
      name: "Irrigation Pump System",
      category: "Irrigation",
      status: "in-use",
      location: "Field A - North Section",
      lastMaintenance: "2024-01-20",
      nextMaintenance: "2024-03-20",
      assignedTo: "Irrigation Team",
      purchaseDate: "2023-05-15",
      condition: "good",
      serialNumber: "IP-2023-045",
      manufacturer: "Grundfos",
      model: "CR 32-4",
      notes: "Centrifugal pump for drip irrigation, 7.5kW motor"
    },
    {
      id: 3,
      name: "Cultivator 12-Tine",
      category: "Tillage Equipment",
      status: "maintenance",
      location: "Maintenance Workshop",
      lastMaintenance: "2024-01-25",
      nextMaintenance: "2024-02-25",
      assignedTo: "Maintenance Team",
      purchaseDate: "2021-08-20",
      condition: "fair",
      serialNumber: "CT-12T-2021-007",
      manufacturer: "Maschio",
      model: "Artiglio 300",
      notes: "Needs tine replacement and hydraulic system check"
    },
    {
      id: 4,
      name: "Seed Drill Precision",
      category: "Planting Equipment",
      status: "available",
      location: "Equipment Shed B",
      lastMaintenance: "2024-01-10",
      nextMaintenance: "2024-04-10",
      assignedTo: "Planting Crew",
      purchaseDate: "2023-02-28",
      condition: "excellent",
      serialNumber: "SD-P300-2023-012",
      manufacturer: "Väderstad",
      model: "Spirit 300S",
      notes: "3-meter precision seed drill with coulter discs"
    },
    {
      id: 5,
      name: "Sprayer Self-Propelled",
      category: "Spray Equipment",
      status: "in-use",
      location: "Field B - Central",
      lastMaintenance: "2024-01-12",
      nextMaintenance: "2024-03-12",
      assignedTo: "Spray Team",
      purchaseDate: "2022-11-05",
      condition: "good",
      serialNumber: "SP-4000-2022-089",
      manufacturer: "Hardi",
      model: "Navigator 4000",
      notes: "Self-propelled boom sprayer, 4000L tank capacity"
    },
    {
      id: 6,
      name: "Harvester Combine",
      category: "Harvesting Equipment",
      status: "available",
      location: "Main Equipment Barn",
      lastMaintenance: "2023-12-20",
      nextMaintenance: "2024-06-20",
      assignedTo: "Harvest Team",
      purchaseDate: "2021-06-15",
      condition: "good",
      serialNumber: "CH-7200-2021-034",
      manufacturer: "Case IH",
      model: "Axial-Flow 7250",
      notes: "Combine harvester with 7.6m header, GPS guidance"
    },
    {
      id: 7,
      name: "Rotavator 2.5m",
      category: "Tillage Equipment",
      status: "damaged",
      location: "Maintenance Workshop",
      lastMaintenance: "2024-01-05",
      nextMaintenance: "2024-03-05",
      assignedTo: "Repair Shop",
      purchaseDate: "2020-04-12",
      condition: "poor",
      serialNumber: "RT-25-2020-156",
      manufacturer: "Maschio",
      model: "DM-Rapido 250",
      notes: "Gearbox failure, awaiting parts from manufacturer"
    },
    {
      id: 8,
      name: "Disc Harrow Heavy Duty",
      category: "Tillage Equipment",
      status: "available",
      location: "Equipment Shed A",
      lastMaintenance: "2024-01-18",
      nextMaintenance: "2024-04-18",
      assignedTo: "Cultivation Team",
      purchaseDate: "2022-09-30",
      condition: "excellent",
      serialNumber: "DH-HD-2022-078",
      manufacturer: "Lemken",
      model: "Rubin 12/400",
      notes: "4-meter heavy disc harrow with hydraulic adjustment"
    },
    // Hand Tools
    {
      id: 9,
      name: "Pruning Shears Set (12 units)",
      category: "Hand Tools",
      status: "available",
      location: "Tool Storage A",
      lastMaintenance: "2024-01-08",
      nextMaintenance: "2024-04-08",
      assignedTo: "Field Workers",
      purchaseDate: "2023-01-15",
      condition: "excellent",
      serialNumber: "PS-SET-2023-001",
      manufacturer: "Felco",
      model: "Felco 2",
      notes: "Professional bypass pruning shears, regularly sharpened"
    },
    {
      id: 10,
      name: "Garden Hoes (8 units)",
      category: "Hand Tools",
      status: "available",
      location: "Tool Storage A",
      lastMaintenance: "2024-01-10",
      nextMaintenance: "2024-03-10",
      assignedTo: "Weeding Team",
      purchaseDate: "2022-08-20",
      condition: "good",
      serialNumber: "GH-SET-2022-003",
      manufacturer: "DeWit",
      model: "Traditional Dutch Hoe",
      notes: "Sharp carbon steel blades, comfortable ash handles"
    },
    {
      id: 11,
      name: "Hand Sprayers (6 units)",
      category: "Hand Tools",
      status: "available",
      location: "Chemical Storage Room",
      lastMaintenance: "2024-01-12",
      nextMaintenance: "2024-02-12",
      assignedTo: "Spray Team",
      purchaseDate: "2023-04-05",
      condition: "excellent",
      serialNumber: "HS-SET-2023-008",
      manufacturer: "Solo",
      model: "Solo 456",
      notes: "2-liter capacity manual sprayers with adjustable nozzles"
    },
    {
      id: 12,
      name: "Harvesting Baskets (20 units)",
      category: "Hand Tools",
      status: "available",
      location: "Harvest Storage",
      lastMaintenance: "2024-01-05",
      nextMaintenance: "2024-07-05",
      assignedTo: "Harvest Team",
      purchaseDate: "2022-05-10",
      condition: "good",
      serialNumber: "HB-SET-2022-015",
      manufacturer: "FarmCraft",
      model: "Ventilated Harvest Basket",
      notes: "Plastic ventilated baskets, 25L capacity each"
    },
    {
      id: 13,
      name: "Wheelbarrows (4 units)",
      category: "Hand Tools",
      status: "available",
      location: "Equipment Shed C",
      lastMaintenance: "2024-01-15",
      nextMaintenance: "2024-04-15",
      assignedTo: "General Farm Use",
      purchaseDate: "2021-12-08",
      condition: "good",
      serialNumber: "WB-SET-2021-005",
      manufacturer: "Truper",
      model: "Heavy Duty 6 cu ft",
      notes: "Steel construction with pneumatic tire, 300lb capacity"
    },
    // Measurement & Testing Tools
    {
      id: 14,
      name: "Digital pH Meter",
      category: "Measurement Tools",
      status: "available",
      location: "Laboratory",
      lastMaintenance: "2024-01-20",
      nextMaintenance: "2024-04-20",
      assignedTo: "Quality Control",
      purchaseDate: "2023-09-12",
      condition: "excellent",
      serialNumber: "PH-DIG-2023-002",
      manufacturer: "Hanna Instruments",
      model: "HI-2020",
      notes: "Professional grade pH meter with automatic calibration"
    },
    {
      id: 15,
      name: "Soil Thermometer Set (5 units)",
      category: "Measurement Tools",
      status: "available",
      location: "Laboratory",
      lastMaintenance: "2024-01-18",
      nextMaintenance: "2024-07-18",
      assignedTo: "Field Monitoring",
      purchaseDate: "2022-11-22",
      condition: "good",
      serialNumber: "ST-SET-2022-007",
      manufacturer: "Rapitest",
      model: "Digital Soil Thermometer",
      notes: "12-inch probe depth, -10°C to +50°C range"
    },
    {
      id: 16,
      name: "Moisture Meters (3 units)",
      category: "Measurement Tools",
      status: "available",
      location: "Field Office",
      lastMaintenance: "2024-01-22",
      nextMaintenance: "2024-04-22",
      assignedTo: "Irrigation Team",
      purchaseDate: "2023-07-08",
      condition: "excellent",
      serialNumber: "MM-SET-2023-011",
      manufacturer: "General Tools",
      model: "MMD4E Digital",
      notes: "Pin-type moisture meter for soil and plant material"
    },
    // Power Tools
    {
      id: 17,
      name: "Chainsaw Professional",
      category: "Power Tools",
      status: "available",
      location: "Tool Storage B",
      lastMaintenance: "2024-01-10",
      nextMaintenance: "2024-03-10",
      assignedTo: "Maintenance Team",
      purchaseDate: "2022-10-15",
      condition: "excellent",
      serialNumber: "CS-PRO-2022-003",
      manufacturer: "Stihl",
      model: "MS 261 C-M",
      notes: "50.2cc professional chainsaw with 18-inch bar"
    },
    {
      id: 18,
      name: "Brush Cutter",
      category: "Power Tools",
      status: "in-use",
      location: "Field C Perimeter",
      lastMaintenance: "2024-01-14",
      nextMaintenance: "2024-03-14",
      assignedTo: "Grounds Maintenance",
      purchaseDate: "2023-03-25",
      condition: "good",
      serialNumber: "BC-2023-006",
      manufacturer: "Husqvarna",
      model: "545RX",
      notes: "Professional brush cutter for clearing vegetation"
    },
    {
      id: 19,
      name: "Hedge Trimmer Electric",
      category: "Power Tools",
      status: "available",
      location: "Tool Storage B",
      lastMaintenance: "2024-01-16",
      nextMaintenance: "2024-04-16",
      assignedTo: "Landscape Team",
      purchaseDate: "2023-06-12",
      condition: "excellent",
      serialNumber: "HT-ELC-2023-009",
      manufacturer: "Black & Decker",
      model: "BEHT350",
      notes: "22-inch dual-action blade, corded electric"
    },
    // Safety Equipment
    {
      id: 20,
      name: "Safety Helmets (10 units)",
      category: "Safety Equipment",
      status: "available",
      location: "Safety Station",
      lastMaintenance: "2024-01-08",
      nextMaintenance: "2024-07-08",
      assignedTo: "All Workers",
      purchaseDate: "2023-02-18",
      condition: "excellent",
      serialNumber: "SH-SET-2023-004",
      manufacturer: "3M",
      model: "H-700 Series",
      notes: "ANSI/ISEA Z89.1 compliant hard hats with chin straps"
    },
    {
      id: 21,
      name: "Safety Goggles (15 units)",
      category: "Safety Equipment",
      status: "available",
      location: "Safety Station",
      lastMaintenance: "2024-01-12",
      nextMaintenance: "2024-07-12",
      assignedTo: "Chemical Handling Team",
      purchaseDate: "2023-04-20",
      condition: "good",
      serialNumber: "SG-SET-2023-007",
      manufacturer: "Uvex",
      model: "Stealth OTG",
      notes: "Chemical splash protection, anti-fog coating"
    },
    {
      id: 22,
      name: "Respirator Masks (12 units)",
      category: "Safety Equipment",
      status: "available",
      location: "Safety Station",
      lastMaintenance: "2024-01-15",
      nextMaintenance: "2024-04-15",
      assignedTo: "Spray Operations",
      purchaseDate: "2023-08-10",
      condition: "excellent",
      serialNumber: "RM-SET-2023-012",
      manufacturer: "3M",
      model: "6200 Half Facepiece",
      notes: "P100 filter cartridges for pesticide application"
    }
  ]);

  const [sprayRecords, setSprayRecords] = useState<SprayRecord[]>([
    {
      id: 1,
      equipmentId: 5,
      equipmentName: "Sprayer Self-Propelled",
      field: "Field A - North Section",
      sprayType: "Pesticide",
      chemical: "Malathion",
      mixture: "2.5L per 1000L water",
      area: 15.5,
      date: "2024-01-20",
      operator: "John Smith",
      startTime: "06:30",
      endTime: "11:45",
      weatherConditions: "Clear, 22°C, Wind: 5km/h NE",
      notes: "Applied for aphid control on chili plants"
    },
    {
      id: 2,
      equipmentId: 5,
      equipmentName: "Sprayer Self-Propelled",
      field: "Field B - Central",
      sprayType: "Fungicide",
      chemical: "Copper Sulfate",
      mixture: "3L per 1000L water",
      area: 12.0,
      date: "2024-01-18",
      operator: "Maria Garcia",
      startTime: "07:00",
      endTime: "10:30",
      weatherConditions: "Partly cloudy, 20°C, Wind: 3km/h SW",
      notes: "Preventive treatment for fungal diseases"
    }
  ]);

  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([
    {
      id: 1,
      equipmentId: 1,
      equipmentName: "John Deere Tractor 5075E",
      type: 'routine',
      description: 'Oil change, filter replacement, hydraulic system check',
      cost: 350.00,
      performedBy: 'Mike Thompson - Certified Technician',
      date: '2024-01-15',
      hoursAtMaintenance: 1250,
      nextDueHours: 1500,
      partsReplaced: ['Engine Oil Filter', 'Hydraulic Filter', 'Air Filter'],
      notes: 'All systems operating normally. Recommended tire rotation at 1300 hours.',
      status: 'completed'
    },
    {
      id: 2,
      equipmentId: 3,
      equipmentName: "Cultivator 12-Tine",
      type: 'repair',
      description: 'Replace damaged tines, hydraulic cylinder repair',
      cost: 480.00,
      performedBy: 'Farm Maintenance Team',
      date: '2024-01-25',
      hoursAtMaintenance: 680,
      partsReplaced: ['3x Cultivator Tines', 'Hydraulic Seal Kit'],
      notes: 'Extensive wear on tines due to rocky soil conditions. Consider field preparation.',
      status: 'in-progress'
    },
    {
      id: 3,
      equipmentId: 5,
      equipmentName: "Sprayer Self-Propelled",
      type: 'inspection',
      description: 'Annual safety inspection and calibration',
      cost: 125.00,
      performedBy: 'Equipment Safety Inspector',
      date: '2024-01-12',
      hoursAtMaintenance: 340,
      nextDueHours: 600,
      partsReplaced: [],
      notes: 'Passed all safety checks. Spray pattern calibration completed.',
      status: 'completed'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [conditionFilter, setConditionFilter] = useState('all');
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [showSprayModal, setShowSprayModal] = useState(false);
  const [selectedSprayEquipment, setSelectedSprayEquipment] = useState<Equipment | null>(null);
  const [showSprayRecords, setShowSprayRecords] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showMaintenanceRecords, setShowMaintenanceRecords] = useState(false);
  const [selectedEquipmentForMaintenance, setSelectedEquipmentForMaintenance] = useState<Equipment | null>(null);
  const [maintenanceFilter, setMaintenanceFilter] = useState('all');
  const [showEquipmentDetails, setShowEquipmentDetails] = useState<Equipment | null>(null);

  const categories = [
    'Heavy Machinery',
    'Irrigation',
    'Tillage Equipment', 
    'Planting Equipment',
    'Spray Equipment',
    'Harvesting Equipment',
    'Hand Tools',
    'Measurement Tools',
    'Power Tools',
    'Safety Equipment',
    'Maintenance Tools',
    'Processing Equipment',
    'Storage Equipment',
    'Transport Equipment'
  ];

  const statuses = [
    { value: 'available', label: 'Available', color: 'bg-green-100 text-green-800' },
    { value: 'in-use', label: 'In Use', color: 'bg-blue-100 text-blue-800' },
    { value: 'maintenance', label: 'Maintenance', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'damaged', label: 'Damaged', color: 'bg-red-100 text-red-800' }
  ];

  const conditions = [
    { value: 'excellent', label: 'Excellent', color: 'text-green-600' },
    { value: 'good', label: 'Good', color: 'text-blue-600' },
    { value: 'fair', label: 'Fair', color: 'text-yellow-600' },
    { value: 'poor', label: 'Poor', color: 'text-red-600' }
  ];

  const filteredEquipment = equipment.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    const matchesCondition = conditionFilter === 'all' || item.condition === conditionFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.model.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesStatus && matchesCondition && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = statuses.find(s => s.value === status);
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig?.color}`}>
        {statusConfig?.label}
      </span>
    );
  };

  const getConditionColor = (condition: string) => {
    return conditions.find(c => c.value === condition)?.color || 'text-gray-600';
  };

  const isMaintenanceDue = (nextMaintenance: string) => {
    const today = new Date();
    const maintenanceDate = new Date(nextMaintenance);
    const daysUntil = Math.ceil((maintenanceDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysUntil <= 7;
  };

  const handleSprayAction = (equipment: Equipment) => {
    setSelectedSprayEquipment(equipment);
    setShowSprayModal(true);
  };

  const handleAddSprayRecord = (sprayData: Omit<SprayRecord, 'id'>) => {
    const newRecord: SprayRecord = {
      ...sprayData,
      id: Math.max(...sprayRecords.map(r => r.id), 0) + 1
    };
    setSprayRecords(prev => [...prev, newRecord]);
    setShowSprayModal(false);
    setSelectedSprayEquipment(null);
  };

  const handleAddEquipment = (newEquipment: Omit<Equipment, 'id'>) => {
    const newEquipmentItem: Equipment = {
      ...newEquipment,
      id: Math.max(...equipment.map(e => e.id)) + 1
    };
    setEquipment(prev => [...prev, newEquipmentItem]);
    setShowAddForm(false);
  };

  const handleUpdateEquipment = (updatedEquipment: Equipment) => {
    setEquipment(prev => 
      prev.map(item => 
        item.id === updatedEquipment.id ? updatedEquipment : item
      )
    );
    setEditingEquipment(null);
  };

  const handleDeleteEquipment = (id: number) => {
    if (confirm('Are you sure you want to delete this equipment?')) {
      setEquipment(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleMaintenanceAction = (equipment: Equipment) => {
    setSelectedEquipmentForMaintenance(equipment);
    setShowMaintenanceModal(true);
  };

  const handleAddMaintenanceRecord = (maintenanceData: Omit<MaintenanceRecord, 'id'>) => {
    const newRecord: MaintenanceRecord = {
      ...maintenanceData,
      id: Math.max(...maintenanceRecords.map(r => r.id), 0) + 1
    };
    setMaintenanceRecords(prev => [...prev, newRecord]);
    
    // Update equipment maintenance dates
    if (maintenanceData.status === 'completed') {
      setEquipment(prev => 
        prev.map(item => 
          item.id === maintenanceData.equipmentId 
            ? { 
                ...item, 
                lastMaintenance: maintenanceData.date,
                operatingHours: maintenanceData.hoursAtMaintenance,
                nextMaintenance: calculateNextMaintenanceDate(maintenanceData.date, item.category)
              }
            : item
        )
      );
    }
    
    setShowMaintenanceModal(false);
    setSelectedEquipmentForMaintenance(null);
  };

  const calculateNextMaintenanceDate = (lastDate: string, category: string) => {
    const last = new Date(lastDate);
    let daysToAdd = 90; // Default 3 months
    
    switch (category) {
      case 'Heavy Machinery':
        daysToAdd = 60; // 2 months
        break;
      case 'Power Tools':
        daysToAdd = 30; // 1 month
        break;
      case 'Hand Tools':
        daysToAdd = 180; // 6 months
        break;
      case 'Safety Equipment':
        daysToAdd = 365; // 1 year
        break;
    }
    
    return new Date(last.getTime() + daysToAdd * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];
  };

  const getMaintenanceStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredMaintenanceRecords = maintenanceRecords.filter(record => {
    if (maintenanceFilter === 'all') return true;
    return record.status === maintenanceFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Equipment & Tools Management</h2>
          <p className="text-gray-600">Track and manage all farm equipment and tools</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowMaintenanceRecords(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-tools-line mr-2"></i>Maintenance Records
          </button>
          <button
            onClick={() => setShowSprayRecords(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-drop-line mr-2"></i>Spray Records
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-add-line mr-2"></i>Add Equipment
          </button>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <i className="ri-tools-line text-blue-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Equipment</p>
              <p className="text-2xl font-bold text-gray-900">{equipment.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <i className="ri-check-line text-green-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500">Available</p>
              <p className="text-2xl font-bold text-gray-900">
                {equipment.filter(item => item.status === 'available').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
              <i className="ri-tools-line text-yellow-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500">In Maintenance</p>
              <p className="text-2xl font-bold text-gray-900">
                {equipment.filter(item => item.status === 'maintenance').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
              <i className="ri-alarm-warning-line text-red-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500">Needs Attention</p>
              <p className="text-2xl font-bold text-gray-900">
                {equipment.filter(item => 
                  item.status === 'damaged' || isMaintenanceDue(item.nextMaintenance)
                ).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Buttons */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter by Category</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-700'
            }`}
          >
            <i className="ri-grid-line mr-2"></i>All Equipment ({equipment.length})
          </button>
          {categories.map(category => {
            const count = equipment.filter(item => item.category === category).length;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-700'
                }`}
              >
                <i className={`${getCategoryIcon(category)} mr-2`}></i>
                {category} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Additional Filters */}
      <div className="grid md:grid-cols-4 gap-4 bg-white p-6 rounded-lg shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Search Equipment</label>
          <div className="relative">
            <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="Search by name, manufacturer, model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8"
          >
            <option value="all">All Statuses</option>
            {statuses.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Condition Filter</label>
          <select
            value={conditionFilter}
            onChange={(e) => setConditionFilter(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8"
          >
            <option value="all">All Conditions</option>
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="poor">Poor</option>
          </select>
        </div>

        <div className="flex items-end">
          <div className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg w-full">
            <div className="font-medium">Showing: {filteredEquipment.length} of {equipment.length}</div>
            <div className="text-xs text-gray-500">Total value: ${equipment.reduce((sum, item) => sum + (item.purchasePrice || 0), 0).toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Equipment Grid/List */}
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredEquipment.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <i className={`${getCategoryIcon(item.category)} text-green-600 text-xl`}></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.manufacturer} {item.model}</p>
                    <p className="text-xs text-gray-400">Serial: {item.serialNumber}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  {getStatusBadge(item.status)}
                  {isMaintenanceDue(item.nextMaintenance) && (
                    <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                      <i className="ri-alarm-warning-line mr-1"></i>Due
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Category:</span>
                    <div className="font-medium text-gray-900">{item.category}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Location:</span>
                    <div className="font-medium text-gray-900">{item.location}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Assigned To:</span>
                    <div className="font-medium text-gray-900">{item.assignedTo}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Condition:</span>
                    <div className={`font-medium ${getConditionColor(item.condition)}`}>
                      {item.condition.charAt(0).toUpperCase() + item.condition.slice(1)}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Operating Hours:</span>
                    <div className="font-medium text-gray-900">{item.operatingHours || 0}h</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Purchase Price:</span>
                    <div className="font-medium text-gray-900">${(item.purchasePrice || 0).toLocaleString()}</div>
                  </div>
                </div>
                
                <div className="text-sm">
                  <span className="text-gray-500">Next Maintenance:</span>
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-gray-900">
                      {new Date(item.nextMaintenance).toLocaleDateString()}
                    </div>
                    {isMaintenanceDue(item.nextMaintenance) && (
                      <div className="text-xs text-red-600 font-medium">
                        <i className="ri-alarm-warning-line mr-1"></i>
                        {Math.abs(Math.ceil((new Date(item.nextMaintenance).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} days overdue
                      </div>
                    )}
                  </div>
                </div>

                {item.warrantyExpiry && (
                  <div className="text-sm">
                    <span className="text-gray-500">Warranty:</span>
                    <div className="font-medium text-gray-900">
                      Until {new Date(item.warrantyExpiry).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <button
                  onClick={() => setShowEquipmentDetails(item)}
                  className="px-3 py-2 text-sm font-medium rounded-lg cursor-pointer bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors whitespace-nowrap"
                >
                  <i className="ri-eye-line mr-1"></i>Details
                </button>
                <button
                  onClick={() => handleMaintenanceAction(item)}
                  className="px-3 py-2 text-sm font-medium rounded-lg cursor-pointer bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors whitespace-nowrap"
                >
                  <i className="ri-tools-line mr-1"></i>Maintenance
                </button>
                {item.category === 'Spray Equipment' && (
                  <button
                    onClick={() => handleSprayAction(item)}
                    className="px-3 py-2 text-sm font-medium rounded-lg cursor-pointer bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors whitespace-nowrap"
                  >
                    <i className="ri-drop-line mr-1"></i>Spray
                  </button>
                )}
                <button
                  onClick={() => setEditingEquipment(item)}
                  className="px-3 py-2 text-sm font-medium rounded-lg cursor-pointer bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors whitespace-nowrap"
                >
                  <i className="ri-edit-line mr-1"></i>Edit
                </button>
                <button
                  onClick={() => handleDeleteEquipment(item.id)}
                  className="px-3 py-2 text-sm font-medium rounded-lg cursor-pointer bg-red-100 text-red-700 hover:bg-red-200 transition-colors whitespace-nowrap"
                >
                  <i className="ri-delete-bin-line mr-1"></i>Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No equipment found message */}
      {filteredEquipment.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <i className="ri-tools-line text-4xl text-gray-400"></i>
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No equipment found</h3>
          <p className="text-gray-500 mb-4">
            {selectedCategory !== 'all' 
              ? `No equipment found in "${selectedCategory}" category`
              : 'Try adjusting your search or filters'
            }
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedStatus('all');
              setSearchTerm('');
              setConditionFilter('all');
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Equipment Details Modal */}
      {showEquipmentDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-0 w-full max-w-4xl max-h-[95vh] overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold">{showEquipmentDetails.name}</h3>
                  <p className="text-green-100 mt-1">
                    {showEquipmentDetails.manufacturer} {showEquipmentDetails.model}
                  </p>
                </div>
                <button 
                  onClick={() => setShowEquipmentDetails(null)}
                  className="text-white hover:text-gray-200 cursor-pointer"
                >
                  <i className="ri-close-line w-8 h-8 flex items-center justify-center"></i>
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(95vh-100px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Serial Number:</span>
                        <span className="font-medium">{showEquipmentDetails.serialNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium">{showEquipmentDetails.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        {getStatusBadge(showEquipmentDetails.status)}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Condition:</span>
                        <span className={`font-medium ${getConditionColor(showEquipmentDetails.condition)}`}>
                          {showEquipmentDetails.condition.charAt(0).toUpperCase() + showEquipmentDetails.condition.slice(1)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium">{showEquipmentDetails.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Assigned To:</span>
                        <span className="font-medium">{showEquipmentDetails.assignedTo}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Financial Information</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Purchase Date:</span>
                        <span className="font-medium">
                          {new Date(showEquipmentDetails.purchaseDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Purchase Price:</span>
                        <span className="font-medium">${(showEquipmentDetails.purchasePrice || 0).toLocaleString()}</span>
                      </div>
                      {showEquipmentDetails.warrantyExpiry && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Warranty Expiry:</span>
                          <span className="font-medium">
                            {new Date(showEquipmentDetails.warrantyExpiry).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Maintenance & Operations */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Maintenance Schedule</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Maintenance:</span>
                        <span className="font-medium">
                          {new Date(showEquipmentDetails.lastMaintenance).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Next Maintenance:</span>
                        <div className="text-right">
                          <div className="font-medium">
                            {new Date(showEquipmentDetails.nextMaintenance).toLocaleDateString()}
                          </div>
                          {isMaintenanceDue(showEquipmentDetails.nextMaintenance) && (
                            <div className="text-xs text-red-600 font-medium">
                              Overdue
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Operating Hours:</span>
                        <span className="font-medium">{showEquipmentDetails.operatingHours || 0}h</span>
                      </div>
                      {showEquipmentDetails.fuelType && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Fuel Type:</span>
                          <span className="font-medium">{showEquipmentDetails.fuelType}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Maintenance</h4>
                    <div className="space-y-2">
                      {maintenanceRecords
                        .filter(record => record.equipmentId === showEquipmentDetails.id)
                        .slice(0, 3)
                        .map(record => (
                          <div key={record.id} className="flex justify-between items-center p-1 bg-white rounded border">
                            <div>
                              <div className="text-sm font-medium">{record.type}</div>
                              <div className="text-xs text-gray-500">{record.date}</div>
                            </div>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getMaintenanceStatusColor(record.status)}`}>
                              {record.status}
                            </span>
                          </div>
                        ))}
                      {maintenanceRecords.filter(record => record.equipmentId === showEquipmentDetails.id).length === 0 && (
                        <p className="text-sm text-gray-500">No maintenance records found</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Specifications & Notes */}
              <div className="mt-6 space-y-4">
                {showEquipmentDetails.specifications && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Specifications</h4>
                    <p className="text-gray-700">{showEquipmentDetails.specifications}</p>
                  </div>
                )}
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Notes</h4>
                  <p className="text-gray-700">{showEquipmentDetails.notes || 'No notes available'}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setShowEquipmentDetails(null);
                    setEditingEquipment(showEquipmentDetails);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-edit-line mr-2"></i>Edit Equipment
                </button>
                <button
                  onClick={() => {
                    setShowEquipmentDetails(null);
                    handleMaintenanceAction(showEquipmentDetails);
                  }}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-tools-line mr-2"></i>Schedule Maintenance
                </button>
                {showEquipmentDetails.category === 'Spray Equipment' && (
                  <button
                    onClick={() => {
                      setShowEquipmentDetails(null);
                      handleSprayAction(showEquipmentDetails);
                    }}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-drop-line mr-2"></i>Record Spray
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Maintenance Records Modal */}
      {showMaintenanceRecords && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[95vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Maintenance Records</h3>
              <button 
                onClick={() => setShowMaintenanceRecords(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line w-6 h-6 flex items-center justify-center"></i>
              </button>
            </div>

            {/* Filter Buttons */}
            <div className="mb-6 flex flex-wrap gap-2">
              {['all', 'completed', 'in-progress', 'scheduled'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setMaintenanceFilter(filter)}
                  className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-colors ${
                    maintenanceFilter === filter
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-blue-50'
                  }`}
                >
                  {filter === 'all' ? 'All Records' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                  {filter !== 'all' && ` (${maintenanceRecords.filter(r => r.status === filter).length})`}
                </button>
              ))}
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipment</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performed By</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMaintenanceRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{record.equipmentName}</div>
                        <div className="text-sm text-gray-500">Hours: {record.hoursAtMaintenance}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          record.type === 'routine' ? 'bg-green-100 text-green-800' :
                          record.type === 'repair' ? 'bg-red-100 text-red-800' :
                          record.type === 'inspection' ? 'bg-blue-100 text-blue-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {record.type}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{record.date}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{record.performedBy}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${record.cost.toFixed(2)}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getMaintenanceStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="max-w-48 truncate">{record.description}</div>
                        {record.partsReplaced.length > 0 && (
                          <div className="text-xs text-blue-600">{record.partsReplaced.length} parts replaced</div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredMaintenanceRecords.length === 0 && (
              <div className="text-center py-8">
                <i className="ri-tools-line text-4xl text-gray-300 mb-4"></i>
                <p className="text-gray-500">No maintenance records found for the selected filter</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Maintenance Modal */}
      {showMaintenanceModal && selectedEquipmentForMaintenance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[95vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Schedule Maintenance</h3>
              <button 
                onClick={() => {
                  setShowMaintenanceModal(false);
                  setSelectedEquipmentForMaintenance(null);
                }}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line w-6 h-6 flex items-center justify-center"></i>
              </button>
            </div>
            
            <MaintenanceForm
              equipment={selectedEquipmentForMaintenance}
              onSubmit={handleAddMaintenanceRecord}
              onCancel={() => {
                setShowMaintenanceModal(false);
                setSelectedEquipmentForMaintenance(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Spray Modal */}
      {showSprayModal && selectedSprayEquipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-90vh overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Record Spray Operation</h3>
              <button 
                onClick={() => {
                  setShowSprayModal(false);
                  setSelectedSprayEquipment(null);
                }}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line w-6 h-6 flex items-center justify-center"></i>
              </button>
            </div>
            
            <SprayForm
              equipment={selectedSprayEquipment}
              onSubmit={handleAddSprayRecord}
              onCancel={() => {
                setShowSprayModal(false);
                setSelectedSprayEquipment(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Spray Records Modal */}
      {showSprayRecords && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-90vh overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Spray Application Records</h3>
              <button 
                onClick={() => setShowSprayRecords(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line w-6 h-6 flex items-center justify-center"></i>
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipment</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Field</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chemical</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Area</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Operator</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sprayRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{record.date}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{record.equipmentName}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{record.field}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {record.sprayType}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{record.chemical}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{record.area} ha</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{record.operator}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Equipment Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-90vh overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Add New Equipment</h3>
            <EquipmentForm
              onSubmit={handleAddEquipment}
              onCancel={() => setShowAddForm(false)}
              categories={categories}
            />
          </div>
        </div>
      )}

      {/* Edit Equipment Modal */}
      {editingEquipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-90vh overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Edit Equipment</h3>
            <EquipmentForm
              equipment={editingEquipment}
              onSubmit={(equipment) => {
                if ('id' in equipment) {
                  handleUpdateEquipment(equipment as Equipment);
                }
              }}
              onCancel={() => setEditingEquipment(null)}
              categories={categories}
            />
          </div>
        </div>
      )}
    </div>
  );

  // Helper function to get category icons
  function getCategoryIcon(category: string): string {
    switch (category) {
      case 'Heavy Machinery': return 'ri-truck-line';
      case 'Irrigation': return 'ri-drop-line';
      case 'Tillage Equipment': return 'ri-shovel-line';
      case 'Planting Equipment': return 'ri-seedling-line';
      case 'Spray Equipment': return 'ri-medicine-bottle-line';
      case 'Harvesting Equipment': return 'ri-scissors-line';
      case 'Hand Tools': return 'ri-hammer-line';
      case 'Measurement Tools': return 'ri-ruler-line';
      case 'Power Tools': return 'ri-tools-line';
      case 'Safety Equipment': return 'ri-shield-line';
      case 'Maintenance Tools': return 'ri-settings-line';
      case 'Processing Equipment': return 'ri-settings-2-line';
      case 'Storage Equipment': return 'ri-archive-line';
      case 'Transport Equipment': return 'ri-truck-line';
      default: return 'ri-tools-line';
    }
  }
}

interface SprayFormProps {
  equipment: Equipment;
  onSubmit: (sprayData: Omit<SprayRecord, 'id'>) => void;
  onCancel: () => void;
}

function SprayForm({ equipment, onSubmit, onCancel }: SprayFormProps) {
  const [formData, setFormData] = useState({
    equipmentId: equipment.id,
    equipmentName: equipment.name,
    field: '',
    sprayType: 'Pesticide',
    chemical: '',
    mixture: '',
    area: '',
    date: new Date().toISOString().split('T')[0],
    operator: '',
    startTime: '',
    endTime: '',
    weatherConditions: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      area: parseFloat(formData.area) || 0
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-medium text-green-900">Equipment: {equipment.name}</h4>
        <p className="text-sm text-green-700">{equipment.manufacturer} {equipment.model}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Field/Location *</label>
          <input
            type="text"
            required
            value={formData.field}
            onChange={(e) => setFormData({ ...formData, field: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Field A - North Section"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Spray Type *</label>
          <select
            value={formData.sprayType}
            onChange={(e) => setFormData({ ...formData, sprayType: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
          >
            <option value="Pesticide">Pesticide</option>
            <option value="Fungicide">Fungicide</option>
            <option value="Herbicide">Herbicide</option>
            <option value="Fertilizer">Fertilizer</option>
            <option value="Growth Regulator">Growth Regulator</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Chemical/Product *</label>
          <input
            type="text"
            required
            value={formData.chemical}
            onChange={(e) => setFormData({ ...formData, chemical: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Malathion, Copper Sulfate"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mixture Rate *</label>
          <input
            type="text"
            required
            value={formData.mixture}
            onChange={(e) => setFormData({ ...formData, mixture: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 2.5L per 1000L water"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Area (hectares) *</label>
          <input
            type="number"
            step="0.1"
            required
            value={formData.area}
            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0.0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
          <input
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Operator *</label>
          <input
            type="text"
            required
            value={formData.operator}
            onChange={(e) => setFormData({ ...formData, operator: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Operator name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
          <input
            type="time"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
          <input
            type="time"
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Weather Conditions</label>
        <input
          type="text"
          value={formData.weatherConditions}
          onChange={(e) => setFormData({ ...formData, weatherConditions: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., Clear, 22°C, Wind: 5km/h NE"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Additional notes about the spray operation..."
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
        >
          Record Spray Operation
        </button>
      </div>
    </form>
  );
}

interface EquipmentFormProps {
  equipment?: Equipment;
  onSubmit: (equipment: Equipment | Omit<Equipment, 'id'>) => void;
  onCancel: () => void;
  categories: string[];
}

function EquipmentForm({ equipment, onSubmit, onCancel, categories }: EquipmentFormProps) {
  const [formData, setFormData] = useState<Omit<Equipment, 'id'>>({
    name: equipment?.name || '',
    category: equipment?.category || categories[0],
    status: equipment?.status || 'available',
    location: equipment?.location || '',
    lastMaintenance: equipment?.lastMaintenance || new Date().toISOString().split('T')[0],
    nextMaintenance: equipment?.nextMaintenance || '',
    assignedTo: equipment?.assignedTo || '',
    purchaseDate: equipment?.purchaseDate || '',
    condition: equipment?.condition || 'excellent',
    serialNumber: equipment?.serialNumber || '',
    manufacturer: equipment?.manufacturer || '',
    model: equipment?.model || '',
    notes: equipment?.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (equipment) {
      onSubmit({ ...formData, id: equipment.id });
    } else {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Equipment Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
          <input
            type="text"
            value={formData.manufacturer}
            onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
          <input
            type="text"
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
          <input
            type="text"
            value={formData.serialNumber}
            onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as Equipment['status'] })}
            className="w-full p-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8"
          >
            <option value="available">Available</option>
            <option value="in-use">In Use</option>
            <option value="maintenance">Maintenance</option>
            <option value="damaged">Damaged</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
          <select
            value={formData.condition}
            onChange={(e) => setFormData({ ...formData, condition: e.target.value as Equipment['condition'] })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8"
          >
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="poor">Poor</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
          <input
            type="text"
            value={formData.assignedTo}
            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
          <input
            type="date"
            value={formData.purchaseDate}
            onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Maintenance</label>
          <input
            type="date"
            value={formData.lastMaintenance}
            onChange={(e) => setFormData({ ...formData, lastMaintenance: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Next Maintenance</label>
          <input
            type="date"
            value={formData.nextMaintenance}
            onChange={(e) => setFormData({ ...formData, nextMaintenance: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
        >
          {equipment ? 'Update Equipment' : 'Add Equipment'}
        </button>
      </div>
    </form>
  );
}

interface MaintenanceFormProps {
  equipment: Equipment;
  onSubmit: (maintenanceData: Omit<MaintenanceRecord, 'id'>) => void;
  onCancel: () => void;
}

function MaintenanceForm({ equipment, onSubmit, onCancel }: MaintenanceFormProps) {
  const [formData, setFormData] = useState({
    equipmentId: equipment.id,
    equipmentName: equipment.name,
    type: 'routine' as 'routine' | 'repair' | 'inspection' | 'upgrade',
    description: '',
    cost: '',
    performedBy: '',
    date: new Date().toISOString().split('T')[0],
    hoursAtMaintenance: equipment.operatingHours || 0,
    nextDueHours: '',
    partsReplaced: '',
    notes: '',
    status: 'scheduled' as 'completed' | 'in-progress' | 'scheduled'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      cost: parseFloat(formData.cost) || 0,
      partsReplaced: formData.partsReplaced.split(',').map(part => part.trim()).filter(part => part),
      nextDueHours: formData.nextDueHours ? parseInt(formData.nextDueHours) : undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-medium text-green-900">Equipment: {equipment.name}</h4>
        <p className="text-sm text-green-700">{equipment.manufacturer} {equipment.model}</p>
        <p className="text-sm text-green-700">Current Hours: {equipment.operatingHours || 0}h</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Type *</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-8"
          >
            <option value="routine">Routine Maintenance</option>
            <option value="repair">Repair</option>
            <option value="inspection">Inspection</option>
            <option value="upgrade">Upgrade</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-8"
          >
            <option value="scheduled">Scheduled</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
          <input
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Performed By *</label>
          <input
            type="text"
            required
            value={formData.performedBy}
            onChange={(e) => setFormData({ ...formData, performedBy: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Technician name or company"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cost ($)</label>
          <input
            type="number"
            step="0.01"
            value={formData.cost}
            onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hours at Maintenance</label>
          <input
            type="number"
            value={formData.hoursAtMaintenance}
            onChange={(e) => setFormData({ ...formData, hoursAtMaintenance: parseInt(e.target.value) || 0 })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
        <textarea
          rows={3}
          required
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="Detailed description of maintenance work performed or scheduled..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Parts Replaced</label>
        <input
          type="text"
          value={formData.partsReplaced}
          onChange={(e) => setFormData({ ...formData, partsReplaced: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="Enter parts separated by commas (e.g., Oil Filter, Air Filter, Spark Plug)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Next Due Hours</label>
        <input
          type="number"
          value={formData.nextDueHours}
          onChange={(e) => setFormData({ ...formData, nextDueHours: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="Operating hours when next maintenance is due"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
        <textarea
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="Any additional observations, recommendations, or notes..."
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors cursor-pointer whitespace-nowrap"
        >
          {formData.status === 'completed' ? 'Record Maintenance' : 'Schedule Maintenance'}
        </button>
      </div>
    </form>
  );
}