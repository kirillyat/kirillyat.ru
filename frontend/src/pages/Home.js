import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the Resume page
    navigate('/resume');
  }, [navigate]);

  return (
    <div className="HomePage">
      <Navbar />
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h1>Welcome to My Personal Website</h1>
        <p>Redirecting to Resume...</p>
      </div>
    </div>
  );
}

export default HomePage;