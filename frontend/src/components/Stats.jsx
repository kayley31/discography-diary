import { useState, useEffect } from 'react';
import './Stats.css';

const Stats = () => {
  const [albums, setAlbums] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadAlbums();
  }, []);

  useEffect(() => {
    if (albums.length > 0) {
      calculateStats();
    }
  }, [albums]);

  const loadAlbums = () => {
    const saved = localStorage.getItem('myAlbums');
    if (saved) {
      setAlbums(JSON.parse(saved));
    }
  };

  const calculateStats = () => {
    // Total albums
    const totalAlbums = albums.length;

    // Decades breakdown
    const decadeCount = {};
    albums.forEach(album => {
      const decade = Math.floor(album.year / 10) * 10;
      decadeCount[decade] = (decadeCount[decade] || 0) + 1;
    });
    const sortedDecades = Object.entries(decadeCount).sort((a, b) => parseInt(b[0]) - parseInt(a[0]));
    const topDecade = sortedDecades[0];

    // Artists breakdown
    const artistCount = {};
    albums.forEach(album => {
      artistCount[album.artist] = (artistCount[album.artist] || 0) + 1;
    });
    const sortedArtists = Object.entries(artistCount).sort((a, b) => b[1] - a[1]);
    const topArtist = sortedArtists[0];

    // Ratings stats
    const ratedAlbums = albums.filter(a => a.rating > 0);
    const avgRating = ratedAlbums.length > 0
      ? (ratedAlbums.reduce((sum, a) => sum + a.rating, 0) / ratedAlbums.length).toFixed(1)
      : 0;
    
    const fiveStarAlbums = albums.filter(a => a.rating === 5);
    const topRatedByDecade = {};
    
    albums.forEach(album => {
      if (album.rating > 0) {
        const decade = Math.floor(album.year / 10) * 10;
        if (!topRatedByDecade[decade] || album.rating > topRatedByDecade[decade].rating) {
          topRatedByDecade[decade] = album;
        }
      }
    });

    // Recent additions
    const sortedByDate = [...albums].sort((a, b) => 
      new Date(b.addedAt) - new Date(a.addedAt)
    );
    const recentAlbums = sortedByDate.slice(0, 5);

    // Year range
    const years = albums.map(a => a.year).sort((a, b) => a - b);
    const yearRange = years.length > 0 ? `${years[0]} - ${years[years.length - 1]}` : 'N/A';

    setStats({
      totalAlbums,
      decadeCount: sortedDecades,
      topDecade,
      artistCount: sortedArtists.slice(0, 5),
      topArtist,
      avgRating,
      ratedAlbumsCount: ratedAlbums.length,
      fiveStarCount: fiveStarAlbums.length,
      topRatedByDecade,
      recentAlbums,
      yearRange
    });
  };

  if (!albums.length) {
    return (
      <div className="no-stats">
        <h2>No stats available yet!</h2>
        <p>Add albums to your collection to see your music statistics.</p>
      </div>
    );
  }

  if (!stats) {
    return <div className="loading">Calculating stats...</div>;
  }

  return (
    <div className="stats-container">
      <div className="stats-header">
        <h1>📊 Your Music Stats</h1>
        <p>Insights from your album collection</p>
      </div>

      <div className="stats-grid">
        {/* Total Albums */}
        <div className="stat-card highlight">
          <div className="stat-number">{stats.totalAlbums}</div>
          <div className="stat-label">Albums in Collection</div>
        </div>

        {/* Average Rating */}
        <div className="stat-card highlight">
          <div className="stat-number">{stats.avgRating} ★</div>
          <div className="stat-label">Average Rating</div>
          <div className="stat-detail">{stats.ratedAlbumsCount} albums rated</div>
        </div>

        {/* Five Star Albums */}
        <div className="stat-card highlight">
          <div className="stat-number">{stats.fiveStarCount}</div>
          <div className="stat-label">Five-Star Albums</div>
        </div>

        {/* Year Range */}
        <div className="stat-card highlight">
          <div className="stat-number-small">{stats.yearRange}</div>
          <div className="stat-label">Year Range</div>
        </div>
      </div>

      <div className="stats-sections">
        {/* Decades Breakdown */}
        <div className="stat-section">
          <h2>📅 Albums by Decade</h2>
          <div className="decade-bars">
            {stats.decadeCount.map(([decade, count]) => {
              const percentage = (count / stats.totalAlbums) * 100;
              return (
                <div key={decade} className="decade-bar">
                  <div className="decade-label">{decade}s</div>
                  <div className="bar-container">
                    <div className="bar-fill" style={{ width: `${percentage}%` }}>
                      <span className="bar-count">{count}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {stats.topDecade && (
            <p className="stat-highlight">
              🎵 Most albums from the <strong>{stats.topDecade[0]}s</strong> ({stats.topDecade[1]} albums)
            </p>
          )}
        </div>

        {/* Top Artists */}
        <div className="stat-section">
          <h2>🎤 Top Artists</h2>
          <div className="artist-list">
            {stats.artistCount.map(([artist, count], index) => (
              <div key={artist} className="artist-item">
                <span className="artist-rank">#{index + 1}</span>
                <span className="artist-name">{artist}</span>
                <span className="artist-count">{count} album{count > 1 ? 's' : ''}</span>
              </div>
            ))}
          </div>
          {stats.topArtist && (
            <p className="stat-highlight">
              🏆 Most collected artist: <strong>{stats.topArtist[0]}</strong> ({stats.topArtist[1]} albums)
            </p>
          )}
        </div>

        {/* Recently Added */}
        <div className="stat-section">
          <h2>🆕 Recently Added</h2>
          <div className="recent-albums">
            {stats.recentAlbums.map(album => (
              <div key={album.id} className="recent-album">
                <img src={album.image} alt={album.name} />
                <div className="recent-info">
                  <h4>{album.name}</h4>
                  <p>{album.artist}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
