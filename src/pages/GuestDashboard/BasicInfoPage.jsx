// pages/BasicInfoPage.jsx
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import StateDropdown from "../../components/auth/StateDropDown";
import Dropdown from "../../components/dashboard/Dropdown";
import { useApartmentCreation } from "../../hooks/useApartmentCreation";

// Move maps outside the component to make them stable
const apartmentTypeMap = {
  "Self-Con/Studio": "SELF_CON_STUDIO",
  "Mini Flat": "MINI_FLAT",
  "2-bedroom Apartment": "TWO_BEDROOM_APARTMENT",
  "3-bedroom Apartment": "THREE_BEDROOM_APARTMENT",
  "Entire Apartment": "ENTIRE_APARTMENT",
  "BQ/Annex": "BQ_ANNEX",
  Duplex: "DUPLEX",
};

const reverseApartmentTypeMap = {
  SELF_CON_STUDIO: "Self-Con/Studio",
  MINI_FLAT: "Mini Flat",
  TWO_BEDROOM_APARTMENT: "2-bedroom Apartment",
  THREE_BEDROOM_APARTMENT: "3-bedroom Apartment",
  ENTIRE_APARTMENT: "Entire Apartment",
  BQ_ANNEX: "BQ/Annex",
  DUPLEX: "Duplex",
};

const apartmentOptions = [
  { label: "Self-Con/Studio", value: "Self-Con/Studio" },
  { label: "Mini Flat", value: "Mini Flat" },
  { label: "2-bedroom Apartment", value: "2-bedroom Apartment" },
  { label: "3-bedroom Apartment", value: "3-bedroom Apartment" },
  { label: "Entire Apartment", value: "Entire Apartment" },
  { label: "BQ/Annex", value: "BQ/Annex" },
  { label: "Duplex", value: "Duplex" },
];

export default function BasicInfoPage() {
  const navigate = useNavigate();
  const { apartmentData, updateBasicInfo, setCurrentStep } =
    useApartmentCreation();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [loading, setLoading] = useState(false);

  // Initialize form data from context
  const [formData, setFormData] = useState({
    title: "",
    apartmentType: "",
    state: "",
    town: "",
  });

  // Load data from context when component mounts or context changes
  useEffect(() => {
    if (apartmentData.basicInfo) {
      // Convert backend enum to frontend display value for apartmentType
      const frontendApartmentType = apartmentData.basicInfo.apartmentType
        ? reverseApartmentTypeMap[apartmentData.basicInfo.apartmentType] ||
          apartmentData.basicInfo.apartmentType
        : "";

      setFormData({
        title: apartmentData.basicInfo.title || "",
        apartmentType: frontendApartmentType,
        state: apartmentData.basicInfo.state || "",
        town: apartmentData.basicInfo.town || "",
      });
    }
  }, [apartmentData.basicInfo]);

  // Get current selected apartment type for dropdown
  const currentApartmentType = useMemo(() => {
    if (!formData.apartmentType) return null;
    return (
      apartmentOptions.find(
        (option) => option.value === formData.apartmentType
      ) || null
    );
  }, [formData.apartmentType]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApartmentTypeSelect = (selectedOption) => {
    handleInputChange("apartmentType", selectedOption?.value || "");
  };

  const handleStateChange = (value) => {
    handleInputChange("state", value);
    // Reset town when state changes
    handleInputChange("town", "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.title ||
      !formData.apartmentType ||
      !formData.state ||
      !formData.town
    ) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      // Convert frontend values to backend enum values
      const backendData = {
        title: formData.title,
        apartmentType:
          apartmentTypeMap[formData.apartmentType] || formData.apartmentType,
        state: formData.state,
        town: formData.town,
      };

      console.log("Saving basic info:", backendData);

      // Save to context
      updateBasicInfo(backendData);

      // Update current step
      setCurrentStep(2);

      // Navigate to next step
      navigate("/listing-apartment-details");
    } catch (error) {
      console.error("Error saving basic info:", error);
      alert("Failed to save information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Debug logging
  useEffect(() => {
    console.log("Current formData:", formData);
    console.log("Context apartmentData:", apartmentData.basicInfo);
  }, [formData, apartmentData.basicInfo]);

  return (
    <div className="flex flex-col min-h-screen bg-[#F9F9F9] px-[20px]">
      {/* Top bar */}
      <div className="flex justify-between items-center mt-5">
        <button onClick={() => navigate(-1)}>
          <img src="/icons/arrow-left.svg" alt="Back" className="w-5 h-4" />
        </button>
        <span className="text-[13.2px] font-medium bg-[#A20BA2] text-white px-[6.6px] w-[33px] h-[18.43px] flex items-center justify-center rounded-[7.92px]">
          1/8
        </span>
      </div>

      {/* Heading */}
      <header className="pt-4">
        <h1 className="text-[24px] font-medium text-[#0D1321]">Basic Info</h1>
        <p className="text-[#666666] text-[14px]">
          Let's start with some basic details
        </p>
      </header>

      {/* Form */}
      <div className="w-full max-w-sm">
        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Listing Title */}
          <div>
            <label className="block text-[14px] font-medium text-[#333333] mt-[42px]">
              Listing Title<span className="text-red-500 mr-1">*</span>
            </label>
            <input
              placeholder="Enter befitting title"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="border mt-[8px] w-full h-[48px] bg-white rounded-md px-4 py-2 text-sm"
              required
            />
          </div>

          {/* Apartment Type */}
          <Dropdown
            label="Apartment Type"
            placeholder="Choose Options"
            heading="Select Apartment Type"
            options={apartmentOptions}
            selected={currentApartmentType}
            setSelected={handleApartmentTypeSelect}
            required
            isOpen={openDropdown === "apartment"}
            onToggle={() =>
              setOpenDropdown(openDropdown === "apartment" ? null : "apartment")
            }
          />

          {/* State */}
          <div>
            <StateDropdown
              color="#333333"
              label="State"
              placeholder="Choose Location"
              value={formData.state}
              onChange={handleStateChange}
            />
          </div>

          {/* Town */}
          <div>
            <label className="block text-[14px] font-medium text-[#333333] mt-[32px]">
              Town<span className="text-red-500 mr-1">*</span>
            </label>
            <input
              placeholder="Enter town"
              type="text"
              value={formData.town}
              onChange={(e) => handleInputChange("town", e.target.value)}
              className="border mt-[8px] w-full h-[48px] bg-white rounded-md px-4 mb-20 py-2 text-sm"
              required
            />
          </div>

          {/* Next button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#A20BA2] text-white text-[16px] font-semibold h-[57px] py-3 rounded-md disabled:opacity-50"
          >
            {loading ? "Saving..." : "Next"}
          </button>
        </form>
      </div>
    </div>
  );
}
