// components/dashboard/CurrentLocationDropdown.jsx
import { useState, useRef, useEffect, useContext } from "react";
import { UserContext } from "../../contexts/UserContext";

export default function CurrentLocationDropdown({
  className = "",
  onLocationChange,
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const {
    getUserLocation,
    setUserLocation,
    refreshUser,
    refreshApartmentsByLocation,
  } = useContext(UserContext);

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

      // Refresh apartments for the new location
      await refreshApartmentsByLocation(state);

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
        className="flex items-center justify-center bg-[#1A1A1A] w-[117px] rounded-[40px] h-[25px] mt-[-60px] mb-[40px] mx-auto relative z-10 cursor-pointer hover:bg-[#2A2A2A] transition-colors"
        onClick={() => setOpen(!open)}
      >
        <img
          src="/icons/location-white.svg"
          alt="Location"
          className="w-[9px] h-[12.5px] mr-[7px]"
        />
        <span className="text-[#FFFFFF] text-[11px]">{displayText}</span>
      </div>

      {/* Dropdown Menu */}
      {open && (
        <div className="fixed bottom-0 left-0 w-full bg-white rounded-t-[20px] shadow-lg border-t z-50 max-h-[70vh] overflow-y-auto">
          <div className="sticky top-0 bg-white px-5 py-4 text-[16px] font-medium text-black border-b">
            Select Current Location
            <button
              type="button"
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
          </div>
          <ul className="pb-6">
            {states.map((state) => (
              <li
                key={state}
                className={`px-4 py-3 hover:bg-purple-100 cursor-pointer text-[#333333] transition-colors ${
                  currentLocation?.state === state
                    ? "bg-purple-50 text-purple-600 font-medium"
                    : ""
                }`}
                onClick={() => handleSelect(state)}
              >
                {state}
                {currentLocation?.state === state && (
                  <span className="ml-2 text-purple-500">✓</span>
                )}
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
