import React from "react";
import { UserPlus, CheckCircle2, FolderPlus, MessageSquare, Zap, Clock } from "lucide-react";

const ActivityPanel = ({ activities = [] }) => {
  // Beautiful mock activities to keep UI premium if collection is empty
  const defaultActivities = [
    {
      id: "act-1",
      user: "Alex Rivera",
      action: "joined project",
      target: "CollabFlow Redesign",
      type: "join",
      timestamp: "5 mins ago"
    },
    {
      id: "act-2",
      user: "Sarah Chen",
      action: "completed task",
      target: "Design Figma Components",
      type: "task",
      timestamp: "2 hours ago"
    },
    {
      id: "act-3",
      user: "Marcus Vance",
      action: "created project",
      target: "API Gateway Integration",
      type: "project",
      timestamp: "5 hours ago"
    },
    {
      id: "act-4",
      user: "Gokul K",
      action: "posted a message in",
      target: "QA Testing Sprint 1",
      type: "chat",
      timestamp: "1 day ago"
    }
  ];

  const displayActivities = activities.length > 0 ? activities : defaultActivities;

  // Icon mapping depending on activity type
  const getActivityIcon = (type) => {
    switch (type) {
      case "join":
        return {
          icon: UserPlus,
          class: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
        };
      case "task":
        return {
          icon: CheckCircle2,
          class: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
        };
      case "project":
        return {
          icon: FolderPlus,
          class: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
        };
      case "chat":
        return {
          icon: MessageSquare,
          class: "bg-violet-500/10 text-violet-400 border border-violet-500/20"
        };
      default:
        return {
          icon: Zap,
          class: "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20"
        };
    }
  };

  return (
    <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-3xl p-6 shadow-xl shadow-black/10 select-none backdrop-blur-lg">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 mb-5">
        <div className="space-y-0.5">
          <h3 className="text-base font-bold text-zinc-200">Recent Activity Feed</h3>
          <p className="text-[11px] text-zinc-500">Live collaborative updates across your teams.</p>
        </div>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
        </span>
      </div>

      <div className="space-y-4">
        {displayActivities.map((act) => {
          const item = getActivityIcon(act.type);
          const Icon = item.icon;
          return (
            <div key={act.id} className="flex items-start space-x-3.5 group">
              {/* Event Icon */}
              <div className={`p-2.5 rounded-xl flex-shrink-0 transition-transform duration-300 group-hover:scale-105 ${item.class}`}>
                <Icon size={15} />
              </div>

              {/* Event details */}
              <div className="flex-grow space-y-1 overflow-hidden">
                <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                  <span className="font-semibold text-zinc-200 group-hover:text-indigo-400 transition-colors">
                    {act.user}
                  </span>{" "}
                  {act.action}{" "}
                  <span className="font-semibold text-zinc-200 truncate inline-block max-w-[120px] align-bottom">
                    {act.target}
                  </span>
                </p>
                
                {/* Timeline metadata */}
                <div className="flex items-center space-x-1 text-[10px] text-zinc-500">
                  <Clock size={10} />
                  <span>{act.timestamp}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityPanel;
