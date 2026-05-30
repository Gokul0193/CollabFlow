import React, { useState, useEffect, useRef } from "react";
import { Send, MessageSquare, ShieldAlert, Sparkles, Hash } from "lucide-react";

const TeamChatPanel = ({ project, currentUser, messages = [], onSendMessage }) => {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages whenever they change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (onSendMessage) {
      onSendMessage(project.pid || project.id, inputText.trim());
    }
    setInputText("");
  };

  // Safe fallback mock messages if collection is empty
  const defaultMessages = [
    {
      id: "msg-1",
      senderId: "mock-1",
      senderName: "Sarah Chen",
      text: "Hey everyone! Glad to join the team. I'll get started on the layout components today.",
      timestamp: "10:32 AM",
      role: "Design"
    },
    {
      id: "msg-2",
      senderId: "mock-2",
      senderName: "Alex Rivera",
      text: "Awesome Sarah! Let me know when the Figma designs are updated so I can begin the frontend integrations.",
      timestamp: "10:35 AM",
      role: "Frontend Dev"
    },
    {
      id: "msg-3",
      senderId: "mock-3",
      senderName: "Marcus Vance",
      text: "I am finishing up the OAuth API endpoints. Will push to the backend dev branch soon.",
      timestamp: "11:02 AM",
      role: "Backend Dev"
    }
  ];

  const activeMessages = messages.length > 0 ? messages : defaultMessages;

  // Helper: map roles to styling
  const getSenderColor = (role) => {
    switch (role) {
      case "Frontend Dev":
        return "text-indigo-400";
      case "Backend Dev":
        return "text-violet-400";
      case "Design":
        return "text-pink-400";
      case "SecOps":
        return "text-red-400";
      case "QA Testing":
        return "text-emerald-400";
      default:
        return "text-zinc-400";
    }
  };

  return (
    <div className="bg-[#0f0f13]/60 border border-zinc-800/80 rounded-3xl flex flex-col h-[480px] overflow-hidden backdrop-blur-lg select-none shadow-2xl">
      
      {/* Header Panel */}
      <div className="p-4 border-b border-zinc-800/80 bg-zinc-950/20 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
            <MessageSquare size={16} />
          </div>
          <div className="text-left">
            <div className="flex items-center space-x-1.5">
              <Hash size={13} className="text-zinc-500" />
              <h4 className="text-sm font-bold text-zinc-100">{project?.name} - Team Chat</h4>
            </div>
            <p className="text-[10px] text-zinc-500">Real-time team channel</p>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-850 text-indigo-400 uppercase tracking-wide">
          {project?.category}
        </span>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-0 custom-scrollbar">
        {activeMessages.map((msg) => {
          const isCurrentUser = msg.senderId === currentUser?.uid;
          return (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[80%] ${isCurrentUser ? "ml-auto items-end" : "mr-auto items-start"}`}
            >
              {/* Sender Name & Role */}
              <div className="flex items-center space-x-1.5 text-[10px] font-semibold text-zinc-500 mb-1 px-1">
                <span className={getSenderColor(msg.role)}>{msg.senderName}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              {/* Message text bubble */}
              <div
                className={`py-2.5 px-4 rounded-2xl text-xs leading-relaxed font-medium ${
                  isCurrentUser
                    ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-tr-none shadow-md shadow-indigo-950/20"
                    : "bg-zinc-900/80 border border-zinc-800/50 text-zinc-200 rounded-tl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <form onSubmit={handleSend} className="p-4 border-t border-zinc-800/80 bg-zinc-950/20 flex items-center space-x-2">
        <input
          type="text"
          placeholder={`Message #${project?.name}...`}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-grow py-3 px-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 outline-none text-xs text-zinc-200 focus:bg-zinc-900/90 focus:border-indigo-500/80 transition-all duration-300 placeholder-zinc-600"
        />
        <button
          type="submit"
          className="p-3 bg-gradient-to-r from-indigo-500 to-violet-600 hover:brightness-110 text-white rounded-xl active:scale-95 transition-all shadow-md shadow-indigo-950/20 cursor-pointer flex-shrink-0"
        >
          <Send size={14} />
        </button>
      </form>

    </div>
  );
};

export default TeamChatPanel;
