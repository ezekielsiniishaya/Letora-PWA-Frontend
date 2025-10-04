import { useState } from "react";
import Button from "../../components/Button";
import { Link, useNavigate } from "react-router-dom";
import ShowSuccess from "../../components/ShowSuccess";
import Dropdown from "../../components/dashboard/Dropdown";
import { uploadBankDetailsAPI } from "../../services/hostApi.js";

export default function BankAccount() {
  const [selectedBank, setSelectedBank] = useState(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const bankOptions = [
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
  ];

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

    setIsLoading(true);
    setError("");

    try {
      // Prepare bank details - only bankName and accountNo needed
      const bankDetails = {
        bankName: selectedBank.label,
        accountNo: accountNumber,
        // accountName is no longer needed - backend will derive it from user profile
      };

      // Upload bank details to backend
      const response = await uploadBankDetailsAPI(bankDetails);

      console.log("Bank details uploaded successfully:", response);
      setIsSuccessOpen(true);
    } catch (err) {
      console.error("Error uploading bank details:", err);
      setError(
        err.message || "Failed to upload bank details. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOkay = () => {
    console.log("Closing success modal");
    setIsSuccessOpen(false);
    navigate("/guest-dashboard");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setError(""); // Clear error when interacting with dropdown
  };

  const handleAccountNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allow numbers
    setAccountNumber(value);
    setError(""); // Clear error when typing
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
          3/2
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
              setSelected={setSelectedBank}
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
            text={isLoading ? "Processing..." : "Create Account"}
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
