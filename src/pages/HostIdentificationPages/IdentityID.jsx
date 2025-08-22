import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { Link } from "react-router-dom";

export default function IdentityVerification() {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      navigate("/next-step"); // replace with your actual next route
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
          1/3
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
            Upload Valid Government ID <span className="text-red-500">*</span>
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
                    src="/icons/jpg.svg"
                    alt="Upload"
                    className="w-[24px] h-[28px] mb-2"
                  />
                  <span className="text-center w-[187px] leading-tight">
                    NIN Slip / Int. Passport / Driver’s License
                  </span>
                </>
              )}
            </label>
          </span>

          {/* Next Button */}
          <Link to="/identity-with-picture-info">
            <div className="mt-[173px]">
              <Button text="Next" type="submit" />
            </div>
          </Link>
        </form>
      </div>
    </div>
  );
}
