import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "../../components/Button";

export default function ListingFacilitiesPage() {
  const navigate = useNavigate();
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const dropdownRef = useRef(null);

  const facilitiesOptions = [
    {
      label: "Laundry Service",
      value: "laundry_service",
      icon: "/icons/laundry.svg",
    },
    {
      label: "Washing Machine",
      value: "washing_machine",
      icon: "/icons/washing-machine.svg",
    },
    { label: "Chef Service", value: "chef_service", icon: "/icons/chef.svg" },
    {
      label: "Air conditioning",
      value: "air_conditioning",
      icon: "/icons/ac.svg",
    },
    {
      label: "Swimming pool",
      value: "swimming_pool",
      icon: "/icons/swimming.svg",
    },
    {
      label: "Generator Backup",
      value: "generator_backup",
      icon: "/icons/generator.svg",
    },
    { label: "Solar", value: "solar", icon: "/icons/solar.svg" },
    { label: "WiFi", value: "wifi", icon: "/icons/wifi.svg" },
    {
      label: "Play station",
      value: "play_station",
      icon: "/icons/playstation.svg",
    },
    { label: "Smart Home", value: "smart_home", icon: "/icons/smart-home.svg" },
    { label: "CCTV", value: "cctv", icon: "/icons/cctv.svg" },
    { label: "Gym", value: "gym", icon: "/icons/gym.svg" },
    { label: "DSTW Netflix", value: "dstw_netflix", icon: "/icons/dstv.svg" },
  ];

  // Handle selections from dropdown
  const handleSelectFacility = (facility) => {
    setSelectedFacilities((prev) => {
      let updated;
      if (prev.some((f) => f.value === facility.value)) {
        updated = prev.filter((f) => f.value !== facility.value); // remove
      } else {
        updated = [...prev, facility]; // add
      }
      return updated;
    });
  };

  // Custom Dropdown Component
  const FacilityDropdown = () => {
    const [open, setOpen] = useState(false);

    const toggleDropdown = () => {
      setOpen(!open);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
          setOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          className="w-full text-left h-[45px] px-3 border border-[#D9D9D9] rounded-md bg-white flex items-center justify-between text-sm text-[#666666] focus:outline-none"
          onClick={toggleDropdown}
        >
          {selectedFacilities.length > 0 ? (
            <span className="text-[14px] ml-2 text-[#686464]">{`${selectedFacilities.length} facilities selected`}</span>
          ) : (
            <span className="text-[14px] ml-2 text-[#686464]">
              Select multiple Options
            </span>
          )}
        </button>

        {open && (
          <div className="p-4 z-10 mt-1 w-full bg-white border border-[#D9D9D9] rounded-md shadow-lg overflow-y-auto">
            <div className="text-[14px] ml-2 text-[#686464]">
              Select Facilities & Services
            </div>
            {facilitiesOptions.map((facility) => {
              const isSelected = selectedFacilities.some(
                (f) => f.value === facility.value
              );
              return (
                <div
                  key={facility.value}
                  className="p-3 hover:bg-gray-50 cursor-pointer flex items-center"
                  onClick={() => handleSelectFacility(facility)}
                >
                  <img
                    src={facility.icon}
                    alt={facility.label}
                    className="w-5 h-5 mr-2"
                  />
                  <span className="text-sm text-[#333333]">
                    {facility.label}
                  </span>

                  {/* Circle indicator */}
                  <span
                    className={`ml-auto w-2 h-2 border rounded-full flex items-center justify-center ${
                      isSelected
                        ? "bg-[#A20BA2] border-[#A20BA2]"
                        : "border-[#ccc]"
                    }`}
                  >
                    {isSelected && (
                      <span className="w-1 h-1 bg-white rounded-full"></span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen px-[20px] bg-[#F9F9F9]">
      {/* Top bar */}
      <div className="flex justify-between items-center pt-5">
        <button onClick={() => navigate(-1)}>
          <img src="/icons/arrow-left.svg" alt="Back" className="w-5 h-4" />
        </button>
        <span className="text-[13.2px] font-medium bg-[#A20BA2] text-white px-[6.6px] w-[33px] h-[18.43px] flex items-center justify-center rounded-[7.92px]">
          3/8
        </span>
      </div>

      {/* Heading */}
      <header className="pt-4">
        <h1 className="text-[24px] font-medium text-[#0D1321]">
          Facilities & Services
        </h1>
        <p className="text-[#666666] text-[14px]">
          Tell us what you offer best
        </p>
      </header>

      {/* Form */}
      <div className="flex-1 mt-[80px]">
        <form className="space-y-9">
          {/* Facilities Dropdown */}
          <div>
            <label className="block text-sm font-medium text-[#333333] mb-1">
              Facilities & Services <span className="text-red-500">*</span>
            </label>
            <FacilityDropdown />
          </div>
          {/* Selected Facilities Display */}
          {selectedFacilities.length > 0 && (
            <div className="grid grid-cols-2 gap-x-10 mt-4 w-full">
              {selectedFacilities.map((facility, index) => (
                <div
                  key={facility.value}
                  className={`flex items-center space-x-2 p-3 w-full ${
                    index % 2 === 1 ? "justify-end" : ""
                  }`}
                >
                  <img
                    src={facility.icon}
                    alt={facility.label}
                    className="w-4 h-4 flex-shrink-0"
                  />
                  <span className="text-[11.52px] text-[#505050]">
                    {facility.label}
                  </span>
                </div>
              ))}
            </div>
          )}                 

          {/* Next Button */}
          <div className="pt-[70px] pb-20">
            <Link to="/media-upload">
              <Button text="Next" />
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
