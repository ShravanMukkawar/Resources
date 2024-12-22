import React, { useState } from "react";
import axios from "axios";

const FetchResourcesPage = () => {
  const [formData, setFormData] = useState({
    branch: "",
    semester: "",
  });

  const [resources, setResources] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const fetchResources = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { branch, semester } = formData;

      // Make a GET request to the backend API with the branch and semester as query parameters
      const response = await axios.get(
        `http://localhost:8000/api/v1/resources?branch=${branch}&semester=${semester}`
      );

      setResources(response.data || []); // Set the resources received from the backend

      // Extract subject names from the resources and set them as options
      const subjects = response.data.map((resource) => resource.subject.name);
      setSubjects([...new Set(subjects)]); // Remove duplicates using Set
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred while fetching resources."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
  };

  // Filter the resources to only show the ones that match the selected subject
  const filteredResources = resources.filter(
    (resource) => resource.subject.name === selectedSubject
  );

  return (
    <div className="h-screen bg-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-semibold text-gray-800 mb-8">Fetch Resources</h1>

      <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-xl border border-gray-300">
        {/* Form to input branch and semester */}
        <form
          onSubmit={fetchResources}
          className="space-y-6"
        >
          <div className="space-y-2">
            <label className="block text-xl font-medium text-gray-700">Branch</label>
            <input
              type="text"
              name="branch"
              value={formData.branch}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xl font-medium text-gray-700">Semester</label>
            <input
              type="text"
              name="semester"
              value={formData.semester}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-500 text-white text-lg font-medium rounded-lg hover:bg-blue-600 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            {loading ? "Fetching..." : "Fetch Resources"}
          </button>
        </form>
      </div>

      {/* Error Message */}
      {error && <p className="mt-4 text-red-500 text-lg">{error}</p>}

      {/* Show subjects dropdown after fetching resources */}
      {resources.length > 0 && (
        <div className="w-full max-w-lg mt-8">
          <label className="block text-xl font-medium text-gray-700">Select Subject</label>
          <select
            onChange={handleSubjectChange}
            value={selectedSubject}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          >
            <option value="">Select a Subject</option>
            {subjects.map((subject, index) => (
              <option key={index} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Display resources for selected subject */}
      {selectedSubject && filteredResources.length > 0 && (
        <div className="w-full max-w-lg mt-8 bg-white p-6 rounded-xl shadow-md border border-gray-300">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Resources for {selectedSubject}:</h2>
          <ul className="space-y-4">
            {filteredResources.map((resource) => (
              <li key={resource._id} className="space-y-2">
                <h3 className="text-xl font-medium text-gray-800">Chapter: {resource.name}</h3>
                {resource.resources && resource.resources.length > 0 ? (
                  <ul className="list-disc pl-6 space-y-2">
                    {resource.resources.map((res, index) => (
                      <li key={index} className="text-gray-700">
                        <a
                          href={res.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {res.type} - {res.link.length > 40 ? `${res.link.slice(0, 40)}...` : res.link}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No resources available for this chapter.</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* No resources message */}
      {resources.length === 0 && !loading && (
        <p className="mt-6 text-lg text-gray-600">No resources found.</p>
      )}
    </div>
  );
};

export default FetchResourcesPage;
