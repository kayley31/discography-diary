import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Spotify token cache
let tokenCache = {
  token: null,
  expiresAt: null
};

/**
 * Get Spotify access token with caching
 */
const getAccessToken = async () => {
  // Return cached token if still valid
  if (tokenCache.token && tokenCache.expiresAt > Date.now()) {
    return tokenCache.token;
  }

  try {
    const credentials = Buffer.from(
      `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
    ).toString('base64');

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error_description || 'Failed to retrieve access token');
    }

    const data = await response.json();
    
    // Cache token (expires in 1 hour, we'll refresh 5 min early)
    tokenCache = {
      token: data.access_token,
      expiresAt: Date.now() + (data.expires_in - 300) * 1000
    };

    return data.access_token;
  } catch (error) {
    console.error('Failed to get access token:', error.message);
    throw error;
  }
};

// Routes

/**
 * Health check
 */
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'Discography Diary API',
    endpoints: {
      search: '/api/search?q=album_name&type=album',
      album: '/api/album/:id'
    }
  });
});

/**
 * Get access token (for client-side use if needed)
 */
app.get('/api/getAccessToken', async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    res.json({ accessToken });
  } catch (error) {
    console.error('Access token error:', error.message);
    res.status(500).json({ 
      error: 'Failed to get access token',
      message: error.message 
    });
  }
});

/**
 * Search for albums or artists
 */
app.get('/api/search', async (req, res) => {
  try {
    const { q, type = 'album', limit = 20 } = req.query;

    if (!q) {
      return res.status(400).json({ 
        error: 'Missing query parameter',
        message: 'Please provide a search query (q)'
      });
    }

    const accessToken = await getAccessToken();

    const queryParams = new URLSearchParams({
      q: q,
      type: type,
      limit: limit
    });

    const response = await fetch(
      `https://api.spotify.com/v1/search?${queryParams.toString()}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Spotify API error (${response.status}):`, errorText);
      return res.status(response.status).json({ 
        error: 'Failed to search Spotify',
        details: errorText 
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Search endpoint error:', error.message);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

/**
 * Get album details
 */
app.get('/api/album/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ 
        error: 'Missing album ID'
      });
    }

    const accessToken = await getAccessToken();

    const response = await fetch(
      `https://api.spotify.com/v1/albums/${id}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Spotify API error (${response.status}):`, errorText);
      return res.status(response.status).json({ 
        error: 'Failed to fetch album details',
        details: errorText 
      });
    }

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error('Album details endpoint error:', error.message);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Something went wrong',
    message: err.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});
