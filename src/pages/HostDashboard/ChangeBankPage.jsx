import { useState } from "react";
import Button from "../../components/Button";
import { Link, useNavigate } from "react-router-dom";
import ShowSuccess from "../../components/ShowSuccess";
import Dropdown from "../../components/dashboard/Dropdown"; // Import the Dropdown component

export default function BankAccount() {
  const [selectedBank, setSelectedBank] = useState(null);
  const [accountNumber, setAccountNumber] = useState("");
  const navigate = useNavigate();
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const bankOptions = [
    {
      label: "Access Bank",
      value: "access_bank",
      icon: "/icons/access.svg",
    },
    {
      label: "Citibank Nigeria",
      value: "citibank_nigeria",
      icon: "/icons/citibank.svg",
    },
    {
      label: "Ecobank Nigeria",
      value: "ecobank_nigeria",
      icon: "/icons/eco.svg",
    },
    {
      label: "Fidelity Bank",
      value: "fidelity_bank",
      icon: "/icons/fidelity.svg",
    },
    {
      label: "First Bank of Nigeria",
      value: "first_bank_nigeria",
      icon: "/icons/firstbank.svg",
    },
    {
      label: "First City Monument Bank",
      value: "first_city_monument_bank",
      icon: "/icons/fcmb.svg",
    },
    {
      label: "Globus Bank",
      value: "globus_bank",
      icon: "/icons/globus.svg",
    },
    {
      label: "Guaranty Trust Bank",
      value: "guaranty_trust_bank",
      icon: "/icons/gt.svg",
    },
    {
      label: "Keystone Bank",
      value: "keystone_bank",
      icon: "/icons/keystone.svg",
    },
    {
      label: "Polaris Bank",
      value: "polaris_bank",
      icon: "/icons/polaris.svg",
    },
    {
      label: "Providos Bank",
      value: "providos_bank",
      icon: "/icons/providos.svg",
    },
    {
      label: "Stanbic IBTC Bank",
      value: "stanbic_ibtc_bank",
      icon: "/icons/stanbic.svg",
    },
    {
      label: "Standard Chartered Bank Nigeria",
      value: "standard_chartered_nigeria",
      icon: "/icons/standard.svg",
    },
    {
      label: "Sterling Bank",
      value: "sterling_bank",
      icon: "/icons/sterling.svg",
    },
    {
      label: "SunTrust Bank Nigeria",
      value: "suntrust_bank_nigeria",
      icon: "/icons/suntrust.svg",
    },
    {
      label: "Union Bank of Nigeria",
      value: "union_bank_nigeria",
      icon: "/icons/union.svg",
    },
    {
      label: "United Bank for Africa (UBA)",
      value: "uba",
      icon: "/icons/uba.svg",
    },
    { label: "Unity Bank", value: "unity_bank", icon: "/icons/unity.svg" },
    { label: "Wema Bank", value: "wema_bank", icon: "/icons/wema.svg" },
    {
      label: "Zenith Bank",
      value: "zenith_bank",
      icon: "/icons/zenith.svg",
    },
  ];

  const handleCreateAccount = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Opening success modal");
    setIsSuccessOpen(true);
  };

  const handleOkay = () => {
    console.log("Closing success modal");
    setIsSuccessOpen(false);
    navigate("/profile");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
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

        <form className="mt-[32px] flex flex-col">
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
              onChange={(e) => setAccountNumber(e.target.value)}
              className="border mt-[8px] w-full h-[48px] rounded-md px-3 py-2 text-sm focus:ring-[#A20BA2] focus:border-[#A20BA2] outline-none"
            />
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
            text="Submit"
            className="mt-[20px] w-full"
            onClick={handleCreateAccount}
            type="button"
          />
          {isSuccessOpen && (
            <ShowSuccess
              image="/icons/Illustration.svg"
              heading="Successful Bank Change"
              message=" "
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
