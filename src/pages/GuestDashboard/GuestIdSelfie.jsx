import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import ShowSuccess from "../../components/ShowSuccess";
import { useGuestDocument } from "../../hooks/useGuestDocument";
import { uploadGuestDocuments } from "../../services/userApi";

export default function IdentitySelfie() {
  const [file, setFile] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const {
    documents,
    addDocument,
    hasAllDocuments,
    clearDocuments,
    getDocumentStatus,
  } = useGuestDocument();

  // Sync local state with context when component mounts
  useEffect(() => {
    if (documents.idPhotograph) {
      // The context now stores the actual File object directly
      setFile(documents.idPhotograph);
    }
  }, [documents.idPhotograph]);
  // In handleFileChange validation:
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
      setFile(null);
      return;
    }

    // File validation for specific image types only
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError(
        "Invalid file type. Please upload PNG, JPG, or JPEG images only."
      );
      e.target.value = "";
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File too large. Please upload a file under 5MB.");
      e.target.value = "";
      return;
    }

    setError("");
    setFile(selectedFile);

    // Save to context (this will save to localStorage)
    addDocument("idPhotograph", selectedFile);
    console.log("ID Photograph saved to context:", getDocumentStatus());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!documents.idCard || !documents.idPhotograph) {
      setError("Please make sure both ID card and selfie are uploaded.");
      return;
    }

    try {
      setUploading(true);
      setError("");

      // Create FormData with both documents
      const formData = new FormData();
      formData.append("idCard", documents.idCard);
      formData.append("idPhotograph", documents.idPhotograph);

      // DEBUG: Check FormData contents
      console.log("=== FORM DATA DEBUG ===");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": ", pair[1]);
      }
      console.log("FormData has idCard:", formData.has("idCard"));
      console.log("FormData has idPhotograph:", formData.has("idPhotograph"));
      console.log("=== END FORM DATA DEBUG ===");

      // Submit FormData directly to backend
      const result = await uploadGuestDocuments(formData);

      if (result.success) {
        setShowSuccess(true);
        clearDocuments();
      } else {
        throw new Error(result.message || "Failed to upload documents");
      }
    } catch (err) {
      console.error("Failed to upload documents:", err);
      setError(err.message || "Failed to upload documents. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const getUploadBoxContent = () => {
    // Check both local state and context
    const activeFile = file || documents.idPhotograph;
    if (activeFile) {
      return (
        <>
          <img
            src="/icons/camera.svg"
            alt="Preview"
            className="w-[28px] h-[26px] mb-2"
          />
          <span className="text-[12px] text-[#333333] truncate max-w-[180px]">
            {activeFile.name}
          </span>
          <span className="text-[10px] text-[#666666] mt-1">
            Click to change file
          </span>
        </>
      );
    }

    return (
      <>
        <img
          src="/icons/camera.svg"
          alt="Upload"
          className="w-[28px] h-[26px] mb-2"
        />
        <span className="text-center font-medium text-[12px] text-[#505050] w-[187px]">
          Upload image
        </span>
        <p className="w-[187px] text-center text-[12px] font-thin">
          Area should be well lit to capture clear image
        </p>
      </>
    );
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#F9F9F9] px-[20px]">
      {/* Header */}
      <div className="w-full flex items-center justify-between mt-[20px]">
        <img
          src="/icons/arrow-left.svg"
          alt="Back"
          className="w-[16px] cursor-pointer"
          onClick={() => navigate(-1)}
        />
      </div>

      {/* Content */}
      <div className="w-full max-w-sm mt-[26px]">
        <h2 className="text-[24px] font-medium text-[#0D1321]">
          Identity Verification
        </h2>
        <p className="text-[14px] text-[#666666] mt-[4px]">
          We need to verify you
        </p>

        <form className="mt-[45px] flex flex-col" onSubmit={handleSubmit}>
          <label className="block text-[14px] font-medium text-[#333333]">
            Upload Selfie with ID <span className="text-red-500">*</span>
          </label>

          {/* Upload Box */}
          <div className="border-[2.2px] mt-[10px] rounded-lg border-dashed border-[#D9D9D9]">
            <label className="w-full h-[200px] bg-[#CCCCCC42] rounded-lg flex flex-col items-center justify-center cursor-pointer text-[#505050] font-medium text-[12px]">
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                className="hidden"
                onChange={handleFileChange}
              />
              {getUploadBoxContent()}
            </label>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-[196px]">
            <Button
              text={uploading ? "Uploading..." : "Submit"}
              onClick={handleSubmit}
              disabled={
                uploading ||
                (!file && !documents.idPhotograph) ||
                !hasAllDocuments()
              }
            />
          </div>
        </form>
      </div>

      {/* ✅ Success Modal */}
      {showSuccess && (
        <ShowSuccess
          image="/icons/Illustration.svg"
          heading="Verification in Progress..."
          message="Our team will now review your submission for verification. This typically takes a few minutes to a few hours."
          buttonText="Explore Apartments"
          onClose={() => {
            setShowSuccess(false);
            navigate("/apartments");
          }}
        />
      )}
    </div>
  );
}
