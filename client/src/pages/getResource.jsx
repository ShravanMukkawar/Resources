import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FetchResourcesPage = () => {
  const [formData, setFormData] = useState({
    branch: "",
    semester: "",
  });
  const navigate = useNavigate();

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

      const response = await axios.get(
        `http://localhost:8000/api/v1/resources?branch=${branch}&semester=${semester}`
      );

      setResources(response.data || []);
      const subjects = response.data.map((resource) => resource.subject.name);
      setSubjects([...new Set(subjects)]);
    } catch (err) {
      setError("An error occurred while fetching resources.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
  };

  const filteredResources = resources.filter(
    (resource) => resource.subject.name === selectedSubject
  );

  const extractPlaylistId = (url) => {
    const regex = /list=([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  return (
    <div className="min-h-screen w-[100vw] flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Fetch Resources</h1>

      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={fetchResources} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700">Branch</label>
            <input
              type="text"
              name="branch"
              value={formData.branch}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700">Semester</label>
            <input
              type="text"
              name="semester"
              value={formData.semester}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? "Fetching..." : "Fetch Resources"}
          </button>
        </form>
      </div>

      {error && <p className="mt-4 text-red-500">{error}</p>}

      {resources.length > 0 && (
        <div className="mt-6 w-full max-w-sm">
          <label className="block text-sm text-gray-700">Select Subject</label>
          <select
            onChange={handleSubjectChange}
            value={selectedSubject}
            className="w-full p-2 border border-gray-300 rounded-md"
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

      {selectedSubject && filteredResources.length > 0 && (
        <div className="mt-6 w-full max-w-sm bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-medium text-gray-800 mb-4">Resources for {selectedSubject}</h2>
          <ul className="space-y-3">
            {filteredResources.map((resource) => (
              <li key={resource._id} className="text-sm text-gray-700">
                <strong>{resource.name}</strong>
                <ul className="mt-2 space-y-2">
                  {resource.resources.length > 0 ? (
                    resource.resources.map((res, index) => (
                      <li key={index}>
                        {res.type === "youtube" ? (
                          <span
                            onClick={() =>
                              navigate(`/yt/${encodeURIComponent(extractPlaylistId(res.link))}?from=${res.from}&to=${res.to}`)}
                            className="text-blue-500 cursor-pointer hover:underline"
                          >
                            {res.type} - 
                                {res.linkName 
                                  ? (res.linkName.length > 40 
                                      ? `${res.linkName.slice(0, 35)}...` 
                                      : res.linkName) 
                                  : (res.link.length > 40 
                                      ? `${res.link.slice(0, 35)}...` 
                                      : res.link)}
                          </span>
                        ) : (
                          <a
                            href={res.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            {res.type} - 
{res.linkName 
  ? (res.linkName.length > 40 
      ? `${res.linkName.slice(0, 40)}...` 
      : res.linkName) 
  : (res.link.length > 40 
      ? `${res.link.slice(0, 40)}...` 
      : res.link)}


                          </a>
                        )}
                      </li>
                    ))
                  ) : (
                    <p>No resources available for this chapter.</p>
                  )}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}

      {resources.length === 0 && !loading && !error && (
        <p className="mt-6 text-gray-600">No resources found.</p>
      )}
    </div>
  );
};

export default FetchResourcesPage;
