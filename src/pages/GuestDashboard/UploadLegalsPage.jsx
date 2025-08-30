import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "../../components/Button";
import Dropdown from "../../components/dashboard/Dropdown"; // assuming you save your dropdown here

export default function UploadLegalsPage() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [files, setFiles] = useState({
    ownership: null,
    utility: null,
    authorization: null,
  });
  const navigate = useNavigate();

  const handleFileChange = (e, field) => {
    setFiles({ ...files, [field]: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
          8/8
        </span>
      </div>

      {/* Content */}
      <div className="w-full max-w-sm mt-[26px]">
        <h2 className="text-[24px] font-medium text-[#0D1321]">Legals</h2>
        <p className="text-[14px] text-[#666666] mt-[4px]">
          Your paperwork, our partnership
        </p>

        <form
          className="mt-[35px] flex flex-col space-y-8"
          onSubmit={handleSubmit}
        >
          {/* Host Type Dropdown */}
          <Dropdown
            label="What type of host are you?"
            required
            placeholder="Choose option"
            options={[
              { value: "tenant", label: "Tenant" },
              { value: "landlord", label: "Landlord" },
            ]}
            heading="Choose who you are"
            isOpen={isDropdownOpen}
            onToggle={() => setIsDropdownOpen(!isDropdownOpen)}
            multiple={false}
          />

          {/* Upload 1 - Ownership / Tenancy */}
          <div>
            <label className="block text-[14px] font-medium text-[#333333]">
              Upload Document <span className="text-red-500">*</span>
            </label>
            <span className="border-[2.2px] mt-[10px] rounded-lg border-dashed border-[#D9D9D9] block">
              <label className="w-full h-[172px] bg-[#CCCCCC42] rounded-lg flex flex-col items-center justify-center cursor-pointer text-[#505050] font-medium text-[12px]">
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, "ownership")}
                />
                {files.ownership ? (
                  <>
                    <img
                      src="/icons/pdf.svg"
                      alt="PDF"
                      className="w-[28px] h-[26px] mb-2"
                    />
                    <span className="text-[12px] text-[#333333] truncate max-w-[180px]">
                      {files.ownership.name}
                    </span>
                  </>
                ) : (
                  <>
                    <img
                      src="/icons/pdf.svg"
                      alt="Upload PDF"
                      className="w-[28px] h-[26px] mb-2"
                    />
                    <span className="text-center font-medium text-[12px]">
                      Browse PDF
                    </span>
                    <p className="text-center w-[240px] text-[12px] font-thin px-4">
                      Upload Property Ownership/ Tenancy Agreement
                      documentations
                    </p>
                  </>
                )}
              </label>
            </span>
          </div>

          {/* Upload 2 - Utility Bill */}
          <div>
            <label className="block text-[14px] font-medium text-[#333333]">
              Upload Utility Bill <span className="text-red-500">*</span>
            </label>
            <span className="border-[2.2px] mt-[10px] rounded-lg border-dashed border-[#D9D9D9] block">
              <label className="w-full h-[172px] bg-[#CCCCCC42] rounded-lg flex flex-col items-center justify-center cursor-pointer text-[#505050] font-medium text-[12px]">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, "utility")}
                />
                {files.utility ? (
                  <>
                    <img
                      src="/icons/camera.svg"
                      alt="Image"
                      className="w-[28px] h-[26px] mb-2"
                    />
                    <span className="text-[12px] text-[#333333] truncate max-w-[180px]">
                      {files.utility.name}
                    </span>
                  </>
                ) : (
                  <>
                    <img
                      src="/icons/camera.svg"
                      alt="Upload Image"
                      className="w-[28px] h-[26px] mb-2"
                    />
                    <span className="text-center font-medium text-[12px]">
                      Browse Image
                    </span>
                    <p className="text-center text-[12px] font-thin w-[250px] px-4">
                      Upload recent utility bill of this apartment not less than
                      3 months
                    </p>
                  </>
                )}
              </label>
            </span>
          </div>

          {/* Upload 3 - Authorization */}
          <div>
            <label className="block text-[14px] font-medium text-[#333333]">
              Authorization Document
            </label>
            <span className="border-[2.2px] mt-[10px] rounded-lg border-dashed border-[#D9D9D9] block">
              <label className="w-full h-[172px] bg-[#CCCCCC42] rounded-lg flex flex-col items-center justify-center cursor-pointer text-[#505050] font-medium text-[12px]">
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, "authorization")}
                />
                {files.authorization ? (
                  <>
                    <img
                      src="/icons/pdf.svg"
                      alt="PDF"
                      className="w-[28px] h-[26px] mb-2"
                    />
                    <span className="text-[12px] text-[#333333] truncate max-w-[180px]">
                      {files.authorization.name}
                    </span>
                  </>
                ) : (
                  <>
                    <img
                      src="/icons/pdf.svg"
                      alt="Upload PDF"
                      className="w-[28px] h-[26px] mb-2"
                    />
                    <span className="text-center font-medium text-[12px]">
                      Browse PDF
                    </span>
                    <p className="text-center text-[12px] font-thin w-[260px] px-4">
                      Upload an authorization or consent document with property
                      manager/ Landlord to shortlet this apartment
                    </p>
                  </>
                )}
              </label>
            </span>
          </div>

          {/* Next Button */}
          <Link to="/listing-overview">
            <div className="pt-[50px] pb-20">
              <Button text="Next" type="submit" />
            </div>
          </Link>
        </form>
      </div>
    </div>
  );
}
