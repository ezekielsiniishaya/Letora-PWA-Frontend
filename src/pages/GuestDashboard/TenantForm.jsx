export default function TenantForm({ files, onFileChange, fieldErrors }) {
  return (
    <div className="space-y-8">
      {/* Upload 1 - Tenancy Agreement */}
      <div>
        <label className="block text-[14px] font-medium text-[#333333]">
          Upload Document <span className="text-red-500">*</span>
        </label>
        <label
          className={`w-full h-[172px] rounded-lg flex flex-col items-center justify-center cursor-pointer text-[#505050] font-medium text-[12px] bg-white mt-[10px]`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='8' ry='8' stroke='%23${
              fieldErrors.tenancy_agreement ? "F81A0C" : "D9D9D9"
            }' stroke-width='2' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`,
          }}
        >
          <input
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => onFileChange(e, "tenancy_agreement")}
          />
          {files.tenancy_agreement ? (
            <>
              <img
                src="/icons/pdf.svg"
                alt="Tenancy Agreement"
                className="w-[28px] h-[26px] mb-2"
              />
              <span className="text-[12px] text-[#333333] truncate max-w-[180px]">
                {files.tenancy_agreement.name}
              </span>
            </>
          ) : (
            <>
              <img
                src="/icons/pdf.svg"
                alt="Upload Tenancy Agreement"
                className="w-[28px] h-[26px] mb-2"
              />
              <span className="text-center font-medium text-[10px]">
                Browse Document
              </span>
              <p className="text-center w-[240px] text-[10px] font-thin px-4">
                Tenancy Agreement documentations
              </p>
            </>
          )}
        </label>
        {fieldErrors.tenancy_agreement && (
          <p className="text-[#F81A0C] text-[10px] mt-1">
            {fieldErrors.tenancy_agreement}
          </p>
        )}
      </div>

      {/* Upload 2 - Utility Bill */}
      <div>
        <label className="block text-[14px] font-medium text-[#333333]">
          Upload Utility Bill <span className="text-red-500">*</span>
        </label>
        <label
          className={`w-full h-[172px] rounded-lg flex flex-col items-center justify-center cursor-pointer text-[#505050] font-medium text-[12px] bg-white mt-[10px]`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='8' ry='8' stroke='%23${
              fieldErrors.utility_bill ? "F81A0C" : "D9D9D9"
            }' stroke-width='2' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`,
          }}
        >
          <input
            type="file"
            accept="image/*,.jpg,.jpeg,.png,.webp,.gif"
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
              <p className="text-center text-[12px] font-thin w-[250px] px-4">
                Upload recent utility bill of this apartment not less than 3
                months
              </p>
            </>
          )}
        </label>
        {fieldErrors.utility_bill && (
          <p className="text-[#F81A0C] text-[10px] mt-1">
            {fieldErrors.utility_bill}
          </p>
        )}
      </div>

      {/* Upload 3 - Authorization Document */}
      <div>
        <label className="block text-[14px] font-medium text-[#333333]">
          Authorization Document <span className="text-red-500">*</span>
        </label>
        <label
          className={`w-full h-[172px] rounded-lg flex flex-col items-center justify-center cursor-pointer text-[#505050] font-medium text-[12px] bg-white mt-[10px]`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='8' ry='8' stroke='%23${
              fieldErrors.authorization_document ? "F81A0C" : "D9D9D9"
            }' stroke-width='2' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`,
          }}
        >
          <input
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => onFileChange(e, "authorization_document")}
          />
          {files.authorization_document ? (
            <>
              <img
                src="/icons/pdf.svg"
                alt="Authorization"
                className="w-[28px] h-[26px] mb-2"
              />
              <span className="text-[12px] text-[#333333] truncate max-w-[180px]">
                {files.authorization_document.name}
              </span>
            </>
          ) : (
            <>
              <img
                src="/icons/pdf.svg"
                alt="Upload Authorization"
                className="w-[28px] h-[26px] mb-2"
              />
              <span className="text-center font-medium text-[10px]">
                Browse PDF
              </span>
              <p className="text-center text-[10px] font-thin w-[260px] px-4">
                Upload an authorization or consent document with property
                manager/ Landlord to shortlet this apartment
              </p>
            </>
          )}
        </label>
        {fieldErrors.authorization_document && (
          <p className="text-[#F81A0C] text-[10px] mt-1">
            {fieldErrors.authorization_document}
          </p>
        )}
      </div>
    </div>
  );
}
