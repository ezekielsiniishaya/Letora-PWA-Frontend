import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "../../components/Button";
import Dropdown from "../../components/dashboard/Dropdown";

export default function ListingApartmentDetails() {
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);

  const numberOptions = Array.from({ length: 5 }, (_, i) => ({
    label: `${i + 1}`,
    value: i + 1,
  }));

  const electricityOptions = [
    { label: "24/7", value: "24/7" },
    { label: "Band A", value: "Band A" },
    { label: "Band B", value: "Band B" },
    { label: "Band C", value: "Band C" },
    { label: "Unstable", value: "Unstable" },
  ];

  const guestOptions = [
    { label: "1", value: 1 },
    { label: "2", value: 2 },
    { label: "3", value: 3 },
    { label: "4", value: 4 },
    { label: "Many", value: "Many" },
  ];

  const kitchenOptions = [
    { label: "Small", value: "Small" },
    { label: "Medium", value: "Medium" },
    { label: "Big", value: "Big" },
  ];

  const parkingOptions = [
    { label: "Small", value: "Small" },
    { label: "Medium", value: "Medium" },
    { label: "Large", value: "Large" },
    { label: "None", value: "None" },
  ];

  return (
    <div className="w-full min-h-screen px-[20px] bg-[#F9F9F9]">
      {/* Top bar */}
      <div className="flex justify-between items-center pt-5">
        <button onClick={() => navigate(-1)}>
          <img src="/icons/arrow-left.svg" alt="Back" className="w-5 h-4" />
        </button>
        <span className="text-[13.2px] font-medium bg-[#A20BA2] text-white px-[6.6px] w-[33px] h-[18.43px] flex items-center justify-center rounded-[7.92px]">
          1/8
        </span>
      </div>

      {/* Heading */}
      <header className="pt-4">
        <h1 className="text-[24px] font-medium text-[#0D1321]">
          Apartment Details
        </h1>
        <p className="text-[#666666] text-[14px]">
          Now let’s start with your Shortlet details
        </p>
      </header>

      {/* Form */}
      <div className="flex-1 mt-[40px]">
        <form className="space-y-9">
          {/* Bedrooms */}
          <Dropdown
            label="Bedrooms"
            placeholder="Choose Number"
            heading="Select Number of Bedrooms"
            options={numberOptions}
            required
            isOpen={openDropdown === "bedrooms"}
            onToggle={() =>
              setOpenDropdown(openDropdown === "bedrooms" ? null : "bedrooms")
            }
          />

          {/* Bathrooms */}
          <Dropdown
            label="Bathroom Number"
            placeholder="Choose Number"
            heading="Select Number of Bathrooms"
            options={numberOptions}
            required
            isOpen={openDropdown === "bathrooms"}
            onToggle={() =>
              setOpenDropdown(openDropdown === "bathrooms" ? null : "bathrooms")
            }
          />

          {/* Electricity */}
          <Dropdown
            label="Electricity Choice"
            placeholder="Select Electricity"
            heading="Select Electricity Choice"
            options={electricityOptions}
            required
            isOpen={openDropdown === "electricity"}
            onToggle={() =>
              setOpenDropdown(
                openDropdown === "electricity" ? null : "electricity"
              )
            }
          />

          {/* Guests */}
          <Dropdown
            label="Guest Number"
            placeholder="Choose Number"
            heading="Guest Number"
            options={guestOptions}
            required
            isOpen={openDropdown === "guests"}
            onToggle={() =>
              setOpenDropdown(openDropdown === "guests" ? null : "guests")
            }
          />

          {/* Parking */}
          <Dropdown
            label="Parking Space"
            placeholder="Choose Option"
            heading="Select Choice"
            options={parkingOptions}
            required
            isOpen={openDropdown === "parking"}
            onToggle={() =>
              setOpenDropdown(openDropdown === "parking" ? null : "parking")
            }
          />

          {/* Kitchen */}
          <Dropdown
            label="Kitchen Size"
            placeholder="Choose Option"
            heading="Select Choice"
            options={kitchenOptions}
            required
            isOpen={openDropdown === "kitchen"}
            onToggle={() =>
              setOpenDropdown(openDropdown === "kitchen" ? null : "kitchen")
            }
          />
          {/* Short Description */}
          <div>
            <label className="block text-[14px] font-medium text-[#333333] mb-2">
              Give a Short Description of the apartment
              <span className="text-red-500 mr-1">*</span>
            </label>
            <textarea
              placeholder="Enter text..."
              rows={4}
              className="w-full border rounded-[5px] px-3 py-2 text-sm text-[#686464] bg-white h-[137px]"
            />
          </div>

          {/* Next Button */}
          <div className="pt-[27px] pb-20">
            <Link to="/facilities">
              <Button text="Next" />
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
