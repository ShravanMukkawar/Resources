import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
    const [visitorCount, setVisitorCount] = useState(0);
    const [feedback, setFeedback] = useState({
        name: '',
        branch: '',
        suggestion: ''
    });

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

    const handleFeedbackChange = (e) => {
        const { name, value } = e.target;
        setFeedback({
            ...feedback,
            [name]: value
        });
    };

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/feedback', feedback);
            alert('Feedback submitted successfully');
            setFeedback({
                name: '',
                branch: '',
                suggestion: ''
            });
        } catch (err) {
            console.error('Error submitting feedback:', err);
        }
    };

    return (
        <div className="min-h-screen w-[100vw] bg-gray-100 flex flex-col items-center justify-center">
            {/* Visitor Count Display */}
            <div className="bg-blue-500 text-white w-full py-2 text-center">
                <p>Visitor Count: {visitorCount}</p>
            </div>


            <main className="flex flex-col items-center justify-center flex-1">
                <h2 className="text-2xl font-bold mb-4">Discover Our Features</h2>
                <p className="text-gray-700 mb-8 text-center max-w-md">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.
                </p>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition duration-300">
                    Get Started
                </button>
            </main>

            <footer className="bg-gray-800 w-full py-4">
                <p className="text-white text-center">&copy; 2023 Your Company. All rights reserved.</p>
            </footer>

            {/* Feedback Form */}
            <div className="w-full max-w-md p-6 bg-white shadow-lg mt-8 rounded-lg">
                <h2 className="text-2xl font-bold text-center mb-4">We value your feedback!</h2>
                <form onSubmit={handleFeedbackSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700" htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={feedback.name}
                            onChange={handleFeedbackChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700" htmlFor="branch">Branch</label>
                        <input
                            type="text"
                            id="branch"
                            name="branch"
                            value={feedback.branch}
                            onChange={handleFeedbackChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700" htmlFor="suggestion">Any Suggestions</label>
                        <textarea
                            id="suggestion"
                            name="suggestion"
                            value={feedback.suggestion}
                            onChange={handleFeedbackChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                        Submit Feedback
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Home;
