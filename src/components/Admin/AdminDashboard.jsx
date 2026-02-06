import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { 
  Shield, Users, FolderKanban, Activity, ArrowLeft, 
  Search, Trash2, Crown, Ban, CheckCircle, XCircle,
  BarChart3, Database, Clock, TrendingUp, Moon, Sun,
  User, Mail, Calendar, Loader2
} from 'lucide-react';

export default function AdminDashboard({ dark, setDark, onNavigateToDashboard }) {
  const { profile } = useAuth();
  const [view, setView] = useState('overview'); // overview, users, projects, actions
  const [loading, setLoading] = useState(true);
  
  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    activeUsers: 0,
    adminUsers: 0,
  });

  // Data
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [actions, setActions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // Fetch all users
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      // Fetch all projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;

      // Fetch admin actions
      const { data: actionsData, error: actionsError } = await supabase
        .from('admin_actions')
        .select(`
          *,
          profiles:admin_id (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (actionsError) throw actionsError;

      setUsers(usersData || []);
      setProjects(projectsData || []);
      setActions(actionsData || []);

      // Calculate stats
      setStats({
        totalUsers: usersData?.length || 0,
        totalProjects: projectsData?.length || 0,
        activeUsers: usersData?.filter(u => {
          const lastMonth = new Date();
          lastMonth.setMonth(lastMonth.getMonth() - 1);
          return new Date(u.updated_at) > lastMonth;
        }).length || 0,
        adminUsers: usersData?.filter(u => u.is_admin).length || 0,
      });

    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAdminStatus = async (userId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: !currentStatus })
        .eq('id', userId);

      if (error) throw error;

      // Log admin action
      await supabase.from('admin_actions').insert({
        admin_id: profile.id,
        action_type: currentStatus ? 'REMOVE_ADMIN' : 'GRANT_ADMIN',
        target_user_id: userId,
        details: { previous_status: currentStatus }
      });

      fetchAdminData();
      alert(`Admin status ${!currentStatus ? 'granted' : 'removed'} successfully!`);
    } catch (error) {
      console.error('Error updating admin status:', error);
      alert('Failed to update admin status');
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure? This will delete the user and ALL their projects!')) return;

    try {
      // Note: This requires CASCADE delete to be set up in DB
      const { error } = await supabase.auth.admin.deleteUser(userId);

      if (error) throw error;

      // Log admin action
      await supabase.from('admin_actions').insert({
        admin_id: profile.id,
        action_type: 'DELETE_USER',
        target_user_id: userId,
      });

      fetchAdminData();
      alert('User deleted successfully!');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. You may need service_role key for this.');
    }
  };

  const deleteProject = async (projectId) => {
    if (!window.confirm('Delete this project?')) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      // Log admin action
      await supabase.from('admin_actions').insert({
        admin_id: profile.id,
        action_type: 'DELETE_PROJECT',
        target_project_id: projectId,
      });

      fetchAdminData();
      alert('Project deleted successfully!');
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project');
    }
  };

  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProjects = projects.filter(p =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`min-h-screen ${dark ? 'bg-[#0a0a0f] text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`${dark?'bg-gray-900/50 border-gray-800':'bg-white/50 border-gray-200'} backdrop-blur-xl border-b px-6 py-4 sticky top-0 z-10`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={onNavigateToDashboard}
              className={`p-2 rounded-lg ${dark?'hover:bg-gray-800':'hover:bg-gray-100'}`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className={`text-sm ${dark?'text-gray-400':'text-gray-600'}`}>
                  Logged in as {profile?.full_name || profile?.email}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setDark(!dark)}
              className={`p-2 rounded-lg ${dark?'hover:bg-gray-800':'hover:bg-gray-100'}`}
            >
              {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: Users, label: 'Total Users', value: stats.totalUsers, color: 'purple' },
                { icon: FolderKanban, label: 'Total Projects', value: stats.totalProjects, color: 'blue' },
                { icon: Activity, label: 'Active Users', value: stats.activeUsers, color: 'green' },
                { icon: Crown, label: 'Admins', value: stats.adminUsers, color: 'yellow' },
              ].map((stat, i) => (
                <div 
                  key={i}
                  className={`p-6 rounded-2xl ${dark?'bg-gray-800/50 border-gray-700':'bg-white border-gray-200'} border hover:scale-105 transition`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-${stat.color}-500/20 flex items-center justify-center mb-4`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
                  </div>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className={`text-sm ${dark?'text-gray-400':'text-gray-600'}`}>{stat.label}</div>
                </div>
              ))}
            </div>{/* Navigation Tabs */}
            <div className="flex space-x-2 mb-6 overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'users', label: 'Users', icon: Users },
                { id: 'projects', label: 'Projects', icon: FolderKanban },
                { id: 'actions', label: 'Activity Log', icon: Activity },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setView(tab.id)}
                  className={`px-6 py-3 rounded-xl font-semibold transition whitespace-nowrap flex items-center space-x-2 ${
                    view === tab.id
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                      : dark
                      ? 'bg-gray-800 text-gray-400 hover:text-white'
                      : 'bg-white text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Content */}
            {view === 'overview' && (
              <div className="space-y-6">
                <div className={`p-6 rounded-2xl ${dark?'bg-gray-800/50 border-gray-700':'bg-white border-gray-200'} border`}>
                  <h2 className="text-2xl font-bold mb-4">System Overview</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                        Recent Growth
                      </h3>
                      <p className={dark?'text-gray-400':'text-gray-600'}>
                        {stats.activeUsers} active users in the last 30 days
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center">
                        <Database className="w-5 h-5 mr-2 text-blue-400" />
                        Database
                      </h3>
                      <p className={dark?'text-gray-400':'text-gray-600'}>
                        {stats.totalProjects} projects stored
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`p-6 rounded-2xl ${dark?'bg-gray-800/50 border-gray-700':'bg-white border-gray-200'} border`}>
                  <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
                  <div className="space-y-3">
                    {actions.slice(0, 5).map((action, i) => (
                      <div key={i} className={`p-4 rounded-lg ${dark?'bg-gray-700/30':'bg-gray-50'} flex items-center justify-between`}>
                        <div className="flex items-center space-x-3">
                          <Activity className="w-5 h-5 text-purple-400" />
                          <div>
                            <p className="font-semibold">{action.action_type}</p>
                            <p className={`text-sm ${dark?'text-gray-400':'text-gray-600'}`}>
                              by {action.profiles?.full_name || action.profiles?.email}
                            </p>
                          </div>
                        </div>
                        <span className={`text-sm ${dark?'text-gray-500':'text-gray-400'}`}>
                          {new Date(action.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {view === 'users' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${dark?'text-gray-500':'text-gray-400'}`} />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search users..."
                      className={`w-full pl-10 pr-4 py-3 rounded-lg ${dark?'bg-gray-800 border-gray-700':'bg-white border-gray-200'} border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    />
                  </div>
                </div>

                <div className={`rounded-2xl ${dark?'bg-gray-800/50 border-gray-700':'bg-white border-gray-200'} border overflow-hidden`}>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className={dark?'bg-gray-700/50':'bg-gray-50'}>
                        <tr>
                          <th className="px-6 py-4 text-left font-semibold">User</th>
                          <th className="px-6 py-4 text-left font-semibold">Email</th>
                          <th className="px-6 py-4 text-left font-semibold">Role</th>
                          <th className="px-6 py-4 text-left font-semibold">Joined</th>
                          <th className="px-6 py-4 text-left font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user, i) => (
                          <tr key={i} className={`border-t ${dark?'border-gray-700':'border-gray-200'}`}>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-3">
                                {user.avatar_url ? (
                                  <img src={user.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                                ) : (
                                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-white" />
                                  </div>
                                )}
                                <span className="font-semibold">{user.full_name || 'Anonymous'}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <span className={dark?'text-gray-400':'text-gray-600'}>{user.email}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {user.is_admin ? (
                                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-semibold flex items-center w-fit">
                                  <Crown className="w-4 h-4 mr-1" />
                                  Admin
                                </span>
                              ) : (
                                <span className="px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-sm">User</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span className={`text-sm ${dark?'text-gray-400':'text-gray-600'}`}>
                                  {new Date(user.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => toggleAdminStatus(user.id, user.is_admin)}
                                  className={`p-2 rounded-lg ${user.is_admin?'bg-red-500/10 text-red-400 hover:bg-red-500/20':'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20'} transition`}
                                  title={user.is_admin ? 'Remove admin' : 'Make admin'}
                                >
                                  <Crown className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => deleteUser(user.id)}
                                  className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                                  title="Delete user"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
{view === 'projects' && (
              <div className="space-y-6">
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${dark?'text-gray-500':'text-gray-400'}`} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search projects..."
                    className={`w-full pl-10 pr-4 py-3 rounded-lg ${dark?'bg-gray-800 border-gray-700':'bg-white border-gray-200'} border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  />
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects.map((project, i) => (
                    <div key={i} className={`p-6 rounded-2xl ${dark?'bg-gray-800/50 border-gray-700':'bg-white border-gray-200'} border hover:scale-105 transition group`}>
                      <div className="flex items-start justify-between mb-4">
                        {project.logo_url ? (
                          <img src={project.logo_url} alt="" className="w-12 h-12 rounded-lg object-cover" />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                            <FolderKanban className="w-6 h-6 text-white" />
                          </div>
                        )}
                        <button
                          onClick={() => deleteProject(project.id)}
                          className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 opacity-0 group-hover:opacity-100 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{project.name}</h3>
                      {project.description && (
                        <p className={`text-sm mb-3 ${dark?'text-gray-400':'text-gray-600'}`}>
                          {project.description.slice(0, 100)}
                        </p>
                      )}
                      <div className={`text-sm ${dark?'text-gray-400':'text-gray-600'} mb-2`}>
                        Owner: {project.profiles?.full_name || project.profiles?.email}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`px-2 py-1 rounded text-xs ${
                          project.status === 'active' 
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {project.status}
                        </span>
                        <span className={`text-sm ${dark?'text-gray-500':'text-gray-400'}`}>
                          {project.progress}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {view === 'actions' && (
              <div className={`rounded-2xl ${dark?'bg-gray-800/50 border-gray-700':'bg-white border-gray-200'} border overflow-hidden`}>
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Admin Activity Log</h2>
                  <div className="space-y-3">
                    {actions.map((action, i) => (
                      <div key={i} className={`p-4 rounded-lg ${dark?'bg-gray-700/30':'bg-gray-50'} flex items-center justify-between`}>
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            action.action_type.includes('DELETE') ? 'bg-red-500/20' :
                            action.action_type.includes('ADMIN') ? 'bg-yellow-500/20' :
                            'bg-blue-500/20'
                          }`}>
                            <Activity className={`w-5 h-5 ${
                              action.action_type.includes('DELETE') ? 'text-red-400' :
                              action.action_type.includes('ADMIN') ? 'text-yellow-400' :
                              'text-blue-400'
                            }`} />
                          </div>
                          <div>
                            <p className="font-semibold">{action.action_type}</p>
                            <p className={`text-sm ${dark?'text-gray-400':'text-gray-600'}`}>
                              by {action.profiles?.full_name || action.profiles?.email}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm ${dark?'text-gray-400':'text-gray-600'}`}>
                            {new Date(action.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}