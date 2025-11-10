// components/apartment/ApartmentDisplay.jsx
import { useState } from "react";
import PropertyDetails from "../dashboard/PropertyDetails";
import Facilities from "../dashboard/Facilities";
import HouseRules from "../dashboard/HouseRules";
import { useNavigate } from "react-router-dom";
import { useEffect, useCallback } from "react";
import Alert from "../utils/Alerts";
import { getDocumentIcon } from "./fileIcon";

import {
  parkingSpaceMap,
  guestNumberMap,
  electricityMap,
  kitchenSizeMap,
  apartmentTypeMap,
  facilityMap,
  houseRuleMap,
} from "../utils/mapping";

// Reverse mapping functions
const reverseMapPropertyDetails = (details = {}, basicInfo = {}) => {
  const {
    bedrooms,
    bathrooms,
    parkingSpace,
    guestNumber,
    electricity,
    kitchenSize,
  } = details;
  const { apartmentType } = basicInfo;

  return [
    {
      iconSrc: "/icons/bed-sm.svg",
      label: "Bedroom",
      value: bedrooms?.toString() || "0",
    },
    {
      iconSrc: "/icons/bath.svg",
      label: "Bathtub",
      value: bathrooms?.toString() || "0",
    },
    {
      iconSrc: "/icons/car.svg",
      label: "Parking Space",
      value: parkingSpaceMap[parkingSpace] || "Not specified",
    },
    {
      iconSrc: "/icons/apartment.svg",
      label: "Apartment Type",
      value: apartmentTypeMap[apartmentType] || "Not specified",
    },
    {
      iconSrc: "/icons/guest.svg",
      label: "Guest Size",
      value: guestNumberMap[guestNumber] || "0",
    },
    {
      iconSrc: "/icons/zap.svg",
      label: "Electricity",
      value: electricityMap[electricity] || "Not specified",
    },
    {
      iconSrc: "/icons/kitchen.svg",
      label: "Kitchen Size",
      value: kitchenSizeMap[kitchenSize] || "Not specified",
    },
  ];
};

const reverseMapFacilities = (facilities = []) =>
  facilities.map((facility) => ({
    icon: facilityMap[facility.value]?.icon || "/icons/default-facility.svg",
    text: facilityMap[facility.value]?.label || facility.value,
  }));

const reverseMapHouseRules = (houseRules = []) =>
  houseRules.map((rule) => ({
    icon: houseRuleMap[rule.value]?.icon || "/icons/default-rule.svg",
    text: houseRuleMap[rule.value]?.label || rule.value,
  }));

export const ApartmentDisplay = ({
  apartment,
  user,
  showActions = false,
  onEdit,
  status = "draft",
  showLegalDocuments = true,
  backToHostDashboard = false,
  onPriceButtonClick,
  error = null, // Add error prop
  onClearError, // Add error clearing function
}) => {
  const [showGallery, setShowGallery] = useState(false);
  const [localError, setLocalError] = useState(null);
  const navigate = useNavigate();

  // Handle both prop errors and local errors
  const displayError = error || localError;

  const getApartmentId = useCallback(() => {
    return apartment?.securityDeposit?.apartmentId;
  }, [apartment?.securityDeposit?.apartmentId]);

  useEffect(() => {
    const apartmentId = getApartmentId();
    console.log("🎯 Found apartment ID:", apartmentId);
    console.log(
      "📍 From securityDeposit:",
      apartment?.securityDeposit?.apartmentId
    );
  }, [apartment, getApartmentId]);

  // Clear error when component unmounts or when explicitly cleared
  useEffect(() => {
    return () => {
      setLocalError(null);
    };
  }, []);

  const handleDismissError = () => {
    setLocalError(null);
    if (onClearError) {
      onClearError();
    }
  };

  // Function to set local errors (for internal component errors)
  const setError = (errorMessage, errorType = "error") => {
    setLocalError({
      type: errorType,
      message: errorMessage,
    });
  };

  // Enhanced error handling for image loading
  const handleImageError = (e, imageType = "apartment") => {
    console.error(`Failed to load ${imageType} image:`, e.target.src);
    e.target.src = "/images/apartment-dashboard.png";

    // Only show error for critical images (main image)
    if (imageType === "main") {
      setError("Failed to load apartment image", "network");
    }
  };

  // Enhanced error handling for avatar
  const handleAvatarError = (e) => {
    console.error("Failed to load avatar:", e.target.src);
    e.target.src = "/images/default-avatar.jpg";
  };

  // Safe navigation with error handling
  const handleNavigation = () => {
    try {
      if (backToHostDashboard) {
        navigate("/host-dashboard");
      } else {
        window.history.back();
      }
    } catch (navError) {
      console.error("Navigation error:", navError);
      setError("Navigation failed. Please try again.", "error");
    }
  };

  // Enhanced price button click with error handling
  const handlePriceButtonClick = () => {
    try {
      if (onPriceButtonClick) {
        onPriceButtonClick();
      } else {
        console.warn("No price button handler provided");
      }
    } catch (buttonError) {
      console.error("Price button click error:", buttonError);
      setError("Action failed. Please try again.", "error");
    }
  };

  // Enhanced edit handler
  const handleEdit = () => {
    try {
      if (onEdit) {
        onEdit();
      } else {
        console.warn("No edit handler provided");
        setError("Edit functionality not available", "error");
      }
    } catch (editError) {
      console.error("Edit action error:", editError);
      setError("Failed to initiate edit. Please try again.", "error");
    }
  };

  if (!apartment) {
    return (
      <div className="mx-[18px] text-[#39302A] mb-[24px] mt-[10px] bg-white">
        <div className="flex items-center justify-center h-40">
          <span>Loading apartment details...</span>
        </div>
      </div>
    );
  }

  // Destructure apartment data with defaults
  const {
    basicInfo = {},
    details = {},
    facilities = [],
    images = [],
    pricing = {},
    securityDeposit = {},
    houseRules = [],
    legalDocuments = [],
  } = apartment;

  // Prepare images with error handling
  const displayImages =
    images && images.length > 0
      ? images.map((img) =>
          typeof img === "string"
            ? img
            : img.url || img.data || "/images/apartment-dashboard.png"
        )
      : Array(4).fill("/images/apartment-dashboard.png");

  // Reverse mappings
  const propertyDetails = reverseMapPropertyDetails(details, basicInfo);
  const mappedFacilities = reverseMapFacilities(facilities);
  const mappedHouseRules = reverseMapHouseRules(houseRules);

  // Format price with error handling
  const formatPrice = (price) => {
    try {
      if (!price) return "0";
      if (typeof price === "number") return price.toLocaleString();
      if (typeof price === "string") {
        const num = parseInt(price.replace(/,/g, ""));
        return isNaN(num) ? "0" : num.toLocaleString();
      }
      return "0";
    } catch (formatError) {
      console.error("Price formatting error:", formatError);
      return "0";
    }
  };

  // Format security deposit with error handling
  const formatSecurityDeposit = (deposit) => {
    try {
      if (!deposit) return "0";

      if (typeof deposit === "number") return deposit.toLocaleString();

      if (typeof deposit === "object" && deposit.amount) {
        if (typeof deposit.amount === "number")
          return deposit.amount.toLocaleString();
        if (typeof deposit.amount === "string") {
          const num = parseInt(deposit.amount.replace(/,/g, ""));
          return isNaN(num) ? "0" : num.toLocaleString();
        }
      }

      if (typeof deposit === "string") {
        const num = parseInt(deposit.replace(/,/g, ""));
        return isNaN(num) ? "0" : num.toLocaleString();
      }

      return "0";
    } catch (formatError) {
      console.error("Security deposit formatting error:", formatError);
      return "0";
    }
  };

  // Host info
  const hostInfo = {
    name: user?.firstName || user?.username || "Host",
    surname: user?.lastName || "",
    avatar: user?.profilePic || "/images/profile-image.png",
  };

  // Check if apartment is verified
  const isVerified = () => {
    return (
      apartment.isVerified ||
      apartment.status === "VERIFIED" ||
      apartment.verified
    );
  };

  return (
    <div className="mx-[18px] text-[#39302A] mb-[24px] mt-[10px] bg-white">
      {/* Alert Display */}
      {displayError && (
        <div className="fixed top-4 right-4 z-50">
          <Alert
            type={displayError.type || "error"}
            message={displayError.message}
            onDismiss={handleDismissError}
            timeout={5000}
          />
        </div>
      )}

      {/* Header Actions */}
      {showActions && (
        <div className="flex items-center mb-[20px] justify-between">
          <button
            onClick={handleNavigation}
            className="hover:bg-gray-200 p-1 rounded"
          >
            <img src="/icons/arrow-left.svg" alt="Back" className="w-5 h-5" />
          </button>
          {status === "draft" && onEdit && (
            <button
              onClick={handleEdit}
              className="bg-[#686464] text-[12px] font-medium w-[65px] h-[21px] text-white px-4 rounded-full hover:bg-gray-800 transition-colors"
            >
              Edit
            </button>
          )}
          {status === "under_review" && (
            <button className="bg-[#167DDD] text-[12px] font-medium w-[151px] h-[21px] text-white px-4 rounded-full">
              Undergoing Review
            </button>
          )}
        </div>
      )}

      {/* Apartment Images */}
      <div className="flex h-[249px] flex-row gap-x-[7px] md:hidden relative">
        <div className="flex-1">
          <img
            src={displayImages[0]}
            alt="Apartment main view"
            className="rounded-[5.13px] w-full h-full object-cover"
            onError={(e) => handleImageError(e, "main")}
          />
        </div>

        <div className="w-[90px] flex flex-col gap-y-[7.5px]">
          {displayImages.slice(1, 4).map((src, i) => (
            <div key={i} className="relative">
              <img
                src={src}
                alt={`Apartment ${i + 2}`}
                className="rounded-[3.81px] w-full h-[78px] object-cover cursor-pointer hover:opacity-80"
                onError={(e) => handleImageError(e, "thumbnail")}
              />
              {/* Overlay on ALL images when more than 4 */}
              {displayImages.length > 4 && (
                <div
                  className="absolute inset-0 bg-black bg-opacity-40 rounded-[3.81px] cursor-pointer"
                  onClick={() => setShowGallery(true)}
                >
                  {/* "+X" text ONLY on the last image */}
                  {i === 2 && (
                    <div className="flex items-center justify-center h-full text-white font-semibold text-lg">
                      +{displayImages.length - 4}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Host info & price - Fixed positioning */}
      <div className="flex flex-col mt-4 relative">
        <div className="flex flex-col items-start">
          <img
            src={hostInfo.avatar}
            alt="Host"
            className="w-[50px] h-[50px] rounded-full object-cover -mt-10"
            onError={handleAvatarError}
          />
          <span className="font-medium mt-[8px] text-[12px]">
            {hostInfo.name} {hostInfo.surname}
          </span>

          <div className="flex flex-row w-full mt-[6px] gap-[20px]">
            <div className="flex-1">
              {/* Verified badge and title */}
              <div className="flex items-center gap-1 mb-1">
                <h1 className="text-[14px] font-semibold leading-snug">
                  {basicInfo.title || "Exquisite Three Bedroom Apartment"}
                </h1>
              </div>

              <p className="font-medium text-[12px]">
                {basicInfo.town || "Maryland, Lagos"},{" "}
                {basicInfo.state || "Maryland, Lagos"}
              </p>

              {/* Rating and likes section */}
              {apartment.totalLikes != null && (
                <div className="flex items-center mt-2 gap-1 md:mt-4 md:gap-2">
                  <div className="flex -space-x-2 md:-space-x-3">
                    <span className="w-[20.56px] h-[20.56px] rounded-full bg-[#8B44FF] md:w-[36.62px] md:h-[36.62px]" />
                    <span className="w-[20.56px] h-[20.56px] rounded-full bg-[#E00E9A] md:w-[36.62px] md:h-[36.62px]" />
                    <span className="w-[20.56px] h-[20.56px] rounded-full bg-[#FF4444] md:w-[36.62px] md:h-[36.62px]" />
                    <span className="w-[20.56px] h-[20.56px] rounded-full bg-[#70E5FF] md:w-[36.62px] md:h-[36.62px]" />
                  </div>

                  <span className="text-[12px] font-medium text-[#333333] md:text-[20px]">
                    {apartment.totalLikes?.toString()}+ Liked this place
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col items-end">
              {/* Verified badge for larger screens */}
              {isVerified() && (
                <span className="bg-black w-[67px] h-[18px] text-white text-[10px] px-[5px] font-medium rounded-[30px] flex items-center justify-center gap-1 mb-2">
                  <img
                    src="/icons/tick-white.svg"
                    alt="Verified icon"
                    className="w-[12px] h-[12px]"
                  />
                  Verified
                </span>
              )}
              <button
                className="text-white py-[6px] px-[6px] bg-[#A20BA2] h-[25px] font-semibold text-[12px] mt-[19px] rounded flex items-center justify-center hover:bg-[#8A0A8A] transition-colors"
                onClick={handlePriceButtonClick}
              >
                ₦{formatPrice(pricing.pricePerNight)}/Night
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Property Details */}
      <div className="mt-[31.66px]">
        <h2 className="text-[#39302A] text-[14px] font-semibold">
          Property Details
        </h2>
        <PropertyDetails list={propertyDetails} />
      </div>

      {/* Description */}
      <div className="mt-[31.66px]">
        <h2 className="text-[#39302A] text-[14px] font-semibold">
          Description
        </h2>
        <p className="text-[#505050] text-[12px] mt-2 w-full break-words">
          {details.description || "No description provided"}
        </p>
      </div>

      {/* Facilities */}
      <div className="mt-[31.66px]">
        <h2 className="text-[#39302A] text-[14px] font-semibold">
          Facilities & Services
        </h2>
        {mappedFacilities.length > 0 ? (
          <Facilities list={mappedFacilities} />
        ) : (
          <p className="text-[#505050] text-[12px] mt-2">
            No facilities selected
          </p>
        )}
      </div>

      {/* House Rules */}
      <div className="mt-[31.66px]">
        <h2 className="text-[#333333] text-[14px] font-semibold">
          House Rules
        </h2>
        {mappedHouseRules.length > 0 ? (
          <HouseRules list={mappedHouseRules} />
        ) : (
          <p className="text-[#505050] text-[12px] mt-2">
            No house rules selected
          </p>
        )}
      </div>

      {/* Security Deposit */}
      <div className="mt-[31.66px]">
        <h2 className="text-[#333333] text-[14px] font-semibold">
          Security Deposit Fee
        </h2>
        <div className="flex items-center mt-[5px] gap-1 text-[#505050] text-[14px] font-medium">
          <img
            src="/icons/money.svg"
            alt="money icon"
            className="w-[19px]  h-[14px] object-contain"
          />
          <p className="whitespace-nowrap">
            ₦{formatSecurityDeposit(securityDeposit)}.00
          </p>
        </div>
      </div>

      {/* Documentation Upload */}
      {showLegalDocuments && legalDocuments?.documents && (
        <div className="mt-[31.66px]">
          <h2 className="text-[#333333] text-[14px] font-semibold">
            Documentations
          </h2>
          <div className="flex gap-[7.5px] mt-[10px]">
            {legalDocuments.documents.slice(0, 3).map((doc, index) => (
              <div
                key={index}
                className="flex-1 min-w-0 border-[1.5px] border-[#D1D0D0] rounded-lg bg-[#CCCCCC42] h-[98px] flex flex-col items-center justify-center cursor-pointer text-[#505050] font-medium text-[12px] p-1"
              >
                <img
                  src={getDocumentIcon(doc.name)}
                  alt={doc.name}
                  className="w-6 h-6 mb-1 flex-shrink-0" // slightly smaller than w-8 h-8
                />
                <span className="text-center px-1 text-[10px] truncate w-full">
                  {doc.name && doc.name.length > 15
                    ? `${doc.name.substring(0, 12)}...`
                    : doc.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gallery Overlay */}
      {showGallery && (
        <div
          className="fixed inset-0 bg-[#313131]/80 flex items-center justify-center z-50"
          onClick={() => setShowGallery(false)}
        >
          <div
            className="flex gap-[13px] overflow-x-auto p-4 max-w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {displayImages.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Apartment ${i + 1}`}
                className="rounded-[5px] w-[319px] h-[203px] object-cover flex-shrink-0"
                onError={(e) => handleImageError(e, "gallery")}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApartmentDisplay;
