"use client";
import React from "react";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";

function TextControl({
  label,
  type,
  value,
  setValue,
  error,
}: {
  label: string;
  type: string;
  value: string;
  setValue: (value: string) => void;
  error: string;
}) {
  const [isFocused, setIsFocused] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const isActive = isFocused || value.length > 0;

  return (
    <div>
      <div className="relative">
        <label
          className={`absolute left-3 transition-all duration-200 pointer-events-none ${
            isActive
              ? "-top-2.5 text-xs px-1 bg-transparent"
              : "top-3 text-base"
          } ${
            error
              ? "text-red-400"
              : isActive
              ? "text-purple-400"
              : "text-gray-400"
          }`}
        >
          {label}
        </label>
        <input
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full bg-white/5 border-2 rounded-xl py-3 px-4 pr-12 text-white placeholder-transparent outline-none transition-all duration-200 ${
            error
              ? "border-red-500 focus:border-red-400"
              : isFocused
              ? "border-purple-500 shadow-lg shadow-purple-500/10"
              : "border-white/20 hover:border-white/30"
          }`}
          type={type === "password" && showPassword ? "text" : type}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={label}
        />
        {type === "password" && (
          <button
            type="button"
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors p-1"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <IoIosEyeOff size={22} /> : <IoIosEye size={22} />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-red-400 text-sm mt-1.5 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

export default TextControl;
