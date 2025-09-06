
'use client';
import { useState, useEffect, useMemo } from 'react';

interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'planting' | 'harvesting' | 'maintenance' | 'spraying' | 'irrigation' | 'meeting' | 'delivery' | 'inspection';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  assignedTo: string;
  field?: string;
  description: string;
  equipment?: string[];
  reminders: number[];
  recurring?: {
    type: 'daily' | 'weekly' | 'monthly';
    interval: number;
    endDate?: string;
  };
  weather?: {
    condition: string;
    temperature: string;
    humidity: string;
    windSpeed: string;
  };
  completionNotes?: string;
}

interface CalendarProps {
  onClose: () => void;
}

export default function OperationsCalendar({ onClose }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day' | 'agenda'>('month');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterAssignee, setFilterAssignee] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: 1,
      title: 'Morning Irrigation - Field A',
      date: '2024-01-22',
      startTime: '06:00',
      endTime: '08:00',
      type: 'irrigation',
      priority: 'high',
      status: 'scheduled',
      assignedTo: 'Joseph Pacho',
      field: 'Field A - African Varieties',
      description: 'Morning irrigation system inspection and water distribution',
      equipment: ['Irrigation Controller', 'Pressure Gauge', 'Flow Meter'],
      reminders: [30, 60],
      weather: {
        condition: 'Clear',
        temperature: '24°C',
        humidity: '68%',
        windSpeed: '5 km/h'
      }
    },
    {
      id: 2,
      title: 'Organic Pest Control - Field B',
      date: '2024-01-22',
      startTime: '07:30',
      endTime: '10:30',
      type: 'spraying',
      priority: 'high',
      status: 'in-progress',
      assignedTo: 'Sarah Pacho',
      field: 'Field B - Asian Mix',
      description: 'Organic pest control treatment using neem oil solution',
      equipment: ['Sprayer Self-Propelled', 'Safety Equipment', 'Mixing Tank'],
      reminders: [60, 120]
    },
    {
      id: 3,
      title: 'Weekly Harvest Planning Meeting',
      date: '2024-01-23',
      startTime: '08:00',
      endTime: '09:30',
      type: 'meeting',
      priority: 'medium',
      status: 'scheduled',
      assignedTo: 'Farm Team',
      description: 'Weekly planning meeting for harvest operations and quality review',
      reminders: [30]
    },
    {
      id: 4,
      title: 'Seedling Transplant - Field C',
      date: '2024-01-24',
      startTime: '09:00',
      endTime: '14:00',
      type: 'planting',
      priority: 'high',
      status: 'scheduled',
      assignedTo: 'Sarah Pacho',
      field: 'Field C - Caribbean Heat',
      description: 'Transplant greenhouse seedlings to main cultivation areas',
      equipment: ['Wheelbarrows', 'Hand Tools', 'Watering Equipment'],
      reminders: [60]
    },
    {
      id: 5,
      title: 'Tractor Maintenance Check',
      date: '2024-01-25',
      startTime: '10:00',
      endTime: '14:00',
      type: 'maintenance',
      priority: 'medium',
      status: 'scheduled',
      assignedTo: 'Maintenance Team',
      description: 'Monthly maintenance check for John Deere tractor',
      equipment: ['John Deere Tractor', 'Maintenance Tools', 'Oil & Filters'],
      reminders: [120]
    },
    {
      id: 6,
      title: 'Quality Inspection - Field B',
      date: '2024-01-26',
      startTime: '11:00',
      endTime: '13:00',
      type: 'inspection',
      priority: 'medium',
      status: 'scheduled',
      assignedTo: 'Quality Control Team',
      field: 'Field B - Asian Mix',
      description: 'Monthly quality and compliance inspection for restaurant contracts',
      reminders: [60]
    },
    {
      id: 7,
      title: 'Restaurant Delivery Pickup',
      date: '2024-01-27',
      startTime: '14:00',
      endTime: '15:00',
      type: 'delivery',
      priority: 'high',
      status: 'scheduled',
      assignedTo: 'Joseph Pacho',
      description: 'Pickup for Johnson Restaurant Group weekly order',
      reminders: [30]
    },
    {
      id: 8,
      title: 'Soil Analysis - Field C',
      date: '2024-01-28',
      startTime: '09:30',
      endTime: '12:30',
      type: 'inspection',
      priority: 'medium',
      status: 'scheduled',
      assignedTo: 'Farm Team',
      field: 'Field C - Caribbean Heat',
      description: 'Comprehensive soil analysis for pH and nutrient levels',
      equipment: ['Digital pH Meter', 'Soil Testing Kit', 'Sample Containers'],
      reminders: [60]
    }
  ]);

  const eventTypes = [
    { value: 'planting', label: 'Planting', color: 'bg-emerald-500', lightColor: 'bg-emerald-50', textColor: 'text-emerald-700', icon: 'ri-seedling-line' },
    { value: 'harvesting', label: 'Harvesting', color: 'bg-orange-500', lightColor: 'bg-orange-50', textColor: 'text-orange-700', icon: 'ri-scissors-line' },
    { value: 'maintenance', label: 'Maintenance', color: 'bg-blue-500', lightColor: 'bg-blue-50', textColor: 'text-blue-700', icon: 'ri-tools-line' },
    { value: 'spraying', label: 'Spraying', color: 'bg-purple-500', lightColor: 'bg-purple-50', textColor: 'text-purple-700', icon: 'ri-drop-line' },
    { value: 'irrigation', label: 'Irrigation', color: 'bg-cyan-500', lightColor: 'bg-cyan-50', textColor: 'text-cyan-700', icon: 'ri-water-line' },
    { value: 'meeting', label: 'Meeting', color: 'bg-gray-500', lightColor: 'bg-gray-50', textColor: 'text-gray-700', icon: 'ri-team-line' },
    { value: 'delivery', label: 'Delivery', color: 'bg-yellow-500', lightColor: 'bg-yellow-50', textColor: 'text-yellow-700', icon: 'ri-truck-line' },
    { value: 'inspection', label: 'Inspection', color: 'bg-red-500', lightColor: 'bg-red-50', textColor: 'text-red-700', icon: 'ri-search-eye-line' }
  ];

  const statusTypes = [
    { value: 'scheduled', label: 'Scheduled', color: 'bg-blue-100 text-blue-800', icon: 'ri-calendar-line' },
    { value: 'in-progress', label: 'In Progress', color: 'bg-yellow-100 text-yellow-800', icon: 'ri-time-line' },
    { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800', icon: 'ri-check-line' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: 'ri-close-line' }
  ];

  const priorityTypes = [
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800 border-green-300' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800 border-orange-300' },
    { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800 border-red-300' }
  ];

  const getEventTypeConfig = (type: string) => {
    return eventTypes.find(t => t.value === type) || eventTypes[0];
  };

  const getStatusConfig = (status: string) => {
    return statusTypes.find(s => s.value === status) || statusTypes[0];
  };

  const getPriorityConfig = (priority: string) => {
    return priorityTypes.find(p => p.value === priority) || priorityTypes[0];
  };

  // Filtered and searched events
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesType = filterType === 'all' || event.type === filterType;
      const matchesAssignee = filterAssignee === 'all' || event.assignedTo === filterAssignee;
      const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
      const matchesSearch = searchTerm === '' ||
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.field && event.field.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesType && matchesAssignee && matchesStatus && matchesSearch;
    });
  }, [events, filterType, filterAssignee, filterStatus, searchTerm]);

  const getEventsForDate = (date: string) => {
    return filteredEvents.filter(event => event.date === date);
  };

  const getEventsForWeek = (startDate: Date) => {
    const weekEvents = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateString = formatDate(date);
      weekEvents.push({
        date: dateString,
        events: getEventsForDate(dateString)
      });
    }
    return weekEvents;
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

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + (direction === 'next' ? 1 : -1), 1));
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const navigateDay = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const handleNavigation = (direction: 'prev' | 'next') => {
    switch (viewMode) {
      case 'month':
        navigateMonth(direction);
        break;
      case 'week':
        navigateWeek(direction);
        break;
      case 'day':
        navigateDay(direction);
        break;
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const uniqueAssignees = [...new Set(events.map(e => e.assignedTo))];

  // Month view component
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
      const isSelected = date === formatDate(currentDate);

      days.push(
        <div
          key={day}
          className={`min-h-32 border border-gray-200 p-2 bg-white hover:bg-gray-50 transition-colors cursor-pointer ${
            isToday ? 'bg-blue-50 border-blue-300 ring-1 ring-blue-300' : ''
          } ${isSelected ? 'ring-2 ring-green-500' : ''}`}
          onClick={() => {
            const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            setCurrentDate(clickedDate);
            if (dayEvents.length > 0) {
              setViewMode('day');
            }
          }}
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
            {dayEvents.slice(0, 3).map((event) => {
              const typeConfig = getEventTypeConfig(event.type);
              return (
                <div
                  key={event.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEvent(event);
                  }}
                  className={`${typeConfig.color} text-white text-xs p-1.5 rounded cursor-pointer hover:opacity-90 transition-opacity shadow-sm`}
                  title={`${event.title} - ${formatTime(event.startTime)}`}
                >
                  <div className="flex items-center space-x-1">
                    <i className={`${typeConfig.icon} text-xs`}></i>
                    <span className="truncate font-medium">{formatTime(event.startTime)}</span>
                  </div>
                  <div className="truncate font-medium">{event.title}</div>
                </div>
              );
            })}
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

  // Week view component
  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    const weekEvents = getEventsForWeek(startOfWeek);
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border overflow-hidden">
        {/* Week header */}
        <div className="grid grid-cols-8 gap-0 border-b bg-gray-50">
          <div className="p-3 text-center font-semibold text-gray-500">Time</div>
          {weekEvents.map((dayData, index) => {
            const day = new Date(dayData.date);
            const isToday = dayData.date === formatDate(new Date());
            return (
              <div key={index} className={`p-3 text-center border-l ${isToday ? 'bg-blue-50' : ''}`}>
                <div className="font-semibold text-gray-900">{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                <div className={`text-sm mt-1 ${isToday ? 'text-blue-600 font-bold' : 'text-gray-600'}`}>
                  {day.getDate()}
                </div>
                {dayData.events.length > 0 && (
                  <div className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-medium mt-1">
                    {dayData.events.length}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Week grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-8 gap-0">
            <div className="border-r bg-gray-50">
              {hours.map((hour) => (
                <div key={hour} className="h-16 border-b p-2 text-xs text-gray-500 flex items-center">
                  {hour.toString().padStart(2, '0')}:00
                </div>
              ))}
            </div>
            {weekEvents.map((dayData, dayIndex) => (
              <div key={dayIndex} className="border-r">
                {hours.map((hour) => {
                  const hourEvents = dayData.events.filter(event => {
                    const eventHour = parseInt(event.startTime.split(':')[0]);
                    return eventHour === hour;
                  });

                  return (
                    <div key={hour} className="h-16 border-b p-1 relative hover:bg-gray-50">
                      {hourEvents.map((event) => {
                        const typeConfig = getEventTypeConfig(event.type);
                        const statusConfig = getStatusConfig(event.status);
                        return (
                          <div
                            key={event.id}
                            onClick={() => setSelectedEvent(event)}
                            className={`${typeConfig.color} text-white text-xs p-1.5 rounded cursor-pointer hover:opacity-90 mb-1 shadow-sm`}
                            title={event.title}
                          >
                            <div className="flex items-center space-x-1">
                              <i className={`${typeConfig.icon} text-xs`}></i>
                              <i className={`${statusConfig.icon} text-xs`}></i>
                            </div>
                            <div className="font-medium truncate">{event.title}</div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Day view component
  const renderDayView = () => {
    const dayEvents = getEventsForDate(formatDate(currentDate)).sort((a, b) => a.startTime.localeCompare(b.startTime));
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <div className="flex h-full bg-white rounded-lg shadow-sm border overflow-hidden">
        {/* Time column */}
        <div className="w-20 border-r bg-gray-50">
          {hours.map((hour) => (
            <div key={hour} className="h-16 border-b p-2 text-xs text-gray-500 flex items-center">
              {hour.toString().padStart(2, '0')}:00
            </div>
          ))}
        </div>

        {/* Events column */}
        <div className="flex-1 relative overflow-y-auto">
          {hours.map((hour) => (
            <div key={hour} className="h-16 border-b border-gray-200 hover:bg-gray-50"></div>
          ))}

          {/* Events overlay */}
          {dayEvents.map((event) => {
            const [startHour, startMinute] = event.startTime.split(':').map(Number);
            const [endHour, endMinute] = event.endTime.split(':').map(Number);
            const topPosition = (startHour * 64) + (startMinute * 64 / 60);
            const duration = (endHour - startHour) + ((endMinute - startMinute) / 60);
            const height = Math.max(duration * 64, 40);
            const typeConfig = getEventTypeConfig(event.type);
            const statusConfig = getStatusConfig(event.status);

            return (
              <div
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className={`absolute left-2 right-2 ${typeConfig.color} text-white p-3 rounded-lg cursor-pointer hover:opacity-90 shadow-lg z-10 border-l-4 border-white`}
                style={{ top: `${topPosition}px`, height: `${height}px` }}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <i className={`${typeConfig.icon} text-sm`}></i>
                    <i className={`${statusConfig.icon} text-sm`}></i>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityConfig(event.priority).color}`}>
                    {event.priority}
                  </span>
                </div>
                <div className="font-semibold text-sm mb-1 truncate">{event.title}</div>
                <div className="text-xs opacity-90 mb-1">
                  {formatTime(event.startTime)} - {formatTime(event.endTime)}
                </div>
                <div className="text-xs opacity-75 truncate">{event.assignedTo}</div>
                {event.field && (
                  <div className="text-xs opacity-75 truncate mt-1">{event.field}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Agenda view component
  const renderAgendaView = () => {
    const upcomingEvents = filteredEvents
      .filter(event => new Date(event.date) >= new Date())
      .sort((a, b) => {
        const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
        if (dateCompare === 0) {
          return a.startTime.localeCompare(b.startTime);
        }
        return dateCompare;
      })
      .slice(0, 20);

    return (
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-6 border-b bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Operations</h3>
          <p className="text-sm text-gray-600 mt-1">{upcomingEvents.length} events scheduled</p>
        </div>

        <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
          {upcomingEvents.map((event) => {
            const typeConfig = getEventTypeConfig(event.type);
            const statusConfig = getStatusConfig(event.status);
            const priorityConfig = getPriorityConfig(event.priority);
            const eventDate = new Date(event.date);
            const isToday = event.date === formatDate(new Date());
            const daysDiff = Math.ceil((eventDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

            return (
              <div
                key={event.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${isToday ? 'bg-blue-50' : ''}`}
                onClick={() => setSelectedEvent(event)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 ${typeConfig.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <i className={`${typeConfig.icon} text-white text-lg`}></i>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-lg font-semibold text-gray-900 truncate">{event.title}</h4>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusConfig.color}`}>
                          {statusConfig.label}
                        </span>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <span className="flex items-center">
                          <i className="ri-calendar-line mr-1"></i>
                          {eventDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          {isToday && <span className="ml-1 text-blue-600 font-medium">(Today)</span>}
                          {daysDiff === 1 && <span className="ml-1 text-orange-600 font-medium">(Tomorrow)</span>}
                        </span>
                        <span className="flex items-center">
                          <i className="ri-time-line mr-1"></i>
                          {formatTime(event.startTime)} - {formatTime(event.endTime)}
                        </span>
                        <span className="flex items-center">
                          <i className="ri-user-line mr-1"></i>
                          {event.assignedTo}
                        </span>
                      </div>

                      {event.field && (
                        <div className="text-sm text-gray-600 mb-2">
                          <i className="ri-map-pin-line mr-1"></i>
                          {event.field}
                        </div>
                      )}

                      <p className="text-sm text-gray-700 truncate">{event.description}</p>

                      {event.equipment && event.equipment.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {event.equipment.slice(0, 3).map((item, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                              <i className="ri-tools-line mr-1"></i>
                              {item}
                            </span>
                          ))}
                          {event.equipment.length > 3 && (
                            <span className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                              +{event.equipment.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded border ${priorityConfig.color}`}>
                      {priorityConfig.label}
                    </span>
                    {event.reminders.length > 0 && (
                      <span className="inline-flex items-center text-xs text-gray-500">
                        <i className="ri-notification-line mr-1"></i>
                        {event.reminders.length} reminder{event.reminders.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {upcomingEvents.length === 0 && (
            <div className="p-8 text-center">
              <i className="ri-calendar-line text-4xl text-gray-300 mb-4"></i>
              <p className="text-gray-500">No upcoming events found</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCurrentView = () => {
    switch (viewMode) {
      case 'month':
        return renderMonthView();
      case 'week':
        return renderWeekView();
      case 'day':
        return renderDayView();
      case 'agenda':
        return renderAgendaView();
      default:
        return renderMonthView();
    }
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
      case 'agenda':
        return 'Upcoming Operations';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-9xl h-[95vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-600 px-6 py-4 text-white rounded-t-xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Operations Calendar</h2>
              <p className="text-green-100 mt-1">Manage and track all farm operations</p>
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
                  onClick={() => handleNavigation('prev')}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  <i className="ri-arrow-left-line"></i>
                </button>
                <h3 className="text-lg font-semibold text-gray-900 min-w-[250px] text-center px-4">
                  {getViewTitle()}
                </h3>
                <button
                  onClick={() => handleNavigation('next')}
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
                { mode: 'week', label: 'Week', icon: 'ri-calendar-week-line' },
                { mode: 'day', label: 'Day', icon: 'ri-calendar-2-line' },
                { mode: 'agenda', label: 'Agenda', icon: 'ri-list-check' }
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

            {/* Add event */}
            <button
              onClick={() => setShowAddEvent(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap font-medium shadow-sm"
            >
              <i className="ri-add-line mr-2"></i>Add Operation
            </button>
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
              {eventTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8"
            >
              <option value="all">All Status</option>
              {statusTypes.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>

            <select
              value={filterAssignee}
              onChange={(e) => setFilterAssignee(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-8"
            >
              <option value="all">All Assignees</option>
              {uniqueAssignees.map(assignee => (
                <option key={assignee} value={assignee}>{assignee}</option>
              ))}
            </select>

            <div className="text-sm bg-gray-100 px-3 py-2 rounded-lg flex items-center justify-center">
              <span className="font-medium text-gray-700">{filteredEvents.length} operations</span>
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
            {eventTypes.map((type) => (
              <div key={type.value} className="flex items-center space-x-2">
                <div className={`w-4 h-4 ${type.color} rounded-full`}></div>
                <span className="text-sm font-medium text-gray-700">{type.label}</span>
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
            setEvents(prev => prev.filter(e => e.id !== eventId));
            setSelectedEvent(null);
          }}
          eventTypes={eventTypes}
          statusTypes={statusTypes}
          priorityTypes={priorityTypes}
        />
      )}

      {/* Add/Edit Event Modal (placeholder implementation) */}
      {(showAddEvent || editingEvent) && (
        <EventFormModal
          event={editingEvent}
          onSubmit={(eventData) => {
            if (editingEvent) {
              setEvents(prev => prev.map(e => e.id === editingEvent.id ? { ...eventData, id: editingEvent.id } : e));
              setEditingEvent(null);
            } else {
              setEvents(prev => [...prev, { ...eventData, id: Date.now() }]);
              setShowAddEvent(false);
            }
          }}
          onCancel={() => {
            setShowAddEvent(false);
            setEditingEvent(null);
          }}
          eventTypes={eventTypes}
          statusTypes={statusTypes}
          priorityTypes={priorityTypes}
        />
      )}
    </div>
  );
}

// Event Detail Modal Component
interface EventDetailModalProps {
  event: CalendarEvent;
  onClose: () => void;
  onEdit: (event: CalendarEvent) => void;
  onDelete: (eventId: number) => void;
  eventTypes: any[];
  statusTypes: any[];
  priorityTypes: any[];
}

function EventDetailModal({ event, onClose, onEdit, onDelete, eventTypes, statusTypes, priorityTypes }: EventDetailModalProps) {
  const typeConfig = event && eventTypes.find((t) => t.value === event.type) || eventTypes[0];

  if (!event) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-lg p-0 w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className={`${typeConfig.color} px-6 py-4 text-white`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <i className={`${typeConfig.icon} w-6 h-6 flex items-center justify-center mr-3`}></i>
              <div>
                <h3 className="text-xl font-bold">{event.title}</h3>
                <p className="text-white/80 mt-1">{typeConfig.label} Event</p>
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
                    {event.startTime} - {event.endTime}
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
                    <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getPriorityColor(event.priority)}`}>
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
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-gray-500">Description</label>
              <p className="text-gray-900 mt-1">{event.description}</p>
            </div>

            {/* Equipment */}
            {event.equipment && event.equipment.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-500">Required Equipment</label>
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

            {/* Weather Information */}
            {event.weather && (
              <div>
                <label className="text-sm font-medium text-gray-500">Weather Conditions</label>
                <div className="bg-gray-50 rounded-lg p-4 mt-1">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Condition:</span>
                      <div className="font-medium">{event.weather.condition}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Temperature:</span>
                      <div className="font-medium">{event.weather.temperature}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Humidity:</span>
                      <div className="font-medium">{event.weather.humidity}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Wind:</span>
                      <div className="font-medium">{event.weather.windSpeed}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reminders */}
            {event.reminders && event.reminders.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-500">Reminders</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {event.reminders.map((minutes, index) => (
                    <span key={index} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                      <i className="ri-alarm-line mr-1"></i>
                      {minutes} min before
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recurring Information */}
            {event.recurring && (
              <div>
                <label className="text-sm font-medium text-gray-500">Recurring</label>
                <div className="bg-purple-50 rounded-lg p-4 mt-1">
                  <div className="text-sm">
                    <span className="font-medium">
                      Every {event.recurring.interval} {event.recurring.type}
                      {event.recurring.interval > 1 ? 's' : ''}
                    </span>
                    {event.recurring.endDate && (
                      <div className="text-gray-600 mt-1">
                        Until {new Date(event.recurring.endDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
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
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap">
              <i className="ri-check-line mr-2"></i>Mark Complete
            </button>
            <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors cursor-pointer whitespace-nowrap">
              <i className="ri-notification-line mr-2"></i>Set Reminder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions for colors used in the modal
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'critical': return 'bg-red-100 text-red-800';
    case 'high': return 'bg-orange-100 text-orange-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'low': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-800';
    case 'in-progress': return 'bg-blue-100 text-blue-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-yellow-100 text-yellow-800';
  }
};

/**
 * Placeholder EventFormModal.
 * In a real implementation this would contain a full form for creating/editing events.
 * For now it simply returns null to avoid runtime errors.
 */
interface EventFormModalProps {
  event: CalendarEvent | null;
  onSubmit: (eventData: Omit<CalendarEvent, 'id'>) => void;
  onCancel: () => void;
  eventTypes: any[];
  statusTypes: any[];
  priorityTypes: any[];
}

function EventFormModal({ event, onSubmit, onCancel }: EventFormModalProps) {
  // Minimal placeholder implementation to keep the component functional.
  // It simply renders a basic modal with a cancel button.
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4">{event ? 'Edit Event' : 'Add New Event'}</h3>
        <p className="text-gray-600 mb-6">Form implementation is omitted for brevity.</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // This is a placeholder. In a real app, you'd gather form data here.
              // We'll just close the modal.
              onCancel();
            }}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
