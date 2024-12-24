import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './pages/Navbar';  // Import Navbar
import YouTubePlaylist from './pages/YouTubePlaylist';
import FileUpload from './pages/upload.jsx';
import Home from './pages/Home';
import FetchResourcesPage from './pages/getResource.jsx';
import FeedbackPage from './pages/Feedback.jsx';

const App = () => {
  return (
    <Router>
      {/* Navbar will be visible on all pages */}
      <Navbar />
      <Routes>
        <Route path="/upload" element={<FileUpload />} />
        <Route path="/yt/:id" element={<YouTubePlaylist />} />
        <Route path="/" element={<Home />} />
        <Route path="/getr" element={<FetchResourcesPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
      </Routes>
    </Router>
  );
};

export default App;
