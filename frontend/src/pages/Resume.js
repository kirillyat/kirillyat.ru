import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import '../styles/Resume.css';

function Resume() {
  const [resumeData, setResumeData] = useState({
    activities: {},
    skills: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        const response = await fetch('http://localhost:8000/resume/');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setResumeData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching resume data:', error);
        setError('Failed to load resume data. Please try again later.');
        setLoading(false);
      }
    };

    fetchResumeData();
  }, []);

  if (loading) {
    return (
      <div className="Resume">
        <Navbar />
        <div className="resume-container">
          <div className="loading">Loading resume data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="Resume">
        <Navbar />
        <div className="resume-container">
          <div className="error">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="Resume">
      <Navbar />
      <div className="resume-container">
        <header className="resume-header">
          <h1>Kirill Yatsenko</h1>
          <h2>Software Engineer & AI Enthusiast</h2>
        </header>

        <section className="resume-section">
          <h2>About Me</h2>
          <p>
            I'm a passionate software engineer with expertise in AI, machine learning, and web development.
            I enjoy building innovative solutions and sharing knowledge through mentoring and lectures.
          </p>
        </section>

        {resumeData.activities.experience && (
          <section className="resume-section">
            <h2>Experience</h2>
            <div className="activities-list">
              {resumeData.activities.experience.map((activity, index) => (
                <div key={index} className="activity-card">
                  <div className="activity-header">
                    <h3>{activity.name}</h3>
                    <div className="activity-dates">
                      {new Date(activity.from_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - 
                      {activity.current ? ' Present' : 
                        activity.to_date ? ` ${new Date(activity.to_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}` : ''}
                    </div>
                  </div>
                  <p>{activity.description}</p>
                  {activity.url && (
                    <a href={activity.url} target="_blank" rel="noopener noreferrer" className="activity-link">
                      Learn more
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {resumeData.activities.education && (
          <section className="resume-section">
            <h2>Education</h2>
            <div className="activities-list">
              {resumeData.activities.education.map((activity, index) => (
                <div key={index} className="activity-card">
                  <div className="activity-header">
                    <h3>{activity.name}</h3>
                    <div className="activity-dates">
                      {new Date(activity.from_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - 
                      {activity.current ? ' Present' : 
                        activity.to_date ? ` ${new Date(activity.to_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}` : ''}
                    </div>
                  </div>
                  <p>{activity.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {resumeData.activities.project && (
          <section className="resume-section">
            <h2>Projects</h2>
            <div className="activities-list">
              {resumeData.activities.project.map((activity, index) => (
                <div key={index} className="activity-card">
                  <div className="activity-header">
                    <h3>{activity.name}</h3>
                  </div>
                  <p>{activity.description}</p>
                  {activity.url && (
                    <a href={activity.url} target="_blank" rel="noopener noreferrer" className="activity-link">
                      View project
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="resume-section">
          <h2>Skills</h2>
          <div className="skills-container">
            {Object.entries(resumeData.skills).map(([category, skills]) => (
              <div key={category} className="skill-category">
                <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                <div className="skills-list">
                  {skills.map((skill, index) => (
                    <div key={index} className="skill-item">
                      <span className="skill-name">{skill.name}</span>
                      <div className="skill-bar">
                        <div 
                          className="skill-progress" 
                          style={{ width: `${skill.proficiency}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Resume;