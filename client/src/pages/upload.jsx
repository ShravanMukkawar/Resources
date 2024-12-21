import { useState, useEffect } from "react";
import axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [folderName, setFolderName] = useState("Resources"); // State for folder name
  const [semesterId, setSemesterId] = useState("");
  const [branchName, setBranchName] = useState(""); // State for branch name
  const [subjectId, setSubjectId] = useState("");
  const [chapterId, setChapterId] = useState("");
  const branches = ["Computer Engineering", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering"];


  // Fetch options for semester, branch, subject, chapter (example purposes)
  const fetchData = async () => {
    // Fetch logic here
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if all fields are filled
    if (!file || !semesterId || !branchName || !subjectId || !chapterId || !folderName) {
      alert("Please fill all required fields.");
      return;
    }

    // Log to check if branchName is correctly updated
    console.log("Branch Name before submission:", branchName);
    console.log("Folder Name before submission:", folderName);

    // Prepare form data
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folderName", folderName); // Send folder name
    formData.append("semesterId", semesterId);
    formData.append("branchName", branchName); // Send branch name
    formData.append("subjectId", subjectId);
    formData.append("chapterId", chapterId);

    // Log the formData to ensure everything is correct
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    try {
      console.log("Starting file upload process...");
      const response = await axios.post("http://localhost:8000/api/upload", formData);
      alert("File uploaded successfully!");
      console.log("Response:", response.data);
      saveResource(response.data.sharedLink)
    } catch (error) {
      console.error("Error during upload process:", error);
      alert("Failed to upload file.");
    }
  };

  const saveResource = async (sharedLink) => {
    try {
      // Construct the resource object with required details
      const resource = {
        branch: branchName, // Using the branchName state
        semester: semesterId, // Using the semesterId state
        subject: subjectId, // Using the subjectId state
        chapter: chapterId, // Using the chapterId state
        resource: {
          type: "pdf", // Hardcoded type as per your example
          link: sharedLink, // Use the generated shared link
        },
      };
  
      console.log("Saving resource with data:", resource);
  
      // Make the POST request to the resources API
      const response = await axios.post("http://localhost:8000/api/v1/resources", resource, {
        headers: {
          "Content-Type": "application/json", // Ensure the request is sent as JSON
        },
      });
  
      alert("Resource saved successfully!");
      console.log("Resource saved response:", response.data);
    } catch (error) {
      console.error("Error during saving resource:", error);
      alert("Failed to save resource.");
    }
  };
  

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "auto",
        textAlign: "center",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
      }}
    >
      <h2>Upload File</h2>
      <form onSubmit={handleSubmit}>
        {/* Folder Name Input */}
        <input
          type="text"
          placeholder="Enter Folder Name"
          value={folderName} // Track folder name state
          onChange={(e) => setFolderName(e.target.value)} // Update folder name state
          style={{
            margin: "10px 0",
            padding: "10px",
            width: "100%",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />

        {/* Semester Input */}
        <input
  type="number"
  placeholder="Enter Semester Name"
  value={semesterId}
  onChange={(e) => {
    const value = parseInt(e.target.value, 10); // Parse the input as a number
    if (value >= 1 && value <= 8) {
      setSemesterId(value); // Update the state if within range
    } else if (e.target.value === "") {
      setSemesterId(""); // Allow clearing the input
    }
  }}
  min="1"
  max="8"
  style={{
    margin: "10px 0",
    padding: "10px",
    width: "100%",
    border: "1px solid #ccc",
    borderRadius: "5px",
  }}
/>


        {/* Branch Input */}

<select
  value={branchName} // Track branch name state
  onChange={(e) => setBranchName(e.target.value)} // Update branch name state
  style={{
    margin: "10px 0",
    padding: "10px",
    width: "100%",
    border: "1px solid #ccc",
    borderRadius: "5px",
  }}
>
  <option value="" disabled>
    Select Branch
  </option>
  {branches.map((branch, index) => (
    <option key={index} value={branch}>
      {branch}
    </option>
  ))}
</select>


        {/* Subject Input */}
        <input
          type="text"
          placeholder="Enter Subject Name"
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
          style={{
            margin: "10px 0",
            padding: "10px",
            width: "100%",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />

        {/* Chapter Input */}
        <input
          type="text"
          placeholder="Enter Chapter Name"
          value={chapterId}
          onChange={(e) => setChapterId(e.target.value)}
          style={{
            margin: "10px 0",
            padding: "10px",
            width: "100%",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />

        {/* File Upload */}
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])} // Update file state
          style={{
            margin: "10px 0",
            padding: "10px",
            width: "100%",
          }}
        />

        {/* Submit Button */}
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          Upload
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
