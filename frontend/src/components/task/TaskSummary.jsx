import React from "react";
import { CheckCircle2, Circle, Clock, CheckSquare, Eye, Zap } from "lucide-react";

const TaskSummary = ({ tasks = [], onUpdateStatus }) => {
  const defaultTasks = [
    {
      id: "task-1",
      title: "Set up Context API for Auth State",
      project: "CollabFlow UX Redesign",
      status: "In Progress",
      dueDate: "2026-06-12",
      priority: "High"
    },
    {
      id: "task-2",
      title: "Implement UI Glassmorphic Cards",
      project: "CollabFlow UX Redesign",
      status: "To Do",
      dueDate: "2026-06-15",
      priority: "Medium"
    },
    {
      id: "task-3",
      title: "Cypress integration pipeline configuration",
      project: "QA Testing Sprint 1",
      status: "Review",
      dueDate: "2026-06-18",
      priority: "Low"
    },
    {
      id: "task-4",
      title: "Draft secure Firestore security guidelines",
      project: "SecOps Sprint 2",
      status: "Completed",
      dueDate: "Completed",
      priority: "High"
    }
  ];

  const displayTasks = tasks.length > 0 ? tasks : defaultTasks;

  const todoTasks = displayTasks.filter(t => t.status === "To Do" || t.status === "nocompleted" || t.status === "todo");
  const inProgressTasks = displayTasks.filter(t => t.status === "In Progress");
  const reviewTasks = displayTasks.filter(t => t.status === "Review");
  const completedTasks = displayTasks.filter(t => t.status === "Completed");

  const handleToggleStatus = (task) => {
    let nextStatus = "To Do";
    if (task.status === "To Do" || task.status === "todo" || task.status === "nocompleted") nextStatus = "In Progress";
    else if (task.status === "In Progress") nextStatus = "Review";
    else if (task.status === "Review") nextStatus = "Completed";
    else if (task.status === "Completed") nextStatus = "To Do";
    
    if (onUpdateStatus) {
      onUpdateStatus(task.id, nextStatus);
    }
  };

  const getPriorityStyle = (priority = "Medium") => {
    switch (priority) {
      case "High":
        return "bg-red-500/10 text-red-400 border border-red-500/20";
      case "Low":
        return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
      case "Medium":
      default:
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
    }
  };

  return (
    <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-3xl p-6 shadow-xl shadow-black/10 select-none backdrop-blur-lg">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 mb-5">
        <div className="flex items-center space-x-2">
          <CheckSquare className="text-indigo-400 animate-bounce" size={18} />
          <h3 className="text-base font-bold text-zinc-200">Interactive Kanban Sprint Board</h3>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-950/60 text-zinc-400 border border-zinc-850">
          Click cards to move columns
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* COLUMN 1: TO DO */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-zinc-950/40 border border-zinc-900">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">To Do</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-zinc-900 text-zinc-500 rounded">{todoTasks.length}</span>
          </div>

          <div className="space-y-2">
            {todoTasks.length === 0 ? (
              <p className="text-[11px] text-zinc-600 text-center py-5 border border-dashed border-zinc-900 rounded-xl">No tasks pending</p>
            ) : (
              todoTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => handleToggleStatus(t)}
                  className="p-3.5 bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-850 hover:border-zinc-700/50 rounded-2xl cursor-pointer transition-all duration-200 group space-y-3 text-left relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-semibold text-zinc-200 leading-normal group-hover:text-indigo-400 transition-colors line-clamp-2">
                      {t.title}
                    </p>
                    <Circle size={13} className="text-zinc-600 mt-0.5 flex-shrink-0" />
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[9px] text-zinc-500 truncate max-w-[80px] font-medium">{t.project}</span>
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${getPriorityStyle(t.priority)}`}>
                      {t.priority || "Medium"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* COLUMN 2: IN PROGRESS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-zinc-950/40 border border-zinc-900">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">In Progress</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-zinc-900 text-amber-500/80 rounded">{inProgressTasks.length}</span>
          </div>

          <div className="space-y-2">
            {inProgressTasks.length === 0 ? (
              <p className="text-[11px] text-zinc-600 text-center py-5 border border-dashed border-zinc-900 rounded-xl">No active sprints</p>
            ) : (
              inProgressTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => handleToggleStatus(t)}
                  className="p-3.5 bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-850 hover:border-zinc-700/50 rounded-2xl cursor-pointer transition-all duration-200 group space-y-3 text-left relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-semibold text-zinc-200 leading-normal group-hover:text-indigo-400 transition-colors line-clamp-2">
                      {t.title}
                    </p>
                    <Clock size={13} className="text-amber-500/85 mt-0.5 flex-shrink-0" />
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[9px] text-zinc-500 truncate max-w-[80px] font-medium">{t.project}</span>
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${getPriorityStyle(t.priority)}`}>
                      {t.priority || "Medium"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* COLUMN 3: REVIEW */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-zinc-950/40 border border-zinc-900">
            <span className="text-[11px] font-bold text-violet-400 uppercase tracking-wider">Review</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-zinc-900 text-violet-500/80 rounded">{reviewTasks.length}</span>
          </div>

          <div className="space-y-2">
            {reviewTasks.length === 0 ? (
              <p className="text-[11px] text-zinc-600 text-center py-5 border border-dashed border-zinc-900 rounded-xl">No tasks in review</p>
            ) : (
              reviewTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => handleToggleStatus(t)}
                  className="p-3.5 bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-850 hover:border-zinc-700/50 rounded-2xl cursor-pointer transition-all duration-200 group space-y-3 text-left relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-semibold text-zinc-200 leading-normal group-hover:text-indigo-400 transition-colors line-clamp-2">
                      {t.title}
                    </p>
                    <Eye size={13} className="text-violet-400 mt-0.5 flex-shrink-0" />
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[9px] text-zinc-500 truncate max-w-[80px] font-medium">{t.project}</span>
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${getPriorityStyle(t.priority)}`}>
                      {t.priority || "Medium"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* COLUMN 4: COMPLETED */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-zinc-950/40 border border-zinc-900">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Completed</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-zinc-900 text-emerald-500/80 rounded">{completedTasks.length}</span>
          </div>

          <div className="space-y-2">
            {completedTasks.length === 0 ? (
              <p className="text-[11px] text-zinc-600 text-center py-5 border border-dashed border-zinc-900 rounded-xl">No completed srpints</p>
            ) : (
              completedTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => handleToggleStatus(t)}
                  className="p-3.5 bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-850 hover:border-zinc-700/50 rounded-2xl cursor-pointer transition-all duration-200 group space-y-3 text-left relative overflow-hidden opacity-75 hover:opacity-100"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-semibold text-zinc-200 line-through leading-normal group-hover:text-indigo-400 transition-colors line-clamp-2">
                      {t.title}
                    </p>
                    <CheckCircle2 size={13} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[9px] text-zinc-500 truncate max-w-[80px] font-medium">{t.project}</span>
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${getPriorityStyle(t.priority)}`}>
                      {t.priority || "Medium"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default TaskSummary;
