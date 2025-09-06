'use client';
import { useState, useEffect } from 'react';

// Mock current user - in real app, this would come from authentication context
const currentUser = {
  id: 5,
  role: 'accountant',
  permissions: [
    'finance_manage',
    'payroll_manage', 
    'expenses_manage',
    'budgets_manage',
    'reports_financial'
  ]
};

interface Budget {
  id: number;
  category: string;
  allocated: number;
  spent: number;
  remaining: number;
  period: string;
  status: 'on-track' | 'warning' | 'over-budget';
}

interface Supplier {
  id: number;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  status: 'active' | 'inactive';
  paymentTerms: string;
  notes: string;
}

interface Receipt {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadDate: string;
  url?: string;
}

interface Expense {
  id: number;
  date: string;
  category: string;
  description: string;
  amount: number;
  type: 'operational' | 'capital' | 'maintenance' | 'supplies' | 'transport';
  supplier: string;
  paymentMethod: string;
  status: 'paid' | 'pending' | 'overdue';
  invoiceNumber?: string;
  dueDate?: string;
  receipts: Receipt[];
}

interface ProcurementItem {
  id: number;
  itemName: string;
  category: string;
  supplier: string;
  requestedBy: string;
  requestDate: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  status: 'requested' | 'approved' | 'ordered' | 'received' | 'rejected';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  deliveryDate?: string;
  notes: string;
}

interface CostAnalysis {
  category: string;
  currentMonth: number;
  lastMonth: number;
  yearToDate: number;
  budgetVariance: number;
}

interface ExpenseFormProps {
  onSubmit: (expense: Omit<Expense, 'id'>) => void;
  onCancel: () => void;
  budgets: Budget[];
  suppliers: Supplier[];
}

interface SupplierFormProps {
  supplier?: Supplier;
  onSubmit: (supplier: Supplier | Omit<Supplier, 'id'>) => void;
  onCancel: () => void;
}

// Camera Modal Component
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
        video: { facingMode: 'environment' } // Use rear camera on mobile
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

  // Start camera when component mounts
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [videoRef]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Take Receipt Photo</h3>
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
              Position the receipt clearly in the frame and tap the camera button
            </p>
          </div>
        )}

        <canvas ref={setCanvasRef} className="hidden" />
      </div>
    </div>
  );
}

function SupplierForm({ supplier, onSubmit, onCancel }: SupplierFormProps) {
  const [formData, setFormData] = useState({
    name: supplier?.name || '',
    contactPerson: supplier?.contactPerson || '',
    email: supplier?.email || '',
    phone: supplier?.phone || '',
    address: supplier?.address || '',
    category: supplier?.category || 'General',
    status: supplier?.status || 'active' as 'active' | 'inactive',
    paymentTerms: supplier?.paymentTerms || 'Net 30',
    notes: supplier?.notes || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Supplier name is required';
    if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact person is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (supplier) {
      onSubmit({ ...formData, id: supplier.id });
    } else {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Supplier Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.name ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter supplier/vendor name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Person *
          </label>
          <input
            type="text"
            required
            value={formData.contactPerson}
            onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.contactPerson ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Primary contact person"
          />
          {errors.contactPerson && <p className="text-red-500 text-sm mt-1">{errors.contactPerson}</p>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="supplier@example.com"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone *
          </label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.phone ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Phone number"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address
        </label>
        <textarea
          rows={3}
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Complete address"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8"
          >
            <option value="General">General</option>
            <option value="Seeds & Planting">Seeds & Planting</option>
            <option value="Equipment">Equipment</option>
            <option value="Chemicals">Chemicals</option>
            <option value="Transport">Transport</option>
            <option value="Utilities">Utilities</option>
            <option value="Services">Services</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Terms
          </label>
          <select
            value={formData.paymentTerms}
            onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8"
          >
            <option value="Net 15">Net 15</option>
            <option value="Net 30">Net 30</option>
            <option value="Net 60">Net 60</option>
            <option value="COD">Cash on Delivery</option>
            <option value="Prepaid">Prepaid</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes
        </label>
        <textarea
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Additional notes about the supplier..."
        />
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className="ri-save-line mr-2"></i>{supplier ? 'Update Supplier' : 'Add Supplier'}
        </button>
      </div>
    </form>
  );
}

function ExpenseForm({ onSubmit, onCancel, budgets, suppliers }: ExpenseFormProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: '',
    description: '',
    amount: '',
    type: 'operational' as 'operational' | 'capital' | 'maintenance' | 'supplies' | 'transport',
    supplier: '',
    paymentMethod: 'Bank Transfer',
    status: 'pending' as 'paid' | 'pending' | 'overdue',
    invoiceNumber: '',
    dueDate: ''
  });

  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categoryOptions = budgets.map(budget => budget.category);

  // Filter suppliers by status and category
  const activeSuppliers = suppliers.filter(supplier => supplier.status === 'active');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'Valid amount is required';
    if (!formData.supplier.trim()) newErrors.supplier = 'Supplier is required';
    if (formData.status !== 'paid' && !formData.dueDate) newErrors.dueDate = 'Due date is required for pending/overdue expenses';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        return;
      }

      if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
        alert(`File ${file.name} is not supported. Please upload images or PDF files only.`);
        return;
      }

      const receipt: Receipt = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        uploadDate: new Date().toISOString(),
        url: URL.createObjectURL(file)
      };

      setReceipts(prev => [...prev, receipt]);
    });

    // Clear the input
    event.target.value = '';
  };

  const handleCameraCapture = () => {
    setShowCamera(true);
  };

  const handleCameraPhoto = (photoBlob: Blob) => {
    const receipt: Receipt = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      fileName: `receipt_${new Date().toISOString().split('T')[0]}.jpg`,
      fileSize: photoBlob.size,
      fileType: 'image/jpeg',
      uploadDate: new Date().toISOString(),
      url: URL.createObjectURL(photoBlob)
    };

    setReceipts(prev => [...prev, receipt]);
    setShowCamera(false);
  };

  const removeReceipt = (receiptId: string) => {
    setReceipts(prev => {
      const receipt = prev.find(r => r.id === receiptId);
      if (receipt?.url) {
        URL.revokeObjectURL(receipt.url);
      }
      return prev.filter(r => r.id !== receiptId);
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    onSubmit({
      date: formData.date,
      category: formData.category,
      description: formData.description,
      amount: parseFloat(formData.amount),
      type: formData.type,
      supplier: formData.supplier,
      paymentMethod: formData.paymentMethod,
      status: formData.status,
      invoiceNumber: formData.invoiceNumber || undefined,
      dueDate: formData.dueDate || undefined,
      receipts: receipts
    });
  };

  const handleCategoryChange = (category: string) => {
    setFormData({ ...formData, category });
    
    // Auto-set type based on category
    if (category.includes('Transport')) {
      setFormData(prev => ({ ...prev, category, type: 'transport' }));
    } else if (category.includes('Equipment') || category.includes('Maintenance')) {
      setFormData(prev => ({ ...prev, category, type: 'maintenance' }));
    } else if (category.includes('Seeds') || category.includes('Fertilizers')) {
      setFormData(prev => ({ ...prev, category, type: 'supplies' }));
    } else {
      setFormData(prev => ({ ...prev, category, type: 'operational' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expense Date *
          </label>
          <input
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            required
            value={formData.category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8 ${
              errors.category ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select Category</option>
            {categoryOptions.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <input
          type="text"
          required
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
            errors.description ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Enter detailed description of the expense"
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount ($) *
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            required
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.amount ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="0.00"
          />
          {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expense Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8"
          >
            <option value="operational">Operational</option>
            <option value="capital">Capital</option>
            <option value="maintenance">Maintenance</option>
            <option value="supplies">Supplies</option>
            <option value="transport">Transport</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Supplier/Vendor *
        </label>
        <div className="flex space-x-2">
          <select
            required
            value={formData.supplier}
            onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
            className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8 ${
              errors.supplier ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select Supplier</option>
            {activeSuppliers.map(supplier => (
              <option key={supplier.id} value={supplier.name}>
                {supplier.name} - {supplier.category}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => {/* Open supplier management modal */}}
            className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors cursor-pointer whitespace-nowrap"
            title="Manage Suppliers"
          >
            <i className="ri-settings-line"></i>
          </button>
        </div>
        {errors.supplier && <p className="text-red-500 text-sm mt-1">{errors.supplier}</p>}
        <p className="text-xs text-gray-500 mt-1">
          Select from registered suppliers or add new suppliers in supplier management
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Method
          </label>
          <select
            value={formData.paymentMethod}
            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8"
          >
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Cash">Cash</option>
            <option value="Check">Check</option>
            <option value="Auto-pay">Auto-pay</option>
            <option value="Mobile Payment">Mobile Payment</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8"
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Invoice Number
          </label>
          <input
            type="text"
            value={formData.invoiceNumber}
            onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Optional invoice number"
          />
        </div>

        {(formData.status as string) !== 'paid' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date {(formData.status as string) !== 'paid' && '*'}
            </label>
            <input
              type="date"
              required={(formData.status as string) !== 'paid'}
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.dueDate ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>}
          </div>
        )}
      </div>

      {/* Receipt Upload Section */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Receipt & Documentation</h4>
        
        <div className="flex flex-wrap gap-3 mb-4">
          <label className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap">
            <i className="ri-upload-line mr-2"></i>Upload Files
            <input
              type="file"
              multiple
              accept="image/*,application/pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          
          <button
            type="button"
            onClick={handleCameraCapture}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-camera-line mr-2"></i>Take Photo
          </button>
        </div>

        <p className="text-xs text-gray-500 mb-4">
          Supported formats: JPG, PNG, PDF • Maximum file size: 10MB per file
        </p>

        {/* Receipt List */}
        {receipts.length > 0 && (
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-gray-700">Attached Receipts ({receipts.length})</h5>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {receipts.map((receipt) => (
                <div key={receipt.id} className="flex items-center justify-between bg-white p-3 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {receipt.fileType.startsWith('image/') ? (
                        <i className="ri-image-line text-green-600 text-lg"></i>
                      ) : (
                        <i className="ri-file-pdf-line text-red-600 text-lg"></i>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {receipt.fileName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(receipt.fileSize)} • {new Date(receipt.uploadDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {receipt.url && (
                      <button
                        type="button"
                        onClick={() => window.open(receipt.url, '_blank')}
                        className="text-blue-600 hover:text-blue-800 cursor-pointer"
                        title="Preview"
                      >
                        <i className="ri-eye-line"></i>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeReceipt(receipt.id)}
                      className="text-red-600 hover:text-red-800 cursor-pointer"
                      title="Remove"
                    >
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Budget Impact Preview */}
      {formData.category && formData.amount && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Budget Impact</h4>
          {(() => {
            const budget = budgets.find(b => b.category === formData.category);
            if (!budget) return <p className="text-sm text-blue-700">Category not found in budget</p>;
            
            const newSpent = budget.spent + parseFloat(formData.amount);
            const newRemaining = budget.allocated - newSpent;
            const percentUsed = (newSpent / budget.allocated) * 100;
            
            return (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-700">Current Spent:</span>
                  <span className="font-medium">${budget.spent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-700">After This Expense:</span>
                  <span className="font-medium">${newSpent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-700">Remaining Budget:</span>
                  <span className={`font-medium ${newRemaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    ${Math.abs(newRemaining).toLocaleString()} {newRemaining < 0 ? 'over budget' : 'remaining'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                  <div 
                    className={`h-2 rounded-full ${
                      percentUsed > 100 ? 'bg-red-500' : 
                      percentUsed > 80 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(percentUsed, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  {percentUsed.toFixed(1)}% of budget will be used
                </p>
              </div>
            );
          })()}
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-6 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className="ri-save-line mr-2"></i>Record Expense
        </button>
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <CameraModal
          onCapture={handleCameraPhoto}
          onClose={() => setShowCamera(false)}
        />
      )}
    </form>
  );
}

interface LaborCost {
  id: number;
  workerName: string;
  workType: string;
  paymentType: 'hourly' | 'daily' | 'piecemeal' | 'seasonal' | 'contract';
  rate: number;
  unit: string;
  quantity: number;
  totalAmount: number;
  date: string;
  field: string;
  task: string;
  hoursWorked?: number;
  piecesCompleted?: number;
  notes: string;
  status: 'pending' | 'approved' | 'paid';
}

interface LaborFormProps {
  onSubmit: (laborData: Omit<LaborCost, 'id'>) => void;
  onCancel: () => void;
}

function LaborForm({ onSubmit, onCancel }: LaborFormProps) {
  const [formData, setFormData] = useState({
    workerName: '',
    workType: 'Harvesting',
    paymentType: 'hourly' as 'hourly' | 'daily' | 'piecemeal' | 'seasonal' | 'contract',
    rate: '',
    unit: 'hours',
    quantity: '',
    date: new Date().toISOString().split('T')[0],
    field: '',
    task: '',
    notes: '',
    status: 'pending' as 'pending' | 'approved' | 'paid'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const paymentTypeOptions = [
    { value: 'hourly', label: 'Hourly Rate', defaultUnit: 'hours', rateRange: '$15-25/hour' },
    { value: 'daily', label: 'Daily Rate', defaultUnit: 'days', rateRange: '$120/day' },
    { value: 'piecemeal', label: 'Piecemeal', defaultUnit: 'kg', rateRange: '$0.50/kg' },
    { value: 'seasonal', label: 'Seasonal Contract', defaultUnit: 'season', rateRange: '$8500/season' },
    { value: 'contract', label: 'Project Contract', defaultUnit: 'project', rateRange: '$2500/project' }
  ];

  const unitOptions = {
    hourly: ['hours'],
    daily: ['days'],
    piecemeal: ['kg', 'pounds', 'boxes', 'bags', 'plants', 'rows', 'acres'],
    seasonal: ['season'],
    contract: ['project']
  };

  const workTypeOptions = [
    'Harvesting', 'Planting', 'Weeding', 'Irrigation', 'Spraying',
    'Packaging', 'Equipment Operation', 'General Maintenance', 'Field Preparation'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.workerName.trim()) newErrors.workerName = 'Worker name is required';
    if (!formData.rate || parseFloat(formData.rate) <= 0) newErrors.rate = 'Valid rate is required';
    if (!formData.quantity || parseFloat(formData.quantity) <= 0) newErrors.quantity = 'Valid quantity is required';
    if (!formData.field.trim()) newErrors.field = 'Field/location is required';
    if (!formData.task.trim()) newErrors.task = 'Task description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePaymentTypeChange = (paymentType: string) => {
    const option = paymentTypeOptions.find(opt => opt.value === paymentType);
    setFormData(prev => ({
      ...prev,
      paymentType: paymentType as any,
      unit: option?.defaultUnit || 'hours',
      rate: ''
    }));
  };

  const calculateTotal = () => {
    const rate = parseFloat(formData.rate) || 0;
    const quantity = parseFloat(formData.quantity) || 0;
    return rate * quantity;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const laborData = {
      ...formData,
      rate: parseFloat(formData.rate),
      quantity: parseFloat(formData.quantity),
      totalAmount: calculateTotal(),
      hoursWorked: formData.paymentType === 'hourly' || formData.paymentType === 'daily' ? parseFloat(formData.quantity) : undefined,
      piecesCompleted: formData.paymentType === 'piecemeal' ? parseFloat(formData.quantity) : undefined
    };

    onSubmit(laborData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Worker Name *
          </label>
          <input
            type="text"
            required
            value={formData.workerName}
            onChange={(e) => setFormData({ ...formData, workerName: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.workerName ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter worker name"
          />
          {errors.workerName && <p className="text-red-500 text-sm mt-1">{errors.workerName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Work Type
          </label>
          <select
            value={formData.workType}
            onChange={(e) => setFormData({ ...formData, workType: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8"
          >
            {workTypeOptions.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Payment Type *
        </label>
        <div className="grid md:grid-cols-5 gap-3">
          {paymentTypeOptions.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => handlePaymentTypeChange(option.value)}
              className={`p-3 border rounded-lg text-center cursor-pointer transition-colors ${
                formData.paymentType === option.value
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-300 hover:border-green-300'
              }`}
            >
              <div className="font-medium text-sm">{option.label}</div>
              <div className="text-xs text-gray-500 mt-1">{option.rateRange}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rate *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={formData.rate}
              onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
              className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.rate ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="0.00"
            />
          </div>
          {errors.rate && <p className="text-red-500 text-sm mt-1">{errors.rate}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Unit
          </label>
          <select
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8"
          >
            {unitOptions[formData.paymentType].map(unit => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity *
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            required
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.quantity ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="0"
          />
          {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
        </div>
      </div>

      {/* Total Calculation */}
      {formData.rate && formData.quantity && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-green-700 font-medium">Total Amount:</span>
            <span className="text-2xl font-bold text-green-900">
              ${calculateTotal().toFixed(2)}
            </span>
          </div>
          <p className="text-sm text-green-600 mt-1">
            ${parseFloat(formData.rate).toFixed(2)} × {formData.quantity} {formData.unit}
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date *
          </label>
          <input
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="paid">Paid</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Field/Location *
        </label>
        <input
          type="text"
          required
          value={formData.field}
          onChange={(e) => setFormData({ ...formData, field: e.target.value })}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
            errors.field ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="e.g., Field A - African Varieties"
        />
        {errors.field && <p className="text-red-500 text-sm mt-1">{errors.field}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Task Description *
        </label>
        <input
          type="text"
          required
          value={formData.task}
          onChange={(e) => setFormData({ ...formData, task: e.target.value })}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
            errors.task ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Detailed description of work performed"
        />
        {errors.task && <p className="text-red-500 text-sm mt-1">{errors.task}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes
        </label>
        <textarea
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Additional notes about performance, quality, etc."
        />
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className="ri-save-line mr-2"></i>Record Labor Cost
        </button>
      </div>
    </form>
  );
}

export default function FinanceManager() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddProcurement, setShowAddProcurement] = useState(false);
  const [showSupplierManager, setShowSupplierManager] = useState(false);
  const [showAddSupplier, setShowAddSupplier] = useState(false);
  const [showAddLabor, setShowAddLabor] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('2024');
  
  // Add filtering states
  const [expenseSearchTerm, setExpenseSearchTerm] = useState('');
  const [expenseCategoryFilter, setExpenseCategoryFilter] = useState('');
  const [expenseStatusFilter, setExpenseStatusFilter] = useState('');

  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: 1,
      name: 'Premium Seeds Co.',
      contactPerson: 'John Martinez',
      email: 'john@premiumseeds.com',
      phone: '+1 (555) 123-4567',
      address: '123 Agriculture Blvd, Farm City, CA 90210',
      category: 'Seeds & Planting',
      status: 'active',
      paymentTerms: 'Net 30',
      notes: 'Premium quality seeds supplier, good delivery times'
    },
    {
      id: 2,
      name: 'Farm Equipment Services',
      contactPerson: 'Mike Thompson',
      email: 'mike@farmequipment.com',
      phone: '+1 (555) 234-5678',
      address: '456 Machinery Ave, Tool Town, TX 75001',
      category: 'Equipment',
      status: 'active',
      paymentTerms: 'Net 15',
      notes: 'Certified technicians, warranty on all repairs'
    },
    {
      id: 3,
      name: 'GreenGrow Supplies',
      contactPerson: 'Sarah Green',
      email: 'sarah@greengrow.com',
      phone: '+1 (555) 345-6789',
      address: '789 Fertilizer Rd, Chemical City, FL 33101',
      category: 'Chemicals',
      status: 'active',
      paymentTerms: 'Net 30',
      notes: 'Organic fertilizers and chemicals specialist'
    },
    {
      id: 4,
      name: 'FastFreight Logistics',
      contactPerson: 'David Brown',
      email: 'david@fastfreight.com',
      phone: '+1 (555) 456-7890',
      address: '321 Transport Way, Logistics Center, NY 10001',
      category: 'Transport',
      status: 'active',
      paymentTerms: 'COD',
      notes: 'Reliable transport for heavy equipment and bulk deliveries'
    },
    {
      id: 5,
      name: 'City Power Company',
      contactPerson: 'Lisa Johnson',
      email: 'lisa@citypower.com',
      phone: '+1 (555) 567-8901',
      address: '555 Electric St, Power City, CA 90001',
      category: 'Utilities',
      status: 'active',
      paymentTerms: 'Net 15',
      notes: 'Main electricity provider'
    },
    {
      id: 6,
      name: 'Metro Fuel Station',
      contactPerson: 'Carlos Rodriguez',
      email: 'carlos@metrofuel.com',
      phone: '+1 (555) 678-9012',
      address: '888 Fuel Lane, Gas City, TX 77001',
      category: 'Transport',
      status: 'active',
      paymentTerms: 'Prepaid',
      notes: 'Fleet fuel cards available, competitive pricing'
    }
  ]);

  const [budgets, setBudgets] = useState<Budget[]>([
    {
      id: 1,
      category: 'Seeds & Planting',
      allocated: 25000,
      spent: 18500,
      remaining: 6500,
      period: '2024',
      status: 'on-track'
    },
    {
      id: 2,
      category: 'Equipment Maintenance',
      allocated: 15000,
      spent: 16200,
      remaining: -1200,
      period: '2024',
      status: 'over-budget'
    },
    {
      id: 3,
      category: 'Fertilizers & Chemicals',
      allocated: 30000,
      spent: 22800,
      remaining: 7200,
      period: '2024',
      status: 'on-track'
    },
    {
      id: 4,
      category: 'Labor Costs',
      allocated: 45000,
      spent: 38500,
      remaining: 6500,
      period: '2024',
      status: 'warning'
    },
    {
      id: 5,
      category: 'Utilities',
      allocated: 12000,
      spent: 8900,
      remaining: 3100,
      period: '2024',
      status: 'on-track'
    },
    {
      id: 6,
      category: 'Insurance',
      allocated: 8000,
      spent: 8000,
      remaining: 0,
      period: '2024',
      status: 'on-track'
    },
    {
      id: 7,
      category: 'Transport & Logistics',
      allocated: 18000,
      spent: 12800,
      remaining: 5200,
      period: '2024',
      status: 'on-track'
    }
  ]);

  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: 1,
      date: '2024-01-25',
      category: 'Seeds & Planting',
      description: 'Chili seeds bulk purchase - Premium varieties',
      amount: 3500,
      type: 'supplies',
      supplier: 'Premium Seeds Co.',
      paymentMethod: 'Bank Transfer',
      status: 'paid',
      invoiceNumber: 'INV-2024-001',
      receipts: [
        {
          id: 'receipt-1',
          fileName: 'invoice_INV-2024-001.pdf',
          fileSize: 245760,
          fileType: 'application/pdf',
          uploadDate: '2024-01-25T10:30:00Z'
        }
      ]
    },
    {
      id: 2,
      date: '2024-01-24',
      category: 'Equipment Maintenance',
      description: 'Tractor hydraulic system repair',
      amount: 1200,
      type: 'maintenance',
      supplier: 'Farm Equipment Services',
      paymentMethod: 'Credit Card',
      status: 'paid',
      invoiceNumber: 'SVC-2024-045',
      receipts: [
        {
          id: 'receipt-2',
          fileName: 'repair_receipt.jpg',
          fileSize: 1024000,
          fileType: 'image/jpeg',
          uploadDate: '2024-01-24T15:45:00Z'
        },
        {
          id: 'receipt-3',
          fileName: 'parts_list.pdf',
          fileSize: 89760,
          fileType: 'application/pdf',
          uploadDate: '2024-01-24T15:46:00Z'
        }
      ]
    },
    {
      id: 3,
      date: '2024-01-23',
      category: 'Fertilizers & Chemicals',
      description: 'Organic fertilizer - 50 bags',
      amount: 2800,
      type: 'supplies',
      supplier: 'GreenGrow Supplies',
      paymentMethod: 'Check',
      status: 'pending',
      invoiceNumber: 'GGS-2024-089',
      dueDate: '2024-02-07',
      receipts: []
    },
    {
      id: 4,
      date: '2024-01-22',
      category: 'Labor Costs',
      description: 'Seasonal workers - Harvesting team',
      amount: 4500,
      type: 'operational',
      supplier: 'Direct Payment',
      paymentMethod: 'Cash',
      status: 'paid',
      receipts: [
        {
          id: 'receipt-4',
          fileName: 'payroll_receipt_jan22.jpg',
          fileSize: 512000,
          fileType: 'image/jpeg',
          uploadDate: '2024-01-22T18:20:00Z'
        }
      ]
    },
    {
      id: 5,
      date: '2024-01-21',
      category: 'Utilities',
      description: 'Electricity bill - Main facility',
      amount: 850,
      type: 'operational',
      supplier: 'City Power Company',
      paymentMethod: 'Auto-pay',
      status: 'paid',
      invoiceNumber: 'PWR-2024-001',
      receipts: []
    },
    {
      id: 6,
      date: '2024-01-20',
      category: 'Equipment Maintenance',
      description: 'Irrigation pump overhaul',
      amount: 2200,
      type: 'maintenance',
      supplier: 'Pump Specialists Inc.',
      paymentMethod: 'Bank Transfer',
      status: 'overdue',
      invoiceNumber: 'PSI-2024-012',
      dueDate: '2024-01-15',
      receipts: []
    },
    {
      id: 7,
      date: '2024-01-26',
      category: 'Transport & Logistics',
      description: 'Delivery truck fuel and maintenance',
      amount: 850,
      type: 'transport',
      supplier: 'Metro Fuel Station',
      paymentMethod: 'Credit Card',
      status: 'paid',
      invoiceNumber: 'FUEL-2024-003',
      receipts: [
        {
          id: 'receipt-5',
          fileName: 'fuel_receipt.jpg',
          fileSize: 256000,
          fileType: 'image/jpeg',
          uploadDate: '2024-01-26T08:15:00Z'
        }
      ]
    },
    {
      id: 8,
      date: '2024-01-25',
      category: 'Transport & Logistics',
      description: 'Equipment delivery freight charges',
      amount: 1200,
      type: 'transport',
      supplier: 'FastFreight Logistics',
      paymentMethod: 'Bank Transfer',
      status: 'paid',
      invoiceNumber: 'FF-2024-067',
      receipts: []
    },
    {
      id: 9,
      date: '2024-01-24',
      category: 'Transport & Logistics',
      description: 'Product distribution to market',
      amount: 680,
      type: 'transport',
      supplier: 'Local Transport Co.',
      paymentMethod: 'Cash',
      status: 'pending',
      dueDate: '2024-02-10',
      receipts: []
    }
  ]);

  // Add filtered expenses function
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(expenseSearchTerm.toLowerCase()) ||
                         expense.supplier.toLowerCase().includes(expenseSearchTerm.toLowerCase()) ||
                         expense.category.toLowerCase().includes(expenseSearchTerm.toLowerCase());
    
    const matchesCategory = expenseCategoryFilter === '' || expense.type === expenseCategoryFilter;
    const matchesStatus = expenseStatusFilter === '' || expense.status === expenseStatusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const [procurementItems, setProcurementItems] = useState<ProcurementItem[]>([
    {
      id: 1,
      itemName: 'Drip Irrigation Pipes - 100m',
      category: 'Irrigation Equipment',
      supplier: 'IrriTech Solutions',
      requestedBy: 'Farm Manager',
      requestDate: '2024-01-25',
      quantity: 5,
      unitPrice: 450,
      totalAmount: 2250,
      status: 'approved',
      urgency: 'high',
      deliveryDate: '2024-02-05',
      notes: 'Needed for new field expansion project. Transport cost: $180 included'
    },
    {
      id: 2,
      itemName: 'Safety Equipment Set',
      category: 'Safety Supplies',
      supplier: 'Safety First Co.',
      requestedBy: 'Safety Officer',
      requestDate: '2024-01-24',
      quantity: 10,
      unitPrice: 85,
      totalAmount: 850,
      status: 'ordered',
      urgency: 'medium',
      deliveryDate: '2024-02-01',
      notes: 'Replacement for damaged equipment. Free delivery within city limits'
    },
    {
      id: 3,
      itemName: 'Organic Pesticide - Neem Oil',
      category: 'Chemicals',
      supplier: 'Organic Solutions Ltd.',
      requestedBy: 'Field Supervisor',
      requestDate: '2024-01-23',
      quantity: 20,
      unitPrice: 35,
      totalAmount: 700,
      status: 'requested',
      urgency: 'medium',
      notes: 'For pest control in Field A. Delivery charge: $45'
    },
    {
      id: 4,
      itemName: 'Greenhouse Thermometers',
      category: 'Monitoring Equipment',
      supplier: 'AgriTech Instruments',
      requestedBy: 'Greenhouse Manager',
      requestDate: '2024-01-22',
      quantity: 8,
      unitPrice: 65,
      totalAmount: 520,
      status: 'received',
      urgency: 'low',
      notes: 'Digital thermometers with humidity sensors. Express delivery: $25'
    },
    {
      id: 5,
      itemName: 'Soil Testing Kit - Professional',
      category: 'Testing Equipment',
      supplier: 'Lab Equipment Pro',
      requestedBy: 'Quality Control',
      requestDate: '2024-01-21',
      quantity: 2,
      unitPrice: 1200,
      totalAmount: 2400,
      status: 'rejected',
      urgency: 'low',
      notes: 'Budget exceeded for this quarter'
    },
    {
      id: 6,
      itemName: 'Heavy Equipment Transport',
      category: 'Transport Services',
      supplier: 'Heavy Haul Logistics',
      requestedBy: 'Operations Manager',
      requestDate: '2024-01-26',
      quantity: 1,
      unitPrice: 2500,
      totalAmount: 2500,
      status: 'approved',
      urgency: 'high',
      deliveryDate: '2024-02-03',
      notes: 'Transport new tractor from dealer to farm. Includes loading/unloading'
    },
    {
      id: 7,
      itemName: 'Bulk Fertilizer Delivery',
      category: 'Transport Services',
      supplier: 'Farm Transport Solutions',
      requestedBy: 'Farm Manager',
      requestDate: '2024-01-25',
      quantity: 1,
      unitPrice: 450,
      totalAmount: 450,
      status: 'ordered',
      urgency: 'medium',
      deliveryDate: '2024-02-08',
      notes: 'Transport 20 tons of organic fertilizer from warehouse to fields'
    },
    {
      id: 8,
      itemName: 'Market Distribution Service',
      category: 'Transport Services',
      supplier: 'Regional Delivery Co.',
      requestedBy: 'Sales Manager',
      requestDate: '2024-01-24',
      quantity: 12,
      unitPrice: 85,
      totalAmount: 1020,
      status: 'requested',
      urgency: 'medium',
      notes: 'Weekly produce delivery to local markets for next 3 months'
    }
  ]);

  const [laborCosts, setLaborCosts] = useState<LaborCost[]>([
    {
      id: 1,
      workerName: 'Maria Rodriguez',
      workType: 'Harvesting',
      paymentType: 'piecemeal',
      rate: 0.50,
      unit: 'kg',
      quantity: 145,
      totalAmount: 72.50,
      date: '2024-01-20',
      field: 'Field A - African Varieties',
      task: 'Chili pepper harvesting - morning shift',
      piecesCompleted: 145,
      notes: 'Efficient worker, good quality selection',
      status: 'paid'
    },
    {
      id: 2,
      workerName: 'Jose Martinez',
      workType: 'Equipment Operation',
      paymentType: 'hourly',
      rate: 18.50,
      unit: 'hours',
      quantity: 8,
      totalAmount: 148.00,
      date: '2024-01-20',
      field: 'Field B - Asian Mix',
      task: 'Tractor operation for soil preparation',
      hoursWorked: 8,
      notes: 'Operated tractor for field preparation, no issues',
      status: 'approved'
    },
    {
      id: 3,
      workerName: 'Ana Silva',
      workType: 'Planting',
      paymentType: 'daily',
      rate: 120.00,
      unit: 'days',
      quantity: 1,
      totalAmount: 120.00,
      date: '2024-01-19',
      field: 'Field C - Caribbean Heat',
      task: 'Seedling transplanting',
      hoursWorked: 8.5,
      notes: 'Careful handling of seedlings, good survival rate',
      status: 'paid'
    },
    {
      id: 4,
      workerName: 'Carlos Mendez',
      workType: 'Weeding',
      paymentType: 'piecemeal',
      rate: 15.00,
      unit: 'rows',
      quantity: 12,
      totalAmount: 180.00,
      date: '2024-01-18',
      field: 'Field A - African Varieties',
      task: 'Manual weeding between plant rows',
      piecesCompleted: 12,
      notes: 'Thorough weeding job, preserved plant health',
      status: 'pending'
    },
    {
      id: 5,
      workerName: 'Roberto Santos',
      workType: 'Irrigation',
      paymentType: 'contract',
      rate: 2500.00,
      unit: 'project',
      quantity: 1,
      totalAmount: 2500.00,
      date: '2024-01-15',
      field: 'All Fields',
      task: 'Drip irrigation system installation',
      notes: 'Complete irrigation system setup for season',
      status: 'approved'
    },
    {
      id: 6,
      workerName: 'Elena Varez',
      workType: 'Packaging',
      paymentType: 'piecemeal',
      rate: 0.25,
      unit: 'boxes',
      quantity: 320,
      totalAmount: 80.00,
      date: '2024-01-17',
      field: 'Processing Area',
      task: 'Product packaging and labeling',
      piecesCompleted: 320,
      notes: 'Fast and accurate packaging work',
      status: 'paid'
    },
    {
      id: 7,
      workerName: 'Team Alpha',
      workType: 'General Maintenance',
      paymentType: 'seasonal',
      rate: 8500.00,
      unit: 'season',
      quantity: 1,
      totalAmount: 8500.00,
      date: '2024-01-01',
      field: 'All Fields',
      task: 'Complete seasonal maintenance team',
      notes: '5-person team for entire growing season',
      status: 'approved'
    }
  ]);

  const costAnalysis: CostAnalysis[] = [
    {
      category: 'Seeds & Planting',
      currentMonth: 3500,
      lastMonth: 2800,
      yearToDate: 18500,
      budgetVariance: -6500
    },
    {
      category: 'Equipment Maintenance',
      currentMonth: 3400,
      lastMonth: 2100,
      yearToDate: 16200,
      budgetVariance: 1200
    },
    {
      category: 'Fertilizers & Chemicals',
      currentMonth: 2800,
      lastMonth: 3200,
      yearToDate: 22800,
      budgetVariance: -7200
    },
    {
      category: 'Labor Costs',
      currentMonth: 4500,
      lastMonth: 4200,
      yearToDate: 38500,
      budgetVariance: -6500
    },
    {
      category: 'Utilities',
      currentMonth: 850,
      lastMonth: 920,
      yearToDate: 8900,
      budgetVariance: -3100
    },
    {
      category: 'Transport & Logistics',
      currentMonth: 2730,
      lastMonth: 2180,
      yearToDate: 12800,
      budgetVariance: -5200
    }
  ];

  const getBudgetStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'over-budget': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getExpenseStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProcurementStatusColor = (status: string) => {
    switch (status) {
      case 'requested': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'ordered': return 'bg-purple-100 text-purple-800';
      case 'received': return 'bg-emerald-100 text-emerald-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLaborStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentTypeColor = (type: string) => {
    switch (type) {
      case 'hourly': return 'bg-blue-100 text-blue-800';
      case 'daily': return 'bg-green-100 text-green-800';
      case 'piecemeal': return 'bg-purple-100 text-purple-800';
      case 'seasonal': return 'bg-orange-100 text-orange-800';
      case 'contract': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.allocated, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const totalRemaining = budgets.reduce((sum, budget) => sum + budget.remaining, 0);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: 'ri-dashboard-line' },
    { id: 'budgets', name: 'Budgets', icon: 'ri-pie-chart-line' },
    { id: 'expenses', name: 'Expenses', icon: 'ri-bill-line' },
    { id: 'labor', name: 'Labor Costs', icon: 'ri-team-line' },
    { id: 'procurement', name: 'Procurement', icon: 'ri-shopping-cart-line' },
    { id: 'suppliers', name: 'Suppliers', icon: 'ri-truck-line' },
    { id: 'analysis', name: 'Cost Analysis', icon: 'ri-bar-chart-line' }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <i className="ri-money-dollar-circle-line text-blue-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900">${totalBudget.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
              <i className="ri-arrow-down-line text-red-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">${totalSpent.toLocaleString()}</p>
              <p className="text-xs text-gray-500">{((totalSpent / totalBudget) * 100).toFixed(1)}% of budget</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <i className="ri-arrow-up-line text-green-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500">Remaining Budget</p>
              <p className="text-2xl font-bold text-gray-900">${totalRemaining.toLocaleString()}</p>
              <p className="text-xs text-gray-500">{((totalRemaining / totalBudget) * 100).toFixed(1)}% remaining</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
              <i className="ri-alert-line text-yellow-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Payments</p>
              <p className="text-2xl font-bold text-gray-900">
                ${expenses.filter(e => e.status === 'pending' || e.status === 'overdue').reduce((sum, e) => sum + e.amount, 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">{expenses.filter(e => e.status === 'pending' || e.status === 'overdue').length} invoices</p>
            </div>
          </div>
        </div>
      </div>

      {/* Budget vs Actual Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget vs Actual Spending</h3>
        <div className="space-y-4">
          {budgets.slice(0, 5).map((budget) => (
            <div key={budget.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{budget.category}</span>
                <div className="text-sm text-gray-500">
                  ${budget.spent.toLocaleString()} / ${budget.allocated.toLocaleString()}
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full ${
                    budget.spent > budget.allocated ? 'bg-red-500' : 
                    budget.spent > budget.allocated * 0.8 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min((budget.spent / budget.allocated) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions & Alerts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Expenses</h3>
          <div className="space-y-3">
            {expenses.slice(0, 5).map((expense) => (
              <div key={expense.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{expense.description}</p>
                  <p className="text-xs text-gray-500">{expense.date} • {expense.supplier}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">${expense.amount.toLocaleString()}</p>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getExpenseStatusColor(expense.status)}`}>
                    {expense.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Alerts</h3>
          <div className="space-y-3">
            {budgets.filter(b => b.status === 'over-budget' || b.status === 'warning').map((budget) => (
              <div key={budget.id} className="flex items-center p-3 bg-red-50 rounded-lg border border-red-200">
                <i className="ri-alert-line text-red-600 mr-3"></i>
                <div>
                  <p className="text-sm font-medium text-red-900">
                    {budget.status === 'over-budget' ? 'Budget exceeded' : 'Budget warning'}
                  </p>
                  <p className="text-xs text-red-700">
                    {budget.category}: ${Math.abs(budget.remaining).toLocaleString()} {budget.status === 'over-budget' ? 'over budget' : 'remaining'}
                  </p>
                </div>
              </div>
            ))}

            {expenses.filter(e => e.status === 'overdue').map((expense) => (
              <div key={expense.id} className="flex items-center p-3 bg-red-50 rounded-lg border border-red-200">
                <i className="ri-time-line text-red-600 mr-3"></i>
                <div>
                  <p className="text-sm font-medium text-red-900">Payment overdue</p>
                  <p className="text-xs text-red-700">
                    {expense.supplier}: ${expense.amount.toLocaleString()} due {expense.dueDate}
                  </p>
                </div>
              </div>
            ))}

            {procurementItems.filter(p => p.urgency === 'critical' && p.status === 'requested').map((item) => (
              <div key={item.id} className="flex items-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                <i className="ri-error-warning-line text-orange-600 mr-3"></i>
                <div>
                  <p className="text-sm font-medium text-orange-900">Critical procurement pending</p>
                  <p className="text-xs text-orange-700">
                    {item.itemName}: ${item.totalAmount.toLocaleString()} awaiting approval
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderBudgets = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Budget Management</h3>
          <p className="text-gray-600">Manage and track your farm budget allocations</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8"
          >
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="Q1-2024">Q1 2024</option>
            <option value="Q2-2024">Q2 2024</option>
          </select>
          <button
            onClick={() => setShowAddBudget(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-add-line mr-2"></i>Add Budget
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {budgets.map((budget) => (
          <div key={budget.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">{budget.category}</h4>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getBudgetStatusColor(budget.status)}`}>
                  {budget.status.replace('-', ' ')}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Allocated:</span>
                  <span className="font-medium">${budget.allocated.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Spent:</span>
                  <span className="font-medium">${budget.spent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Remaining:</span>
                  <span className={`font-medium ${budget.remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    ${Math.abs(budget.remaining).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-500">Progress</span>
                  <span className="text-xs text-gray-500">
                    {((budget.spent / budget.allocated) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      budget.spent > budget.allocated ? 'bg-red-500' : 
                      budget.spent > budget.allocated * 0.8 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min((budget.spent / budget.allocated) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-6 py-3 border-t">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Period: {budget.period}</span>
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-800 text-xs cursor-pointer">Edit</button>
                  <button className="text-green-600 hover:text-green-800 text-xs cursor-pointer">View Details</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderExpenses = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Expense Tracking</h3>
          <p className="text-gray-600">Track and manage all farm expenditures with receipt documentation</p>
        </div>
        <button
          onClick={() => setShowAddExpense(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className="ri-add-line mr-2"></i>Record Expense
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="Search expenses..."
              value={expenseSearchTerm}
              onChange={(e) => setExpenseSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <select 
              value={expenseCategoryFilter}
              onChange={(e) => setExpenseCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8"
            >
              <option value="">All Categories</option>
              <option value="operational">Operational</option>
              <option value="capital">Capital</option>
              <option value="maintenance">Maintenance</option>
              <option value="supplies">Supplies</option>
              <option value="transport">Transport</option>
            </select>
            <select 
              value={expenseStatusFilter}
              onChange={(e) => setExpenseStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8"
            >
              <option value="">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          
          {/* Filter Summary */}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {filteredExpenses.length} of {expenses.length} expenses
              {(expenseSearchTerm || expenseCategoryFilter || expenseStatusFilter) && (
                <span className="ml-2 text-green-600">
                  (Filtered)
                </span>
              )}
            </div>
            {(expenseSearchTerm || expenseCategoryFilter || expenseStatusFilter) && (
              <button
                onClick={() => {
                  setExpenseSearchTerm('');
                  setExpenseCategoryFilter('');
                  setExpenseStatusFilter('');
                }}
                className="text-sm text-red-600 hover:text-red-800 cursor-pointer font-medium"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipts</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredExpenses.length > 0 ? filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {expense.date}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{expense.description}</div>
                    {expense.invoiceNumber && (
                      <div className="text-sm text-gray-500">Invoice: {expense.invoiceNumber}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {expense.supplier}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${expense.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {expense.receipts.length > 0 ? (
                        <div className="flex items-center space-x-1">
                          <i className="ri-attachment-line text-green-600"></i>
                          <span className="text-sm text-green-600 font-medium">
                            {expense.receipts.length} file{expense.receipts.length > 1 ? 's' : ''}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">No receipts</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getExpenseStatusColor(expense.status)}`}>
                      {expense.status}
                    </span>
                    {expense.dueDate && expense.status !== 'paid' && (
                      <div className="text-xs text-gray-500 mt-1">Due: {expense.dueDate}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button className="text-blue-600 hover:text-blue-900 cursor-pointer">Edit</button>
                    {expense.receipts.length > 0 && (
                      <button 
                        onClick={() => viewExpenseReceipts(expense)}
                        className="text-green-600 hover:text-green-900 cursor-pointer"
                      >
                        View
                      </button>
                    )}
                    <button className="text-green-600 hover:text-green-900 cursor-pointer">
                      {expense.status === 'paid' ? 'Receipt' : 'Pay'}
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <i className="ri-search-line text-4xl text-gray-300 mb-4"></i>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses found</h3>
                      <p className="text-gray-500 mb-4">
                        {expenseSearchTerm || expenseCategoryFilter || expenseStatusFilter
                          ? 'Try adjusting your search criteria or filters'
                          : 'No expenses have been recorded yet'
                        }
                      </p>
                      {(expenseSearchTerm || expenseCategoryFilter || expenseStatusFilter) && (
                        <button
                          onClick={() => {
                            setExpenseSearchTerm('');
                            setExpenseCategoryFilter('');
                            setExpenseStatusFilter('');
                          }}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const viewExpenseReceipts = (expense: Expense) => {
    // Implementation for viewing receipts
    console.log('Viewing receipts for expense:', expense.id);
  };

  const renderProcurement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Procurement Management</h3>
          <p className="text-gray-600">Manage purchase requests and procurement process</p>
        </div>
        <button
          onClick={() => setShowAddProcurement(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className="ri-add-line mr-2"></i>New Request
        </button>
      </div>

      <div className="grid lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <i className="ri-file-list-line w-8 h-8 flex items-center justify-center text-blue-600 mr-3"></i>
            <div>
              <p className="text-sm text-gray-500">Total Requests</p>
              <p className="text-xl font-bold text-gray-900">{procurementItems.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <i className="ri-time-line w-8 h-8 flex items-center justify-center text-yellow-600 mr-3"></i>
            <div>
              <p className="text-sm text-gray-500">Pending Approval</p>
              <p className="text-xl font-bold text-gray-900">
                {procurementItems.filter(item => item.status === 'requested').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <i className="ri-shopping-cart-line w-8 h-8 flex items-center justify-center text-purple-600 mr-3"></i>
            <div>
              <p className="text-sm text-gray-500">Active Orders</p>
              <p className="text-xl font-bold text-gray-900">
                {procurementItems.filter(item => item.status === 'ordered').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <i className="ri-money-dollar-circle-line w-8 h-8 flex items-center justify-center text-green-600 mr-3"></i>
            <div>
              <p className="text-sm text-gray-500">Total Value</p>
              <p className="text-xl font-bold text-gray-900">
                ${procurementItems.filter(item => item.status !== 'rejected').reduce((sum, item) => sum + item.totalAmount, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Urgency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {procurementItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{item.itemName}</div>
                    <div className="text-sm text-gray-500">{item.category}</div>
                    <div className="text-xs text-gray-400">Requested: {item.requestDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.requestedBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.supplier}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>{item.quantity}</div>
                    <div className="text-xs text-gray-500">${item.unitPrice}/unit</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${item.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getProcurementStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                    {item.deliveryDate && (
                      <div className="text-xs text-gray-500 mt-1">
                        Delivery: {item.deliveryDate}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getUrgencyColor(item.urgency)}`}>
                      {item.urgency}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    {item.status === 'requested' && (
                      <>
                        <button className="text-green-600 hover:text-green-900 cursor-pointer">Approve</button>
                        <button className="text-red-600 hover:text-red-900 cursor-pointer">Reject</button>
                      </>
                    )}
                    {item.status === 'approved' && (
                      <button className="text-blue-600 hover:text-blue-900 cursor-pointer">Order</button>
                    )}
                    <button className="text-gray-600 hover:text-gray-900 cursor-pointer">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSuppliers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Supplier Management</h3>
          <p className="text-gray-600">Manage vendor information and avoid duplicate entries</p>
        </div>
        <button
          onClick={() => setShowAddSupplier(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className="ri-add-line mr-2"></i>Add Supplier
        </button>
      </div>

      {/* Supplier Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <i className="ri-truck-line text-blue-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Suppliers</p>
              <p className="text-2xl font-bold text-gray-900">{suppliers.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <i className="ri-check-line text-green-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Suppliers</p>
              <p className="text-2xl font-bold text-gray-900">
                {suppliers.filter(s => s.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
              <i className="ri-links-line text-purple-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500">Categories</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(suppliers.map(s => s.category)).size}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
              <i className="ri-time-line text-orange-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500">Net 30 Terms</p>
              <p className="text-2xl font-bold text-gray-900">
                {suppliers.filter(s => s.paymentTerms === 'Net 30').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Terms</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {suppliers.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{supplier.name}</div>
                      <div className="text-sm text-gray-500">{supplier.contactPerson}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{supplier.email}</div>
                      <div className="text-sm text-gray-500">{supplier.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                      {supplier.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {supplier.paymentTerms}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      supplier.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {supplier.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => setEditingSupplier(supplier)}
                      className="text-blue-600 hover:text-blue-900 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteSupplier(supplier.id)}
                      className="text-red-600 hover:text-red-900 cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAnalysis = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900">Cost Analysis</h3>
        <p className="text-gray-600">Analyze spending patterns and budget performance</p>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="p-6 border-b">
          <h4 className="text-lg font-semibold text-gray-900">Category-wise Cost Analysis</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Month</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Month</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year to Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget Variance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {costAnalysis.map((analysis, index) => {
                const trend = analysis.currentMonth > analysis.lastMonth ? 'up' : 'down';
                const trendPercentage = Math.abs(((analysis.currentMonth - analysis.lastMonth) / analysis.lastMonth) * 100);
                
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {analysis.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${analysis.currentMonth.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${analysis.lastMonth.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${analysis.yearToDate.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`font-medium ${analysis.budgetVariance < 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {analysis.budgetVariance < 0 ? '-' : '+'}${Math.abs(analysis.budgetVariance).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        <i className={`${trend === 'up' ? 'ri-arrow-up-line text-red-500' : 'ri-arrow-down-line text-green-500'} mr-1`}></i>
                        <span className={trend === 'up' ? 'text-red-600' : 'text-green-600'}>
                          {trendPercentage.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Expense Trend */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Monthly Expense Trends</h4>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">$12,850</div>
            <div className="text-sm text-blue-700">This Month</div>
            <div className="text-xs text-gray-500 mt-1">+8.5% from last month</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">$11,840</div>
            <div className="text-sm text-green-700">Last Month</div>
            <div className="text-xs text-gray-500 mt-1">-3.2% from previous</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">$112,400</div>
            <div className="text-sm text-purple-700">Year to Date</div>
            <div className="text-xs text-gray-500 mt-1">On track with budget</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLabor = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Labor Cost Management</h3>
          <p className="text-gray-600">Track labor costs with flexible payment structures</p>
        </div>
        <button
          onClick={() => setShowAddLabor(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap"
        >
          <i className="ri-add-line mr-2"></i>Record Labor
        </button>
      </div>

      {/* Labor Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <i className="ri-team-line text-blue-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Labor Cost</p>
              <p className="text-2xl font-bold text-gray-900">
                ${laborCosts.reduce((sum, labor) => sum + labor.totalAmount, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <i className="ri-check-line text-green-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500">Paid</p>
              <p className="text-2xl font-bold text-gray-900">
                ${laborCosts.filter(l => l.status === 'paid').reduce((sum, labor) => sum + labor.totalAmount, 0).toLocaleString()}
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
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                ${laborCosts.filter(l => l.status === 'pending').reduce((sum, labor) => sum + labor.totalAmount, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
              <i className="ri-user-line text-purple-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Workers</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(laborCosts.map(l => l.workerName)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Type Distribution */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Payment Type Distribution</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {['hourly', 'daily', 'piecemeal', 'seasonal', 'contract'].map(type => {
            const count = laborCosts.filter(l => l.paymentType === type).length;
            const amount = laborCosts.filter(l => l.paymentType === type).reduce((sum, l) => sum + l.totalAmount, 0);
            return (
              <div key={type} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className={`inline-flex px-3 py-1 text-sm font-medium rounded-full mb-2 ${getPaymentTypeColor(type)}`}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </div>
                <div className="text-lg font-bold text-gray-900">{count}</div>
                <div className="text-sm text-gray-500">${amount.toLocaleString()}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Labor Records Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Worker</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Work Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate & Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {laborCosts.map((labor) => (
                <tr key={labor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{labor.workerName}</div>
                      <div className="text-sm text-gray-500">{labor.date}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{labor.workType}</div>
                      <div className="text-sm text-gray-500">{labor.field}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentTypeColor(labor.paymentType)}`}>
                      {labor.paymentType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ${labor.rate.toFixed(2)} per {labor.unit}
                    </div>
                    <div className="text-sm text-gray-500">
                      {labor.quantity} {labor.unit}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${labor.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLaborStatusColor(labor.status)}`}>
                      {labor.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button className="text-blue-600 hover:text-blue-900 cursor-pointer">Edit</button>
                    {labor.status === 'pending' && (
                      <button className="text-green-600 hover:text-green-900 cursor-pointer">Approve</button>
                    )}
                    {labor.status === 'approved' && (
                      <button className="text-green-600 hover:text-green-900 cursor-pointer">Mark Paid</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const handleAddSupplier = (supplierData: Omit<Supplier, 'id'>) => {
    const newSupplier: Supplier = {
      ...supplierData,
      id: Math.max(...suppliers.map(s => s.id), 0) + 1
    };
    setSuppliers(prev => [...prev, newSupplier]);
    setShowAddSupplier(false);
  };

  const handleUpdateSupplier = (updatedSupplier: Supplier) => {
    setSuppliers(prev => 
      prev.map(supplier => 
        supplier.id === updatedSupplier.id ? updatedSupplier : supplier
      )
    );
    setEditingSupplier(null);
  };

  const handleDeleteSupplier = (id: number) => {
    if (confirm('Are you sure you want to delete this supplier?')) {
      setSuppliers(prev => prev.filter(supplier => supplier.id !== id));
    }
  };

  const handleAddLabor = (laborData: Omit<LaborCost, 'id'>) => {
    const newLabor: LaborCost = {
      ...laborData,
      id: Math.max(...laborCosts.map(l => l.id), 0) + 1
    };
    setLaborCosts(prev => [newLabor, ...prev]);
    setShowAddLabor(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'budgets':
        return renderBudgets();
      case 'expenses':
        return renderExpenses();
      case 'labor':
        return renderLabor();
      case 'procurement':
        return renderProcurement();
      case 'suppliers':
        return renderSuppliers();
      case 'analysis':
        return renderAnalysis();
      default:
        return renderOverview();
    }
  };

  // Check if user has permission
  const hasPermission = (permission: string) => {
    return currentUser.permissions.includes('*') || currentUser.permissions.includes(permission);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Finance Management</h2>
          {currentUser.role === 'accountant' && (
            <p className="text-sm text-gray-600 mt-1">Accountant - Full Financial Access</p>
          )}
        </div>
      </div>

      {/* Permission Notice */}
      {!hasPermission('finance_manage') && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <i className="ri-lock-line w-5 h-5 flex items-center justify-center text-red-600 mr-3"></i>
            <div>
              <p className="text-sm font-medium text-red-800">Access Restricted</p>
              <p className="text-sm text-red-700">You do not have permission to access financial management features.</p>
            </div>
          </div>
        </div>
      )}

      {hasPermission('finance_manage') && (
        <>
          {/* Finance Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
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

          {/* Tab Content */}
          {renderContent()}
        </>
      )}
    </div>
  );
}