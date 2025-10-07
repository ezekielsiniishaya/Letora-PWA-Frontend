import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHostProfile } from "../../contexts/HostProfileContext";
import Button from "../../components/Button";

export default function IdentityVerification() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Use the host profile context
  const { hostProfileData, addVerificationDocument, setCurrentStep } =
    useHostProfile();

  // Get the existing ID card from context
  const existingIdCard = hostProfileData.verificationDocuments.find(
    (doc) => doc.type === "ID_CARD"
  );

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file && !existingIdCard) {
      setError("Please select a PDF file to upload");
      return;
    }

    setUploading(true);
    setError("");

    try {
      if (file) {
        console.log("Storing file in context:", file.name);

        const documentData = {
          id: `draft-${Date.now()}`,
          type: "ID_CARD",
          name: file.name,
          size: file.size,
          fileType: file.type,
          url: URL.createObjectURL(file),
          file: file, // ← CRITICAL: Store the actual file object
          status: "PENDING",
          uploadedAt: new Date().toISOString(),
        };

        addVerificationDocument(documentData);
        console.log("Added document with file data:", documentData);
      }

      setCurrentStep(2);
      navigate("/identity-with-picture-info");
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      setError(err.message || "Failed to save ID card");
    } finally {
      setUploading(false);
    }
  };

  const getButtonText = () => {
    if (uploading) return "Please wait...";
    return "Next";
  };

  const isButtonDisabled = () => {
    if (uploading) return true;
    if (existingIdCard) return false; // Allow navigation if already has ID card
    if (!file) return true; // Disable if no file selected and no existing ID card
    return false;
  };

  // Determine what to show in the upload box
  const getUploadBoxContent = () => {
    if (file) {
      return (
        <>
          <img
            src="/icons/pdf.svg"
            alt="Preview"
            className="w-[24px] h-[28px] mb-2"
          />
          <span className="text-[12px] text-[#333333] truncate max-w-[180px]">
            {file.name}
          </span>
        </>
      );
    } else if (existingIdCard) {
      return (
        <>
          <img
            src="/icons/pdf.svg"
            alt="Preview"
            className="w-[24px] h-[28px] mb-2"
          />
          <span className="text-[12px] text-[#333333] truncate max-w-[180px]">
            {existingIdCard.name}
          </span>
        </>
      );
    } else {
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

        {/* Error Message Only */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
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
              {getUploadBoxContent()}
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
