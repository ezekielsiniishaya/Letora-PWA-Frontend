export default function LandlordForm({ files, onFileChange }) {
  return (
    <div className="space-y-8">
      {/* Upload 1 - Proof of Ownership */}
      <div>
        <label className="block text-[14px] font-medium text-[#333333]">
          Upload Document <span className="text-red-500">*</span>
        </label>
        <span className="border-[2.2px] mt-[10px] rounded-lg border-dashed border-[#D9D9D9] block">
          <label className="w-full h-[172px] bg-[#CCCCCC42] rounded-lg flex flex-col items-center justify-center cursor-pointer text-[#505050] font-medium text-[12px]">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => onFileChange(e, "proof_of_ownership")}
            />
            {files.proof_of_ownership ? (
              <>
                <img
                  src="/icons/pdf.svg"
                  alt="Document"
                  className="w-[28px] h-[26px] mb-2"
                />
                <span className="text-[12px] text-[#333333] truncate max-w-[180px]">
                  {files.proof_of_ownership.name}
                </span>
              </>
            ) : (
              <>
                <img
                  src="/icons/pdf.svg"
                  alt="Upload Document"
                  className="w-[28px] h-[26px] mb-2"
                />
                <span className="text-center font-medium text-[10px]">
                  Browse PDF
                </span>
                <p className="text-center w-[240px] text-[10px] font-thin px-4">
                  Upload Property Ownership (C of O, deed, allocation, survey,
                  purchase receipt).
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
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => onFileChange(e, "utility_bill")}
            />
            {files.utility_bill ? (
              <>
                <img
                  src="/icons/camera.svg"
                  alt="Utility Bill"
                  className="w-[28px] h-[26px] mb-2"
                />
                <span className="text-[12px] text-[#333333] truncate max-w-[180px]">
                  {files.utility_bill.name}
                </span>
              </>
            ) : (
              <>
                <img
                  src="/icons/camera.svg"
                  alt="Upload Utility Bill"
                  className="w-[28px] h-[26px] mb-2"
                />
                <span className="text-center font-medium text-[10px]">
                  Browse Image
                </span>
                <p className="text-center text-[10px] font-thin w-[250px] px-4">
                  Upload recent utility bill of this apartment not less than 3
                  months)
                </p>
              </>
            )}
          </label>
        </span>
      </div>
    </div>
  );
}
