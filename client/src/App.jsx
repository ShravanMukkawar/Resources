import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './pages/Navbar'; // Import Navbar
import YouTubePlaylist from './pages/YouTubePlaylist';
import FileUpload from './pages/upload.jsx';
import Home from './pages/Home';
import FetchResourcesPage from './pages/getResource.jsx';
import FeedbackPage from './pages/Feedback.jsx';
import FeedbackForm from './pages/SubmitFeed.jsx';
import UpdateResourcesPage from './pages/UpdateResource.jsx';
import CalendarComponent from './pages/Calendar.jsx';
import { Analytics } from "@vercel/analytics/react"

const App = () => {
  return (
    <Router>
      <div className="flex flex-col h-screen">
        <Navbar />
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/upload" element={<FileUpload />} />
            <Route path="/yt/:id" element={<YouTubePlaylist />} />
            <Route path="/" element={<Home />} />
            <Route path="/getr" element={<FetchResourcesPage />} />
            <Route path="/updater" element={<UpdateResourcesPage />} />
            <Route path="/seefeedback" element={<FeedbackPage />} />
            <Route path="/sfeedback" element={<FeedbackForm />} />
            <Route path="/calendar" element={<CalendarComponent />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
