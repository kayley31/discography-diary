import { Link } from 'react-router-dom';
import './About.css';

const AboutPage = () => {
  return (
    <div className="about-info-page">
      <div className="page-header">
        <h1>About Discography Diaryr</h1>
        <p>Your personal music collection organiser</p>
      </div>
      
      <div className="discover-content">
        <div className="info-card">
          <h2>🔍 Discover</h2>
          <p>
            Search through Spotify's massive catalog to find albums you love.
            From classic records to new releases, build your perfect collection.
          </p>
          <Link to="/search" className="cta-button">
            Search Albums
          </Link>
        </div>

        <div className="info-card">
          <h2>⭐ Rate & Review</h2>
          <p>
            Give each album a star rating and add personal notes.
            Track what makes each album special to you and revisit your thoughts anytime.
          </p>
          <Link to="/my-albums" className="cta-button">
            My Albums
          </Link>
        </div>

        <div className="info-card">
          <h2>📊 Rank & Organise</h2>
          <p>
            Create your definitive rankings with drag-and-drop.
            Rank all albums together or organise by artist to see their best work.
          </p>
          <Link to="/rankings" className="cta-button">
            View Rankings
          </Link>
        </div>
      </div>

      <div className="tips-section">
        <h2>💡 Features</h2>
        <div className="tips-grid">
          <div className="tip-card">
            <h3>📅 Stats by Decade</h3>
            <p>See which decades dominate your collection</p>
          </div>
          <div className="tip-card">
            <h3>🎤 Top Artists</h3>
            <p>Discover your most-collected artists</p>
          </div>
          <div className="tip-card">
            <h3>🏆 Overall & Artist Rankings</h3>
            <p>Rank albums globally or by specific artist</p>
          </div>
          <div className="tip-card">
            <h3>📝 Personal Notes</h3>
            <p>Add memories and thoughts for each album</p>
          </div>
          <div className="tip-card">
            <h3>🌟 Star Ratings</h3>
            <p>Rate albums from 1-5 stars</p>
          </div>
          <div className="tip-card">
            <h3>📈 Collection Stats</h3>
            <p>View insights about your music taste</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
