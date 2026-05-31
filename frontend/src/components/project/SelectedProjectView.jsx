import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Clock,
  Users,
  Calendar,
  Trash2,
  Sparkles
} from "lucide-react";
import { db } from "../../firebase/firebase";
import {
  collection,
  doc,
  query,
  where,
  addDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp
} from "firebase/firestore";
import { getProjectMembers } from "../../services/projectService";
import { addTask, deleteTask, getProjectTask } from "../../services/taskService";

const SelectedProjectView = ({ selectedProject, onBack, allUsers }) => {
  // Tasks in the currently selected project
  const [projectTasks, setProjectTasks] = useState([]);
  console.log("selectedProject", selectedProject);
  const [memberdetails, setMemberDetails] = useState([])


  // States for Assign Task Form
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskAssignee, setTaskAssignee] = useState("");
  const [taskPriority, setTaskPriority] = useState("Medium");
  const [taskDueDate, setTaskDueDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Subscribe to real-time tasks list for the selected project

  const fetchmembers = async () => {
    const members = await getProjectMembers(selectedProject.members);
    setMemberDetails(members);
    console.log("fetched members", members);

  }


  const fetchTask = async () => {
    const data = await getProjectTask(selectedProject.pid);
    setProjectTasks(data);
    console.log("fetched tasks", data);

  }
  useEffect(() => {
    if (!selectedProject) {
      setProjectTasks([]);
      return;
    }
    fetchmembers();
    fetchTask();
  }, [selectedProject]);

  const handleAssignTaskSubmit = async (e) => {
    e.preventDefault();
    if (!taskName.trim() || !taskAssignee || !selectedProject) return;

    const projectId = selectedProject.pid
    const member = memberdetails.find((member) => member.name === taskAssignee)



    try {
      setLoading(true);
      const taskData = {
        title: taskName.trim(), // Keep title for developer Kanban boards
        assignedTo: member.uid,
        description: taskDescription.trim() || "No description provided.",
        status: "not completed",
        assignedToName: taskAssignee,
        projectId: projectId,
        project: selectedProject.name,
        priority: taskPriority,
        dueDate: taskDueDate || "Not Set",
      };


      const data = await addTask(taskData);
      console.log("task data fire", data);
      fetchTask();

      // Clear Form state

      setTaskName("");
      setTaskDescription("");
      setTaskPriority("Medium");
      setTaskDueDate("");
      setToastMessage(`Task assigned successfully to !`);

      // Auto clear toast after 4s
      setTimeout(() => {
        setToastMessage("");
      }, 4000);
    } catch (err) {
      console.error("Error creating and assigning task:", err);
      alert("Failed to assign task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = (taskId) => {
    setTaskToDelete(taskId);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      setLoading(true);
      await deleteTask(taskToDelete);
      fetchTask();
      setToastMessage("Task deleted successfully.");
      setTimeout(() => setToastMessage(""), 3000);
    } catch (err) {
      console.error("Failed to delete task:", err);
    } finally {
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Custom Toast Alert */}
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

      {/* Stunning Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-zinc-950/90 border border-red-500/20 hover:border-red-500/35 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Elegant top red indicator line */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-red-500/10 via-red-500/60 to-red-500/10" />

            <div className="flex flex-col items-center text-center space-y-4">
              {/* Premium Trash Icon with pulse animation background */}
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center animate-pulse">
                <Trash2 size={22} className="stroke-[1.75]" />
              </div>

              {/* Heading & Details */}
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-zinc-100 tracking-tight">Delete Task?</h3>
                <p className="text-[11px] text-zinc-400 leading-relaxed max-w-[240px] mx-auto">
                  This action is permanent and cannot be undone. Are you sure you want to remove this task?
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3 w-full pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setTaskToDelete(null);
                  }}
                  className="flex-1 py-2.5 px-4 bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700/80 text-zinc-300 hover:text-zinc-100 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={confirmDeleteTask}
                  className="flex-1 py-2.5 px-4 bg-red-500/10 hover:bg-red-500 border border-red-500/25 hover:border-red-500 text-red-400 hover:text-white rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Back Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
        <div className="space-y-2">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-xs font-bold text-zinc-400 hover:text-indigo-400 bg-zinc-900/60 hover:bg-indigo-500/10 border border-zinc-800 hover:border-indigo-500/20 py-2 px-4 rounded-xl transition-all duration-300"
          >
            <ArrowLeft size={14} />
            <span>Back to Workspaces</span>
          </button>
          <h1 className="text-3xl font-extrabold text-zinc-100 tracking-tight mt-2 flex items-center gap-3">
            {selectedProject.name}
            <span className="text-xs font-bold px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg">
              {selectedProject.category}
            </span>
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <span className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold border ${selectedProject.status === "Completed"
            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            : selectedProject.status === "Review"
              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
              : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
            }`}>
            {selectedProject.status}
          </span>
        </div>
      </div>

      {/* PROGRESS BAR BANNER */}
      <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-3xl p-6 backdrop-blur-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1 space-y-2">
          <div className="flex justify-between items-center text-sm font-semibold text-zinc-300">
            <span>Overall Milestone Progress</span>
            <span className="text-indigo-400 font-extrabold">{selectedProject.progress}%</span>
          </div>
          <div className="w-full bg-zinc-950 h-3 rounded-full overflow-hidden border border-zinc-800/30">
            <div
              className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${selectedProject.progress}%` }}
            ></div>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-zinc-950/40 border border-zinc-900 py-3 px-5 rounded-2xl">
          <Clock size={16} className="text-zinc-500" />
          <div className="text-left">
            <p className="text-[10px] text-zinc-500 uppercase font-semibold">Due Date</p>
            <p className="text-xs font-bold text-zinc-300">{selectedProject.dueDate || "Not Set"}</p>
          </div>
        </div>
      </div>

      {/* GRID: ABOUT & DIRECTORY (LEFT) VS ASSIGN TASKS (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT 2-COLUMNS: ABOUT & TEAM MEMBERS */}
        <div className="lg:col-span-2 space-y-8">
          {/* WORKSPACE PROFILE */}
          <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-3xl p-6 text-left backdrop-blur-lg space-y-5">
            <h3 className="text-lg font-bold text-zinc-200 border-b border-zinc-800/80 pb-3">Workspace Profile</h3>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-zinc-500 uppercase font-semibold">Description</p>
                <p className="text-sm text-zinc-300 leading-relaxed mt-1">{selectedProject.description}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase font-semibold">Required Technologies</p>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {selectedProject.skills && selectedProject.skills.length > 0 ? (
                      selectedProject.skills.map((s, idx) => (
                        <span key={idx} className="text-[10px] font-bold px-2.5 py-1 bg-zinc-950 border border-zinc-850 text-zinc-400 rounded-lg">
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-zinc-500 italic">None specified</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase font-semibold">Team Limit</p>
                  <p className="text-sm font-bold text-zinc-300 mt-1">
                    {selectedProject.members ? selectedProject.members.length : 0} of {selectedProject.teamSize} members joined
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* TEAM MEMBER DIRECTORY */}
          <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-3xl p-6 text-left backdrop-blur-lg space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <h3 className="text-lg font-bold text-zinc-200">Joined Team Directory</h3>
              <span className="text-xs font-semibold px-2 py-0.5 bg-zinc-950/60 text-zinc-400 border border-zinc-850 rounded">
                {selectedProject.members ? selectedProject.members.length : 0} Registered
              </span>
            </div>

            {!selectedProject.members || selectedProject.members.length === 0 ? (
              <div className="p-8 text-center space-y-3 bg-zinc-950/20 border border-dashed border-zinc-900 rounded-2xl">
                <Users size={28} className="text-zinc-600 mx-auto" />
                <p className="text-xs text-zinc-500">No developer has joined this workspace yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {memberdetails?.map((member) => {

                  return (
                    <div key={member?.uid} className="p-4 bg-zinc-950/30 border border-zinc-900 hover:border-zinc-850 rounded-2xl flex items-center space-x-3.5 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-white text-sm border border-indigo-400/20">
                        {member ? member.role.slice(0, 2).toUpperCase() : "DV"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-zinc-200 truncate">{member ? member.name : "Active Developer"}</p>
                        <p className="text-[10px] text-zinc-500 truncate mt-0.5">{member ? member.email : "Waiting sync..."}</p>
                        <span className="inline-block text-[8px] font-bold px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 text-indigo-400 rounded-md uppercase tracking-wider mt-1.5">
                          {member ? member.role : "Developer"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT 1-COLUMN: ASSIGN TASK FORM */}
        <div className="space-y-8">
          {/* ASSIGN TASK WORKSPACE */}
          <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-3xl p-6 text-left backdrop-blur-lg space-y-5">
            <h3 className="text-lg font-bold text-zinc-200 border-b border-zinc-800/80 pb-3">Assign Sprint Task</h3>

            {!selectedProject.members || selectedProject.members.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-6 leading-relaxed">
                Cannot assign tasks. You must wait for at least one developer to join this workspace first.
              </p>
            ) : (
              <form onSubmit={handleAssignTaskSubmit} className="space-y-4">
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Select Team Member</label>
                  <select
                    value={taskAssignee}
                    onChange={(e) => setTaskAssignee(e.target.value)}
                    className="w-full py-3 px-4 rounded-xl bg-zinc-950 border border-zinc-850 text-zinc-200 outline-none text-xs focus:border-indigo-500/80"
                    required
                  >
                    <option value="">-- Choose Member --</option>
                    {memberdetails.map((member) => {

                      return (
                        <option key={member.uid} value={member.name}>
                          {member ? `${member.name} (${member.role})` : `Developer (${memberId.slice(0, 6)})`}
                        </option>
                      );
                    })}
                  </select>
                </div>


                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Task Title</label>
                  <input
                    type="text"
                    placeholder="Specify task title..."
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    className="w-full py-3 px-4 rounded-xl bg-zinc-950 border border-zinc-850 text-zinc-200 placeholder-zinc-700 outline-none text-xs focus:border-indigo-500/80"
                    required
                  />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Task Description</label>
                  <textarea
                    placeholder="Describe task instructions and details..."
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    rows="2"
                    className="w-full py-3 px-4 rounded-xl bg-zinc-950 border border-zinc-850 text-zinc-200 placeholder-zinc-700 outline-none text-xs resize-none focus:border-indigo-500/80"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Priority</label>
                    <select
                      value={taskPriority}
                      onChange={(e) => setTaskPriority(e.target.value)}
                      className="w-full py-2.5 px-3 rounded-xl bg-zinc-950 border border-zinc-850 text-zinc-200 outline-none text-xs focus:border-indigo-500/80"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Due Date</label>
                    <input
                      type="date"
                      value={taskDueDate}
                      onChange={(e) => setTaskDueDate(e.target.value)}
                      max={selectedProject.dueDate}
                      className="w-full py-2.5 px-3 rounded-xl bg-zinc-950 border border-zinc-850 text-zinc-200 outline-none text-xs focus:border-indigo-500/80"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:brightness-110 active:scale-95 rounded-xl transition-all shadow-lg cursor-pointer flex items-center justify-center space-x-2"
                >
                  <span>Assign Task</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* SECTION: PROJECT SPRINT TASKS FEED */}
      <div className="bg-zinc-900/30 backdrop-blur-lg border border-zinc-800/60 rounded-3xl overflow-hidden shadow-xl shadow-black/20 text-left animate-in slide-in-from-bottom-5 duration-300">
        <div className="p-6 border-b border-zinc-800/60 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-zinc-200">Current Workspace Tasks</h3>
            <p className="text-xs text-zinc-400">Assigned sprint tasks, live status updates, and developer progress.</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-lg">
            {projectTasks.length} Tasks Tracked
          </span>
        </div>

        {projectTasks.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-4 bg-zinc-800/40 border border-zinc-700/60 text-zinc-500 rounded-full">
              <Calendar size={36} />
            </div>
            <div className="space-y-1">
              <p className="text-zinc-300 font-semibold">No tasks assigned yet</p>
              <p className="text-zinc-500 text-xs max-w-sm">Use the assignment form above to designate custom tasks to your project members.</p>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {projectTasks.map((task) => {

                return (
                  <div key={task.tid} className="p-5 bg-zinc-950/40 border border-zinc-900 rounded-2xl hover:border-zinc-800/85 hover:bg-zinc-950/60 transition-all duration-300 flex flex-col justify-between space-y-4 relative overflow-hidden group">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-zinc-200 line-clamp-2 leading-snug group-hover:text-indigo-400 transition-colors duration-200">{task?.title}</h4>
                        <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded border uppercase flex-shrink-0 ${task?.priority === "High"
                          ? "bg-red-500/10 text-red-400 border-red-500/25"
                          : task?.priority === "Low"
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/25"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/25"
                          }`}>
                          {task?.priority || "Medium"}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 line-clamp-3 leading-relaxed">{task?.description}</p>
                    </div>

                    {task?.dueDate && (
                      <div className="flex items-center space-x-1.5 text-[10px] text-zinc-500 -mt-1">
                        <Calendar size={11} className="text-indigo-500/85" />
                        <span className="font-medium text-zinc-400">Due:</span>
                        <span className="text-zinc-300 font-semibold">{task.dueDate}</span>
                      </div>
                    )}

                    <div className="pt-3.5 border-t border-zinc-900 flex items-center justify-between flex-wrap gap-2.5">
                      <div className="flex items-center space-x-2">
                        <div className="w-5.5 h-5.5 rounded-md bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 flex items-center justify-center text-[9px] font-bold uppercase">
                          {"DV"}
                        </div>
                        <span className="text-[10px] text-zinc-400 font-semibold truncate max-w-[100px]">{task ? task.assignedToName : "Team Member"}</span>
                      </div>

                      <div className="flex items-center space-x-4">
                        <span className={`text-[9px] font-bold px-4 py-2 rounded-full border ${task.status === "Completed"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                          : task.status === "not completed"
                            ? "bg-zinc-900 text-zinc-500 border-zinc-800/80"

                            : task.status === "In Progress"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/25"
                              : "bg-indigo-500/10 text-indigo-400 border-indigo-500/25"
                          }`}>
                          {task.status}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTask(task.tid);
                          }}
                          className="p-1 bg-zinc-900/60 hover:bg-red-500/15 border border-zinc-850 hover:border-red-500/30 text-zinc-500 hover:text-red-400 rounded-md transition-colors duration-200 cursor-pointer"
                          title="Delete Task"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectedProjectView;
