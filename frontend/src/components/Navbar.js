import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

function Kirillyat() {
  return (
    <div className="kirillyat">
      kirillyat
    </div>
  );
}

export default function Navbar() {
  return (
    <nav className="Navbar">
      <div className="navbar-left">
        <Kirillyat />
      </div>
      <div className="navbar-right">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/resume" className="nav-link">Resume</Link>
        <Link to="/lectures" className="nav-link">Lectures</Link>
        <Link to="/mentor" className="nav-link">Mentoring</Link>
        <Link to="/chat" className="nav-link">Chat</Link>
        <Link to="/about" className="nav-link">About</Link>
      </div>
    </nav>
  );
}

