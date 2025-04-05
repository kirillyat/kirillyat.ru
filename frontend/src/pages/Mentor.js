import { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import '../styles/Mentor.css';

function MentorPage() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [bookingSession, setBookingSession] = useState(null);
    const [formData, setFormData] = useState({
        student_name: '',
        student_email: ''
    });
    const [bookingStatus, setBookingStatus] = useState({
        success: false,
        error: null
    });

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await fetch('http://localhost:8000/mentoring/sessions/');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setSessions(data.sessions);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching mentoring sessions:', error);
                setError('Failed to load mentoring sessions. Please try again later.');
                setLoading(false);
            }
        };

        fetchSessions();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleBookSession = async (e) => {
        e.preventDefault();
        
        if (!formData.student_name || !formData.student_email) {
            setBookingStatus({
                success: false,
                error: 'Please fill in all fields'
            });
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/mentoring/book/${bookingSession.id}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to book session');
            }

            const data = await response.json();
            
            // Update booking status
            setBookingStatus({
                success: true,
                error: null
            });
            
            // Remove the booked session from the list
            setSessions(sessions.filter(session => session.id !== bookingSession.id));
            
            // Reset form
            setBookingSession(null);
            setFormData({
                student_name: '',
                student_email: ''
            });
        } catch (error) {
            console.error('Error booking session:', error);
            setBookingStatus({
                success: false,
                error: error.message
            });
        }
    };

    if (loading) {
        return (
            <div className="MentorPage">
                <Navbar />
                <div className="mentor-container">
                    <div className="loading">Loading mentoring sessions...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="MentorPage">
                <Navbar />
                <div className="mentor-container">
                    <div className="error">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="MentorPage">
            <Navbar />
            <div className="mentor-container">
                <header className="mentor-header">
                    <h1>Mentoring Program</h1>
                    <p>Book a one-on-one mentoring session to get personalized guidance on software development, AI, and career growth.</p>
                </header>

                <section className="mentor-section">
                    <h2>About the Mentoring Program</h2>
                    <p>
                        I offer personalized mentoring sessions to help you accelerate your learning and career in software development and AI.
                        Whether you're stuck on a specific problem, looking for career advice, or want to deepen your understanding of a particular technology,
                        these sessions are designed to provide you with tailored guidance and support.
                    </p>
                    <div className="mentor-benefits">
                        <div className="benefit-item">
                            <h3>Personalized Guidance</h3>
                            <p>Get advice specific to your unique challenges and goals</p>
                        </div>
                        <div className="benefit-item">
                            <h3>Technical Expertise</h3>
                            <p>Tap into years of experience in software development and AI</p>
                        </div>
                        <div className="benefit-item">
                            <h3>Career Development</h3>
                            <p>Receive insights on career paths, job hunting, and skill development</p>
                        </div>
                    </div>
                </section>

                <section className="mentor-section">
                    <h2>Available Sessions</h2>
                    {sessions.length === 0 ? (
                        <div className="no-sessions">
                            <p>No mentoring sessions are currently available. Please check back later!</p>
                        </div>
                    ) : (
                        <div className="sessions-list">
                            {sessions.map((session) => (
                                <div key={session.id} className="session-card">
                                    <div className="session-info">
                                        <h3>{session.title}</h3>
                                        <p>{session.description}</p>
                                        <div className="session-meta">
                                            <span className="session-date">
                                                {new Date(session.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                            </span>
                                            <span className="session-time">
                                                {session.start_time.substring(0, 5)} - {session.end_time.substring(0, 5)}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        className="book-button"
                                        onClick={() => setBookingSession(session)}
                                    >
                                        Book Session
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {bookingSession && (
                    <div className="booking-modal">
                        <div className="booking-content">
                            <button className="close-button" onClick={() => setBookingSession(null)}>×</button>
                            <h2>Book Mentoring Session</h2>
                            <h3>{bookingSession.title}</h3>
                            <p className="session-date">
                                {new Date(bookingSession.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                            <p className="session-time">
                                {bookingSession.start_time.substring(0, 5)} - {bookingSession.end_time.substring(0, 5)}
                            </p>
                            
                            {bookingStatus.success ? (
                                <div className="booking-success">
                                    <p>Your session has been booked successfully!</p>
                                    <p>You will receive a confirmation email shortly.</p>
                                    <button
                                        className="close-booking-button"
                                        onClick={() => {
                                            setBookingSession(null);
                                            setBookingStatus({ success: false, error: null });
                                        }}
                                    >
                                        Close
                                    </button>
                                </div>
                            ) : (
                                <form className="booking-form" onSubmit={handleBookSession}>
                                    {bookingStatus.error && (
                                        <div className="booking-error">
                                            {bookingStatus.error}
                                        </div>
                                    )}
                                    <div className="form-group">
                                        <label htmlFor="student_name">Your Name</label>
                                        <input
                                            type="text"
                                            id="student_name"
                                            name="student_name"
                                            value={formData.student_name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="student_email">Your Email</label>
                                        <input
                                            type="email"
                                            id="student_email"
                                            name="student_email"
                                            value={formData.student_email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="submit-button">
                                        Confirm Booking
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MentorPage;