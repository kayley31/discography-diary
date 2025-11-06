import { useState } from 'react';
import RankingsOverall from '../components/RankingsOverall';
import RankingsByArtist from '../components/RankingsByArtist';
import './Rankings.css';

const Rankings = () => {
  const [viewMode, setViewMode] = useState('overall'); // 'overall' or 'artist'

  return (
    <div className="rankings-page">
      <div className="page-header">
        <h1>Album Rankings</h1>
        <p>Organise and rank your favorite albums</p>
      </div>

      <div className="view-switcher">
        <button
          className={`view-btn ${viewMode === 'overall' ? 'active' : ''}`}
          onClick={() => setViewMode('overall')}
        >
          Overall Rankings
        </button>
        <button
          className={`view-btn ${viewMode === 'artist' ? 'active' : ''}`}
          onClick={() => setViewMode('artist')}
        >
          Rank by Artist
        </button>
      </div>

      {viewMode === 'overall' ? <RankingsOverall /> : <RankingsByArtist />}
    </div>
  );
};

export default Rankings;
