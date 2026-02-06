import { getSessionToken } from '../lib/supabase';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Helper to make authenticated admin requests
const adminFetch = async (url, options = {}) => {
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
    throw new Error(error.error || 'Admin request failed');
  }

  return response.json();
};

// ==================== ADMIN - USERS ====================

export const getAllUsers = async () => {
  // This would need a backend endpoint: GET /api/admin/users
  // For now, we'll use Supabase directly in the component
  return { users: [] };
};

export const updateUserRole = async (userId, isAdmin) => {
  // This would need a backend endpoint: PATCH /api/admin/users/:id
  return { success: true };
};

export const banUser = async (userId) => {
  // This would need a backend endpoint: POST /api/admin/users/:id/ban
  return { success: true };
};

// ==================== ADMIN - PROJECTS ====================

export const getAllProjects = async () => {
  // This would need a backend endpoint: GET /api/admin/projects
  return { projects: [] };
};

export const deleteAnyProject = async (projectId) => {
  // This would need a backend endpoint: DELETE /api/admin/projects/:id
  return { success: true };
};

// ==================== ADMIN - STATS ====================

export const getAdminStats = async () => {
  // This would need a backend endpoint: GET /api/admin/stats
  return {
    totalUsers: 0,
    totalProjects: 0,
    activeUsers: 0,
    storageUsed: 0,
  };
};

export const getAdminActions = async (limit = 50) => {
  // This would need a backend endpoint: GET /api/admin/actions
  return { actions: [] };
};

export default {
  getAllUsers,
  updateUserRole,
  banUser,
  getAllProjects,
  deleteAnyProject,
  getAdminStats,
  getAdminActions,
};