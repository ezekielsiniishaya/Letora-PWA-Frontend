import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Dropdown from "./Dropdown";
import { Link } from "react-router-dom";

export default function FilterPage() {
  const navigate = useNavigate();
  const [budget, setBudget] = useState(30000);
  const [openDropdown, setOpenDropdown] = useState(null); // which dropdown is open

  const apartmentOptions = [
    { label: "Self-Con/Studio", value: "Self-Con/Studio" },
    { label: "Mini Flat", value: "Mini Flat" },
    { label: "2-bedroom Apartment", value: "2-bedroom Apartment" },
    { label: "3-bedroom Apartment", value: "3-bedroom Apartment" },
    { label: "Entire Apartment", value: "Entire Apartment" },
    { label: "BO/Amex", value: "BO/Amex" },
    { label: "Duplex", value: "Duplex" },
  ];

  const ratingOptions = Array.from({ length: 6 }, (_, i) => ({
    label: `${i} Star${i !== 1 ? "s" : ""}`,
    value: i,
  }));

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
  const houseRulesOptions = [
    { label: "No Smoking", value: "no_smoking", icon: "/icons/no-smoking.svg" },
    {
      label: "Smoking Allowed",
      value: "smoking_allowed",
      icon: "/icons/smoking.svg",
    },
    {
      label: "Flush Properly",
      value: "flush_properly",
      icon: "/icons/flush.svg",
    },
    {
      label: "Dispose Wastes Properly",
      value: "dispose_wastes_properly",
      icon: "/icons/dispose.svg",
    },
    {
      label: "No Loud Music/Partying",
      value: "no_loud_music_partying",
      icon: "/icons/no-music.svg",
    },
    {
      label: "Partying Allowed",
      value: "partying_allowed",
      icon: "/icons/party.svg",
    },
    {
      label: "No Pets allowed",
      value: "no_pets_allowed",
      icon: "/icons/no-pets.svg",
    },
    {
      label: "Pets allowed",
      value: "pets_allowed",
      icon: "/icons/pets.svg",
    },
    { label: "No Crowds", value: "no_crowds", icon: "/icons/crowd.svg" },
    {
      label: "No Damage to Properties",
      value: "no_damage_to_properties",
      icon: "/icons/no-damage.svg",
    },
    {
      label: "Kids are Allowed",
      value: "kids_allowed",
      icon: "/icons/kids.svg",
    },
  ];
  const facilitiesOptions = [
    {
      label: "Laundry Service",
      value: "laundry_service",
      icon: "/icons/laundry.svg",
    },
    {
      label: "Washing Machine",
      value: "washing_machine",
      icon: "/icons/washing-machine.svg",
    },
    { label: "Chef Service", value: "chef_service", icon: "/icons/chef.svg" },
    {
      label: "Air conditioning",
      value: "air_conditioning",
      icon: "/icons/ac.svg",
    },
    {
      label: "Swimming pool",
      value: "swimming_pool",
      icon: "/icons/swimming.svg",
    },
    {
      label: "Generator Backup",
      value: "generator_backup",
      icon: "/icons/generator.svg",
    },
    { label: "Solar", value: "solar", icon: "/icons/solar.svg" },
    { label: "WiFi", value: "wifi", icon: "/icons/wifi.svg" },
    {
      label: "Play station",
      value: "play_station",
      icon: "/icons/playstation.svg",
    },
    { label: "Smart Home", value: "smart_home", icon: "/icons/smart-home.svg" },
    { label: "CCTV", value: "cctv", icon: "/icons/cctv.svg" },
    { label: "Gym", value: "gym", icon: "/icons/gym.svg" },
    {
      label: "DSTW Netflix",
      value: "dstw_netflix",
      icon: "/icons/dstv.svg",
    },
  ];
  return (
    <div className="w-full min-h-screen bg-[#F9F9F9]">
      {/* Header */}
      <div className="w-full px-[20px] py-[11.5px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-[8px]">
            <img
              src="/icons/arrow-left.svg"
              alt="Back"
              className="w-[16.67px] h-[8.33px] cursor-pointer"
              onClick={() => navigate(-1)}
            />
            <span className="text-[#333333] font-medium text-[13.2px]">
              Filters
            </span>
          </div>
          <span className="text-[#A20BA2] font-medium text-[12px] cursor-pointer">
            Reset
          </span>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 px-[20px] mt-[17px]">
        <form className="space-y-9">
          {/* Apartment Type */}
          <Dropdown
            label="Apartment Type"
            placeholder="Choose Option"
            heading="Select Apartment Type"
            options={apartmentOptions}
            required
            isOpen={openDropdown === "apartment"}
            onToggle={() =>
              setOpenDropdown(openDropdown === "apartment" ? null : "apartment")
            }
          />
          {/* Location */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Location
            </label>
            <input
              type="text"
              placeholder="Ikorodu, Lagos"
              className="w-full text-[#686464] text-[14px] rounded-lg px-3 py-2"
            />
          </div>

          {/* Budget Slider */}
          <div>
            <label className="block text-[14px] font-medium text-[#333333]">
              Budget <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center text-[14px] text-[#333333] justify-between mt-2">
              <span className="">Price</span>
              <span className="font-medium">N{budget.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={30000}
              max={1000000}
              step={1000}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full mt-3 slider-custom"
              style={{
                background: `linear-gradient(
                  to right, 
                  #A20BA2 0%, 
                  #A20BA2 ${((budget - 30000) / (1000000 - 30000)) * 100}%, 
                  #FBD0FB ${((budget - 30000) / (1000000 - 30000)) * 100}%, 
                  #FBD0FB 100%
                )`,
              }}
            />
          </div>
          {/* Ratings */}
          <Dropdown
            label="Ratings"
            placeholder="Choose Ratings"
            heading="Select Rating"
            options={ratingOptions}
            required
            isOpen={openDropdown === "ratings"}
            onToggle={() =>
              setOpenDropdown(openDropdown === "ratings" ? null : "ratings")
            }
          />
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
          {/* Guest Number */}
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
          {/* Kitchen Size */}
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
          {/* Parking Space */}
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
          {/* Facilities & Services */}
          <Dropdown
            label="Facilities & Services"
            placeholder="Select Options"
            heading="Select Facilities & Services"
            options={facilitiesOptions}
            required
            multiple={true} // enable multi-select circles
            isOpen={openDropdown === "facilities"}
            onToggle={() =>
              setOpenDropdown(
                openDropdown === "facilities" ? null : "facilities"
              )
            }
          />
          {/* House Rules */}
          <Dropdown
            label="House Rules"
            placeholder="Select Options"
            heading="Select House Rules"
            options={houseRulesOptions}
            required
            multiple={true} // enable multi-select circles
            isOpen={openDropdown === "houseRules"}
            onToggle={() =>
              setOpenDropdown(
                openDropdown === "houseRules" ? null : "houseRules"
              )
            }
          />
          {/* Proceed */}
          <div className="pt-[67px] pb-10">
            <Link to="/filtered-search">
              <Button text="Proceed" />
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
