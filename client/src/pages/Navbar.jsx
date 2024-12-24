import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="bg-blue-600 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative flex items-center justify-between h-16">
                    {/* Mobile menu button */}
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 focus:ring-white"
                        >
                            <span className="sr-only">Open main menu</span>
                            {/* Hamburger Icon */}
                            <svg
                                className="block h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Logo / Name */}
                    <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex-shrink-0 text-white text-2xl font-semibold">
                            <Link to="/">My Website</Link>
                        </div>
                    </div>

                    {/* Links for large screens */}
                    <div className="hidden sm:block sm:ml-6">
                        <div className="flex space-x-4">
                            <Link
                                to="/"
                                className="text-white px-3 py-2 rounded-md text-lg font-medium hover:bg-blue-700"
                            >
                                Home
                            </Link>
                            <Link
                                to="/getr"
                                className="text-white px-3 py-2 rounded-md text-lg font-medium hover:bg-blue-700"
                            >
                                Resources
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="sm:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <Link
                            to="/"
                            className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            to="/resources"
                            className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Resources
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
