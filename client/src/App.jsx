import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import YouTubePlaylist from './pages/YouTubePlaylist';
import Home from './pages/Home';


const App = () => {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/yt" element={<YouTubePlaylist />} />
        </Routes>
    </Router>
  );
};

export default App;
