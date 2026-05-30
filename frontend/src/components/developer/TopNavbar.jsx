import React, { useState, useEffect, useRef } from "react";
import { Search, Bell, ChevronDown, Home, Settings as SettingsIcon, LogOut, Menu, Layers } from "lucide-react";

const TopNavbar = ({ currentUser, searchQuery, setSearchQuery, onLogout, toggleMobileSidebar, pendingNotificationsCount = 0 }) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

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

  return (
    <header className="flex items-center justify-between p-6 border-b border-zinc-900/80 bg-[#07070a]/75 backdrop-blur-md sticky top-0 z-20 w-full select-none">
      {/* Search Bar / Mobile Menu Button */}
      <div className="flex items-center space-x-4 flex-1 max-w-lg">
        <button
          onClick={toggleMobileSidebar}
          className="lg:hidden p-2.5 rounded-xl bg-zinc-900/40 border border-zinc-800/80 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
        >
          <Menu size={18} />
        </button>

        <div className="relative w-full group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" size={17} />
          <input
            type="text"
            placeholder="Search projects by name, technologies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/40 border border-zinc-800/80 rounded-xl text-sm placeholder-zinc-500 text-zinc-200 outline-none focus:bg-zinc-900/70 focus:border-indigo-500/80 focus:ring-4 focus:ring-indigo-950/40 transition-all duration-300"
          />
        </div>
      </div>

      {/* Notifications & Profile Actions */}
      <div className="flex items-center space-x-4 pl-4">
        {/* Notification Bell */}
        <button className="p-2.5 rounded-xl bg-zinc-900/40 border border-zinc-800/80 text-zinc-400 hover:text-zinc-200 transition-colors relative cursor-pointer">
          <Bell size={18} />
          {pendingNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full animate-ping"></span>
          )}
          {pendingNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full"></span>
          )}
        </button>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center space-x-2.5 p-1.5 pr-3.5 bg-zinc-900/40 hover:bg-zinc-900/70 border border-zinc-800/60 rounded-xl transition-all duration-300 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-xs text-white shadow-md shadow-indigo-900/25">
              {getAvatarLetters()}
            </div>
            <span className="hidden sm:inline text-xs font-semibold text-zinc-300">{getUserName()}</span>
            <ChevronDown size={14} className={`text-zinc-500 transition-transform duration-300 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2.5 w-56 rounded-2xl bg-zinc-900 border border-zinc-800 p-2 shadow-2xl shadow-black/60 animate-in fade-in slide-in-from-top-3 duration-200">
              <div className="px-3.5 py-2.5 border-b border-zinc-800">
                <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Account</p>
                <p className="text-sm font-semibold text-zinc-200 truncate mt-0.5">{getUserName()}</p>
                <p className="text-[10px] text-zinc-500 truncate mt-0.5">{currentUser?.email}</p>
              </div>
              <div className="p-1.5 space-y-1">
                <div className="px-3 py-1.5 text-xs text-indigo-400 font-semibold uppercase tracking-wide">
                  {currentUser?.role}
                </div>
                <button
                  onClick={() => setProfileDropdownOpen(false)}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 rounded-xl transition-colors text-left"
                >
                  <Home size={15} />
                  <span>My Profile</span>
                </button>
                <button
                  onClick={() => setProfileDropdownOpen(false)}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 rounded-xl transition-colors text-left"
                >
                  <SettingsIcon size={15} />
                  <span>Account Settings</span>
                </button>
                <button
                  onClick={onLogout}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-colors text-left font-medium cursor-pointer"
                >
                  <LogOut size={15} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
