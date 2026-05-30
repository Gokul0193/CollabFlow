import React from 'react';

const InputField = ({ type, placeholder, value, onChange, icon: Icon, required = false, label }) => {
  return (
    <div className="flex flex-col space-y-1.5 w-full">
      {label && (
        <label className="text-xs font-semibold text-zinc-400 tracking-wider uppercase select-none">
          {label}
        </label>
      )}
      <div className="relative flex items-center group">
        {Icon && (
          <div className="absolute left-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors duration-300 pointer-events-none">
            <Icon size={19} strokeWidth={1.8} />
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full py-3.5 ${Icon ? 'pl-11' : 'pl-4'
            } pr-4 rounded-xl bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 text-zinc-100 placeholder-zinc-500 outline-none transition-all duration-300 hover:border-zinc-700/80 focus:border-indigo-500/80 focus:bg-zinc-950/60 focus:ring-4 focus:ring-indigo-950/50`}
        />
      </div>
    </div>
  );
};

export default InputField;