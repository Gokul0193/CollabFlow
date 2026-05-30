import React from "react";
import { FolderGit2, Calendar, Users, ArrowUpRight } from "lucide-react";

const ProjectCard = ({ project, onOpen }) => {
  const { name, description = "No description provided.", category, progress = 0, teamSize = 4, status = "Active", dueDate = "Not Set", members = [] } = project;

  // Render correct color theme for status badges
  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "Pending":
      case "Proactive":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case "Active":
      default:
        return "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20";
    }
  };

  // Safe team display size
  const currentMembersCount = members.length;
  const maxMembersAllowed = teamSize;

  return (
    <div className="bg-zinc-900/40 hover:bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700/60 p-5 rounded-2xl flex flex-col justify-between transition-all duration-300 group shadow-md shadow-black/10 select-none">
      
      {/* Top Details */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-zinc-100 group-hover:text-indigo-400 transition-colors truncate max-w-[200px]">
              {name}
            </h4>
            <span className="inline-flex text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 bg-zinc-850/80 border border-zinc-800 rounded-md text-indigo-400">
              {category}
            </span>
          </div>
          
          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadge(status)}`}>
            {status}
          </span>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2 h-8">
          {description}
        </p>
      </div>

      {/* Mid Section: Statistics & Progress */}
      <div className="space-y-4 pt-4 border-t border-zinc-900/60 mt-4">
        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-500">
            <span>Milestone Progress</span>
            <span className="text-zinc-300">{progress}%</span>
          </div>
          <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-zinc-900/50">
            <div
              className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Members and due date details */}
        <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
          {/* Members Avatars */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center -space-x-1.5 select-none">
              {[...Array(Math.min(currentMembersCount || 1, 4))].map((_, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full border border-zinc-900 flex items-center justify-center text-[9px] font-bold text-white bg-indigo-500"
                  style={{
                    backgroundColor: i === 0 ? "#6366f1" : i === 1 ? "#8b5cf6" : i === 2 ? "#06b6d4" : "#10b981"
                  }}
                >
                  {String.fromCharCode(65 + i * 2)}
                </div>
              ))}
              {currentMembersCount > 4 && (
                <div className="w-6 h-6 rounded-full border border-zinc-900 flex items-center justify-center text-[9px] font-bold bg-zinc-800 text-zinc-400">
                  +{currentMembersCount - 4}
                </div>
              )}
            </div>
            <span className="text-[11px] text-zinc-500 font-medium">
              {currentMembersCount}/{maxMembersAllowed} Team
            </span>
          </div>

          {/* Due date */}
          <div className="flex items-center space-x-1 text-zinc-500">
            <Calendar size={13} />
            <span className="text-[11px]">{dueDate}</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => onOpen(project)}
        className="w-full flex items-center justify-center space-x-2.5 mt-5 py-2.5 bg-zinc-900/60 hover:bg-indigo-500/10 border border-zinc-800 hover:border-indigo-500/25 text-zinc-300 hover:text-indigo-400 rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer shadow-sm group-hover:shadow-indigo-950/20"
      >
        <span>Open Project</span>
        <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </button>

    </div>
  );
};

export default ProjectCard;
