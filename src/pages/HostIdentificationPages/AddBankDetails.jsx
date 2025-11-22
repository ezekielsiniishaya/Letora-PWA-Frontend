import { useState, useEffect, useMemo } from "react";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import ShowSuccess from "../../components/ShowSuccess";
import Dropdown from "../../components/dashboard/Dropdown";
import { useHostProfile } from "../../contexts/HostProfileContext";
import { createHostProfileAPI } from "../../services/hostApi.js";
import Alert from "../../components/utils/Alerts.jsx";
import bankOptions from "../../components/dashboard/BankingOptions.js";

export default function BankAccount() {
  const [selectedBank, setSelectedBank] = useState(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    bank: "",
    accountNumber: "",
    documents: "",
  });
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Use the host profile context to access collected data
  const { hostProfileData, updateBankingInfo, clearHostProfileData } =
    useHostProfile();

  const memoizedBankOptions = useMemo(() => bankOptions, []);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const clearFieldErrors = () => {
    setFieldErrors({
      bank: "",
      accountNumber: "",
      documents: "",
    });
  };

  // Load existing banking info from context
  useEffect(() => {
    if (
      hostProfileData.bankingInfo.bankName &&
      hostProfileData.bankingInfo.accountNo
    ) {
      const existingBank = bankOptions.find(
        (bank) => bank.label === hostProfileData.bankingInfo.bankName
      );
      if (existingBank) {
        setSelectedBank(existingBank);
      }
      setAccountNumber(hostProfileData.bankingInfo.accountNo);
    }
  }, [hostProfileData.bankingInfo]);

  // Debug: Check what documents we have
  useEffect(() => {
    console.log(
      "Current verification documents in context:",
      hostProfileData.verificationDocuments
    );

    hostProfileData.verificationDocuments.forEach((doc, index) => {
      console.log(`Document ${index}:`, {
        type: doc.type,
        hasUrl: !!doc.url,
        hasFile: !!doc.file,
        fileName: doc.name,
        urlType: doc.url?.substring(0, 20), // Show first 20 chars of URL
      });
    });
  }, [hostProfileData.verificationDocuments]);

  // Convert base64 URL back to File object for upload
  const base64ToFile = (base64String, filename, mimeType) => {
    const byteString = atob(base64String.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new File([ab], filename, { type: mimeType });
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Clear previous errors
    clearFieldErrors();
    setAlert(null);

    const newErrors = {
      bank: "",
      accountNumber: "",
      documents: "",
    };

    // Validation
    if (!selectedBank) {
      newErrors.bank = "Please select a bank";
    }

    if (!accountNumber) {
      newErrors.accountNumber = "This field is required";
    } else if (accountNumber.length !== 10) {
      newErrors.accountNumber = "Account number must be 10 digits";
    }

    // Check if we have BOTH required documents
    const idCard = hostProfileData.verificationDocuments.find(
      (doc) => doc.type === "ID_CARD" && doc.url
    );
    const idPhotograph = hostProfileData.verificationDocuments.find(
      (doc) => doc.type === "ID_PHOTOGRAPH" && doc.url
    );

    console.log("Found ID Card:", idCard);
    console.log("Found ID Photograph:", idPhotograph);

    if (!idCard || !idPhotograph) {
      newErrors.documents = "Please complete both ID verification steps first";
    }

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some((error) => error !== "");

    if (hasErrors) {
      setFieldErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Create banking info object
      const bankingInfo = {
        bankName: selectedBank.label,
        accountNo: accountNumber,
        accountBalance: 0,
      };

      // Save banking info to context
      updateBankingInfo(bankingInfo);

      // Create FormData
      const formData = new FormData();

      // Append banking info as JSON string
      formData.append("bankingInfo", JSON.stringify(bankingInfo));

      // Append BOTH documents - ID_CARD and ID_PHOTOGRAPH
      const documentsToUpload = [
        { doc: idCard, type: "ID_CARD" },
        { doc: idPhotograph, type: "ID_PHOTOGRAPH" },
      ];

      for (const { doc, type } of documentsToUpload) {
        if (doc.url) {
          let fileToUpload;

          if (doc.url.startsWith("data:")) {
            // Convert base64 back to File object
            fileToUpload = base64ToFile(
              doc.url,
              doc.name || `document_${doc.type}`,
              doc.fileType || "image/jpeg"
            );
          } else if (doc.file) {
            // Use existing File object
            fileToUpload = doc.file;
          } else {
            console.warn(`Document ${doc.type} has URL but no file data`);
            continue;
          }

          formData.append("documents", fileToUpload);
          formData.append("documentTypes", type);

          console.log(`Appending document:`, {
            type: type,
            name: fileToUpload.name,
            size: fileToUpload.size,
          });
        }
      }

      // Debug: Log FormData contents
      console.log("FormData contents:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ":", pair[1]);
      }

      // Verify we're sending both document types
      const documentTypes = formData.getAll("documentTypes");
      console.log("Document types being sent:", documentTypes);

      if (
        documentTypes.length !== 2 ||
        !documentTypes.includes("ID_CARD") ||
        !documentTypes.includes("ID_PHOTOGRAPH")
      ) {
        throw new Error(
          "Missing required documents. Please ensure both ID Card and Selfie are uploaded."
        );
      }

      // Call API - ✅ This is where we interact with the database
      const response = await createHostProfileAPI(formData);
      console.log("Host profile created successfully:", response);

      // Clear the local storage draft after successful submission
      clearHostProfileData();

      setIsSuccessOpen(true);
    } catch (err) {
      console.error("Error creating host profile:", err);

      // ✅ Enhanced error handler with user-friendly messages
      const getErrorMessage = (error) => {
        // Network errors
        if (!error.response) {
          return "Network issues. Get better reception and try again";
        }

        const status = error.response.status;
        const backendMsg =
          error.response.data?.error || error.response.data?.message || "";
        const errorMsg = String(backendMsg).toLowerCase();

        console.log("Backend error:", backendMsg);
        console.log("Status code:", status);

        // Database errors - provide generic message
        if (
          errorMsg.includes("database") ||
          errorMsg.includes("prisma") ||
          errorMsg.includes("query") ||
          errorMsg.includes("orm") ||
          errorMsg.includes("connection") ||
          errorMsg.includes("neon.tech") ||
          errorMsg.includes("sql") ||
          errorMsg.includes("constraint") ||
          errorMsg.includes("unique constraint") ||
          errorMsg.includes("foreign key") ||
          errorMsg.includes("timeout") ||
          errorMsg.includes("connection pool") ||
          errorMsg.includes("transaction") ||
          errorMsg.includes("deadlock")
        ) {
          return "Server temporarily unavailable. Please try again in a moment.";
        }

        // Cloudinary/File upload errors
        if (
          errorMsg.includes("cloudinary") ||
          errorMsg.includes("upload") ||
          errorMsg.includes("file") ||
          errorMsg.includes("storage")
        ) {
          return "File upload failed. Please try uploading your documents again.";
        }

        // Server errors (5xx)
        if (status >= 500) {
          return "Server temporarily unavailable. Please try again later.";
        }

        // Client errors (4xx) - show user-friendly backend messages
        if (status >= 400 && status < 500) {
          // Map common backend errors to user-friendly messages
          const errorMappings = {
            "user not found":
              "Account not found. Please verify your email first.",
            "both id card and id photograph are required":
              "Please complete both ID verification steps first.",
            "failed to upload documents":
              "Document upload failed. Please try uploading your documents again.",
            "missing required documents":
              "Please complete both ID verification steps first.",
            "invalid account number": "Please enter a valid account number.",
            "bank name and account number are required":
              "Please fill in all bank details.",
          };

          // Check if we have a mapped message for this error
          for (const [key, message] of Object.entries(errorMappings)) {
            if (errorMsg.includes(key)) {
              return message;
            }
          }

          // Fallback: use backend message if it's user-friendly, otherwise generic message
          if (
            backendMsg &&
            backendMsg.length < 100 &&
            !backendMsg.includes("prisma")
          ) {
            return backendMsg;
          }

          return "Request failed. Please check your information and try again.";
        }

        // Default fallback
        return "Something went wrong. Please try again.";
      };

      const errorMessage = getErrorMessage(err);
      showAlert("error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOkay = () => {
    console.log("Closing success modal");
    setIsSuccessOpen(false);
    navigate("/guest-homepage");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    clearFieldErrors();
  };

  const handleAccountNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setAccountNumber(value);
    if (fieldErrors.accountNumber) {
      setFieldErrors((prev) => ({ ...prev, accountNumber: "" }));
    }
  };

  const handleBankSelect = (bank) => {
    setSelectedBank(bank);
    if (fieldErrors.bank) {
      setFieldErrors((prev) => ({ ...prev, bank: "" }));
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
          3/3
        </span>
      </div>

      {/* Content */}
      <div className="w-full max-w-sm mt-[26px]">
        <h2 className="text-[24px] font-medium text-[#0D1321]">Bank Account</h2>
        <p className="text-[14px] text-[#666666] mt-[4px]">
          Yeah, We need to pay you 😏
        </p>

        {/* ✅ Alert display - ONLY for backend responses */}
        {alert && (
          <div className="mt-4">
            <Alert type={alert.type} message={alert.message} />
          </div>
        )}

        <form
          className="mt-[32px] flex flex-col"
          onSubmit={handleCreateAccount}
        >
          {/* Bank Name Dropdown */}
          <div className="mb-[20px]">
            <Dropdown
              label="Select Bank"
              placeholder="Choose your bank"
              options={memoizedBankOptions}
              required={true}
              heading="Select Bank"
              isOpen={isDropdownOpen}
              onToggle={toggleDropdown}
              multiple={false}
              selected={selectedBank}
              setSelected={handleBankSelect}
              hasError={!!fieldErrors.bank}
              showIndicators={false}
            />
            {/* ✅ Inline error for bank selection */}
            {fieldErrors.bank && (
              <p className="text-[#F81A0C] text-[12px] mt-1">
                {fieldErrors.bank}
              </p>
            )}
          </div>

          {/* Account Number */}
          <div className="mb-[104px]">
            <label className="text-[14px] font-medium text-[#333333]">
              Enter 10 digit Account Number{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={accountNumber}
              onChange={handleAccountNumberChange}
              maxLength={10}
              className={`border mt-[8px] w-full h-[48px] rounded-md px-3 py-2 text-sm focus:ring-[#A20BA2] focus:border-[#A20BA2] outline-none ${
                fieldErrors.accountNumber ? "border-[#F81A0C]" : "border-[#CCC]"
              }`}
              placeholder="Enter account number"
            />
            {/* ✅ Inline error for account number */}
            {fieldErrors.accountNumber && (
              <p className="text-[#F81A0C] text-[12px] mt-1">
                {fieldErrors.accountNumber}
              </p>
            )}
          </div>

          {/* ✅ Documents error message */}
          {fieldErrors.documents && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
              {fieldErrors.documents}
            </div>
          )}

          {/* Info Box */}
          <div className="flex items-start gap-2 font-regular bg-[#feeffa] text-[#500450] text-[12px] p-3 rounded-md mb-[98px]">
            <img
              src="/icons/info.svg"
              alt="Info"
              className="w-[25px] h-[25px] mt-[5px]"
            />
            <span>
              Submitted account details cannot be modified for the first 3
              months.
            </span>
          </div>

          {/* Terms */}

          <Button
            text={isLoading ? "Please wait..." : "Submit"}
            className="mt-[20px] w-full"
            onClick={handleCreateAccount}
            type="submit"
            disabled={isLoading || !selectedBank || accountNumber.length !== 10}
          />

          {isSuccessOpen && (
            <ShowSuccess
              image="/icons/Illustration.svg"
              heading="Your Account Setup is Complete"
              message="Our team will now review your submission for verification. This typically takes a few minutes to a few hours."
              buttonText="Done"
              onClose={handleOkay}
              className="h-300px"
            />
          )}
        </form>
      </div>
    </div>
  );
}
