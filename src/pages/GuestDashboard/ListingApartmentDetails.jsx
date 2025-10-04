import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Dropdown from "../../components/dashboard/Dropdown";
import { useApartmentCreation } from "../../hooks/useApartmentCreation";

export default function ListingApartmentDetails() {
  const navigate = useNavigate();
  const { apartmentData, updateDetails, setCurrentStep } =
    useApartmentCreation();

  const [openDropdown, setOpenDropdown] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Use existing data or initialize empty
  const [formData, setFormData] = useState({
    bedrooms: apartmentData.details?.bedrooms?.toString() || "",
    bathrooms: apartmentData.details?.bathrooms?.toString() || "",
    electricity: apartmentData.details?.electricity || "",
    guests: apartmentData.details?.guestNumber || "",
    parking: apartmentData.details?.parkingSpace || "",
    kitchen: apartmentData.details?.kitchenSize || "",
    description: apartmentData.details?.description || "",
  });

  const numberOptions = Array.from({ length: 5 }, (_, i) => ({
    label: `${i + 1}`,
    value: i + 1,
  }));

  const electricityOptions = [
    { label: "24/7", value: "TWENTY_FOUR_SEVEN" },
    { label: "Band A", value: "BAND_A" },
    { label: "Band B", value: "BAND_B" },
    { label: "Band C", value: "BAND_C" },
    { label: "Unstable", value: "UNSTABLE" },
  ];

  const guestOptions = [
    { label: "1", value: "ONE" },
    { label: "2", value: "TWO" },
    { label: "3", value: "THREE" },
    { label: "4", value: "FOUR" },
    { label: "Many", value: "MANY" },
  ];

  const kitchenOptions = [
    { label: "Small", value: "SMALL" },
    { label: "Medium", value: "MEDIUM" },
    { label: "Big", value: "BIG" },
  ];

  const parkingOptions = [
    { label: "Small", value: "SMALL" },
    { label: "Medium", value: "MEDIUM" },
    { label: "Large", value: "LARGE" },
    { label: "None", value: "NONE" },
  ];

  const handleDropdownChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate required fields
      const requiredFields = [
        "bedrooms",
        "bathrooms",
        "electricity",
        "guests",
        "parking",
        "kitchen",
        "description",
      ];
      const missingFields = requiredFields.filter((field) => !formData[field]);

      if (missingFields.length > 0) {
        setError("Please fill in all required fields");
        setLoading(false);
        return;
      }

      // Prepare data for context
      const detailsData = {
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        electricity: formData.electricity,
        guestNumber: formData.guests,
        parkingSpace: formData.parking,
        kitchenSize: formData.kitchen,
        description: formData.description,
      };

      // Save to context
      updateDetails(detailsData);

      // Update current step
      setCurrentStep(3);

      // Navigate to next step - NO API CALL!
      navigate("/facilities");
    } catch (err) {
      console.error("Error saving apartment details:", err);
      setError("An error occurred while saving details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen px-[20px] bg-[#F9F9F9]">
      {/* Top bar */}
      <div className="flex justify-between items-center pt-5">
        <button onClick={() => navigate(-1)}>
          <img src="/icons/arrow-left.svg" alt="Back" className="w-5 h-4" />
        </button>
        <span className="text-[13.2px] font-medium bg-[#A20BA2] text-white px-[6.6px] w-[33px] h-[18.43px] flex items-center justify-center rounded-[7.92px]">
          2/8
        </span>
      </div>

      {/* Heading */}
      <header className="pt-4">
        <h1 className="text-[24px] font-medium text-[#0D1321]">
          Apartment Details
        </h1>
        <p className="text-[#666666] text-[14px]">
          Now let's start with your Shortlet details
        </p>
      </header>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Form */}
      <div className="flex-1 mt-[40px]">
        <form className="space-y-9" onSubmit={handleSubmit}>
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
            selected={
              formData.bedrooms
                ? {
                    label: formData.bedrooms.toString(),
                    value: formData.bedrooms,
                  }
                : null
            }
            setSelected={(value) =>
              handleDropdownChange("bedrooms", value.value)
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
            selected={
              formData.bathrooms
                ? {
                    label: formData.bathrooms.toString(),
                    value: formData.bathrooms,
                  }
                : null
            }
            setSelected={(value) =>
              handleDropdownChange("bathrooms", value.value)
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
            selected={
              electricityOptions.find(
                (opt) => opt.value === formData.electricity
              ) || null
            }
            setSelected={(value) =>
              handleDropdownChange("electricity", value.value)
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
            selected={
              guestOptions.find((opt) => opt.value === formData.guests) || null
            }
            setSelected={(value) => handleDropdownChange("guests", value.value)}
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
            selected={
              parkingOptions.find((opt) => opt.value === formData.parking) ||
              null
            }
            setSelected={(value) =>
              handleDropdownChange("parking", value.value)
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
            selected={
              kitchenOptions.find((opt) => opt.value === formData.kitchen) ||
              null
            }
            setSelected={(value) =>
              handleDropdownChange("kitchen", value.value)
            }
          />

          {/* Short Description */}
          <div>
            <label className="block text-[14px] font-medium text-[#333333] mb-2">
              Give a Short Description of the apartment
              <span className="text-red-500 mr-1">*</span>
            </label>
            <textarea
              name="description"
              placeholder="Enter text..."
              rows={4}
              className="w-full border rounded-[5px] px-3 py-2 text-sm text-[#686464] bg-white h-[137px]"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Next Button */}
          <div className="pt-[27px] pb-20">
            <Button
              text={loading ? "Saving..." : "Next"}
              type="submit"
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
