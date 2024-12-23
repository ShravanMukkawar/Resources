import { useState, useEffect } from "react";
import axios from "axios";

const FileUpload = () => {
  const [inputType, setInputType] = useState("file"); // State to track the selected input type
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState(""); // State to track the URL
  const [folderName, setFolderName] = useState("Resources");
  const [semesterId, setSemesterId] = useState("");
  const [branchName, setBranchName] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [chapterId, setChapterId] = useState("");
  const branches = ["Computer Engineering", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering"];

  useEffect(() => {
    // Fetch logic if needed
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!semesterId || !branchName || !subjectId || !chapterId || !folderName) {
      alert("Please fill all required fields.");
      return;
    }

    if (inputType === "file" && !file) {
      alert("Please choose a file.");
      return;
    }

    if (inputType === "url" && !url) {
      alert("Please enter a valid URL.");
      return;
    }

    if (inputType === "file") {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folderName", folderName);
      formData.append("semesterId", semesterId);
      formData.append("branchName", branchName);
      formData.append("subjectId", subjectId);
      formData.append("chapterId", chapterId);

      try {
        const response = await axios.post("http://localhost:8000/api/upload", formData);
        alert("File uploaded successfully!");
        saveResource(response.data.sharedLink);
      } catch (error) {
        console.error("Error during file upload:", error);
        alert("Failed to upload file.");
      }
    } else if (inputType === "url") {
      saveResource(url);
    }
  };

  const saveResource = async (sharedLink) => {
    try {
      const resource = {
        branch: branchName,
        semester: semesterId,
        subject: subjectId,
        chapter: chapterId,
        resource: {
          type: inputType === "file" ? "pdf" : "url",
          link: sharedLink,
        },
      };

      const response = await axios.post("http://localhost:8000/api/v1/resources", resource, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      alert("Resource saved successfully!");
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
      <h2>Upload Resource</h2>
      <form onSubmit={handleSubmit}>
        {/* Option to Select Input Type */}
        <div style={{ textAlign: "left" }}>
          <label>
            <input
              type="radio"
              value="file"
              checked={inputType === "file"}
              onChange={() => setInputType("file")}
            />
            Upload File
          </label>
          <label style={{ marginLeft: "10px" }}>
            <input
              type="radio"
              value="url"
              checked={inputType === "url"}
              onChange={() => setInputType("url")}
            />
            Enter URL
          </label>
        </div>

        {/* Dynamic Inputs */}
        {inputType === "file" && (
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            style={{
              margin: "10px 0",
              padding: "10px",
              width: "100%",
            }}
          />
        )}
        {inputType === "url" && (
          <input
            type="text"
            placeholder="Enter Resource URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{
              margin: "10px 0",
              padding: "10px",
              width: "100%",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
        )}

        {/* Other Inputs */}
        <input
          type="text"
          placeholder="Enter Folder Name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          style={{
            margin: "10px 0",
            padding: "10px",
            width: "100%",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />
        <input
          type="number"
          placeholder="Enter Semester Name"
          value={semesterId}
          onChange={(e) => setSemesterId(e.target.value)}
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
        <select
          value={branchName}
          onChange={(e) => setBranchName(e.target.value)}
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
          Submit
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
