import React, { useState, useEffect } from 'react';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import { saveProjects, loadProjects, saveTheme, loadTheme } from './services/storage';
import { testGeminiConnection } from './services/geminiService';

export default function App() {
  const [view, setView] = useState('landing');
  const [dark, setDark] = useState(true);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const savedProjects = loadProjects();
    const savedTheme = loadTheme();
    setProjects(savedProjects);
    setDark(savedTheme);
    testGeminiConnection();
  }, []);

  useEffect(() => {
    if (projects.length > 0) saveProjects(projects);
  }, [projects]);

  useEffect(() => {
    saveTheme(dark);
    document.body.style.backgroundColor = dark ? '#0a0a0f' : '#f9fafb';
    document.body.style.margin = '0';
  }, [dark]);

  if (view === 'landing') {
    return <Landing setView={setView} dark={dark} />;
  }

  return (
    <Dashboard 
      projects={projects}
      setProjects={setProjects}
      dark={dark}
      setDark={setDark}
    />
  );
}