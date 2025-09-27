import { useState, useRef, useEffect } from "react";

export default function GenderDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const options = ["Male", "Female"];

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative mt-[32px] w-full" ref={dropdownRef}>
      <label className="block text-[14px] font-medium text-[#686464] mb-2">
        Gender <span className="text-red-500 mr-1">*</span>
      </label>

      <button
        type="button"
        className="w-full h-[48px] border rounded-md bg-white px-4 flex items-center justify-between text-sm text-[#666666]"
        onClick={() => setOpen(!open)}
      >
        {value || "Select your gender"}
        <span className="ml-2">&#9662;</span> {/* Down arrow */}
      </button>

      {open && (
        <ul className="absolute z-10 w-full bg-white border rounded-md h-[100px] mt-1 shadow-lg">
          {options.map((option) => (
            <li
              key={option}
              className="px-4 py-3 hover:bg-purple-100 cursor-pointer text-[#333333]"
              onClick={() => {
                onChange(option); // This now updates the form data
                setOpen(false);
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
