import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Linkedin, Github } from 'lucide-react';

const Home = () => {
    const [visitorCount, setVisitorCount] = useState(0);

    const contests = [
        {
            platform: 'LeetCode',
            name: 'Weekly Contest 389',
            date: '2025-01-05',
            time: '08:00 AM',
            duration: '1.5 hours',
            link: 'https://leetcode.com/contest/'
        },
        {
            platform: 'CodeChef',
            name: 'Starters 124',
            date: '2025-01-08',
            time: '08:00 PM',
            duration: '2 hours',
            link: 'https://www.codechef.com/contests'
        }
    ];

    useEffect(() => {
        const fetchVisitorCount = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/visitor-count');
                const data = await response.json();
                setVisitorCount(data.count);
                await fetch('http://localhost:8000/api/visitor-count', { method: 'POST' });
            } catch (err) {
                console.error('Failed to fetch or update visitor count:', err);
            }
        };
    
        fetchVisitorCount();
    }, []);
    
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.6,
                delayChildren: 0.3,
                staggerChildren: 0.2
            }
        }
    };
    
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };

    const socialLinkVariants = {
        hover: {
            y: -3,
            scale: 1.1,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 10
            }
        }
    };
    
    const getPlatformColor = (platform) => {
        const colors = {
            'LeetCode': 'bg-yellow-500',
            'CodeChef': 'bg-blue-500'
        };
        return colors[platform] || 'bg-gray-500';
    };
    
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { 
            weekday: 'long',
            month: 'short',
            day: 'numeric' 
        });
    };

    return (
        <motion.div 
            className=" min-h-screen bg-gradient-to-b from-[#001233] to-[#001845]"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <main className="container mx-auto px-4 py-16 w-[90vw]">
                {/* About Section */}
                <motion.section 
                    variants={itemVariants}
                    className="mb-24"
                >
                    <div className="bg-[#002855]/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-[#00B4D8]/20">
                        <h2 className="text-4xl font-bold mb-8 text-center text-white">
                            <span className="inline-block border-b-2 border-[#00B4D8] pb-2">About</span>
                        </h2>
                        <div className="text-white/90 max-w-4xl mx-auto p-6 bg-[#001233]/50 rounded-xl">
                            <p className="text-lg leading-relaxed">
                            Welcome to our computer engineering resource hub. Initially focused on Semester 4 materials, we've expanded to support students across various branches. Our platform offers study materials, coding resources, and contest updates to assist you in your academic journey. Join our community to stay informed about the latest competitive programming contests and educational resources.
                            </p>
                        </div>
                    </div>
                </motion.section>

                {/* Contest Calendar Section */}
                <motion.section 
                    variants={itemVariants}
                    className="mb-24"
                >
                    <div className="bg-[#002855]/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-[#00B4D8]/20">
                        <h2 className="text-4xl font-bold mb-8 text-center text-white">
                            <span className="inline-block border-b-2 border-[#00B4D8] pb-2">
                                <Calendar className="inline-block mr-2 mb-1" />
                                Upcoming Contests
                            </span>
                        </h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            {contests.map((contest, index) => (
                                <a
                                    key={index}
                                    href={contest.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block transform transition-transform hover:scale-102"
                                >
                                    <div className="bg-[#001233]/50 rounded-xl p-6 border border-[#00B4D8]/10 hover:border-[#00B4D8]/30 transition-colors">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className={`w-3 h-3 rounded-full ${getPlatformColor(contest.platform)}`} />
                                            <span className="text-[#00B4D8] font-semibold">{contest.platform}</span>
                                        </div>
                                        <h3 className="text-white text-xl font-semibold mb-2">{contest.name}</h3>
                                        <div className="text-gray-300 space-y-1">
                                            <p className="flex items-center gap-2">
                                                <Calendar size={16} />
                                                {formatDate(contest.date)}
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <Clock size={16} />
                                                {contest.time} ({contest.duration})
                                            </p>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </motion.section>

                {/* Footer */}
                <motion.footer 
                    variants={itemVariants}
                    className="text-center text-gray-300 py-8 border-t border-[#00B4D8]/20 mt-12"
                >
                    <p className="text-sm mb-4">
                        © 2025 Computer Engineering Hub. All rights reserved.
                    </p>
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <p className="text-lg font-medium text-white">
                            Designed by Arbaj and Shravan
                        </p>
                    </div>
                </motion.footer>

                {/* Visitor Count */}
                <motion.div 
                    className="fixed bottom-4 right-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                >
                    <div className="bg-[#002855]/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg border border-[#00B4D8]/20">
                        <p className="text-sm text-gray-300">Visitors: {visitorCount}</p>
                    </div>
                </motion.div>
            </main>
        </motion.div>
    );
};

export default Home;