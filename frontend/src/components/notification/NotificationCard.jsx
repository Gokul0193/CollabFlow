import React from "react";
import { UserPlus, Users, Sparkles } from "lucide-react";

const NotificationCard = ({ project, onJoin }) => {
  const { name, description = "No description provided.", category, teamSize = 3, members = [], skills = [] } = project;

  const currentMembersCount = members.length;
  const maxMembersAllowed = teamSize;
  const slotsAvailable = maxMembersAllowed - currentMembersCount;
  const isFull = currentMembersCount >= maxMembersAllowed;

  const getDefaultSkills = (cat) => {
    switch (cat) {
      case "Frontend Dev":
        return ["React.js", "Tailwind CSS", "JavaScript"];
      case "Backend Dev":
        return ["Node.js", "Express", "Firestore"];
      case "SecOps":
        return ["OAuth 2.0", "SSL/TLS", "Firebase Auth"];
      case "Design":
        return ["Figma", "UI/UX", "Tailwind"];
      case "QA Testing":
        return ["Jest", "Cypress", "Integration Tests"];
      default:
        return ["Collaboration", "Agile"];
    }
  };

  const projectSkills = skills && skills.length > 0 ? skills : getDefaultSkills(category);

  return (
    <div className="bg-[#0f0f13]/40 border border-zinc-800/80 p-5 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:border-indigo-500/30 hover:bg-[#0f0f13]/80 group relative overflow-hidden select-none shadow-lg">
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-tr from-indigo-500/10 to-violet-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-1.5">
              <Sparkles size={13} className="text-indigo-400 opacity-80" />
              <span className="text-xs font-semibold text-indigo-400/90 tracking-wide uppercase">New Match</span>
            </div>
            <h4 className="text-base font-bold text-zinc-100 group-hover:text-indigo-300 transition-colors tracking-tight line-clamp-1">
              {name}
            </h4>
          </div>
          
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 uppercase tracking-wide">
            {category}
          </span>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2 h-8">
          {description}
        </p>

        <div className="space-y-2">
          <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Required Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {projectSkills.map((skill, idx) => (
              <span
                key={idx}
                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 shadow-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-5 pt-4 border-t border-zinc-900/60">
        <div className="flex items-center space-x-1.5 text-xs font-medium text-zinc-400">
          <Users size={14} className="text-zinc-500" />
          <span>
            {currentMembersCount}/{maxMembersAllowed} Joined
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-zinc-900 border border-zinc-850 text-indigo-400 font-semibold uppercase">
            {slotsAvailable} {slotsAvailable === 1 ? "slot" : "slots"} left
          </span>
        </div>

        {!isFull ? (
          <button
            onClick={() => onJoin(project)}
            className="flex items-center space-x-1.5 py-2 px-3.5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:brightness-110 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-950/20 active:scale-95 transition-all cursor-pointer"
          >
            <UserPlus size={13} />
            <span>Join</span>
          </button>
        ) : (
          <span className="text-xs text-zinc-500 font-semibold px-3 py-2 bg-zinc-900 border border-zinc-850 rounded-xl cursor-not-allowed uppercase tracking-wide">
            Full
          </span>
        )}
      </div>
    </div>
  );
};

export default NotificationCard;
