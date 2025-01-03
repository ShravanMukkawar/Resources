import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FeedbackPage = () => {
    const [feedbackList, setFeedbackList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch all feedback
        const fetchFeedback = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/feedback`);
                setFeedbackList(response.data);
            } catch (err) {
                setError('Failed to load feedback.');
            } finally {
                setLoading(false);
            }
        };

        fetchFeedback();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl text-gray-600">Loading feedback...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl text-red-600">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-6 px-4">
            <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Feedback from Our Users</h1>

            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
                {feedbackList.length === 0 ? (
                    <div className="text-center text-gray-600">No feedback available yet.</div>
                ) : (
                    feedbackList.map((feedback) => (
                        <div key={feedback._id} className="mb-6 border-b pb-6">
                            <div className="flex items-center mb-4">
                                <div className="font-semibold text-lg text-blue-500">{feedback.name}</div>
                                <div className="ml-4 text-sm text-gray-500">{feedback.branch}</div>
                            </div>
                            <div className="text-gray-700">{feedback.suggestion}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default FeedbackPage;