import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useHostProfile } from "../../contexts/HostProfileContext";
import Button from "../../components/Button";
import Alert from "../../components/utils/Alerts.jsx"; // Adjust path as needed

export default function IdentityVerification() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  const {
    hostProfileData,
    updateVerificationDocument,
    addVerificationDocument,
    setCurrentStep,
  } = useHostProfile();

  const existingIdCard = hostProfileData.verificationDocuments.find(
    (doc) => doc.type === "ID_CARD"
  );

  useEffect(() => {
    setFile(null);
    setError("");
    setFieldError("");
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";
  }, []);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
      setFile(null);
      return;
    }

    // Client-side validation - use setError instead of showAlert
    if (e.target.files.length > 1) {
      setError("Please upload only one PDF file.");
      e.target.value = "";
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      setError("Invalid file type. Please upload PDF files only.");
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
    // No alert for successful file selection - this is client-side
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setFieldError("");
    setError("");

    // Client-side validation - use fieldError instead of alert
    if (!file && !existingIdCard) {
      setFieldError("This field is required.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      if (file) {
        // Convert file to base64 for storage
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
          id: existingIdCard?.id || `draft-${Date.now()}`,
          type: "ID_CARD",
          name: file.name,
          size: file.size,
          fileType: file.type,
          url: base64Data, // Store as base64 instead of blob URL
          status: "PENDING",
          uploadedAt: new Date().toISOString(),
        };

        if (existingIdCard) {
          updateVerificationDocument(existingIdCard.id, documentData);
        } else {
          addVerificationDocument(documentData);
        }
      }
      // Navigate to next step
      setCurrentStep(2);
      navigate("/identity-selfie");
    } catch (err) {
      console.error("Error saving ID card:", err);

      // ✅ Only use alert for actual backend errors
      const errorMessage =
        err.response?.data?.message ||
        "Failed to save ID card. Please try again.";
      showAlert("error", errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const getUploadBoxContent = () => {
    const activeFile = file || existingIdCard;
    if (activeFile) {
      return (
        <>
          <img
            src="/icons/pdf.svg"
            alt="Preview"
            className="w-[24px] h-[28px] mb-2"
          />
          <span className="text-[12px] text-[#333333] truncate max-w-[180px]">
            {activeFile.name}
          </span>
        </>
      );
    }

    return (
      <>
        <img
          src="/icons/pdf.svg"
          alt="Upload"
          className="w-[24px] h-[28px] mb-2"
        />
        <span className="text-center w-[137px] leading-tight">
          NIN Slip / Int. Passport / Driver's License
        </span>
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
        <span className="text-[13.2px] font-medium bg-[#A20BA2] text-white px-[6.6px] w-[33px] h-[18.43px] rounded-[7.92px]">
          1/2
        </span>
      </div>

      {/* Content */}
      <div className="w-full max-w-sm mt-[26px]">
        <h2 className="text-[24px] font-medium text-[#0D1321]">
          Identity Verification
        </h2>
        <p className="text-[14px] text-[#666666] mt-[4px]">
          Upload your government ID card
        </p>

        {/* ✅ Alert display - ONLY for backend responses */}
        {alert && (
          <div className="mt-4">
            <Alert type={alert.type} message={alert.message} />
          </div>
        )}

        <form className="mt-[45px] flex flex-col" onSubmit={handleSubmit}>
          <label className="block text-[14px] font-medium text-[#333333]">
            Upload Valid Government ID Card{" "}
            <span className="text-red-500">*</span>
          </label>

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
                accept=".pdf,application/pdf"
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

          <div className="mt-[173px]">
            <Button
              text={uploading ? "Please wait..." : "Next"}
              type="submit"
              disabled={uploading || (!file && !existingIdCard)}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
