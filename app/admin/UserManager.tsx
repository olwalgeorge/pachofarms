'use client';
import { useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'supervisor' | 'agronomist' | 'sales' | 'worker' | 'accountant' | 'customer' | 'shopper' | 'supplier';
  userType: 'internal' | 'external';
  department?: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  joinedDate: string;
  lastLogin: string;
  avatar?: string;
  permissions: string[];
  employeeId?: string;
  salary?: number;
  payrollType?: 'monthly' | 'weekly' | 'daily' | 'hourly';
  workSchedule?: string;
  supervisor?: string;
  notes: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  // External user fields
  company?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  totalOrders?: number;
  totalSpent?: number;
  lastOrderDate?: string;
  customerSegment?: 'vip' | 'regular' | 'new' | 'inactive';
  preferredProducts?: string[];
  loyaltyPoints?: number;
  source?: string;
  tags?: string[];
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  color: string;
  userType: 'internal' | 'external' | 'both';
}

// Initial users data
const initialUsers: User[] = [
  {
    id: 1,
    name: 'James Wilson',
    email: 'james.wilson@pachofarm.com',
    phone: '+1 (555) 123-4567',
    role: 'admin',
    userType: 'internal',
    department: 'Management',
    status: 'active',
    joinedDate: '2023-01-15',
    lastLogin: '2024-01-25 09:30',
    employeeId: 'EMP001',
    salary: 75000,
    payrollType: 'monthly',
    workSchedule: 'Monday-Friday 8:00-17:00',
    supervisor: 'CEO',
    permissions: ['*'],
    notes: 'Farm owner and administrator with full system access',
    emergencyContact: {
      name: 'Maria Wilson',
      phone: '+1 (555) 123-4568',
      relationship: 'Wife'
    }
  },
  {
    id: 2,
    name: 'Dr. Maria Rodriguez',
    email: 'maria.rodriguez@pachofarm.com',
    phone: '+1 (555) 234-5678',
    role: 'agronomist',
    userType: 'internal',
    department: 'Agronomy',
    status: 'active',
    joinedDate: '2023-03-20',
    lastLogin: '2024-01-24 14:15',
    employeeId: 'EMP002',
    salary: 65000,
    payrollType: 'monthly',
    workSchedule: 'Monday-Friday 7:00-16:00',
    supervisor: 'James Wilson',
    permissions: ['care_programs_manage', 'spray_schedules', 'fertilizer_plans', 'pest_control', 'soil_analysis', 'crop_monitoring'],
    notes: 'Senior agronomist with PhD in Plant Sciences, specializes in chili cultivation',
    emergencyContact: {
      name: 'Carlos Rodriguez',
      phone: '+1 (555) 234-5679',
      relationship: 'Husband'
    }
  },
  {
    id: 3,
    name: 'Mike Thompson',
    email: 'mike.thompson@pachofarm.com',
    phone: '+1 (555) 345-6789',
    role: 'supervisor',
    userType: 'internal',
    department: 'Field Operations',
    status: 'active',
    joinedDate: '2023-02-10',
    lastLogin: '2024-01-25 06:45',
    employeeId: 'EMP003',
    salary: 55000,
    payrollType: 'monthly',
    workSchedule: 'Monday-Saturday 6:00-15:00',
    supervisor: 'James Wilson',
    permissions: ['field_operations_manage', 'workers_manage', 'equipment_use', 'task_assign', 'progress_track', 'field_access_all'],
    notes: 'Experienced field supervisor, manages day-to-day operations and seasonal workers',
    emergencyContact: {
      name: 'Jennifer Thompson',
      phone: '+1 (555) 345-6790',
      relationship: 'Wife'
    }
  },
  {
    id: 4,
    name: 'Carlos Martinez',
    email: 'carlos.martinez@pachofarm.com',
    phone: '+1 (555) 456-7890',
    role: 'worker',
    userType: 'internal',
    department: 'Field Operations',
    status: 'active',
    joinedDate: '2023-08-15',
    lastLogin: '2024-01-24 17:30',
    employeeId: 'EMP004',
    salary: 18,
    payrollType: 'hourly',
    workSchedule: 'Monday-Friday 7:00-16:00',
    supervisor: 'Mike Thompson',
    permissions: ['tasks_view', 'tasks_update_own', 'equipment_basic', 'time_tracking'],
    notes: 'Reliable field worker, experienced in planting and harvesting operations',
    emergencyContact: {
      name: 'Rosa Martinez',
      phone: '+1 (555) 456-7891',
      relationship: 'Mother'
    }
  },
  {
    id: 5,
    name: 'Jennifer Brown',
    email: 'jennifer.brown@pachofarm.com',
    phone: '+1 (555) 567-8901',
    role: 'sales',
    userType: 'internal',
    department: 'Sales & Marketing',
    status: 'inactive',
    joinedDate: '2023-04-05',
    lastLogin: '2024-01-10 11:20',
    employeeId: 'EMP005',
    salary: 50000,
    payrollType: 'monthly',
    workSchedule: 'Monday-Friday 9:00-18:00',
    supervisor: 'James Wilson',
    permissions: ['orders_modify', 'customers_manage', 'inventory_view', 'prices_update', 'reports_sales'],
    notes: 'Currently on temporary leave, handles B2B sales and customer relationships',
    emergencyContact: {
      name: 'Michael Brown',
      phone: '+1 (555) 567-8902',
      relationship: 'Husband'
    }
  }
];

// Camera Modal Component for User Photos
interface CameraModalProps {
  onCapture: (photoBlob: Blob) => void;
  onClose: () => void;
}

function CameraModal({ onCapture, onClose }: CameraModalProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);
  const [error, setError] = useState<string>('');

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' }
      });
      setStream(mediaStream);
      if (videoRef) {
        videoRef.srcObject = mediaStream;
      }
    } catch (err) {
      setError('Unable to access camera. Please check permissions.');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (!videoRef || !canvasRef) return;

    const context = canvasRef.getContext('2d');
    if (!context) return;

    canvasRef.width = videoRef.videoWidth;
    canvasRef.height = videoRef.videoHeight;
    context.drawImage(videoRef, 0, 0);

    canvasRef.toBlob((blob) => {
      if (blob) {
        onCapture(blob);
        stopCamera();
      }
    }, 'image/jpeg', 0.8);
  };

  React.useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [videoRef]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Take Profile Photo</h3>
          <button 
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <i className="ri-close-line w-6 h-6 flex items-center justify-center"></i>
          </button>
        </div>

        {error ? (
          <div className="text-center py-8">
            <i className="ri-camera-off-line text-4xl text-gray-400 mb-4"></i>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={startCamera}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={setVideoRef}
                autoPlay
                playsInline
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 border-2 border-white/30 rounded-lg"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white rounded-full"></div>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={capturePhoto}
                disabled={!stream}
                className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="ri-camera-line w-6 h-6 flex items-center justify-center"></i>
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              Position your face in the circle and tap the camera button
            </p>
          </div>
        )}

        <canvas ref={setCanvasRef} className="hidden" />
      </div>
    </div>
  );
}

export default function UserManager() {
  const [activeTab, setActiveTab] = useState('internal');
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState('all');
  const [userTypeFilter, setUserTypeFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [currentPhoto, setCurrentPhoto] = useState<string>('');

  const roles: Role[] = [
    // Internal roles
    {
      id: 'admin',
      name: 'Farm Administrator',
      description: 'Full system access and management',
      permissions: ['*'],
      color: 'bg-red-100 text-red-800',
      userType: 'internal'
    },
    {
      id: 'supervisor',
      name: 'Field Supervisor',
      description: 'Manages field operations and casual workers',
      permissions: [
        'field_operations_manage',
        'workers_manage',
        'equipment_use',
        'task_assign',
        'progress_track',
        'field_access_all'
      ],
      color: 'bg-blue-100 text-blue-800',
      userType: 'internal'
    },
    {
      id: 'agronomist',
      name: 'Agronomist',
      description: 'Plant care programs and technical guidance',
      permissions: [
        'care_programs_manage',
        'spray_schedules',
        'fertilizer_plans',
        'pest_control',
        'soil_analysis',
        'crop_monitoring'
      ],
      color: 'bg-green-100 text-green-800',
      userType: 'internal'
    },
    {
      id: 'sales',
      name: 'Sales Representative',
      description: 'Customer and order management',
      permissions: [
        'orders_modify',
        'customers_manage',
        'inventory_view',
        'prices_update',
        'reports_sales'
      ],
      color: 'bg-purple-100 text-purple-800',
      userType: 'internal'
    },
    {
      id: 'accountant',
      name: 'Accountant',
      description: 'Financial management and reporting',
      permissions: [
        'finance_manage',
        'payroll_manage',
        'expenses_manage',
        'budgets_manage',
        'reports_financial'
      ],
      color: 'bg-orange-100 text-orange-800',
      userType: 'internal'
    },
    {
      id: 'worker',
      name: 'Farm Worker',
      description: 'Basic field operations and task execution',
      permissions: [
        'tasks_view',
        'tasks_update_own',
        'equipment_basic',
        'time_tracking'
      ],
      color: 'bg-gray-100 text-gray-800',
      userType: 'internal'
    },
    // External roles
    {
      id: 'customer',
      name: 'Customer',
      description: 'Registered customers with purchase history',
      permissions: [
        'orders_view_own',
        'profile_manage',
        'orders_create',
        'wishlist_manage'
      ],
      color: 'bg-cyan-100 text-cyan-800',
      userType: 'external'
    },
    {
      id: 'shopper',
      name: 'Online Shopper',
      description: 'Website visitors and occasional buyers',
      permissions: [
        'products_view',
        'orders_create_guest',
        'newsletter_subscribe'
      ],
      color: 'bg-teal-100 text-teal-800',
      userType: 'external'
    },
    {
      id: 'supplier',
      name: 'Supplier',
      description: 'External suppliers and vendors',
      permissions: [
        'orders_view_supplier',
        'inventory_update_own',
        'invoices_manage',
        'contact_internal'
      ],
      color: 'bg-indigo-100 text-indigo-800',
      userType: 'external'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleConfig = (roleId: string) => {
    return roles.find(role => role.id === roleId) || roles[0];
  };

  const filteredUsers = users.filter(user => {
    const matchesFilter = userFilter === 'all' || user.role === userFilter;
    const matchesTypeFilter = userTypeFilter === 'all' || user.userType === userTypeFilter;
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.employeeId && user.employeeId.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (user.company && user.company.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesTypeFilter && matchesSearch;
  });

  const handleAddUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: Math.max(...users.map(u => u.id)) + 1,
      lastLogin: 'Never',
      permissions: getRoleConfig(userData.role).permissions
    };
    setUsers(prev => [...prev, newUser]);
    setShowAddUser(false);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(user => user.id === updatedUser.id ? updatedUser : user));
    setEditingUser(null);
  };

  const handleDeleteUser = (userId: number) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
    }
  };

  const toggleUserStatus = (userId: number) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' as User['status'] }
        : user
    ));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage internal employees and external users</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center cursor-pointer whitespace-nowrap"
        >
          <i className="ri-add-line mr-2"></i>
          Add User
        </button>
      </div>

      {/* Note about Customer Segments */}
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center">
          <i className="ri-information-line text-blue-600 mr-2"></i>
          <p className="text-blue-800">
            <strong>Customer Segments</strong> have been moved to the <strong>Customer Management</strong> section for better CRM functionality.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('internal')}
            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm cursor-pointer ${
              activeTab === 'internal'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <i className="ri-user-line mr-2"></i>
            Internal Users
          </button>
          <button
            onClick={() => setActiveTab('external')}
            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm cursor-pointer ${
              activeTab === 'external'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <i className="ri-global-line mr-2"></i>
            External Users
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm cursor-pointer ${
              activeTab === 'analytics'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <i className="ri-bar-chart-line mr-2"></i>
            Analytics
          </button>
        </nav>
      </div>

      {/* Users Tab */}
      {activeTab === 'internal' && (
        <div className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <i className="ri-user-line text-blue-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <i className="ri-team-line text-green-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Internal Users</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter(u => u.userType === 'internal').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mr-4">
                  <i className="ri-user-heart-line text-cyan-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Customers</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter(u => u.role === 'customer').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mr-4">
                  <i className="ri-shopping-cart-line text-teal-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Shoppers</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter(u => u.role === 'shopper').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                  <i className="ri-truck-line text-indigo-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Suppliers</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter(u => u.role === 'supplier').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Filters */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Users</label>
                <div className="relative">
                  <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                    placeholder="Search by name, email, company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">User Type</label>
                <select
                  value={userTypeFilter}
                  onChange={(e) => setUserTypeFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8"
                >
                  <option value="all">All Types</option>
                  <option value="internal">Internal Users</option>
                  <option value="external">External Users</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Role</label>
                <select
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8"
                >
                  <option value="all">All Roles</option>
                  <optgroup label="Internal Roles">
                    {roles.filter(r => r.userType === 'internal').map(role => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="External Roles">
                    {roles.filter(r => r.userType === 'external').map(role => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div className="flex items-end">
                <div className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg w-full">
                  <div className="font-medium">Results: {filteredUsers.length} of {users.length}</div>
                  <div className="text-xs text-gray-500">
                    Internal: {filteredUsers.filter(u => u.userType === 'internal').length} | 
                    External: {filteredUsers.filter(u => u.userType === 'external').length}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Users List */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role & Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => {
                  const roleConfig = getRoleConfig(user.role);
                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full overflow-hidden mr-4 bg-green-100 flex items-center justify-center">
                            {user.avatar ? (
                              <img 
                                src={user.avatar} 
                                alt={user.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <i className="ri-user-line text-green-600"></i>
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                            <div className="text-xs text-gray-400">
                              {user.employeeId ? `ID: ${user.employeeId}` : user.company || 'Individual'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${roleConfig.color}`}>
                            {roleConfig.name}
                          </span>
                          <div className="text-xs text-gray-500">
                            {user.userType === 'internal' ? (
                              <span className="text-blue-600">Internal</span>
                            ) : (
                              <span className="text-green-600">External</span>
                            )}
                            {user.department && ` • ${user.department}`}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.phone}</div>
                        {user.city && user.state && (
                          <div className="text-sm text-gray-500">{user.city}, {user.state}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                        {user.customerSegment && (
                          <div className="text-xs text-gray-500 mt-1">
                            {user.customerSegment.toUpperCase()}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.lastLogin}</div>
                        {user.userType === 'external' && user.totalOrders && (
                          <div className="text-xs text-gray-500">
                            {user.totalOrders} orders • ${user.totalSpent?.toFixed(2)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button 
                          onClick={() => setSelectedUser(user)}
                          className="text-blue-600 hover:text-blue-900 cursor-pointer"
                        >
                          View
                        </button>
                        <button 
                          onClick={() => setEditingUser(user)}
                          className="text-green-600 hover:text-green-900 cursor-pointer"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => toggleUserStatus(user.id)}
                          className="text-orange-600 hover:text-orange-900 cursor-pointer"
                        >
                          {user.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900 cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Roles & Permissions Tab */}
      {activeTab === 'external' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {roles.map((role) => {
              const userCount = users.filter(u => u.role === role.id).length;
              return (
                <div key={role.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{role.name}</h3>
                      <p className="text-sm text-gray-500">{role.description}</p>
                    </div>
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${role.color}`}>
                      {userCount} users
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Permissions:</h4>
                      <div className="space-y-1">
                        {role.permissions.slice(0, 4).map((permission, index) => (
                          <div key={index} className="flex items-center text-xs text-gray-600">
                            <i className="ri-check-line w-3 h-3 flex items-center justify-center text-green-500 mr-2"></i>
                            {permission === '*' ? 'Full System Access' : permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </div>
                        ))}
                        {role.permissions.length > 4 && (
                          <div className="text-xs text-gray-500">
                            +{role.permissions.length - 4} more permissions
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-600">
                        <div className="flex justify-between mb-1">
                          <span>Active Users:</span>
                          <span className="font-medium">{users.filter(u => u.role === role.id && u.status === 'active').length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Users:</span>
                          <span className="font-medium">{userCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Permission Matrix */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Permission Matrix</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Permission</th>
                    {roles.map(role => (
                      <th key={role.id} className="px-4 py-3 text-center text-sm font-medium text-gray-900">
                        {role.name.split(' ')[0]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    'field_operations_manage',
                    'workers_manage', 
                    'care_programs_manage',
                    'orders_modify',
                    'finance_manage',
                    'equipment_use',
                    'reports_access'
                  ].map(permission => (
                    <tr key={permission}>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </td>
                      {roles.map(role => (
                        <td key={role.id} className="px-4 py-3 text-center">
                          {role.permissions.includes('*') || role.permissions.includes(permission) ? (
                            <i className="ri-check-line text-green-500"></i>
                          ) : (
                            <i className="ri-close-line text-red-500"></i>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* HR Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Department Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Distribution</h3>
              <div className="space-y-4">
                {['Field Operations', 'Management', 'Agronomy', 'Sales & Marketing', 'Finance', 'Processing'].map(dept => {
                  const count = users.filter(u => u.department === dept).length;
                  const percentage = users.length > 0 ? (count / users.length) * 100 : 0;
                  return (
                    <div key={dept}>
                      <div className="flex justify-between text-sm">
                        <span>{dept}</span>
                        <span>{count} users ({percentage.toFixed(1)}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payroll Summary</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      ${users.filter(u => u.payrollType === 'monthly').reduce((sum, u) => sum + (u.salary || 0), 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-blue-600">Monthly Salaries</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      ${users.filter(u => u.payrollType === 'hourly').reduce((sum, u) => sum + (u.salary || 0), 0)}/hr
                    </div>
                    <div className="text-sm text-green-600">Hourly Rates</div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Monthly Employees:</span>
                    <span className="font-medium">{users.filter(u => u.payrollType === 'monthly').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hourly Workers:</span>
                    <span className="font-medium">{users.filter(u => u.payrollType === 'hourly').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Hourly Rate:</span>
                    <span className="font-medium">
                      ${(users.filter(u => u.payrollType === 'hourly').reduce((sum, u) => sum + (u.salary || 0), 0) / 
                        users.filter(u => u.payrollType === 'hourly').length || 1).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent HR Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <i className="ri-user-add-line w-6 h-6 flex items-center justify-center text-green-600 mr-3"></i>
                <div>
                  <div className="text-sm font-medium text-gray-900">New employee onboarded</div>
                  <div className="text-xs text-gray-500">Carlos Martinez joined as Field Worker - 3 days ago</div>
                </div>
              </div>
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <i className="ri-user-settings-line w-6 h-6 flex items-center justify-center text-blue-600 mr-3"></i>
                <div>
                  <div className="text-sm font-medium text-gray-900">Role updated</div>
                  <div className="text-xs text-gray-500">Maria Rodriguez promoted to Senior Agronomist - 1 week ago</div>
                </div>
              </div>
              <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                <i className="ri-time-line w-6 h-6 flex items-center justify-center text-yellow-600 mr-3"></i>
                <div>
                  <div className="text-sm font-medium text-gray-900">Status change</div>
                  <div className="text-xs text-gray-500">Jennifer Brown marked as inactive - temporary leave - 2 weeks ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {showViewModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-0 w-full max-w-4xl max-h-[95vh] overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 text-white">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-full overflow-hidden mr-4 bg-white/20 flex items-center justify-center">
                    {selectedUser.avatar ? (
                      <img 
                        src={selectedUser.avatar} 
                        alt={selectedUser.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <i className="ri-user-line text-2xl text-white"></i>
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{selectedUser.name}</h3>
                    <p className="text-green-100 mt-1">{selectedUser.employeeId} • {selectedUser.department}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="text-white hover:text-gray-200 cursor-pointer"
                >
                  <i className="ri-close-line w-8 h-8 flex items-center justify-center"></i>
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(95vh-100px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Full Name:</span>
                        <span className="font-medium">{selectedUser.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{selectedUser.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">{selectedUser.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Employee ID:</span>
                        <span className="font-medium">{selectedUser.employeeId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Joined Date:</span>
                        <span className="font-medium">{selectedUser.joinedDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">{selectedUser.emergencyContact.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">{selectedUser.emergencyContact.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Relationship:</span>
                        <span className="font-medium">{selectedUser.emergencyContact.relationship}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Work Information */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Work Information</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Role:</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleConfig(selectedUser.role).color}`}>
                          {getRoleConfig(selectedUser.role).name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Department:</span>
                        <span className="font-medium">{selectedUser.department}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedUser.status)}`}>
                          {selectedUser.status}
                        </span>
                      </div>
                      {selectedUser.supervisor && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Supervisor:</span>
                          <span className="font-medium">{selectedUser.supervisor}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Work Schedule:</span>
                        <span className="font-medium text-right">{selectedUser.workSchedule}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Compensation</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Salary:</span>
                        <span className="font-medium">
                          ${selectedUser.salary?.toLocaleString()} 
                          {selectedUser.payrollType === 'hourly' ? '/hour' : '/month'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pay Type:</span>
                        <span className="font-medium capitalize">{selectedUser.payrollType}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Permissions */}
              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Permissions</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {selectedUser.permissions.map((permission, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-700">
                      <i className="ri-check-line w-4 h-4 flex items-center justify-center text-green-500 mr-2"></i>
                      {permission === '*' ? 'Full System Access' : permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selectedUser.notes && (
                <div className="mt-6 bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Notes</h4>
                  <p className="text-gray-700">{selectedUser.notes}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setSelectedUser(null);
                    setEditingUser(selectedUser);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-edit-line mr-2"></i>Edit User
                </button>
                <button
                  onClick={() => toggleUserStatus(selectedUser.id)}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-user-settings-line mr-2"></i>
                  {selectedUser.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap">
                  <i className="ri-mail-line mr-2"></i>Send Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <UserForm
          onSubmit={handleAddUser}
          onCancel={() => setShowAddUser(false)}
          roles={roles}
        />
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <UserForm
          user={editingUser}
          onSubmit={handleUpdateUser}
          onCancel={() => setEditingUser(null)}
          roles={roles}
        />
      )}
    </div>
  );
}

interface UserFormProps {
  user?: User;
  onSubmit: (user: User | Omit<User, 'id'>) => void;
  onCancel: () => void;
  roles: Role[];
}

function UserForm({ user, onSubmit, onCancel, roles }: UserFormProps) {
  const [formData, setFormData] = useState<Omit<User, 'id'>>({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    role: user?.role || 'worker',
    department: user?.department || '',
    status: user?.status || 'active',
    joinedDate: user?.joinedDate || new Date().toISOString().split('T')[0],
    lastLogin: user?.lastLogin || 'Never',
    employeeId: user?.employeeId || '',
    salary: user?.salary || 0,
    payrollType: user?.payrollType || 'hourly',
    workSchedule: user?.workSchedule || '',
    supervisor: user?.supervisor || '',
    notes: user?.notes || '',
    permissions: user?.permissions || [],
    emergencyContact: user?.emergencyContact || {
      name: '',
      phone: '',
      relationship: ''
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedRole = roles.find(r => r.id === formData.role);
    const userData = {
      ...formData,
      permissions: selectedRole?.permissions || []
    };
    
    if (user) {
      onSubmit({ ...userData, id: user.id });
    } else {
      onSubmit(userData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            {user ? 'Edit User' : 'Add New User'}
          </h3>
          <button 
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <i className="ri-close-line w-6 h-6 flex items-center justify-center"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID *</label>
                <input
                  type="text"
                  required
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Work Information */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Work Information</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as User['role'] })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8"
                >
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8"
                >
                  <option value="">Select Department</option>
                  <option value="Management">Management</option>
                  <option value="Field Operations">Field Operations</option>
                  <option value="Agronomy">Agronomy</option>
                  <option value="Sales & Marketing">Sales & Marketing</option>
                  <option value="Finance">Finance</option>
                  <option value="Processing">Processing</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as User['status'] })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Joined Date</label>
                <input
                  type="date"
                  value={formData.joinedDate}
                  onChange={(e) => setFormData({ ...formData, joinedDate: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Supervisor</label>
                <input
                  type="text"
                  value={formData.supervisor}
                  onChange={(e) => setFormData({ ...formData, supervisor: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Work Schedule</label>
                <input
                  type="text"
                  value={formData.workSchedule}
                  onChange={(e) => setFormData({ ...formData, workSchedule: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Monday-Friday 8:00-17:00"
                />
              </div>
            </div>
          </div>

          {/* Compensation */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Compensation</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Salary/Rate</label>
                <input
                  type="number"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pay Type</label>
                <select
                  value={formData.payrollType}
                  onChange={(e) => setFormData({ ...formData, payrollType: e.target.value as User['payrollType'] })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.emergencyContact.name}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    emergencyContact: { ...formData.emergencyContact, name: e.target.value }
                  })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.emergencyContact.phone}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    emergencyContact: { ...formData.emergencyContact, phone: e.target.value }
                  })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
                <input
                  type="text"
                  value={formData.emergencyContact.relationship}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    emergencyContact: { ...formData.emergencyContact, relationship: e.target.value }
                  })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full p-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Additional notes about the user..."
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
              {user ? 'Update User' : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}