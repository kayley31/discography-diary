/**
 * Spotify API service layer
 * Centralized API calls with error handling
 */

// Use environment variable in production, proxy in development
const API_BASE_URL = import.meta.env.PROD 
  ? (import.meta.env.VITE_API_URL || '')
  : ''; // Empty string uses Vite proxy in development

/**
 * Generic fetch wrapper with error handling
 */
const fetchAPI = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ 
        error: 'Unknown error occurred' 
      }));
      throw new Error(error.error || error.message || 'Request failed');
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error.message);
    throw error;
  }
};

/**
 * Get Spotify access token
 */
export const getAccessToken = async () => {
  try {
    console.log('Requesting access token from:', `${API_BASE_URL}/api/getAccessToken`);
    const data = await fetchAPI('/api/getAccessToken');
    console.log('Access token response:', data);
    return data.accessToken;
  } catch (error) {
    console.error('Failed to get access token:', error);
    throw error;
  }
};

/**
 * Search for albums or artists
 * @param {Object} params - Search parameters
 * @param {string} params.q - Search query
 * @param {string} params.type - Type: 'album' or 'artist' (default: 'album')
 * @param {number} params.limit - Number of results (default: 20)
 */
export const searchSpotify = async ({ q, type = 'album', limit = 20 }) => {
  const params = new URLSearchParams();
  if (q) params.append('q', q);
  if (type) params.append('type', type);
  if (limit) params.append('limit', limit);

  const data = await fetchAPI(`/api/search?${params.toString()}`);
  return data;
};

/**
 * Get album details
 * @param {string} albumId - Spotify album ID
 */
export const getAlbum = async (albumId) => {
  const data = await fetchAPI(`/api/album/${albumId}`);
  return data;
};

/**
 * Get song recommendations
 * @param {Object} params - Query parameters
 * @param {string} params.genre - Genre seed
 * @param {string} params.tempo - Tempo category (jogging, average, fast)
 * @param {string} params.artists - Comma-separated artist names
 */
export const getRecommendations = async ({ genre, tempo, artists }) => {
  const params = new URLSearchParams();
  
  if (genre) params.append('genre', genre);
  if (tempo) params.append('tempo', tempo);
  if (artists) params.append('artists', artists);

  const data = await fetchAPI(`/api/recommendations?${params.toString()}`);
  return data.tracks || [];
};

export default {
  getAccessToken,
  getRecommendations,
};
