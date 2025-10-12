// pages/BasicInfoPage.jsx
import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StateDropdown from "../../components/auth/StateDropDown";
import Dropdown from "../../components/dashboard/Dropdown";
import { useApartmentCreation } from "../../hooks/useApartmentCreation";
import { getApartmentById } from "../../services/apartmentApi";
import { apartmentTypeMap } from "../../components/utils/mapping";

// Create reverse mapping for display - FIXED VERSION
const reverseApartmentTypeMap = Object.entries(apartmentTypeMap).reduce(
  (acc, [enumKey, displayValue]) => {
    acc[enumKey] = displayValue; // Map enum key to display value
    return acc;
  },
  {}
);

// Create options for dropdown using the centralized mapping
const apartmentOptions = Object.values(apartmentTypeMap).map((value) => ({
  label: value,
  value: value,
}));

export default function BasicInfoPage() {
  const navigate = useNavigate();
  const { apartmentId } = useParams();
  const {
    apartmentData,
    updateBasicInfo,
    setCurrentStep,
    loadExistingApartment,
    isEditing,
  } = useApartmentCreation();

  const [openDropdown, setOpenDropdown] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(!!apartmentId);
  const [hasFetched, setHasFetched] = useState(false);
  const [error, setError] = useState("");

  // Initialize form data from context
  const [formData, setFormData] = useState({
    title: "",
    apartmentType: "",
    state: "",
    town: "",
  });

  // Load existing apartment data when ID is present in URL
  useEffect(() => {
    const fetchExistingApartment = async () => {
      if (!apartmentId || hasFetched) return;

      try {
        setPageLoading(true);
        setError("");
        console.log("Fetching apartment with ID:", apartmentId);
        const response = await getApartmentById(apartmentId);
        const existingApartment = response.data;
        console.log("Fetched apartment:", existingApartment);
        console.log(
          "Apartment type from API:",
          existingApartment.apartmentType
        );
        console.log(
          "Reverse mapping result:",
          reverseApartmentTypeMap[existingApartment.apartmentType]
        );

        // Transform API data to match context structure
        const transformedApartment = {
          basicInfo: {
            title: existingApartment.title,
            apartmentType: existingApartment.apartmentType, // Keep as enum for context
            state: existingApartment.state,
            town: existingApartment.town,
          },
          details: {
            bedrooms: existingApartment.details?.bedrooms,
            bathrooms: existingApartment.details?.bathrooms,
            electricity: existingApartment.details?.electricity,
            guestNumber: existingApartment.details?.guestNumber,
            parkingSpace: existingApartment.details?.parkingSpace,
            kitchenSize: existingApartment.details?.kitchenSize,
            description: existingApartment.details?.description,
          },
          facilities:
            existingApartment.facilities?.map((facility) => ({
              value: facility.name,
            })) || [],
          houseRules:
            existingApartment.houseRules?.map((rule) => ({
              value: rule.rule,
            })) || [],
          images: existingApartment.images || [],
          pricing: {
            pricePerNight: existingApartment.price,
          },
          securityDeposit: existingApartment.securityDeposit || {},
          legalDocuments: {
            role: existingApartment.documents?.[0]?.role || "",
            documents: existingApartment.documents || [],
          },
        };

        // Load the existing apartment into context with editing mode
        loadExistingApartment(apartmentId, transformedApartment);
        setHasFetched(true);
      } catch (error) {
        console.error("Error loading apartment:", error);
        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to load apartment data. Please try again."
        );
      } finally {
        setPageLoading(false);
      }
    };

    fetchExistingApartment();
  }, [apartmentId, hasFetched, loadExistingApartment]);

  // Load data from context when component mounts or context changes
  useEffect(() => {
    if (apartmentData.basicInfo) {
      console.log("Context apartmentData:", apartmentData.basicInfo);

      // Convert backend enum to frontend display value for apartmentType
      const frontendApartmentType = apartmentData.basicInfo.apartmentType
        ? reverseApartmentTypeMap[apartmentData.basicInfo.apartmentType] || ""
        : "";

      console.log("Converted apartment type:", frontendApartmentType);

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
    console.log("Current form apartment type:", formData.apartmentType);
    if (!formData.apartmentType) return null;
    const found = apartmentOptions.find(
      (option) => option.value === formData.apartmentType
    );
    console.log("Found dropdown option:", found);
    return found || null;
  }, [formData.apartmentType]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleApartmentTypeSelect = (selectedOption) => {
    console.log("Apartment type selected:", selectedOption);
    handleInputChange("apartmentType", selectedOption?.value || "");
  };

  const handleStateChange = (value) => {
    console.log("State selected:", value);
    handleInputChange("state", value);
    // Reset town when state changes
    handleInputChange("town", "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Debug: Check current form values
    console.log("Form data before validation:", formData);
    console.log("Required fields check:", {
      title: !!formData.title,
      apartmentType: !!formData.apartmentType,
      state: !!formData.state,
      town: !!formData.town,
    });

    // Enhanced validation with better error messages
    const missingFields = [];
    if (!formData.title?.trim()) missingFields.push("Listing Title");
    if (!formData.apartmentType?.trim()) missingFields.push("Apartment Type");
    if (!formData.state?.trim()) missingFields.push("State");
    if (!formData.town?.trim()) missingFields.push("Town");

    if (missingFields.length > 0) {
      setError(
        `Please fill in the following required fields: ${missingFields.join(
          ", "
        )}`
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Convert frontend display value to backend enum value
      const backendApartmentType =
        Object.keys(apartmentTypeMap).find(
          (key) => apartmentTypeMap[key] === formData.apartmentType
        ) || formData.apartmentType;

      console.log("Converted backend apartment type:", backendApartmentType);

      const backendData = {
        title: formData.title.trim(),
        apartmentType: backendApartmentType,
        state: formData.state.trim(),
        town: formData.town.trim(),
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
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to save information. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Show loading while fetching apartment data
  if (pageLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F9F9F9] px-[20px] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A20BA2] mx-auto"></div>
          <p className="mt-4 text-[#666666]">Loading apartment data...</p>
        </div>
      </div>
    );
  }

  // Show error state if failed to load apartment
  if (error && apartmentId && !hasFetched) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F9F9F9] px-[20px] items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center"></div>
          <h2 className="text-lg font-semibold text-red-600 mb-2">
            Unable to Load Apartment
          </h2>
          <p className="text-red-500 mb-4">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-[#A20BA2] text-white px-4 py-2 rounded-md hover:bg-[#8a1a8a]"
            >
              Retry
            </button>
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

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
        <h1 className="text-[24px] font-medium text-[#0D1321]">
          {isEditing() ? "Edit Basic Info" : "Basic Info"}
        </h1>
        <p className="text-[#666666] text-[14px]">
          {isEditing()
            ? "Update the basic details"
            : "Let's start with some basic details"}
        </p>
      </header>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md flex items-center">
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            className="ml-auto text-red-700 hover:text-red-900"
          >
            ×
          </button>
        </div>
      )}

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

          {/* Next button - Always shows "Next" */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#A20BA2] text-white text-[16px] font-semibold h-[57px] py-3 rounded-md disabled:opacity-50 hover:bg-[#8a1a8a] transition-colors"
          >
            {loading ? "Saving..." : "Next"}
          </button>
        </form>
      </div>
    </div>
  );
}
