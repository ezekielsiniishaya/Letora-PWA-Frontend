// pages/ListingOverviewPage.jsx
import { useState } from "react";
import ShowSuccess from "../../components/ShowSuccess";
import { useNavigate } from "react-router-dom";
import { useApartmentCreation } from "../../hooks/useApartmentCreation";
import {
  createCompleteApartment,
  updateCompleteApartment,
} from "../../services/apartmentApi";
import { useUser } from "../../hooks/useUser";
import ApartmentDisplay from "../../components/apartment/ApartmentDisplay";
import Alert from "../../components/utils/Alerts"; // or wherever your Alert component is
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
  const [error, setError] = useState(null);
  const [submissionResponse, setSubmissionResponse] = useState(null);
  const { apartmentData, clearApartmentData, isEditing } =
    useApartmentCreation();
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
    existingApartmentId = null,
  } = apartmentData;

  const handleSubmit = async () => {
    if (!agreeInfo || !agreeTerms) {
      setError({
        type: "error",
        message: "Please agree to both conditions before submitting",
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("🟡 Preparing submission...");
      console.log("Is editing mode:", isEditing());
      console.log("Existing apartment ID:", existingApartmentId);
      let documentMetadata = [];
      // 1. Transform apartmentData for backend - FLAT structure
      const submissionData = {
        basicInfo: {
          title: basicInfo?.title || "",
          apartmentType: basicInfo?.apartmentType || "",
          town: basicInfo?.town || "",
          state: basicInfo?.state || "",
          price: pricing?.pricePerNight || 0,
        },
        details: {
          bedrooms: details?.bedrooms || 0,
          bathrooms: details?.bathrooms || 0,
          parkingSpace: details?.parkingSpace || "",
          guestNumber: details?.guestNumber || "",
          electricity: details?.electricity || "",
          kitchenSize: details?.kitchenSize || "",
          description: details?.description || "",
        },
        facilities: facilities
          .map((f) => f?.value || f?.name || "")
          .filter(Boolean),
        houseRules: houseRules
          .map((r) => r?.value || r?.rule || "")
          .filter(Boolean),
        securityDeposit: securityDeposit
          ? { amount: securityDeposit?.amount || securityDeposit } // handles both number or object
          : undefined,

        legalDocuments: legalDocuments?.role
          ? { role: legalDocuments.role }
          : null,
        documentMetadata,
      };

      console.log("📦 Final submission data:", submissionData);

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

      let response;

      // 🔹 6. Check if we're updating an existing apartment or creating a new one
      if (isEditing() && existingApartmentId) {
        console.log("🔄 Updating existing apartment:", existingApartmentId);
        response = await updateCompleteApartment(existingApartmentId, formData);
      } else {
        console.log("🆕 Creating new apartment");
        response = await createCompleteApartment(formData);
      }
      if (response.success) {
        // Success case
        console.log("🟢 Apartment operation successful:", response.apartment);
        clearApartmentData();
        setSubmissionResponse(response); // Store the response

        setShowSuccess(true);
      } else {
        // Handle backend error directly
        console.log("🔴 Backend returned error:", response.error);
        setError({
          type: "error",
          message: response.error, // This comes from {"success":false,"error":"Missing required fields..."}
        });
        setLoading(false);
        return; // Important: return early to prevent further execution
      }
    } catch (err) {
      console.log("🔍 FULL ERROR OBJECT:", err);

      const backendError =
        err?.response?.data?.error ||
        err?.message ||
        "Failed to submit listing";

      setError({
        type: "error",
        message: backendError,
      });
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

      {error && (
        <div className="fixed top-4 right-4 z-50">
          <Alert
            type={error.type || "error"} // Add fallback
            message={error.message || error} // Handle both object and string
            onDismiss={() => setError(null)} // Clear properly
            timeout={5000}
          />
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
        {loading
          ? isEditing()
            ? "Updating..."
            : "Submitting..."
          : isEditing()
          ? "Update Listing"
          : "Submit Listing"}
      </button>

      {/* Success Modal */}
      {showSuccess && (
        <ShowSuccess
          image="/icons/document.png"
          width="w-[60px]"
          imgHeight="h-[60px]"
          heading={
            isEditing()
              ? "Listing Updated Successfully"
              : "Listing Submitted for Review"
          }
          message={
            isEditing()
              ? "Your apartment listing has been updated successfully."
              : "Letora will now run standard checks to verify your identity and listing details. You'll be notified once it's approved."
          }
          buttonText="Done"
          onClose={() => {
            setShowSuccess(false);
            navigate("/shortlet-review", {
              state: {
                apartment: submissionResponse?.apartment, // Use the stored response
                isUpdate: isEditing(),
              },
            });
          }}
        />
      )}
    </div>
  );
}
