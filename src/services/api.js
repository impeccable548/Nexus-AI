import { getSessionToken } from '../lib/supabase';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Helper to make authenticated requests
const authFetch = async (url, options = {}) => {
  const token = await getSessionToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
};

// ==================== AUTH ====================

export const signUp = async (email, password, fullName) => {
  return authFetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    body: JSON.stringify({ email, password, fullName }),
  });
};

export const login = async (email, password) => {
  return authFetch(`${API_URL}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const logout = async () => {
  return authFetch(`${API_URL}/auth/logout`, {
    method: 'POST',
  });
};

export const getCurrentUserProfile = async () => {
  return authFetch(`${API_URL}/auth/me`);
};

// ==================== PROJECTS ====================

export const getProjects = async () => {
  return authFetch(`${API_URL}/projects`);
};

export const getProject = async (id) => {
  return authFetch(`${API_URL}/projects/${id}`);
};

export const createProject = async (projectData) => {
  return authFetch(`${API_URL}/projects`, {
    method: 'POST',
    body: JSON.stringify(projectData),
  });
};

export const updateProject = async (id, updates) => {
  return authFetch(`${API_URL}/projects/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
};

export const deleteProject = async (id) => {
  return authFetch(`${API_URL}/projects/${id}`, {
    method: 'DELETE',
  });
};

// ==================== AI (Already in geminiService, but we can add token) ====================

export const getProjectHints = async (project) => {
  return authFetch(`${API_URL}/project-hints`, {
    method: 'POST',
    body: JSON.stringify({ project }),
  });
};

export const chatWithAI = async (message, project, conversationHistory) => {
  return authFetch(`${API_URL}/chat`, {
    method: 'POST',
    body: JSON.stringify({ message, project, conversationHistory }),
  });
};

export const generateRoadmap = async (project) => {
  return authFetch(`${API_URL}/roadmap`, {
    method: 'POST',
    body: JSON.stringify({ project }),
  });
};

export default {
  signUp,
  login,
  logout,
  getCurrentUserProfile,
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getProjectHints,
  chatWithAI,
  generateRoadmap,
};