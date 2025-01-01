import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useParams } from 'react-router-dom';

const API_KEY = import.meta.env.VITE_API_KEY;

const YouTubePlaylist = () => {
  const PLAYLIST_ID = useParams().id;
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const from = parseInt(queryParams.get('from'), 10) || 0;
  const to = parseInt(queryParams.get('to'), 10) || 0;
  console.log(from, to);
  console.log(PLAYLIST_ID);
  console.log("APi:",API_KEY)

  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [nextPageToken, setNextPageToken] = useState('');
  const [fetchedTokens, setFetchedTokens] = useState(new Set());
  const [loading, setLoading] = useState(true);

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
      setLoading(true);
      fetchPlaylistVideos(nextPageToken);
      setLoading(false);
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
      return video ? count + 1 : count;
    }, 0);
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if(hrs===0)
      return `${mins}m ${secs}s`;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  const slicedVideos = from && to ? videos.slice(from-1, to ) : videos;

  const calculateSlicedTotalDuration = () => {
    return slicedVideos.reduce((sum, video) => sum + (videoDurations[video.snippet.resourceId.videoId] || 0), 0);
  };

  return (
    <div className="flex flex-col lg:flex-row w-full h-full overflow-hidden">
      <>
        <div className=" absolute  bottom-0 right-0 text-white p-2 rounded shadow-lg group">
          <p className='text-center'>Progress:</p>
          <div className="progress relative bg-gray-700 w-48 h-4 rounded overflow-hidden cursor-pointer">
            <div
              className="bg-blue-500 h-full"
              style={{
                width: `${(countWatchedVideosFromPlaylist() / slicedVideos.length) * 100 || 0}%`,
                transition: "width 0.5s ease-in-out",
              }}
            ></div>
            <p className="absolute top-0 left-1/2 transform -translate-x-1/2 text-sm text-white font-semibold">
              {Math.round((countWatchedVideosFromPlaylist() / slicedVideos.length) * 100 || 0)}%
            </p>
          </div>

          <div className="stats hidden group-hover:block bg-[#002855] p-4 mt-2 rounded shadow-lg transition duration-300 ease-in-out">
            <p>Total Videos: {slicedVideos.length}</p>
            <p>Total Watched: {countWatchedVideosFromPlaylist()}</p>
            <p>Total Length: {formatTime(calculateSlicedTotalDuration())}</p>
            <p>Total Time Watched: {formatTime(calculateTotalWatchedTime())}</p>
          </div>
        </div>
      </>
      <div className="bg-[#002855] w-full lg:w-1/4 h-1/2 lg:h-full overflow-y-auto p-4">
        <h2 className="text-white text-center text-lg font-semibold mb-4">Video Titles</h2>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : (
          <ul className="space-y-2">
            {slicedVideos.map((video) => (
              <li
                key={video.snippet.resourceId.videoId}
                onClick={() => setSelectedVideo(video)}
                className={`p-2 rounded cursor-pointer overflow-hidden text-white ${
                  selectedVideo?.snippet.resourceId.videoId === video.snippet.resourceId.videoId
                    ? isWatchLater(video.snippet.resourceId.videoId)
                      ? 'bg-orange-500'
                      : isWatched(video.snippet.resourceId.videoId)
                        ? 'bg-green-700'
                        : 'bg-blue-700'
                    : isWatchLater(video.snippet.resourceId.videoId)
                      ? 'bg-orange-500'
                      : isWatched(video.snippet.resourceId.videoId)
                        ? 'bg-green-500'
                        : 'bg-blue-600'
                }`}
              >
                <h3 className="font-medium truncate">{video.snippet.title}</h3>
                <p className="text-blue-200 text-sm">
                  {formatTime(videoDurations[video.snippet.resourceId.videoId] || 0)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex-1  bg-gradient-to-b from-[#001233] to-[#001845] flex flex-col justify-start items-center  overflow-y-auto h-1/2 lg:h-full">
        {selectedVideo ? (
          <>
            <h3 className="text-white text-xl lg:text-2xl mb-4 text-center font-semibold">{selectedVideo.snippet.title}</h3>
            <div className="w-full max-w-3xl aspect-video mb-4">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${selectedVideo.snippet.resourceId.videoId}`}
                title={selectedVideo.snippet.title}
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              ></iframe>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                className={`px-4 py-2 rounded-full text-sm lg:text-base transition-colors ${
                  isWatched(selectedVideo.snippet.resourceId.videoId)
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
                onClick={() => toggleWatched(selectedVideo)}
              >
                {isWatched(selectedVideo.snippet.resourceId.videoId) ? 'Unmark as Watched' : 'Mark as Watched'}
              </button>
              <button
                className={`px-4 py-2 rounded-full text-sm lg:text-base transition-colors ${
                  isWatchLater(selectedVideo.snippet.resourceId.videoId)
                    ? 'bg-orange-500 hover:bg-orange-600'
                    : 'bg-yellow-500 hover:bg-yellow-600'
                }`}
                onClick={() => toggleWatchLater(selectedVideo)}
              >
                {isWatchLater(selectedVideo.snippet.resourceId.videoId) ? 'Remove from Watch Later' : 'Add to Watch Later'}
              </button>
            </div>
          </>
        ) : (
          <p className="text-white text-center">Select a video to watch</p>
        )}
      </div>
    </div>
  );
};

export default YouTubePlaylist;

