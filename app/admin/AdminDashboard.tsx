'use client';
import { useState } from 'react';
import OrdersManager from './OrdersManager';
import FarmManager from './FarmManager';
import InventoryManager from './InventoryManager';
import CustomersManager from './CustomersManager';
import StatsOverview from './StatsOverview';
import FinanceManager from './FinanceManager';
import UserManager from './UserManager';
import ContractManager from './ContractManager';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', name: 'Overview', icon: 'ri-dashboard-line' },
    { id: 'orders', name: 'Orders', icon: 'ri-shopping-cart-line' },
    { id: 'inventory', name: 'Inventory', icon: 'ri-archive-line' },
    { id: 'farm', name: 'Farm Management', icon: 'ri-plant-line' },
    { id: 'contracts', name: 'Contracts', icon: 'ri-file-text-line' },
    { id: 'finance', name: 'Finance', icon: 'ri-money-dollar-circle-line' },
    { id: 'users', name: 'Users & HR', icon: 'ri-team-line' },
    { id: 'customers', name: 'Customers', icon: 'ri-user-line' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <StatsOverview />;
      case 'orders':
        return <OrdersManager />;
      case 'inventory':
        return <InventoryManager />;
      case 'farm':
        return <FarmManager />;
      case 'contracts':
        return <ContractManager />;
      case 'finance':
        return <FinanceManager />;
      case 'users':
        return <UserManager />;
      case 'customers':
        return <CustomersManager />;
      default:
        return <StatsOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Pacho Farm Admin</h1>
            <div className="flex items-center space-x-4">
              <span suppressHydrationWarning={true} className="text-sm text-gray-500">
                {new Date().toLocaleDateString()}
              </span>
              <button className="text-red-600 hover:text-red-800 cursor-pointer">
                <i className="ri-logout-box-line w-5 h-5 flex items-center justify-center"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="mt-8">
            <div className="px-2 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full group flex items-center px-2 py-3 text-sm font-medium rounded-md cursor-pointer whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-green-100 text-green-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <i className={`${tab.icon} w-5 h-5 flex items-center justify-center mr-3`}></i>
                  {tab.name}
                </button>
              ))}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}