import { useState, useEffect, useRef } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ReactMarkdown from 'react-markdown';
import '../styles/Lectures.css';

function LecturesList() {
  const location = useLocation();
  const [lectures, setLectures] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('en');
  const [currentFolder, setCurrentFolder] = useState(null);

  // Get language and folder from URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const langParam = params.get('lang');
    const folderParam = params.get('folder');
    
    if (langParam) {
      setLanguage(langParam);
    }
    
    if (folderParam) {
      setCurrentFolder(folderParam);
    }
  }, [location.search]);

  // Fetch folders
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await fetch('http://localhost:8000/folders/');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setFolders(data.folders);
      } catch (error) {
        console.error('Error fetching folders:', error);
        // Don't set error state here, as we still want to show lectures even if folders fail
      }
    };

    fetchFolders();
  }, []);

  // Fetch lectures with language and folder filters
  useEffect(() => {
    const fetchLectures = async () => {
      try {
        let url = `http://localhost:8000/lectures/?lang=${language}`;
        if (currentFolder) {
          url += `&folder=${currentFolder}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setLectures(data.lectures);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching lectures:', error);
        setError('Failed to load lectures. Please try again later.');
        setLoading(false);
      }
    };

    fetchLectures();
  }, [language, currentFolder]);

  if (loading) {
    return (
      <div className="Lectures">
        <Navbar />
        <div className="lectures-container">
          <div className="loading">Loading lectures...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="Lectures">
        <Navbar />
        <div className="lectures-container">
          <div className="error">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="Lectures">
      <Navbar />
      <div className="lectures-container">
        <header className="lectures-header">
          <h1>Lectures</h1>
          <p>Explore my collection of lectures on various topics in software development, AI, and more.</p>
          
          <div className="lectures-filters">
            <div className="language-selector">
              <span>Language: </span>
              <Link
                to={`/lectures${currentFolder ? `?folder=${currentFolder}&lang=en` : '?lang=en'}`}
                className={`language-option ${language === 'en' ? 'active' : ''}`}
              >
                EN
              </Link>
              <Link
                to={`/lectures${currentFolder ? `?folder=${currentFolder}&lang=fr` : '?lang=fr'}`}
                className={`language-option ${language === 'fr' ? 'active' : ''}`}
              >
                FR
              </Link>
              <Link
                to={`/lectures${currentFolder ? `?folder=${currentFolder}&lang=ru` : '?lang=ru'}`}
                className={`language-option ${language === 'ru' ? 'active' : ''}`}
              >
                RU
              </Link>
            </div>
          </div>
        </header>
        
        {folders.length > 0 && (
          <div className="folders-section">
            <h2>Lecture Folders</h2>
            <div className="folders-list">
              {folders.map((folder) => (
                <Link
                  key={folder.id}
                  to={`/lectures?folder=${folder.slug}&lang=${language}`}
                  className={`folder-card ${currentFolder === folder.slug ? 'active' : ''}`}
                >
                  <h3>{folder.name}</h3>
                  {folder.description && <p>{folder.description}</p>}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="lectures-section">
          <h2>{currentFolder ? 'Lectures in this folder' : 'All Lectures'}</h2>
          {currentFolder && (
            <Link to={`/lectures?lang=${language}`} className="back-to-all">
              ← View all lectures
            </Link>
          )}
          
          {lectures.length === 0 ? (
            <div className="no-lectures">
              <p>No lectures available at the moment. Check back soon!</p>
            </div>
          ) : (
            <div className="lectures-list">
              {lectures.map((lecture) => (
                <div key={lecture.id} className="lecture-card">
                  <h2>{lecture.title}</h2>
                  <div className="lecture-meta">
                    <span>Updated: {new Date(lecture.updated_at).toLocaleDateString()}</span>
                    <span className="language-tag">{lecture.language_display}</span>
                    {lecture.folder && !currentFolder && (
                      <span className="folder-tag">Folder: {lecture.folder}</span>
                    )}
                  </div>
                  <Link to={`/lectures/${lecture.slug}?lang=${lecture.language}`} className="lecture-link">
                    Read Lecture
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LectureDetail() {
  const { slug } = useParams();
  const location = useLocation();
  const [lecture, setLecture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('en');
  const contentRef = useRef(null);

  // Process mermaid diagrams
  useEffect(() => {
    if (lecture && contentRef.current) {
      try {
        // Find code blocks that contain mermaid syntax
        const codeBlocks = contentRef.current.querySelectorAll('.codehilite pre code');
        
        codeBlocks.forEach((codeBlock) => {
          const codeText = codeBlock.textContent;
          if (codeText.includes('graph TD') || codeText.includes('graph LR')) {
            // This is a mermaid diagram
            const preElement = codeBlock.closest('.codehilite');
            if (preElement && preElement.parentNode) {
              // Create a mermaid div
              const mermaidDiv = document.createElement('div');
              mermaidDiv.className = 'mermaid';
              mermaidDiv.textContent = codeText;
              
              // Replace the code block with the mermaid div
              preElement.parentNode.replaceChild(mermaidDiv, preElement);
            }
          }
        });
        
        // Manually trigger mermaid rendering
        if (window.mermaid) {
          setTimeout(() => {
            try {
              window.mermaid.run();
            } catch (error) {
              console.error('Error rendering mermaid diagrams:', error);
            }
          }, 500);
        }
      } catch (error) {
        console.error('Error processing mermaid diagrams:', error);
      }
    }
  }, [lecture]);

  // Get language from URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const langParam = params.get('lang');
    if (langParam) {
      setLanguage(langParam);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchLecture = async () => {
      try {
        const response = await fetch(`http://localhost:8000/lectures/${slug}/?lang=${language}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setLecture(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching lecture:', error);
        setError('Failed to load lecture. Please try again later.');
        setLoading(false);
      }
    };

    fetchLecture();
  }, [slug, language]);

  if (loading) {
    return (
      <div className="Lectures">
        <Navbar />
        <div className="lectures-container">
          <div className="loading">Loading lecture...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="Lectures">
        <Navbar />
        <div className="lectures-container">
          <div className="error">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="Lectures">
      <Navbar />
      <div className="lectures-container">
        <div className="lecture-detail">
          <div className="lecture-navigation">
            <Link to="/lectures" className="back-link">
              ← Back to Lectures
            </Link>
            
            {lecture.folder_slug && (
              <Link to={`/folders/${lecture.folder_slug}`} className="folder-link">
                View Folder: {lecture.folder}
              </Link>
            )}
          </div>
          
          <header className="lecture-header">
            <h1>{lecture.title}</h1>
            <div className="lecture-meta">
              <span className="update-date">Updated: {new Date(lecture.updated_at).toLocaleDateString()}</span>
              
              {lecture.available_languages && lecture.available_languages.length > 1 && (
                <div className="language-selector">
                  <span>Available in: </span>
                  {lecture.available_languages.map(lang => (
                    <Link
                      key={lang}
                      to={`/lectures/${slug}?lang=${lang}`}
                      className={`language-option ${lang === lecture.language ? 'active' : ''}`}
                    >
                      {lang.toUpperCase()}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </header>
          
          {lecture.prev_lecture || lecture.next_lecture ? (
            <div className="lecture-navigation-links">
              {lecture.prev_lecture && (
                <Link to={`/lectures/${lecture.prev_lecture.slug}?lang=${language}`} className="prev-lecture">
                  ← Previous: {lecture.prev_lecture.title}
                </Link>
              )}
              {lecture.next_lecture && (
                <Link to={`/lectures/${lecture.next_lecture.slug}?lang=${language}`} className="next-lecture">
                  Next: {lecture.next_lecture.title} →
                </Link>
              )}
            </div>
          ) : null}
          
          <div className="lecture-content" ref={contentRef}>
            <div dangerouslySetInnerHTML={{ __html: lecture.html_content }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Lectures() {
  const { slug } = useParams();
  
  // If slug is provided, show lecture detail, otherwise show list
  return slug ? <LectureDetail /> : <LecturesList />;
}

export default Lectures;