'use client';
// @ts-nocheck
import React, { useState, useEffect, useMemo } from 'react';

interface UnifiedEvent {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'field-operation' | 'planting' | 'cultivation' | 'pruning' | 'harvesting' | 'irrigation' | 'weeding' | 'mulching' | 'transplanting' | 'soil-preparation' | 'composting' | 'equipment-maintenance' | 'spray-program' | 'fertilizer-program' | 'pest-control' | 'disease-control' | 'reminder' | 'manual';
  sourceId?: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'pending';
  assignedTo: string;
  field?: string;
  description: string;
  equipment?: string[];
  tags?: string[];
  color: string;
  isDraggable: boolean;
  estimatedHours?: number;
  actualHours?: number;
  progress?: number;
  weatherDependency?: boolean;
  notes?: string;
  careProgram?: any; // Reference to care program data
}

interface UnifiedOperationsCalendarProps {
  onClose: () => void;
  fieldOperations: any[];
  setFieldOperations: React.Dispatch<React.SetStateAction<any[]>>;
  carePrograms: any[]; // Renamed from sprayPrograms to better reflect actual data
  setCarePrograms: React.Dispatch<React.SetStateAction<any[]>>;
  fields: any[];
  reminders: any[];
  setReminders: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function UnifiedOperationsCalendar({
  onClose,
  fieldOperations,
  setFieldOperations,
  carePrograms,
  setCarePrograms,
  fields,
  reminders,
  setReminders
}: UnifiedOperationsCalendarProps) {
  console.log('=== UNIFIED CALENDAR COMPONENT RENDER ===');
  console.log('Fields received:', fields?.length || 0, fields);
  console.log('Field Operations:', fieldOperations?.length || 0);
  console.log('Care Programs:', carePrograms?.length || 0);
  console.log('Reminders:', reminders?.length || 0);
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day' | 'kanban'>('month');
  const [selectedEvent, setSelectedEvent] = useState<UnifiedEvent | null>(null);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState<UnifiedEvent | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedEvent, setDraggedEvent] = useState<UnifiedEvent | null>(null);
  const [dropZoneDate, setDropZoneDate] = useState<string | null>(null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickAddDate, setQuickAddDate] = useState<string | null>(null);
  const [quickAddPosition, setQuickAddPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDraggingToCalendar, setIsDraggingToCalendar] = useState(false);
  const [dragTargetDate, setDragTargetDate] = useState<string | null>(null);
  const [recentlyCreatedEvent, setRecentlyCreatedEvent] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showFieldSelector, setShowFieldSelector] = useState(false);
  const [pendingEventData, setPendingEventData] = useState<{
    date: string;
    programType: 'spray' | 'fertilizer' | 'manual';
    position: { x: number; y: number };
  } | null>(null);

  // Helper functions (defined before useMemo to avoid hoisting issues)
  const getTypeColor = (type: string) => {
    switch (type) {
      // Field Operations - Blue family
      case 'field-operation': return 'bg-blue-500';
      case 'planting': return 'bg-green-600';
      case 'cultivation': return 'bg-amber-600';
      case 'pruning': return 'bg-emerald-600';
      case 'harvesting': return 'bg-yellow-600';
      case 'irrigation': return 'bg-cyan-500';
      case 'weeding': return 'bg-lime-600';
      case 'mulching': return 'bg-stone-600';
      case 'transplanting': return 'bg-teal-600';
      case 'soil-preparation': return 'bg-orange-600';
      case 'composting': return 'bg-green-700';
      case 'equipment-maintenance': return 'bg-slate-600';
      // Care Programs - Purple/Green family
      case 'spray-program': return 'bg-purple-500';
      case 'fertilizer-program': return 'bg-green-500';
      case 'pest-control': return 'bg-red-500';
      case 'disease-control': return 'bg-pink-500';
      // Other
      case 'reminder': return 'bg-orange-500';
      case 'manual': return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-l-red-500';
      case 'high': return 'border-l-orange-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'field-operation': return 'General Field Operation';
      case 'planting': return 'Planting/Seeding';
      case 'cultivation': return 'Cultivation/Tilling';
      case 'pruning': return 'Pruning/Trimming';
      case 'harvesting': return 'Harvesting';
      case 'irrigation': return 'Irrigation/Watering';
      case 'weeding': return 'Weeding';
      case 'mulching': return 'Mulching';
      case 'transplanting': return 'Transplanting';
      case 'soil-preparation': return 'Soil Preparation';
      case 'composting': return 'Composting';
      case 'equipment-maintenance': return 'Equipment Maintenance';
      case 'spray-program': return 'Spray Program';
      case 'fertilizer-program': return 'Fertilizer Program';
      case 'pest-control': return 'Pest Control';
      case 'disease-control': return 'Disease Control';
      case 'reminder': return 'Reminder';
      case 'manual': return 'Manual Event';
      default: return 'Event';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'field-operation': return 'ri-plant-line';
      case 'planting': return 'ri-seedling-line';
      case 'cultivation': return 'ri-tools-line';
      case 'pruning': return 'ri-scissors-cut-line';
      case 'harvesting': return 'ri-harvest-line';
      case 'irrigation': return 'ri-drop-line';
      case 'weeding': return 'ri-leaf-line';
      case 'mulching': return 'ri-stack-line';
      case 'transplanting': return 'ri-plant-fill';
      case 'soil-preparation': return 'ri-landscape-line';
      case 'composting': return 'ri-recycle-line';
      case 'equipment-maintenance': return 'ri-tools-fill';
      case 'spray-program': return 'ri-drop-line';
      case 'fertilizer-program': return 'ri-leaf-line';
      case 'pest-control': return 'ri-bug-line';
      case 'disease-control': return 'ri-medicine-bottle-line';
      case 'reminder': return 'ri-alarm-line';
      case 'manual': return 'ri-calendar-event-line';
      default: return 'ri-calendar-line';
    }
  };

  // Convert data to unified events
  const unifiedEvents = useMemo(() => {
    const events: UnifiedEvent[] = [];

    // Field Operations
    fieldOperations.forEach(op => {
      events.push({
        id: `field-op-${op.id}`,
        title: op.title,
        date: op.dueDate,
        startTime: '08:00',
        endTime: `${8 + (op.estimatedHours || 4)}:00`.padStart(5, '0'),
        type: op.type || 'field-operation', // Use the specific operation type if available
        sourceId: op.id,
        priority: op.priority as any,
        status: op.status === 'planning' ? 'scheduled' : op.status as any,
        assignedTo: op.assignedTo,
        field: op.field,
        description: op.description,
        tags: op.tags,
        color: getTypeColor(op.type || 'field-operation'), // Use specific type color
        isDraggable: true,
        estimatedHours: op.estimatedHours,
        actualHours: op.actualHours,
        progress: op.progress,
        notes: op.description
      });
    });

    // Care Programs - Convert to operation types
    carePrograms.forEach((program: any) => {
      if (program.nextApplication && program.status === 'active') {
        // Map care program types to operation types
        let operationType = 'manual';
        switch (program.type) {
          case 'spray':
            operationType = 'spray-program';
            break;
          case 'fertilizer':
          case 'fertilization':
            operationType = 'fertilizer-program';
            break;
          case 'watering':
            operationType = 'irrigation';
            break;
          case 'pest-control':
          case 'pest_control':
            operationType = 'pest-control';
            break;
          case 'disease-control':
          case 'disease_control':
            operationType = 'disease-control';
            break;
          case 'soil-conditioning':
          case 'soil_conditioning':
            operationType = 'soil-preparation';
            break;
          default:
            operationType = program.type || 'manual';
        }

        events.push({
          id: `care-${program.id}`,
          title: `${program.name} - ${program.field?.name || program.field}`,
          date: program.nextApplication,
          startTime: '07:00',
          endTime: '09:00',
          type: operationType as any,
          sourceId: program.id,
          priority: 'medium',
          status: 'scheduled',
          assignedTo: 'Farm Team',
          field: program.field?.name || program.field,
          description: `${program.type}: ${program.product} - ${program.dosage}`,
          equipment: [program.product],
          color: getTypeColor(operationType),
          isDraggable: true,
          estimatedHours: 2,
          weatherDependency: program.type === 'spray',
          notes: program.notes,
          careProgram: program
        });
      }
    });

    // Reminders
    reminders.filter(r => r.status === 'pending').forEach(reminder => {
      events.push({
        id: `reminder-${reminder.id}`,
        title: reminder.title,
        date: reminder.dueDate,
        startTime: '09:00',
        endTime: '10:00',
        type: 'reminder',
        sourceId: reminder.id,
        priority: reminder.priority as any,
        status: 'pending',
        assignedTo: 'Farm Team',
        field: reminder.field,
        description: reminder.title,
        color: getTypeColor('reminder'),
        isDraggable: true,
        estimatedHours: 1
      });
    });

    console.log('Unified events generated:', {
      totalEvents: events.length,
      fieldOps: fieldOperations.length,
      carePrograms: carePrograms.length,
      reminders: reminders.length,
      events: events.map(e => ({ id: e.id, title: e.title, date: e.date, type: e.type }))
    });

    return events;
  }, [fieldOperations, carePrograms, reminders]);

  const filteredEvents = useMemo(() => {
    return unifiedEvents.filter(event => {
      const matchesType = filterType === 'all' || event.type === filterType;
      const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
      const matchesSearch = searchTerm === '' ||
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.field && event.field.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesType && matchesStatus && matchesSearch;
    });
  }, [unifiedEvents, filterType, filterStatus, searchTerm]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventsForDate = (date: string) => {
    return filteredEvents.filter(event => event.date === date);
  };

  const handleDragStart = (event: UnifiedEvent, e: React.DragEvent) => {
    if (!event.isDraggable) return;
    setDraggedEvent(event);
    e.dataTransfer.setData('text/plain', event.id);
    e.dataTransfer.effectAllowed = 'move';
    
    // Add visual feedback
    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
    dragImage.style.transform = 'rotate(5deg)';
    dragImage.style.opacity = '0.8';
    e.dataTransfer.setDragImage(dragImage, 0, 0);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    // Support both move and copy operations
    e.dataTransfer.dropEffect = e.dataTransfer.effectAllowed === 'copy' ? 'copy' : 'move';
    console.log('Drag over - effect allowed:', e.dataTransfer.effectAllowed, 'drop effect:', e.dataTransfer.dropEffect);
  };

  const handleDragEnter = (date: string, e: React.DragEvent) => {
    e.preventDefault();
    console.log('=== DRAG ENTER ===', date);
    console.log('DataTransfer types:', e.dataTransfer.types);
    console.log('Has text/plain:', e.dataTransfer.types.includes('text/plain'));
    
    const draggedData = e.dataTransfer.types.includes('text/plain');
    
    setDropZoneDate(date);
    
    // If we're in add/edit mode or dragging a button, also set the drag target for date setting
    if (showAddEvent || editingEvent || draggedData) {
      setDragTargetDate(date);
      setIsDraggingToCalendar(true);
      console.log('Set drag target date:', date);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    // Only clear if we're leaving the calendar cell completely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDropZoneDate(null);
      setDragTargetDate(null);
      setIsDraggingToCalendar(false);
    }
  };

  const handleDrop = (newDate: string, e: React.DragEvent) => {
    e.preventDefault();
    setDropZoneDate(null);
    setDragTargetDate(null);
    setIsDraggingToCalendar(false);
    
    const draggedData = e.dataTransfer.getData('text/plain');
    console.log('=== DROP EVENT DEBUG ===');
    console.log('Drop date:', newDate);
    console.log('Dragged data:', draggedData);
    console.log('Event dataTransfer types:', e.dataTransfer.types);
    console.log('Fields available:', fields?.length || 0, fields);
    console.log('Current showFieldSelector state:', showFieldSelector);
    
    // If we're in add/edit mode and dragging from modal, set the date in the form
    if ((showAddEvent || editingEvent) && draggedData === 'modal-drag') {
      console.log('Setting date in form for modal drag');
      const dateInput = document.querySelector('input[name="date"]') as HTMLInputElement;
      if (dateInput) {
        dateInput.value = newDate;
        // Trigger change event to update any form state
        dateInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
      return;
    }
    
    // If dragging a button to calendar, show field selector
    if (draggedData.startsWith('button-')) {
      const buttonType = draggedData.split('-')[1] as 'spray' | 'fertilizer' | 'manual';
      console.log('=== BUTTON DRAG DETECTED ===');
      console.log('Button type:', buttonType);
      console.log('Setting pending event data and showing field selector...');
      
      // Store the event data and show field selector
      const pendingData = {
        date: newDate,
        programType: buttonType,
        position: { x: e.clientX, y: e.clientY }
      };
      
      console.log('Pending data:', pendingData);
      console.log('Fields available for selector:', fields?.length || 0);
      
      // Force the modal to show immediately
      setPendingEventData(pendingData);
      setShowFieldSelector(true);
      
      // Double-check the state was set correctly
      setTimeout(() => {
        console.log('=== POST-SET STATE CHECK ===');
        console.log('showFieldSelector should be true');
        console.log('pendingEventData should be set');
        // Force another update if needed
        setShowFieldSelector(true);
      }, 50);
      
      console.log('=== FIELD SELECTOR SHOULD BE VISIBLE NOW ===');
      console.log('showFieldSelector set to true, pendingEventData:', pendingData);
      return;
    }
    
    if (!draggedEvent) {
      console.log('No dragged event found, ending drop handler');
      return;
    }

    console.log('Moving existing event to new date');
    // Update the event date
    updateEventDate(draggedEvent.id, newDate);
    setDraggedEvent(null);
  };

  const handleCellDoubleClick = (date: string, e: React.MouseEvent) => {
    e.preventDefault();
    setQuickAddDate(date);
    setQuickAddPosition({ x: e.clientX, y: e.clientY });
    setShowQuickAdd(true);
  };

  const handleRightClick = (date: string, e: React.MouseEvent) => {
    e.preventDefault();
    setQuickAddDate(date);
    setQuickAddPosition({ x: e.clientX, y: e.clientY });
    setShowQuickAdd(true);
  };

  const updateEventDate = (eventId: string, newDate: string) => {
    const [type, id] = eventId.split('-').slice(0, 2);
    const numericId = parseInt(id);

    switch (type) {
      case 'field':
        setFieldOperations(prev => 
          prev.map(op => 
            op.id === numericId ? { ...op, dueDate: newDate } : op
          )
        );
        break;
      case 'care':
        setCarePrograms((prev: any) =>
          prev.map((program: any) =>
            program.id === id ? { ...program, nextApplication: newDate } : program
          )
        );
        break;
      case 'spray':
        setCarePrograms((prev: any) =>
          prev.map((program: any) =>
            program.id === numericId ? { ...program, nextApplication: newDate } : program
          )
        );
        break;
      case 'reminder':
        setReminders(prev =>
          prev.map(reminder =>
            reminder.id === numericId ? { ...reminder, dueDate: newDate } : reminder
          )
        );
        break;
    }
  };

  const createQuickEvent = (eventType: 'field' | 'spray' | 'reminder', title: string) => {
    if (!quickAddDate) return;

    const newId = Date.now(); // Simple ID generation
    const newEvent = {
      id: newId,
      title,
      dueDate: quickAddDate,
      ...(eventType === 'field' && {
        type: 'planting' as const,
        priority: 'medium' as const,
        fieldId: 1,
        assignedTo: 'Farm Manager'
      }),
      ...(eventType === 'spray' && {
        nextApplication: quickAddDate,
        fieldId: 1,
        product: title,
        dosage: '1L/ha'
      }),
      ...(eventType === 'reminder' && {
        description: title,
        priority: 'medium' as const
      })
    };

    switch (eventType) {
      case 'field':
        setFieldOperations(prev => [...prev, newEvent as any]);
        break;
      case 'spray':
        setCarePrograms((prev: any) => [...prev, newEvent as any]);
        break;
      case 'reminder':
        setReminders(prev => [...prev, newEvent as any]);
        break;
    }

    setShowQuickAdd(false);
    setQuickAddDate(null);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + (direction === 'next' ? 1 : -1), 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getViewTitle = () => {
    switch (viewMode) {
      case 'month':
        return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      case 'week':
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      case 'day':
        return currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
      case 'kanban':
        return 'Operations Board';
      default:
        return '';
    }
  };

  // Kanban Board Component
  const renderKanbanView = () => {
    const columns = [
      { id: 'scheduled', title: 'Scheduled', color: 'bg-blue-100 border-blue-300' },
      { id: 'in-progress', title: 'In Progress', color: 'bg-yellow-100 border-yellow-300' },
      { id: 'completed', title: 'Completed', color: 'bg-green-100 border-green-300' },
      { id: 'pending', title: 'Pending', color: 'bg-orange-100 border-orange-300' }
    ];

    const getEventsByStatus = (status: string) => {
      return filteredEvents.filter(event => event.status === status);
    };

    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
        {columns.map((column) => (
          <div
            key={column.id}
            className={`${column.color} rounded-lg p-4 border-2`}
            onDragOver={handleDragOver}
            onDrop={(e) => {
              e.preventDefault();
              if (draggedEvent) {
                // Update status instead of date for kanban
                updateEventStatus(draggedEvent.id, column.id);
                setDraggedEvent(null);
              }
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-800">{column.title}</h4>
              <span className="bg-white text-gray-600 text-xs px-2 py-1 rounded-full">
                {getEventsByStatus(column.id).length}
              </span>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {getEventsByStatus(column.id).map((event) => (
                <div
                  key={event.id}
                  draggable={event.isDraggable}
                  onDragStart={(e) => handleDragStart(event, e)}
                  className={`bg-white rounded-xl p-4 shadow-md border-l-4 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-102 ${getPriorityColor(event.priority)} ${
                    recentlyCreatedEvent === event.id ? 'ring-4 ring-yellow-400 ring-opacity-100 animate-pulse scale-105 shadow-lg shadow-yellow-200 border-yellow-300 bg-gradient-to-br from-yellow-50 to-white' : ''
                  } relative group`}
                  onClick={() => setSelectedEvent(event)}
                  title={recentlyCreatedEvent === event.id ? 'Recently created - Click to edit!' : ''}
                  style={{
                    background: recentlyCreatedEvent === event.id 
                      ? 'linear-gradient(135deg, #fef3c7, #ffffff)'
                      : undefined
                  }}
                >
                  {/* Sticker corner peel effect */}
                  <div className="absolute top-0 right-0 w-0 h-0 border-l-6 border-b-6 border-l-transparent border-b-gray-100 opacity-30"></div>
                  
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-semibold text-gray-900 text-sm leading-tight pr-2">
                      {event.title}
                      {recentlyCreatedEvent === event.id && (
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-bold animate-bounce">
                            NEW STICKER
                          </span>
                          <i className="ri-edit-line text-blue-600 animate-bounce" title="Click to edit"></i>
                        </div>
                      )}
                    </h5>
                    <div className={`w-4 h-4 rounded-full ${event.color} flex-shrink-0 shadow-sm`}></div>
                  </div>

                  <p className="text-xs text-gray-600 mb-2 font-medium">
                    📍 {event.field}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <span className="bg-gray-100 px-2 py-1 rounded-full">📅 {event.date}</span>
                    <span className="bg-gray-100 px-2 py-1 rounded-full">👤 {event.assignedTo}</span>
                  </div>

                  {/* Highlight glow for new stickers */}
                  {recentlyCreatedEvent === event.id && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-yellow-200 to-transparent opacity-20 pointer-events-none animate-pulse"></div>
                  )}

                  {event.progress !== undefined && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${event.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const updateEventStatus = (eventId: string, newStatus: string) => {
    const [type, id] = eventId.split('-').slice(0, 2);
    const numericId = parseInt(id);

    switch (type) {
      case 'field':
        setFieldOperations(prev => 
          prev.map(op => 
            op.id === numericId ? { ...op, status: newStatus } : op
          )
        );
        break;
      case 'care':
        setCarePrograms((prev: any) =>
          prev.map((program: any) =>
            program.id === id ? { ...program, status: newStatus } : program
          )
        );
        break;
    }
  };

  // Month View Component
  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="min-h-32 border border-gray-200 bg-gray-50/50"></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
      const dayEvents = getEventsForDate(date);
      const isToday = date === formatDate(new Date());

      days.push(
        <div
          key={day}
          className={`min-h-32 border border-gray-200 p-2 bg-white hover:bg-gray-50 transition-colors ${
            isToday ? 'bg-blue-50 border-blue-300 ring-1 ring-blue-300' : ''
          } ${dropZoneDate === date ? 'bg-green-100 border-green-400 border-dashed ring-2 ring-green-200' : ''} ${
            dragTargetDate === date && isDraggingToCalendar ? 'bg-blue-100 border-blue-400 border-dashed ring-2 ring-blue-200' : ''
          }`}
          title={
            dragTargetDate === date && isDraggingToCalendar 
              ? `Drop to set date to ${date}` 
              : dropZoneDate === date 
                ? `Drop here to move event to ${date}` 
                : `Double-click to add event to ${date} • Drag buttons here to quick-add`
          }
          onDragOver={handleDragOver}
          onDragEnter={(e) => handleDragEnter(date, e)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(date, e)}
          onDoubleClick={(e) => handleCellDoubleClick(date, e)}
          onContextMenu={(e) => handleRightClick(date, e)}
        >
          <div className={`text-sm font-semibold mb-2 flex items-center justify-between ${
            isToday ? 'text-blue-600' : 'text-gray-900'
          }`}>
            <span>{day}</span>
            {dayEvents.length > 0 && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-medium">
                {dayEvents.length}
              </span>
            )}
          </div>

          <div className="space-y-1">
            {dayEvents.slice(0, 3).map((event) => (
              <div
                key={event.id}
                draggable={event.isDraggable}
                onDragStart={(e) => handleDragStart(event, e)}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedEvent(event);
                }}
                className={`${event.color} text-white text-xs p-2 rounded-lg cursor-pointer hover:opacity-90 transition-all duration-200 shadow-md border-l-4 ${getPriorityColor(event.priority)} ${
                  draggedEvent?.id === event.id ? 'opacity-50 rotate-3 scale-95' : ''
                } ${
                  recentlyCreatedEvent === event.id ? 'ring-4 ring-yellow-400 ring-opacity-100 animate-pulse scale-110 shadow-lg shadow-yellow-200 border-yellow-300' : ''
                } relative group hover:scale-105 hover:shadow-lg transform`}
                title={`${event.title} - ${formatTime(event.startTime)} ${recentlyCreatedEvent === event.id ? '(Recently created - Click to edit!)' : ''}`}
                style={{
                  background: recentlyCreatedEvent === event.id 
                    ? `linear-gradient(135deg, ${event.color.replace('bg-', '')}, ${event.color.replace('bg-', '')}-400)`
                    : undefined
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="truncate font-semibold text-shadow-sm">{formatTime(event.startTime)}</span>
                  {recentlyCreatedEvent === event.id && (
                    <div className="flex items-center space-x-1">
                      <span className="bg-yellow-400 text-yellow-900 text-xs px-1.5 py-0.5 rounded-full font-bold animate-bounce">NEW</span>
                      <i className="ri-edit-line animate-bounce text-yellow-200" title="Click to edit"></i>
                    </div>
                  )}
                </div>
                <div className="truncate font-bold mt-1 text-shadow-sm">{event.title}</div>
                <div className="text-xs opacity-90 truncate">{event.field}</div>
                
                {/* Sticker effect - corner peel */}
                <div className="absolute top-0 right-0 w-0 h-0 border-l-4 border-b-4 border-l-transparent border-b-white opacity-20"></div>
                
                {/* Highlight glow for new events */}
                {recentlyCreatedEvent === event.id && (
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-yellow-200 to-transparent opacity-30 pointer-events-none animate-pulse"></div>
                )}
              </div>
            ))}
            {dayEvents.length > 3 && (
              <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded text-center font-medium">
                +{dayEvents.length - 3} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-0 bg-white rounded-lg overflow-hidden shadow-sm border">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="bg-gray-100 border-b border-gray-200 p-3 text-center font-semibold text-gray-700">
            {day}
          </div>
        ))}
        {days}
      </div>
    );
  };

  const renderCurrentView = () => {
    switch (viewMode) {
      case 'month':
        return renderMonthView();
      case 'kanban':
        return renderKanbanView();
      default:
        return renderMonthView();
    }
  };

  const addEventFromProgram = (programType: 'spray' | 'fertilizer') => {
    const availablePrograms = carePrograms.filter((program: any) => 
      program.type === programType && program.status === 'active'
    );

    if (availablePrograms.length === 0) {
      alert(`No active ${programType} programs available`);
      return;
    }

    // Show program selection modal with pre-selected type
    setShowAddEvent(true);
    
    // Pre-fill the form with the selected program type
    setTimeout(() => {
      const typeSelect = document.querySelector('select[name="type"]') as HTMLSelectElement;
      if (typeSelect) {
        typeSelect.value = programType === 'spray' ? 'spray-program' : 'fertilizer-program';
        typeSelect.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, 100);
  };

  const handleButtonDragToCalendar = (date: string, programType: 'spray' | 'fertilizer' | 'manual', selectedField?: any) => {
    // Create a new event with the dropped date and button type
    const newId = Date.now();
    
    // Use the selected field or default to the first available field
    const targetField = selectedField || (fields && fields.length > 0 ? fields[0] : { id: 'A', name: 'Main Field' });
    const fieldName = targetField.name || `Field ${targetField.id}`;
    const fieldId = targetField.id;
    
    console.log('Creating event with field:', { fieldName, fieldId, targetField, allFields: fields });
    
    // Directly add to the appropriate state array for immediate visibility
    if (programType === 'spray') {
      const newSprayProgram = {
        id: newId,
        name: `Spray Application - ${fieldName}`,
        title: `Spray Application - ${fieldName}`,
        nextApplication: date,
        field: fieldName,
        fieldId: fieldId,
        product: 'Spray Product',
        dosage: '1L/ha',
        type: 'spray' as const,
        status: 'active' as const,
        priority: 'medium' as const,
        assignedTo: 'Farm Manager',
        description: `Spray application created by drag & drop for ${fieldName}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        notes: `Created by drag and drop for ${fieldName} on ${date}`
      };
      setCarePrograms((prev: any) => [...prev, newSprayProgram]);
    } else if (programType === 'fertilizer') {
      const newFertilizerProgram = {
        id: newId,
        name: `Fertilizer Application - ${fieldName}`,
        title: `Fertilizer Application - ${fieldName}`,
        nextApplication: date,
        field: fieldName,
        fieldId: fieldId,
        product: 'Fertilizer Product',
        dosage: '2kg/ha',
        type: 'fertilizer' as const,
        status: 'active' as const,
        priority: 'medium' as const,
        assignedTo: 'Farm Manager',
        description: `Fertilizer application created by drag & drop for ${fieldName}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        notes: `Created by drag and drop for ${fieldName} on ${date}`
      };
      setCarePrograms((prev: any) => [...prev, newFertilizerProgram]);
    } else {
      const newFieldOperation = {
        id: newId,
        title: `Field Operation - ${fieldName}`,
        dueDate: date,
        estimatedHours: 4,
        field: fieldName,
        fieldId: fieldId,
        type: 'field-operation' as const,
        status: 'scheduled' as const,
        priority: 'medium' as const,
        assignedTo: 'Farm Manager',
        description: `Field operation created by drag & drop for ${fieldName}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: [],
        progress: 0
      };
      setFieldOperations(prev => [...prev, newFieldOperation]);
    }

    // Show success feedback
    const eventId = programType === 'spray' ? `spray-${newId}` : programType === 'fertilizer' ? `spray-${newId}` : `field-op-${newId}`;
    setRecentlyCreatedEvent(eventId);
    
    // Show success toast
    setSuccessMessage(`${programType === 'spray' ? 'Spray' : programType === 'fertilizer' ? 'Fertilizer' : 'Field'} sticker added to ${date} for ${fieldName}! Click the highlighted sticker to edit.`);
    setShowSuccessToast(true);
    
    // Clear the highlight and toast after 3 seconds
    setTimeout(() => {
      setRecentlyCreatedEvent(null);
      setShowSuccessToast(false);
    }, 3000);
    
    console.log(`${programType} event created successfully for ${date}`, { eventId, date, field: fieldName, fieldId });
  };

  const handleAddEvent = (eventData: any) => {
    const newId = Date.now();
    const newEvent = {
      id: newId,
      ...eventData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Check if it's a field operation type (including all the new types)
    const fieldOperationTypes = [
      'field-operation', 'planting', 'cultivation', 'pruning', 'harvesting', 
      'irrigation', 'weeding', 'mulching', 'transplanting', 'soil-preparation', 
      'composting', 'equipment-maintenance'
    ];

    if (fieldOperationTypes.includes(eventData.type)) {
      setFieldOperations(prev => [...prev, {
        ...newEvent,
        dueDate: eventData.date,
        status: eventData.status || 'scheduled',
        priority: eventData.priority || 'medium',
        estimatedHours: eventData.estimatedHours || 4,
        assignedTo: eventData.assignedTo || 'Farm Manager',
        field: eventData.field || 'Field 1',
        type: eventData.type // Keep the specific operation type
      }]);
    } else if (eventData.type === 'spray-program') {
      setCarePrograms((prev: any) => [...prev, {
        ...newEvent,
        nextApplication: eventData.date,
        status: eventData.status || 'scheduled',
        fieldId: eventData.fieldId || 1,
        product: eventData.product || eventData.title,
        dosage: eventData.dosage || '1L/ha',
        type: 'spray'
      }]);
    } else if (eventData.type === 'fertilizer-program') {
      setCarePrograms((prev: any) => [...prev, {
        ...newEvent,
        nextApplication: eventData.date,
        status: eventData.status || 'scheduled',
        fieldId: eventData.fieldId || 1,
        product: eventData.product || eventData.title,
        dosage: eventData.dosage || '1L/ha',
        type: 'fertilizer'
      }]);
    } else if (eventData.type === 'reminder') {
      setReminders(prev => [...prev, {
        ...newEvent,
        dueDate: eventData.date,
        status: eventData.status || 'pending',
        priority: eventData.priority || 'medium'
      }]);
    }
  };

  const handleUpdateEvent = (eventId: string, eventData: any) => {
    const [type, id] = eventId.split('-').slice(0, 2);
    const numericId = parseInt(id);

    switch (type) {
      case 'field':
        setFieldOperations(prev => 
          prev.map(op => 
            op.id === numericId ? { ...op, ...eventData, updatedAt: new Date().toISOString() } : op
          )
        );
        break;
      case 'care':
        setCarePrograms((prev: any) =>
          prev.map((program: any) =>
            program.id === id ? { ...program, ...eventData, updatedAt: new Date().toISOString() } : program
          )
        );
        break;
      case 'spray':
        setCarePrograms((prev: any) =>
          prev.map((program: any) =>
            program.id === numericId ? { ...program, ...eventData, updatedAt: new Date().toISOString() } : program
          )
        );
        break;
      case 'reminder':
        setReminders(prev =>
          prev.map(reminder =>
            reminder.id === numericId ? { ...reminder, ...eventData, updatedAt: new Date().toISOString() } : reminder
          )
        );
        break;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-9xl h-[95vh] flex flex-col shadow-2xl relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-600 px-6 py-4 text-white rounded-t-xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Unified Operations Calendar</h2>
              <p className="text-green-100 mt-1">Drag & drop operations management with program integration</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-green-200 transition-colors cursor-pointer p-2 hover:bg-white/10 rounded-lg"
            >
              <i className="ri-close-line w-6 h-6 flex items-center justify-center"></i>
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 border-b bg-gradient-to-r from-gray-50 to-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Navigation */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white rounded-lg shadow-sm border p-1">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  <i className="ri-arrow-left-line"></i>
                </button>
                <h3 className="text-lg font-semibold text-gray-900 min-w-[250px] text-center px-4">
                  {getViewTitle()}
                </h3>
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  <i className="ri-arrow-right-line"></i>
                </button>
              </div>

              <button
                onClick={goToToday}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap font-medium shadow-sm"
              >
                <i className="ri-focus-3-line mr-2"></i>Today
              </button>
            </div>

            {/* View buttons */}
            <div className="flex items-center space-x-1 bg-white rounded-lg shadow-sm border p-1">
              {[
                { mode: 'month', label: 'Month', icon: 'ri-calendar-line' },
                { mode: 'kanban', label: 'Board', icon: 'ri-kanban-view' }
              ].map((view) => (
                <button
                  key={view.mode}
                  onClick={() => setViewMode(view.mode as any)}
                  className={`px-4 py-2 text-sm rounded-lg cursor-pointer whitespace-nowrap transition-all font-medium ${
                    viewMode === view.mode
                      ? 'bg-green-600 text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <i className={`${view.icon} mr-2`}></i>
                  {view.label}
                </button>
              ))}
            </div>

            {/* Quick Add Buttons */}
            <div className="flex items-center space-x-2">
              <button
                draggable
                onDragStart={(e) => {
                  console.log('=== SPRAY BUTTON DRAG START ===');
                  e.dataTransfer.setData('text/plain', 'button-spray');
                  e.dataTransfer.effectAllowed = 'copy';
                  setIsDraggingToCalendar(true);
                  console.log('Drag data set to: button-spray');
                  console.log('DataTransfer object:', e.dataTransfer);
                }}
                onDragEnd={() => {
                  console.log('Spray button drag ended');
                  setIsDraggingToCalendar(false);
                  setDragTargetDate(null);
                }}
                onClick={() => addEventFromProgram('spray')}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors cursor-grab active:cursor-grabbing whitespace-nowrap font-medium shadow-sm text-sm relative group border-2 border-purple-400"
                title="🖱️ DRAG ME to calendar date or click to add spray program"
              >
                <i className="ri-drop-line mr-2"></i>🖱️ Add Spray
                <span className="absolute top-0 right-0 transform translate-x-1 -translate-y-1 bg-yellow-500 text-black text-xs px-1 rounded-full opacity-100 group-hover:opacity-100 transition-opacity font-bold">
                  DRAG
                </span>
              </button>
              <button
                draggable
                onDragStart={(e) => {
                  console.log('=== FERTILIZER BUTTON DRAG START ===');
                  e.dataTransfer.setData('text/plain', 'button-fertilizer');
                  e.dataTransfer.effectAllowed = 'copy';
                  setIsDraggingToCalendar(true);
                  console.log('Drag data set to: button-fertilizer');
                  console.log('DataTransfer object:', e.dataTransfer);
                }}
                onDragEnd={() => {
                  console.log('Fertilizer button drag ended');
                  setIsDraggingToCalendar(false);
                  setDragTargetDate(null);
                }}
                onClick={() => addEventFromProgram('fertilizer')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-grab active:cursor-grabbing whitespace-nowrap font-medium shadow-sm text-sm relative group border-2 border-green-400"
                title="🖱️ DRAG ME to calendar date or click to add fertilizer program"
              >
                <i className="ri-leaf-line mr-2"></i>🖱️ Add Fertilizer
                <span className="absolute top-0 right-0 transform translate-x-1 -translate-y-1 bg-yellow-500 text-black text-xs px-1 rounded-full opacity-100 group-hover:opacity-100 transition-opacity font-bold">
                  DRAG
                </span>
              </button>
              <button
                draggable
                onDragStart={(e) => {
                  console.log('=== MANUAL BUTTON DRAG START ===');
                  e.dataTransfer.setData('text/plain', 'button-manual');
                  e.dataTransfer.effectAllowed = 'copy';
                  setIsDraggingToCalendar(true);
                  console.log('Drag data set to: button-manual');
                  console.log('DataTransfer object:', e.dataTransfer);
                }}
                onDragEnd={() => {
                  console.log('Manual button drag ended');
                  setIsDraggingToCalendar(false);
                  setDragTargetDate(null);
                }}
                onClick={() => setShowAddEvent(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-grab active:cursor-grabbing whitespace-nowrap font-medium shadow-sm text-sm relative group border-2 border-blue-400"
                title="🖱️ DRAG ME to calendar date or click to add manual event"
              >
                <i className="ri-add-line mr-2"></i>🖱️ Add Manual
                <span className="absolute top-0 right-0 transform translate-x-1 -translate-y-1 bg-yellow-500 text-black text-xs px-1 rounded-full opacity-100 group-hover:opacity-100 transition-opacity font-bold">
                  DRAG
                </span>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Search operations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8"
            >
              <option value="all">All Types</option>
              <optgroup label="Field Operations">
                <option value="field-operation">General Field Operations</option>
                <option value="planting">Planting/Seeding</option>
                <option value="cultivation">Cultivation/Tilling</option>
                <option value="pruning">Pruning/Trimming</option>
                <option value="harvesting">Harvesting</option>
                <option value="irrigation">Irrigation</option>
                <option value="weeding">Weeding</option>
                <option value="mulching">Mulching</option>
                <option value="transplanting">Transplanting</option>
                <option value="soil-preparation">Soil Preparation</option>
                <option value="composting">Composting</option>
                <option value="equipment-maintenance">Equipment Maintenance</option>
              </optgroup>
              <optgroup label="Care Programs">
                <option value="spray-program">Spray Programs</option>
                <option value="fertilizer-program">Fertilizer Programs</option>
                <option value="pest-control">Pest Control</option>
                <option value="disease-control">Disease Control</option>
              </optgroup>
              <optgroup label="Other">
                <option value="reminder">Reminders</option>
                <option value="manual">Manual Events</option>
              </optgroup>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Drag & Drop:</span>
              <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                Enabled
              </span>
            </div>

            <div className="text-sm bg-gray-100 px-3 py-2 rounded-lg flex items-center justify-center">
              <span className="font-medium text-gray-700">{filteredEvents.length} events</span>
            </div>

            <div className="text-xs bg-blue-50 border border-blue-200 px-3 py-2 rounded-lg flex items-center justify-center">
              <i className="ri-information-line mr-1 text-blue-600"></i>
              <span className="text-blue-700">💡 Drag buttons to calendar dates for quick event creation</span>
            </div>

            {isDraggingToCalendar && (
              <div className="text-sm bg-yellow-100 border border-yellow-400 px-3 py-2 rounded-lg flex items-center justify-center animate-bounce">
                <i className="ri-drag-drop-line mr-2 text-yellow-600"></i>
                <span className="font-bold text-yellow-800">🎯 DROP buttons on calendar dates to create events!</span>
              </div>
            )}
          </div>
        </div>

        {/* Calendar view */}
        <div className="flex-1 overflow-hidden p-6 bg-gray-50">
          {renderCurrentView()}
        </div>

        {/* Legend */}
        <div className="p-4 border-t bg-white rounded-b-xl">
          <div className="flex flex-wrap justify-center gap-4 text-xs">
            {[
              { type: 'planting', label: 'Planting', color: 'bg-green-600' },
              { type: 'cultivation', label: 'Cultivation', color: 'bg-amber-600' },
              { type: 'pruning', label: 'Pruning', color: 'bg-emerald-600' },
              { type: 'harvesting', label: 'Harvesting', color: 'bg-yellow-600' },
              { type: 'irrigation', label: 'Irrigation/Watering', color: 'bg-cyan-500' },
              { type: 'spray-program', label: 'Spray Programs', color: 'bg-purple-500' },
              { type: 'fertilizer-program', label: 'Fertilizer', color: 'bg-green-500' },
              { type: 'pest-control', label: 'Pest Control', color: 'bg-red-500' },
              { type: 'disease-control', label: 'Disease Control', color: 'bg-pink-500' },
              { type: 'reminder', label: 'Reminders', color: 'bg-orange-500' }
            ].map((item) => (
              <div key={item.type} className="flex items-center space-x-1">
                <div className={`w-3 h-3 ${item.color} rounded-full`}></div>
                <span className="font-medium text-gray-700">{item.label}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-500 mt-2">
            <i className="ri-information-line mr-1"></i>
            Field operations include: weeding, mulching, transplanting, soil preparation, composting, equipment maintenance & more
          </p>
        </div>
      </div>

      {/* Quick Add Modal */}
      {showQuickAdd && quickAddDate && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4"
          onClick={() => setShowQuickAdd(false)}
        >
          <div 
            className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl"
            style={{ 
              position: 'absolute',
              left: Math.min(quickAddPosition.x, window.innerWidth - 400),
              top: Math.min(quickAddPosition.y, window.innerHeight - 300)
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Quick Add Event - {quickAddDate}
              </h3>
              <button
                onClick={() => setShowQuickAdd(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            
            <div className="space-y-3">
              {[
                { type: 'field', label: 'Field Operation', icon: 'ri-plant-line', color: 'bg-blue-600' },
                { type: 'spray', label: 'Spray Program', icon: 'ri-drop-line', color: 'bg-purple-600' },
                { type: 'reminder', label: 'Reminder', icon: 'ri-notification-line', color: 'bg-orange-600' }
              ].map((option) => (
                <button
                  key={option.type}
                  onClick={() => {
                    const title = prompt(`Enter ${option.label} title:`);
                    if (title) {
                      createQuickEvent(option.type as 'field' | 'spray' | 'reminder', title);
                    }
                  }}
                  className={`w-full ${option.color} text-white p-3 rounded-lg hover:opacity-90 transition-opacity flex items-center`}
                >
                  <i className={`${option.icon} mr-3`}></i>
                  Add {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {showAddEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className={`bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl transition-all duration-200 ${
            isDraggingToCalendar ? 'ring-4 ring-blue-200 border-blue-300' : ''
          }`}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Add New Event</h3>
                {isDraggingToCalendar && (
                  <p className="text-sm text-blue-600 mt-1">
                    <i className="ri-information-line mr-1"></i>
                    Drag the date icon to any calendar cell to set the date
                  </p>
                )}
              </div>
              <button
                onClick={() => {
                  setShowAddEvent(false);
                  setIsDraggingToCalendar(false);
                  setDragTargetDate(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const eventData = {
                title: formData.get('title'),
                type: formData.get('type'),
                date: formData.get('date'),
                startTime: formData.get('startTime'),
                endTime: formData.get('endTime'),
                description: formData.get('description'),
                priority: formData.get('priority'),
                assignedTo: formData.get('assignedTo'),
                field: formData.get('field'),
                status: 'scheduled'
              };
              handleAddEvent(eventData);
              setShowAddEvent(false);
              setIsDraggingToCalendar(false);
              setDragTargetDate(null);
            }}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      name="title"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Event title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      name="type"
                      required
                      defaultValue="field-operation"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <optgroup label="Field Operations">
                        <option value="field-operation">General Field Operation</option>
                        <option value="planting">Planting/Seeding</option>
                        <option value="cultivation">Cultivation/Tilling</option>
                        <option value="pruning">Pruning/Trimming</option>
                        <option value="harvesting">Harvesting</option>
                        <option value="irrigation">Irrigation</option>
                        <option value="weeding">Weeding</option>
                        <option value="mulching">Mulching</option>
                        <option value="transplanting">Transplanting</option>
                        <option value="soil-preparation">Soil Preparation</option>
                        <option value="composting">Composting</option>
                        <option value="equipment-maintenance">Equipment Maintenance</option>
                      </optgroup>
                      <optgroup label="Application Programs">
                        <option value="spray-program">Spray Program</option>
                        <option value="fertilizer-program">Fertilizer Program</option>
                      </optgroup>
                      <optgroup label="Other">
                        <option value="reminder">Reminder</option>
                        <option value="manual">Manual Event</option>
                      </optgroup>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        name="date"
                        required
                        defaultValue={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <div
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('text/plain', 'modal-drag');
                          e.dataTransfer.effectAllowed = 'copy';
                          setIsDraggingToCalendar(true);
                        }}
                        onDragEnd={() => {
                          setIsDraggingToCalendar(false);
                          setDragTargetDate(null);
                        }}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-move p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Drag to calendar to set date"
                      >
                        <i className="ri-drag-move-line"></i>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      <i className="ri-information-line mr-1"></i>
                      Drag the <i className="ri-drag-move-line"></i> icon to a calendar date
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                    <input
                      type="time"
                      name="startTime"
                      defaultValue="08:00"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    <input
                      type="time"
                      name="endTime"
                      defaultValue="12:00"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      name="priority"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                    <select
                      name="assignedTo"
                      defaultValue="Farm Manager"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="Farm Manager">Farm Manager</option>
                      <option value="Joseph Pacho">Joseph Pacho</option>
                      <option value="Field Supervisor">Field Supervisor</option>
                      <option value="Farm Team">Farm Team</option>
                      <option value="Equipment Operator">Equipment Operator</option>
                      <option value="Irrigation Specialist">Irrigation Specialist</option>
                      <option value="Harvest Crew">Harvest Crew</option>
                      <option value="Maintenance Team">Maintenance Team</option>
                      <option value="Quality Control">Quality Control</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Field</label>
                  <select
                    name="field"
                    defaultValue={fields && fields.length > 0 ? fields[0].name : ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select field</option>
                    {fields && fields.map((field) => (
                      <option key={field.id} value={field.name}>
                        {field.name} ({field.size} - {field.crop})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Event description"
                  ></textarea>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Add Event
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddEvent(false);
                      setIsDraggingToCalendar(false);
                      setDragTargetDate(null);
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {editingEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className={`bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl transition-all duration-200 ${
            isDraggingToCalendar ? 'ring-4 ring-blue-200 border-blue-300' : ''
          }`}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Edit Event</h3>
                {isDraggingToCalendar && (
                  <p className="text-sm text-blue-600 mt-1">
                    <i className="ri-information-line mr-1"></i>
                    Drag the date icon to any calendar cell to set the date
                  </p>
                )}
              </div>
              <button
                onClick={() => {
                  setEditingEvent(null);
                  setIsDraggingToCalendar(false);
                  setDragTargetDate(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const eventData = {
                title: formData.get('title'),
                type: formData.get('type'),
                date: formData.get('date'),
                startTime: formData.get('startTime'),
                endTime: formData.get('endTime'),
                description: formData.get('description'),
                priority: formData.get('priority'),
                assignedTo: formData.get('assignedTo'),
                field: formData.get('field'),
                status: formData.get('status')
              };
              handleUpdateEvent(editingEvent.id, eventData);
              setEditingEvent(null);
              setIsDraggingToCalendar(false);
              setDragTargetDate(null);
            }}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      name="title"
                      required
                      defaultValue={editingEvent.title}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Event title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      name="type"
                      required
                      defaultValue={editingEvent.type}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <optgroup label="Field Operations">
                        <option value="field-operation">General Field Operation</option>
                        <option value="planting">Planting/Seeding</option>
                        <option value="cultivation">Cultivation/Tilling</option>
                        <option value="pruning">Pruning/Trimming</option>
                        <option value="harvesting">Harvesting</option>
                        <option value="irrigation">Irrigation</option>
                        <option value="weeding">Weeding</option>
                        <option value="mulching">Mulching</option>
                        <option value="transplanting">Transplanting</option>
                        <option value="soil-preparation">Soil Preparation</option>
                        <option value="composting">Composting</option>
                        <option value="equipment-maintenance">Equipment Maintenance</option>
                      </optgroup>
                      <optgroup label="Application Programs">
                        <option value="spray-program">Spray Program</option>
                        <option value="fertilizer-program">Fertilizer Program</option>
                      </optgroup>
                      <optgroup label="Other">
                        <option value="reminder">Reminder</option>
                        <option value="manual">Manual Event</option>
                      </optgroup>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        name="date"
                        required
                        defaultValue={editingEvent.date}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <div
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('text/plain', 'modal-drag');
                          e.dataTransfer.effectAllowed = 'copy';
                          setIsDraggingToCalendar(true);
                        }}
                        onDragEnd={() => {
                          setIsDraggingToCalendar(false);
                          setDragTargetDate(null);
                        }}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-move p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Drag to calendar to set date"
                      >
                        <i className="ri-drag-move-line"></i>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      <i className="ri-information-line mr-1"></i>
                      Drag the <i className="ri-drag-move-line"></i> icon to a calendar date
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                    <input
                      type="time"
                      name="startTime"
                      defaultValue={editingEvent.startTime}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    <input
                      type="time"
                      name="endTime"
                      defaultValue={editingEvent.endTime}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      name="priority"
                      defaultValue={editingEvent.priority}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      name="status"
                      defaultValue={editingEvent.status}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                  <select
                    name="assignedTo"
                    defaultValue={editingEvent.assignedTo}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select assignee</option>
                    <option value="Farm Manager">Farm Manager</option>
                    <option value="Joseph Pacho">Joseph Pacho</option>
                    <option value="Field Supervisor">Field Supervisor</option>
                    <option value="Farm Team">Farm Team</option>
                    <option value="Equipment Operator">Equipment Operator</option>
                    <option value="Irrigation Specialist">Irrigation Specialist</option>
                    <option value="Harvest Crew">Harvest Crew</option>
                    <option value="Maintenance Team">Maintenance Team</option>
                    <option value="Quality Control">Quality Control</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Field</label>
                  <select
                    name="field"
                    defaultValue={editingEvent.field}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select field</option>
                    {fields && fields.map((field) => (
                      <option key={field.id} value={field.name}>
                        {field.name} ({field.size} - {field.crop})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    rows={3}
                    defaultValue={editingEvent.description}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Event description"
                  ></textarea>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Update Event
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingEvent(null);
                      setIsDraggingToCalendar(false);
                      setDragTargetDate(null);
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Event Detail Modal */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onEdit={(event) => {
            setEditingEvent(event);
            setSelectedEvent(null);
          }}
          onDelete={(eventId) => {
            // Handle deletion based on event type
            const [type, id] = eventId.split('-').slice(0, 2);
            const numericId = parseInt(id);

            switch (type) {
              case 'field':
                setFieldOperations(prev => prev.filter(op => op.id !== numericId));
                break;
              case 'reminder':
                setReminders(prev => prev.filter(r => r.id !== numericId));
                break;
            }
            setSelectedEvent(null);
          }}
        />
      )}

      {/* Field Selector Modal */}
      {showFieldSelector && pendingEventData && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center modal-backdrop"
          style={{ zIndex: 9999 }}
          onClick={() => {
            console.log('Field selector backdrop clicked, closing modal');
            setShowFieldSelector(false);
            setPendingEventData(null);
          }}
        >
          <div 
            className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl transform transition-all border-4 border-red-500 modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <i className={`${pendingEventData.programType === 'spray' ? 'ri-drop-line text-purple-600' : pendingEventData.programType === 'fertilizer' ? 'ri-leaf-line text-green-600' : 'ri-plant-line text-blue-600'} mr-2 text-2xl`}></i>
                  Choose Field - VISIBLE!
                </h3>
                <p className="text-sm text-gray-600 mt-1 font-bold">
                  🎯 Select field for {pendingEventData.programType} program on {pendingEventData.date}
                  <br />
                  <span className="text-red-600">Modal is working! Fields: {fields?.length || 0}</span>
                </p>
              </div>
              <button
                onClick={() => {
                  setShowFieldSelector(false);
                  setPendingEventData(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {fields && fields.length > 0 ? fields.map((field) => (
                <button
                  key={field.id}
                  onClick={() => {
                    handleButtonDragToCalendar(pendingEventData.date, pendingEventData.programType, field);
                    setShowFieldSelector(false);
                    setPendingEventData(null);
                  }}
                  className="w-full bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg hover:from-blue-50 hover:to-blue-100 transition-all border border-gray-200 hover:border-blue-300 text-left group shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 group-hover:text-blue-900">
                        {field.name}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {field.size} • {field.crop} • {field.status}
                      </div>
                      {field.description && (
                        <div className="text-xs text-gray-500 mt-1 truncate">
                          {field.description}
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${field.status === 'growing' ? 'bg-green-500' : field.status === 'harvested' ? 'bg-yellow-500' : 'bg-gray-400'}`}></div>
                      <i className="ri-arrow-right-line text-gray-400 group-hover:text-blue-600 transition-colors"></i>
                    </div>
                  </div>
                </button>
              )) : (
                <div className="text-center py-8 text-gray-500">
                  <i className="ri-plant-line text-4xl mb-2"></i>
                  <p>No fields available</p>
                  <button
                    onClick={() => {
                      // Use default field
                      handleButtonDragToCalendar(pendingEventData.date, pendingEventData.programType);
                      setShowFieldSelector(false);
                      setPendingEventData(null);
                    }}
                    className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create with Default Field
                  </button>
                </div>
              )}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => {
                    setShowFieldSelector(false);
                    setPendingEventData(null);
                  }}
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                {fields && fields.length > 0 && (
                  <button
                    onClick={() => {
                      // Use first field as default
                      handleButtonDragToCalendar(pendingEventData.date, pendingEventData.programType, fields[0]);
                      setShowFieldSelector(false);
                      setPendingEventData(null);
                    }}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                  >
                    Use First Field
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-4 right-4 z-[80] bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl shadow-2xl flex items-center space-x-4 animate-bounce border-2 border-green-300 transform hover:scale-105 transition-all">
          {/* Sticker corner peel */}
          <div className="absolute top-0 right-0 w-0 h-0 border-l-8 border-b-8 border-l-transparent border-b-white opacity-20"></div>
          
          <div className="flex items-center space-x-3">
            <div className="bg-white rounded-full p-2">
              <i className="ri-checkbox-circle-fill text-green-600 text-xl"></i>
            </div>
            <div>
              <div className="font-bold text-lg">Sticker Added! 🎯</div>
              <div className="font-medium opacity-90">{successMessage}</div>
            </div>
          </div>
          
          <button
            onClick={() => setShowSuccessToast(false)}
            className="text-white hover:text-green-200 ml-4 bg-white bg-opacity-20 rounded-full p-1 hover:bg-opacity-30 transition-all"
          >
            <i className="ri-close-line"></i>
          </button>
          
          {/* Animated sparkles */}
          <div className="absolute -top-1 -left-1 text-yellow-300 animate-ping">✨</div>
          <div className="absolute -bottom-1 -right-1 text-yellow-300 animate-ping">✨</div>
        </div>
      )}
    </div>
  );
}

// Event Detail Modal Component
interface EventDetailModalProps {
  event: UnifiedEvent;
  onClose: () => void;
  onEdit: (event: UnifiedEvent) => void;
  onDelete: (eventId: string) => void;
}

function EventDetailModal({ event, onClose, onEdit, onDelete }: EventDetailModalProps) {
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'field-operation': return 'General Field Operation';
      case 'planting': return 'Planting/Seeding';
      case 'cultivation': return 'Cultivation/Tilling';
      case 'pruning': return 'Pruning/Trimming';
      case 'harvesting': return 'Harvesting';
      case 'irrigation': return 'Irrigation/Watering';
      case 'weeding': return 'Weeding';
      case 'mulching': return 'Mulching';
      case 'transplanting': return 'Transplanting';
      case 'soil-preparation': return 'Soil Preparation';
      case 'composting': return 'Composting';
      case 'equipment-maintenance': return 'Equipment Maintenance';
      case 'spray-program': return 'Spray Program';
      case 'fertilizer-program': return 'Fertilizer Program';
      case 'pest-control': return 'Pest Control';
      case 'disease-control': return 'Disease Control';
      case 'reminder': return 'Reminder';
      case 'manual': return 'Manual Event';
      default: return 'Event';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'field-operation': return 'ri-plant-line';
      case 'planting': return 'ri-seedling-line';
      case 'cultivation': return 'ri-tools-line';
      case 'pruning': return 'ri-scissors-cut-line';
      case 'harvesting': return 'ri-harvest-line';
      case 'irrigation': return 'ri-drop-line';
      case 'weeding': return 'ri-leaf-line';
      case 'mulching': return 'ri-stack-line';
      case 'transplanting': return 'ri-plant-fill';
      case 'soil-preparation': return 'ri-landscape-line';
      case 'composting': return 'ri-recycle-line';
      case 'equipment-maintenance': return 'ri-tools-fill';
      case 'spray-program': return 'ri-drop-line';
      case 'fertilizer-program': return 'ri-leaf-line';
      case 'reminder': return 'ri-alarm-line';
      case 'manual': return 'ri-calendar-event-line';
      default: return 'ri-calendar-line';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-lg p-0 w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className={`${event.color} px-6 py-4 text-white`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <i className={`${getTypeIcon(event.type)} w-6 h-6 flex items-center justify-center mr-3`}></i>
              <div>
                <h3 className="text-xl font-bold">{event.title}</h3>
                <p className="text-white/80 mt-1">{getTypeLabel(event.type)}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 cursor-pointer"
            >
              <i className="ri-close-line w-8 h-8 flex items-center justify-center"></i>
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Date & Time</label>
                  <div className="text-lg font-semibold text-gray-900">
                    {new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatTime(event.startTime)} - {formatTime(event.endTime)}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Assigned To</label>
                  <div className="text-lg font-semibold text-gray-900 flex items-center">
                    <i className="ri-user-line mr-2 text-gray-600"></i>
                    {event.assignedTo}
                  </div>
                </div>

                {event.field && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Field/Location</label>
                    <div className="text-lg font-semibold text-gray-900 flex items-center">
                      <i className="ri-map-pin-line mr-2 text-gray-600"></i>
                      {event.field}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Priority</label>
                  <div>
                    <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                      event.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                      event.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                      event.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {event.priority.charAt(0).toUpperCase() + event.priority.slice(1)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div>
                    <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(event.status)}`}>
                      {event.status.replace('-', ' ').charAt(0).toUpperCase() + event.status.replace('-', ' ').slice(1)}
                    </span>
                  </div>
                </div>

                {event.estimatedHours && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Duration</label>
                    <div className="text-lg font-semibold text-gray-900">
                      {event.estimatedHours}h estimated
                      {event.actualHours && ` (${event.actualHours}h actual)`}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-gray-500">Description</label>
              <p className="text-gray-900 mt-1">{event.description}</p>
            </div>

            {/* Progress */}
            {event.progress !== undefined && (
              <div>
                <label className="text-sm font-medium text-gray-500">Progress</label>
                <div className="mt-1">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Completion</span>
                    <span>{event.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${event.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Equipment */}
            {event.equipment && event.equipment.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-500">Equipment/Materials</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {event.equipment.map((item, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      <i className="ri-tools-line mr-1"></i>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-500">Tags</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {event.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Weather Dependency */}
            {event.weatherDependency && (
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center">
                  <i className="ri-cloud-line text-blue-600 mr-2"></i>
                  <span className="text-sm font-medium text-blue-800">Weather Dependent Operation</span>
                </div>
                <p className="text-sm text-blue-700 mt-1">This operation may be affected by weather conditions</p>
              </div>
            )}

            {/* Notes */}
            {event.notes && (
              <div>
                <label className="text-sm font-medium text-gray-500">Notes</label>
                <p className="text-gray-700 mt-1">{event.notes}</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap gap-3 pt-6 border-t">
            <button
              onClick={() => onEdit(event)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-edit-line mr-2"></i>Edit Event
            </button>
            {event.type !== 'spray-program' && event.type !== 'fertilizer-program' && (
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete this event?')) {
                    onDelete(event.id);
                  }
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap"
              >
                <i className="ri-delete-bin-line mr-2"></i>Delete Event
              </button>
            )}
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap">
              <i className="ri-check-line mr-2"></i>Mark Complete
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  function formatTime(time: string) {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  }
}