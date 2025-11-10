import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { useApartmentCreation } from "../../hooks/useApartmentCreation";

export default function HouseRulesPage() {
  const navigate = useNavigate();
  const { apartmentData, updateHouseRules, setCurrentStep } =
    useApartmentCreation();

  const dropdownRef = useRef(null);
  const [selectedRules, setSelectedRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const houseRulesOptions = [
    { label: "No Smoking", value: "NO_SMOKING", icon: "/icons/no-smoking.svg" },
    {
      label: "Smoking Allowed",
      value: "SMOKING_ALLOWED",
      icon: "/icons/smoking.svg",
    },
    {
      label: "Flush Properly",
      value: "FLUSH_PROPERLY",
      icon: "/icons/flush.svg",
    },
    {
      label: "Dispose Waste Properly",
      value: "DISPOSE_WASTE_PROPERLY",
      icon: "/icons/dispose.svg",
    },
    {
      label: "Partying Allowed",
      value: "PARTYING_ALLOWED",
      icon: "/icons/party.svg",
    },
    {
      label: "No Pets Allowed",
      value: "NO_PETS_ALLOWED",
      icon: "/icons/no-pets.svg",
    },
    { label: "Pets Allowed", value: "PETS_ALLOWED", icon: "/icons/pets.svg" },
    { label: "No Crowd", value: "NO_CROWD", icon: "/icons/crowd.svg" },
    {
      label: "No Damage to Properties",
      value: "NO_DAMAGE_TO_PROPERTIES",
      icon: "/icons/no-damage.svg",
    },
    { label: "Kids Allowed", value: "KIDS_ALLOWED", icon: "/icons/kids.svg" },
  ];

  // Make mapping tolerant to different shapes
  const mapExistingRules = (rules) => {
    if (!rules || !Array.isArray(rules)) return [];

    return rules.map((rule) => {
      // Already full rule object (from context)
      if (rule && rule.label && rule.icon && rule.value) return rule;

      // extract a canonical key we can compare to options
      const key =
        (typeof rule === "string" && rule) ||
        (rule && (rule.value || rule.name)) ||
        null;

      const full = houseRulesOptions.find((opt) => opt.value === key);

      if (full) return full;

      // fallback to a minimal shape using whatever key we derived
      return {
        value: key || (rule && rule.value) || JSON.stringify(rule),
        label: key || (rule && rule.value) || "Unknown rule",
        icon: "/icons/default-facility.svg",
      };
    });
  };

  // init and keep in sync with context
  useEffect(() => {
    setSelectedRules(mapExistingRules(apartmentData.houseRules));
  }, [apartmentData.houseRules]);

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (selectedRules.length === 0) {
      newErrors.houseRules = "Please select at least one house rule";
    }

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      // Validate form
      const isValid = validateForm();
      if (!isValid) {
        console.log("Validation errors:", fieldErrors);
        setLoading(false);
        return;
      }

      updateHouseRules(selectedRules);
      setCurrentStep(8);
      // Navigate to next step WITH role and documents data
      navigate("/upload-legals", {
        state: {
          role: apartmentData.legalDocuments?.role, // Pre-existing role if any
          documents: apartmentData.legalDocuments?.documents, // Pre-existing documents if any
        },
      });
    } catch (err) {
      console.error("Error saving house rules:", err);
      setError("An error occurred while saving house rules");
    } finally {
      setLoading(false);
    }
  };

  // Dropdown component
  const HouseRulesDropdown = () => {
    const [open, setOpen] = useState(false);
    const [tempRules, setTempRules] = useState(selectedRules);

    const applySelections = useCallback(() => {
      setSelectedRules(tempRules);
      setOpen(false);
      // Clear error when user selects rules
      if (fieldErrors.houseRules) {
        setFieldErrors((prev) => ({ ...prev, houseRules: "" }));
      }
      // Clear general error
      if (error) setError("");
    }, [tempRules, fieldErrors.houseRules, error]);

    const toggleDropdown = () => {
      if (!open) setTempRules(selectedRules);
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

    useEffect(() => {
      const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
          if (open) applySelections();
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [open, applySelections]);

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          className={`w-full text-left h-[45px] px-3 border rounded-md bg-white flex items-center justify-between text-sm text-[#666666] focus:outline-none ${
            fieldErrors.houseRules ? "border-[#F81A0C]" : "border-[#D9D9D9]"
          }`}
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
        {fieldErrors.houseRules && (
          <p className="text-[#F81A0C] text-[10px] mt-1">
            {fieldErrors.houseRules}
          </p>
        )}

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
                  <div className="flex items-center gap-2">
                    <img
                      src={rule.icon}
                      alt={rule.label}
                      className="w-5 h-5"
                      onError={(e) =>
                        (e.target.src = "/icons/default-facility.svg")
                      }
                    />
                    <span className="text-sm text-[#333333]">{rule.label}</span>
                  </div>

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

            <div className="sticky bottom-0 bg-white border-t p-4">
              <button
                type="button"
                onClick={applySelections}
                className="w-full bg-[#A20BA2] text-white py-3 rounded-md font-medium"
              >
                Apply ({tempRules.length} selected)
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen px-[20px] bg-[#F9F9F9]">
      <div className="flex justify-between items-center pt-5">
        <button onClick={() => navigate(-1)}>
          <img src="/icons/arrow-left.svg" alt="Back" className="w-5 h-4" />
        </button>
        <span className="text-[13.2px] font-medium bg-[#A20BA2] text-white px-[6.6px] w-[33px] h-[18.43px] flex items-center justify-center rounded-[7.92px]">
          7/8
        </span>
      </div>

      <header className="pt-4">
        <h1 className="text-[24px] font-medium text-[#0D1321]">House Rules</h1>
        <p className="text-[#666666] text-[14px]">Your Apartment, Your Rules</p>
      </header>

      {/* Error Message */}
      {error && (
        <div className="mt-4 mx-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <div className="flex items-center">
              <img
                src="/icons/error.svg"
                alt="Error"
                className="w-4 h-4 mr-2"
              />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 mt-[80px]">
        <form className="space-y-9" onSubmit={handleSubmit} noValidate>
          <div>
            <label className="block text-sm font-medium text-[#333333] mb-1">
              House Rules <span className="text-red-500">*</span>
            </label>
            <HouseRulesDropdown />
          </div>

          {/* Selected Rules Display */}
          {selectedRules.length > 0 && (
            <div className="mt-6">
              <h3 className="text-[16px] font-medium text-[#333333] mb-4">
                Selected House Rules:
              </h3>
              <div className="grid grid-cols-2 gap-x-10 gap-y-3 w-full">
                {selectedRules.map((rule, index) => (
                  <div
                    key={rule.value}
                    className={`flex items-center space-x-2 p-3 w-full ${
                      index % 2 === 1 ? "justify-end" : ""
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <img
                        src={rule.icon}
                        alt={rule.label}
                        className="w-4 h-4 flex-shrink-0"
                        onError={(e) => {
                          e.target.src = "/icons/default-facility.svg";
                        }}
                      />
                      <span className="text-[11.52px] text-[#505050] whitespace-nowrap">
                        {rule.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="pt-[70px] pb-20">
            <Button
              text={loading ? "Saving..." : "Next"}
              type="submit"
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
