// pages/ListingOverviewPage.jsx
import { useState } from "react";
import ShowSuccess from "../../components/ShowSuccess";
import { useNavigate } from "react-router-dom";
import { useApartmentCreation } from "../../hooks/useApartmentCreation";
import { createCompleteApartment } from "../../services/apartmentApi";
import { useUser } from "../../hooks/useUser";
import ApartmentDisplay from "../../components/apartment/ApartmentDisplay";

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

export default function ListingOverviewPage() {
  const [agreeInfo, setAgreeInfo] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { apartmentData, clearApartmentData } = useApartmentCreation();
  const navigate = useNavigate();
  const { user } = useUser();

  // Destructure from apartmentData with proper defaults
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

  const handleSubmit = async () => {
    if (!agreeInfo || !agreeTerms) {
      setError("Please agree to both conditions before submitting");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("🟡 Preparing submission...");

      // 1. Transform apartmentData for backend - use destructured variables
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
              }
            : null,
        legalDocuments: legalDocuments?.role
          ? { role: legalDocuments.role }
          : null,
      };

      // 🔹 2. Create FormData FIRST
      const formData = new FormData();
      formData.append("apartmentData", JSON.stringify(submissionData));

      // 3. Convert images - use the destructured images array
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

      // 4. Convert documents + add metadata - use destructured legalDocuments
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
      const response = await createCompleteApartment(formData);
      if (response.success) {
        console.log("🟢 Apartment created successfully:", response.apartment);
        clearApartmentData();
        setShowSuccess(true);

        // Navigate to the success page WITH THE APARTMENT DATA
        navigate("/shortlet-review", {
          state: {
            apartment: response.apartment,
          },
        });
      } else {
        throw new Error(response.error || "Failed to create apartment");
      }
    } catch (err) {
      console.error("🔴 Submission failed:", err);
      setError(err.message || "Failed to submit listing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ApartmentDisplay
        apartment={apartmentData}
        user={user}
        showActions={true}
        onEdit={() => navigate("/basic-info")}
        status="draft"
        showLegalDocuments={true}
      />

      {/* Agreements Section */}
      <div className="mx-[18px] mt-[20px] space-y-3 text-[12px] text-[#0D132180]">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={agreeInfo}
            onChange={() => setAgreeInfo(!agreeInfo)}
            className="peer appearance-none [-webkit-appearance:none] border border-[#CCC] w-[23px] h-[18px] rounded-[5px] checked:bg-[#A20BA2] checked:border-[#A20BA2]"
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
            className="peer appearance-none [-webkit-appearance:none] border border-[#CCC] w-[25px] h-[18px] rounded-[5px] checked:bg-[#A20BA2] checked:border-[#A20BA2]"
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
        <div className="mx-[18px] mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!agreeInfo || !agreeTerms || loading}
        className={`mx-[18px] w-[calc(100%-36px)] mt-[54px] text-white text-[16px] font-semibold h-[57px] rounded-[10px] mb-[54px] ${
          agreeInfo && agreeTerms && !loading
            ? "bg-[#A20BA2]"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>

      {/* Success Modal */}
      {showSuccess && (
        <ShowSuccess
          image="/icons/document.png"
          heading="Listing Submitted for Review"
          message="Letora will now run standard checks to verify your identity and listing details. You'll be notified once it's approved."
          buttonText="Done"
          onClose={() => {
            setShowSuccess(false);
            navigate("/shortlet-review");
          }}
        />
      )}
    </div>
  );
}
