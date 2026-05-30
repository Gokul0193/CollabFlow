import React from 'react';
import { Layers, Users, Zap, CheckCircle2 } from 'lucide-react';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-[#050508] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/20 via-zinc-950 to-zinc-950 flex items-center justify-center p-4 md:p-8 relative overflow-hidden select-none">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      {/* Main Glassmorphic Panel */}
      <div className="w-full max-w-5xl bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/80 rounded-3xl overflow-hidden shadow-2xl grid md:grid-cols-12 relative z-10">
        
        {/* Left Side: Immersive Feature Showcase Panel */}
        <div className="hidden md:flex md:col-span-5 flex-col justify-between p-10 relative overflow-hidden bg-zinc-950/40 border-r border-zinc-800/60">
          {/* Cyber Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.15]"></div>
          
          {/* Header Brand */}
          <div className="relative z-10 flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/30 rounded-xl">
              <Layers className="text-indigo-400" size={24} />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent tracking-wide">
              CollabFlow
            </span>
          </div>

          {/* Core Feature Text & Decorative Mock Cards */}
          <div className="relative z-10 my-8 space-y-6">
            <div className="space-y-3">
              <h1 className="text-3xl font-extrabold text-zinc-100 leading-tight">
                Supercharge your <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">team speed</span>.
              </h1>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Connect your workspace, track project milestones, and deliver high-impact results with stunning speed.
              </p>
            </div>

            {/* Glowing Showcase Stats Widget */}
            <div className="p-4 bg-zinc-900/60 backdrop-blur-lg border border-zinc-800/80 rounded-2xl space-y-3.5 shadow-xl shadow-black/30">
              <div className="flex items-center justify-between border-b border-zinc-800/60 pb-2.5">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Active Workspace</span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-zinc-300">
                    <Zap className="text-yellow-400/80" size={16} />
                    <span className="text-xs font-medium">Sprint Velocity</span>
                  </div>
                  <span className="text-xs font-bold text-zinc-200">+42%</span>
                </div>
                <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full w-[82%] rounded-full"></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-zinc-300">
                    <Users className="text-indigo-400" size={16} />
                    <span className="text-xs font-medium">Active Collaborators</span>
                  </div>
                  <span className="text-xs font-bold text-zinc-200">14 Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Highlights */}
          <div className="relative z-10 space-y-2">
            <div className="flex items-center space-x-2 text-zinc-400 text-xs font-medium">
              <CheckCircle2 className="text-indigo-400/80" size={14} />
              <span>Glassmorphic premium interface</span>
            </div>
            <div className="flex items-center space-x-2 text-zinc-400 text-xs font-medium">
              <CheckCircle2 className="text-indigo-400/80" size={14} />
              <span>Secure Firebase Auth integrated</span>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form Container */}
        <div className="md:col-span-7 p-8 md:p-14 flex flex-col justify-center bg-zinc-900/10">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold text-zinc-100 tracking-tight">
                {title}
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {subtitle}
              </p>
            </div>
            
            <div className="pt-2">
              {children}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthLayout;