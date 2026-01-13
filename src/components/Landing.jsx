import React from 'react';
import { Sparkles, Zap, ChevronRight, MessageSquare, FolderKanban, BarChart3, Cpu, Rocket, Star } from 'lucide-react';

export default function Landing({ setView, dark }) {
  return (
    <div className="min-h-screen overflow-hidden relative bg-gradient-to-br from-[#0a0a0f] via-[#1a0a2e] to-[#0a0a0f] text-white">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-3xl animate-pulse top-20 -left-40"></div>
        <div className="absolute w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-3xl animate-pulse top-40 right-10" style={{animationDelay:'2s'}}></div>
        <div className="absolute w-[400px] h-[400px] bg-pink-600/30 rounded-full blur-3xl animate-pulse bottom-20 left-1/3" style={{animationDelay:'4s'}}></div>
        <div className="absolute w-[300px] h-[300px] bg-cyan-500/20 rounded-full blur-3xl animate-pulse bottom-40 right-1/4" style={{animationDelay:'3s'}}></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
      
      <nav className="relative z-10 px-6 py-6 flex justify-between items-center backdrop-blur-md">
        <div className="flex items-center space-x-3">
          {/* SICK LOGO: NX */}
          <div className="relative w-12 h-12 group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-xl blur-lg group-hover:blur-xl transition"></div>
            <div className="relative w-12 h-12 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-2xl border border-white/20 group-hover:scale-110 transition-transform">
              <span className="text-xl font-black tracking-tighter text-white drop-shadow-md">NX</span>
              {/* Subtle accent spark */}
              <Zap className="w-3 h-3 text-cyan-300 absolute top-1 right-1 animate-pulse" />
            </div>
          </div>
          <div>
            <span className="text-2xl md:text-3xl font-black bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent tracking-tight">
              NEXUS<span className="text-blue-400">.</span>AI
            </span>
            <div className="text-[10px] text-gray-400 -mt-1 tracking-widest uppercase">Intelligent Workspace</div>
          </div>
        </div>
        
        <div className="hidden md:flex items-center space-x-6 text-sm">
          <button className="text-gray-300 hover:text-white transition font-medium">Features</button>
          <button className="text-gray-300 hover:text-white transition font-medium">Pricing</button>
          <button className="text-gray-300 hover:text-white transition font-medium">Docs</button>
        </div>
        
        <button 
          onClick={() => setView('app')} 
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-bold hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 transition-all text-white"
        >
          Launch App
        </button>
      </nav>

      <div className="relative z-10 text-center px-6 py-16 md:py-24 max-w-7xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center mb-8 px-4 py-2 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 border border-purple-500/30 rounded-full backdrop-blur-xl shadow-xl shadow-purple-500/20 animate-pulse">
          <Zap className="w-4 h-4 mr-2 text-yellow-400" />
          <span className="text-sm font-bold bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">
            Powered by Google Gemini AI
          </span>
          <Sparkles className="w-4 h-4 ml-2 text-blue-400" />
        </div>
        
        {/* Hero Title */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight">
          <span className="block mb-2 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
            Build Smarter
          </span>
          <span className="block bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
            Ship Faster
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
          The AI-powered workspace that understands YOUR projects. Get intelligent hints, smart recommendations, and personalized guidance in real-time.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
          <button 
            onClick={() => setView('app')} 
            className="group px-8 py-5 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-2xl font-bold hover:scale-105 transition-all text-white text-lg shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/70 relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center">
              <Rocket className="w-5 h-5 mr-2 group-hover:animate-bounce" />
              Start Building Free
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-600 opacity-0 group-hover:opacity-100 transition"></div>
          </button>
          
          <button className="px-8 py-5 bg-white/5 backdrop-blur-xl border-2 border-white/20 rounded-2xl font-bold hover:bg-white/10 hover:border-white/30 transition text-white text-lg hover:scale-105 shadow-xl">
            Watch Demo
          </button>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            { 
              icon: MessageSquare, 
              title: 'Real AI Intelligence', 
              desc: 'Not scripted responses - actual Gemini AI that understands context',
              gradient: 'from-purple-500/20 to-blue-500/20',
              iconColor: 'text-purple-400'
            },
            { 
              icon: FolderKanban, 
              title: 'Smart Project Insights', 
              desc: 'AI analyzes your work and gives personalized, actionable advice',
              gradient: 'from-blue-500/20 to-cyan-500/20',
              iconColor: 'text-blue-400'
            },
            { 
              icon: BarChart3, 
              title: 'Intelligent Analytics', 
              desc: 'Track progress with AI-powered insights and recommendations',
              gradient: 'from-cyan-500/20 to-purple-500/20',
              iconColor: 'text-cyan-400'
            }
          ].map((feature, i) => (
            <div 
              key={i} 
              className={`group p-8 bg-gradient-to-br ${feature.gradient} backdrop-blur-2xl border border-white/10 rounded-3xl hover:scale-105 hover:border-white/30 transition-all duration-300 shadow-2xl hover:shadow-purple-500/20`}
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">{feature.title}</h3>
              <p className="text-gray-300 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Social Proof / Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 max-w-5xl mx-auto">
          {[
            { value: 'Real AI', label: 'Google Gemini', icon: Sparkles },
            { value: '100% Free', label: 'Always', icon: Star },
            { value: 'Smart', label: 'Personalized', icon: Cpu },
            { value: 'Fast', label: 'Instant Response', icon: Zap }
          ].map((stat, i) => (
            <div key={i} className="text-center group cursor-pointer">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-white/10 mb-4 group-hover:scale-110 group-hover:border-white/30 transition-all">
                <stat.icon className="w-8 h-8 text-purple-400" />
              </div>
              <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition">
                {stat.value}
              </div>
              <div className="text-gray-400 text-sm font-medium tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Final CTA */}
        <div className="mt-24 p-12 rounded-3xl bg-gradient-to-br from-purple-600/10 via-blue-600/10 to-cyan-600/10 border border-white/20 backdrop-blur-xl shadow-2xl">
          <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            Ready to Build Smarter?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join developers using real AI to accelerate their projects
          </p>
          <button 
            onClick={() => setView('app')}
            className="px-10 py-5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl font-bold text-xl hover:scale-105 transition-all text-white shadow-2xl shadow-purple-500/50 inline-flex items-center"
          >
            <Rocket className="w-6 h-6 mr-2" />
            Get Started Now - It's Free
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
