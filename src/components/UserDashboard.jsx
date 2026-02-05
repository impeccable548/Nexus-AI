import React, { useState, useEffect } from 'react';
import { Search, Bell, User, Moon, Sun, Plus, Send, Sparkles, Home, MessageSquare, FolderKanban, BarChart3, ChevronRight, Menu, X, Upload, Trash2, Edit, Lightbulb, Loader2, Target, Users, Clock, Award, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';
import { generateProjectHints, chatWithNexus } from '../services/geminiService';

export default function UserDashboard({ dark, setDark, onNavigateToAdmin }) {
  const { user, profile, isAdmin, signOut } = useAuth();
  
  const [view, setView] = useState('dash');
  const [sidebar, setSidebar] = useState(true);
  const [mobile, setMobile] = useState(false);
  const [messages, setMessages] = useState([{role: 'assistant', content: '👋 I\'m Nexus AI. Create a project for smart hints!'}]);
  const [input, setInput] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [currentProject, setCurrentProject] = useState(null);
  const [projectForm, setProjectForm] = useState({name: '', description: '', logo_url: ''});
  const [aiLoading, setAiLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await api.getProjects();
      setProjects(response.projects || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async () => {
    if (!projectForm.name.trim()) return;
    
    try {
      setAiLoading(true);
      const response = await api.createProject({
        name: projectForm.name,
        description: projectForm.description,
        logo_url: projectForm.logo_url,
        team_size: 1,
        status: 'active',
      });

      const newProj = response.project;
      setProjects(prev => [newProj, ...prev]);
      setProjectForm({name: '', description: '', logo_url: ''});
      setShowModal(false);
      setCurrentProject(newProj);
      setView('chat');
      setMessages([{role: 'assistant', content: `🎉 Analyzing "${newProj.name}"...`}]);
      
      const hints = await generateProjectHints(newProj);
      setMessages(prev => [...prev, {role: 'assistant', content: hints}]);
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project');
    } finally {
      setAiLoading(false);
    }
  };

  const updateProject = async () => {
    if (!projectForm.name.trim()) return;
    
    try {
      const response = await api.updateProject(editingProject.id, projectForm);
      setProjects(prev => prev.map(p => p.id === editingProject.id ? response.project : p));
      setProjectForm({name: '', description: '', logo_url: ''});
      setEditingProject(null);
      setShowModal(false);
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Failed to update project');
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    
    try {
      await api.deleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
      if (currentProject?.id === id) setCurrentProject(null);
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project');
    }
  };

  const sendMsg = async () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, {role: 'user', content: input}]);
    setInput('');
    setAiLoading(true);
    try {
      const response = await chatWithNexus(input, currentProject, messages);
      setMessages(prev => [...prev, {role: 'assistant', content: response}]);
    } catch (error) {
      setMessages(prev => [...prev, {role: 'assistant', content: '⚠️ Error. Try again?'}]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProjectForm({...projectForm, logo_url: reader.result});
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await signOut();
    }
  };

  return (
    <div className={`flex h-screen ${dark ? 'bg-[#0a0a0f] text-white' : 'bg-gray-50 text-gray-900'}`}>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${dark?'bg-gray-900 border-gray-700':'bg-white border-gray-200'} rounded-2xl border p-6 max-w-md w-full`}>
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Sparkles className="w-6 h-6 mr-2 text-purple-400"/>
              {editingProject ? 'Edit' : 'Create'} Project
            </h2>
            <div className="space-y-4">
              <input
                value={projectForm.name}
                onChange={e => setProjectForm({...projectForm, name: e.target.value})}
                placeholder="Project Name"
                className={`w-full px-4 py-3 rounded-lg ${dark?'bg-gray-800':'bg-gray-100 border'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
              <textarea
                value={projectForm.description}
                onChange={e => setProjectForm({...projectForm, description: e.target.value})}
                placeholder="Description (optional)"
                rows={3}
                className={`w-full px-4 py-3 rounded-lg ${dark?'bg-gray-800':'bg-gray-100 border'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
              <div className="flex items-center space-x-4">
                {projectForm.logo_url && <img src={projectForm.logo_url} alt="Logo" className="w-16 h-16 rounded-lg object-cover border-2 border-purple-500"/>}
                <label className={`flex-1 px-4 py-3 rounded-lg ${dark?'bg-gray-800':'bg-gray-100 border'} cursor-pointer hover:bg-purple-500/10 transition flex items-center justify-center`}>
                  <Upload className="w-5 h-5 mr-2"/>Upload Logo
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden"/>
                </label>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {setShowModal(false); setEditingProject(null); setProjectForm({name:'',description:'',logo_url:''});}}
                className={`flex-1 px-4 py-3 rounded-lg ${dark?'bg-gray-800':'bg-gray-100'}`}
              >
                Cancel
              </button>
              <button
                onClick={editingProject ? updateProject : createProject}
                disabled={!projectForm.name.trim()||aiLoading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white disabled:opacity-50 flex items-center justify-center"
              >
                {aiLoading ? <Loader2 className="w-5 h-5 animate-spin"/> : (editingProject ? 'Update' : 'Create')}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`${sidebar?'w-64':'w-20'} ${dark?'bg-gray-900/50 border-gray-800':'bg-white border-gray-200'} backdrop-blur-xl border-r transition-all flex-col hidden md:flex`}>
        <div className="p-4 flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/50">
            <Sparkles className="w-6 h-6 text-white"/>
          </div>
          {sidebar && <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Nexus AI</span>}
        </div>
        <nav className="flex-1 px-2 py-4 space-y-2">
          {[
            {icon:Home,label:'Home',v:'dash'},
            {icon:MessageSquare,label:'AI Chat',v:'chat'},
            {icon:FolderKanban,label:'Projects',v:'proj'},
            {icon:BarChart3,label:'Analytics',v:'anal'}
          ].map((item,i)=>(
            <button
              key={i}
              onClick={()=>setView(item.v)}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition ${view===item.v?'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-400':dark?'text-gray-400 hover:bg-gray-800':'text-gray-600 hover:bg-gray-100'}`}
            >
              <item.icon className="w-5 h-5"/>
              {sidebar && <span>{item.label}</span>}
            </button>
          ))}
          
          {isAdmin && (
            <button
              onClick={onNavigateToAdmin}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition ${dark?'text-yellow-400 hover:bg-gray-800':'text-yellow-600 hover:bg-gray-100'} border-2 border-yellow-500/30`}
            >
              <Shield className="w-5 h-5"/>
              {sidebar && <span>Admin Panel</span>}
            </button>
          )}
        </nav>
        <div className="p-4 space-y-2">
          <button
            onClick={()=>setDark(!dark)}
            className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg ${dark?'hover:bg-gray-800':'hover:bg-gray-100'}`}
          >
            {dark?<Sun className="w-5 h-5"/>:<Moon className="w-5 h-5"/>}
            {sidebar && <span>{dark?'Light':'Dark'}</span>}
          </button>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg ${dark?'hover:bg-red-900/20 text-red-400':'hover:bg-red-100 text-red-600'}`}
          >
            <LogOut className="w-5 h-5"/>
            {sidebar && <span>Logout</span>}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className={`${dark?'bg-gray-900/50 border-gray-800':'bg-white/50 border-gray-200'} backdrop-blur-xl border-b px-6 py-4 flex items-center justify-between`}>
          <div className="flex items-center space-x-4 flex-1">
            <button onClick={()=>setSidebar(!sidebar)} className={`p-2 rounded-lg hidden md:block ${dark?'hover:bg-gray-800':'hover:bg-gray-100'}`}>
              <ChevronRight className={`w-5 h-5 ${sidebar?'rotate-180':''}`}/>
            </button>
            <button onClick={()=>setMobile(!mobile)} className={`p-2 rounded-lg md:hidden ${dark?'hover:bg-gray-800':'hover:bg-gray-100'}`}>
              {mobile?<X className="w-5 h-5"/>:<Menu className="w-5 h-5"/>}
            </button>
            <div className="relative flex-1 max-w-md">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${dark?'text-gray-500':'text-gray-400'}`}/>
              <input type="text" placeholder="Search..." className={`w-full pl-10 pr-4 py-2 rounded-lg ${dark?'bg-gray-800':'bg-gray-100'} focus:outline-none focus:ring-2 focus:ring-purple-500`}/>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {isAdmin && (
              <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-full">
                <Shield className="w-4 h-4 text-yellow-400"/>
                <span className="text-xs font-semibold text-yellow-400">ADMIN</span>
              </div>
            )}
            <button className={`p-2 rounded-lg ${dark?'hover:bg-gray-800':'hover:bg-gray-100'}`}>
              <Bell className="w-5 h-5"/>
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-10 h-10 rounded-full object-cover"/>
              ) : (
                <User className="w-5 h-5 text-white"/>
              )}
            </div>
          </div>
        </header>

        {mobile && (
          <div className={`md:hidden ${dark?'bg-gray-900 border-gray-800':'bg-white border-gray-200'} border-b p-4 space-y-2`}>
            {[
              {icon:Home,label:'Home',v:'dash'},
              {icon:MessageSquare,label:'Chat',v:'chat'},
              {icon:FolderKanban,label:'Projects',v:'proj'}
            ].map((item,i)=>(
              <button
                key={i}
                onClick={()=>{setView(item.v);setMobile(false);}}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg ${view===item.v?'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-400':dark?'text-gray-400':'text-gray-600'}`}
              >
                <item.icon className="w-5 h-5"/>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}

        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-12 h-12 text-purple-500 animate-spin"/>
            </div>
          ) : (
            <>
              {view==='dash' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold">Welcome back, {profile?.full_name || user?.email}! 👋</h1>
                    <p className={dark?'text-gray-400':'text-gray-600'}>{projects.length} projects</p>
                  </div>
                  <div className="grid md:grid-cols-4 gap-4">
                    {[
                      {icon:Target,label:'Projects',val:projects.length},
                      {icon:Users,label:'Team',val:'48'},
                      {icon:Clock,label:'Hours',val:'284'},
                      {icon:Award,label:'Done',val:`${projects.length>0?Math.round(projects.reduce((a,p)=>a+p.progress,0)/projects.length):0}%`}
                    ].map((s,i)=>(
                      <div key={i} className={`p-6 rounded-2xl ${dark?'bg-gray-800/50 border-gray-700':'bg-white border-gray-200'} border hover:scale-105 transition`}>
                        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4">
                          <s.icon className="w-6 h-6 text-purple-400"/>
                        </div>
                        <div className="text-3xl font-bold">{s.val}</div>
                        <div className={`text-sm ${dark?'text-gray-400':'text-gray-600'}`}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className={`p-6 rounded-2xl ${dark?'bg-gray-800/50 border-gray-700':'bg-white border-gray-200'} border`}>
                      <h3 className="text-xl font-bold mb-4">Recent Projects</h3>
                      {projects.slice(0,3).map((p,i)=>(
                        <div
                          key={i}
                          onClick={()=>{setCurrentProject(p);setView('chat');}}
                          className={`flex items-center space-x-3 p-3 rounded-lg ${dark?'hover:bg-gray-700/30':'hover:bg-gray-50'} cursor-pointer mb-2`}
                        >
                          {p.logo_url?<img src={p.logo_url} alt={p.name} className="w-10 h-10 rounded-lg object-cover"/>:<div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center"><FolderKanban className="w-5 h-5 text-white"/></div>}
                          <div className="flex-1 font-semibold text-sm">{p.name}</div>
                          <Lightbulb className="w-5 h-5 text-yellow-400"/>
                        </div>
                      ))}
                      {projects.length===0 && <p className="text-center text-gray-400 py-8">No projects yet!</p>}
                    </div>
                    <div className={`p-6 rounded-2xl ${dark?'bg-gray-800/50 border-gray-700':'bg-white border-gray-200'} border`}>
                      <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                      <button onClick={()=>setShowModal(true)} className="w-full p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl hover:scale-105 transition text-left mb-3">
                        <div className="font-semibold flex items-center">
                          <Plus className="w-4 h-4 mr-2"/>Create Project
                        </div>
                        <p className="text-xs text-gray-400">Get AI hints</p>
                      </button>
                      <button onClick={()=>setView('chat')} className="w-full p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-xl hover:scale-105 transition text-left">
                        <div className="font-semibold flex items-center">
                          <MessageSquare className="w-4 h-4 mr-2"/>Ask AI
                        </div>
                        <p className="text-xs text-gray-400">Get suggestions</p>
                      </button>
                    </div>
                  </div>
                </div>
              )}
{view==='chat' && (
                <div className="h-full flex flex-col max-w-4xl mx-auto">
                  <h1 className="text-3xl font-bold mb-4 flex items-center">
                    <Sparkles className="w-8 h-8 mr-2 text-purple-400"/>Nexus AI
                  </h1>
                  <div className={`flex-1 rounded-2xl ${dark?'bg-gray-800/50 border-gray-700':'bg-white border-gray-200'} border flex flex-col overflow-hidden`}>
                    <div className="flex-1 overflow-auto p-6 space-y-4">
                      {messages.map((m,i)=>(
                        <div key={i} className={`flex ${m.role==='user'?'justify-end':'justify-start'}`}>
                          <div className={`max-w-[80%] p-4 rounded-2xl ${m.role==='user'?'bg-gradient-to-r from-purple-500 to-blue-500 text-white':dark?'bg-gray-700':'bg-gray-100'}`}>
                            {m.role==='assistant' && (
                              <div className="flex items-center space-x-2 mb-2">
                                <Sparkles className="w-4 h-4 text-purple-400"/>
                                <span className="text-sm font-semibold text-purple-400">Nexus AI</span>
                              </div>
                            )}
                            <p className="whitespace-pre-line">{m.content}</p>
                          </div>
                        </div>
                      ))}
                      {aiLoading && (
                        <div className="flex">
                          <div className={`p-4 rounded-2xl ${dark?'bg-gray-700':'bg-gray-100'}`}>
                            <Loader2 className="w-5 h-5 animate-spin text-purple-400"/>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className={`p-4 border-t ${dark?'border-gray-700':'border-gray-200'}`}>
                      <div className="flex space-x-2">
                        <input
                          value={input}
                          onChange={e=>setInput(e.target.value)}
                          onKeyPress={e=>e.key==='Enter'&&sendMsg()}
                          placeholder="Ask anything..."
                          className={`flex-1 px-4 py-3 rounded-xl ${dark?'bg-gray-700':'bg-gray-50 border'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                        />
                        <button
                          onClick={sendMsg}
                          disabled={!input.trim()||aiLoading}
                          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white disabled:opacity-50"
                        >
                          <Send className="w-5 h-5"/>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {view==='proj' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Projects</h1>
                    <button onClick={()=>setShowModal(true)} className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white flex items-center">
                      <Plus className="w-5 h-5 mr-2"/>New
                    </button>
                  </div>
                  {projects.length===0 ? (
                    <div className={`p-12 rounded-2xl ${dark?'bg-gray-800/50 border-gray-700':'bg-white border-gray-200'} border text-center}> <FolderKanban className="w-16 h-16 text-purple-400 mx-auto mb-4"/> <h3 className="text-xl font-bold mb-2">No projects</h3> <button onClick={()=>setShowModal(true)} className="mt-4 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white inline-flex items-center"> <Plus className="w-5 h-5 mr-2"/>Create </button> </div> ) : ( <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"> {projects.map(p=>( <div key={p.id} className={p-6 rounded-2xl ${dark?'bg-gray-800/50 border-gray-700':'bg-white border-gray-200'} border hover:scale-105 transition group}> <div className="flex items-start justify-between mb-4"> {p.logo_url?<img src={p.logo_url} alt={p.name} className="w-12 h-12 rounded-lg object-cover"/>:<div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center"><FolderKanban className="w-6 h-6 text-white"/></div>} <div className="flex space-x-1 opacity-0 group-hover:opacity-100"> <button onClick={()=>{setCurrentProject(p);setView('chat');}} className={p-2 rounded-lg ${dark?'hover:bg-gray-700':'hover:bg-gray-100'}} title="Get AI hints"> <Lightbulb className="w-4 h-4 text-yellow-400"/> </button> <button onClick={()=>{setEditingProject(p);setProjectForm({name:p.name,description:p.description,logo_url:p.logo_url});setShowModal(true);}} className={p-2 rounded-lg ${dark?'hover:bg-gray-700':'hover:bg-gray-100'}} title="Edit"> <Edit className="w-4 h-4 text-blue-400"/> </button> <button onClick={()=>deleteProject(p.id)} className={p-2 rounded-lg ${dark?'hover:bg-gray-700':'hover:bg-gray-100'}} title="Delete"> <Trash2 className="w-4 h-4 text-red-400"/> </button> </div> </div> <h3 className="text-xl font-bold mb-2">{p.name}</h3> {p.description && <p className={text-sm mb-3 ${dark?'text-gray-400':'text-gray-600'}}>{p.description.slice(0,100)}</p>} <div className="flex justify-between text-sm mb-4"> <span className="text-gray-400">{p.team_size} members</span> <span className={px-2 py-1 rounded ${p.status==='active'?'bg-green-500/20 text-green-400':'bg-gray-500/20 text-gray-400'}}>{p.status}</span> </div> <div> <div className="flex justify-between mb-2"> <span className="text-sm text-gray-400">Progress</span> <span className="text-sm font-semibold">{p.progress}%</span> </div> <div className={w-full h-2 rounded-full {dark?'bg-gray-700':'bg-gray-200'}{p.progress}%`}}>



))}

)}

)}
{view==='anal' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold">Analytics</h1>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  {l:'Total',v:projects.length},
                  {l:'Active',v:projects.filter(p=>p.status==='active').length},
                  {l:'Avg',v:`${projects.length>0?Math.round(projects.reduce((a,p)=>a+p.progress,0)/projects.length):0}%`}
                ].map((m,i)=>(
                  <div key={i} className={`p-6 rounded-2xl ${dark?'bg-gray-800/50 border-gray-700':'bg-white border-gray-200'} border`}>
                    <div className={`text-sm ${dark?'text-gray-400':'text-gray-600'}`}>{m.l}</div>
                    <div className="text-3xl font-bold mt-2">{m.v}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  </div>
</div>
);
}