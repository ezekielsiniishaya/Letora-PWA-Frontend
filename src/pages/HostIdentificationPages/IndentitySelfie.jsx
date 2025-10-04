import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { uploadIdPhotographAPI } from "../../services/documentsApi"; 

export default function IdentitySelfie() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);

    try {
      // Upload using the API function
      const result = await uploadIdPhotographAPI(file);

      if (result.success) {
        navigate("/add-bank-details");
      } else {
        throw new Error(result.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert(error.message || "Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
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

        <form className="mt-[45px] flex flex-col" onSubmit={handleSubmit}>
          <label className="block text-[14px] font-medium text-[#333333]">
            Upload Selfie with ID <span className="text-red-500">*</span>
          </label>

          {/* Upload Box */}
          <span className="border-[2.2px] mt-[10px] rounded-lg border-dashed border-[#D9D9D9]">
            <label
              className="w-full h-[200px] 
      bg-[#CCCCCC42] 
      rounded-lg 
      flex flex-col items-center justify-center 
      cursor-pointer text-[#505050] font-medium text-[12px]"
            >
              <input
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={handleFileChange}
                disabled={uploading}
              />

              {/* If file selected, show preview, else show JPG icon */}
              {file ? (
                <>
                  {/* Image preview */}
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                    className="w-[90%] h-[70%] object-contain mb-1"
                  />
                  <span className="text-[12px] text-[#333333] truncate max-w-[180px]">
                    {file.name}
                  </span>
                </>
              ) : (
                <>
                  {/* Default JPG placeholder icon */}
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
              )}
            </label>
          </span>

          {/* Next Button */}
          <div className="mt-[196px]">
            <Button
              text={uploading ? "Uploading..." : "Next"}
              type="submit"
              disabled={!file || uploading}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
