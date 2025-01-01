import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const linkVariants = {
        hover: {
            scale: 1.05,
            color: "#60A5FA", // blue-400
            transition: { type: 'spring', stiffness: 300 }
        },
        tap: { scale: 0.95 }
    };

    const mobileMenuVariants = {
        closed: { opacity: 0, height: 0 },
        open: { opacity: 1, height: 'auto' }
    };

    const logoVariants = {
        hover: {
            scale: 1.05,
            rotate: [0, -5, 5, -5, 0],
            transition: { duration: 0.5 }
        }
    };

    return (
        <nav className="bg-gray-900 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative flex items-center justify-between h-20">
                    {/* Mobile menu button */}
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        <motion.button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors duration-200"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <span className="sr-only">Open main menu</span>
                            <motion.svg
                                className="block h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                animate={mobileMenuOpen ? { rotate: 90 } : { rotate: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </motion.svg>
                        </motion.button>
                    </div>

                    {/* Logo / Name */}
                    <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                        <motion.div 
                            className="flex-shrink-0 text-white text-2xl font-bold"
                            variants={logoVariants}
                            whileHover="hover"
                        >
                            <Link to="/" className="flex items-center">
                                <motion.svg 
                                    className="h-8 w-8 mr-2" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </motion.svg>
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                                    Academix
                                </span>
                            </Link>
                        </motion.div>
                    </div>

                    {/* Links for large screens */}
                    <div className="hidden sm:block sm:ml-6">
                        <div className="flex space-x-4">
                            <motion.div variants={linkVariants} whileHover="hover" whileTap="tap">
                                <Link
                                    to="/"
                                    className="text-gray-300 px-3 py-2 rounded-md text-lg font-medium hover:bg-gray-700 transition-colors duration-200"
                                >
                                    Home
                                </Link>
                            </motion.div>
                            <motion.div variants={linkVariants} whileHover="hover" whileTap="tap">
                                <Link
                                    to="/getr"
                                    className="text-gray-300 px-3 py-2 rounded-md text-lg font-medium hover:bg-gray-700 transition-colors duration-200"
                                >
                                    Resources
                                </Link>
                            </motion.div>
                            <motion.div variants={linkVariants} whileHover="hover" whileTap="tap">
                                <Link
                                    to="/calendar"
                                    className="text-gray-300 px-3 py-2 rounded-md text-lg font-medium hover:bg-gray-700 transition-colors duration-200"
                                >
                                    Calendar
                                </Link>
                            </motion.div>
                            <motion.div variants={linkVariants} whileHover="hover" whileTap="tap">
                                <Link
                                    to="/sfeedback"
                                    className="text-gray-300 px-3 py-2 rounded-md text-lg font-medium hover:bg-gray-700 transition-colors duration-200"
                                >
                                    Feedback
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div 
                        className="sm:hidden"
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={mobileMenuVariants}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-800">
                            <motion.div 
                                variants={linkVariants} 
                                whileHover="hover" 
                                whileTap="tap"
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <Link
                                    to="/"
                                    className="text-gray-300 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 transition-colors duration-200"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Home
                                </Link>
                            </motion.div>
                            <motion.div 
                                variants={linkVariants} 
                                whileHover="hover" 
                                whileTap="tap"
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Link
                                    to="/getr"
                                    className="text-gray-300 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 transition-colors duration-200"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Resources
                                </Link>
                            </motion.div>
                            <motion.div 
                                variants={linkVariants} 
                                whileHover="hover" 
                                whileTap="tap"
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Link
                                    to="/calendar"
                                    className="text-gray-300 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 transition-colors duration-200"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Calendar
                                </Link>
                            </motion.div>
                            <motion.div 
                                variants={linkVariants} 
                                whileHover="hover" 
                                whileTap="tap"
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <Link
                                    to="/sfeedback"
                                    className="text-gray-300 block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 transition-colors duration-200"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Feedback
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;

