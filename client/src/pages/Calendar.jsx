import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, ChevronLeft, ChevronRight, X, Info, AlertTriangle } from "lucide-react";
import axios from "axios";

const EventPopup = ({ events, onClose }) => {
  const eventTypes = [
    { key: 'holidays', label: 'Holidays', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
    { key: 'examination', label: 'Examinations', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
    { key: 'academicActivities', label: 'Academic Activities', color: 'bg-green-500/20 text-green-300 border-green-500/30' },
    { key: 'extraCurricularActivities', label: 'Extra Curricular', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
    { key: 'specialDaysJayantis', label: 'Special Days/Jayantis', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-[#001233] border border-[#00B4D8]/20 rounded-lg shadow-xl p-6 w-full max-w-md m-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Events</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {eventTypes.map(({ key, label, color }) => (
            events[0][key] && (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`rounded-lg p-3 border ${color}`}
              >
                <div className="text-sm opacity-75 mb-1">{label}</div>
                <div className="font-semibold">
                  {events[0][key]}
                </div>
              </motion.div>
            )
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const CalendarDay = ({ day, events, onShowEvents, isToday }) => {
  const eventTypes = [
    { key: 'holidays', label: 'Holidays', color: 'bg-red-500/20 text-red-300 border-red-500/30', highlightColor: 'bg-red-900/20' },
    { key: 'examination', label: 'Examinations', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', highlightColor: 'bg-blue-900/20' },
    { key: 'academicActivities', label: 'Academic Activities', color: 'bg-green-500/20 text-green-300 border-green-500/30' },
    { key: 'extraCurricularActivities', label: 'Extra Curricular', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
    { key: 'specialDaysJayantis', label: 'Special Days/Jayantis', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' }
  ];

  const hasHoliday = events.some(event => event.holidays);
  const hasExamination= events.some(event => event.examination);
  const cellBackground = hasExamination ? 'bg-yellow-700/60' : hasHoliday ? 'bg-red-900/60' : 'bg-[#001233]/30';

  return (
    <div
      className={`${cellBackground} rounded-lg p-2 min-h-[120px] hover:bg-[#001233]/50 transition-colors relative group cursor-pointer ${
        isToday ? 'ring-2 ring-[#00B4D8] ring-offset-2 ring-offset-[#002855]' : ''
      }`}
      onClick={() => events.length > 0 && onShowEvents(events)}
    >
      <div className={`font-medium mb-2 ${isToday ? 'text-[#00B4D8]' : 'text-white'}`}>
        {day}
      </div>
      <div className="space-y-1">
        {events.length > 0 && eventTypes.map(({ key, color }) => (
          events[0][key] && (
            <motion.div
              key={key}
              className={`text-xs rounded p-1 ${color} truncate`}
            >
              <div className="font-semibold truncate">
                {events[0][key]}
              </div>
            </motion.div>
          )
        ))}
      </div>
    </div>
  );
};

const CalendarComponent = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, [currentMonth]);

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      fetch("/events.json")
            .then((response) => response.json())
            .then((data) => {
                setEvents(data);
            })
            .catch((error) => {
                console.error("Error fetching the JSON data:", error);
            });
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const getEventsForDate = (year, month, day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toISOString().split('T')[0] === dateStr;
    });
  };

  const handleShowEvents = (events) => {
    setSelectedEvents(events);
  };

  const handleClosePopup = () => {
    setSelectedEvents(null);
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-[#001233] to-[#001845]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-yellow-200 mx-4 mt-2 p-2 rounded-lg text-black text-xs flex items-center justify-center gap-1">
        <AlertTriangle size={12} className="text-black flex-shrink-0" />
        <p className="flex-1 text-center">
          Events subject to change. Check official calendar.
        </p>
      </div>

      <main className="container mx-auto px-4 py-8">
        <motion.section 
          className="mb-8 md:mb-24"
          initial={{ y: 20, opacity: 0 }}
          animate={{ 
            y: 0, 
            opacity: 1,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 30
            }
          }}
        >
          <div className="bg-[#002855]/80 backdrop-blur-sm rounded-2xl p-4 md:p-8 shadow-xl border border-[#00B4D8]/20">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                <span className="inline-flex items-center border-b-2 border-[#00B4D8] pb-2">
                  <Calendar className="mr-2" />
                  Event Calendar
                </span>
              </h2>
              <div className="flex items-center gap-4">
                <button 
                  onClick={handlePreviousMonth} 
                  className="text-white hover:text-[#00B4D8] transition-colors"
                  disabled={loading}
                >
                  <ChevronLeft size={24} />
                </button>
                <span className="text-white text-xl font-semibold min-w-[200px] text-center">
                  {formatDate(currentMonth)}
                </span>
                <button 
                  onClick={handleNextMonth} 
                  className="text-white hover:text-[#00B4D8] transition-colors"
                  disabled={loading}
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-center mb-4 p-2 bg-red-500/10 rounded">
                {error}
              </div>
            )}

            <div className="grid grid-cols-7 gap-1 relative">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-[#00B4D8] font-semibold p-2 text-center">
                  {day}
                </div>
              ))}

              {Array.from({ length: getFirstDayOfMonth(currentMonth) }).map((_, index) => (
                <div 
                  key={`empty-${index}`} 
                  className="bg-[#001233]/30 rounded-lg p-2 min-h-[120px]" 
                />
              ))}

              {Array.from({ length: getDaysInMonth(currentMonth) }).map((_, index) => {
                const day = index + 1;
                const dayEvents = getEventsForDate(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth(),
                  day
                );
                
                return (
                  <CalendarDay
                    key={day}
                    day={day}
                    events={dayEvents}
                    onShowEvents={handleShowEvents}
                    isToday={isToday(day)}
                  />
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-500/20"></div>
                <span className="text-red-300 text-sm">Holidays</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-500/20"></div>
                <span className="text-blue-300 text-sm">Examinations</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-500/20"></div>
                <span className="text-green-300 text-sm">Academic Activities</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-purple-500/20"></div>
                <span className="text-purple-300 text-sm">Extra Curricular</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-yellow-500/20"></div>
                <span className="text-yellow-300 text-sm">Special Days/Jayantis</span>
              </div>
            </div>

            <AnimatePresence>
              {selectedEvents && (
                <EventPopup
                  events={selectedEvents}
                  onClose={handleClosePopup}
                />
              )}
            </AnimatePresence>
          </div>
        </motion.section>
      </main>

      <style jsx global>{`
        body {
          min-height: 100vh;
          background: #001845;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #001233;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #00B4D8;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #0090a8;
        }
      `}</style>
    </motion.div>
  );
};

export default CalendarComponent;