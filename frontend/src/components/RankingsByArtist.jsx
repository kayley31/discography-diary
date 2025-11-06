import { useState, useEffect } from 'react';
import './Rankings.css';

const RankingsByArtist = () => {
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState('');
  const [artistAlbums, setArtistAlbums] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);

  useEffect(() => {
    loadAlbums();
  }, []);

  useEffect(() => {
    if (selectedArtist) {
      filterByArtist(selectedArtist);
    }
  }, [selectedArtist, albums]);

  const loadAlbums = () => {
    const saved = localStorage.getItem('myAlbums');
    if (saved) {
      const albumsData = JSON.parse(saved);
      setAlbums(albumsData);

      // Get unique artists
      const uniqueArtists = [...new Set(albumsData.map(a => a.artist))].sort();
      setArtists(uniqueArtists);
      
      // Auto-select first artist with multiple albums
      const artistWithMultiple = uniqueArtists.find(artist => 
        albumsData.filter(a => a.artist === artist).length > 1
      );
      if (artistWithMultiple) {
        setSelectedArtist(artistWithMultiple);
      } else if (uniqueArtists.length > 0) {
        setSelectedArtist(uniqueArtists[0]);
      }
    }
  };

  const filterByArtist = (artist) => {
    const filtered = albums.filter(a => a.artist === artist);
    // Sort by artistRank if it exists, otherwise by overall rank
    const sorted = filtered.sort((a, b) => {
      const rankA = a.artistRanks?.[artist] || a.rank || 999;
      const rankB = b.artistRanks?.[artist] || b.rank || 999;
      return rankA - rankB;
    });
    setArtistAlbums(sorted);
  };

  const saveArtistRankings = (updatedArtistAlbums) => {
    // Update the albums in main collection with artist-specific ranks
    const allAlbums = [...albums];
    
    updatedArtistAlbums.forEach((album, index) => {
      const albumIndex = allAlbums.findIndex(a => a.id === album.id);
      if (albumIndex !== -1) {
        if (!allAlbums[albumIndex].artistRanks) {
          allAlbums[albumIndex].artistRanks = {};
        }
        allAlbums[albumIndex].artistRanks[selectedArtist] = index + 1;
      }
    });

    localStorage.setItem('myAlbums', JSON.stringify(allAlbums));
    setAlbums(allAlbums);
    setArtistAlbums(updatedArtistAlbums);
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === index) return;

    const newAlbums = [...artistAlbums];
    const draggedAlbum = newAlbums[draggedIndex];
    
    newAlbums.splice(draggedIndex, 1);
    newAlbums.splice(index, 0, draggedAlbum);
    
    setArtistAlbums(newAlbums);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    if (draggedIndex !== null) {
      saveArtistRankings(artistAlbums);
    }
    setDraggedIndex(null);
  };

  const moveAlbum = (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= artistAlbums.length) return;

    const newAlbums = [...artistAlbums];
    const [movedAlbum] = newAlbums.splice(index, 1);
    newAlbums.splice(newIndex, 0, movedAlbum);
    
    saveArtistRankings(newAlbums);
  };

  if (albums.length === 0) {
    return (
      <div className="no-rankings">
        <h2>No albums to rank yet!</h2>
        <p>Add some albums to your collection first.</p>
      </div>
    );
  }

  if (artists.length === 0) {
    return (
      <div className="no-rankings">
        <h2>No artists found!</h2>
        <p>Add albums from your favorite artists to rank them.</p>
      </div>
    );
  }

  return (
    <div className="rankings-by-artist">
      <div className="rankings-header">
        <h2>🎤 Rank Albums by Artist</h2>
        <p>Select an artist and rank their albums</p>
      </div>

      <div className="artist-selector">
        <label>Choose Artist:</label>
        <select 
          value={selectedArtist} 
          onChange={(e) => setSelectedArtist(e.target.value)}
          className="artist-select"
        >
          {artists.map(artist => {
            const count = albums.filter(a => a.artist === artist).length;
            return (
              <option key={artist} value={artist}>
                {artist} ({count} album{count > 1 ? 's' : ''})
              </option>
            );
          })}
        </select>
      </div>

      {artistAlbums.length === 0 ? (
        <div className="no-rankings">
          <p>This artist has no albums in your collection.</p>
        </div>
      ) : (
        <>
          <div className="rankings-list">
            {artistAlbums.map((album, index) => (
              <div
                key={album.id}
                className={`ranking-item ${draggedIndex === index ? 'dragging' : ''}`}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
              >
                <div className="rank-number">#{index + 1}</div>
                
                <img src={album.image} alt={album.name} className="ranking-image" />
                
                <div className="ranking-info">
                  <h3 className="ranking-name">{album.name}</h3>
                  <p className="ranking-year">{album.year}</p>
                </div>

                <div className="ranking-rating">
                  {album.rating > 0 && (
                    <span className="rating-stars">
                      {'★'.repeat(album.rating)}
                    </span>
                  )}
                </div>

                <div className="ranking-controls">
                  <button
                    onClick={() => moveAlbum(index, 'up')}
                    disabled={index === 0}
                    className="move-btn"
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveAlbum(index, 'down')}
                    disabled={index === artistAlbums.length - 1}
                    className="move-btn"
                    title="Move down"
                  >
                    ↓
                  </button>
                </div>

                <div className="drag-handle">⋮⋮</div>
              </div>
            ))}
          </div>

          <div className="rankings-footer">
            <p>💡 Ranking {artistAlbums.length} album{artistAlbums.length > 1 ? 's' : ''} by {selectedArtist}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default RankingsByArtist;
