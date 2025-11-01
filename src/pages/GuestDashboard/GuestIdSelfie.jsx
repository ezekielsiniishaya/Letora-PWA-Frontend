import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import ShowSuccess from "../../components/ShowSuccess";
import Alert from "../../components/utils/Alerts.jsx"; // Import the Alert component
import { useGuestDocument } from "../../hooks/useGuestDocument";
import { uploadGuestDocuments } from "../../services/userApi";

export default function IdentitySelfie() {
  const [file, setFile] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [alert, setAlert] = useState(null); // Add alert state
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
      setFile(documents.idPhotograph);
    }
  }, [documents.idPhotograph]);

  // Function to show alerts
  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000); // Auto-dismiss after 5 seconds
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];

    // Clear previous errors
    setError("");
    setFieldError("");
    setAlert(null); // Clear any existing alerts

    if (!selectedFile) {
      setFile(null);
      return;
    }

    // Client-side validation - use setError for file-specific errors
    if (e.target.files.length > 1) {
      setError("Please upload only one image file.");
      e.target.value = "";
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
    setFieldError("");
    setFile(selectedFile);

    // Save to context (this will save to localStorage)
    try {
      addDocument("idPhotograph", selectedFile);
      console.log("ID Photograph saved to context:", getDocumentStatus());
    } catch (err) {
      console.error("Error saving document to context:", err);
      setError("Failed to save document. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setFieldError("");
    setError("");
    setAlert(null);

    // Client-side validation - use fieldError for required field validation
    if (!file && !documents.idPhotograph) {
      setFieldError("This field is required.");
      return;
    }

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

      let errorMessage = "";
      let alertType = "error";

      // Network errors (no response from server)
      if (!err.response) {
        if (err.message?.includes("Failed") || err.code === "NETWORK_ERROR") {
          errorMessage = "Server or Database error, please try again.";
          alertType = "network";
        } else if (err.message?.includes("timeout")) {
          errorMessage = "Request timed out. Please try again.";
          alertType = "network";
        } else {
          errorMessage = "Network issues. Get better reception and try again";
          alertType = "network";
        }
      }
      // Server errors (5xx status codes)
      else if (err.response?.status >= 500) {
        errorMessage =
          "Server error. Our team has been notified. Please try again later.";
        alertType = "error";
      }
      // Database errors (usually come as 4xx with specific messages)
      else if (err.response?.status >= 400) {
        const serverMessage = err.response?.data?.message;

        if (
          serverMessage?.includes("database") ||
          serverMessage?.includes("DB") ||
          serverMessage?.includes("storage")
        ) {
          errorMessage =
            "Database error. Please try again or contact support if the issue persists.";
          alertType = "error";
        }
        // File size/server validation errors
        else if (
          serverMessage?.includes("size") ||
          serverMessage?.includes("large")
        ) {
          errorMessage =
            serverMessage || "File too large for server processing.";
          alertType = "error";
        }
        // Invalid file type
        else if (
          serverMessage?.includes("type") ||
          serverMessage?.includes("format")
        ) {
          errorMessage =
            serverMessage || "Invalid file format detected by server.";
          alertType = "error";
        }
        // Authentication/authorization errors
        else if (err.response?.status === 401 || err.response?.status === 403) {
          errorMessage = "Session expired. Please log in again.";
          alertType = "error";
        }
        // Other client errors with specific messages
        else if (serverMessage) {
          errorMessage = serverMessage;
          alertType = "error";
        }
        // Generic client errors
        else {
          errorMessage =
            "Invalid request. Please check your files and try again.";
          alertType = "error";
        }
      }
      // Other unexpected errors
      else if (err.message) {
        errorMessage = err.message;
        alertType = "error";
      }
      // Fallback
      else {
        errorMessage = "An unexpected error occurred. Please try again.";
        alertType = "error";
      }

      // Show appropriate alert for backend/database errors
      showAlert(alertType, errorMessage);
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

        {/* ✅ Alert display - ONLY for backend/database errors */}
        {alert && (
          <div className="mt-4">
            <Alert
              type={alert.type}
              message={alert.message}
              onDismiss={() => setAlert(null)}
            />
          </div>
        )}

        <form className="mt-[45px] flex flex-col" onSubmit={handleSubmit}>
          <label className="block text-[14px] font-medium text-[#333333]">
            Upload Selfie with ID <span className="text-red-500">*</span>
          </label>

          {/* Upload Box with error styling */}
          <div className="mt-[10px] bg-white rounded-lg">
            <label
              className={`w-full h-[200px] rounded-lg flex flex-col items-center justify-center cursor-pointer text-[#505050] font-medium text-[12px] ${
                fieldError ? "border-[#F81A0C]" : "border-[#D9D9D9]"
              }`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='8' ry='8' stroke='%23${
                  fieldError ? "F81A0C" : "D9D9D9"
                }' stroke-width='2.2' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`,
                backgroundColor: "white",
              }}
            >
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                className="hidden"
                onChange={handleFileChange}
              />
              {getUploadBoxContent()}
            </label>
          </div>

          {/* ✅ Field error message - for client-side required field validation */}
          {fieldError && (
            <p className="text-[#F81A0C] text-[10px] mt-[8px]">{fieldError}</p>
          )}

          {/* ✅ Client-side validation errors (file type, size, etc.) */}
          {error && !fieldError && (
            <p className="text-[#F81A0C] text-[12px] mt-1">{error}</p>
          )}

          {/* Submit Button */}
          <div className="mt-[196px]">
            <Button
              text={uploading ? "Uploading..." : "Submit"}
              type="submit"
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
