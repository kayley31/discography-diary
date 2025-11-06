import { useState } from 'react';
import SearchAlbums from '../components/SearchAlbums';
import './SearchPage.css';

const SearchPage = () => {
  const [addedCount, setAddedCount] = useState(0);

  const handleAlbumAdd = (album) => {
    setAddedCount(prev => prev + 1);
  };

  return (
    <div className="search-page">
      <div className="page-header">
        <h1>Search & Add Albums</h1>
        <p>Find your favorite albums and add them to your collection</p>
        {addedCount > 0 && (
          <p className="added-indicator">✓ {addedCount} album{addedCount > 1 ? 's' : ''} added this session</p>
        )}
      </div>
      
      <SearchAlbums onAlbumAdd={handleAlbumAdd} />
    </div>
  );
};

export default SearchPage;
