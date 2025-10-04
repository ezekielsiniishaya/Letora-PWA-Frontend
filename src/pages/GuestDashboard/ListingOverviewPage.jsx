import { useState, useEffect } from "react";
import ShowSuccess from "../../components/ShowSuccess";
import { useNavigate } from "react-router-dom";
import PropertyDetails from "../../components/dashboard/PropertyDetails";
import Facilities from "../../components/dashboard/Facilities";
import HouseRules from "../../components/dashboard/HouseRules";
import { useApartmentCreation } from "../../hooks/useApartmentCreation";
import { createCompleteApartment } from "../../services/apartmentApi";

import {
  parkingSpaceMap,
  guestNumberMap,
  electricityMap,
  kitchenSizeMap,
  apartmentTypeMap,
  facilityMap,
  houseRuleMap,
} from "../../components/utils/mapping";

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

export default function ListingOverviewPage() {
  const [showGallery, setShowGallery] = useState(false);
  const [agreeInfo, setAgreeInfo] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { apartmentData } = useApartmentCreation();
  const navigate = useNavigate();

  // Destructure from nested objects with proper defaults
  const {
    basicInfo = {},
    details = {},
    facilities = [],
    images = [],
    pricing = {},
    securityDeposit = {},
    houseRules = [],
    legalDocuments = [],
  } = apartmentData;

  // Debug
  useEffect(() => {
    console.log("Full apartmentData:", apartmentData);
    console.log("Basic Info:", basicInfo);
    console.log("Details:", details);
    console.log("Facilities:", facilities);
    console.log("House Rules:", houseRules);
    console.log("Pricing:", pricing);
    console.log("Security Deposit:", securityDeposit);
  }, [
    apartmentData,
    basicInfo,
    details,
    facilities,
    houseRules,
    pricing,
    securityDeposit,
  ]);

  // Prepare images
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

  // Format price - use pricing.price instead of pricing.nightlyRate
  const formatPrice = (price) => {
    if (!price) return "456,000";
    if (typeof price === "number") return price.toLocaleString();
    if (typeof price === "string") {
      const num = parseInt(price.replace(/,/g, ""));
      return isNaN(num) ? "456,000" : num.toLocaleString();
    }
    return "456,000";
  };

  // Format deposit - handle both securityDeposit.amount and securityDeposit directly
  const formatSecurityDeposit = (deposit) => {
    if (!deposit) return "100,000";

    // If deposit is a number
    if (typeof deposit === "number") return deposit.toLocaleString();

    // If deposit is an object with amount property
    if (typeof deposit === "object" && deposit.amount) {
      if (typeof deposit.amount === "number")
        return deposit.amount.toLocaleString();
      if (typeof deposit.amount === "string") {
        const num = parseInt(deposit.amount.replace(/,/g, ""));
        return isNaN(num) ? "100,000" : num.toLocaleString();
      }
    }

    // If deposit is a string
    if (typeof deposit === "string") {
      const num = parseInt(deposit.replace(/,/g, ""));
      return isNaN(num) ? "100,000" : num.toLocaleString();
    }

    return "100,000";
  };

  const handleSubmit = async () => {
    if (!agreeInfo || !agreeTerms) {
      setError("Please agree to both conditions before submitting");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("🟡 Preparing submission...");

      // 1. Transform apartmentData for backend
      const submissionData = {
        basicInfo: {
          title: basicInfo.title,
          description: basicInfo.description,
          apartmentType: basicInfo.apartmentType,
          town: basicInfo.town,
          state: basicInfo.state,
          address: basicInfo.address,
          price: pricing.pricePerNight,
        },
        details: {
          bedrooms: details.bedrooms,
          bathrooms: details.bathrooms,
          parkingSpace: details.parkingSpace,
          guestNumber: details.guestNumber,
          electricity: details.electricity,
          kitchenSize: details.kitchenSize,
          description: details.description,
        },
        facilities: facilities.map((f) => f.value),
        houseRules: houseRules.map((r) => r.value),
        securityDeposit:
          securityDeposit.amount > 0
            ? {
                amount: securityDeposit.amount,
                // ❌ REMOVED currency since it's not in the schema
              }
            : null,
        legalDocuments: legalDocuments?.role
          ? { role: legalDocuments.role }
          : null,
      };

      // 🔹 2. Create FormData FIRST
      const formData = new FormData();
      formData.append("apartmentData", JSON.stringify(submissionData));

      // 3. Convert images
      images
        .map((img, idx) => {
          if (img?.data?.startsWith("data:image")) {
            return base64ToFile(
              img.data,
              img.name || `image-${idx}.jpg`,
              img.type
            );
          }
          if (img instanceof File) return img;
          if (typeof img === "string" && img.startsWith("data:image")) {
            return base64ToFile(img, `image-${idx}.jpg`);
          }
          return null;
        })
        .filter(Boolean)
        .forEach((file) => formData.append("images", file));

      // 4. Convert documents + add metadata
      let documentMetadata = [];

      (legalDocuments?.documents || []).forEach((doc, idx) => {
        let file = null;

        if (doc.data?.startsWith("data:")) {
          const ext = getFileExtension(doc.type || doc.name);
          file = base64ToFile(
            doc.data,
            doc.name || `document-${idx}.${ext}`,
            doc.type
          );
        } else if (doc instanceof File) {
          file = doc;
        }

        if (file) {
          formData.append("documents", file);

          documentMetadata.push({
            documentType: doc.documentType,
            role: legalDocuments.role,
            name: doc.name,
          });
        }
      });

      // attach metadata as part of apartmentData JSON
      submissionData.documentMetadata = documentMetadata;

      // re-append apartmentData with updated documentMetadata
      formData.set("apartmentData", JSON.stringify(submissionData));

      // 5. Debug FormData contents
      for (let [key, val] of formData.entries()) {
        if (key === "apartmentData")
          console.log("📦 apartmentData:", JSON.parse(val));
        if (key === "images") console.log("🖼️ image:", val.name, val.size);
        if (key.startsWith("documentsMeta"))
          console.log("📑 meta:", JSON.parse(val));
        if (key === "documents")
          console.log("📄 document:", val.name, val.size);
      }

      // 6. Call backend API
      await createCompleteApartment(formData);
      console.log("🟢 Apartment created successfully");

      setShowSuccess(true);
    } catch (err) {
      console.error("🔴 Submission failed:", err);
      setError(err.message || "Failed to submit listing. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  // Helper function to convert base64 to File
  function base64ToFile(base64Data, fileName, fileType = "image/jpeg") {
    const arr = base64Data.split(",");
    const mime = arr[0].match(/:(.*?);/)[1] || fileType;
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
  }

  // Helper function to get file extension
  const getFileExtension = (typeOrName) => {
    if (typeOrName) {
      if (typeOrName.includes("pdf")) return "pdf";
      if (typeOrName.includes("image")) return "jpg";
      if (typeOrName.includes("word") || typeOrName.includes("document"))
        return "docx";
    }
    return "pdf"; // default
  };
  return (
    <div className="mx-[18px] text-[#39302A] mb-[24px] mt-[10px] bg-white">
      <div className="flex items-center mb-[20px] justify-between">
        {/* Back Arrow */}
        <button onClick={() => navigate(-1)} className="hover:bg-gray-200">
          <img src="/icons/arrow-left.svg" alt="Back" className="w-5 h-5" />
        </button>
        {/* Edit Button */}
        <button
          onClick={() => navigate("/basic-info")}
          className="bg-[#686464] text-[12px] font-medium w-[65px] h-[21px] text-white px-4 rounded-full hover:bg-gray-800"
        >
          Edit
        </button>
      </div>

      {/* Apartment Images - Fixed Layout */}
      <div className="flex h-[249px] flex-row gap-x-[7px] md:hidden">
        {/* Primary Image - Big Box */}
        <div className="flex-1">
          <img
            src={displayImages[0]}
            alt="Apartment main view"
            className="rounded-[5.13px] w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "/images/apartment-dashboard.png";
            }}
          />
        </div>

        {/* Secondary Images - Small Boxes */}
        <div className="w-[90px] flex flex-col gap-y-[7.5px]">
          {displayImages.slice(1, 4).map((src, i) => (
            <div key={i} className="relative">
              <img
                src={src}
                alt={`Apartment ${i + 2}`}
                className="rounded-[3.81px] w-full h-[78px] object-cover cursor-pointer hover:opacity-80"
                onError={(e) => {
                  e.target.src = "/images/apartment-dashboard.png";
                }}
              />
              {/* Show +count on the last image if there are more images */}
              {i === 2 && displayImages.length > 4 && (
                <div
                  className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white font-semibold text-lg rounded-[3.81px] cursor-pointer"
                  onClick={() => setShowGallery(true)}
                >
                  +{displayImages.length - 4}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Host info & price */}
      <div className="flex flex-col mt-4">
        <div className="flex flex-col items-start">
          <img
            src="/images/host.jpg"
            alt="Host"
            className="w-[50px] h-[50px] rounded-full object-cover -mt-10"
          />
          <span className="font-medium mt-[8px] text-[12px]">Ayodamola. P</span>

          <div className="flex flex-row w-full mt-[6px] gap-[20px]">
            <div className="flex-1">
              <h1 className="text-[14px] font-semibold leading-snug">
                {basicInfo.title || "Exquisite Three Bedroom Apartment"}
              </h1>
              <p className="font-medium text-[12px]">
                {basicInfo.town || "Maryland, Lagos"},{" "}
                {basicInfo.state || "Maryland, Lagos"}
              </p>
            </div>

            <div className="flex flex-col items-end">
              <p className="text-white py-[6px] px-[6px] bg-[#A20BA2] h-[25px] font-semibold text-[12px] mt-[6px] rounded flex items-center justify-center">
                ₦{formatPrice(pricing.pricePerNight)}/Night
              </p>
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
        <div className="flex items-center mt-[10px] gap-1 text-[#505050] text-[14px] font-medium">
          <img
            src="/icons/money.svg"
            alt="money icon"
            className="w-[19px] h-[14px] object-contain"
          />
          <p className="whitespace-nowrap">
            ₦{formatSecurityDeposit(securityDeposit)}.00
          </p>
        </div>
      </div>

      {/* Documentation Upload */}
      <div className="mt-[31.66px]">
        <h2 className="text-[#333333] text-[14px] font-semibold">
          Documentations
        </h2>
        <div className="flex gap-[7.5px] mt-[10px]">
          {legalDocuments?.documents?.slice(0, 3).map((doc, index) => (
            <div
              key={index}
              className="flex-1 min-w-0 border-[1.5px] border-[#D1D0D0] rounded-lg bg-[#CCCCCC42] h-[98px] flex flex-col items-center justify-center cursor-pointer text-[#505050] font-medium text-[12px] p-1"
            >
              {doc.type?.includes("image") ? (
                <>
                  <img
                    src="/icons/camera.svg"
                    alt="Image Document"
                    className="w-8 h-8 mb-1 flex-shrink-0"
                  />
                  <span className="text-center px-1 text-[10px] truncate w-full">
                    {doc.name && doc.name.length > 15
                      ? `${doc.name.substring(0, 12)}...`
                      : doc.name}
                  </span>
                </>
              ) : (
                <>
                  <img
                    src="/icons/pdf.svg"
                    alt="PDF"
                    className="w-8 h-8 mb-1 flex-shrink-0"
                  />
                  <span className="text-center px-1 text-[10px] truncate w-full">
                    {doc.name && doc.name.length > 15
                      ? `${doc.name.substring(0, 12)}...`
                      : doc.name}
                  </span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Agreements */}
      <div className="mt-[20px] space-y-3 text-[12px] text-[#0D132180]">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={agreeInfo}
            onChange={() => setAgreeInfo(!agreeInfo)}
            className="peer appearance-none [-webkit-appearance:none] border border-[#CCC] w-[23px] h-[18px] rounded-[5px]
             checked:bg-[#A20BA2] checked:border-[#A20BA2]"
          />
          <span className="absolute left-[20.5px] text-white text-xs hidden peer-checked:block">
            ✔
          </span>
          I confirm that I am authorized to list this apartment and all details
          provided are accurate.
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={() => setAgreeTerms(!agreeTerms)}
            className="peer appearance-none [-webkit-appearance:none] border border-[#CCC] w-[25px] h-[18px] rounded-[5px]
             checked:bg-[#A20BA2] checked:border-[#A20BA2]"
          />
          <span className="absolute left-[20.5px] text-white text-xs hidden peer-checked:block">
            ✔
          </span>
          have read and agreed to Letora's Terms & Conditions, Guest Refund
          policy, Content and Listing policy
        </label>
      </div>
      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      <button
        onClick={handleSubmit}
        disabled={!agreeInfo || !agreeTerms || loading}
        className={`mx-auto w-full mt-[54px] text-white text-[16px] font-semibold h-[57px] rounded-[10px] mb-[54px] ${
          agreeInfo && agreeTerms && !loading
            ? "bg-[#A20BA2]"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>

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
                onError={(e) => {
                  e.target.src = "/images/apartment-dashboard.png";
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <ShowSuccess
          image="/icons/document.png"
          heading="Listing Submitted for Review"
          message="Letora will now run standard checks to verify your identity and listing details. You'll be notified once it's approved."
          buttonText="Done"
          width=""
          onClose={() => {
            setShowSuccess(false);
            navigate("/shortlet-review");
          }}
        />
      )}
    </div>
  );
}
