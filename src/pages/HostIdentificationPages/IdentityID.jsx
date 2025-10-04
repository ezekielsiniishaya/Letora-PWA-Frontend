import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import {
  uploadIdCardAPI,
  getUserDocumentsAPI,
} from "../../services/documentsApi";

export default function IdentityVerification() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [hasIdCard, setHasIdCard] = useState(false);
  const navigate = useNavigate();

  // Check if user already has an ID card uploaded
  useEffect(() => {
    checkExistingDocuments();
  }, []);

  const checkExistingDocuments = async () => {
    try {
      const result = await getUserDocumentsAPI();
      const idCard = result.documents.find((doc) => doc.type === "ID_CARD");
      if (idCard) {
        setHasIdCard(true);
        setSuccess(
          "ID Card already uploaded. You can upload a new one if needed."
        );
      }
    } catch (err) {
      console.error("Failed to check documents:", err);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;

    // Check if any file is selected
    if (!selectedFiles || selectedFiles.length === 0) {
      setFile(null);
      return;
    }

    const selectedFile = selectedFiles[0];

    // Validate only single file
    if (selectedFiles.length > 1) {
      setError("Please upload only one PDF file.");
      // Clear the file input
      e.target.value = "";
      setFile(null);
      return;
    }

    // Validate file type - ONLY PDF
    if (selectedFile.type !== "application/pdf") {
      setError("Invalid file type. Please upload PDF files only.");
      // Clear the file input
      e.target.value = "";
      setFile(null);
      return;
    }

    // Validate file size (5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size too large. Please upload files smaller than 5MB.");
      // Clear the file input
      e.target.value = "";
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setError("");
    setSuccess(""); // Clear success message when new file is selected
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If user already has an ID card and no new file selected, just navigate
    if (hasIdCard && !file) {
      navigate("/identity-with-picture-info");
      return;
    }

    // If no file selected and no existing ID card
    if (!file && !hasIdCard) {
      setError("Please select a PDF file to upload");
      return;
    }

    setUploading(true);
    setError("");

    try {
      // If there's a new file to upload, upload it first
      if (file) {
        const result = await uploadIdCardAPI(file);
        setSuccess(result.message || "ID Card uploaded successfully!");
        setHasIdCard(true);

        // Reset file input and state
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = "";
        setFile(null);
      }

      // Navigate after successful upload or if already had ID card
      setTimeout(() => {
        navigate("/identity-with-picture-info");
      }, 1000); // Small delay to show success message
    } catch (err) {
      setError(err.message || "Failed to upload ID card");
    } finally {
      setUploading(false);
    }
  };

  const getButtonText = () => {
    if (uploading) return "Please wait...";
    if (hasIdCard) return "Next";
    if (file) return "Upload & Continue";
    return "Next";
  };

  const isButtonDisabled = () => {
    if (uploading) return true;
    if (hasIdCard) return false;
    if (!file) return true;
    return false;
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

        {/* Status Indicator */}
        {hasIdCard && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              ✓ ID Card uploaded successfully
            </p>
          </div>
        )}

        {/* Error and Success Messages */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        <form className="mt-[45px] flex flex-col" onSubmit={handleSubmit}>
          <label className="block text-[14px] font-medium text-[#333333]">
            Upload Valid Government ID Card{" "}
            <span className="text-red-500">*</span>
          </label>

          {/* Upload Box */}
          <div className="border-[2.2px] mt-[10px] rounded-lg border-dashed border-[#D9D9D9]">
            <label className="w-full h-[200px] bg-[#CCCCCC42] rounded-lg flex flex-col items-center justify-center cursor-pointer text-[#505050] font-medium text-[12px]">
              <input
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />

              {file ? (
                <>
                  <img
                    src="/icons/jpg.svg"
                    alt="Preview"
                    className="w-[24px] h-[28px] mb-2"
                  />
                  <span className="text-[12px] text-[#333333] truncate max-w-[180px]">
                    {file.name}
                  </span>
                </>
              ) : (
                <>
                  <img
                    src="/icons/jpg.svg"
                    alt="Upload"
                    className="w-[24px] h-[28px] mb-2"
                  />
                  <span className="text-center w-[187px] leading-tight">
                    NIN Slip / Int. Passport / Driver's License
                  </span>
                </>
              )}
            </label>
          </div>

          {/* Next Button - Single button that handles both upload and navigation */}
          <div className="mt-[173px]">
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
