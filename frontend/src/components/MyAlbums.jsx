import { useState, useEffect } from 'react';
import './MyAlbums.css';

const MyAlbums = ({ limit }) => {
  const [albums, setAlbums] = useState([]);
  const [sortBy, setSortBy] = useState('dateAdded'); // dateAdded, rating, year, artist, name
  const [filterDecade, setFilterDecade] = useState('all');
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState(0);

  useEffect(() => {
    loadAlbums();
  }, []);

  const loadAlbums = () => {
    const saved = localStorage.getItem('myAlbums');
    if (saved) {
      setAlbums(JSON.parse(saved));
    }
  };

  const saveAlbums = (updatedAlbums) => {
    localStorage.setItem('myAlbums', JSON.stringify(updatedAlbums));
    setAlbums(updatedAlbums);
  };

  const deleteAlbum = (albumId) => {
    if (window.confirm('Remove this album from your collection?')) {
      const updated = albums.filter(a => a.id !== albumId);
      saveAlbums(updated);
    }
  };

  const updateRating = (albumId, newRating) => {
    const updated = albums.map(a => 
      a.id === albumId ? { ...a, rating: newRating } : a
    );
    saveAlbums(updated);
    if (selectedAlbum?.id === albumId) {
      setSelectedAlbum({ ...selectedAlbum, rating: newRating });
    }
  };

  const updateNotes = (albumId, newNotes) => {
    const updated = albums.map(a => 
      a.id === albumId ? { ...a, notes: newNotes } : a
    );
    saveAlbums(updated);
    setSelectedAlbum({ ...selectedAlbum, notes: newNotes });
    setEditingNotes(false);
  };

  const getDecade = (year) => {
    return Math.floor(year / 10) * 10;
  };

  const decades = [...new Set(albums.map(a => getDecade(a.year)))].sort((a, b) => b - a);

  const getSortedAndFiltered = () => {
    let filtered = [...albums];

    // Filter by decade
    if (filterDecade !== 'all') {
      const decade = parseInt(filterDecade);
      filtered = filtered.filter(a => getDecade(a.year) === decade);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'year':
          return b.year - a.year;
        case 'artist':
          return a.artist.localeCompare(b.artist);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'dateAdded':
        default:
          return new Date(b.addedAt) - new Date(a.addedAt);
      }
    });

    return limit ? filtered.slice(0, limit) : filtered;
  };

  const displayedAlbums = getSortedAndFiltered();

  const openAlbumDetails = (album) => {
    setSelectedAlbum(album);
    setRating(album.rating);
    setNotes(album.notes || '');
    setEditingNotes(false);
  };

  if (albums.length === 0) {
    return (
      <div className="no-albums">
        <h2>No albums in your collection yet!</h2>
        <p>Start by searching for albums and adding them to your collection.</p>
      </div>
    );
  }

  return (
    <div className="my-albums">
      {!limit && (
        <div className="albums-controls">
          <div className="control-group">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
              <option value="dateAdded">Recently Added</option>
              <option value="rating">Highest Rated</option>
              <option value="year">Year (Newest)</option>
              <option value="artist">Artist (A-Z)</option>
              <option value="name">Album Name (A-Z)</option>
            </select>
          </div>

          <div className="control-group">
            <label>Filter by Decade:</label>
            <select value={filterDecade} onChange={(e) => setFilterDecade(e.target.value)} className="filter-select">
              <option value="all">All Decades</option>
              {decades.map(decade => (
                <option key={decade} value={decade}>{decade}s</option>
              ))}
            </select>
          </div>

          <div className="albums-count">
            Showing {displayedAlbums.length} of {albums.length} albums
          </div>
        </div>
      )}

      <div className="albums-grid">
        {displayedAlbums.map((album) => (
          <div key={album.id} className="album-card" onClick={() => openAlbumDetails(album)}>
            <img src={album.image} alt={album.name} className="album-image" />
            <div className="album-overlay">
              <h3 className="album-name">{album.name}</h3>
              <p className="album-artist">{album.artist}</p>
              <p className="album-year">{album.year}</p>
              
              <div className="album-rating">
                {[1, 2, 3, 4, 5].map(star => (
                  <span
                    key={star}
                    className={`star ${star <= album.rating ? 'filled' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      updateRating(album.id, star);
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            
            <button
              className="delete-album-btn"
              onClick={(e) => {
                e.stopPropagation();
                deleteAlbum(album.id);
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {limit && albums.length > limit && (
        <div className="view-all-link">
          <a href="/my-albums">View All Albums ({albums.length})</a>
        </div>
      )}

      {/* Album Detail Modal */}
      {selectedAlbum && (
        <div className="modal-overlay" onClick={() => setSelectedAlbum(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedAlbum(null)}>×</button>
            
            <div className="album-detail">
              <img src={selectedAlbum.image} alt={selectedAlbum.name} className="detail-image" />
              
              <div className="detail-info">
                <h2>{selectedAlbum.name}</h2>
                <h3>{selectedAlbum.artist}</h3>
                <p className="detail-year">{selectedAlbum.year}</p>
                
                <div className="detail-rating">
                  <label>Your Rating:</label>
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map(star => (
                      <span
                        key={star}
                        className={`star ${star <= rating ? 'filled' : ''}`}
                        onClick={() => {
                          setRating(star);
                          updateRating(selectedAlbum.id, star);
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                <div className="detail-notes">
                  <label>Notes:</label>
                  {editingNotes ? (
                    <div className="notes-edit">
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add your thoughts about this album..."
                        rows="4"
                      />
                      <div className="notes-actions">
                        <button onClick={() => updateNotes(selectedAlbum.id, notes)} className="save-notes-btn">
                          Save
                        </button>
                        <button onClick={() => setEditingNotes(false)} className="cancel-notes-btn">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="notes-display" onClick={() => setEditingNotes(true)}>
                      {selectedAlbum.notes || 'Click to add notes...'}
                    </div>
                  )}
                </div>

                <a href={selectedAlbum.spotifyUrl} target="_blank" rel="noopener noreferrer" className="spotify-link">
                  Open in Spotify
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAlbums;
