'use client';
import { useState } from 'react';

// Mock current user - in real app, this would come from authentication context
const currentUser = {
  id: 4,
  role: 'sales',
  permissions: ['orders_modify', 'customers_manage', 'inventory_view', 'prices_update', 'reports_sales']
};

export default function OrdersManager() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState('all');

  // Check if user has permission
  const hasPermission = (permission: string) => {
    return currentUser.permissions.includes('*') || currentUser.permissions.includes(permission);
  };

  const orders = [
    {
      id: '#1247',
      customer: 'Sarah Johnson',
      email: 'sarah@email.com',
      date: '2024-01-15',
      total: '$128.50',
      status: 'pending',
      items: [
        { name: 'Bird\'s Eye Chili', quantity: 2, price: '$24.50' },
        { name: 'Thai Dragon', quantity: 1, price: '$32.00' }
      ]
    },
    {
      id: '#1246',
      customer: 'Michael Chen',
      email: 'michael@email.com',
      date: '2024-01-14',
      total: '$85.00',
      status: 'shipped',
      items: [
        { name: 'Habanero Mix', quantity: 3, price: '$45.00' },
        { name: 'Scotch Bonnet', quantity: 1, price: '$28.00' }
      ]
    },
    {
      id: '#1245',
      customer: 'Emma Wilson',
      email: 'emma@email.com',
      date: '2024-01-13',
      total: '$156.75',
      status: 'delivered',
      items: [
        { name: 'Premium Mix Pack', quantity: 2, price: '$78.50' }
      ]
    },
    {
      id: '#1244',
      customer: 'David Brown',
      email: 'david@email.com',
      date: '2024-01-12',
      total: '$92.25',
      status: 'processing',
      items: [
        { name: 'Bird\'s Eye Chili', quantity: 4, price: '$48.00' },
        { name: 'Carolina Reaper', quantity: 1, price: '$35.00' }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    if (!hasPermission('orders_modify')) {
      alert('You do not have permission to modify orders');
      return;
    }
    console.log(`Updating order ${orderId} to ${newStatus}`);
  };

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Orders Management</h2>
          {currentUser.role === 'sales' && (
            <p className="text-sm text-gray-600 mt-1">Sales Representative - Order Management Access</p>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 pr-8"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
          {hasPermission('orders_modify') && (
            <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 cursor-pointer whitespace-nowrap">
              <i className="ri-add-line mr-2 inline-block"></i>New Order
            </button>
          )}
        </div>
      </div>

      {/* Permission Notice */}
      {!hasPermission('orders_modify') && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <i className="ri-information-line w-5 h-5 flex items-center justify-center text-yellow-600 mr-3"></i>
            <div>
              <p className="text-sm font-medium text-yellow-800">Limited Access</p>
              <p className="text-sm text-yellow-700">You have view-only access to orders. Contact an administrator to modify orders.</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                    <div className="text-sm text-gray-500">{order.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order.total}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <button 
                    onClick={() => setSelectedOrder(order)}
                    className="text-green-600 hover:text-green-900 cursor-pointer"
                  >
                    View
                  </button>
                  {hasPermission('orders_modify') ? (
                    <select 
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="text-xs border border-gray-300 rounded px-2 py-1 pr-8"
                      defaultValue={order.status}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  ) : (
                    <span className="text-xs text-gray-400 px-2 py-1 bg-gray-100 rounded">
                      View Only
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold">Order Details {selectedOrder.id}</h3>
                {hasPermission('orders_modify') && (
                  <p className="text-sm text-green-600">✓ You can modify this order</p>
                )}
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line w-6 h-6 flex items-center justify-center"></i>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="font-medium">{selectedOrder.customer}</p>
                  <p className="text-sm text-gray-500">{selectedOrder.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="font-medium">{selectedOrder.date}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-2">Items</p>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                        {hasPermission('orders_modify') && (
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item: any, index: number) => (
                        <tr key={index} className="border-t">
                          <td className="px-4 py-2">{item.name}</td>
                          <td className="px-4 py-2">{item.quantity}</td>
                          <td className="px-4 py-2 font-medium">{item.price}</td>
                          {hasPermission('orders_modify') && (
                            <td className="px-4 py-2">
                              <button className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer">
                                Edit
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="text-right mt-2">
                  <p className="text-lg font-bold">Total: {selectedOrder.total}</p>
                </div>
              </div>

              {hasPermission('orders_modify') && (
                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <button className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 cursor-pointer whitespace-nowrap">
                    Print Invoice
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer whitespace-nowrap">
                    Edit Order
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer whitespace-nowrap">
                    Update Status
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}