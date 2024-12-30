import React, { useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const UpdateResourcePage = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    branch: searchParams.get("branch") || "",
    semester: searchParams.get("semester") || "",
  });

  const [resources, setResources] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [selectedResource, setSelectedResource] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [resourceUpdates, setResourceUpdates] = useState({
    link: "",
    linkName: "",
    type: "",
    from: "",
    to: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const fetchResources = async () => {
    if (!formData.branch || !formData.semester) {
      setError("Please enter both branch and semester");
      return;
    }

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
    setSelectedChapter("");
    setSelectedResource(null);
  };

  const handleChapterSelect = (chapter) => {
    setSelectedChapter(chapter._id);
    setSelectedResource(null);
  };

  const handleResourceSelect = (resource) => {
    setSelectedResource(resource);
    setResourceUpdates({
      link: resource.link || "",
      linkName: resource.linkName || "",
      type: resource.type || "",
      from: resource.from || "",
      to: resource.to || "",
    });
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setResourceUpdates(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setUpdateSuccess(false);

    try {
      const { branch, semester } = formData;
      await axios.patch(
        `http://localhost:8000/api/v1/resources?branch=${branch}&semester=${semester}`,
        {
          chapterId: selectedChapter,
          resourceId: selectedResource._id,
          updates: resourceUpdates,
        }
      );

      setUpdateSuccess(true);
      fetchResources(); // Refresh the resources
    } catch (err) {
      setError("An error occurred while updating the resource.");
    } finally {
      setLoading(false);
    }
  };

  const filteredResources = resources.filter(
    (resource) => resource.subject.name === selectedSubject
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Update Resources</h1>

      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
        <div className="space-y-4">
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
            onClick={fetchResources}
            disabled={loading}
            className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? "Loading..." : "Get Resources"}
          </button>
        </div>
      </div>

      {error && <p className="mt-4 text-red-500">{error}</p>}
      {updateSuccess && (
        <p className="mt-4 text-green-500">Resource updated successfully!</p>
      )}

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
          <h2 className="text-xl font-medium text-gray-800 mb-4">
            Resources for {selectedSubject}
          </h2>
          <ul className="space-y-3">
            {filteredResources.map((resource) => (
              <li key={resource._id} className="text-sm text-gray-700">
                <button
                  onClick={() => handleChapterSelect(resource)}
                  className="font-medium text-blue-500 hover:underline"
                >
                  {resource.name}
                </button>
                {selectedChapter === resource._id && (
                  <ul className="mt-2 space-y-2 ml-4">
                    {resource.resources.map((res, index) => (
                      <li key={index}>
                        <button
                          onClick={() => handleResourceSelect(res)}
                          className={`text-sm ${
                            selectedResource?._id === res._id
                              ? "text-blue-600 font-medium"
                              : "text-gray-600"
                          } hover:underline`}
                        >
                          {res.type} - {res.linkName}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedResource && (
        <div className="mt-6 w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Update Resource
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700">Link</label>
              <input
                type="text"
                name="link"
                value={resourceUpdates.link}
                onChange={handleUpdateChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700">Link Name</label>
              <input
                type="text"
                name="linkName"
                value={resourceUpdates.linkName}
                onChange={handleUpdateChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700">Type</label>
              <select
                name="type"
                value={resourceUpdates.type}
                onChange={handleUpdateChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select Type</option>
                <option value="youtube">YouTube</option>
                <option value="pdf">PDF</option>
                <option value="other">Other</option>
              </select>
            </div>

            {resourceUpdates.type === "youtube" && (
              <>
                <div>
                  <label className="block text-sm text-gray-700">From</label>
                  <input
                    type="text"
                    name="from"
                    value={resourceUpdates.from}
                    onChange={handleUpdateChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700">To</label>
                  <input
                    type="text"
                    name="to"
                    value={resourceUpdates.to}
                    onChange={handleUpdateChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
            >
              {loading ? "Updating..." : "Update Resource"}
            </button>
          </form>
        </div>
      )}

      {resources.length === 0 && !loading && !error && (
        <p className="mt-6 text-gray-600">No resources found.</p>
      )}
    </div>
  );
};

export default UpdateResourcePage;