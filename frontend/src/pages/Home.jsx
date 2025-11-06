import { Link } from 'react-router-dom';
import MyAlbums from '../components/MyAlbums';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <section className="hero">
        <h1>Welcome to Discography Diary</h1>
        <p className="tagline">
          Discover, collect, and rank your all-time favorite albums
        </p>
        <div className="cta-buttons">
          <Link to="/search" className="btn btn-primary">
            Search Albums
          </Link>
          <Link to="/rankings" className="btn btn-secondary">
            View Rankings
          </Link>
        </div>
      </section>

      <section className="features">
        <div className="feature">
          <h3>🔍 Search & Add</h3>
          <p>Find albums from Spotify's vast catalog</p>
        </div>
        <div className="feature">
          <h3>⭐ Rate & Review</h3>
          <p>Give ratings and add personal notes</p>
        </div>
        <div className="feature">
          <h3>📊 Rank & Analyse</h3>
          <p>Create rankings and see your stats</p>
        </div>
      </section>

      <section className="recent-playlists">
        <div className="section-header">
          <h2>Your Recent Albums</h2>
          <Link to="/my-albums" className="view-all-link">
            View All
          </Link>
        </div>
        <MyAlbums limit={6} />
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <span className="step-number">1</span>
            <h3>Search for Albums</h3>
            <p>Find your favorite albums from Spotify</p>
          </div>
          <div className="step">
            <span className="step-number">2</span>
            <h3>Rate & Add Notes</h3>
            <p>Give star ratings and write your thoughts</p>
          </div>
          <div className="step">
            <span className="step-number">3</span>
            <h3>Rank & Organise</h3>
            <p>Drag and drop to rank overall or by artist</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
