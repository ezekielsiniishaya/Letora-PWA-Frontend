import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StateDropdown from "../../components/auth/StateDropDown";
import Dropdown from "../../components/dashboard/Dropdown";
import { Link } from "react-router-dom";

export default function BasicInfoPage() {
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);

  const apartmentOptions = [
    { label: "Self-Con/Studio", value: "Self-Con/Studio" },
    { label: "Mini Flat", value: "Mini Flat" },
    { label: "2-bedroom Apartment", value: "2-bedroom Apartment" },
    { label: "3-bedroom Apartment", value: "3-bedroom Apartment" },
    { label: "Entire Apartment", value: "Entire Apartment" },
    { label: "BO/Amex", value: "BO/Amex" },
    { label: "Duplex", value: "Duplex" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F9F9F9] px-[20px]">
      {/* Top bar */}
      <div className="flex justify-between items-center mt-5">
        <button onClick={() => navigate(-1)}>
          <img src="/icons/arrow-left.svg" alt="Back" className="w-5 h-4" />
        </button>
        <span className="text-[13.2px] font-medium bg-[#A20BA2] text-white px-[6.6px] w-[33px] h-[18.43px] flex items-center justify-center rounded-[7.92px]">
          1/8
        </span>
      </div>

      {/* Heading */}
      <header className="pt-4">
        <h1 className="text-[24px] font-medium text-[#0D1321]">Basic Info</h1>
        <p className="text-[#666666] text-[14px]">
          Let's start with some basic details
        </p>
      </header>

      {/* Form */}
      <div className="w-full max-w-sm">
        <form className="space-y-8">
          {/* Listing Title */}
          <div>
            <label className="block text-[14px] font-medium text-[#333333] mt-[42px]">
              Listing Title<span className="text-red-500 mr-1">*</span>
            </label>
            <input
              placeholder="Enter befitting title"
              type="text"
              className="border mt-[8px] w-full h-[48px] bg-white rounded-md px-4 py-2 text-sm"
            />
          </div>

          {/* Apartment Type (using Dropdown) */}
          <Dropdown
            label="Apartment Type"
            placeholder="Choose Options"
            heading="Select Apartment Type"
            options={apartmentOptions}
            required
            isOpen={openDropdown === "apartment"}
            onToggle={() =>
              setOpenDropdown(openDropdown === "apartment" ? null : "apartment")
            }
          />

          {/* State */}
          <div>
            <StateDropdown
              color="#333333"
              label="State"
              placeholder="Choose Location"
            />
          </div>

          {/* Town */}
          <div>
            <label className="block text-[14px] font-medium text-[#333333] mt-[32px]">
              Town<span className="text-red-500 mr-1">*</span>
            </label>
            <input
              placeholder="Enter town"
              type="text"
              className="border mt-[8px] w-full h-[48px] bg-white rounded-md px-4 mb-20 py-2 text-sm"
            />
          </div>

          {/* Next button */}
          <button
            type="button"
            onClick={() => navigate("/listing-apartment-details")}
            className="w-full bg-[#A20BA2] text-white text-[16px] font-medium py-3 rounded-md"
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
}
