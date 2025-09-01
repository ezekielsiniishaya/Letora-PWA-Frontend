import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "../../components/Button";

export default function HouseRulesPage() {
  const navigate = useNavigate();
  const [selectedRules, setSelectedRules] = useState([]);
  const dropdownRef = useRef(null);

  const houseRulesOptions = [
    { label: "No Smoking", value: "no_smoking", icon: "/icons/no-smoking.svg" },
    {
      label: "Smoking Allowed",
      value: "smoking_allowed",
      icon: "/icons/smoking.svg",
    },
    {
      label: "Flush Properly",
      value: "flush_properly",
      icon: "/icons/flush.svg",
    },
    {
      label: "Dispose Wastes Properly",
      value: "dispose_wastes_properly",
      icon: "/icons/dispose.svg",
    },
    {
      label: "No Loud Music/Partying",
      value: "no_loud_music_partying",
      icon: "/icons/no-music.svg",
    },
    {
      label: "Partying Allowed",
      value: "partying_allowed",
      icon: "/icons/party.svg",
    },
    {
      label: "No Pets allowed",
      value: "no_pets_allowed",
      icon: "/icons/no-pets.svg",
    },
    { label: "Pets allowed", value: "pets_allowed", icon: "/icons/pets.svg" },
    { label: "No Crowds", value: "no_crowds", icon: "/icons/crowd.svg" },
    {
      label: "No Damage to Properties",
      value: "no_damage_to_properties",
      icon: "/icons/no-damage.svg",
    },
    {
      label: "Kids are Allowed",
      value: "kids_allowed",
      icon: "/icons/kids.svg",
    },
  ];

  // Custom Dropdown Component
  const HouseRulesDropdown = () => {
    const [open, setOpen] = useState(false);
    const [tempRules, setTempRules] = useState(selectedRules);

    const toggleDropdown = () => {
      if (!open) {
        setTempRules(selectedRules); // sync selections
      }
      setOpen(!open);
    };

    const handleSelectTemp = (rule) => {
      setTempRules((prev) => {
        if (prev.some((r) => r.value === rule.value)) {
          return prev.filter((r) => r.value !== rule.value);
        } else {
          return [...prev, rule];
        }
      });
    };

    // Commit on outside click
    useEffect(() => {
      const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
          if (open) {
            setSelectedRules(tempRules);
            setOpen(false);
          }
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [open, tempRules]);

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          className="w-full text-left h-[45px] px-3 border border-[#D9D9D9] rounded-md bg-white flex items-center justify-between text-sm text-[#666666] focus:outline-none"
          onClick={toggleDropdown}
        >
          {selectedRules.length > 0 ? (
            <span className="text-[14px] ml-2 text-[#686464]">
              {`${selectedRules.length} rules selected`}
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
            {houseRulesOptions.map((rule) => {
              const isSelected = tempRules.some((r) => r.value === rule.value);
              return (
                <div
                  key={rule.value}
                  className="ml-8 py-5 hover:bg-gray-50 cursor-pointer flex items-center justify-between pr-6"
                  onClick={() => handleSelectTemp(rule)}
                >
                  {/* Left side: icon + label */}
                  <div className="flex items-center gap-2">
                    <img src={rule.icon} alt={rule.label} className="w-5 h-5" />
                    <span className="text-sm text-[#333333]">{rule.label}</span>
                  </div>

                  {/* Circle indicator */}
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
          7/8
        </span>
      </div>

      {/* Heading */}
      <header className="pt-4">
        <h1 className="text-[24px] font-medium text-[#0D1321]">House Rules</h1>
        <p className="text-[#666666] text-[14px]">Your Apartment, Your Rules</p>
      </header>

      {/* Form */}
      <div className="flex-1 mt-[80px]">
        <form className="space-y-9">
          {/* House Rules Dropdown */}
          <div>
            <label className="block text-sm font-medium text-[#333333] mb-1">
              House Rules <span className="text-red-500">*</span>
            </label>
            <HouseRulesDropdown />
          </div>

          {/* Selected Rules Display */}
          {selectedRules.length > 0 && (
            <div className="grid grid-cols-2 gap-x-10 mt-4 w-full">
              {selectedRules.map((rule, index) => (
                <div
                  key={rule.value}
                  className={`flex items-center space-x-2 p-3 w-full ${
                    index % 2 === 1 ? "justify-end" : ""
                  }`}
                >
                  <img
                    src={rule.icon}
                    alt={rule.label}
                    className="w-4 h-4 flex-shrink-0"
                  />
                  <span className="text-[11.52px] text-[#505050]">
                    {rule.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Next Button */}
          <div className="pt-[70px] pb-20">
            <Link to="/upload-legals">
              <Button text="Next" />
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
