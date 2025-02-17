import React, { useState, useEffect } from "react";

// Simple hash function for storing session data (Not secure for real-world applications)
const generateHash = (data, secretKey) => {
  return btoa(data + secretKey); // Base64 encoding, not cryptographically secure
};

// Validate if the session is valid
const validateHash = (data, hash, secretKey) => {
  return generateHash(data, secretKey) === hash;
};

const ProtectedRoute = ({ children, requiredPassword }) => {
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState("");

  const secretKey = import.meta.env.VITE_REACT_APP_SECRET_KEY;

  // Check if session is still valid
  useEffect(() => {
    const sessionExpiry = localStorage.getItem("protectedRouteSessionExpiry");
    const sessionHash = localStorage.getItem("protectedRouteSessionHash");
    const currentTime = new Date().getTime();

    if (
      sessionExpiry &&
      sessionHash &&
      currentTime < parseInt(sessionExpiry, 10) &&
      validateHash(sessionExpiry, sessionHash, secretKey)
    ) {
      setIsAuthorized(true); // Allow access if session is still valid
    }
  }, [secretKey]);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    // Check if entered password matches
    if (password === requiredPassword) {
      setIsAuthorized(true);
      setError("");

      const expiryTime = new Date().getTime() + 15 * 60 * 1000; // Set expiry for 15 minutes
      const hash = generateHash(expiryTime.toString(), secretKey);

      // Store session data in localStorage
      localStorage.setItem("protectedRouteSessionExpiry", expiryTime);
      localStorage.setItem("protectedRouteSessionHash", hash);
    } else {
      setError("Incorrect password. Access denied.");
    }
  };

  if (isAuthorized) {
    return children; // Render the protected component if authorized
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Protected Route</h2>
        <p className="text-gray-400 mt-2 text-center">Enter the password to access this page.</p>
        <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-4">
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring focus:ring-blue-500 focus:outline-none"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
          >
            Submit
          </button>
        </form>
        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default ProtectedRoute;
