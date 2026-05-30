import React from "react";

const Select = ({ value, onChange, label, roles }) => {
    return (
        <div className="flex flex-col space-y-1.5 w-full">
            {label && (
                <label className="text-xs font-semibold text-zinc-400 tracking-wider uppercase select-none">
                    {label}
                </label>
            )}
            <div className="relative flex items-center group">

                <select
                    value={value}
                    onChange={onChange}
                    className="w-full py-3.5 px-4 rounded-xl bg-zinc-900/40 border border-zinc-800 text-zinc-100 outline-none focus:border-indigo-500/80"
                >
                    <option value="" disabled>Select your role</option>
                    {roles.map((role, idx) => (
                        <option key={idx} value={role}>{role}</option>
                    ))}

                </select>
            </div>
        </div>
    );
}

export default Select;