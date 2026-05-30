import React from "react";
import {
  Home,
  FolderGit2,
  KanbanSquare,
  Users,
  Bell,
  Settings as SettingsIcon,
  LogOut,
  Briefcase,
  Layers,
  MessageSquare
} from "lucide-react";

const Sidebar = ({ currentUser, activeTab, setActiveTab, onLogout }) => {
  // Navigation links suited for developers
  const sidebarItems = [
    { name: "Dashboard", icon: Home },
    { name: "My Projects", icon: FolderGit2 },
    { name: "Assigned Tasks", icon: KanbanSquare },
    { name: "Team Chat", icon: MessageSquare },
    { name: "Settings", icon: SettingsIcon },
  ];

  // Helper: Extract username or fallback
  const getUserName = () => {
    if (!currentUser) return "Developer";
    if (currentUser.displayName) return currentUser.displayName;
    const emailPrefix = currentUser.email.split("@")[0];
    return emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
  };

  // Helper: Get avatar abbreviation
  const getAvatarLetters = () => {
    if (!currentUser) return "DV";
    if (currentUser.displayName) {
      return currentUser.displayName.slice(0, 2).toUpperCase();
    }
    return currentUser.email.slice(0, 2).toUpperCase();
  };

  // Helper: Map roles to colorful, glowing badges
  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "Frontend Dev":
        return "bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.15)]";
      case "Backend Dev":
        return "bg-violet-500/10 text-violet-400 border border-violet-500/30 shadow-[0_0_12px_rgba(139,92,246,0.15)]";
      case "SecOps":
        return "bg-red-500/10 text-red-400 border border-red-500/30 shadow-[0_0_12px_rgba(239,68,68,0.15)]";
      case "Design":
        return "bg-pink-500/10 text-pink-400 border border-pink-500/30 shadow-[0_0_12px_rgba(236,72,153,0.15)]";
      case "QA Testing":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]";
      default:
        return "bg-zinc-500/10 text-zinc-400 border border-zinc-500/30";
    }
  };

  return (
    <aside className="hidden lg:flex w-72 flex-col justify-between p-6 border-r border-zinc-800/80 bg-zinc-950/40 backdrop-blur-xl relative z-10 select-none">
      <div className="space-y-8">
        {/* Logo */}
        <div className="flex items-center space-x-3 px-2">
          <div className="p-2 bg-gradient-to-tr from-indigo-500/20 to-violet-600/20 border border-indigo-500/30 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.1)]">
            <Layers className="text-indigo-400 animate-pulse" size={22} />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-400 bg-clip-text text-transparent tracking-wide">
            CollabFlow
          </span>
        </div>

        {/* User domain badge */}
        <div className="px-2">
          <div className={`flex items-center space-x-2 py-2 px-3 rounded-xl text-xs font-semibold uppercase tracking-wider justify-center ${getRoleBadgeClass(currentUser?.role)}`}>
            <Briefcase size={13} className="mr-1" />
            <span>{currentUser?.role || "Developer"}</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center space-x-3.5 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                    : "text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200 border border-transparent"
                }`}
              >
                <Icon size={19} className={isActive ? "text-indigo-400" : "text-zinc-500"} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Card at bottom of Sidebar */}
      <div className="border-t border-zinc-900/80 pt-6 px-2 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-sm text-white border border-indigo-400/20 shadow-[0_0_15px_rgba(99,102,241,0.25)]">
            {getAvatarLetters()}
          </div>
          <div className="flex flex-col text-left overflow-hidden">
            <span className="text-sm font-semibold text-zinc-200 truncate">{getUserName()}</span>
            <span className="text-[10px] text-zinc-500 truncate">{currentUser?.email}</span>
          </div>
        </div>
        
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-zinc-900/40 hover:bg-red-500/10 border border-zinc-800/80 hover:border-red-500/20 text-zinc-400 hover:text-red-400 rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer"
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
