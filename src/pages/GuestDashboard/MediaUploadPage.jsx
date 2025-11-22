import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { useApartmentCreation } from "../../hooks/useApartmentCreation";
import { deleteApartmentImageAPI } from "../../services/apartmentApi";

export default function MediaUploadPage() {
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null); // Track which image is being deleted
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();
  const { apartmentData, updateImages, setCurrentStep } =
    useApartmentCreation();

  // Ensure images array exists with a default value
  const images = apartmentData?.images || [];

  // Convert files to base64 objects
  const filesToBase64 = async (filesArray) => {
    const results = await Promise.all(
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
    );
    return results.filter((r) => r !== null);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (images.length < 7) {
      newErrors.images = "You need to upload at least 7 images";
    }

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    e.target.value = ""; // reset input

    if (selectedFiles.length === 0) return;

    // Use the safe images variable
    const totalFiles = images.length + selectedFiles.length;
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
      if (file.size > 10 * 1024 * 1024) {
        setError("File size should be less than 10MB.");
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Convert to base64
    const newImages = await filesToBase64(validFiles);
    updateImages([...images, ...newImages]);
    setError("");
    // Clear field error when user uploads images
    if (fieldErrors.images) {
      setFieldErrors((prev) => ({ ...prev, images: "" }));
    }
  };

  const handleRemove = async (index, imageId = null) => {
    // If it's an existing image from the database (has imageId), delete from backend
    if (imageId) {
      setDeleteLoading(imageId);
      try {
        await deleteApartmentImageAPI(imageId);

        // Remove from local state after successful deletion
        const newImages = images.filter((_, i) => i !== index);
        updateImages(newImages);

        setError("");
      } catch (err) {
        console.error("Error deleting image:", err);
        setError("Failed to delete image. Please try again.");
      } finally {
        setDeleteLoading(null);
      }
    } else {
      // If it's a newly uploaded file (no imageId), just remove from local state
      const newImages = images.filter((_, i) => i !== index);
      updateImages(newImages);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      // Validate form
      const isValid = validateForm();
      if (!isValid) {
        console.log("Validation errors:", fieldErrors);
        setLoading(false);
        return;
      }

      setCurrentStep(5);
      navigate("/booking-pricing");
    } catch (err) {
      console.error("Error saving images:", err);
      setError("An error occurred while saving images. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to check if image is from database (has ID) or newly uploaded
  const isDatabaseImage = (img) => {
    return img.id !== undefined;
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

        <form
          className="mt-[25px] flex flex-col"
          onSubmit={handleSubmit}
          noValidate
        >
          <label className="block text-[14px] font-medium text-[#333333]">
            Upload Apartment <span className="text-red-500">*</span>
          </label>

          {/* Upload Box */}
          <div
            className={` ${
              fieldErrors.images ? "border-[#F81A0C]" : "border-[#D9D9D9]"
            }`}
          >
            {images.length === 0 ? (
              <label
                className={`w-full h-[200px] rounded-lg flex flex-col items-center justify-center cursor-pointer text-[#505050] font-medium text-[12px] bg-white mt-3 ${
                  fieldErrors.images ? "border-[#F81A0C]" : "border-[#D9D9D9]"
                }`}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='8' ry='8' stroke='%23${
                    fieldErrors.images ? "F81A0C" : "D9D9D9"
                  }' stroke-width='2' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`,
                }}
              >
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
                  Browse Images
                </span>
                <p className="w-[260px] text-center text-[12px] font-thin">
                  Images including rooms, amenities, kitchen, interior decors,
                  are important
                </p>
              </label>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {images.map((img, index) => (
                  <div
                    key={img.id || `new-${index}`}
                    className="relative w-full h-[100px] rounded-lg overflow-hidden border"
                  >
                    <img
                      src={img.data || img.url}
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
                      onClick={() => handleRemove(index, img.id)}
                      disabled={deleteLoading === img.id}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs disabled:bg-gray-400"
                    >
                      {deleteLoading === img.id ? (
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        "×"
                      )}
                    </button>

                    {/* Show database indicator */}
                    {isDatabaseImage(img) && (
                      <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-[6px] px-1 py-0.5 rounded">
                        Saved
                      </div>
                    )}
                  </div>
                ))}

                {images.length < 10 && (
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
                      Add More ({10 - images.length} left)
                    </span>
                  </label>
                )}
              </div>
            )}
          </div>

          {/* Field Error Message */}
          {fieldErrors.images && (
            <p className="text-[#F81A0C] text-[10px] mt-1">
              {fieldErrors.images}
            </p>
          )}

          {/* Status Message - Always visible but not as error */}
          <p
            className={`mt-2 text-[12px] ${
              images.length < 7 ? "text-[#666666]" : "text-green-600"
            }`}
          >
            {images.length < 7
              ? ""
              : `Selected ${images.length} images (max 10). First image is primary.`}
          </p>
          {/* Error Message - Moved to bottom */}
          {error && <p className="text-[#F81A0C] text-[10px] mt-1">{error}</p>}

          {/* Next Button */}
          <div className="mt-[169px]">
            <Button
              text={loading ? "Saving..." : "Next"}
              type="submit"
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
