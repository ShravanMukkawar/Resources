import  { useEffect, useState } from 'react';
// import Navbar from '../components/Navbar';
import axios from 'axios';

const API_KEY=import.meta.env.VITE_API_KEY // Replace with your YouTube Data API key
const PLAYLIST_ID =import.meta.env.VITE_PLAYLIST_ID; // Replace with your YouTube playlist ID
const YouTubePlaylist = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [nextPageToken, setNextPageToken] = useState(''); // Token for fetching more videos
  const [fetchedTokens, setFetchedTokens] = useState(new Set()); // Set to track fetched tokens

  // Load watched videos and watch later videos from localStorage on initial load
  const loadWatchedVideos = () => {
    const watchedVideos = JSON.parse(localStorage.getItem('watchedVideos')) || [];
    return watchedVideos;
  };

  const loadWatchLaterVideos = () => {
    const watchLaterVideos = JSON.parse(localStorage.getItem('watchLaterVideos')) || [];
    return watchLaterVideos;
  };

  const [watchedVideos, setWatchedVideos] = useState(loadWatchedVideos); // State to track watched videos
  const [watchLaterVideos, setWatchLaterVideos] = useState(loadWatchLaterVideos); // State to track watch later videos
  
  const [totalDuration, setTotalDuration] = useState(0); // Total duration of playlist
  const [videoDurations, setVideoDurations] = useState({}); // Store video durations by ID

  // Function to fetch playlist videos
  const fetchPlaylistVideos = async (pageToken = '') => {
    if (fetchedTokens.has(pageToken)) return;
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/playlistItems`,
        {
          params: {
            part: 'snippet,contentDetails',
            playlistId: PLAYLIST_ID,
            key: API_KEY,
            maxResults: 20,
            pageToken: pageToken,
          },
        }
      );
  
      const newVideos = response.data.items;
  
      // Fetch video durations
      const videoIds = newVideos.map(video => video.contentDetails.videoId).join(',');
      const durationResponse = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
        params: {
          part: 'contentDetails',
          id: videoIds,
          key: API_KEY,
        },
      });
  
      const durations = durationResponse.data.items.map(video => parseDuration(video.contentDetails.duration));
      const totalNewDuration = durations.reduce((sum, duration) => sum + duration, 0);
  
      setTotalDuration(prevDuration => prevDuration + totalNewDuration);
  
      // Update videoDurations with the new durations
      setVideoDurations((prevDurations) => {
        const newDurations = {};
        newVideos.forEach((video, index) => {
          const videoId = video.contentDetails.videoId;
          newDurations[videoId] = durations[index];
        });
        return { ...prevDurations, ...newDurations };
      });
  
      // Filter out duplicate videos
      setVideos((prevVideos) => {
        const existingIds = new Set(prevVideos.map(video => video.snippet.resourceId.videoId));
        const filteredVideos = newVideos.filter(video => !existingIds.has(video.snippet.resourceId.videoId));
        return [...prevVideos, ...filteredVideos];
      });
  
      setNextPageToken(response.data.nextPageToken || null);
      setFetchedTokens((prevTokens) => new Set(prevTokens).add(pageToken));
  
    } catch (error) {
      console.error('Error fetching playlist videos', error);
    }
  };
  

  const parseDuration = (duration) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = match[1] ? parseInt(match[1].replace('H', '')) : 0;
    const minutes = match[2] ? parseInt(match[2].replace('M', '')) : 0;
    const seconds = match[3] ? parseInt(match[3].replace('S', '')) : 0;
    return hours * 3600 + minutes * 60 + seconds;
  };

  useEffect(() => {
    // Initial fetch to get the first set of videos
    fetchPlaylistVideos();
  }, []);

  // Automatically fetch more videos if there's a nextPageToken and it hasn't been fetched before
  useEffect(() => {
    if (nextPageToken && !fetchedTokens.has(nextPageToken)) {
      fetchPlaylistVideos(nextPageToken);
    }
  }, [nextPageToken]);

  // Function to toggle the "watched" status of a video
  const toggleWatched = (video) => {
    const videoId = video.snippet.resourceId.videoId;
    let updatedWatchedVideos;

    if (isWatched(videoId)) {
      // If the video is already watched, remove it from watchedVideos
      updatedWatchedVideos = watchedVideos.filter((id) => id !== videoId);
    } else {
      // If the video is not watched, add it to watchedVideos
      updatedWatchedVideos = [...watchedVideos, videoId];
    }

    setWatchedVideos(updatedWatchedVideos); // Update state to trigger re-render
    localStorage.setItem('watchedVideos', JSON.stringify(updatedWatchedVideos)); // Update localStorage
  };

  // Function to check if the video is watched
  const isWatched = (videoId) => {
    return watchedVideos.includes(videoId); // Check if video ID is in the watched list
  };

  // Function to mark a video as "watch later"
  const toggleWatchLater = (video) => {
    const videoId = video.snippet.resourceId.videoId;
    let updatedWatchLaterVideos;

    if (isWatchLater(videoId)) {
      // Remove from watchLaterVideos
      updatedWatchLaterVideos = watchLaterVideos.filter((id) => id !== videoId);
    } else {
      // Add to watchLaterVideos
      updatedWatchLaterVideos = [...watchLaterVideos, videoId];
    }

    setWatchLaterVideos(updatedWatchLaterVideos); // Update state to trigger re-render
    localStorage.setItem('watchLaterVideos', JSON.stringify(updatedWatchLaterVideos)); // Update localStorage
  };

  // Function to check if the video is in the watch later list
  const isWatchLater = (videoId) => {
    return watchLaterVideos.includes(videoId); // Check if video ID is in the watch later list
  };

  const calculateTotalWatchedTime = () => {
    return watchedVideos.reduce((sum, videoId) => sum + (videoDurations[videoId] || 0), 0);
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  return (
    <>
      <div className="absolute top-0 right-0 text-white bg-blue-900 p-2 rounded shadow-lg">
        <p>Total Videos: {videos.length}</p>
        <p>Total Watched: {watchedVideos.length}</p>
        <p>Total Length: {formatTime(totalDuration)}</p>
        <p>Total Time Watched: {formatTime(calculateTotalWatchedTime())}</p>
      </div>
      {/* Main Content - Flex Container */}
      <div className="flex w-[100vw] h-[100vh]">
        {/* Video Titles Section */}
        <div className="bg-blue-500 dark:bg-blue-950 w-1/4 h-full overflow-y-auto p-4">
          <h2 className="text-white text-lg font-semibold mb-4">Video Titles</h2>
          {videos.map((video) => (
            <div
              key={video.snippet.resourceId.videoId}
              title={video.snippet.title}
              onClick={() => setSelectedVideo(video)} // Set the selected video on click
              className={`p-3 py-3 rounded mb-2 cursor-pointer overflow-hidden whitespace-nowrap text-ellipsis text-white ${
                selectedVideo?.snippet.resourceId.videoId === video.snippet.resourceId.videoId
                  ? isWatchLater(video.snippet.resourceId.videoId)
                    ? 'bg-orange-500' // Prioritize orange if marked as "watch later"
                    : isWatched(video.snippet.resourceId.videoId)
                    ? 'bg-green-700'  // If selected and watched, make it green
                    : 'bg-blue-700'   // If selected and not watched, make it blue
                  : isWatchLater(video.snippet.resourceId.videoId)
                  ? 'bg-orange-500'  // If "watch later" is true, give it orange color
                  : isWatched(video.snippet.resourceId.videoId)
                  ? 'bg-green-500'  // If not selected but watched, make it green
                  : 'bg-blue-600'   // If not selected and not watched, make it blue
              }`}
            >
              {video.snippet.title}
            </div>
          ))}
        </div>

        {/* Video Player Section */}
        <div className="flex-1 bg-blue-800 flex justify-center items-center flex-col p-4 overflow-hidden">
          {selectedVideo ? (
            <>
              <h3 className="text-white text-2xl mb-4 text-center font-semibold">{selectedVideo.snippet.title}</h3>
              <iframe
                className="w-full max-w-2xl h-64 md:h-96"
                src={`https://www.youtube.com/embed/${selectedVideo.snippet.resourceId.videoId}`}
                title={selectedVideo.snippet.title}
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              ></iframe>
              <div className="flex gap-4 mt-4">
                <p
                  className={`border-2 p-2 cursor-pointer ${isWatched(selectedVideo.snippet.resourceId.videoId) ? 'bg-green-500' : ''}`}
                  onClick={() => toggleWatched(selectedVideo)} // Toggle watched status when clicked
                >
                  {isWatched(selectedVideo.snippet.resourceId.videoId) ? 'Unmark as Watched' : 'Mark as Watched'}
                </p>
                <p
                  className={`border-2 p-2 cursor-pointer ${isWatchLater(selectedVideo.snippet.resourceId.videoId) ? 'bg-orange-500' : ''}`}
                  onClick={() => toggleWatchLater(selectedVideo)} // Mark as "Watch Later" when clicked
                >
                  {isWatchLater(selectedVideo.snippet.resourceId.videoId) ? 'Remove from Watch Later' : 'Mark as Watch Later'}
                </p>
              </div>
            </>
          ) : (
            <p className="text-white">Select a video to watch</p>
          )}
        </div>
      </div>
    </>
  );
};

export default YouTubePlaylist;
 