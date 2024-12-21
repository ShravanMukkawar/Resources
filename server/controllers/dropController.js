const streamifier = require("streamifier");
const dropbox = require("../utils/dropboxConfig"); // Dropbox configuration module

// Function to check if the folder exists
const checkFolderExistence = (folderPath, callback) => {
  dropbox(
    {
      resource: "files/get_metadata",
      parameters: { path: `/${folderPath}` },
    },
    (err, result) => {
      if (err && err.error && err.error.is_path) {
        if (err.error.is_path.is_conflict) {
          console.log("Folder already exists:", folderPath);
          return callback(null, true); // Folder exists, no need to create it
        }
        console.error("Unexpected error checking folder existence:", err);
        return callback(err, false);
      }
      console.log("Folder exists:", folderPath);
      callback(null, true); // Folder exists
    }
  );
};

// Function to create the folder if it doesn't exist
const createFolder = (folderPath, callback) => {
  dropbox(
    {
      resource: "files/create_folder_v2",
      parameters: { path: `/${folderPath}` },
    },
    (err, result) => {
      if (err) {
        if (err.error && err.error.error_summary && err.error.error_summary.includes("path/conflict/folder")) {
          console.log("Folder already exists:", folderPath);
          return callback(null); // Folder already exists, no need to create it again
        }
        console.error("Error creating folder:", err);
        return callback(err); // Return the error if folder creation fails
      }
      console.log("Folder created successfully:", folderPath);
      callback(null); // Folder created successfully
    }
  );
};

// Function to handle file upload
const uploadFile = (req, res) => {
  const { folderName } = req.body; // Folder name from the request body
  const file = req.file; // Uploaded file from multer

  if (!file) {
    return res.status(400).json({ error: "No file provided" });
  }

  const fileBuffer = file.buffer;
  const fileName = file.originalname;
  const folderPath = folderName || "default_folder"; // Default folder if not specified
  const dropboxPath = `/${folderPath}/${fileName}`; // Full path in Dropbox

  console.log("Starting upload process...");

  // Check if the folder exists
  checkFolderExistence(folderPath, (err, folderExists) => {
    if (err) {
      return res.status(500).json({ error: "Error checking folder existence", details: err });
    }

    // If the folder does not exist, create it
    if (!folderExists) {
      console.log("Folder does not exist, creating it...");
      createFolder(folderPath, (err) => {
        if (err) {
          return res.status(500).json({ error: "Failed to create folder", details: err });
        }

        // Proceed with file upload after folder creation
        uploadToDropbox(fileBuffer, dropboxPath, res);
      });
    } else {
      // Proceed with file upload directly if the folder exists
      uploadToDropbox(fileBuffer, dropboxPath, res);
    }
  });
};

// Helper function to upload the file to Dropbox
const uploadToDropbox = (fileBuffer, dropboxPath, res) => {
  const fileStream = streamifier.createReadStream(fileBuffer);

  dropbox(
    {
      resource: "files/upload",
      parameters: {
        path: dropboxPath,
        mode: "add",
        autorename: true,
      },
      readStream: fileStream,
    },
    (err, result) => {
      if (err) {
        console.error("Error uploading file:", err);
        return res.status(500).json({ error: "Failed to upload to Dropbox", details: err });
      }

      console.log("File uploaded successfully:", result);

      // Generate a shared link for the uploaded file
      dropbox(
        {
          resource: "sharing/create_shared_link_with_settings",
          parameters: { path: dropboxPath },
          settings: {
            requested_visibility: "public", // This ensures the link is publicly accessible
          },
        },
        (err, linkResult) => {
          if (err) {
            console.error("Error generating shared link:", err);
            return res.status(500).json({ error: "Failed to generate shared link", details: err });
          }

          const sharedLink = linkResult.url.replace("?dl=0", "?dl=1"); // Direct download link
          console.log("Shared link generated:", sharedLink);

          // Return the shared link in the response
          res.status(200).json({ message: "File uploaded successfully", sharedLink });
        }
      );
    }
  );
};

module.exports = { uploadFile };
