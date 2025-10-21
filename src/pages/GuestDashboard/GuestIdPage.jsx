import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { useGuestDocument } from "../../hooks/useGuestDocument";

export default function IdentityVerification() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
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
    if (!selectedFile) {
      setFile(null);
      return;
    }

    // File validation
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
    setFile(selectedFile);

    // Save to context (this will save to localStorage)
    addDocument("idCard", selectedFile);
    console.log("ID Card saved to context:", getDocumentStatus());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const activeFile = file || documents.idCard;
    if (!activeFile) {
      setError("Please select an ID document to continue.");
      return;
    }
    navigate("/guest-id-last");
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

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="mt-[173px]">
            <Button
              text="Next"
              type="submit"
              disabled={!file && !documents.idCard}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
