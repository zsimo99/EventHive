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
  const [onTop, setOnTop] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  return (
    <div>
      <div className="relative z-0">
        <label
          className={`absolute top-0 -z-10 left-0 transition-all duration-75 ${
            onTop
              ? "-translate-y-1/2 text-fuchsia-600  font-bold text-xs"
              : "translate-y-1/2"
          } ${error && "text-red-600!"}`}
          htmlFor=""
        >
          {label}
        </label>
        <input
          onSelect={() => setOnTop(true)}
          onClick={() => setOnTop(true)}
          onBlur={() => value.length === 0 && setOnTop(false)}
          className={`w-full outline-none border-b border-gray-500 py-2 ps-3 ${
            error && "border-red-600"
          } ${onTop && !error &&  "border-fuchsia-600!"}`}
          type={(type==="password" && showPassword) ? "text" : type}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        {type === "password" && (
          <span className="absolute top-1/2 h-full right-0  cursor-pointer translate-y-[-50%] text-gray-400 p-2" onClick={() => {
            if (type === "password") {
              setShowPassword(!showPassword);
            }
          }}>
            {showPassword ? <IoIosEyeOff size={20} /> : <IoIosEye size={20} />}
          </span>
        )}
      </div>
      <p className="text-red-500">{error}</p>
    </div>
  );
}

export default TextControl;
