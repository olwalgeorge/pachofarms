
'use client';
import { useState } from 'react';

export default function InventoryManager() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const inventory = [
    {
      id: 1,
      name: 'African Bird\'s Eye Chili',
      sku: 'ABE-001',
      stock: 45,
      price: '$24.50',
      cost: '$12.00',
      category: 'African Varieties',
      status: 'in-stock',
      lastUpdated: '2024-01-15'
    },
    {
      id: 2,
      name: 'Thai Dragon Chili',
      sku: 'TDR-002',
      stock: 12,
      price: '$32.00',
      cost: '$16.50',
      category: 'Asian Varieties',
      status: 'low-stock',
      lastUpdated: '2024-01-14'
    },
    {
      id: 3,
      name: 'Habanero Mix',
      sku: 'HAB-003',
      stock: 67,
      price: '$28.75',
      cost: '$14.20',
      category: 'Caribbean Varieties',
      status: 'in-stock',
      lastUpdated: '2024-01-13'
    },
    {
      id: 4,
      name: 'Scotch Bonnet',
      sku: 'SCB-004',
      stock: 0,
      price: '$35.00',
      cost: '$18.00',
      category: 'Caribbean Varieties',
      status: 'out-of-stock',
      lastUpdated: '2024-01-10'
    },
    {
      id: 5,
      name: 'Carolina Reaper',
      sku: 'CAR-005',
      stock: 8,
      price: '$45.00',
      cost: '$22.50',
      category: 'Super Hot',
      status: 'critical',
      lastUpdated: '2024-01-12'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock': return 'bg-green-100 text-green-800';
      case 'low-stock': return 'bg-yellow-100 text-yellow-800';
      case 'out-of-stock': return 'bg-red-100 text-red-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return 'out-of-stock';
    if (stock <= 10) return stock <= 5 ? 'critical' : 'low-stock';
    return 'in-stock';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 cursor-pointer whitespace-nowrap"
        >
          <i className="ri-add-line w-4 h-4 flex items-center justify-center mr-2"></i>
          Add Product
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <i className="ri-archive-line w-8 h-8 flex items-center justify-center text-blue-600 mr-3"></i>
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{inventory.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <i className="ri-check-line w-8 h-8 flex items-center justify-center text-green-600 mr-3"></i>
            <div>
              <p className="text-sm text-gray-500">In Stock</p>
              <p className="text-2xl font-bold text-gray-900">
                {inventory.filter(item => item.status === 'in-stock').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <i className="ri-alert-line w-8 h-8 flex items-center justify-center text-yellow-600 mr-3"></i>
            <div>
              <p className="text-sm text-gray-500">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900">
                {inventory.filter(item => item.status === 'low-stock' || item.status === 'critical').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <i className="ri-close-line w-8 h-8 flex items-center justify-center text-red-600 mr-3"></i>
            <div>
              <p className="text-sm text-gray-500">Out of Stock</p>
              <p className="text-2xl font-bold text-gray-900">
                {inventory.filter(item => item.status === 'out-of-stock').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inventory.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    <div className="text-sm text-gray-500">{item.category}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.sku}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <span className="mr-2">{item.stock}</span>
                    {item.stock <= 10 && (
                      <i className="ri-alert-line w-4 h-4 flex items-center justify-center text-red-500"></i>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>
                    <div className="font-medium">{item.price}</div>
                    <div className="text-xs text-gray-500">Cost: {item.cost}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                    {item.status.replace('-', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <button 
                    onClick={() => setEditingItem(item)}
                    className="text-blue-600 hover:text-blue-900 cursor-pointer"
                  >
                    Edit
                  </button>
                  <button className="text-green-600 hover:text-green-900 cursor-pointer">
                    Restock
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Product Modal */}
      {(showAddForm || editingItem) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingItem ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button 
                onClick={() => {
                  setShowAddForm(false);
                  setEditingItem(null);
                }}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line w-6 h-6 flex items-center justify-center"></i>
              </button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  defaultValue={editingItem?.name || ''}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    defaultValue={editingItem?.sku || ''}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    defaultValue={editingItem?.stock || ''}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    defaultValue={editingItem?.price || ''}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cost</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    defaultValue={editingItem?.cost || ''}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 pr-8">
                  <option>African Varieties</option>
                  <option>Asian Varieties</option>
                  <option>Caribbean Varieties</option>
                  <option>Super Hot</option>
                  <option>Specialty Mix</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 cursor-pointer whitespace-nowrap"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer whitespace-nowrap"
                >
                  {editingItem ? 'Update' : 'Add'} Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
