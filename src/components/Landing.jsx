import React from 'react';
import { Sparkles, Zap, ChevronRight, MessageSquare, FolderKanban, BarChart3 } from 'lucide-react';

export default function Landing({ setView, dark }) {
  return (
    <div className={`min-h-screen overflow-hidden relative ${dark ? 'bg-[#0a0a0f] text-white' : 'bg-white text-gray-900'}`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse top-20 -left-20"></div>
        <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse top-40 right-20" style={{animationDelay:'2s'}}></div>
        <div className="absolute w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse bottom-20 left-1/3" style={{animationDelay:'4s'}}></div>
      </div>
      
      <nav className="relative z-10 px-6 py-6 flex justify-between items-center backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/50">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Nexus AI</span>
        </div>
        <button onClick={() => setView('app')} className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg font-semibold hover:scale-105 transition text-white shadow-lg shadow-purple-500/50">
          Get Started
        </button>
      </nav>

      <div className="relative z-10 text-center px-6 py-20 max-w-6xl mx-auto">
        <div className="inline-block mb-6 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full backdrop-blur-sm animate-pulse">
          <span className="text-purple-400 text-sm font-semibold flex items-center">
            <Zap className="w-4 h-4 mr-2"/>Powered by Google Gemini AI
          </span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">Your Smart</span>
          <br/>
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">Workspace</span>
        </h1>
        
        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
          Real AI-powered project management. Get intelligent hints tailored to YOUR projects.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
          <button onClick={() => setView('app')} className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl font-semibold hover:scale-105 transition text-white text-lg flex items-center justify-center shadow-xl shadow-purple-500/50">
            Start Free <ChevronRight className="ml-2 w-5 h-5"/>
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {icon: MessageSquare, title: 'Real AI', desc: 'Google Gemini powers intelligent responses'},
            {icon: FolderKanban, title: 'Smart Projects', desc: 'AI analyzes and gives personalized advice'},
            {icon: BarChart3, title: 'Track Progress', desc: 'Monitor everything in real-time'}
          ].map((f, i) => (
            <div key={i} className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:scale-105 transition">
              <f.icon className="w-12 h-12 text-purple-400 mb-4"/>
              <h3 className="text-xl font-bold mb-2">{f.title}</h3>
              <p className="text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}