import { useState, useRef, useEffect } from "react";

export default function StateDropdown({
  label = "State of Origin",
  placeholder = "Select state",
  required = true,
  onChange,
  value = "", // Add value prop to receive selected value from parent
  color = "#686464",
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const states = [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
    "FCT",
  ];

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

  const handleSelect = (state) => {
    setOpen(false);
    if (onChange) onChange(state); // pass selection back to parent
  };

  return (
    <div className="relative mt-[32px] w-full" ref={dropdownRef}>
      <label
        className="block text-[14px] font-medium mb-2"
        style={{ color: color }}
      >
        {label} {required && <span className="text-red-500 mr-1">*</span>}
      </label>

      <button
        type="button"
        className="w-full h-[48px] border rounded-md px-4 bg-white flex items-center justify-between text-sm text-[#666666]"
        onClick={() => setOpen(!open)}
      >
        {value || placeholder} {/* Use value prop instead of internal state */}
        <span className="ml-2">&#9662;</span> {/* Down arrow */}
      </button>

      {open && (
        <div className="fixed bottom-0 left-0 w-full bg-white rounded-t-[20px] shadow-lg border-t z-50 max-h-[70vh] overflow-y-auto">
          <div className="px-5 py-4 text-[16px] font-medium text-black">
            Select State
          </div>
          <ul>
            {states.map((state) => (
              <li
                key={state}
                className="px-4 py-3 hover:bg-purple-100 cursor-pointer text-[#333333]"
                onClick={() => handleSelect(state)}
              >
                {state}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
