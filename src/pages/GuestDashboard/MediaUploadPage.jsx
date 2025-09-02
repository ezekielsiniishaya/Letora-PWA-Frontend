import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";

export default function MediaUploadPage() {
  const [files, setFiles] = useState([]);
  const [, setError] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (files.length + selectedFiles.length > 10) {
      setError("You can only upload a maximum of 10 images.");
      return;
    }

    setFiles((prev) => [...prev, ...selectedFiles]);
    setError("");
  };

  const handleRemove = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (files.length < 7) {
      setError("Please upload at least 7 images before proceeding.");
      return;
    }

    if (files.length > 10) {
      setError("You can only upload up to 10 images.");
      return;
    }

    // ✅ All good
    navigate("/booking-pricing");
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
          4/8
        </span>
      </div>

      {/* Content */}
      <div className="w-full max-w-sm mt-[26px]">
        <h2 className="text-[24px] font-medium text-[#0D1321]">Media Upload</h2>
        <p className="text-[14px] text-[#666666] mt-[4px]">
          Show everyone how nice your apartment is
        </p>

        <form className="mt-[25px] flex flex-col" onSubmit={handleSubmit}>
          <label className="block text-[14px] font-medium text-[#333333]">
            Upload Apartment <span className="text-red-500">*</span>
          </label>

          {/* Upload Box */}
          <div className="border-[2.2px] mt-[10px] rounded-lg border-dashed border-[#D9D9D9] p-2">
            {files.length === 0 ? (
              // Default box if no images selected
              <label className="w-full h-[200px] bg-[#CCCCCC42] rounded-lg flex flex-col items-center justify-center cursor-pointer text-[#505050] font-medium text-[12px]">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
                <img
                  src="/icons/camera.svg"
                  alt="Upload"
                  className="w-[28px] h-[26px] mb-2"
                />
                <span className="text-center font-medium text-[12px] text-[#505050] w-[187px]">
                  Browse Images (7–10 required)
                </span>
                <p className="w-[260px] text-center text-[12px] font-thin">
                  Upload living room, bedroom, kitchen, amenities, etc.
                </p>
              </label>
            ) : (
              // Preview grid inside the upload box
              <div className="grid grid-cols-3 gap-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="relative w-full h-[100px] rounded-lg overflow-hidden border"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemove(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}

                {/* Extra "Add more" slot */}
                {files.length < 10 && (
                  <label className="w-full h-[100px] bg-[#CCCCCC42] rounded-lg flex flex-col items-center justify-center cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <img
                      src="/icons/camera.svg"
                      alt="Add"
                      className="w-[20px] h-[20px]"
                    />
                  </label>
                )}
              </div>
            )}
          </div>

          {/* Error / Status Message */}
          <p
            className={`mt-2 text-[12px] ${
              files.length < 7 ? "text-red-500" : "text-green-600"
            }`}
          >
            {files.length < 7
              ? `You need at least 7 images. Currently selected: ${files.length}`
              : `Selected ${files.length} images (max 10).`}
          </p>

          {/* Next Button */}
          <div className="mt-[40px]">
            <Button text="Next" type="submit" />
          </div>
        </form>
      </div>
    </div>
  );
}
