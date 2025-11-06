import MyAlbums from '../components/MyAlbums';
import './MyAlbumsPage.css';

const MyAlbumsPage = () => {
  return (
    <div className="my-albums-page">
      <div className="page-header">
        <h1>My Album Collection</h1>
        <p>View and manage your favorite albums</p>
      </div>
      
      <MyAlbums />
    </div>
  );
};

export default MyAlbumsPage;
