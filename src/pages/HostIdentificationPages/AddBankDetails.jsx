import { useState, useEffect, useMemo } from "react";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import ShowSuccess from "../../components/ShowSuccess";
import Dropdown from "../../components/dashboard/Dropdown";
import { useHostProfile } from "../../contexts/HostProfileContext";
import { createHostProfileAPI } from "../../services/hostApi.js";

export default function BankAccount() {
  const [selectedBank, setSelectedBank] = useState(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Use the host profile context to access collected data
  const { hostProfileData, updateBankingInfo, clearHostProfileData } =
    useHostProfile();

  const bankOptions = useMemo(
    () => [
      {
        label: "Access Bank",
        value: "access_bank",
        code: "044",
        icon: "/icons/access.svg",
      },
      {
        label: "Citibank Nigeria",
        value: "citibank_nigeria",
        code: "023",
        icon: "/icons/citibank.svg",
      },
      {
        label: "Ecobank Nigeria",
        value: "ecobank_nigeria",
        code: "050",
        icon: "/icons/eco.svg",
      },
      {
        label: "Fidelity Bank",
        value: "fidelity_bank",
        code: "070",
        icon: "/icons/fidelity.svg",
      },
      {
        label: "First Bank of Nigeria",
        value: "first_bank_nigeria",
        code: "011",
        icon: "/icons/firstbank.svg",
      },
      {
        label: "First City Monument Bank",
        value: "first_city_monument_bank",
        code: "214",
        icon: "/icons/fcmb.svg",
      },
      {
        label: "Globus Bank",
        value: "globus_bank",
        code: "00103",
        icon: "/icons/globus.svg",
      },
      {
        label: "Guaranty Trust Bank",
        value: "guaranty_trust_bank",
        code: "058",
        icon: "/icons/gt.svg",
      },
      {
        label: "Keystone Bank",
        value: "keystone_bank",
        code: "082",
        icon: "/icons/keystone.svg",
      },
      {
        label: "Polaris Bank",
        value: "polaris_bank",
        code: "076",
        icon: "/icons/polaris.svg",
      },
      {
        label: "Providos Bank",
        value: "providos_bank",
        code: "101",
        icon: "/icons/providos.svg",
      },
      {
        label: "Stanbic IBTC Bank",
        value: "stanbic_ibtc_bank",
        code: "221",
        icon: "/icons/stanbic.svg",
      },
      {
        label: "Standard Chartered Bank Nigeria",
        value: "standard_chartered_nigeria",
        code: "068",
        icon: "/icons/standard.svg",
      },
      {
        label: "Sterling Bank",
        value: "sterling_bank",
        code: "232",
        icon: "/icons/sterling.svg",
      },
      {
        label: "SunTrust Bank Nigeria",
        value: "suntrust_bank_nigeria",
        code: "100",
        icon: "/icons/suntrust.svg",
      },
      {
        label: "Union Bank of Nigeria",
        value: "union_bank_nigeria",
        code: "032",
        icon: "/icons/union.svg",
      },
      {
        label: "United Bank for Africa (UBA)",
        value: "uba",
        code: "033",
        icon: "/icons/uba.svg",
      },
      {
        label: "Unity Bank",
        value: "unity_bank",
        code: "215",
        icon: "/icons/unity.svg",
      },
      {
        label: "Wema Bank",
        value: "wema_bank",
        code: "035",
        icon: "/icons/wema.svg",
      },
      {
        label: "Zenith Bank",
        value: "zenith_bank",
        code: "057",
        icon: "/icons/zenith.svg",
      },
    ],
    []
  );
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
  }, [bankOptions, hostProfileData.bankingInfo]);

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

    // Validation
    if (!selectedBank) {
      setError("Please select a bank");
      return;
    }

    if (!accountNumber || accountNumber.length !== 10) {
      setError("Please enter a valid 10-digit account number");
      return;
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

    if (!idCard) {
      setError(
        "ID Card document is missing. Please complete the ID card upload step first."
      );
      return;
    }

    if (!idPhotograph) {
      setError(
        "ID Photograph document is missing. Please complete the selfie upload step first."
      );
      return;
    }

    setIsLoading(true);
    setError("");

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

      // Call API
      const response = await createHostProfileAPI(formData);
      console.log("Host profile created successfully:", response);

      // Clear the local storage draft after successful submission
      clearHostProfileData();
      setIsSuccessOpen(true);
    } catch (err) {
      console.error("Error creating host profile:", err);
      setError(
        err.message || "Failed to create host profile. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };
  // ... rest of your component remains the same
  const handleOkay = () => {
    console.log("Closing success modal");
    setIsSuccessOpen(false);
    navigate("/guest-homepage");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setError("");
  };

  const handleAccountNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setAccountNumber(value);
    setError("");
  };

  const handleBankSelect = (bank) => {
    setSelectedBank(bank);
    setError("");
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

        <form
          className="mt-[32px] flex flex-col"
          onSubmit={handleCreateAccount}
        >
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Bank Name Dropdown */}
          <div className="mb-[20px]">
            <Dropdown
              label="Select Bank"
              placeholder="Choose your bank"
              options={bankOptions}
              required={true}
              heading="Select Bank"
              isOpen={isDropdownOpen}
              onToggle={toggleDropdown}
              multiple={false}
              selected={selectedBank}
              setSelected={handleBankSelect}
            />
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
              className="border mt-[8px] w-full h-[48px] rounded-md px-3 py-2 text-sm focus:ring-[#A20BA2] focus:border-[#A20BA2] outline-none"
              placeholder="Enter account number"
            />
            {accountNumber && accountNumber.length !== 10 && (
              <p className="text-red-500 text-xs mt-1">
                Account number must be 10 digits
              </p>
            )}
          </div>

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
          <p className="text-[12px] text-[#666666] font-medium text-center mb-[20px] leading-snug">
            By clicking on Submit, you accept the Terms and Conditions, and
            Privacy Policies
          </p>

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
