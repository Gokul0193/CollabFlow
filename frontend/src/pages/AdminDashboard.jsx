import React, { useState, useEffect, useRef } from "react";
import {
  Home,
  FolderGit2,
  KanbanSquare,
  Users,
  BarChart3,
  Settings as SettingsIcon,
  LogOut,
  Search,
  Plus,
  X,
  ArrowUpRight,
  FolderPlus,
  Bell,
  ChevronDown,
  CheckCircle2,
  Clock,
  Zap,
  Briefcase,
  ArrowLeft,
  Calendar,
  Sparkles,
  Trash2,
  CheckCircle
} from "lucide-react";
import useAuth from "../hooks/useAuth";
import { logout } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { getAllProjects, projectAdd } from "../services/projectService";
import SelectedProjectView from "../components/project/SelectedProjectView";
import { db } from "../firebase/firebase";
import {
  collection,
  doc,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp
} from "firebase/firestore";

const AdminDashboard = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  // Stateful projects to allow creating projects dynamically!
  const [projects, setProjects] = useState([]);

  // Sidebar navigation selection
  const [activeTab, setActiveTab] = useState("Dashboard");

  // Profile dropdown menu visibility
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // New Project modal visibility and state
  const [modalOpen, setModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectCategory, setNewProjectCategory] = useState("Frontend Dev");
  const [newProjectTeamSize, setNewProjectTeamSize] = useState(3);
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [newProjectDueDate, setNewProjectDueDate] = useState("");
  const [newProjectSkills, setNewProjectSkills] = useState("");

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false);

  // Search filter
  const [searchQuery, setSearchQuery] = useState("");

  // Selected project for details view
  const [selectedProject, setSelectedProject] = useState(null);

  // Cache list of all users to map uid to name/email
  const [allUsers, setAllUsers] = useState({});

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getAllProjects();
        console.log("projects", data);

        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects via backend REST API:", error);
      }
    };
    fetchProjects();
  }, []);

  // Fetch all users on mount to map uids to actual names/profiles
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersMap = {};
        querySnapshot.forEach((doc) => {
          const u = doc.data();
          usersMap[u.uid] = u;
        });
        setAllUsers(usersMap);
      } catch (err) {
        console.error("Error fetching users directory:", err);
      }
    };
    fetchUsers();
  }, []);



  // Handle outside dropdown click to close it
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);



  const handleLogoutClick = async () => {
    try {
      await logout();
      setCurrentUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  const handleCreateProjectSubmit = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    const newProj = {
      name: newProjectName.trim(),
      category: newProjectCategory,
      progress: 0,
      teamSize: Number(newProjectTeamSize),
      status: "Proactive",
      description: newProjectDescription.trim() || "No description provided.",
      dueDate: newProjectDueDate || "Not Set",
      skills: newProjectSkills ? newProjectSkills.split(",").map(s => s.trim()).filter(Boolean) : [],
      members: []
    };

    try {
      setError("");
      setLoading(true);
      const projectData = await projectAdd(newProj);
      setProjects((prev) => [projectData, ...prev]);

      // Reset state variables
      setNewProjectName("");
      setNewProjectCategory("Frontend Dev");
      setNewProjectTeamSize(3);
      setNewProjectDescription("");
      setNewProjectDueDate("");
      setNewProjectSkills("");
    } catch (error) {
      console.error("Create project submission error:", error);
    } finally {
      setLoading(false);
      setModalOpen(false);
    }
  };

  // Helper: Extract username or fallback
  const getUserName = () => {
    if (!currentUser) return "User";
    if (currentUser.displayName) return currentUser.displayName;
    const emailPrefix = currentUser.email.split("@")[0];
    return emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
  };

  // Helper: Get avatar abbreviation
  const getAvatarLetters = () => {
    if (!currentUser) return "CF";
    if (currentUser.displayName) {
      return currentUser.displayName.slice(0, 2).toUpperCase();
    }
    return currentUser.email.slice(0, 2).toUpperCase();
  };

  // Filter projects by search (resilient to missing fields)
  const filteredProjects = projects.filter(p => {
    const name = p.name || "";
    const category = p.category || "";
    return name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Stats calculation (resilient to missing database properties)
  const totalProjectsCount = projects.length;
  const completedProjectsCount = projects.filter(p => (p.progress || 0) === 100).length;
  const activeProjectsCount = projects.filter(p => p.status === "Active" || p.status === "Proactive").length;
  const avgCompletion = totalProjectsCount > 0
    ? Math.round(projects.reduce((acc, curr) => acc + (curr.progress || 0), 0) / totalProjectsCount)
    : 0;

  const sidebarItems = [
    { name: "Dashboard", icon: Home },
    { name: "Projects", icon: FolderGit2 },
    { name: "Kanban Board", icon: KanbanSquare },
    { name: "Team Members", icon: Users },
    { name: "Analytics", icon: BarChart3 },
    { name: "Settings", icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-[#07070a] text-zinc-100 flex relative overflow-hidden font-sans select-none">
      {/* Background spotlights */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-violet-500/5 rounded-full blur-3xl pointer-events-none z-0"></div>

      {/* SIDEBAR */}
      <aside className="hidden lg:flex w-72 flex-col justify-between p-6 border-r border-zinc-800/80 bg-zinc-950/40 backdrop-blur-xl relative z-10 select-none">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center space-x-3 px-2">
            <div className="p-2 bg-indigo-500/10 border border-indigo-500/30 rounded-xl">
              <Briefcase className="text-indigo-400" size={22} />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent tracking-wide">
              CollabFlow
            </span>
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
                  className={`w-full flex items-center space-x-3.5 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${isActive
                    ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
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
        <div className="border-t border-zinc-900 pt-6 px-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-sm text-white border border-indigo-400/20">
                {getAvatarLetters()}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-semibold text-zinc-200 truncate max-w-[120px]">{getUserName()}</span>
                <span className="text-[10px] text-zinc-500 truncate max-w-[120px]">{currentUser?.email}</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-zinc-900/60 hover:bg-red-500/10 border border-zinc-800 hover:border-red-500/20 text-zinc-400 hover:text-red-400 rounded-xl text-xs font-semibold transition-all duration-300"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-1 flex flex-col min-w-0 relative z-10 overflow-y-auto">
        {/* HEADER */}
        <header className="flex items-center justify-between p-6 border-b border-zinc-900/80 bg-[#07070a]/75 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center space-x-4 flex-1 max-w-lg">
            <div className="relative w-full group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" size={17} />
              <input
                type="text"
                placeholder="Search projects by name or technology..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/40 border border-zinc-800/80 rounded-xl text-sm placeholder-zinc-500 text-zinc-200 outline-none focus:bg-zinc-900/70 focus:border-indigo-500/80 focus:ring-4 focus:ring-indigo-950/40 transition-all duration-300"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4 pl-4">
            {/* Notification bell */}
            <button className="p-2.5 rounded-xl bg-zinc-900/40 border border-zinc-800/80 text-zinc-400 hover:text-zinc-200 transition-colors duration-200 relative">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full"></span>
            </button>

            {/* User Profile dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-2.5 p-1.5 pr-3.5 bg-zinc-900/40 hover:bg-zinc-900/70 border border-zinc-800/60 rounded-xl transition-all duration-300"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-xs text-white">
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
                      onClick={handleLogoutClick}
                      className="w-full flex items-center space-x-2.5 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-colors text-left font-medium"
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

        {/* CORE CONTENT LAYOUT */}
        <div className="flex-grow p-6 space-y-8 select-none">
          {selectedProject ? (
            <SelectedProjectView
              selectedProject={selectedProject}
              onBack={() => setSelectedProject(null)}
              allUsers={allUsers}
            />
          ) : (
            /* STANDARD MAIN DASHBOARD VIEW */
            <>
              {/* Welcome Dashboard Header banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-extrabold text-zinc-100 tracking-tight">
                    Welcome back, <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">{getUserName()}</span>
                  </h1>
                  <p className="text-zinc-400 text-sm mt-1">
                    Here's what is happening across your CollabFlow workspaces today.
                  </p>
                </div>

                <button
                  onClick={() => setModalOpen(true)}
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:brightness-110 shadow-lg shadow-indigo-950/20 text-white font-semibold py-3 px-5 rounded-xl text-sm transition-all duration-300 transform active:scale-95 cursor-pointer"
                >
                  <FolderPlus size={18} />
                  <span>Create Project</span>
                </button>
              </div>

              {/* METRIC CARDS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* CARD 1 */}
                <div className="bg-zinc-900/40 border border-zinc-800/70 p-5 rounded-2xl flex items-center justify-between hover:border-zinc-700/60 hover:bg-zinc-900/60 transition-all duration-300 group shadow-md shadow-black/10">
                  <div className="space-y-2">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Total Projects</p>
                    <p className="text-3xl font-extrabold text-zinc-100 tracking-tight">{totalProjectsCount}</p>
                  </div>
                  <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl group-hover:scale-110 transition-transform">
                    <Briefcase size={20} />
                  </div>
                </div>

                {/* CARD 2 */}
                <div className="bg-zinc-900/40 border border-zinc-800/70 p-5 rounded-2xl flex items-center justify-between hover:border-zinc-700/60 hover:bg-zinc-900/60 transition-all duration-300 group shadow-md shadow-black/10">
                  <div className="space-y-2">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Active Workspaces</p>
                    <p className="text-3xl font-extrabold text-zinc-100 tracking-tight">{activeProjectsCount}</p>
                  </div>
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl group-hover:scale-110 transition-transform">
                    <Zap size={20} />
                  </div>
                </div>

                {/* CARD 3 */}
                <div className="bg-zinc-900/40 border border-zinc-800/70 p-5 rounded-2xl flex items-center justify-between hover:border-zinc-700/60 hover:bg-zinc-900/60 transition-all duration-300 group shadow-md shadow-black/10">
                  <div className="space-y-2">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Avg. Completion</p>
                    <p className="text-3xl font-extrabold text-zinc-100 tracking-tight">{avgCompletion}%</p>
                  </div>
                  <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl group-hover:scale-110 transition-transform">
                    <Clock size={20} />
                  </div>
                </div>

                {/* CARD 4 */}
                <div className="bg-zinc-900/40 border border-zinc-800/70 p-5 rounded-2xl flex items-center justify-between hover:border-zinc-700/60 hover:bg-zinc-900/60 transition-all duration-300 group shadow-md shadow-black/10">
                  <div className="space-y-2">
                    <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Completed Projects</p>
                    <p className="text-3xl font-extrabold text-zinc-100 tracking-tight">{completedProjectsCount}</p>
                  </div>
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl group-hover:scale-110 transition-transform">
                    <CheckCircle2 size={20} />
                  </div>
                </div>
              </div>

              {/* PROJECT LIST SHEET */}
              <div className="bg-zinc-900/30 backdrop-blur-lg border border-zinc-800/60 rounded-3xl overflow-hidden shadow-xl shadow-black/20">
                <div className="p-6 border-b border-zinc-800/60 flex items-center justify-between flex-wrap gap-4">
                  <div className="space-y-0.5">
                    <h3 className="text-lg font-bold text-zinc-200">Active Workspaces</h3>
                    <p className="text-xs text-zinc-400">Manage, organize, and monitor project status and sprint timelines.</p>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-lg">
                    {filteredProjects.length} Workspaces Found
                  </span>
                </div>

                {filteredProjects.length === 0 ? (
                  <div className="p-16 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="p-4 bg-zinc-800/40 border border-zinc-700/60 text-zinc-500 rounded-full">
                      <FolderGit2 size={36} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-zinc-300 font-semibold">No workspaces found</p>
                      <p className="text-zinc-500 text-xs max-w-sm">No active project matches your search query. Try typing another name or create a new workspace!</p>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-900 text-left bg-zinc-950/20 text-xs font-bold text-zinc-400 uppercase tracking-wider select-none">
                          <th className="py-4 px-6">Workspace Name</th>
                          <th className="py-4 px-6">Domain</th>
                          <th className="py-4 px-6">Team Size</th>
                          <th className="py-4 px-6">Milestone Progress</th>
                          <th className="py-4 px-6">Status</th>
                          <th className="py-4 px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProjects.map((p) => (
                          <tr
                            key={p.id || p.pid}
                            onClick={() => setSelectedProject(p)}
                            className="border-b border-zinc-900 hover:bg-zinc-900/20 transition-colors duration-200 text-sm text-zinc-300 group cursor-pointer"
                          >
                            <td className="py-4.5 px-6 font-semibold text-zinc-200">
                              {p.name}
                            </td>
                            <td className="py-4.5 px-6 text-xs font-medium text-zinc-400">
                              <span className="px-2.5 py-1 bg-zinc-800/80 border border-zinc-700/50 rounded-lg text-indigo-400">
                                {p.category}
                              </span>
                            </td>
                            <td className="py-4.5 px-6">
                              <div className="flex flex-col space-y-1">
                                <div className="flex items-center -space-x-1.5 select-none">
                                  {p.members && p.members.length > 0 ? (
                                    [...Array(Math.min(p.members.length, 4))].map((_, i) => (
                                      <div
                                        key={i}
                                        className="w-6.5 h-6.5 rounded-full border border-zinc-900 flex items-center justify-center text-[9px] font-bold text-white bg-indigo-500"
                                        style={{
                                          backgroundColor: i === 0 ? "#6366f1" : i === 1 ? "#8b5cf6" : i === 2 ? "#06b6d4" : "#10b981"
                                        }}
                                      >
                                        {String.fromCharCode(65 + i * 4 + (p.pid || p.id || "a").charCodeAt(0))}
                                      </div>
                                    ))
                                  ) : (
                                    <span className="text-[10px] text-zinc-500 italic">No members yet</span>
                                  )}
                                  {p.members && p.members.length > 4 && (
                                    <div className="w-6.5 h-6.5 rounded-full border border-zinc-900 flex items-center justify-center text-[9px] font-bold bg-zinc-800 text-zinc-400">
                                      +{p.members.length - 4}
                                    </div>
                                  )}
                                </div>
                                <span className="text-[10px] text-zinc-500 font-semibold">{(p.members ? p.members.length : 0)} / {p.teamSize} joined</span>
                              </div>
                            </td>
                            <td className="py-4.5 px-6">
                              <div className="flex items-center space-x-3 min-w-[120px]">
                                <div className="flex-1 w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-800/30">
                                  <div
                                    className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                                    style={{ width: `${p.progress}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs font-bold text-zinc-400">{p.progress}%</span>
                              </div>
                            </td>
                            <td className="py-4.5 px-6">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${p.status === "Completed"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : p.status === "Review"
                                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                  : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                                }`}>
                                {p.status}
                              </span>
                            </td>
                            <td className="py-4.5 px-6 text-right">
                              <button className="p-2 bg-zinc-900/60 group-hover:bg-indigo-500/10 group-hover:text-indigo-400 border border-zinc-800/80 group-hover:border-indigo-500/20 text-zinc-400 rounded-lg transition-all duration-300">
                                <ArrowUpRight size={15} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      {/* CREATE PROJECT MODAL (Glassmorphic Backdrop Modal) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            onClick={() => setModalOpen(false)}
            className="absolute inset-0 bg-zinc-950/70 backdrop-blur-md transition-opacity duration-300"
          ></div>

          {/* Modal Container */}
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-6 rounded-3xl shadow-2xl relative z-10 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2 text-indigo-400">
                <FolderPlus size={20} />
                <h3 className="text-lg font-bold text-zinc-100">Create New Workspace</h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/60 text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateProjectSubmit} className="space-y-4">
              <div className="flex flex-col space-y-1.5 text-left">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Workspace Name</label>
                <input
                  type="text"
                  placeholder="Enter workspace name..."
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full py-3.5 px-4 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-600 outline-none transition-all focus:border-indigo-500/80 focus:ring-4 focus:ring-indigo-950/50"
                  required
                  autoFocus
                />
              </div>

              <div className="flex flex-col space-y-1.5 text-left">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Domain / Category</label>
                <select
                  value={newProjectCategory}
                  onChange={(e) => setNewProjectCategory(e.target.value)}
                  className="w-full py-3.5 px-4 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 outline-none focus:border-indigo-500/80"
                >
                  <option value="Frontend Dev">Frontend Dev</option>
                  <option value="Backend Dev">Backend Dev</option>
                  <option value="SecOps">SecOps</option>
                  <option value="Design">Design</option>
                  <option value="QA Testing">QA Testing</option>
                </select>
              </div>

              <div className="flex flex-col space-y-1.5 text-left">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Team Size (Members Limit)</label>
                <input
                  type="number"
                  min="1"
                  max="8"
                  value={newProjectTeamSize}
                  onChange={(e) => setNewProjectTeamSize(e.target.value)}
                  className="w-full py-3.5 px-4 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 outline-none focus:border-indigo-500/80 text-xs"
                  required
                />
              </div>

              <div className="flex flex-col space-y-1.5 text-left">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Project Description</label>
                <textarea
                  placeholder="Describe this project, features, and key objectives..."
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  rows="2"
                  className="w-full py-3 px-4 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-700 outline-none focus:border-indigo-500/80 resize-none text-xs"
                  required
                />
              </div>

              <div className="flex flex-col space-y-1.5 text-left">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Due Date</label>
                <input
                  type="date"
                  value={newProjectDueDate}
                  onChange={(e) => setNewProjectDueDate(e.target.value)}
                  className="w-full py-3 px-4 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 outline-none focus:border-indigo-500/80 text-xs"
                  required
                />
              </div>

              <div className="flex flex-col space-y-1.5 text-left">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Required Skills (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. React, Tailwind, Redux"
                  value={newProjectSkills}
                  onChange={(e) => setNewProjectSkills(e.target.value)}
                  className="w-full py-3 px-4 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-700 outline-none focus:border-indigo-500/80 text-xs"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="py-3 px-5 text-sm font-semibold text-zinc-400 hover:text-zinc-200 bg-zinc-950 hover:bg-zinc-800/40 border border-zinc-800 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-3 px-5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:brightness-110 rounded-xl transition-all shadow-lg cursor-pointer"
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <span>Add Project</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
