import { useState, useEffect } from 'react';
import './Rankings.css';

const RankingsOverall = () => {
  const [albums, setAlbums] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);

  useEffect(() => {
    loadAlbums();
  }, []);

  const loadAlbums = () => {
    const saved = localStorage.getItem('myAlbums');
    if (saved) {
      const albumsData = JSON.parse(saved);
      // Sort by rank
      const sorted = albumsData.sort((a, b) => a.rank - b.rank);
      setAlbums(sorted);
    }
  };

  const saveRankings = (updatedAlbums) => {
    // Update ranks based on array position
    const withRanks = updatedAlbums.map((album, index) => ({
      ...album,
      rank: index + 1
    }));
    localStorage.setItem('myAlbums', JSON.stringify(withRanks));
    setAlbums(withRanks);
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === index) return;

    const newAlbums = [...albums];
    const draggedAlbum = newAlbums[draggedIndex];
    
    // Remove from old position
    newAlbums.splice(draggedIndex, 1);
    // Insert at new position
    newAlbums.splice(index, 0, draggedAlbum);
    
    setAlbums(newAlbums);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    if (draggedIndex !== null) {
      saveRankings(albums);
    }
    setDraggedIndex(null);
  };

  const moveAlbum = (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= albums.length) return;

    const newAlbums = [...albums];
    const [movedAlbum] = newAlbums.splice(index, 1);
    newAlbums.splice(newIndex, 0, movedAlbum);
    
    saveRankings(newAlbums);
  };

  if (albums.length === 0) {
    return (
      <div className="no-rankings">
        <h2>No albums to rank yet!</h2>
        <p>Add some albums to your collection first, then come back to rank them.</p>
      </div>
    );
  }

  return (
    <div className="rankings-overall">
      <div className="rankings-header">
        <h2>🏆 Your Top Albums of All Time</h2>
        <p>Drag and drop to reorder your rankings</p>
      </div>

      <div className="rankings-list">
        {albums.map((album, index) => (
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
              <p className="ranking-artist">{album.artist}</p>
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
                disabled={index === albums.length - 1}
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
        <p>💡 Tip: Click and hold on an album to drag it, or use the arrow buttons</p>
      </div>
    </div>
  );
};

export default RankingsOverall;
