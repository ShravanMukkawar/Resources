import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";

const CalendarComponent = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Sample contest data
  const contests = [
    {
      platform: "LeetCode",
      name: "#431",
      date: "2025-01-05",
      time: "11:30am",
      type: "Biweekly Contest",
    },
    {
      platform: "AtCoder",
      name: "KUPC 2024",
      date: "2025-01-05",
      time: "1pm",
      type: "Japanese Contest",
    },
    {
      platform: "AtCoder",
      name: "ABC 387",
      date: "2025-01-04",
      time: "9pm",
      type: "Regular Contest",
    },
    {
      platform: "Codeforces",
      name: "Hello 2025",
      date: "2025-01-04",
      time: "11:35pm",
      type: "Special Contest",
    },
  ];

  // Calendar helper functions
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const getContestsForDate = (year, month, day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    return contests.filter((contest) => contest.date === dateStr);
  };

  // Navigation handlers
  const handlePreviousMonth = () => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const calendarVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  return (
    <motion.div
      className="w-[100vw] min-h-screen bg-gradient-to-b from-[#001233] to-[#001845]"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <main className="container mx-auto px-4 py-16">
        <motion.section 
          className="mb-24"
          variants={calendarVariants}
          initial="initial"
          animate="animate"
        >
          <div className="bg-[#002855]/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-[#00B4D8]/20">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                <span className="inline-flex items-center border-b-2 border-[#00B4D8] pb-2">
                  <Calendar className="mr-2" />
                  CP Calendar
                </span>
              </h2>
              <div className="flex items-center gap-4">
                <button 
                  onClick={handlePreviousMonth} 
                  className="text-white hover:text-[#00B4D8] transition-colors"
                  aria-label="Previous month"
                >
                  <ChevronLeft size={24} />
                </button>
                <span className="text-white text-xl font-semibold min-w-[200px] text-center">
                  {formatDate(currentMonth)}
                </span>
                <button 
                  onClick={handleNextMonth} 
                  className="text-white hover:text-[#00B4D8] transition-colors"
                  aria-label="Next month"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1">
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
                const dayContests = getContestsForDate(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth(),
                  day
                );
                
                return (
                  <div
                    key={day}
                    className="bg-[#001233]/30 rounded-lg p-2 min-h-[120px] hover:bg-[#001233]/50 transition-colors"
                  >
                    <div className="text-white font-medium mb-1">{day}</div>
                    <div className="space-y-1">
                      {dayContests.map((contest, idx) => (
                        <motion.div
                          key={idx}
                          className="text-xs bg-[#00B4D8]/10 rounded p-1 text-gray-300"
                          whileHover={{ scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <div className="font-semibold text-[#00B4D8] flex items-center gap-1">
                            <Clock size={12} />
                            {contest.time} [{contest.platform}]
                          </div>
                          <div>{contest.name}</div>
                          <div className="text-[#00B4D8]/60 text-xs">{contest.type}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.section>
      </main>
    </motion.div>
  );
};

export default CalendarComponent;