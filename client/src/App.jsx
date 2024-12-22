import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import YouTubePlaylist from './pages/YouTubePlaylist';
import FileUpload from './pages/upload.jsx'

import Home from './pages/Home';
import FetchResourcesPage from './pages/getResource.jsx';


const App = () => {
  return (
    <Router>
        <Routes>
        <Route path="/upload" element={<FileUpload />} />
          <Route path="/yt" element={<YouTubePlaylist />} />
          <Route path="/" element={<Home />} />
          <Route path="/getr" element={<FetchResourcesPage />} />
        </Routes>
    </Router>
  );
};

export default App;
