
'use client';
import { useState } from 'react';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  company?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  status: 'active' | 'inactive' | 'suspended';
  customerSegment: 'vip' | 'regular' | 'new' | 'inactive';
  joinedDate: string;
  preferredProducts: string[];
  loyaltyPoints: number;
  source: string;
  tags: string[];
  notes: string;
  avatar?: string;
  lastContactDate?: string;
  nextFollowUp?: string;
  leadScore?: number;
  lifetimeValue: number;
  averageOrderValue: number;
  orderFrequency: number;
  lastPurchaseCategory?: string;
  communicationPreference: 'email' | 'phone' | 'sms' | 'mail';
  birthday?: string;
  anniversaryDate?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
}

interface Interaction {
  id: number;
  customerId: number;
  type: 'call' | 'email' | 'meeting' | 'order' | 'complaint' | 'support';
  date: string;
  subject: string;
  details: string;
  outcome: 'positive' | 'neutral' | 'negative';
  followUpRequired: boolean;
  followUpDate?: string;
  assignedTo: string;
}

export default function CustomersManager() {
  const [activeTab, setActiveTab] = useState('customers');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [customerFilter, setCustomerFilter] = useState('all');
  const [segmentFilter, setSegmentFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showInteractionModal, setShowInteractionModal] = useState(false);
  const [selectedInteraction, setSelectedInteraction] = useState<Interaction | null>(null);

  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 123-4567',
      company: 'Johnson Restaurant Group',
      address: '123 Market Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'USA',
      totalOrders: 24,
      totalSpent: 2850.75,
      lastOrderDate: '2024-01-18',
      status: 'active',
      customerSegment: 'vip',
      joinedDate: '2023-06-15',
      preferredProducts: ['Bird\'s Eye Chili', 'Thai Dragon', 'Habanero Mix'],
      loyaltyPoints: 2850,
      source: 'website',
      tags: ['bulk-buyer', 'restaurant', 'organic-preferred'],
      notes: 'VIP customer, prefers organic varieties. Owns multiple restaurant locations.',
      avatar: 'https://readdy.ai/api/search-image?query=Professional%20woman%20restaurant%20owner%20portrait%2C%20friendly%20and%20successful%20business%20person%2C%20modern%20casual%20attire%2C%20warm%20smile%2C%20clean%20background%2C%20high%20quality%20headshot%20for%20customer%20profile&width=150&height=150&seq=customer1&orientation=squarish',
      lastContactDate: '2024-01-20',
      nextFollowUp: '2024-02-01',
      leadScore: 95,
      lifetimeValue: 2850.75,
      averageOrderValue: 118.78,
      orderFrequency: 2.5,
      lastPurchaseCategory: 'Premium Hot Peppers',
      communicationPreference: 'email',
      birthday: '1985-07-15',
      socialMedia: {
        linkedin: 'sarah-johnson-restaurants',
        instagram: '@johnsonrestaurants'
      }
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@spiceworld.com',
      phone: '+1 (555) 234-5678',
      company: 'Spice World Restaurant Chain',
      address: '456 Broadway Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      totalOrders: 18,
      totalSpent: 1950.50,
      lastOrderDate: '2024-01-15',
      status: 'active',
      customerSegment: 'regular',
      joinedDate: '2023-08-22',
      preferredProducts: ['Carolina Reaper', 'Ghost Pepper', 'Scotch Bonnet'],
      loyaltyPoints: 1950,
      source: 'referral',
      tags: ['chef', 'bulk-buyer', 'heat-seeker'],
      notes: 'Executive Chef at multiple locations, prefers super hot varieties for signature dishes.',
      avatar: 'https://readdy.ai/api/search-image?query=Professional%20Asian%20male%20chef%20portrait%2C%20confident%20culinary%20expert%2C%20chef%20coat%2C%20warm%20professional%20expression%2C%20clean%20background%2C%20high%20quality%20headshot%20for%20customer%20profile&width=150&height=150&seq=customer2&orientation=squarish',
      lastContactDate: '2024-01-18',
      nextFollowUp: '2024-01-30',
      leadScore: 85,
      lifetimeValue: 1950.50,
      averageOrderValue: 108.36,
      orderFrequency: 1.8,
      lastPurchaseCategory: 'Extreme Hot Peppers',
      communicationPreference: 'phone',
      socialMedia: {
        instagram: '@chefmichaelchen',
        twitter: '@spiceworldchef'
      }
    },
    {
      id: 3,
      name: 'Emma Wilson',
      email: 'emma.wilson@homestead.net',
      phone: '+1 (555) 345-6789',
      address: '789 Garden Lane',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      country: 'USA',
      totalOrders: 6,
      totalSpent: 285.25,
      lastOrderDate: '2024-01-12',
      status: 'active',
      customerSegment: 'new',
      joinedDate: '2023-11-10',
      preferredProducts: ['Mild Mix Pack', 'Bell Pepper Seeds'],
      loyaltyPoints: 285,
      source: 'social_media',
      tags: ['home-gardener', 'beginner', 'seeds'],
      notes: 'Home gardener, interested in growing tips and beginner-friendly varieties.',
      avatar: 'https://readdy.ai/api/search-image?query=Friendly%20woman%20home%20gardener%20portrait%2C%20enthusiastic%20hobbyist%2C%20casual%20outdoor%20attire%2C%20genuine%20smile%2C%20natural%20lighting%2C%20clean%20background%2C%20high%20quality%20headshot%20for%20customer%20profile&width=150&height=150&seq=customer3&orientation=squarish',
      lastContactDate: '2024-01-10',
      nextFollowUp: '2024-01-25',
      leadScore: 65,
      lifetimeValue: 285.25,
      averageOrderValue: 47.54,
      orderFrequency: 0.8,
      lastPurchaseCategory: 'Garden Seeds',
      communicationPreference: 'email',
      birthday: '1990-03-22',
      socialMedia: {
        instagram: '@emmashomestead',
        facebook: 'emma.wilson.gardening'
      }
    },
    {
      id: 4,
      name: 'David Thompson',
      email: 'david.t@gmail.com',
      phone: '+1 (555) 456-7890',
      address: '321 Pine Street',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      country: 'USA',
      totalOrders: 2,
      totalSpent: 45.50,
      lastOrderDate: '2024-01-10',
      status: 'active',
      customerSegment: 'new',
      joinedDate: '2024-01-05',
      preferredProducts: ['Starter Pack'],
      loyaltyPoints: 45,
      source: 'google_ads',
      tags: ['price-conscious', 'new-to-peppers'],
      notes: 'New customer, price-sensitive, good potential for growth.',
      lastContactDate: '2024-01-05',
      nextFollowUp: '2024-01-28',
      leadScore: 45,
      lifetimeValue: 45.50,
      averageOrderValue: 22.75,
      orderFrequency: 0.3,
      lastPurchaseCategory: 'Starter Products',
      communicationPreference: 'email'
    },
    {
      id: 5,
      name: 'Lisa Garcia',
      email: 'lisa.garcia.cooking@outlook.com',
      phone: '+1 (555) 567-8901',
      address: '654 Ocean Drive',
      city: 'Miami',
      state: 'FL',
      zipCode: '33139',
      country: 'USA',
      totalOrders: 1,
      totalSpent: 19.99,
      lastOrderDate: '2023-12-20',
      status: 'inactive',
      customerSegment: 'inactive',
      joinedDate: '2023-12-15',
      preferredProducts: ['Caribbean Mix'],
      loyaltyPoints: 20,
      source: 'facebook_ads',
      tags: ['single-purchase', 'inactive'],
      notes: 'Inactive for over 3 weeks, sent re-engagement email. Potential churn risk.',
      lastContactDate: '2023-12-28',
      nextFollowUp: '2024-01-25',
      leadScore: 15,
      lifetimeValue: 19.99,
      averageOrderValue: 19.99,
      orderFrequency: 0.1,
      lastPurchaseCategory: 'Caribbean Peppers',
      communicationPreference: 'email'
    }
  ]);

  const [interactions, setInteractions] = useState<Interaction[]>([
    {
      id: 1,
      customerId: 1,
      type: 'call',
      date: '2024-01-20',
      subject: 'Order Follow-up Call',
      details: 'Discussed upcoming catering order for restaurant opening. Customer interested in bulk pricing.',
      outcome: 'positive',
      followUpRequired: true,
      followUpDate: '2024-02-01',
      assignedTo: 'James Wilson'
    },
    {
      id: 2,
      customerId: 2,
      type: 'email',
      date: '2024-01-18',
      subject: 'New Product Inquiry',
      details: 'Customer asked about availability of ghost pepper powder for new menu item.',
      outcome: 'positive',
      followUpRequired: false,
      assignedTo: 'James Wilson'
    },
    {
      id: 3,
      customerId: 3,
      type: 'support',
      date: '2024-01-10',
      subject: 'Growing Tips Request',
      details: 'Customer requested guidance on growing peppers in Texas climate.',
      outcome: 'positive',
      followUpRequired: true,
      followUpDate: '2024-01-25',
      assignedTo: 'Dr. Maria Rodriguez'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'vip': return 'bg-purple-100 text-purple-800';
      case 'regular': return 'bg-green-100 text-green-800';
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInteractionTypeIcon = (type: string) => {
    switch (type) {
      case 'call': return 'ri-phone-line';
      case 'email': return 'ri-mail-line';
      case 'meeting': return 'ri-calendar-line';
      case 'order': return 'ri-shopping-cart-line';
      case 'complaint': return 'ri-error-warning-line';
      case 'support': return 'ri-customer-service-line';
      default: return 'ri-chat-1-line';
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesFilter = customerFilter === 'all' || customer.status === customerFilter;
    const matchesSegment = segmentFilter === 'all' || customer.customerSegment === segmentFilter;
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (customer.company && customer.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         customer.phone.includes(searchTerm);
    return matchesFilter && matchesSegment && matchesSearch;
  });

  const getCustomerInteractions = (customerId: number) => {
    return interactions.filter(interaction => interaction.customerId === customerId);
  };

  const handleAddCustomer = (customerData: Omit<Customer, 'id'>) => {
    const newCustomer: Customer = {
      ...customerData,
      id: Math.max(...customers.map(c => c.id)) + 1
    };
    setCustomers(prev => [...prev, newCustomer]);
    setShowAddCustomer(false);
  };

  const handleUpdateCustomer = (updatedCustomer: Customer) => {
    setCustomers(prev => prev.map(customer => 
      customer.id === updatedCustomer.id ? updatedCustomer : customer
    ));
    setEditingCustomer(null);
  };

  const handleAddInteraction = (interactionData: Omit<Interaction, 'id'>) => {
    const newInteraction: Interaction = {
      ...interactionData,
      id: Math.max(...interactions.map(i => i.id)) + 1
    };
    setInteractions(prev => [...prev, newInteraction]);
    setShowInteractionModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Customer Relationship Management</h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAddCustomer(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-user-add-line mr-2"></i>Add Customer
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap">
            <i className="ri-download-line mr-2"></i>Export Data
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'customers', name: 'Customer Directory', icon: 'ri-user-line' },
            { id: 'segments', name: 'Customer Segments', icon: 'ri-group-line' },
            { id: 'interactions', name: 'Interactions', icon: 'ri-chat-history-line' },
            { id: 'analytics', name: 'Analytics', icon: 'ri-bar-chart-line' },
            { id: 'campaigns', name: 'Campaigns', icon: 'ri-megaphone-line' }
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

      {/* Customer Directory Tab */}
      {activeTab === 'customers' && (
        <div className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <i className="ri-user-line text-blue-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Customers</p>
                  <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <i className="ri-vip-crown-line text-purple-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-500">VIP Customers</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {customers.filter(c => c.customerSegment === 'vip').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <i className="ri-user-add-line text-green-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-500">New This Month</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {customers.filter(c => c.customerSegment === 'new').length}
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
                  <p className="text-sm text-gray-500">Avg. Order Value</p>
                  <p className="text-2xl font-bold text-gray-900">$87.50</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <i className="ri-heart-line text-red-600 text-xl"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Customer Satisfaction</p>
                  <p className="text-2xl font-bold text-gray-900">4.8/5</p>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Filters */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Customers</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Customer Status</label>
                <select
                  value={customerFilter}
                  onChange={(e) => setCustomerFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Customer Segment</label>
                <select
                  value={segmentFilter}
                  onChange={(e) => setSegmentFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8"
                >
                  <option value="all">All Segments</option>
                  <option value="vip">VIP</option>
                  <option value="regular">Regular</option>
                  <option value="new">New</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex items-end">
                <div className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg w-full">
                  <div className="font-medium">Results: {filteredCustomers.length} of {customers.length}</div>
                  <div className="text-xs text-gray-500">
                    Active: {filteredCustomers.filter(c => c.status === 'active').length} | 
                    VIP: {filteredCustomers.filter(c => c.customerSegment === 'vip').length}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Customers Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Segment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Follow-up</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full overflow-hidden mr-4 bg-green-100 flex items-center justify-center">
                          {customer.avatar ? (
                            <img 
                              src={customer.avatar} 
                              alt={customer.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <i className="ri-user-line text-green-600"></i>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                          <div className="text-sm text-gray-500">{customer.company || 'Individual'}</div>
                          <div className="text-xs text-gray-400">{customer.city}, {customer.state}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{customer.email}</div>
                        <div className="text-sm text-gray-500">{customer.phone}</div>
                        <div className="text-xs text-gray-400">
                          <i className={`ri-${customer.communicationPreference === 'email' ? 'mail' : customer.communicationPreference === 'phone' ? 'phone' : 'message'}-line mr-1`}></i>
                          {customer.communicationPreference}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSegmentColor(customer.customerSegment)}`}>
                          {customer.customerSegment.toUpperCase()}
                        </span>
                        <div className="text-xs text-gray-500">
                          <span className={`inline-flex px-2 py-1 rounded-full ${getStatusColor(customer.status)}`}>
                            {customer.status}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div>{customer.totalOrders} orders</div>
                        <div className="font-medium">${customer.totalSpent.toFixed(2)}</div>
                        <div className="text-xs text-gray-500">
                          Avg: ${customer.averageOrderValue.toFixed(2)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className={`h-2 rounded-full ${
                              (customer.leadScore || 0) >= 80 ? 'bg-green-600' :
                              (customer.leadScore || 0) >= 60 ? 'bg-yellow-600' :
                              (customer.leadScore || 0) >= 40 ? 'bg-orange-600' : 'bg-red-600'
                            }`}
                            style={{ width: `${customer.leadScore || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{customer.leadScore}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {customer.nextFollowUp ? (
                          <div>
                            <div>{customer.nextFollowUp}</div>
                            <div className="text-xs text-gray-500">Follow-up due</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">No follow-up</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button 
                        onClick={() => setSelectedCustomer(customer)}
                        className="text-blue-600 hover:text-blue-900 cursor-pointer"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => setEditingCustomer(customer)}
                        className="text-green-600 hover:text-green-900 cursor-pointer"
                      >
                        Edit
                      </button>
                      <button className="text-purple-600 hover:text-purple-900 cursor-pointer">
                        Contact
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Customer Segments Tab */}
      {activeTab === 'segments' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* VIP Customers */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <i className="ri-vip-crown-line w-8 h-8 flex items-center justify-center text-purple-600 mr-3"></i>
                  <div>
                    <h3 className="text-lg font-semibold text-purple-900">VIP Customers</h3>
                    <p className="text-sm text-purple-700">High-value repeat customers</p>
                  </div>
                </div>
                <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {customers.filter(c => c.customerSegment === 'vip').length}
                </span>
              </div>
              <div className="space-y-3">
                <div className="text-sm text-purple-800">
                  <div className="flex justify-between mb-1">
                    <span>Avg. Order Value:</span>
                    <span className="font-semibold">$118.78</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Total Revenue:</span>
                    <span className="font-semibold">$2,850.75</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Avg. Orders/Month:</span>
                    <span className="font-semibold">2.5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Retention Rate:</span>
                    <span className="font-semibold">95%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Regular Customers */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <i className="ri-user-heart-line w-8 h-8 flex items-center justify-center text-green-600 mr-3"></i>
                  <div>
                    <h3 className="text-lg font-semibold text-green-900">Regular Customers</h3>
                    <p className="text-sm text-green-700">Consistent repeat buyers</p>
                  </div>
                </div>
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {customers.filter(c => c.customerSegment === 'regular').length}
                </span>
              </div>
              <div className="space-y-3">
                <div className="text-sm text-green-800">
                  <div className="flex justify-between mb-1">
                    <span>Avg. Order Value:</span>
                    <span className="font-semibold">$108.36</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Total Revenue:</span>
                    <span className="font-semibold">$1,950.50</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Avg. Orders/Month:</span>
                    <span className="font-semibold">1.8</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Retention Rate:</span>
                    <span className="font-semibold">78%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* New Customers */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <i className="ri-user-add-line w-8 h-8 flex items-center justify-center text-blue-600 mr-3"></i>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900">New Customers</h3>
                    <p className="text-sm text-blue-700">Recent sign-ups & first-time buyers</p>
                  </div>
                </div>
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {customers.filter(c => c.customerSegment === 'new').length}
                </span>
              </div>
              <div className="space-y-3">
                <div className="text-sm text-blue-800">
                  <div className="flex justify-between mb-1">
                    <span>Avg. Order Value:</span>
                    <span className="font-semibold">$35.15</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Total Revenue:</span>
                    <span className="font-semibold">$330.75</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Avg. Orders/Month:</span>
                    <span className="font-semibold">0.55</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Conversion Rate:</span>
                    <span className="font-semibold">68%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Inactive Customers */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <i className="ri-user-unfollow-line w-8 h-8 flex items-center justify-center text-gray-600 mr-3"></i>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Inactive Customers</h3>
                    <p className="text-sm text-gray-700">No activity in 30+ days</p>
                  </div>
                </div>
                <span className="bg-gray-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {customers.filter(c => c.customerSegment === 'inactive').length}
                </span>
              </div>
              <div className="space-y-3">
                <div className="text-sm text-gray-800">
                  <div className="flex justify-between mb-1">
                    <span>Last Active:</span>
                    <span className="font-semibold">25+ days ago</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Re-engagement Rate:</span>
                    <span className="font-semibold">15%</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Potential Revenue:</span>
                    <span className="font-semibold">$19.99</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Churn Risk:</span>
                    <span className="font-semibold text-red-600">High</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Sources */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <i className="ri-radar-line w-8 h-8 flex items-center justify-center text-orange-600 mr-3"></i>
                  <div>
                    <h3 className="text-lg font-semibold text-orange-900">Traffic Sources</h3>
                    <p className="text-sm text-orange-700">How customers found us</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { source: 'Website', count: 2, color: 'bg-orange-500' },
                  { source: 'Referral', count: 1, color: 'bg-orange-400' },
                  { source: 'Social Media', count: 1, color: 'bg-orange-300' },
                  { source: 'Google Ads', count: 1, color: 'bg-orange-200' }
                ].map((item) => {
                  const percentage = (item.count / 5) * 100;
                  return (
                    <div key={item.source} className="flex items-center justify-between text-sm">
                      <span className="text-orange-800">{item.source}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-orange-200 rounded-full h-2">
                          <div
                            className={`${item.color} h-2 rounded-full`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-orange-900 font-medium">{item.count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Geographic Distribution */}
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-6 border border-teal-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <i className="ri-map-pin-line w-8 h-8 flex items-center justify-center text-teal-600 mr-3"></i>
                  <div>
                    <h3 className="text-lg font-semibold text-teal-900">Geographic Spread</h3>
                    <p className="text-sm text-teal-700">Customer locations</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { state: 'California', count: 2, color: 'bg-teal-500' },
                  { state: 'New York', count: 1, color: 'bg-teal-400' },
                  { state: 'Texas', count: 1, color: 'bg-teal-300' },
                  { state: 'Others', count: 1, color: 'bg-teal-200' }
                ].map((item) => {
                  const percentage = (item.count / 5) * 100;
                  return (
                    <div key={item.state} className="flex items-center justify-between text-sm">
                      <span className="text-teal-800">{item.state}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-teal-200 rounded-full h-2">
                          <div
                            className={`${item.color} h-2 rounded-full`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-teal-900 font-medium">{item.count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Detailed Segment Analysis */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Segment Performance Analysis</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Segment</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">Customers</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">Avg Order Value</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">Total Revenue</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">Retention Rate</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">Growth</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">VIP Customers</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-900">1</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-900">$118.78</td>
                    <td className="px-4 py-3 text-center text-sm font-medium text-gray-900">$2,850.75</td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        95%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-green-600 font-medium">+12%</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Regular Customers</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-900">1</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-900">$108.36</td>
                    <td className="px-4 py-3 text-center text-sm font-medium text-gray-900">$1,950.50</td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        78%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-green-600 font-medium">+8%</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">New Customers</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-900">2</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-900">$35.15</td>
                    <td className="px-4 py-3 text-center text-sm font-medium text-gray-900">$330.75</td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        45%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-green-600 font-medium">+25%</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Inactive Customers</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-900">1</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-900">$19.99</td>
                    <td className="px-4 py-3 text-center text-sm font-medium text-gray-900">$19.99</td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        5%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-red-600 font-medium">-15%</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Interactions Tab */}
      {activeTab === 'interactions' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Customer Interactions</h3>
            <button
              onClick={() => setShowInteractionModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-add-line mr-2"></i>Add Interaction
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Outcome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Follow-up</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {interactions.map((interaction) => {
                  const customer = customers.find(c => c.id === interaction.customerId);
                  return (
                    <tr key={interaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{customer?.name}</div>
                        <div className="text-sm text-gray-500">{customer?.company || 'Individual'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <i className={`${getInteractionTypeIcon(interaction.type)} w-4 h-4 flex items-center justify-center text-gray-500 mr-2`}></i>
                          <span className="text-sm text-gray-900 capitalize">{interaction.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{interaction.subject}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{interaction.details}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {interaction.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          interaction.outcome === 'positive' ? 'bg-green-100 text-green-800' :
                          interaction.outcome === 'negative' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {interaction.outcome}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {interaction.followUpRequired ? (
                          <div className="text-sm text-gray-900">
                            <div className="font-medium">Required</div>
                            {interaction.followUpDate && (
                              <div className="text-xs text-gray-500">{interaction.followUpDate}</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">No</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button 
                          onClick={() => setSelectedInteraction(interaction)}
                          className="text-blue-600 hover:text-blue-900 cursor-pointer"
                        >
                          View
                        </button>
                        <button className="text-green-600 hover:text-green-900 cursor-pointer">
                          Edit
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

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Lifecycle</h3>
              <div className="space-y-4">
                {[
                  { stage: 'Lead', count: 15, color: 'bg-blue-500' },
                  { stage: 'Prospect', count: 8, color: 'bg-yellow-500' },
                  { stage: 'Customer', count: 5, color: 'bg-green-500' },
                  { stage: 'Advocate', count: 2, color: 'bg-purple-500' }
                ].map((stage) => {
                  const percentage = (stage.count / 30) * 100;
                  return (
                    <div key={stage.stage}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{stage.stage}</span>
                        <span>{stage.count} customers ({percentage.toFixed(1)}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${stage.color} h-2 rounded-full`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Segment</h3>
              <div className="space-y-4">
                {[
                  { segment: 'VIP', revenue: 2850.75, color: 'bg-purple-500' },
                  { segment: 'Regular', revenue: 1950.50, color: 'bg-green-500' },
                  { segment: 'New', revenue: 330.75, color: 'bg-blue-500' },
                  { segment: 'Inactive', revenue: 19.99, color: 'bg-gray-500' }
                ].map((item) => {
                  const total = 5151.99;
                  const percentage = (item.revenue / total) * 100;
                  return (
                    <div key={item.segment}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{item.segment}</span>
                        <span>${item.revenue.toFixed(2)} ({percentage.toFixed(1)}%)</span>
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

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Satisfaction Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">4.8</div>
                <div className="text-sm text-gray-500">Average Rating</div>
                <div className="flex justify-center mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i key={star} className={`ri-star-${star <= 4 ? 'fill' : 'line'} text-yellow-400`}></i>
                  ))}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">92%</div>
                <div className="text-sm text-gray-500">Customer Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">78%</div>
                <div className="text-sm text-gray-500">Net Promoter Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">85%</div>
                <div className="text-sm text-gray-500">Retention Rate</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Marketing Campaigns</h3>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap">
              <i className="ri-add-line mr-2"></i>Create Campaign
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Active Campaigns</h4>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium text-gray-900">VIP Customer Rewards</h5>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Exclusive discounts and early access for VIP customers</p>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Sent: 1 customer</span>
                    <span>Open Rate: 95%</span>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium text-gray-900">Win-Back Campaign</h5>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Running
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Re-engage inactive customers with special offers</p>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Sent: 1 customer</span>
                    <span>Open Rate: 15%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Campaign Performance</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">2</div>
                    <div className="text-sm text-blue-600">Active Campaigns</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">55%</div>
                    <div className="text-sm text-green-600">Avg Open Rate</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">12%</div>
                    <div className="text-sm text-purple-600">Click Through Rate</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">8%</div>
                    <div className="text-sm text-orange-600">Conversion Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-0 w-full max-w-6xl max-h-[95vh] overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 text-white">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-full overflow-hidden mr-4 bg-white/20 flex items-center justify-center">
                    {selectedCustomer.avatar ? (
                      <img 
                        src={selectedCustomer.avatar} 
                        alt={selectedCustomer.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <i className="ri-user-line text-2xl text-white"></i>
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{selectedCustomer.name}</h3>
                    <p className="text-green-100 mt-1">
                      {selectedCustomer.company || 'Individual Customer'} • 
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getSegmentColor(selectedCustomer.customerSegment)}`}>
                        {selectedCustomer.customerSegment.toUpperCase()}
                      </span>
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedCustomer(null)}
                  className="text-white hover:text-gray-200 cursor-pointer"
                >
                  <i className="ri-close-line w-8 h-8 flex items-center justify-center"></i>
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(95vh-100px)]">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Customer Info */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-gray-500">Email</p>
                        <p className="font-medium">{selectedCustomer.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Phone</p>
                        <p className="font-medium">{selectedCustomer.phone}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Address</p>
                        <p className="font-medium">
                          {selectedCustomer.address}<br/>
                          {selectedCustomer.city}, {selectedCustomer.state} {selectedCustomer.zipCode}<br/>
                          {selectedCustomer.country}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Preferred Communication</p>
                        <p className="font-medium capitalize">
                          <i className={`ri-${selectedCustomer.communicationPreference === 'email' ? 'mail' : selectedCustomer.communicationPreference === 'phone' ? 'phone' : 'message'}-line mr-2`}></i>
                          {selectedCustomer.communicationPreference}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Customer Metrics</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Lead Score:</span>
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className={`h-2 rounded-full ${
                                (selectedCustomer.leadScore || 0) >= 80 ? 'bg-green-600' :
                                (selectedCustomer.leadScore || 0) >= 60 ? 'bg-yellow-600' :
                                (selectedCustomer.leadScore || 0) >= 40 ? 'bg-orange-600' : 'bg-red-600'
                              }`}
                              style={{ width: `${selectedCustomer.leadScore || 0}%` }}
                            ></div>
                          </div>
                          <span className="font-medium">{selectedCustomer.leadScore || 0}</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Lifetime Value:</span>
                        <span className="font-medium">${selectedCustomer.lifetimeValue.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Avg Order Value:</span>
                        <span className="font-medium">${selectedCustomer.averageOrderValue.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Order Frequency:</span>
                        <span className="font-medium">{selectedCustomer.orderFrequency}/month</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Loyalty Points:</span>
                        <span className="font-medium">{selectedCustomer.loyaltyPoints}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Purchase History & Interactions */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Purchase Summary */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Purchase Summary</h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{selectedCustomer.totalOrders}</div>
                        <div className="text-sm text-gray-500">Total Orders</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">${selectedCustomer.totalSpent.toFixed(2)}</div>
                        <div className="text-sm text-gray-500">Total Spent</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">{selectedCustomer.lastOrderDate}</div>
                        <div className="text-sm text-gray-500">Last Order</div>
                      </div>
                    </div>
                  </div>

                  {/* Preferred Products */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Preferred Products</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCustomer.preferredProducts.map((product, index) => (
                        <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                          {product}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Customer Tags */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Tags & Characteristics</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCustomer.tags.map((tag, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Recent Interactions */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Interactions</h4>
                    <div className="space-y-3">
                      {getCustomerInteractions(selectedCustomer.id).slice(0, 3).map((interaction) => (
                        <div key={interaction.id} className="bg-white p-3 rounded border">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <i className={`${getInteractionTypeIcon(interaction.type)} w-4 h-4 flex items-center justify-center text-gray-500 mr-2`}></i>
                              <span className="font-medium text-sm">{interaction.subject}</span>
                            </div>
                            <span className="text-xs text-gray-500">{interaction.date}</span>
                          </div>
                          <p className="text-sm text-gray-600">{interaction.details}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              interaction.outcome === 'positive' ? 'bg-green-100 text-green-800' :
                              interaction.outcome === 'negative' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {interaction.outcome}
                            </span>
                            <span className="text-xs text-gray-500">by {interaction.assignedTo}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Notes</h4>
                    <p className="text-gray-700">{selectedCustomer.notes}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap gap-3 pt-6 border-t">
                <button
                  onClick={() => {
                    setSelectedCustomer(null);
                    setEditingCustomer(selectedCustomer);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-edit-line mr-2"></i>Edit Customer
                </button>
                <button
                  onClick={() => setShowInteractionModal(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-add-line mr-2"></i>Add Interaction
                </button>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors cursor-pointer whitespace-nowrap">
                  <i className="ri-mail-line mr-2"></i>Send Email
                </button>
                <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors cursor-pointer whitespace-nowrap">
                  <i className="ri-phone-line mr-2"></i>Schedule Call
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Customer Modal */}
      {(showAddCustomer || editingCustomer) && (
        <CustomerForm
          customer={editingCustomer || undefined}
          onSubmit={(customer) => {
            if (editingCustomer && 'id' in customer) {
              handleUpdateCustomer(customer as Customer);
            } else {
              handleAddCustomer(customer as Omit<Customer, 'id'>);
            }
          }}
          onCancel={() => {
            setShowAddCustomer(false);
            setEditingCustomer(null);
          }}
        />
      )}

      {/* Add Interaction Modal */}
      {showInteractionModal && (
        <InteractionForm
          customers={customers}
          onSubmit={handleAddInteraction}
          onCancel={() => setShowInteractionModal(false)}
        />
      )}
    </div>
  );
}

// Customer Form Component
interface CustomerFormProps {
  customer?: Customer;
  onSubmit: (customer: Customer | Omit<Customer, 'id'>) => void;
  onCancel: () => void;
}

function CustomerForm({ customer, onSubmit, onCancel }: CustomerFormProps) {
  const [formData, setFormData] = useState<Omit<Customer, 'id'>>({
    name: customer?.name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    company: customer?.company || '',
    address: customer?.address || '',
    city: customer?.city || '',
    state: customer?.state || '',
    zipCode: customer?.zipCode || '',
    country: customer?.country || 'USA',
    totalOrders: customer?.totalOrders || 0,
    totalSpent: customer?.totalSpent || 0,
    lastOrderDate: customer?.lastOrderDate || '',
    status: customer?.status || 'active',
    customerSegment: customer?.customerSegment || 'new',
    joinedDate: customer?.joinedDate || new Date().toISOString().split('T')[0],
    preferredProducts: customer?.preferredProducts || [],
    loyaltyPoints: customer?.loyaltyPoints || 0,
    source: customer?.source || 'website',
    tags: customer?.tags || [],
    notes: customer?.notes || '',
    lifetimeValue: customer?.lifetimeValue || 0,
    averageOrderValue: customer?.averageOrderValue || 0,
    orderFrequency: customer?.orderFrequency || 0,
    communicationPreference: customer?.communicationPreference || 'email',
    leadScore: customer?.leadScore || 50
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customer) {
      onSubmit({ ...formData, id: customer.id });
    } else {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            {customer ? 'Edit Customer' : 'Add New Customer'}
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
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8"
                >
                  <option value="USA">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="Mexico">Mexico</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Customer Details</h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Customer['status'] })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Segment</label>
                <select
                  value={formData.customerSegment}
                  onChange={(e) => setFormData({ ...formData, customerSegment: e.target.value as Customer['customerSegment'] })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8"
                >
                  <option value="new">New</option>
                  <option value="regular">Regular</option>
                  <option value="vip">VIP</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Communication Preference</label>
                <select
                  value={formData.communicationPreference}
                  onChange={(e) => setFormData({ ...formData, communicationPreference: e.target.value as Customer['communicationPreference'] })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8"
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="sms">SMS</option>
                  <option value="mail">Mail</option>
                </select>
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
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Additional notes about the customer..."
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
              {customer ? 'Update Customer' : 'Add Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Interaction Form Component
interface InteractionFormProps {
  customers: Customer[];
  onSubmit: (interaction: Omit<Interaction, 'id'>) => void;
  onCancel: () => void;
}

function InteractionForm({ customers, onSubmit, onCancel }: InteractionFormProps) {
  const [formData, setFormData] = useState<Omit<Interaction, 'id'>>({
    customerId: 0,
    type: 'call',
    date: new Date().toISOString().split('T')[0],
    subject: '',
    details: '',
    outcome: 'positive',
    followUpRequired: false,
    assignedTo: 'James Wilson'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Add Customer Interaction</h3>
          <button 
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <i className="ri-close-line w-6 h-6 flex items-center justify-center"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Customer *</label>
              <select
                required
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: parseInt(e.target.value) })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8"
              >
                <option value={0}>Select Customer</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>{customer.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interaction Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as Interaction['type'] })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8"
              >
                <option value="call">Phone Call</option>
                <option value="email">Email</option>
                <option value="meeting">Meeting</option>
                <option value="order">Order</option>
                <option value="complaint">Complaint</option>
                <option value="support">Support</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Outcome</label>
              <select
                value={formData.outcome}
                onChange={(e) => setFormData({ ...formData, outcome: e.target.value as Interaction['outcome'] })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8"
              >
                <option value="positive">Positive</option>
                <option value="neutral">Neutral</option>
                <option value="negative">Negative</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
            <input
              type="text"
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Brief subject of the interaction"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Details</label>
            <textarea
              rows={4}
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Detailed description of the interaction..."
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="followUpRequired"
              checked={formData.followUpRequired}
              onChange={(e) => setFormData({ ...formData, followUpRequired: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="followUpRequired" className="text-sm text-gray-700">
              Follow-up required
            </label>
          </div>

          {formData.followUpRequired && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Follow-up Date</label>
              <input
                type="date"
                value={formData.followUpDate || ''}
                onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          )}

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
              Add Interaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
