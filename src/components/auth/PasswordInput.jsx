import React, { useState } from "react";

export default function PasswordInput({
  label,
  value,
  onChange,
  disabled = false,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isValid = value.length >= 6; // Changed to 6 characters to match your backend requirement

  return (
    <div className="relative w-full mt-2">
      <label className="block text-[14px] font-medium text-[#333333] mb-1">
        {label}
      </label>

      <div
        className={`flex items-center border rounded-md bg-white h-[48px] px-3 ${
          disabled ? "opacity-50" : ""
        }`}
      >
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="flex-1 h-full outline-none text-sm bg-transparent disabled:cursor-not-allowed"
          placeholder="Enter your password"
        />
        <button
          type="button"
          className={`ml-2 text-gray-500 hover:text-gray-700 ${
            disabled ? "cursor-not-allowed opacity-50" : ""
          }`}
          onClick={() => !disabled && setShowPassword((prev) => !prev)}
          disabled={disabled}
        >
          {showPassword ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 012.477-4.223M6.228 6.228A9.97 9.97 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.97 9.97 0 01-4.132 5.411M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L9.88 9.88"
              />
            </svg>
          )}
        </button>
      </div>

      {!isValid && value.length > 0 && (
        <p className="mt-2 text-[12px] text-[#999999]">
          - minimum 6 characters
        </p>
      )}
    </div>
  );
}
