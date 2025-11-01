import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { useGuestDocument } from "../../hooks/useGuestDocument";

export default function IdentityVerification() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState("");
  const navigate = useNavigate();
  const { documents, addDocument, getDocumentStatus } = useGuestDocument();

  // Sync local state with context when component mounts
  useEffect(() => {
    if (documents.idCard) {
      // The context now stores the actual File object directly
      setFile(documents.idCard);
    }
  }, [documents.idCard]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];

    // Clear previous errors
    setError("");
    setFieldError("");

    if (!selectedFile) {
      setFile(null);
      return;
    }

    // Client-side validation - use setError for file-specific errors
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

    // Save to context (this will save to localStorage)
    try {
      addDocument("idCard", selectedFile);
      console.log("ID Card saved to context:", getDocumentStatus());
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

    // Client-side validation - use fieldError for required field validation
    if (!file && !documents.idCard) {
      setFieldError("This field is required.");
      return;
    }

    setUploading(true);

    try {
      // Simulate API call or any async operation
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Navigate to next step
      navigate("/guest-id-last");
    } catch (err) {
      console.error("Error during submission:", err);

      // Handle different types of errors
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Failed to proceed. Please try again.");
      }
    } finally {
      setUploading(false);
    }
  };

  const getUploadBoxContent = () => {
    // Check both local state and context
    const activeFile = file || documents.idCard;
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
          <span className="text-[10px] text-[#666666] mt-1">
            Click to change file
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
        <span className="text-center w-[187px] leading-tight">
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
            Upload Valid Government ID <span className="text-red-500">*</span>
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

          {/* ✅ Field error message - for client-side required field validation */}
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
              disabled={uploading || (!file && !documents.idCard)}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
