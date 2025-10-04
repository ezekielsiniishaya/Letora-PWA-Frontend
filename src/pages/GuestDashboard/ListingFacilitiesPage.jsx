import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { useApartmentCreation } from "../../hooks/useApartmentCreation";

export default function ListingFacilitiesPage() {
  const navigate = useNavigate();
  const { apartmentData, updateFacilities, setCurrentStep } =
    useApartmentCreation();

  const [selectedFacilities, setSelectedFacilities] = useState(
    apartmentData.facilities || []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dropdownRef = useRef(null);

  const facilitiesOptions = [
    {
      label: "Laundry Service",
      value: "LAUNDRY_SERVICE",
      icon: "/icons/laundry.svg",
    },
    {
      label: "Washing Machine",
      value: "WASHING_MACHINE",
      icon: "/icons/washing-machine.svg",
    },
    { label: "Chef Service", value: "CHEF_SERVICE", icon: "/icons/chef.svg" },
    {
      label: "Air conditioning",
      value: "AIR_CONDITIONING",
      icon: "/icons/ac.svg",
    },
    {
      label: "Swimming pool",
      value: "SWIMMING_POOL",
      icon: "/icons/swimming.svg",
    },
    {
      label: "Generator Backup",
      value: "GENERATOR_BACKUP",
      icon: "/icons/generator.svg",
    },
    { label: "Solar", value: "SOLAR", icon: "/icons/solar.svg" },
    { label: "WiFi", value: "WIFI", icon: "/icons/wifi.svg" },
    {
      label: "Play station",
      value: "PLAY_STATION",
      icon: "/icons/playstation.svg",
    },
    { label: "Smart Home", value: "SMART_HOME", icon: "/icons/smart-home.svg" },
    { label: "CCTV", value: "CCTV", icon: "/icons/cctv.svg" },
    { label: "Gym", value: "GYM", icon: "/icons/gym.svg" },
    { label: "DSTV Netflix", value: "DSTV_NETFLIX", icon: "/icons/dstv.svg" },
  ];

  // Custom Dropdown Component
  const FacilityDropdown = () => {
    const [open, setOpen] = useState(false);
    const [tempFacilities, setTempFacilities] = useState(selectedFacilities);

    // Use useCallback to memoize the function
    const applySelections = useCallback(() => {
      setSelectedFacilities(tempFacilities);
      setOpen(false);
    }, [tempFacilities]);

    const toggleDropdown = () => {
      if (!open) {
        setTempFacilities(selectedFacilities);
      }
      setOpen(!open);
    };

    const handleSelectTemp = (facility) => {
      setTempFacilities((prev) => {
        if (prev.some((f) => f.value === facility.value)) {
          return prev.filter((f) => f.value !== facility.value);
        } else {
          return [...prev, facility];
        }
      });
    };

    // commit selections when clicking outside
    useEffect(() => {
      const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
          if (open) {
            applySelections();
          }
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [open, applySelections]); // Now include applySelections in dependencies

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          className="w-full text-left h-[45px] px-3 border border-[#D9D9D9] rounded-md bg-white flex items-center justify-between text-sm text-[#666666] focus:outline-none"
          onClick={toggleDropdown}
        >
          {selectedFacilities.length > 0 ? (
            <span className="text-[14px] ml-2 text-[#686464]">
              {`${selectedFacilities.length} facilities selected`}
            </span>
          ) : (
            <span className="text-[14px] ml-2 text-[#686464]">
              Select multiple Options
            </span>
          )}
        </button>

        {open && (
          <div className="fixed left-0 bottom-0 w-full h-[50%] bg-white border border-[#D9D9D9] rounded-t-[10px] shadow-lg overflow-y-auto z-10">
            <div className="text-[14px] font-medium ml-8 mt-6 text-black py-2">
              Select Choice
            </div>
            {facilitiesOptions.map((facility) => {
              const isSelected = tempFacilities.some(
                (f) => f.value === facility.value
              );
              return (
                <div
                  key={facility.value}
                  className="ml-8 py-5 hover:bg-gray-50 cursor-pointer flex items-center justify-between pr-6"
                  onClick={() => handleSelectTemp(facility)}
                >
                  {/* Left side: icon + label */}
                  <div className="flex items-center gap-2">
                    <img
                      src={facility.icon}
                      alt={facility.label}
                      className="w-5 h-5"
                    />
                    <span className="text-sm text-[#333333]">
                      {facility.label}
                    </span>
                  </div>

                  {/* Circle indicator on the right */}
                  <span
                    className={`w-3 h-3 border rounded-full flex items-center justify-center ${
                      isSelected
                        ? "bg-[#A20BA2] border-2 border-[#A20BA2]"
                        : "border-[#787373] border-2"
                    }`}
                  >
                    {isSelected && (
                      <span className="w-2 h-2 bg-white rounded-full"></span>
                    )}
                  </span>
                </div>
              );
            })}

            {/* Apply Button inside dropdown */}
            <div className="sticky bottom-0 bg-white border-t p-4">
              <button
                type="button"
                onClick={applySelections}
                className="w-full bg-[#A20BA2] text-white py-3 rounded-md font-medium"
              >
                Apply ({tempFacilities.length} selected)
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedFacilities.length === 0) {
      setError("Please select at least one facility");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Save to context
      updateFacilities(selectedFacilities);

      // Update current step
      setCurrentStep(4);

      // Navigate to next step - NO API CALL!
      navigate("/media-upload");
    } catch (err) {
      console.error("Error saving facilities:", err);
      setError("An error occurred while saving facilities");
    } finally {
      setLoading(false);
    }
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

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Form */}
      <div className="flex-1 mt-[80px]">
        <form className="space-y-9" onSubmit={handleSubmit}>
          {/* Facilities Dropdown */}
          <div>
            <label className="block text-sm font-medium text-[#333333] mb-1">
              Facilities & Services <span className="text-red-500">*</span>
            </label>
            <FacilityDropdown />
          </div>

          {/* Selected Facilities Display - This will update when selections are applied */}
          {selectedFacilities.length > 0 && (
            <div className="mt-6">
              <h3 className="text-[16px] font-medium text-[#333333] mb-4">
                Selected Facilities:
              </h3>
              <div className="grid grid-cols-2 gap-x-10 gap-y-3 w-full">
                {selectedFacilities.map((facility, index) => (
                  <div
                    key={facility.value}
                    className={`flex items-center space-x-2 p-3 w-full bg-white rounded-md border ${
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
            </div>
          )}

          {/* Next Button */}
          <div className="pt-[70px] pb-20">
            <Button
              text={loading ? "Saving..." : "Next"}
              type="submit"
              disabled={loading || selectedFacilities.length === 0}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
