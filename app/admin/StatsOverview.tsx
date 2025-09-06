
'use client';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function StatsOverview() {
  const [showSalesDetail, setSalesDetail] = useState(false);
  const [showInventoryDetail, setInventoryDetail] = useState(false);
  const [showCustomerDetail, setCustomerDetail] = useState(false);

  const salesData = [
    { name: 'Jan', sales: 4000, orders: 24 },
    { name: 'Feb', sales: 3000, orders: 18 },
    { name: 'Mar', sales: 5000, orders: 32 },
    { name: 'Apr', sales: 4500, orders: 28 },
    { name: 'May', sales: 6000, orders: 35 },
    { name: 'Jun', sales: 5500, orders: 31 }
  ];

  const topProducts = [
    { name: 'African Bird\'s Eye', sales: 245, revenue: '$6,125' },
    { name: 'Thai Dragon', sales: 189, revenue: '$4,725' },
    { name: 'Habanero Mix', sales: 156, revenue: '$3,900' },
    { name: 'Scotch Bonnet', sales: 134, revenue: '$3,350' }
  ];

  const lowStockItems = [
    { name: 'Thai Dragon Chili', stock: 12, status: 'low' },
    { name: 'Carolina Reaper', stock: 8, status: 'critical' },
    { name: 'Scotch Bonnet', stock: 0, status: 'out' }
  ];

  const recentCustomers = [
    { name: 'Sarah Johnson', orders: 12, spent: '$1,248.50', status: 'active' },
    { name: 'Michael Chen', orders: 8, spent: '$856.25', status: 'active' },
    { name: 'Emma Wilson', orders: 15, spent: '$1,892.75', status: 'vip' }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">Welcome back! Here's what's happening with your farm today.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">$28,450</p>
              <p className="text-sm text-green-600">+12.5% from last month</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <i className="ri-money-dollar-circle-line w-8 h-8 flex items-center justify-center text-green-600"></i>
            </div>
          </div>
          <div className="mt-4">
            <button 
              onClick={() => setSalesDetail(true)}
              className="w-full mt-4 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 cursor-pointer whitespace-nowrap"
            >
              View Details
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900">168</p>
              <p className="text-sm text-green-600">+8.2% from last month</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <i className="ri-shopping-cart-line w-8 h-8 flex items-center justify-center text-blue-600"></i>
            </div>
          </div>
          <div className="mt-4">
            <button 
              onClick={() => setSalesDetail(true)}
              className="w-full mt-4 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 cursor-pointer whitespace-nowrap"
            >
              View Details
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Low Stock Items</p>
              <p className="text-3xl font-bold text-gray-900">3</p>
              <p className="text-sm text-red-600">Immediate attention needed</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <i className="ri-alert-line w-8 h-8 flex items-center justify-center text-red-600"></i>
            </div>
          </div>
          <div className="mt-4">
            <button 
              onClick={() => setInventoryDetail(true)}
              className="w-full mt-4 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 cursor-pointer whitespace-nowrap"
            >
              View Details
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Customers</p>
              <p className="text-3xl font-bold text-gray-900">342</p>
              <p className="text-sm text-green-600">+15.3% from last month</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <i className="ri-user-line w-8 h-8 flex items-center justify-center text-purple-600"></i>
            </div>
          </div>
          <div className="mt-4">
            <button 
              onClick={() => setCustomerDetail(true)}
              className="w-full mt-4 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 cursor-pointer whitespace-nowrap"
            >
              View Details
            </button>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#16a34a" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <i className="ri-shopping-cart-line w-4 h-4 flex items-center justify-center text-green-600 mr-2"></i>
              <span>New order #1247 received</span>
            </div>
            <div className="flex items-center text-sm">
              <i className="ri-alert-line w-4 h-4 flex items-center justify-center text-red-600 mr-2"></i>
              <span>Thai Dragon stock is low</span>
            </div>
            <div className="flex items-center text-sm">
              <i className="ri-user-add-line w-4 h-4 flex items-center justify-center text-blue-600 mr-2"></i>
              <span>3 new customers registered</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Tasks</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Process 5 pending orders</span>
              <button className="text-green-600 hover:text-green-800 cursor-pointer">Action</button>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Restock 3 products</span>
              <button className="text-green-600 hover:text-green-800 cursor-pointer">Action</button>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Update harvest schedule</span>
              <button className="text-green-600 hover:text-green-800 cursor-pointer">Action</button>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Farm Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Field A - Growing</span>
              <span className="text-green-600">85% Ready</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Field B - Harvesting</span>
              <span className="text-blue-600">In Progress</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Field C - Planting</span>
              <span className="text-yellow-600">Scheduled</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Detail Modal */}
      {showSalesDetail && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Sales & Revenue Details</h3>
              <button 
                onClick={() => setSalesDetail(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line w-6 h-6 flex items-center justify-center"></i>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">This Month Performance</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Revenue:</span>
                    <span className="font-bold">$28,450</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Orders:</span>
                    <span className="font-bold">168</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Order Value:</span>
                    <span className="font-bold">$169.35</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Growth Rate:</span>
                    <span className="font-bold text-green-600">+12.5%</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Top Performing Products</h4>
                <div className="space-y-2">
                  {topProducts.map((product, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-sm">{product.name}</span>
                      <span className="font-medium text-sm">{product.revenue}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-4">Monthly Sales Trend</h4>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="sales" stroke="#16a34a" strokeWidth={3} />
                  <Line type="monotone" dataKey="orders" stroke="#2563eb" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Key Insights</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• African Bird's Eye remains the top-selling product with 245 units sold</li>
                <li>• Average monthly growth rate of 12.5% shows strong business momentum</li>
                <li>• Peak sales occurred in May with $6,000 revenue</li>
                <li>• Customer retention rate is 87% this quarter</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Detail Modal */}
      {showInventoryDetail && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Inventory Alert Details</h3>
              <button 
                onClick={() => setInventoryDetail(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line w-6 h-6 flex items-center justify-center"></i>
              </button>
            </div>
            
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
              <h4 className="font-semibold text-red-900 mb-2">⚠️ Immediate Attention Required</h4>
              <p className="text-red-700 text-sm">3 products need restocking to maintain service levels</p>
            </div>

            <div className="space-y-4">
              {lowStockItems.map((item, index) => (
                <div key={index} className="bg-white border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-gray-900">{item.name}</h5>
                      <p className="text-sm text-gray-500">Current Stock: {item.stock} units</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        item.status === 'critical' ? 'bg-red-100 text-red-800' :
                        item.status === 'low' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.status === 'out' ? 'Out of Stock' : 
                         item.status === 'critical' ? 'Critical' : 'Low Stock'}
                      </span>
                      <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 cursor-pointer whitespace-nowrap">
                        Restock Now
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-3 bg-gray-50 p-3 rounded text-sm">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <span className="text-gray-500">Recommended:</span>
                        <span className="font-medium ml-1">50 units</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Lead Time:</span>
                        <span className="font-medium ml-1">3-5 days</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Priority:</span>
                        <span className={`font-medium ml-1 ${
                          item.status === 'out' || item.status === 'critical' ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                          {item.status === 'out' || item.status === 'critical' ? 'High' : 'Medium'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Inventory Management Tips</h4>
              <ul className="space-y-1 text-sm text-blue-700">
                <li>• Set up automatic reorder points to prevent stockouts</li>
                <li>• Monitor seasonal demand patterns for better planning</li>
                <li>• Consider bulk ordering for frequently sold items</li>
                <li>• Review supplier lead times regularly</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Customer Detail Modal */}
      {showCustomerDetail && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Customer Analytics</h3>
              <button 
                onClick={() => setCustomerDetail(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line w-6 h-6 flex items-center justify-center"></i>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <i className="ri-user-line w-8 h-8 flex items-center justify-center text-purple-600 mx-auto mb-2"></i>
                <h4 className="font-semibold text-purple-900">Total Customers</h4>
                <p className="text-2xl font-bold text-purple-600">342</p>
                <p className="text-sm text-purple-600">+15.3% growth</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <i className="ri-vip-crown-line w-8 h-8 flex items-center justify-center text-green-600 mx-auto mb-2"></i>
                <h4 className="font-semibold text-green-900">VIP Customers</h4>
                <p className="text-2xl font-bold text-green-600">28</p>
                <p className="text-sm text-green-600">8.2% of total</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <i className="ri-user-add-line w-8 h-8 flex items-center justify-center text-blue-600 mx-auto mb-2"></i>
                <h4 className="font-semibold text-blue-900">New This Month</h4>
                <p className="text-2xl font-bold text-blue-600">47</p>
                <p className="text-sm text-blue-600">13.7% of total</p>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-4">Top Customers</h4>
              <div className="bg-white border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Spent</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentCustomers.map((customer, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{customer.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{customer.orders}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{customer.spent}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            customer.status === 'vip' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {customer.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Customer Insights</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Average customer lifetime value: $847</li>
                  <li>• Customer retention rate: 87%</li>
                  <li>• Average orders per customer: 6.2</li>
                  <li>• Most popular product: African Bird's Eye</li>
                </ul>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-900 mb-2">Action Items</h4>
                <ul className="space-y-1 text-sm text-orange-700">
                  <li>• Follow up with 12 inactive customers</li>
                  <li>• Send thank you notes to VIP customers</li>
                  <li>• Create loyalty program for repeat buyers</li>
                  <li>• Survey customers for product feedback</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
