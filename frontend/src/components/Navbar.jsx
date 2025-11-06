import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import logo from '../images/Nav_logo.png'

function Header() {
  const location = useLocation();

  // Helper function to check if link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <Navbar expand="lg" className="navbar" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img className="logo" src={logo} alt="Discography Diary logo" />
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link 
              as={Link} 
              to="/search"
              className={isActive('/search') ? 'active' : ''}
            >
              Search Albums
            </Nav.Link>
            
            <Nav.Link 
              as={Link} 
              to="/my-albums"
              className={isActive('/my-albums') ? 'active' : ''}
            >
              My Albums
            </Nav.Link>
            
            <Nav.Link 
              as={Link} 
              to="/rankings"
              className={isActive('/rankings') ? 'active' : ''}
            >
              Rankings
            </Nav.Link>
            
            <Nav.Link 
              as={Link} 
              to="/stats"
              className={isActive('/stats') ? 'active' : ''}
            >
              Stats
            </Nav.Link>
            
            <Nav.Link 
              as={Link} 
              to="/about"
              className={isActive('/about') ? 'active' : ''}
            >
              About
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
