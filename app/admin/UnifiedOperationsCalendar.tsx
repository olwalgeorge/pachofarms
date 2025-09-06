'use client';
// @ts-nocheck
import React, { useState, useEffect, useMemo } from 'react';

interface UnifiedEvent {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'field-operation' | 'spray-program' | 'fertilizer-program' | 'reminder' | 'manual';
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
}

interface UnifiedOperationsCalendarProps {
  onClose: () => void;
  fieldOperations: any[];
  setFieldOperations: React.Dispatch<React.SetStateAction<any[]>>;
  sprayPrograms: any[];
  setSprayPrograms: React.Dispatch<React.SetStateAction<any[]>>;
  fields: any[];
  reminders: any[];
  setReminders: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function UnifiedOperationsCalendar({
  onClose,
  fieldOperations,
  setFieldOperations,
  sprayPrograms,
  setSprayPrograms,
  fields,
  reminders,
  setReminders
}: UnifiedOperationsCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day' | 'kanban'>('month');
  const [selectedEvent, setSelectedEvent] = useState<UnifiedEvent | null>(null);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState<UnifiedEvent | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedEvent, setDraggedEvent] = useState<UnifiedEvent | null>(null);

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
        type: 'field-operation',
        sourceId: op.id,
        priority: op.priority as any,
        status: op.status === 'planning' ? 'scheduled' : op.status as any,
        assignedTo: op.assignedTo,
        field: op.field,
        description: op.description,
        tags: op.tags,
        color: getTypeColor('field-operation'),
        isDraggable: true,
        estimatedHours: op.estimatedHours,
        actualHours: op.actualHours,
        progress: op.progress,
        notes: op.description
      });
    });

    // Spray Programs
    sprayPrograms.forEach(program => {
      if (program.nextApplication) {
        events.push({
          id: `spray-${program.id}`,
          title: `${program.name} - ${program.field}`,
          date: program.nextApplication,
          startTime: '07:00',
          endTime: '09:00',
          type: program.type === 'spray' ? 'spray-program' : 'fertilizer-program',
          sourceId: program.id,
          priority: 'medium',
          status: 'scheduled',
          assignedTo: 'Farm Team',
          field: program.field,
          description: `${program.type}: ${program.product} - ${program.dosage}`,
          equipment: [program.product],
          color: getTypeColor(program.type === 'spray' ? 'spray-program' : 'fertilizer-program'),
          isDraggable: true,
          estimatedHours: 2,
          weatherDependency: program.type === 'spray',
          notes: program.notes
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

    return events;
  }, [fieldOperations, sprayPrograms, reminders]);

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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'field-operation': return 'bg-blue-500';
      case 'spray-program': return 'bg-purple-500';
      case 'fertilizer-program': return 'bg-green-500';
      case 'reminder': return 'bg-orange-500';
      case 'manual': return 'bg-gray-500';
      default: return 'bg-blue-500';
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'border-l-green-400';
      case 'medium': return 'border-l-yellow-400';
      case 'high': return 'border-l-orange-400';
      case 'urgent': return 'border-l-red-400';
      default: return 'border-l-gray-400';
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
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (newDate: string, e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedEvent) return;

    // Update the event date
    updateEventDate(draggedEvent.id, newDate);
    setDraggedEvent(null);
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
      case 'spray':
        setSprayPrograms(prev =>
          prev.map(program =>
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
                  className={`bg-white rounded-lg p-4 shadow-sm border-l-4 hover:shadow-md transition-shadow cursor-pointer ${getPriorityColor(event.priority)}`}
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium text-gray-900 text-sm leading-tight">
                      {event.title}
                    </h5>
                    <div className={`w-3 h-3 rounded-full ${event.color} flex-shrink-0 ml-2`}></div>
                  </div>

                  <p className="text-xs text-gray-600 mb-2">
                    {event.field}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{event.date}</span>
                    <span>{event.assignedTo}</span>
                  </div>

                  {event.progress !== undefined && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div
                          className="bg-green-500 h-1 rounded-full"
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
          }`}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(date, e)}
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
                className={`${event.color} text-white text-xs p-1.5 rounded cursor-pointer hover:opacity-90 transition-opacity shadow-sm border-l-2 ${getPriorityColor(event.priority)}`}
                title={`${event.title} - ${formatTime(event.startTime)}`}
              >
                <div className="flex items-center space-x-1">
                  <span className="truncate font-medium">{formatTime(event.startTime)}</span>
                </div>
                <div className="truncate font-medium">{event.title}</div>
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
    const availablePrograms = sprayPrograms.filter(program => 
      program.type === programType && program.status === 'active'
    );

    if (availablePrograms.length === 0) {
      alert(`No active ${programType} programs available`);
      return;
    }

    // Show program selection modal
    setShowAddEvent(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-9xl h-[95vh] flex flex-col shadow-2xl">
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
                onClick={() => addEventFromProgram('spray')}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors cursor-pointer whitespace-nowrap font-medium shadow-sm text-sm"
              >
                <i className="ri-drop-line mr-2"></i>Add Spray
              </button>
              <button
                onClick={() => addEventFromProgram('fertilizer')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap font-medium shadow-sm text-sm"
              >
                <i className="ri-leaf-line mr-2"></i>Add Fertilizer
              </button>
              <button
                onClick={() => setShowAddEvent(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap font-medium shadow-sm text-sm"
              >
                <i className="ri-add-line mr-2"></i>Add Manual
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
              <option value="field-operation">Field Operations</option>
              <option value="spray-program">Spray Programs</option>
              <option value="fertilizer-program">Fertilizer Programs</option>
              <option value="reminder">Reminders</option>
              <option value="manual">Manual Events</option>
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
          </div>
        </div>

        {/* Calendar view */}
        <div className="flex-1 overflow-hidden p-6 bg-gray-50">
          {renderCurrentView()}
        </div>

        {/* Legend */}
        <div className="p-4 border-t bg-white rounded-b-xl">
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { type: 'field-operation', label: 'Field Operations', color: 'bg-blue-500' },
              { type: 'spray-program', label: 'Spray Programs', color: 'bg-purple-500' },
              { type: 'fertilizer-program', label: 'Fertilizer Programs', color: 'bg-green-500' },
              { type: 'reminder', label: 'Reminders', color: 'bg-orange-500' },
              { type: 'manual', label: 'Manual Events', color: 'bg-gray-500' }
            ].map((item) => (
              <div key={item.type} className="flex items-center space-x-2">
                <div className={`w-4 h-4 ${item.color} rounded-full`}></div>
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

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
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'field-operation': return 'ri-plant-line';
      case 'spray-program': return 'ri-drop-line';
      case 'fertilizer-program': return 'ri-leaf-line';
      case 'reminder': return 'ri-alarm-line';
      case 'manual': return 'ri-calendar-event-line';
      default: return 'ri-calendar-line';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'field-operation': return 'Field Operation';
      case 'spray-program': return 'Spray Program';
      case 'fertilizer-program': return 'Fertilizer Program';
      case 'reminder': return 'Reminder';
      case 'manual': return 'Manual Event';
      default: return 'Event';
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