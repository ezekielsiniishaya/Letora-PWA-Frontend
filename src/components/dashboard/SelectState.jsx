// components/dashboard/CurrentLocationDropdown.jsx
import { useState, useRef, useEffect, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";

export default function CurrentLocationDropdown({
  className = "",
  onLocationChange,
  triggerBgColor = "bg-[#5F065F]", // Default purple, can be overridden via props
  selectedBgColor = "bg-purple-50", // Background for selected state in dropdown
  selectedTextColor = "text-[#8C068C]", // Text color for selected state
  hoverBgColor = "hover:bg-purple-100", // Hover background for dropdown items
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { getUserLocation, setUserLocation, refreshUser } =
    useContext(UserContext);

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

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = async (state) => {
    setOpen(false);

    // Create location object
    const location = { state, town: null };

    try {
      console.log("📍 Setting new location and refreshing data...");

      // Save to UserContext and localStorage
      setUserLocation(location);

      // Refresh user data with new location
      await refreshUser();

      console.log("✅ Location saved and data refreshed");

      // Notify parent component about location change
      if (onLocationChange) {
        onLocationChange(location);
      }
    } catch (error) {
      console.error("❌ Failed to refresh data with new location:", error);
    }
  };

  const currentLocation = getUserLocation();
  const displayText = currentLocation?.state || "Select Location";

  return (
    <div
      className={`flex flex-col items-center ${className}`}
      ref={dropdownRef}
    >
      {/* Location Trigger Button */}
      <div
        className={`flex justify-center ${triggerBgColor} w-[117px] rounded-[40px] h-[25px] mt-[-60px] mb-[40px] mx-auto relative z-10 cursor-pointer hover:bg-[#2A2A2A] transition-colors py-[5px] px-[12px]`}
        onClick={() => setOpen(!open)}
      >
        <img
          src="/icons/location-white.svg"
          alt="Location"
          className="w-[9px] h-[13.5px]"
        />
        <span className="text-[#FFFFFF] text-[11px] ml-[7px] leading-none align-middle">
          {displayText}
        </span>
      </div>
      {/* Dropdown Menu */}
      {open && (
        <div className="fixed bottom-0 left-0 w-full bg-white rounded-t-[20px] shadow-lg border-t z-50 max-h-[70vh] overflow-y-auto">
          <div className="sticky top-0 bg-white px-5 py-4 text-[16px] font-medium text-black border-b">
            Select Current Location
          </div>
          <ul className="pb-6">
            {states.map((state) => (
              <li
                key={state}
                className={`px-4 py-3 ${hoverBgColor} cursor-pointer text-[#333333] transition-colors ${
                  currentLocation?.state === state
                    ? `${selectedBgColor} ${selectedTextColor} font-medium`
                    : ""
                }`}
                onClick={() => handleSelect(state)}
              >
                {state}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
}
