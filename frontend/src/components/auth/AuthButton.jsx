import React from 'react';

const AuthButton = ({ text, onClick, type = "button", loading = false, icon: Icon, variant = "primary", disabled = false }) => {
  const baseStyles = "w-full flex items-center justify-center space-x-2.5 py-3.5 px-4 rounded-xl font-semibold transition-all duration-300 select-none shadow-lg outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]";
  
  const variants = {
    primary: "bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 text-white shadow-indigo-950/20 hover:shadow-indigo-500/10 hover:brightness-110 border border-indigo-500/30",
    secondary: "bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-100 hover:border-zinc-700 shadow-black/20",
    danger: "bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:border-red-500/40"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]}`}
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <>
          {Icon && <Icon size={19} className="flex-shrink-0" />}
          <span>{text}</span>
        </>
      )}
    </button>
  );
};

export default AuthButton;