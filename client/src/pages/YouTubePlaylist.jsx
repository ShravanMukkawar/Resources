import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useParams } from 'react-router-dom';

const API_KEY = import.meta.env.VITE_API_KEY;

const YouTubePlaylist = () => {
  const PLAYLIST_ID = useParams().id;
  const location = useLocation(); // Get current location
  const queryParams = new URLSearchParams(location.search); // Parse query parameters
  const from = parseInt(queryParams.get('from'), 10) || 0; // Convert 'from' to number, default to 0
  const to = parseInt(queryParams.get('to'), 10) || 0; // Convert 'to' to number, default to 0
  console.log(from, to);
  console.log(PLAYLIST_ID);
  console.log("APi:",API_KEY)

  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [nextPageToken, setNextPageToken] = useState('');
  const [fetchedTokens, setFetchedTokens] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  const loadWatchedVideos = () => {
    const watchedVideos = JSON.parse(localStorage.getItem('watchedVideos')) || [];
    return watchedVideos;
  };

  const loadWatchLaterVideos = () => {
    const watchLaterVideos = JSON.parse(localStorage.getItem('watchLaterVideos')) || [];
    return watchLaterVideos;
  };

  const [watchedVideos, setWatchedVideos] = useState(loadWatchedVideos);
  const [watchLaterVideos, setWatchLaterVideos] = useState(loadWatchLaterVideos);
  
  const [totalDuration, setTotalDuration] = useState(0);
  const [videoDurations, setVideoDurations] = useState({});

  const fetchPlaylistVideos = async (pageToken = '') => {
    if (fetchedTokens.has(pageToken)) return;
    setIsLoading(true); // Set loading to true before fetching
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

      setVideoDurations((prevDurations) => {
        const newDurations = {};
        newVideos.forEach((video, index) => {
          const videoId = video.contentDetails.videoId;
          newDurations[videoId] = durations[index];
        });
        return { ...prevDurations, ...newDurations };
      });

      setVideos((prevVideos) => {
        const existingIds = new Set(prevVideos.map(video => video.snippet.resourceId.videoId));
        const filteredVideos = newVideos.filter(video => !existingIds.has(video.snippet.resourceId.videoId));
        return [...prevVideos, ...filteredVideos];
      });

      setNextPageToken(response.data.nextPageToken || null);
      setFetchedTokens((prevTokens) => new Set(prevTokens).add(pageToken));

    } catch (error) {
      console.error('Error fetching playlist videos', error);
    } finally {
      setIsLoading(false); // Set loading to false after fetching, regardless of success or failure
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
    fetchPlaylistVideos();
  }, []);

  useEffect(() => {
    if (nextPageToken && !fetchedTokens.has(nextPageToken)) {
      fetchPlaylistVideos(nextPageToken);
    }
  }, [nextPageToken]);

  const toggleWatched = (video) => {
    const videoId = video.snippet.resourceId.videoId;
    let updatedWatchedVideos;

    if (isWatched(videoId)) {
      updatedWatchedVideos = watchedVideos.filter((id) => id !== videoId);
    } else {
      updatedWatchedVideos = [...watchedVideos, videoId];
    }

    setWatchedVideos(updatedWatchedVideos);
    localStorage.setItem('watchedVideos', JSON.stringify(updatedWatchedVideos));
  };

  const isWatched = (videoId) => {
    return watchedVideos.includes(videoId);
  };

  const toggleWatchLater = (video) => {
    const videoId = video.snippet.resourceId.videoId;
    let updatedWatchLaterVideos;

    if (isWatchLater(videoId)) {
      updatedWatchLaterVideos = watchLaterVideos.filter((id) => id !== videoId);
    } else {
      updatedWatchLaterVideos = [...watchLaterVideos, videoId];
    }

    setWatchLaterVideos(updatedWatchLaterVideos);
    localStorage.setItem('watchLaterVideos', JSON.stringify(updatedWatchLaterVideos));
  };

  const isWatchLater = (videoId) => {
    return watchLaterVideos.includes(videoId);
  };

  const calculateTotalWatchedTime = () => {
    return watchedVideos.reduce((sum, videoId) => sum + (videoDurations[videoId] || 0), 0);
  };

  const countWatchedVideosFromPlaylist = () => {
    return watchedVideos.reduce((count, videoId) => {
      const video = videos.find((v) => v.snippet.resourceId.videoId === videoId);
      // Check if the video is part of the current playlist
      return video ? count + 1 : count;
    }, 0);
  };
  

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  // Slice the videos based on `from` and `to`
  const slicedVideos = from && to ? videos.slice(from-1, to ) : videos;

  return (
    <>
      <div className="absolute top-0 right-0 text-white bg-blue-900 p-2 rounded shadow-lg">
        <p>Total Videos: {slicedVideos.length}</p>
        <p>Total Watched: {countWatchedVideosFromPlaylist()}</p>
        <p>Total Length: {formatTime(totalDuration)}</p>
        <p>Total Time Watched: {formatTime(calculateTotalWatchedTime())}</p>
      </div>
      <div className="flex w-[98.9vw] m-0 p-0 h-[100vh]">
        <div className="w-full md:w-1/4 bg-blue-500 dark:bg-blue-950 overflow-y-auto p-4">
          <h2 className="text-white text-lg font-semibold mb-4">Video Titles</h2>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
            </div>
          ) : (
            <ul className="space-y-2">
              {slicedVideos.map((video) => (
                <li
                  key={video.snippet.resourceId.videoId}
                  onClick={() => setSelectedVideo(video)}
                  className={`p-3 rounded cursor-pointer transition-colors ${
                    selectedVideo?.snippet.resourceId.videoId === video.snippet.resourceId.videoId
                      ? 'bg-blue-700'
                      : isWatchLater(video.snippet.resourceId.videoId)
                      ? 'bg-orange-500 hover:bg-orange-600'
                      : isWatched(video.snippet.resourceId.videoId)
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  <h3 className="text-white font-medium truncate">{video.snippet.title}</h3>
                  <p className="text-blue-200 text-sm mt-1">
                    {formatTime(videoDurations[video.snippet.resourceId.videoId] || 0)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

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
                  onClick={() => toggleWatched(selectedVideo)}
                >
                  {isWatched(selectedVideo.snippet.resourceId.videoId) ? 'Unmark as Watched' : 'Mark as Watched'}
                </p>
                <p
                  className={`border-2 p-2 cursor-pointer ${isWatchLater(selectedVideo.snippet.resourceId.videoId) ? 'bg-orange-500' : ''}`}
                  onClick={() => toggleWatchLater(selectedVideo)}
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

