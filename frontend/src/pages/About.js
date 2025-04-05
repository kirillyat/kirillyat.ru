import Navbar from "../components/Navbar";
import '../styles/About.css';

function AboutPage() {
    return (
        <div className="AboutPage">
            <Navbar />
            <div className="about-container">
                <header className="about-header">
                    <h1>About This Website</h1>
                </header>

                <section className="about-section">
                    <h2>Welcome to My Personal Website</h2>
                    <p>
                        This website serves as my professional portfolio, a platform for sharing knowledge through lectures,
                        and a hub for my mentoring program. It's built with modern web technologies and integrates with
                        Large Language Models (LLMs) to provide an interactive experience.
                    </p>
                </section>

                <section className="about-section">
                    <h2>Features</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <h3>Resume</h3>
                            <p>View my professional experience, education, projects, and skills in an interactive format.</p>
                        </div>
                        <div className="feature-card">
                            <h3>Lectures</h3>
                            <p>Access my collection of lectures on software development, AI, and other technical topics, written in Markdown format.</p>
                        </div>
                        <div className="feature-card">
                            <h3>Mentoring Program</h3>
                            <p>Book one-on-one mentoring sessions to get personalized guidance on your technical journey.</p>
                        </div>
                        <div className="feature-card">
                            <h3>AI Chat</h3>
                            <p>Interact with an AI assistant powered by Ollama to get answers to your questions.</p>
                        </div>
                    </div>
                </section>

                <section className="about-section">
                    <h2>Technology Stack</h2>
                    <div className="tech-stack">
                        <div className="tech-category">
                            <h3>Frontend</h3>
                            <ul>
                                <li>React</li>
                                <li>React Router</li>
                                <li>React Markdown</li>
                                <li>CSS3</li>
                            </ul>
                        </div>
                        <div className="tech-category">
                            <h3>Backend</h3>
                            <ul>
                                <li>Django</li>
                                <li>Django REST Framework</li>
                                <li>SQLite</li>
                            </ul>
                        </div>
                        <div className="tech-category">
                            <h3>AI Integration</h3>
                            <ul>
                                <li>Ollama</li>
                                <li>LLaMA 3.2</li>
                            </ul>
                        </div>
                        <div className="tech-category">
                            <h3>Deployment</h3>
                            <ul>
                                <li>Docker</li>
                                <li>Docker Compose</li>
                                <li>Nginx</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="about-section">
                    <h2>Contact</h2>
                    <p>
                        Feel free to reach out to me for collaborations, questions, or just to say hello!
                    </p>
                    <div className="contact-info">
                        <div className="contact-item">
                            <strong>Email:</strong> <a href="mailto:contact@kirillyat.ru">contact@kirillyat.ru</a>
                        </div>
                        <div className="contact-item">
                            <strong>GitHub:</strong> <a href="https://github.com/kirillyat" target="_blank" rel="noopener noreferrer">github.com/kirillyat</a>
                        </div>
                        <div className="contact-item">
                            <strong>LinkedIn:</strong> <a href="https://linkedin.com/in/kirillyat" target="_blank" rel="noopener noreferrer">linkedin.com/in/kirillyat</a>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default AboutPage;