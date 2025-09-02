import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import ShowSuccess from "../../components/ShowSuccess";

export default function IdentitySelfie() {
  const [file, setFile] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuccess(true);
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
            Upload Selfie with ID <span className="text-red-500">*</span>
          </label>

          {/* Upload Box */}
          <span className="border-[2.2px] mt-[10px] rounded-lg border-dashed border-[#D9D9D9]">
            <label className="w-full h-[200px] bg-[#CCCCCC42] rounded-lg flex flex-col items-center justify-center cursor-pointer text-[#505050] font-medium text-[12px]">
              <input
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={handleFileChange}
              />

              {file ? (
                <>
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

          {/* Submit Button */}
          <div className="mt-[196px]">
            <Button text="Submit" onClick={handleSubmit} />
          </div>
        </form>
      </div>

      {/* ✅ Success Modal */}
      {showSuccess && (
        <ShowSuccess
          image="/icons/Illustration.svg"
          heading="Verification in Progress..."
          message="Our team will now review your submission for verification. This typically takes a few minutes to a few hours."
          buttonText="Explore Apartments"
          onClose={() => {
            setShowSuccess(false);
            navigate("/booking-dates");
          }}
        />
      )}
    </div>
  );
}
