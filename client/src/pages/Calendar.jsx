import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight, X, AlertTriangle } from "lucide-react";

const EventPopup = ({ events, onClose }) => {
  const eventTypes = [
    { key: 'holidays', label: 'Holidays', color: 'bg-rose-500/10 text-rose-200 border-rose-500/20' },
    { key: 'examination', label: 'Examinations', color: 'bg-indigo-500/10 text-indigo-200 border-indigo-500/20' },
    { key: 'academicActivities', label: 'Academic Activities', color: 'bg-emerald-500/10 text-emerald-200 border-emerald-500/20' },
    { key: 'extraCurricularActivities', label: 'Extra Curricular', color: 'bg-violet-500/10 text-violet-200 border-violet-500/20' },
    { key: 'specialDaysJayantis', label: 'Special Days/Jayantis', color: 'bg-amber-500/10 text-amber-200 border-amber-500/20' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-6 w-full max-w-md m-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-100">Events</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {eventTypes.map(({ key, label, color }) => (
            events[0][key] && (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-lg p-3 border ${color}`}
              >
                <div className="text-sm opacity-80 mb-1">{label}</div>
                <div className="font-medium">
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
    { key: 'holidays', color: 'bg-rose-500/10 text-rose-200 border-rose-500/20', highlightColor: 'bg-rose-950/40' },
    { key: 'examination', color: 'bg-indigo-500/10 text-indigo-200 border-indigo-500/20', highlightColor: 'bg-indigo-950/40' },
    { key: 'academicActivities', color: 'bg-emerald-500/10 text-emerald-200 border-emerald-500/20' },
    { key: 'extraCurricularActivities', color: 'bg-violet-500/10 text-violet-200 border-violet-500/20' },
    { key: 'specialDaysJayantis', color: 'bg-amber-500/10 text-amber-200 border-amber-500/20' }
  ];

  const hasHoliday = events.some(event => event.holidays);
  const hasExamination = events.some(event => event.examination);
  const cellBackground = hasExamination ? 'bg-indigo-950/40' : hasHoliday ? 'bg-rose-950/40' : 'bg-slate-800/40';

  return (
    <div
      className={`${cellBackground} rounded-lg p-2 min-h-[120px] hover:bg-slate-700/30 transition-all duration-200 relative group cursor-pointer ${
        isToday ? 'ring-2 ring-sky-400 ring-offset-1 ring-offset-slate-900' : ''
      }`}
      onClick={() => events.length > 0 && onShowEvents(events)}
    >
      <div className={`font-medium mb-2 ${isToday ? 'text-sky-400' : 'text-slate-200'}`}>
        {day}
      </div>
      <div className="space-y-1">
        {events.length > 0 && eventTypes.map(({ key, color }) => (
          events[0][key] && (
            <motion.div
              key={key}
              className={`text-xs rounded p-1 ${color} truncate`}
            >
              <div className="font-medium truncate">
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

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-[#001233] to-[#001845]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-amber-100 mx-4 mt-2 p-2 rounded-lg text-amber-900 text-xs flex items-center justify-center gap-1">
      <AlertTriangle size={12} className="text-black font-bold flex-shrink-0" />
        <p >
          Events subject to change. 
          <a href="https://www.coeptech.ac.in/student-corner/academic/academic-calendar/"><strong className="text-black"> Check official calendar.</strong></a>
        </p>
      </div>

      <main className="container mx-auto px-4 py-8">
        <motion.section 
          className="mb-8 md:mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="bg-slate-900/90 backdrop-blur-sm rounded-2xl p-4 md:p-8 shadow-xl border border-slate-700">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-100">
                <span className="inline-flex items-center border-b-2 border-sky-400 pb-2">
                  <Calendar className="mr-2" />
                  Event Calendar
                </span>
              </h2>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setCurrentMonth(prev => {
                    const newDate = new Date(prev);
                    newDate.setMonth(prev.getMonth() - 1);
                    return newDate;
                  })}
                  className="text-slate-300 hover:text-sky-400 transition-colors"
                  disabled={loading}
                >
                  <ChevronLeft size={24} />
                </button>
                <span className="text-slate-200 text-xl font-semibold min-w-[200px] text-center">
                  {formatDate(currentMonth)}
                </span>
                <button 
                  onClick={() => setCurrentMonth(prev => {
                    const newDate = new Date(prev);
                    newDate.setMonth(prev.getMonth() + 1);
                    return newDate;
                  })}
                  className="text-slate-300 hover:text-sky-400 transition-colors"
                  disabled={loading}
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>

            {error && (
              <div className="text-rose-400 text-center mb-4 p-2 bg-rose-500/10 rounded">
                {error}
              </div>
            )}

            <div className="grid grid-cols-7 gap-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-sky-400 font-semibold p-2 text-center">
                  {day}
                </div>
              ))}

              {Array.from({ length: getFirstDayOfMonth(currentMonth) }).map((_, index) => (
                <div 
                  key={`empty-${index}`} 
                  className="bg-slate-800/40 rounded-lg p-2 min-h-[120px]" 
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
                    onShowEvents={setSelectedEvents}
                    isToday={isToday(day)}
                  />
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-rose-500/10 border border-rose-500/20"></div>
                <span className="text-rose-200 text-sm">Holidays</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-indigo-500/10 border border-indigo-500/20"></div>
                <span className="text-indigo-200 text-sm">Examinations</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-emerald-500/10 border border-emerald-500/20"></div>
                <span className="text-emerald-200 text-sm">Academic Activities</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-violet-500/10 border border-violet-500/20"></div>
                <span className="text-violet-200 text-sm">Extra Curricular</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-amber-500/10 border border-amber-500/20"></div>
                <span className="text-amber-200 text-sm">Special Days/Jayantis</span>
              </div>
            </div>

            <AnimatePresence>
              {selectedEvents && (
                <EventPopup
                  events={selectedEvents}
                  onClose={() => setSelectedEvents(null)}
                />
              )}
            </AnimatePresence>
          </div>
        </motion.section>
      </main>

      <style jsx global>{`
        body {
          min-height: 100vh;
          background: rgb(15 23 42);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgb(15 23 42);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgb(56 189 248);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgb(14 165 233);
        }
      `}</style>
    </motion.div>
  );
};

export default CalendarComponent;