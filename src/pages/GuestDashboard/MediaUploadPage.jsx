import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { useApartmentCreation } from "../../hooks/useApartmentCreation";

export default function MediaUploadPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { apartmentData, updateImages, setCurrentStep } =
    useApartmentCreation();

  // Convert files to base64 objects
  const filesToBase64 = (filesArray) => {
    return Promise.all(
      filesArray.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
              resolve({
                name: file.name,
                type: file.type,
                size: file.size,
                data: reader.result, // base64 string
                lastModified: file.lastModified,
              });
            };
            reader.onerror = () => {
              console.error("Error reading file:", file.name);
              resolve(null);
            };
            reader.readAsDataURL(file);
          })
      )
    ).then((results) => results.filter((r) => r !== null));
  };

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    e.target.value = ""; // reset input

    if (selectedFiles.length === 0) return;

    const totalFiles = apartmentData.images.length + selectedFiles.length;
    if (totalFiles > 10) {
      setError("You can only upload a maximum of 10 images.");
      return;
    }

    // Validate
    const validFiles = selectedFiles.filter((file) => {
      if (!file.type.startsWith("image/")) {
        setError("Please select only image files.");
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("File size should be less than 5MB.");
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Convert to base64
    const newImages = await filesToBase64(validFiles);
    updateImages([...apartmentData.images, ...newImages]);
    setError("");
  };

  const handleRemove = (index) => {
    const newImages = apartmentData.images.filter((_, i) => i !== index);
    updateImages(newImages);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (apartmentData.images.length < 7) {
      setError("Please upload at least 7 images before proceeding.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      setCurrentStep(5);
      navigate("/booking-pricing");
    } catch (err) {
      console.error("Error saving images:", err);
      setError("An error occurred while saving images. Please try again.");
    } finally {
      setLoading(false);
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
          4/8
        </span>
      </div>

      {/* Content */}
      <div className="w-full max-w-sm mt-[26px]">
        <h2 className="text-[24px] font-medium text-[#0D1321]">Media Upload</h2>
        <p className="text-[14px] text-[#666666] mt-[4px]">
          Show everyone how nice your apartment is
        </p>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form className="mt-[25px] flex flex-col" onSubmit={handleSubmit}>
          <label className="block text-[14px] font-medium text-[#333333]">
            Upload Apartment Images <span className="text-red-500">*</span>
          </label>

          {/* Upload Box */}
          <div className="border-[2.2px] mt-[10px] rounded-lg border-dashed border-[#D9D9D9] p-2">
            {apartmentData.images.length === 0 ? (
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
              <div className="grid grid-cols-3 gap-2">
                {apartmentData.images.map((img, index) => (
                  <div
                    key={`${img.name}-${index}`}
                    className="relative w-full h-[100px] rounded-lg overflow-hidden border"
                  >
                    <img
                      src={img.data}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {index === 0 && (
                      <div className="absolute top-1 left-1 bg-[#A20BA2] text-white text-[8px] px-1 py-0.5 rounded">
                        Primary
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemove(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}

                {apartmentData.images.length < 10 && (
                  <label className="w-full h-[100px] bg-[#CCCCCC42] rounded-lg flex flex-col items-center justify-center cursor-pointer border border-dashed border-gray-400">
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
                      className="w-[20px] h-[20px] mb-1"
                    />
                    <span className="text-[10px] text-gray-600 text-center">
                      Add More ({10 - apartmentData.images.length} left)
                    </span>
                  </label>
                )}
              </div>
            )}
          </div>

          {/* Status Message */}
          <p
            className={`mt-2 text-[12px] ${
              apartmentData.images.length < 7
                ? "text-red-500"
                : "text-green-600"
            }`}
          >
            {apartmentData.images.length < 7
              ? `You need at least 7 images. Currently selected: ${apartmentData.images.length}`
              : `Selected ${apartmentData.images.length} images (max 10). First image is primary.`}
          </p>

          {/* Next Button */}
          <div className="mt-[40px]">
            <Button
              text={loading ? "Saving..." : "Next"}
              type="submit"
              disabled={loading || apartmentData.images.length < 7}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
