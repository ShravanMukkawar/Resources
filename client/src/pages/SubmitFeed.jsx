import React, { useState } from 'react';
import { Send, User, BookOpen, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FeedbackForm = () => {
  const [feedback, setFeedback] = useState({
    name: '',
    branch: '',
    suggestion: ''
  });
  
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFeedbackChange = (e) => {
    const { name, value } = e.target;
    setFeedback(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedback)
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      setStatus({
        type: 'success',
        message: 'Thank you for your valuable feedback!'
      });
      
      setFeedback({
        name: '',
        branch: '',
        suggestion: ''
      });
      
    } catch (err) {
      setStatus({
        type: 'error',
        message: 'Failed to submit feedback. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const inputVariants = {
    focus: { 
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  return (
    <div className="min-h-screen  bg-[#001233] px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <motion.div 
        className="w-full max-w-md"
        initial="hidden"
        animate="visible"
        variants={formVariants}
      >
        <div className="bg-[#002855] rounded-2xl shadow-2xl overflow-hidden border border-[#003875]">
          <div className="px-8 py-6 bg-gradient-to-r from-[#001845] to-[#002855]">
            <motion.h2 
              className="text-3xl font-bold text-[#00B4D8] text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              We Value Your Feedback
            </motion.h2>
            <motion.p 
              className="text-gray-300 text-center mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Help us improve your experience
            </motion.p>
          </div>

          <div className="p-8">
            <form onSubmit={handleFeedbackSubmit} className="space-y-6">
              <motion.div 
                className="space-y-2"
                variants={inputVariants}
                whileHover={{ scale: 1.01 }}
              >
                <label className="flex items-center text-sm font-medium text-gray-300" htmlFor="name">
                  <User className="w-4 h-4 mr-2 text-[#00B4D8]" />
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={feedback.name}
                  onChange={handleFeedbackChange}
                  className="w-full px-4 py-3 rounded-xl bg-[#001845] border border-[#003875] text-white placeholder-gray-400 focus:border-[#00B4D8] focus:ring-2 focus:ring-[#00B4D8] outline-none transition-all duration-200"
                  required
                />
              </motion.div>

              <motion.div 
                className="space-y-2"
                variants={inputVariants}
                whileHover={{ scale: 1.01 }}
              >
                <label className="flex items-center text-sm font-medium text-gray-300" htmlFor="branch">
                  <BookOpen className="w-4 h-4 mr-2 text-[#00B4D8]" />
                  Branch
                </label>
                <input
                  type="text"
                  id="branch"
                  name="branch"
                  value={feedback.branch}
                  onChange={handleFeedbackChange}
                  className="w-full px-4 py-3 rounded-xl bg-[#001845] border border-[#003875] text-white placeholder-gray-400 focus:border-[#00B4D8] focus:ring-2 focus:ring-[#00B4D8] outline-none transition-all duration-200"
                  required
                />
              </motion.div>

              <motion.div 
                className="space-y-2"
                variants={inputVariants}
                whileHover={{ scale: 1.01 }}
              >
                <label className="flex items-center text-sm font-medium text-gray-300" htmlFor="suggestion">
                  <MessageSquare className="w-4 h-4 mr-2 text-[#00B4D8]" />
                  Your Suggestions
                </label>
                <textarea
                  id="suggestion"
                  name="suggestion"
                  value={feedback.suggestion}
                  onChange={handleFeedbackChange}
                  className="w-full px-4 py-3 rounded-xl bg-[#001845] border border-[#003875] text-white placeholder-gray-400 focus:border-[#00B4D8] focus:ring-2 focus:ring-[#00B4D8] outline-none transition-all duration-200 min-h-[120px] resize-y"
                  required
                />
              </motion.div>

              <AnimatePresence>
                {status.message && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`flex items-center p-4 rounded-xl ${
                      status.type === 'success' 
                        ? 'bg-[#002855] text-[#00B4D8] border border-[#00B4D8]' 
                        : 'bg-[#002855] text-red-400 border border-red-400'
                    }`}
                  >
                    {status.type === 'success' 
                      ? <CheckCircle className="w-5 h-5 mr-2" />
                      : <XCircle className="w-5 h-5 mr-2" />
                    }
                    {status.message}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#00B4D8] hover:bg-[#0096c7] text-white px-6 py-3 rounded-xl font-medium flex items-center justify-center space-x-2 transition-all duration-200 disabled:opacity-70 disabled:hover:bg-[#00B4D8]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <motion.div 
                    className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Submit Feedback</span>
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FeedbackForm;

