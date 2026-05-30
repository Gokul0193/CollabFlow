import React from "react";
import { X, Sparkles, UserPlus } from "lucide-react";

const JoinProjectModal = ({ isOpen, project, onClose, onConfirm, loading = false }) => {
  if (!isOpen || !project) return null;

  const { name, category, teamSize = 3, members = [] } = project;
  const slotsLeft = teamSize - members.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Glass Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md transition-opacity duration-300"
      ></div>

      {/* Modal Content */}
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800/80 p-6 rounded-3xl shadow-2xl relative z-10 space-y-5 animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center space-x-2 text-indigo-400">
            <Sparkles size={18} className="animate-spin" style={{ animationDuration: "3s" }} />
            <h3 className="text-lg font-bold text-zinc-100">Join Collaborative Sprint</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/60 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Info Area */}
        <div className="space-y-3.5 text-left bg-zinc-950/40 p-4 rounded-2xl border border-zinc-900">
          <p className="text-sm text-zinc-300">
            You are requesting to join <span className="font-bold text-zinc-100">{name}</span> as a team member.
          </p>
          <div className="grid grid-cols-2 gap-3 text-xs pt-1">
            <div className="space-y-1">
              <span className="text-zinc-500 font-medium">Domain / Specialization</span>
              <p className="font-semibold text-indigo-400 uppercase tracking-wide">{category}</p>
            </div>
            <div className="space-y-1">
              <span className="text-zinc-500 font-medium">Available Capacity</span>
              <p className="font-semibold text-zinc-200">{slotsLeft} of {teamSize} slots available</p>
            </div>
          </div>
        </div>

        {/* Terms detail */}
        <p className="text-[10px] text-zinc-500 leading-normal text-left">
          By joining this workspace, you will be allocated tasks matching your domain profile. You will have access to the real-time project channel and team milestones.
        </p>

        {/* Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="py-3 px-5 text-sm font-semibold text-zinc-400 hover:text-zinc-200 bg-zinc-950 hover:bg-zinc-800/40 border border-zinc-800 rounded-xl transition-all cursor-pointer"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={() => onConfirm(project.pid || project.id)}
            className="py-3 px-5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:brightness-110 rounded-xl transition-all shadow-lg flex items-center space-x-1.5 cursor-pointer"
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <>
                <UserPlus size={14} />
                <span>Confirm Join</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default JoinProjectModal;
