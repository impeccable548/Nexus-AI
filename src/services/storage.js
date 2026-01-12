/**
 * Storage Service - Manages local data persistence
 */

const STORAGE_KEYS = {
  PROJECTS: 'nexus_projects',
  SETTINGS: 'nexus_settings',
  THEME: 'nexus_theme',
};

// Save projects to localStorage
export const saveProjects = (projects) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    return true;
  } catch (error) {
    console.error('Error saving projects:', error);
    return false;
  }
};

// Load projects from localStorage
export const loadProjects = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading projects:', error);
    return [];
  }
};

// Save settings
export const saveSettings = (settings) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
};

// Load settings
export const loadSettings = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : {
      darkMode: true,
      notifications: true,
    };
  } catch (error) {
    console.error('Error loading settings:', error);
    return { darkMode: true, notifications: true };
  }
};

// Save theme preference
export const saveTheme = (isDark) => {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, isDark ? 'dark' : 'light');
    return true;
  } catch (error) {
    console.error('Error saving theme:', error);
    return false;
  }
};

// Load theme preference
export const loadTheme = () => {
  try {
    const theme = localStorage.getItem(STORAGE_KEYS.THEME);
    return theme === 'dark' || theme === null; // Default to dark
  } catch (error) {
    console.error('Error loading theme:', error);
    return true;
  }
};

// Clear all data
export const clearAllData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};

export default {
  saveProjects,
  loadProjects,
  saveSettings,
  loadSettings,
  saveTheme,
  loadTheme,
  clearAllData,
};