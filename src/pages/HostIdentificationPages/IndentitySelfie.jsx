import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useHostProfile } from "../../contexts/HostProfileContext";
import Button from "../../components/Button";
import Alert from "../../components/utils/Alerts.jsx"; // Adjust path as needed

export default function IdentitySelfie() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [alert, setAlert] = useState(null);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file, existingSelfie]); // Remove previewUrl from dependencies

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      setFile(null);
      return;
    }

    // Client-side validation - use setError instead of showAlert
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
    setFieldError("");
    // No alert for successful file selection - this is client-side
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setFieldError("");
    setError("");

    // Client-side validation - use fieldError instead of alert
    if (!file && !existingSelfie) {
      setFieldError("This field is required.");
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

      // ✅ Only use alert for actual backend errors
      const errorMessage =
        err.response?.data?.message ||
        "Failed to save selfie. Please try again.";
      showAlert("error", errorMessage);
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

        {/* ✅ Alert display - ONLY for backend responses */}
        {alert && (
          <div className="mt-4">
            <Alert type={alert.type} message={alert.message} />
          </div>
        )}

        <form className="mt-[45px] flex flex-col" onSubmit={handleSubmit}>
          <label className="block text-[14px] font-medium text-[#333333]">
            Upload Selfie with ID <span className="text-red-500">*</span>
          </label>

          {/* Updated upload box with dashed border and red border for errors */}
          <div className="mt-[10px] bg-white rounded-lg">
            <label
              className={`w-full h-[200px] rounded-lg flex flex-col items-center justify-center cursor-pointer text-[#505050] font-medium text-[12px] ${
                fieldError ? "border-[#F81A0C]" : "border-[#D1D0D0]"
              }`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='8' ry='8' stroke='%23${
                  fieldError ? "F81A0C" : "D1D0D0"
                }' stroke-width='2' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`,
              }}
            >
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              {getUploadBoxContent()}
            </label>
          </div>

          {/* ✅ Field error message - for client-side validation */}
          {fieldError && (
            <p className="text-[#F81A0C] text-[10px] mt-[8px]">{fieldError}</p>
          )}

          {/* ✅ Client-side validation errors (file type, size, etc.) */}
          {error && !fieldError && (
            <p className="text-[#F81A0C] text-[12px] mt-1">{error}</p>
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
