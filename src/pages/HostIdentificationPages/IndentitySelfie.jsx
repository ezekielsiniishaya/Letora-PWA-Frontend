import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useHostProfile } from "../../contexts/HostProfileContext";
import Button from "../../components/Button";

export default function IdentitySelfie() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const {
    hostProfileData,
    addVerificationDocument,
    updateVerificationDocument,
    setCurrentStep,
  } = useHostProfile();

  // Get existing selfie if already uploaded
  const existingSelfie = hostProfileData.verificationDocuments.find(
    (doc) => doc.type === "ID_PHOTOGRAPH"
  );

  // Create preview URL from existing file or stored data
  useEffect(() => {
    // Clean up previous blob URL
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    let newPreviewUrl = "";

    if (file) {
      // If we have a new file, create blob URL
      newPreviewUrl = URL.createObjectURL(file);
    } else if (existingSelfie?.url) {
      // Use existing URL (could be blob or permanent URL)
      newPreviewUrl = existingSelfie.url;
    }

    setPreviewUrl(newPreviewUrl);

    // Cleanup function
    return () => {
      if (newPreviewUrl && newPreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(newPreviewUrl);
      }
    };
  }, [file, existingSelfie  ]); // Remove previewUrl from dependencies

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      setError("Invalid file type. Please upload image files only.");
      e.target.value = "";
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File too large. Please upload images under 5MB.");
      e.target.value = "";
      return;
    }

    setFile(selectedFile);
    setError("");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file && !existingSelfie) {
      setError("Please select an image file to continue.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      // Convert file to base64 for storage in context
      if (file) {
        const fileToBase64 = (file) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
          });
        };

        const base64Data = await fileToBase64(file);

        const documentData = {
          id: existingSelfie?.id || `draft-${Date.now()}`,
          type: "ID_PHOTOGRAPH",
          name: file.name,
          size: file.size,
          fileType: file.type,
          url: base64Data, // Store as base64 instead of File object
          status: "PENDING",
          uploadedAt: new Date().toISOString(),
        };

        if (existingSelfie) {
          updateVerificationDocument(existingSelfie.id, documentData);
        } else {
          addVerificationDocument(documentData);
        }
      }

      setCurrentStep(3);
      navigate("/add-bank-details");
    } catch (err) {
      console.error("Error saving selfie:", err);
      setError("Failed to save selfie. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const getButtonText = () => (uploading ? "Please wait..." : "Next");

  const isButtonDisabled = () => {
    if (uploading) return true;
    if (existingSelfie) return false;
    return !file;
  };

  const getUploadBoxContent = () => {
    if (previewUrl) {
      return (
        <>
          <img
            src={previewUrl}
            alt="Preview"
            className="w-[90%] h-[70%] object-contain mb-1"
          />
          <span className="text-[12px] text-[#333333] truncate max-w-[180px]">
            {file?.name || existingSelfie?.name}
          </span>
        </>
      );
    } else {
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
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreviewUrl(existingSelfie?.url || "");

    // Clear the file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";
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
        <span className="text-[13.2px] font-medium bg-[#A20BA2] text-white px-[6.6px] w-[33px] h-[18.43px] rounded-[7.92px]">
          2/2
        </span>
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

          <div className="border-[2.2px] mt-[10px] rounded-lg border-dashed border-[#D9D9D9] relative">
            <label className="w-full h-[200px] bg-[#CCCCCC42] rounded-lg flex flex-col items-center justify-center cursor-pointer text-[#505050] font-medium text-[12px]">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              {getUploadBoxContent()}
            </label>

            {/* Remove button when new file is selected */}
            {file && previewUrl && (
              <button
                type="button"
                onClick={handleRemoveFile}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
              >
                ×
              </button>
            )}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="mt-[196px]">
            <Button
              text={getButtonText()}
              type="submit"
              disabled={isButtonDisabled()}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
