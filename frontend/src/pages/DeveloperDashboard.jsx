import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  doc,
  query,
  where,
  onSnapshot,
  updateDoc,
  arrayUnion,
  addDoc,
  serverTimestamp,
  orderBy,
  limit
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import useAuth from "../hooks/useAuth";
import { logout } from "../services/authService";

// Developer Sub-components
import Sidebar from "../components/layout/Sidebar";
import TopNavbar from "../components/layout/TopNavbar";
import ProjectCard from "../components/project/ProjectCard";
import NotificationCard from "../components/notification/NotificationCard";
import ActivityPanel from "../components/common/ActivityPanel";
import TaskSummary from "../components/task/TaskSummary";
import JoinProjectModal from "../components/project/JoinProjectModal";
import TeamChatPanel from "../components/chat/TeamChatPanel";

// Lucide Icons
import {
  Briefcase,
  Zap,
  Clock,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  Users,
  Inbox,
  AlertCircle,
  X,
  MessageSquare
} from "lucide-react";
import { getAllocatedProject, getDomainProjects, joinProject } from "../services/projectService";

const DeveloperDashboard = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();


  // Navigation tab and mobile states
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Database states
  const [projects, setProjects] = useState([]);
  const [activities, setActivities] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);

  // Selections & Modals
  const [selectedChatProject, setSelectedChatProject] = useState(null);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [projectToJoin, setProjectToJoin] = useState(null);

  // UI Loaders & Filters
  const [loading, setLoading] = useState(true);
  const [joinLoading, setJoinLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  // doamin Realted project Fecthing from frirebase
  const [domainproject, setDomainProject] = useState([]);
  const [allocatedProjects, setAllocatedProjects] = useState([]);
  const [refreshAllocatedProject, setRefreshAllocatedProject] = useState(false);

  useEffect(() => {
    const fetchDomainProject = async () => {
      const projects = await getDomainProjects(currentUser?.role, currentUser?.uid);
      const filteredRecommandedProject = projects.filter((project) => !project.members.includes(currentUser?.uid) && project.members.length < project.teamSize);
      const filteredAllocatedProject = projects.filter((project) => project.members.includes(currentUser?.uid));


      setDomainProject(filteredRecommandedProject);
      setAllocatedProjects(filteredAllocatedProject);
      console.log("recommanded", filteredRecommandedProject);
      console.log("Allocated", filteredAllocatedProject);

    }
    fetchDomainProject();
  }, [currentUser, refreshAllocatedProject])




  // Helper: Extract username
  const getUserName = () => {
    if (!currentUser) return "Developer";
    if (currentUser.displayName) return currentUser.displayName;
    const emailPrefix = currentUser.email.split("@")[0];
    return emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
  };

  // Perform Firestore realtime synchronization and seed data if empty
  useEffect(() => {
    if (!currentUser) return;

    let unsubscribeProjects = () => { };
    let unsubscribeActivities = () => { };
    let unsubscribeTasks = () => { };
    let unsubscribeChat = () => { };

    const checkAndSync = async () => {
      try {
        setLoading(true);

        // 1. Subscribe to Projects collection real-time
        unsubscribeProjects = onSnapshot(
          collection(db, "projects"),
          (snapshot) => {
            const projs = [];
            snapshot.forEach((doc) => {
              projs.push({ id: doc.id, ...doc.data() });
            });
            setProjects(projs);
            setLoading(false);
          },
          (err) => {
            console.error("Projects real-time subscription error:", err);
            setLoading(false);
          }
        );

        // 2. Subscribe to Tasks collection real-time
        const tasksQuery = query(
          collection(db, "tasks"),
          where("assignedTo", "==", currentUser.uid)
        );
        unsubscribeTasks = onSnapshot(
          tasksQuery,
          (snapshot) => {
            const tskList = [];
            snapshot.forEach((doc) => {
              tskList.push({ id: doc.id, ...doc.data() });
            });
            setTasks(tskList);
          },
          (err) => {
            console.error("Tasks real-time subscription error:", err);
          }
        );

        // 3. Subscribe to Activities collection real-time
        const activitiesQuery = query(
          collection(db, "activities"),
          orderBy("createdAt", "desc"),
          limit(8)
        );
        unsubscribeActivities = onSnapshot(
          activitiesQuery,
          (snapshot) => {
            const acts = [];
            snapshot.forEach((doc) => {
              const data = doc.data();
              acts.push({
                id: doc.id,
                ...data,
                timestamp: data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"
              });
            });
            setActivities(acts);
          },
          (err) => {
            console.error("Activities real-time subscription error:", err);
          }
        );

      } catch (err) {
        console.error("Error checking or seeding Firestore:", err);
        setLoading(false);
      }
    };

    checkAndSync();

    return () => {
      unsubscribeProjects();
      unsubscribeActivities();
      unsubscribeTasks();
      unsubscribeChat();
    };
  }, [currentUser]);

  // Subscribe to real-time chat messages when a project is opened
  useEffect(() => {
    if (!selectedChatProject) return;

    const projectId = selectedChatProject.pid || selectedChatProject.id;
    const chatQuery = query(
      collection(db, "projects", projectId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribeChat = onSnapshot(
      chatQuery,
      (snapshot) => {
        const msgs = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          msgs.push({
            id: doc.id,
            ...data,
            timestamp: data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"
          });
        });
        setChatMessages(msgs);
      },
      (err) => {
        console.error("Chat real-time subscription error:", err);
      }
    );

    return () => unsubscribeChat();
  }, [selectedChatProject]);

  // Handle Logout
  const handleLogoutClick = async () => {
    try {
      await logout();
      setCurrentUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  // Open the join confirmation modal
  const handleRequestJoinProject = (project) => {
    console.log("handleRequestJoinProject", project);

    setProjectToJoin(project);
    setJoinModalOpen(true);
  };

  // Commit Join Project into Firestore
  const handleConfirmJoinProject = async (projectId) => {


    if (!projectToJoin) {
      console.log("Project to join is null");
      return;
    }

    try {
      setJoinLoading(true);

      const projData = await joinProject(projectId, currentUser?.uid);
      console.log("project Data", projData);
      setRefreshAllocatedProject(prev => !prev);
      // const currentCount = projectToJoin.members ? projectToJoin.members.length : 0;
      // const teamSizeLimit = projectToJoin.teamSize || 3;
      // const shouldActivate = (currentCount + 1) >= teamSizeLimit;
      setJoinModalOpen(false);
      setProjectToJoin(null);



    } catch (err) {
      console.error("Error joining project in Firestore:", err);
    } finally {
      setJoinLoading(false);

    }
  };

  // Realtime Task Status Toggler
  const handleToggleTaskStatus = async (taskId, nextStatus) => {
    try {
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, {
        status: nextStatus
      });

      // Calculate new overall progress dynamically for connected project
      const updatedTask = tasks.find(t => t.id === taskId);
      if (updatedTask && updatedTask.projectId) {
        const connectedTasks = tasks.filter(t => t.projectId === updatedTask.projectId);

        // Find tasks in this workspace
        const totalWorkspaceTasks = connectedTasks.length;
        const completedWorkspaceTasks = connectedTasks.filter(t => t.status === "Completed" || (t.id === taskId && nextStatus === "Completed")).length;

        // Basic progress rule
        const newProgress = Math.min(100, Math.round((completedWorkspaceTasks / totalWorkspaceTasks) * 100));

        const projRef = doc(db, "projects", updatedTask.projectId);
        await updateDoc(projRef, {
          progress: newProgress,
          status: newProgress === 100 ? "Completed" : "Active"
        });
      }

      // Add dynamic task update activity log
      await addDoc(collection(db, "activities"), {
        user: getUserName(),
        action: `updated task to "${nextStatus}" in`,
        target: updatedTask?.project || "CollabFlow",
        type: "task",
        createdAt: serverTimestamp()
      });

    } catch (err) {
      console.error("Error updating task status:", err);
    }
  };

  // Real-time Chat Message Dispatcher
  const handleSendChatMessage = async (projectId, text) => {
    try {
      await addDoc(collection(db, "projects", projectId, "messages"), {
        senderId: currentUser.uid,
        senderName: getUserName(),
        text: text,
        role: currentUser.role,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Error dispatching chat message:", err);
    }
  };

  // Partition projects into Allocated vs Available Matches
  // const allocatedProjects = allocatedProject;


  const availableDomainNotifications = projects.filter(p =>
    p.category === currentUser.role &&
    p.members &&
    !p.members.includes(currentUser.uid) &&
    p.members.length < (Number(p.teamSize) || 3)
  );




  const filteredDomainNotifications = availableDomainNotifications.filter(p => {
    const name = p.name || "";
    const category = p.category || "";
    return name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Premium UI Showcase projects representing the 5 latest matches


  // Showcase projects filtered by search query
  const displayedRecommendedProjects = domainproject;
  // .filter(p => {
  //   const name = p.name || "";
  //   const category = p.category || "";
  //   return name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     category.toLowerCase().includes(searchQuery.toLowerCase());
  // });

  // Quick statistics
  const totalAllocatedProjects = allocatedProjects.length;
  const matchCount = domainproject.length;
  const pendingTasksCount = tasks.filter(t => t.status !== "Completed").length;
  const efficiencyProgress = totalAllocatedProjects > 0
    ? Math.round(allocatedProjects.reduce((acc, curr) => acc + (curr.progress || 0), 0) / totalAllocatedProjects)
    : 0;








  // Render Loading Skeletons
  if (loading) {
    return (
      <div className="min-h-screen bg-[#07070a] text-zinc-100 flex items-center justify-center font-sans">
        <div className="space-y-5 text-center">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 border-4 border-indigo-500/10 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-widest animate-pulse">Syncing CollabFlow</h3>
            <p className="text-xs text-zinc-500">Subscribing to real-time project feeds...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07070a] text-zinc-100 flex relative overflow-hidden font-sans">
      {/* Dynamic Custom Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-zinc-950/80 border border-indigo-500/30 text-zinc-200 text-xs font-semibold flex items-center space-x-3 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-300">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Sparkles size={14} className="animate-pulse" />
          </div>
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage("")}
            className="text-zinc-500 hover:text-zinc-300 transition-colors text-[10px]"
          >
            ✕
          </button>
        </div>
      )}

      {/* Background radial spotlight flares */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-violet-500/5 rounded-full blur-3xl pointer-events-none z-0"></div>

      {/* SIDEBAR */}
      <Sidebar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setMobileSidebarOpen(false);
        }}
        onLogout={handleLogoutClick}
      />

      {/* Mobile Drawer Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
          ></div>
          <div className="absolute inset-y-0 left-0 w-72 flex bg-zinc-950 z-50">
            <Sidebar
              currentUser={currentUser}
              activeTab={activeTab}
              setActiveTab={(tab) => {
                setActiveTab(tab);
                setMobileSidebarOpen(false);
              }}
              onLogout={handleLogoutClick}
            />
          </div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <main className="flex-1 flex flex-col min-w-0 relative z-10 overflow-y-auto">

        {/* HEADER */}
        <TopNavbar
          currentUser={currentUser}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onLogout={handleLogoutClick}
          toggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          pendingNotificationsCount={matchCount}
        />

        {/* CORE CONTENT LAYOUT */}
        <div className="flex-grow p-6 space-y-8 select-none">

          {/* Welcome Dashboard Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-left">
              <h1 className="text-3xl font-extrabold text-zinc-100 tracking-tight">
                Developer Workspace, <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">{getUserName()}</span>
              </h1>
              <p className="text-zinc-400 text-sm mt-1">
                Collaborate with peers, tackle sprints, and monitor real-time domain requests.
              </p>
            </div>

            {/* Quick status/domain indicator */}
            <div className="flex items-center space-x-2 py-2 px-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-xs font-semibold text-zinc-400">Profile Match: {currentUser?.role}</span>
            </div>
          </div>

          {/* QUICK STATISTICS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* STAT 1: Joined Projects */}
            <div className="bg-zinc-900/40 border border-zinc-800/70 p-5 rounded-2xl flex items-center justify-between hover:border-zinc-700/60 hover:bg-zinc-900/60 transition-all duration-300 group shadow-md shadow-black/10">
              <div className="space-y-2 text-left">
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Allocated Projects</p>
                <p className="text-3xl font-extrabold text-zinc-100 tracking-tight">{totalAllocatedProjects}</p>
              </div>
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl group-hover:scale-110 transition-transform">
                <Briefcase size={18} />
              </div>
            </div>

            {/* STAT 2: Domain Matches */}
            <div className="bg-zinc-900/40 border border-zinc-800/70 p-5 rounded-2xl flex items-center justify-between hover:border-zinc-700/60 hover:bg-zinc-900/60 transition-all duration-300 group shadow-md shadow-black/10">
              <div className="space-y-2 text-left">
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Recommended Sprints</p>
                <p className="text-3xl font-extrabold text-zinc-100 tracking-tight">{matchCount}</p>
              </div>
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl group-hover:scale-110 transition-transform">
                <Zap size={18} />
              </div>
            </div>

            {/* STAT 3: Pending Tasks */}
            <div className="bg-zinc-900/40 border border-zinc-800/70 p-5 rounded-2xl flex items-center justify-between hover:border-zinc-700/60 hover:bg-zinc-900/60 transition-all duration-300 group shadow-md shadow-black/10">
              <div className="space-y-2 text-left">
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">My Pending Tasks</p>
                <p className="text-3xl font-extrabold text-zinc-100 tracking-tight">{pendingTasksCount}</p>
              </div>
              <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl group-hover:scale-110 transition-transform">
                <Clock size={18} />
              </div>
            </div>

            {/* STAT 4: Average Work Progress */}
            <div className="bg-zinc-900/40 border border-zinc-800/70 p-5 rounded-2xl flex items-center justify-between hover:border-zinc-700/60 hover:bg-zinc-900/60 transition-all duration-300 group shadow-md shadow-black/10">
              <div className="space-y-2 text-left">
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Sprint Progress</p>
                <p className="text-3xl font-extrabold text-zinc-100 tracking-tight">{efficiencyProgress}%</p>
              </div>
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl group-hover:scale-110 transition-transform">
                <CheckCircle2 size={18} />
              </div>
            </div>
          </div>

          {/* MAIN GRID LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* LEFT 2-COLUMN SECTION (Projects, Notifications, Tasks, Chat) */}
            <div className="lg:col-span-2 space-y-8 text-left">

              {/* TABBED NAVIGATION CONTROL FOR MAIN BODY */}
              {activeTab === "Dashboard" && (
                <>
                  {/* 1. MY ALLOCATED PROJECTS PANEL */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h3 className="text-lg font-bold text-zinc-200">Allocated Projects</h3>
                        <p className="text-xs text-zinc-500">Projects where you are actively registered as a team member.</p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-1 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-lg">
                        {allocatedProjects.length} Active Workspaces
                      </span>
                    </div>

                    {allocatedProjects.length === 0 ? (
                      <div className="p-10 border border-dashed border-zinc-800 rounded-3xl flex flex-col items-center justify-center text-center space-y-3 bg-zinc-900/10">
                        <div className="p-3.5 bg-zinc-900 border border-zinc-800 text-zinc-500 rounded-2xl">
                          <Briefcase size={24} />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-zinc-300">No allocated projects</p>
                          <p className="text-[11px] text-zinc-500 max-w-xs">You haven't joined any project workspaces yet. Tap a sprint match below to get started!</p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 animate-in fade-in duration-300">
                        {allocatedProjects.map((p) => (
                          <ProjectCard
                            key={p.pid}
                            project={p}
                            onOpen={(proj) => {
                              setSelectedChatProject(proj);
                              // Scroll chat panel into view smoothly if clicked
                              setTimeout(() => {
                                document.getElementById("team-chat-wrapper")?.scrollIntoView({ behavior: "smooth" });
                              }, 100);
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 2. DOMAIN-BASED PROJECT NOTIFICATIONS PANEL */}
                  <div className="space-y-4 pt-4 border-t border-zinc-900/80">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="space-y-0.5 text-left">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-bold text-zinc-200">Recommended Sprints</h3>
                          <span className="inline-flex h-2 w-2 rounded-full bg-indigo-500 animate-ping"></span>
                        </div>
                        <p className="text-xs text-zinc-500">Newly added workspaces matching your role/domain specialization.</p>
                      </div>

                      <span className="text-[10px] font-bold px-2 py-1.5 bg-zinc-900 border border-zinc-800 text-indigo-400 rounded-lg uppercase tracking-wider select-none">
                        {currentUser?.role} Match
                      </span>
                    </div>

                    {displayedRecommendedProjects.length === 0 ? (
                      <div className="p-10 border border-dashed border-zinc-800 rounded-3xl flex flex-col items-center justify-center text-center space-y-3 bg-zinc-900/10">
                        <div className="p-3.5 bg-zinc-900 border border-zinc-800 text-zinc-500 rounded-2xl">
                          <Inbox size={24} />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-zinc-300">No recommended matching projects</p>
                          <p className="text-[11px] text-zinc-500 max-w-xs">There are no available new project postings for {currentUser?.role} at this time.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 animate-in fade-in duration-300">
                        {displayedRecommendedProjects.map((p) => (
                          <NotificationCard
                            key={p.pid}
                            project={p}
                            onJoin={handleRequestJoinProject}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* MY PROJECTS TAB */}
              {activeTab === "My Projects" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-zinc-200">My Workspace Center</h3>
                  <p className="text-xs text-zinc-500">Manage and coordinate all workspaces you have joined.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {allocatedProjects.map((p) => (
                      <ProjectCard
                        key={p.id}
                        project={p}
                        onOpen={(proj) => setSelectedChatProject(proj)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* ASSIGNED TASKS TAB / SECTION */}
              {(activeTab === "Dashboard" || activeTab === "Assigned Tasks") && (
                <div className="pt-4 border-t border-zinc-900/80">
                  <TaskSummary
                    tasks={tasks}
                    onUpdateStatus={handleToggleTaskStatus}
                  />
                </div>
              )}

              {/* REAL-TIME TEAM CHAT PANEL */}
              {selectedChatProject ? (
                <div id="team-chat-wrapper" className="pt-6 border-t border-zinc-900/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-zinc-200">Team Communications</h3>
                    <button
                      onClick={() => setSelectedChatProject(null)}
                      className="flex items-center space-x-1 py-1 px-2.5 rounded-lg bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 text-[10px] transition-colors cursor-pointer"
                    >
                      <X size={10} />
                      <span>Close Chat</span>
                    </button>
                  </div>

                  <TeamChatPanel
                    project={selectedChatProject}
                    currentUser={currentUser}
                    messages={chatMessages}
                    onSendMessage={handleSendChatMessage}
                  />
                </div>
              ) : (
                activeTab === "Team Chat" && (
                  <div className="p-16 border border-dashed border-zinc-850 bg-zinc-900/10 rounded-3xl text-center space-y-4">
                    <div className="p-4 bg-zinc-900 border border-zinc-800 text-zinc-500 rounded-full inline-block">
                      <MessageSquare size={32} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-zinc-300">No Chat Channel Active</h4>
                      <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                        Please select and click "Open Project" on one of your allocated workspace cards above to load your live team communications lobby.
                      </p>
                    </div>
                  </div>
                )
              )}

              {/* SETTINGS TAB */}
              {activeTab === "Settings" && (
                <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-3xl p-6 shadow-xl shadow-black/10 text-left backdrop-blur-lg space-y-6">
                  <div className="flex items-center space-x-2 pb-4 border-b border-zinc-800/80">
                    <Zap className="text-indigo-400 animate-spin" style={{ animationDuration: "6s" }} size={18} />
                    <h3 className="text-base font-bold text-zinc-200">Account & Theme Settings</h3>
                  </div>

                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col space-y-1.5">
                        <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Full Name</label>
                        <input
                          type="text"
                          defaultValue={getUserName()}
                          className="py-3 px-4 rounded-xl bg-zinc-950 border border-zinc-850 text-zinc-200 text-xs outline-none focus:border-indigo-500/80"
                        />
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Email Address</label>
                        <input
                          type="email"
                          value={currentUser?.email}
                          disabled
                          className="py-3 px-4 rounded-xl bg-zinc-950/60 border border-zinc-850 text-zinc-500 text-xs outline-none cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-900 flex items-center justify-between flex-wrap gap-4">
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-semibold text-zinc-300">Dark Application Theme</h4>
                        <p className="text-[10px] text-zinc-500">Configure visual themes for your workspaces.</p>
                      </div>
                      <div className="px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-bold uppercase tracking-wider">
                        Dark SaaS Theme Active
                      </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-900 flex items-center justify-between flex-wrap gap-4">
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-semibold text-zinc-300">Real-Time Email Notifications</h4>
                        <p className="text-[10px] text-zinc-500">Send immediate digest updates upon task completions.</p>
                      </div>
                      <button type="button" className="py-2 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 text-zinc-300 text-[10px] font-bold transition-all cursor-pointer">
                        Enabled
                      </button>
                    </div>

                    <div className="pt-6 flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => alert("Settings saved successfully! (Simulation)")}
                        className="py-2.5 px-5 text-xs font-bold text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:brightness-110 rounded-xl transition-all shadow-lg cursor-pointer"
                      >
                        Save Configurations
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>

            {/* RIGHT SIDEBAR (Timeline Feed, Deadlines, Shortcuts) */}
            <div className="space-y-8">

              {/* 1. RECENT ACTIVITY TIMELINE */}
              <ActivityPanel activities={activities} />

              {/* 2. UPCOMING DEADLINES CHECKLIST */}
              <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-3xl p-6 shadow-xl shadow-black/10 text-left backdrop-blur-lg">
                <div className="flex items-center space-x-2 pb-4 border-b border-zinc-800/80 mb-4">
                  <Calendar className="text-indigo-400" size={17} />
                  <h4 className="text-sm font-bold text-zinc-200">Upcoming Deadlines</h4>
                </div>

                {allocatedProjects.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-3 text-center">No project deadlines registered.</p>
                ) : (
                  <div className="space-y-3">
                    {allocatedProjects.map((p) => (
                      <div key={p.pid} className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/20 border border-zinc-900 hover:border-zinc-850 transition-colors">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-zinc-200 truncate max-w-[120px]">{p.name}</p>
                          <span className="text-[9px] font-semibold text-indigo-400 uppercase tracking-wider">{p.category}</span>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-850 text-zinc-400">
                            {p.dueDate}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. ASSIGNED PROJECT MEMBERS QUICK LIST */}
              <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-3xl p-6 shadow-xl shadow-black/10 text-left backdrop-blur-lg">
                <div className="flex items-center space-x-2 pb-4 border-b border-zinc-800/80 mb-4">
                  <Users className="text-indigo-400" size={17} />
                  <h4 className="text-sm font-bold text-zinc-200">Workspace Directory</h4>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-bold flex items-center justify-center text-xs">
                      SC
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-200">Sarah Chen</p>
                      <p className="text-[10px] text-zinc-500">Design Team Lead</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3.5">
                    <div className="w-8 h-8 rounded-lg bg-violet-500/20 text-violet-400 border border-violet-500/30 font-bold flex items-center justify-center text-xs">
                      AR
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-200">Alex Rivera</p>
                      <p className="text-[10px] text-zinc-500">Frontend Developer</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold flex items-center justify-center text-xs">
                      MV
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-200">Marcus Vance</p>
                      <p className="text-[10px] text-zinc-500">Backend architect</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </main>

      {/* CONFIRM JOIN OVERLAY MODAL */}
      <JoinProjectModal
        isOpen={joinModalOpen}
        project={projectToJoin}
        onClose={() => {
          setJoinModalOpen(false);
          setProjectToJoin(null);
        }}
        onConfirm={handleConfirmJoinProject}
        loading={joinLoading}
      />

    </div>
  );
};

export default DeveloperDashboard;
