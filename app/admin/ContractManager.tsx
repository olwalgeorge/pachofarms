'use client';
import { useState } from 'react';

interface Contract {
  id: number;
  title: string;
  contractNumber: string;
  type: 'supplier' | 'customer' | 'employee' | 'service' | 'lease' | 'partnership';
  partyName: string;
  partyContact: string;
  status: 'draft' | 'pending' | 'active' | 'expired' | 'terminated' | 'renewed';
  startDate: string;
  endDate: string;
  value: number;
  currency: string;
  renewalType: 'auto' | 'manual' | 'none';
  paymentTerms: string;
  description: string;
  tags: string[];
  documentUrl?: string;
  createdDate: string;
  createdBy: string;
  lastModified: string;
  reminderDays: number;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvalDate?: string;
  legalReviewRequired: boolean;
  legalReviewStatus?: 'pending' | 'approved' | 'rejected';
  attachments: string[];
  milestones: Milestone[];
  terms: ContractTerm[];
  riskLevel: 'low' | 'medium' | 'high';
  complianceStatus: 'compliant' | 'non-compliant' | 'pending-review';
}

interface Milestone {
  id: number;
  title: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'overdue';
  description: string;
  assignedTo: string;
}

interface ContractTerm {
  id: number;
  category: string;
  description: string;
  importance: 'critical' | 'important' | 'standard';
}

interface Reminder {
  id: number;
  contractId: number;
  contractTitle: string;
  type: 'expiry' | 'renewal' | 'milestone' | 'payment' | 'review';
  dueDate: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'acknowledged' | 'completed';
  assignedTo: string;
}

export default function ContractManager() {
  const [activeTab, setActiveTab] = useState('contracts');
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [showAddContract, setShowAddContract] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [contractFilter, setContractFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showReminderModal, setShowReminderModal] = useState(false);

  const [contracts, setContracts] = useState<Contract[]>([
    {
      id: 1,
      title: 'Premium Seeds Supply Agreement',
      contractNumber: 'PSA-2024-001',
      type: 'supplier',
      partyName: 'Premium Seeds Co.',
      partyContact: 'sales@premiumseeds.com',
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      value: 25000.00,
      currency: 'USD',
      renewalType: 'manual',
      paymentTerms: 'Net 30',
      description: 'Annual supply agreement for premium chili pepper seeds and seedlings',
      tags: ['seeds', 'supplier', 'annual'],
      createdDate: '2023-12-15',
      createdBy: 'Farm Manager',
      lastModified: '2024-01-18',
      reminderDays: 60,
      approvalStatus: 'approved',
      approvedBy: 'Joseph Pacho',
      approvalDate: '2023-12-20',
      legalReviewRequired: true,
      legalReviewStatus: 'approved',
      attachments: ['contract_psa_2024_001.pdf', 'quality_standards.pdf'],
      milestones: [
        {
          id: 1,
          title: 'First Quarter Delivery',
          dueDate: '2024-03-31',
          status: 'pending',
          description: 'Delivery of Q1 seed order',
          assignedTo: 'Supply Chain Manager'
        },
        {
          id: 2,
          title: 'Mid-Year Quality Review',
          dueDate: '2024-06-30',
          status: 'pending',
          description: 'Review seed quality and performance metrics',
          assignedTo: 'Quality Control'
        }
      ],
      terms: [
        {
          id: 1,
          category: 'Quality Standards',
          description: 'All seeds must meet 95% germination rate minimum',
          importance: 'critical'
        },
        {
          id: 2,
          category: 'Delivery Terms',
          description: 'Free delivery for orders above $1000',
          importance: 'important'
        }
      ],
      riskLevel: 'low',
      complianceStatus: 'compliant'
    },
    {
      id: 2,
      title: 'Restaurant Distribution Agreement',
      contractNumber: 'RDA-2024-002',
      type: 'customer',
      partyName: 'Johnson Restaurant Group',
      partyContact: 'sarah.johnson@email.com',
      status: 'active',
      startDate: '2024-01-15',
      endDate: '2025-01-14',
      value: 45000.00,
      currency: 'USD',
      renewalType: 'auto',
      paymentTerms: 'Net 15',
      description: 'Exclusive distribution agreement for premium chili peppers to restaurant chain',
      tags: ['customer', 'exclusive', 'restaurants'],
      createdDate: '2024-01-10',
      createdBy: 'Sales Manager',
      lastModified: '2024-01-20',
      reminderDays: 90,
      approvalStatus: 'approved',
      approvedBy: 'Sarah Pacho',
      approvalDate: '2024-01-12',
      legalReviewRequired: true,
      legalReviewStatus: 'approved',
      attachments: ['rda_2024_002.pdf', 'product_specifications.pdf'],
      milestones: [
        {
          id: 3,
          title: 'Monthly Quality Audit',
          dueDate: '2024-02-15',
          status: 'pending',
          description: 'Monthly quality and service audit',
          assignedTo: 'Quality Assurance'
        }
      ],
      terms: [
        {
          id: 3,
          category: 'Exclusivity',
          description: 'Exclusive supplier for premium chilies in their region',
          importance: 'critical'
        },
        {
          id: 4,
          category: 'Volume Commitment',
          description: 'Minimum monthly order of $3,000',
          importance: 'critical'
        }
      ],
      riskLevel: 'medium',
      complianceStatus: 'compliant'
    },
    {
      id: 3,
      title: 'Equipment Lease Agreement',
      contractNumber: 'ELA-2024-003',
      type: 'lease',
      partyName: 'AgriTech Equipment Leasing',
      partyContact: 'leasing@agritech.com',
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2026-12-31',
      value: 36000.00,
      currency: 'USD',
      renewalType: 'manual',
      paymentTerms: 'Monthly',
      description: '3-year lease agreement for John Deere tractor and cultivation equipment',
      tags: ['equipment', 'lease', 'machinery'],
      createdDate: '2023-12-01',
      createdBy: 'Operations Manager',
      lastModified: '2024-01-05',
      reminderDays: 120,
      approvalStatus: 'approved',
      approvedBy: 'Joseph Pacho',
      approvalDate: '2023-12-10',
      legalReviewRequired: true,
      legalReviewStatus: 'approved',
      attachments: ['equipment_lease_2024.pdf', 'maintenance_schedule.pdf'],
      milestones: [
        {
          id: 4,
          title: 'Annual Maintenance Review',
          dueDate: '2024-12-31',
          status: 'pending',
          description: 'Annual equipment inspection and maintenance review',
          assignedTo: 'Maintenance Team'
        }
      ],
      terms: [
        {
          id: 5,
          category: 'Maintenance',
          description: 'Lessor responsible for major repairs and maintenance',
          importance: 'important'
        },
        {
          id: 6,
          category: 'Insurance',
          description: 'Lessee must maintain comprehensive equipment insurance',
          importance: 'critical'
        }
      ],
      riskLevel: 'low',
      complianceStatus: 'compliant'
    },
    {
      id: 4,
      title: 'Organic Certification Service',
      contractNumber: 'OCS-2024-004',
      type: 'service',
      partyName: 'Organic Standards Certification',
      partyContact: 'info@organicstandards.org',
      status: 'pending',
      startDate: '2024-02-01',
      endDate: '2025-01-31',
      value: 8500.00,
      currency: 'USD',
      renewalType: 'manual',
      paymentTerms: 'Net 30',
      description: 'Annual organic certification and inspection services',
      tags: ['certification', 'organic', 'compliance'],
      createdDate: '2024-01-20',
      createdBy: 'Compliance Officer',
      lastModified: '2024-01-22',
      reminderDays: 45,
      approvalStatus: 'pending',
      legalReviewRequired: true,
      legalReviewStatus: 'pending',
      attachments: ['organic_cert_proposal.pdf'],
      milestones: [
        {
          id: 5,
          title: 'Initial Farm Inspection',
          dueDate: '2024-02-15',
          status: 'pending',
          description: 'Initial organic certification inspection',
          assignedTo: 'Farm Operations'
        }
      ],
      terms: [
        {
          id: 7,
          category: 'Inspection Schedule',
          description: 'Quarterly inspections with advance notice',
          importance: 'important'
        },
        {
          id: 8,
          category: 'Compliance Standards',
          description: 'Must maintain USDA organic standards throughout contract',
          importance: 'critical'
        }
      ],
      riskLevel: 'medium',
      complianceStatus: 'pending-review'
    },
    {
      id: 5,
      title: 'Farm Labor Contract - Seasonal',
      contractNumber: 'FLC-2024-005',
      type: 'employee',
      partyName: 'Seasonal Workers Collective',
      partyContact: 'coordinator@seasonalworkers.org',
      status: 'expired',
      startDate: '2023-06-01',
      endDate: '2023-11-30',
      value: 55000.00,
      currency: 'USD',
      renewalType: 'manual',
      paymentTerms: 'Bi-weekly',
      description: 'Seasonal farm labor contract for peak growing and harvest seasons',
      tags: ['labor', 'seasonal', 'harvest'],
      createdDate: '2023-05-15',
      createdBy: 'HR Manager',
      lastModified: '2023-12-01',
      reminderDays: 30,
      approvalStatus: 'approved',
      approvedBy: 'Joseph Pacho',
      approvalDate: '2023-05-20',
      legalReviewRequired: true,
      legalReviewStatus: 'approved',
      attachments: ['seasonal_labor_2023.pdf', 'safety_guidelines.pdf'],
      milestones: [
        {
          id: 6,
          title: 'Contract Renewal Review',
          dueDate: '2024-04-01',
          status: 'overdue',
          description: 'Review and renew seasonal labor contract for 2024',
          assignedTo: 'HR Manager'
        }
      ],
      terms: [
        {
          id: 9,
          category: 'Safety Standards',
          description: 'All workers must complete safety training before starting work',
          importance: 'critical'
        },
        {
          id: 10,
          category: 'Working Hours',
          description: 'Maximum 50 hours per week during peak season',
          importance: 'important'
        }
      ],
      riskLevel: 'high',
      complianceStatus: 'non-compliant'
    }
  ]);

  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: 1,
      contractId: 1,
      contractTitle: 'Premium Seeds Supply Agreement',
      type: 'renewal',
      dueDate: '2024-11-01',
      message: 'Contract renewal decision needed - 60 days before expiry',
      priority: 'medium',
      status: 'pending',
      assignedTo: 'Farm Manager'
    },
    {
      id: 2,
      contractId: 5,
      contractTitle: 'Farm Labor Contract - Seasonal',
      type: 'renewal',
      dueDate: '2024-04-01',
      message: 'Seasonal labor contract expired - renewal needed for 2024 season',
      priority: 'urgent',
      status: 'pending',
      assignedTo: 'HR Manager'
    },
    {
      id: 3,
      contractId: 4,
      contractTitle: 'Organic Certification Service',
      type: 'review',
      dueDate: '2024-01-30',
      message: 'Legal review pending for organic certification contract',
      priority: 'high',
      status: 'pending',
      assignedTo: 'Legal Team'
    },
    {
      id: 4,
      contractId: 2,
      contractTitle: 'Restaurant Distribution Agreement',
      type: 'milestone',
      dueDate: '2024-02-15',
      message: 'Monthly quality audit due for restaurant distribution contract',
      priority: 'medium',
      status: 'pending',
      assignedTo: 'Quality Assurance'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'terminated': return 'bg-red-100 text-red-800';
      case 'renewed': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'compliant': return 'bg-green-100 text-green-800';
      case 'non-compliant': return 'bg-red-100 text-red-800';
      case 'pending-review': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'acknowledged': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'supplier': return 'ri-truck-line';
      case 'customer': return 'ri-user-line';
      case 'employee': return 'ri-team-line';
      case 'service': return 'ri-service-line';
      case 'lease': return 'ri-key-line';
      case 'partnership': return 'ri-handshake-line';
      default: return 'ri-file-text-line';
    }
  };

  const getRiskLevelColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
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

  const getReminderTypeIcon = (type: string) => {
    switch (type) {
      case 'expiry': return 'ri-time-line';
      case 'renewal': return 'ri-refresh-line';
      case 'milestone': return 'ri-flag-line';
      case 'payment': return 'ri-money-dollar-circle-line';
      case 'review': return 'ri-eye-line';
      default: return 'ri-notification-line';
    }
  };

  const filteredContracts = contracts.filter(contract => {
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter;
    const matchesType = typeFilter === 'all' || contract.type === typeFilter;
    const matchesSearch = contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.partyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.contractNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  const isContractExpiringSoon = (endDate: string, reminderDays: number) => {
    const today = new Date();
    const expiry = new Date(endDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= reminderDays && daysUntilExpiry >= 0;
  };

  const getDaysUntilExpiry = (endDate: string) => {
    const today = new Date();
    const expiry = new Date(endDate);
    return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const handleAddContract = (contractData: Omit<Contract, 'id'>) => {
    const newContract: Contract = {
      ...contractData,
      id: Math.max(...contracts.map(c => c.id)) + 1
    };
    setContracts(prev => [...prev, newContract]);
    setShowAddContract(false);
  };

  const handleUpdateContract = (updatedContract: Contract) => {
    setContracts(prev => prev.map(contract => 
      contract.id === updatedContract.id ? updatedContract : contract
    ));
    setEditingContract(null);
  };

  const getContractsByStatus = (status: string) => {
    return contracts.filter(contract => contract.status === status).length;
  };

  const getTotalContractValue = () => {
    return contracts
      .filter(contract => contract.status === 'active')
      .reduce((sum, contract) => sum + contract.value, 0);
  };

  const getExpiringContractsCount = () => {
    return contracts.filter(contract => 
      contract.status === 'active' && isContractExpiringSoon(contract.endDate, contract.reminderDays)
    ).length;
  };

  const getPendingReminders = () => {
    return reminders.filter(reminder => reminder.status === 'pending').length;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Contract Management</h2>
          <p className="text-gray-600">Manage all business contracts and agreements</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowReminderModal(true)}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-notification-line mr-2"></i>Reminders ({getPendingReminders()})
          </button>
          <button
            onClick={() => setShowAddContract(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-add-line mr-2"></i>New Contract
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <i className="ri-file-text-line text-blue-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Contracts</p>
              <p className="text-2xl font-bold text-gray-900">{contracts.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <i className="ri-check-line text-green-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Contracts</p>
              <p className="text-2xl font-bold text-gray-900">{getContractsByStatus('active')}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
              <i className="ri-time-line text-orange-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500">Expiring Soon</p>
              <p className="text-2xl font-bold text-gray-900">{getExpiringContractsCount()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
              <i className="ri-money-dollar-circle-line text-purple-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">${getTotalContractValue().toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
              <i className="ri-alarm-warning-line text-red-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Actions</p>
              <p className="text-2xl font-bold text-gray-900">{getPendingReminders()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'contracts', name: 'All Contracts', icon: 'ri-file-list-line' },
            { id: 'dashboard', name: 'Dashboard', icon: 'ri-dashboard-line' },
            { id: 'renewals', name: 'Renewals', icon: 'ri-refresh-line' },
            { id: 'compliance', name: 'Compliance', icon: 'ri-shield-check-line' },
            { id: 'analytics', name: 'Analytics', icon: 'ri-bar-chart-line' }
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

      {/* All Contracts Tab */}
      {activeTab === 'contracts' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Contracts</label>
                <div className="relative">
                  <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                    placeholder="Search by title, party, contract number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status Filter</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="terminated">Terminated</option>
                  <option value="renewed">Renewed</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contract Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8"
                >
                  <option value="all">All Types</option>
                  <option value="supplier">Supplier</option>
                  <option value="customer">Customer</option>
                  <option value="employee">Employee</option>
                  <option value="service">Service</option>
                  <option value="lease">Lease</option>
                  <option value="partnership">Partnership</option>
                </select>
              </div>

              <div className="flex items-end">
                <div className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg w-full">
                  <div className="font-medium">Results: {filteredContracts.length} of {contracts.length}</div>
                  <div className="text-xs text-gray-500">
                    Active: {filteredContracts.filter(c => c.status === 'active').length}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contracts Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {filteredContracts.map((contract) => (
              <div key={contract.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                      <i className={`${getTypeIcon(contract.type)} text-green-600 text-xl`}></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{contract.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{contract.contractNumber}</p>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(contract.status)}`}>
                          {contract.status.replace('-', ' ')}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskLevelColor(contract.riskLevel)}`}>
                          {contract.riskLevel} risk
                        </span>
                        {isContractExpiringSoon(contract.endDate, contract.reminderDays) && contract.status === 'active' && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                            <i className="ri-alarm-warning-line mr-1"></i>Expiring Soon
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedContract(contract)}
                    className="text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <i className="ri-more-line w-5 h-5 flex items-center justify-center"></i>
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Party:</span>
                      <div className="font-medium text-gray-900">{contract.partyName}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Type:</span>
                      <div className="font-medium text-gray-900 capitalize">{contract.type}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Start Date:</span>
                      <div className="font-medium text-gray-900">{contract.startDate}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">End Date:</span>
                      <div className="font-medium text-gray-900">
                        {contract.endDate}
                        {contract.status === 'active' && (
                          <div className="text-xs text-gray-500">
                            {getDaysUntilExpiry(contract.endDate)} days left
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Contract Value:</span>
                      <div className="font-medium text-green-600">
                        {contract.currency} ${contract.value.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Payment Terms:</span>
                      <div className="font-medium text-gray-900">{contract.paymentTerms}</div>
                    </div>
                  </div>

                  <div className="text-sm">
                    <span className="text-gray-500">Renewal:</span>
                    <div className="font-medium text-gray-900 capitalize">
                      {contract.renewalType === 'auto' ? 'Automatic' : 
                       contract.renewalType === 'manual' ? 'Manual' : 'No Renewal'}
                    </div>
                  </div>

                  <div>
                    <span className="text-gray-500 text-sm">Tags:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {contract.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                      {contract.tags.length > 3 && (
                        <span className="text-xs text-gray-500">+{contract.tags.length - 3}</span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Approval:</span>
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(contract.approvalStatus)}`}>
                        {contract.approvalStatus}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Compliance:</span>
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(contract.complianceStatus)}`}>
                        {contract.complianceStatus.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => setSelectedContract(contract)}
                    className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors cursor-pointer text-sm whitespace-nowrap"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => setEditingContract(contract)}
                    className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors cursor-pointer"
                  >
                    <i className="ri-edit-line w-4 h-4 flex items-center justify-center"></i>
                  </button>
                  <button className="px-3 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors cursor-pointer">
                    <i className="ri-download-line w-4 h-4 flex items-center justify-center"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Contract Status Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contract Status Distribution</h3>
              <div className="space-y-3">
                {[
                  { status: 'active', count: getContractsByStatus('active'), color: 'bg-green-500' },
                  { status: 'pending', count: getContractsByStatus('pending'), color: 'bg-yellow-500' },
                  { status: 'expired', count: getContractsByStatus('expired'), color: 'bg-red-500' },
                  { status: 'draft', count: getContractsByStatus('draft'), color: 'bg-gray-500' }
                ].map((item) => {
                  const percentage = contracts.length > 0 ? (item.count / contracts.length) * 100 : 0;
                  return (
                    <div key={item.status}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize">{item.status}</span>
                        <span>{item.count} contracts ({percentage.toFixed(1)}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${item.color} h-2 rounded-full`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contract Types</h3>
              <div className="space-y-3">
                {[
                  { type: 'supplier', count: contracts.filter(c => c.type === 'supplier').length, color: 'bg-blue-500' },
                  { type: 'customer', count: contracts.filter(c => c.type === 'customer').length, color: 'bg-green-500' },
                  { type: 'employee', count: contracts.filter(c => c.type === 'employee').length, color: 'bg-purple-500' },
                  { type: 'service', count: contracts.filter(c => c.type === 'service').length, color: 'bg-orange-500' },
                  { type: 'lease', count: contracts.filter(c => c.type === 'lease').length, color: 'bg-pink-500' }
                ].map((item) => {
                  const percentage = contracts.length > 0 ? (item.count / contracts.length) * 100 : 0;
                  return (
                    <div key={item.type}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize">{item.type}</span>
                        <span>{item.count} contracts ({percentage.toFixed(1)}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${item.color} h-2 rounded-full`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Urgent Actions */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Urgent Actions Required</h3>
            <div className="space-y-3">
              {contracts
                .filter(contract => 
                  contract.status === 'expired' || 
                  contract.approvalStatus === 'pending' ||
                  (contract.status === 'active' && isContractExpiringSoon(contract.endDate, 30))
                )
                .slice(0, 5)
                .map((contract) => (
                  <div key={contract.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center">
                      <i className={`${getTypeIcon(contract.type)} w-5 h-5 flex items-center justify-center text-red-600 mr-3`}></i>
                      <div>
                        <div className="font-medium text-gray-900">{contract.title}</div>
                        <div className="text-sm text-gray-600">
                          {contract.status === 'expired' && 'Contract expired - renewal needed'}
                          {contract.approvalStatus === 'pending' && 'Pending approval'}
                          {contract.status === 'active' && isContractExpiringSoon(contract.endDate, 30) && 
                            `Expires in ${getDaysUntilExpiry(contract.endDate)} days`}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedContract(contract)}
                      className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-colors cursor-pointer text-sm whitespace-nowrap"
                    >
                      Take Action
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Renewals Tab */}
      {activeTab === 'renewals' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contract Renewals</h3>
            <div className="space-y-4">
              {contracts
                .filter(contract => 
                  contract.status === 'active' && 
                  isContractExpiringSoon(contract.endDate, contract.reminderDays)
                )
                .map((contract) => (
                  <div key={contract.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{contract.title}</h4>
                        <p className="text-sm text-gray-600">{contract.partyName}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          Expires: {contract.endDate}
                        </div>
                        <div className="text-sm text-orange-600">
                          {getDaysUntilExpiry(contract.endDate)} days remaining
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-gray-500">Value:</span>
                        <div className="font-medium">${contract.value.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Renewal Type:</span>
                        <div className="font-medium capitalize">{contract.renewalType}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Risk Level:</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskLevelColor(contract.riskLevel)}`}>
                          {contract.riskLevel}
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer text-sm whitespace-nowrap">
                        Start Renewal Process
                      </button>
                      <button
                        onClick={() => setSelectedContract(contract)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm whitespace-nowrap"
                      >
                        Review Contract
                      </button>
                      <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer text-sm whitespace-nowrap">
                        Set Reminder
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Compliance Tab */}
      {activeTab === 'compliance' && (
        <div className="space-y-6">
          {/* Compliance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <i className="ri-shield-check-line text-green-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Compliant</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {contracts.filter(c => c.complianceStatus === 'compliant').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                  <i className="ri-time-line text-yellow-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pending Review</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {contracts.filter(c => c.complianceStatus === 'pending-review').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <i className="ri-shield-cross-line text-red-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Non-Compliant</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {contracts.filter(c => c.complianceStatus === 'non-compliant').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Non-Compliant Contracts */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Non-Compliant Contracts</h3>
            <div className="space-y-4">
              {contracts
                .filter(contract => contract.complianceStatus === 'non-compliant')
                .map((contract) => (
                  <div key={contract.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{contract.title}</h4>
                        <p className="text-sm text-gray-600">{contract.partyName}</p>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskLevelColor(contract.riskLevel)}`}>
                        {contract.riskLevel} risk
                      </span>
                    </div>
                    
                    <div className="text-sm text-red-700 mb-3">
                      <strong>Compliance Issues:</strong>
                      <ul className="list-disc list-inside mt-1">
                        {contract.status === 'expired' && <li>Contract has expired and needs renewal</li>}
                        {contract.legalReviewRequired && contract.legalReviewStatus === 'pending' && 
                          <li>Legal review is pending</li>}
                        {contract.approvalStatus === 'pending' && <li>Contract approval is pending</li>}
                      </ul>
                    </div>

                    <div className="flex space-x-2">
                      <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors cursor-pointer text-sm whitespace-nowrap">
                        Address Issues
                      </button>
                      <button
                        onClick={() => setSelectedContract(contract)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm whitespace-nowrap"
                      >
                        Review Details
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contract Value by Type */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contract Value by Type</h3>
              <div className="space-y-3">
                {[
                  { type: 'supplier', value: contracts.filter(c => c.type === 'supplier').reduce((sum, c) => sum + c.value, 0), color: 'bg-blue-500' },
                  { type: 'customer', value: contracts.filter(c => c.type === 'customer').reduce((sum, c) => sum + c.value, 0), color: 'bg-green-500' },
                  { type: 'employee', value: contracts.filter(c => c.type === 'employee').reduce((sum, c) => sum + c.value, 0), color: 'bg-purple-500' },
                  { type: 'service', value: contracts.filter(c => c.type === 'service').reduce((sum, c) => sum + c.value, 0), color: 'bg-orange-500' },
                  { type: 'lease', value: contracts.filter(c => c.type === 'lease').reduce((sum, c) => sum + c.value, 0), color: 'bg-pink-500' }
                ].map((item) => {
                  const totalValue = contracts.reduce((sum, c) => sum + c.value, 0);
                  const percentage = totalValue > 0 ? (item.value / totalValue) * 100 : 0;
                  return (
                    <div key={item.type}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize">{item.type}</span>
                        <span>${item.value.toLocaleString()} ({percentage.toFixed(1)}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${item.color} h-2 rounded-full`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Risk Analysis */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Analysis</h3>
              <div className="space-y-3">
                {[
                  { risk: 'low', count: contracts.filter(c => c.riskLevel === 'low').length, color: 'bg-green-500' },
                  { risk: 'medium', count: contracts.filter(c => c.riskLevel === 'medium').length, color: 'bg-yellow-500' },
                  { risk: 'high', count: contracts.filter(c => c.riskLevel === 'high').length, color: 'bg-red-500' }
                ].map((item) => {
                  const percentage = contracts.length > 0 ? (item.count / contracts.length) * 100 : 0;
                  return (
                    <div key={item.risk}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize">{item.risk} Risk</span>
                        <span>{item.count} contracts ({percentage.toFixed(1)}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${item.color} h-2 rounded-full`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {Math.round((contracts.filter(c => c.status === 'active').length / contracts.length) * 100)}%
                </div>
                <div className="text-sm text-gray-500">Active Contract Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {Math.round((contracts.filter(c => c.renewalType === 'auto').length / contracts.length) * 100)}%
                </div>
                <div className="text-sm text-gray-500">Auto-Renewal Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {Math.round((contracts.filter(c => c.complianceStatus === 'compliant').length / contracts.length) * 100)}%
                </div>
                <div className="text-sm text-gray-500">Compliance Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  ${Math.round(contracts.reduce((sum, c) => sum + c.value, 0) / contracts.length).toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">Average Contract Value</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contract Detail Modal */}
      {selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-0 w-full max-w-6xl max-h-[95vh] overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold">{selectedContract.title}</h3>
                  <p className="text-green-100 mt-1">
                    {selectedContract.contractNumber} • {selectedContract.partyName}
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedContract(null)}
                  className="text-white hover:text-gray-200 cursor-pointer"
                >
                  <i className="ri-close-line w-8 h-8 flex items-center justify-center"></i>
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(95vh-100px)]">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Contract Details */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Contract Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Contract Number:</span>
                        <div className="font-medium text-gray-900">{selectedContract.contractNumber}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Type:</span>
                        <div className="font-medium text-gray-900 capitalize">{selectedContract.type}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Status:</span>
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedContract.status)}`}>
                          {selectedContract.status.replace('-', ' ')}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Risk Level:</span>
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskLevelColor(selectedContract.riskLevel)}`}>
                          {selectedContract.riskLevel}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Start Date:</span>
                        <div className="font-medium text-gray-900">{selectedContract.startDate}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">End Date:</span>
                        <div className="font-medium text-gray-900">{selectedContract.endDate}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Contract Value:</span>
                        <div className="font-medium text-green-600">{selectedContract.currency} ${selectedContract.value.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Payment Terms:</span>
                        <div className="font-medium text-gray-900">{selectedContract.paymentTerms}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Party Information</h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-gray-600">Organization:</span>
                        <div className="font-medium text-gray-900">{selectedContract.partyName}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Contact:</span>
                        <div className="font-medium text-gray-900">{selectedContract.partyContact}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Description</h4>
                    <p className="text-gray-700">{selectedContract.description}</p>
                  </div>

                  {/* Contract Terms */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Key Contract Terms</h4>
                    <div className="space-y-3">
                      {selectedContract.terms.map((term) => (
                        <div key={term.id} className="border-l-4 border-green-500 pl-4">
                          <div className="flex items-center justify-between mb-1">
                            <h5 className="font-medium text-gray-900">{term.category}</h5>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              term.importance === 'critical' ? 'bg-red-100 text-red-800' :
                              term.importance === 'important' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {term.importance}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{term.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Milestones */}
                  {selectedContract.milestones.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Contract Milestones</h4>
                      <div className="space-y-3">
                        {selectedContract.milestones.map((milestone) => (
                          <div key={milestone.id} className="bg-white p-3 rounded border">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium text-gray-900">{milestone.title}</h5>
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(milestone.status)}`}>
                                {milestone.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>
                            <div className="flex justify-between text-sm text-gray-500">
                              <span>Due: {milestone.dueDate}</span>
                              <span>Assigned to: {milestone.assignedTo}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Approval Status</h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-gray-600">Contract Approval:</span>
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedContract.approvalStatus)}`}>
                          {selectedContract.approvalStatus}
                        </span>
                      </div>
                      {selectedContract.approvedBy && (
                        <div>
                          <span className="text-gray-600">Approved By:</span>
                          <div className="font-medium text-gray-900">{selectedContract.approvedBy}</div>
                        </div>
                      )}
                      {selectedContract.legalReviewRequired && (
                        <div>
                          <span className="text-gray-600">Legal Review:</span>
                          <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedContract.legalReviewStatus || 'pending')}`}>
                            {selectedContract.legalReviewStatus || 'pending'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Compliance</h4>
                    <div className="text-center">
                      <span className={`inline-flex px-3 py-2 text-sm font-semibold rounded-full ${getStatusColor(selectedContract.complianceStatus)}`}>
                        {selectedContract.complianceStatus.replace('-', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Renewal Information</h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-gray-600">Renewal Type:</span>
                        <div className="font-medium text-gray-900 capitalize">
                          {selectedContract.renewalType === 'auto' ? 'Automatic' : 
                           selectedContract.renewalType === 'manual' ? 'Manual' : 'No Renewal'}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Reminder Days:</span>
                        <div className="font-medium text-gray-900">{selectedContract.reminderDays} days before expiry</div>
                      </div>
                      {selectedContract.status === 'active' && (
                        <div>
                          <span className="text-gray-600">Days Until Expiry:</span>
                          <div className={`font-medium ${
                            getDaysUntilExpiry(selectedContract.endDate) <= 30 ? 'text-red-600' :
                            getDaysUntilExpiry(selectedContract.endDate) <= 90 ? 'text-orange-600' :
                            'text-gray-900'
                          }`}>
                            {getDaysUntilExpiry(selectedContract.endDate)} days
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Contract Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedContract.tags.map((tag, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Attachments</h4>
                    <div className="space-y-2">
                      {selectedContract.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <i className="ri-file-line w-4 h-4 flex items-center justify-center text-gray-500 mr-2"></i>
                            <span className="text-gray-700">{attachment}</span>
                          </div>
                          <button className="text-blue-600 hover:text-blue-800 cursor-pointer">
                            <i className="ri-download-line w-4 h-4 flex items-center justify-center"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap gap-3 pt-6 border-t">
                <button
                  onClick={() => {
                    setSelectedContract(null);
                    setEditingContract(selectedContract);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-edit-line mr-2"></i>Edit Contract
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap">
                  <i className="ri-refresh-line mr-2"></i>Renew Contract
                </button>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors cursor-pointer whitespace-nowrap">
                  <i className="ri-download-line mr-2"></i>Download PDF
                </button>
                <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors cursor-pointer whitespace-nowrap">
                  <i className="ri-notification-line mr-2"></i>Set Reminder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reminders Modal */}
      {showReminderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Contract Reminders & Alerts</h3>
              <button 
                onClick={() => setShowReminderModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line w-6 h-6 flex items-center justify-center"></i>
              </button>
            </div>
            
            <div className="space-y-4">
              {reminders
                .filter(reminder => reminder.status === 'pending')
                .sort((a, b) => {
                  const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
                  return priorityOrder[b.priority] - priorityOrder[a.priority];
                })
                .map((reminder) => (
                  <div key={reminder.id} className={`border rounded-lg p-4 ${
                    reminder.priority === 'urgent' ? 'border-red-300 bg-red-50' :
                    reminder.priority === 'high' ? 'border-orange-300 bg-orange-50' :
                    reminder.priority === 'medium' ? 'border-yellow-300 bg-yellow-50' :
                    'border-gray-300 bg-gray-50'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <i className={`${getReminderTypeIcon(reminder.type)} w-5 h-5 flex items-center justify-center text-gray-600 mr-3`}></i>
                        <div>
                          <h4 className="font-medium text-gray-900">{reminder.contractTitle}</h4>
                          <p className="text-sm text-gray-600">{reminder.message}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(reminder.priority)}`}>
                          {reminder.priority}
                        </span>
                        <span className="text-sm text-gray-500">{reminder.dueDate}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Assigned to: {reminder.assignedTo}</span>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 cursor-pointer">
                          View Contract
                        </button>
                        <button className="text-green-600 hover:text-green-800 cursor-pointer">
                          Mark Complete
                        </button>
                        <button className="text-orange-600 hover:text-orange-800 cursor-pointer">
                          Snooze
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Contract Modal */}
      {(showAddContract || editingContract) && (
        <ContractForm
          contract={editingContract || undefined}
          onSubmit={(contract) => {
            if (editingContract && 'id' in contract) {
              handleUpdateContract(contract as Contract);
            } else {
              handleAddContract(contract as Omit<Contract, 'id'>);
            }
          }}
          onCancel={() => {
            setShowAddContract(false);
            setEditingContract(null);
          }}
        />
      )}
    </div>
  );
}

// Contract Form Component
interface ContractFormProps {
  contract?: Contract;
  onSubmit: (contract: Contract | Omit<Contract, 'id'>) => void;
  onCancel: () => void;
}

function ContractForm({ contract, onSubmit, onCancel }: ContractFormProps) {
  const [formData, setFormData] = useState<Omit<Contract, 'id'>>({
    title: contract?.title || '',
    contractNumber: contract?.contractNumber || '',
    type: contract?.type || 'supplier',
    partyName: contract?.partyName || '',
    partyContact: contract?.partyContact || '',
    status: contract?.status || 'draft',
    startDate: contract?.startDate || '',
    endDate: contract?.endDate || '',
    value: contract?.value || 0,
    currency: contract?.currency || 'USD',
    renewalType: contract?.renewalType || 'manual',
    paymentTerms: contract?.paymentTerms || 'Net 30',
    description: contract?.description || '',
    tags: contract?.tags || [],
    createdDate: contract?.createdDate || new Date().toISOString().split('T')[0],
    createdBy: contract?.createdBy || 'Current User',
    lastModified: new Date().toISOString().split('T')[0],
    reminderDays: contract?.reminderDays || 60,
    approvalStatus: contract?.approvalStatus || 'pending',
    legalReviewRequired: contract?.legalReviewRequired || false,
    attachments: contract?.attachments || [],
    milestones: contract?.milestones || [],
    terms: contract?.terms || [],
    riskLevel: contract?.riskLevel || 'medium',
    complianceStatus: contract?.complianceStatus || 'pending-review'
  });

  const [newAttachment, setNewAttachment] = useState('');
  const [newTag, setNewTag] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contract) {
      onSubmit({ ...formData, id: contract.id });
    } else {
      onSubmit(formData);
    }
  };

  const handleAddAttachment = () => {
    if (newAttachment.trim()) {
      setFormData({
        ...formData,
        attachments: [...formData.attachments, newAttachment.trim()]
      });
      setNewAttachment('');
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setFormData({
      ...formData,
      attachments: formData.attachments.filter((_, i) => i !== index)
    });
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (index: number) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, i) => i !== index)
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileNames = Array.from(files).map(file => file.name);
      setFormData({
        ...formData,
        attachments: [...formData.attachments, ...fileNames]
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            {contract ? 'Edit Contract' : 'Add New Contract'}
          </h3>
          <button 
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <i className="ri-close-line w-6 h-6 flex items-center justify-center"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contract Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contract Number *</label>
                <input
                  type="text"
                  required
                  value={formData.contractNumber}
                  onChange={(e) => setFormData({ ...formData, contractNumber: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contract Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as Contract['type'] })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8"
                >
                  <option value="supplier">Supplier</option>
                  <option value="customer">Customer</option>
                  <option value="employee">Employee</option>
                  <option value="service">Service</option>
                  <option value="lease">Lease</option>
                  <option value="partnership">Partnership</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Contract['status'] })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8"
                >
                  <option value="draft">Draft</option>
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="terminated">Terminated</option>
                  <option value="renewed">Renewed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Party Information */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Party Information</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Party Name *</label>
                <input
                  type="text"
                  required
                  value={formData.partyName}
                  onChange={(e) => setFormData({ ...formData, partyName: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Party Contact</label>
                <input
                  type="text"
                  value={formData.partyContact}
                  onChange={(e) => setFormData({ ...formData, partyContact: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Contract Terms */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Contract Terms</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
                <input
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contract Value</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="CAD">CAD</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Terms</label>
                <input
                  type="text"
                  value={formData.paymentTerms}
                  onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Net 30, Net 15, Due on Receipt"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Renewal Type</label>
                <select
                  value={formData.renewalType}
                  onChange={(e) => setFormData({ ...formData, renewalType: e.target.value as Contract['renewalType'] })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8"
                >
                  <option value="auto">Automatic</option>
                  <option value="manual">Manual</option>
                  <option value="none">No Renewal</option>
                </select>
              </div>
            </div>
          </div>

          {/* Additional Settings */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Additional Settings</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Risk Level</label>
                <select
                  value={formData.riskLevel}
                  onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value as Contract['riskLevel'] })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reminder Days</label>
                <input
                  type="number"
                  value={formData.reminderDays}
                  onChange={(e) => setFormData({ ...formData, reminderDays: parseInt(e.target.value) || 60 })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Days before expiry to send reminder"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.legalReviewRequired}
                  onChange={(e) => setFormData({ ...formData, legalReviewRequired: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Legal review required</span>
              </label>
            </div>
          </div>

          {/* Contract Tags */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Contract Tags</h4>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Add a tag (e.g., priority, annual, supplier)"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-add-line mr-1"></i>Add Tag
                </button>
              </div>
              
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(index)}
                        className="ml-2 text-blue-600 hover:text-blue-800 cursor-pointer"
                      >
                        <i className="ri-close-line w-3 h-3 flex items-center justify-center"></i>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* File Attachments */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Contract Attachments</h4>
            <div className="space-y-4">
              {/* File Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <i className="ri-upload-cloud-2-line text-gray-400 text-3xl mb-2"></i>
                <p className="text-gray-600 mb-2">Upload contract documents</p>
                <p className="text-sm text-gray-500 mb-4">Drag and drop files here, or click to select</p>
                <label className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-block">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                  />
                  Choose Files
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  Supported formats: PDF, DOC, DOCX, TXT, PNG, JPG, JPEG
                </p>
              </div>

              {/* Manual Attachment Entry */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Or add attachment name manually</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newAttachment}
                    onChange={(e) => setNewAttachment(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAttachment())}
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter document name (e.g., contract_signed.pdf)"
                  />
                  <button
                    type="button"
                    onClick={handleAddAttachment}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-add-line mr-1"></i>Add
                  </button>
                </div>
              </div>

              {/* Attachments List */}
              {formData.attachments.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Attached Documents ({formData.attachments.length})</h5>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {formData.attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                      >
                        <div className="flex items-center">
                          <i className={`text-gray-500 mr-3 ${
                            attachment.toLowerCase().includes('.pdf') ? 'ri-file-pdf-line' :
                            attachment.toLowerCase().includes('.doc') ? 'ri-file-word-line' :
                            attachment.toLowerCase().includes('.jpg') || attachment.toLowerCase().includes('.png') ? 'ri-image-line' :
                            'ri-file-line'
                          }`}></i>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{attachment}</p>
                            <p className="text-xs text-gray-500">
                              {attachment.split('.').pop()?.toUpperCase()} Document
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            className="text-blue-600 hover:text-blue-800 cursor-pointer p-1"
                            title="Download"
                          >
                            <i className="ri-download-line w-4 h-4 flex items-center justify-center"></i>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveAttachment(index)}
                            className="text-red-600 hover:text-red-800 cursor-pointer p-1"
                            title="Remove"
                          >
                            <i className="ri-delete-bin-line w-4 h-4 flex items-center justify-center"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contract Description</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Detailed description of the contract terms, conditions, and purpose..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 cursor-pointer whitespace-nowrap"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer whitespace-nowrap"
            >
              {contract ? 'Update Contract' : 'Create Contract'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}