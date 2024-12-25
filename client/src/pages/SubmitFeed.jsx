import React, { useState } from 'react';
import axios from 'axios';

const FeedbackForm = () => {
    const [feedback, setFeedback] = useState({
        name: '',
        branch: '',
        suggestion: ''
    });

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
    );
};

export default FeedbackForm;