import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

// Import pages
import HomePage from './pages/Home';
import ChatPage from './pages/Chat';
import ResumePage from './pages/Resume';
import LecturesPage from './pages/Lectures';
import MentorPage from './pages/Mentor';
import AboutPage from './pages/About';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/resume" element={<ResumePage />} />
        <Route path="/lectures" element={<LecturesPage />} />
        <Route path="/lectures/:slug" element={<LecturesPage />} />
        <Route path="/mentor" element={<MentorPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

