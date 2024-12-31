import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Linkedin } from 'lucide-react';
import arbaj from '../images/Arbaj.jpg'
import shravan from '../images/shravan.jpg'

const Home = () => {
    const [visitorCount, setVisitorCount] = useState(0);

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

    const founders = [
        { 
            name: 'Arbaj Shaikh', 
            img: arbaj,
            linkedin: 'https://www.linkedin.com/in/arbaj-shaikh-0b2bb325a',
            email: 'arbajshaikh2004@gmail.com',
        },
        { 
            name: 'Shravan Mukkawar', 
            img: shravan,
            linkedin: 'https://www.linkedin.com/in/shravan-mukkawar-287894249/',
            email: 'mukkawarshravan04@gmail.com',
        },
    ];

    return (
        <motion.div 
            className="w-[100vw] min-h-screen bg-gradient-to-b from-[#001233] to-[#001845]"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <main className="container mx-auto px-4 py-16 w-[90vw]">
                {/* Our Story Section */}
                <motion.section 
                    variants={itemVariants}
                    className="mb-24"
                >
                    <div className="bg-[#002855]/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-[#00B4D8]/20">
                        <h2 className="text-4xl font-bold mb-8 text-center text-white">
                            <span className="inline-block border-b-2 border-[#00B4D8] pb-2">Our Story</span>
                        </h2>
                        <div className="grid md:grid-cols-2 gap-8 text-white/90 max-w-4xl mx-auto">
                            <div className="space-y-4 p-6 bg-[#001233]/50 rounded-xl">
                                <h3 className="text-xl font-semibold text-[#00B4D8]">What We Offer</h3>
                                <p>
                                    We initially started providing resources for <span className="text-[#00B4D8]">Semester 4 Computer Engineering</span>. Based on your feedback, we have expanded to include resources for other branches, helping students in their academic journey.
                                </p>
                            </div>
                            <div className="space-y-4 p-6 bg-[#001233]/50 rounded-xl">
                                <h3 className="text-xl font-semibold text-[#00B4D8]">Our Impact</h3>
                                <p>
                                    Our efforts have created a significant academic impact. With your support, we have fostered a collaborative learning environment that benefits students across multiple disciplines.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Founders Section */}
                <motion.section variants={itemVariants} className="mb-20">
                    <h2 className="text-4xl font-bold mb-12 text-center text-white">
                        <span className="inline-block border-b-2 border-[#00B4D8] pb-2">Our Founders</span>
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {founders.map((founder) => (
                            <motion.div 
                                key={founder.name}
                                className="relative group"
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className="bg-[#002855]/80 backdrop-blur-sm rounded-xl p-8 text-center border border-[#00B4D8]/20">
                                    <div className="w-48 h-48 mx-auto mb-6 relative">
                                        <div className="absolute inset-0 rounded-full opacity-20 group-hover:opacity-30 transition-opacity"
                                             style={{ backgroundColor: founder.color }}>
                                        </div>
                                        <img 
                                            src={founder.img} 
                                            alt={founder.name} 
                                            className="rounded-full w-full h-full object-cover" 
                                        />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4" style={{ color: founder.color }}>
                                        {founder.name}
                                    </h3>
                                    <div className="flex justify-center space-x-4">
                                        <a 
                                            href={founder.linkedin} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-gray-300 hover:text-[#00B4D8] transition-colors flex items-center gap-2"
                                        >
                                            <Linkedin size={20} />
                                            <span>LinkedIn</span>
                                        </a>
                                        <a 
                                            href={`mailto:${founder.email}`}
                                            className="text-gray-300 hover:text-[#00B4D8] transition-colors flex items-center gap-2"
                                        >
                                            <Mail size={20} />
                                            <span>Email</span>
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

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