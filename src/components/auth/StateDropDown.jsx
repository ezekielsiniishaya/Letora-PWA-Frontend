import { useState, useRef, useEffect } from "react";

export default function StateDropdown() {
  const [selected, setSelected] = useState("");
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

  return (
    <div className="relative mt-[32px] w-full" ref={dropdownRef}>
      <label className="block text-[14px] font-medium text-[#686464] mb-2">
        State of Origin <span className="text-red-500 mr-1">*</span>
      </label>

      <button
        type="button"
        className="w-full h-[48px] border rounded-md px-4 bg-white flex items-center justify-between text-sm text-[#666666]"
        onClick={() => setOpen(!open)}
      >
        {selected || "Select state"}
        <span className="ml-2">&#9662;</span> {/* Down arrow */}
      </button>

      {open && (
        <ul className="absolute z-10 w-full bg-white border rounded-md h-[500px] mt-1 overflow-y-auto shadow-lg">
          {states.map((state) => (
            <li
              key={state}
              className="px-4 py-2 hover:bg-purple-100 cursor-pointer text-[#333333]"
              onClick={() => {
                setSelected(state);
                setOpen(false);
              }}
            >
              {state}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
