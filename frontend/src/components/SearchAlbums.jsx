import { useState } from 'react';
import { searchSpotify } from '../services/spotifyApi';
import './SearchAlbums.css';

const SearchAlbums = ({ onAlbumAdd }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setError('Please enter a search query');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Searching for albums:', searchQuery);
      const results = await searchSpotify({ 
        q: searchQuery, 
        type: 'album',
        limit: 20 
      });

      const albumResults = results.albums?.items || [];
      console.log('Albums found:', albumResults.length);

      if (albumResults.length === 0) {
        setError('No albums found. Try a different search term.');
      }

      setAlbums(albumResults);
      setLoading(false);
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message || 'Failed to search. Please try again.');
      setLoading(false);
    }
  };

  const handleAddAlbum = (album) => {
    // Check if already added
    const existingAlbums = JSON.parse(localStorage.getItem('myAlbums') || '[]');
    
    if (existingAlbums.some(a => a.id === album.id)) {
      alert('This album is already in your collection!');
      return;
    }

    const albumToSave = {
      id: album.id,
      name: album.name,
      artist: album.artists[0]?.name || 'Unknown Artist',
      artistId: album.artists[0]?.id,
      image: album.images[0]?.url,
      releaseDate: album.release_date,
      year: new Date(album.release_date).getFullYear(),
      genres: album.genres || [],
      totalTracks: album.total_tracks,
      spotifyUrl: album.external_urls?.spotify,
      rating: 0,
      notes: '',
      addedAt: new Date().toISOString(),
      rank: existingAlbums.length + 1 // Add at end
    };

    existingAlbums.push(albumToSave);
    localStorage.setItem('myAlbums', JSON.stringify(existingAlbums));

    if (onAlbumAdd) {
      onAlbumAdd(albumToSave);
    }

    alert(`"${album.name}" added to your collection!`);
  };

  return (
    <div className="search-albums">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for albums or artists..."
            className="search-input"
          />
          <button type="submit" className="search-btn" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <p className="loading">Searching for albums...</p>
      )}

      {/* Results */}
      {albums.length > 0 && (
        <div className="albums-results">
          <h2>Search Results ({albums.length})</h2>
          <div className="albums-grid">
            {albums.map((album) => (
              <div key={album.id} className="album-card">
                <img
                  src={album.images[0]?.url || '/placeholder-album.png'}
                  alt={`${album.name} cover`}
                  className="album-image"
                  loading="lazy"
                />
                <div className="album-info">
                  <h3 className="album-name">{album.name}</h3>
                  <p className="album-artist">
                    {album.artists?.map(a => a.name).join(', ')}
                  </p>
                  <p className="album-year">
                    {new Date(album.release_date).getFullYear()}
                  </p>
                  
                  <div className="album-actions">
                    <a
                      href={album.external_urls?.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="spotify-link"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View on Spotify
                    </a>
                    <button
                      onClick={() => handleAddAlbum(album)}
                      className="add-btn"
                    >
                      + Add to Collection
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Initial State */}
      {!loading && albums.length === 0 && !searchQuery && (
        <div className="search-prompt">
          <h2>Find Your Favorite Albums</h2>
          <p>Search for albums by name or artist to add them to your collection.</p>
          <p className="tip">💡 Try searching for: "Abbey Road", "Taylor Swift", "Lemonade"</p>
        </div>
      )}
    </div>
  );
};

export default SearchAlbums;
