import React, { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Youtube, FileText, Globe, ChevronRight, Mail } from 'lucide-react';

const UpdateResourcePage = () => {
  const [formData, setFormData] = useState({
    branch: "",
    semester: "",
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

  // ... (keep all the handler functions the same, but replace axios with fetch)
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
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/resources?branch=${branch}&semester=${semester}`
      );
      const data = await response.json();

      setResources(data || []);
      const subjects = data.map((resource) => resource.subject.name);
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
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/resources?branch=${branch}&semester=${semester}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chapterId: selectedChapter,
            resourceId: selectedResource._id,
            updates: resourceUpdates,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Update failed');
      }

      setUpdateSuccess(true);
      fetchResources(); // Refresh the resources
    } catch (err) {
      setError("An error occurred while updating the resource.");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, staggerChildren: 0.1 }
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

  const getResourceIcon = (type) => {
    switch (type) {
      case 'youtube':
        return <Youtube size={18} className="text-red-500" />;
      case 'pdf':
        return <FileText size={18} className="text-blue-500" />;
      case 'url':
        return <Globe size={18} className="text-green-500" />;
      default:
        return <Mail size={18} className="text-gray-500" />;
    }
  };

  const filteredResources = resources.filter(
    (resource) => resource.subject.name === selectedSubject
  );

  // ... (rest of the JSX remains the same)
  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-[#001233] to-[#001845] p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-6xl mx-auto">
        <motion.h1 
          className="text-3xl font-bold text-white mb-8 text-center"
          variants={itemVariants}
        >
          <span className="border-b-2 border-[#00B4D8] pb-2">Update Resources</span>
        </motion.h1>

        <motion.div 
          className="grid md:grid-cols-2 gap-8"
          variants={containerVariants}
        >
          {/* Left Column */}
          <div className="space-y-6">
            <motion.div 
              className="bg-[#002855]/80 backdrop-blur-sm p-6 rounded-xl border border-[#00B4D8]/20 shadow-xl"
              variants={itemVariants}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Branch</label>
                  <input
                    type="text"
                    name="branch"
                    value={formData.branch}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-[#001233]/50 border border-[#00B4D8]/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00B4D8]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Semester</label>
                  <input
                    type="text"
                    name="semester"
                    value={formData.semester}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-[#001233]/50 border border-[#00B4D8]/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00B4D8]"
                    required
                  />
                </div>

                <button
                  onClick={fetchResources}
                  disabled={loading}
                  className="w-full py-3 bg-[#00B4D8] text-white rounded-lg hover:bg-[#00B4D8]/80 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {loading ? "Loading..." : "Get Resources"}
                </button>
              </div>
            </motion.div>

            {resources.length > 0 && (
              <motion.div 
                className="bg-[#002855]/80 backdrop-blur-sm p-6 rounded-xl border border-[#00B4D8]/20 shadow-xl"
                variants={itemVariants}
              >
                <label className="block text-sm text-gray-300 mb-2">Select Subject</label>
                <select
                  onChange={handleSubjectChange}
                  value={selectedSubject}
                  className="w-full p-3 bg-[#001233]/50 border border-[#00B4D8]/30 rounded-lg text-white focus:outline-none focus:border-[#00B4D8]"
                >
                  <option value="">Select a Subject</option>
                  {subjects.map((subject, index) => (
                    <option key={index} value={subject}>{subject}</option>
                  ))}
                </select>
              </motion.div>
            )}

            {selectedSubject && filteredResources.length > 0 && (
              <motion.div 
                className="bg-[#002855]/80 backdrop-blur-sm p-6 rounded-xl border border-[#00B4D8]/20 shadow-xl"
                variants={itemVariants}
              >
                <h2 className="text-xl font-medium text-white mb-4 flex items-center gap-2">
                  <BookOpen className="text-[#00B4D8]" />
                  Resources for {selectedSubject}
                </h2>
                <ul className="space-y-4">
                  {filteredResources.map((resource) => (
                    <li key={resource._id}>
                      <button
                        onClick={() => handleChapterSelect(resource)}
                        className="text-[#00B4D8] hover:text-[#00B4D8]/80 font-medium flex items-center gap-2"
                      >
                        <ChevronRight 
                          className={`transition-transform ${selectedChapter === resource._id ? 'rotate-90' : ''}`}
                        />
                        {resource.name}
                      </button>
                      {selectedChapter === resource._id && (
                        <ul className="mt-3 space-y-2 ml-6">
                          {resource.resources.map((res, index) => (
                            <li key={index}>
                              <button
                                onClick={() => handleResourceSelect(res)}
                                className={`flex items-center gap-2 ${
                                  selectedResource?._id === res._id
                                    ? "text-[#00B4D8] font-medium"
                                    : "text-gray-400 hover:text-gray-300"
                                }`}
                              >
                                {getResourceIcon(res.type)}
                                {res.linkName}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {error && (
              <motion.div 
                className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-lg"
                variants={itemVariants}
              >
                {error}
              </motion.div>
            )}

            {updateSuccess && (
              <motion.div 
                className="bg-green-500/20 border border-green-500/50 text-green-200 p-4 rounded-lg"
                variants={itemVariants}
              >
                Resource updated successfully!
              </motion.div>
            )}

            {selectedResource && (
              <motion.div 
                className="bg-[#002855]/80 backdrop-blur-sm p-6 rounded-xl border border-[#00B4D8]/20 shadow-xl"
                variants={itemVariants}
              >
                <h3 className="text-xl font-medium text-white mb-6 border-b border-[#00B4D8]/30 pb-3">
                  Update Resource
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Link</label>
                    <input
                      type="text"
                      name="link"
                      value={resourceUpdates.link}
                      onChange={handleUpdateChange}
                      className="w-full p-3 bg-[#001233]/50 border border-[#00B4D8]/30 rounded-lg text-white focus:outline-none focus:border-[#00B4D8]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Link Name</label>
                    <input
                      type="text"
                      name="linkName"
                      value={resourceUpdates.linkName}
                      onChange={handleUpdateChange}
                      className="w-full p-3 bg-[#001233]/50 border border-[#00B4D8]/30 rounded-lg text-white focus:outline-none focus:border-[#00B4D8]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Type</label>
                    <select
                      name="type"
                      value={resourceUpdates.type}
                      onChange={handleUpdateChange}
                      className="w-full p-3 bg-[#001233]/50 border border-[#00B4D8]/30 rounded-lg text-white focus:outline-none focus:border-[#00B4D8]"
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="youtube">YouTube</option>
                      <option value="pdf">PDF</option>
                      <option value="url">URL</option>
                    </select>
                  </div>

                  {resourceUpdates.type === "youtube" && (
                    <>
                      <div>
                        <label className="block text-sm text-gray-300 mb-2">From</label>
                        <input
                          type="text"
                          name="from"
                          value={resourceUpdates.from}
                          onChange={handleUpdateChange}
                          className="w-full p-3 bg-[#001233]/50 border border-[#00B4D8]/30 rounded-lg text-white focus:outline-none focus:border-[#00B4D8]"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-300 mb-2">To</label>
                        <input
                          type="text"
                          name="to"
                          value={resourceUpdates.to}
                          onChange={handleUpdateChange}
                          className="w-full p-3 bg-[#001233]/50 border border-[#00B4D8]/30 rounded-lg text-white focus:outline-none focus:border-[#00B4D8]"
                          required
                        />
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#00B4D8] text-white rounded-lg hover:bg-[#00B4D8]/80 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200 mt-6"
                  >
                    {loading ? "Updating..." : "Update Resource"}
                  </button>
                </form>
              </motion.div>
            )}
          </div>
        </motion.div>

        {resources.length === 0 && !loading && !error && (
          <motion.p 
            className="text-center text-gray-400 mt-8"
            variants={itemVariants}
          >
            No resources found.
          </motion.p>
        )}
      </div>
    </motion.div>
  );
};
export default UpdateResourcePage;
