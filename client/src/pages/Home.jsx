import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
    const [visitorCount, setVisitorCount] = useState(0);

    useEffect(() => {
        // Fetch the current visitor count
        const fetchVisitorCount = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/visitor-count');
                setVisitorCount(response.data.count);

                // Increment the visitor count
                await axios.post('http://localhost:8000/api/visitor-count');
            } catch (err) {
                console.error('Failed to fetch or update visitor count:', err);
            }
        };

        fetchVisitorCount();
    }, []);

    return (
        <div className="min-h-screen w-[100vw] bg-gray-100 flex flex-col items-center justify-center">
            {/* Visitor Count Display */}
            <div className="bg-blue-500 text-white w-full py-2 text-center">
                <p>Visitor Count: {visitorCount}</p>
            </div>

            <main className="flex flex-col items-center justify-center flex-1">
  

                {/* Added Description */}
                <div className="bg-gray-200 p-6 rounded-md shadow-md mb-8 max-w-md text-center">
                    <h3 className="text-xl font-semibold mb-2">About Us</h3>
                    <p className="text-gray-700">
                        This website is primarily focused on second-year CS students for their academics and internship preparation. 
                        We provide a variety of resources designed to assist you in your preparation journey.
                        <hr />
                        Don't Foreget to share your feedcak
                    </p>
                </div>

                <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition duration-300">
                    Get Started
                </button>
            </main>

            <footer className="bg-gray-800 w-full py-4">
                <p className="text-white text-center">&copy; 2023 Your Company. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Home;