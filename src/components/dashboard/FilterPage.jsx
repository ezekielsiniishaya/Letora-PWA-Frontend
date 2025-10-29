import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Dropdown from "./Dropdown";
import { filterApartments } from "../../services/apartmentApi";

export default function FilterPage() {
  const navigate = useNavigate();
  const [budget, setBudget] = useState(30000);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  // Add state for each dropdown
  const [apartmentType, setApartmentType] = useState(null);
  const [ratings, setRatings] = useState(null);
  const [bedrooms, setBedrooms] = useState(null);
  const [bathrooms, setBathrooms] = useState(null);
  const [electricity, setElectricity] = useState(null);
  const [guests, setGuests] = useState(null);
  const [kitchenSize, setKitchenSize] = useState(null);
  const [parkingSpace, setParkingSpace] = useState(null);
  const [facilities, setFacilities] = useState([]);
  const [houseRules, setHouseRules] = useState([]);
  const [location, setLocation] = useState("");

  const apartmentOptions = [
    { label: "Self-Con/Studio", value: "SELF_CON_STUDIO" },
    { label: "Mini Flat", value: "MINI_FLAT" },
    { label: "2-bedroom Apartment", value: "TWO_BEDROOM_APARTMENT" },
    { label: "3-bedroom Apartment", value: "THREE_BEDROOM_APARTMENT" },
    { label: "Entire Apartment", value: "ENTIRE_APARTMENT" },
    { label: "BQ/Annex", value: "BQ_ANNEX" },
    { label: "Duplex", value: "DUPLEX" },
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

  const houseRulesOptions = [
    { label: "No Smoking", value: "NO_SMOKING", icon: "/icons/no-smoking.svg" },
    {
      label: "Smoking Allowed",
      value: "SMOKING_ALLOWED",
      icon: "/icons/smoking.svg",
    },
    {
      label: "Flush Properly",
      value: "FLUSH_PROPERLY",
      icon: "/icons/flush.svg",
    },
    {
      label: "Dispose Waste Properly",
      value: "DISPOSE_WASTE_PROPERLY",
      icon: "/icons/dispose.svg",
    },
    {
      label: "Partying Allowed",
      value: "PARTYING_ALLOWED",
      icon: "/icons/party.svg",
    },
    { label: "No Partying", value: "NO_PARTYING", icon: "/icons/no-music.svg" },
    {
      label: "No Pets Allowed",
      value: "NO_PETS_ALLOWED",
      icon: "/icons/no-pets.svg",
    },
    { label: "Pets Allowed", value: "PETS_ALLOWED", icon: "/icons/pets.svg" },
    { label: "No Crowd", value: "NO_CROWD", icon: "/icons/crowd.svg" },
    {
      label: "No Damage to Properties",
      value: "NO_DAMAGE_TO_PROPERTIES",
      icon: "/icons/no-damage.svg",
    },
    { label: "Kids Allowed", value: "KIDS_ALLOWED", icon: "/icons/kids.svg" },
  ];

  const facilitiesOptions = [
    {
      label: "Laundry Service",
      value: "LAUNDRY_SERVICE",
      icon: "/icons/laundry.svg",
    },
    {
      label: "Washing Machine",
      value: "WASHING_MACHINE",
      icon: "/icons/washing-machine.svg",
    },
    { label: "Chef Service", value: "CHEF_SERVICE", icon: "/icons/chef.svg" },
    {
      label: "Air conditioning",
      value: "AIR_CONDITIONING",
      icon: "/icons/ac.svg",
    },
    {
      label: "Swimming pool",
      value: "SWIMMING_POOL",
      icon: "/icons/swimming.svg",
    },
    {
      label: "Generator Backup",
      value: "GENERATOR_BACKUP",
      icon: "/icons/generator.svg",
    },
    { label: "Solar", value: "SOLAR", icon: "/icons/solar.svg" },
    { label: "WiFi", value: "WIFI", icon: "/icons/wifi.svg" },
    {
      label: "Play station",
      value: "PLAY_STATION",
      icon: "/icons/playstation.svg",
    },
    { label: "Smart Home", value: "SMART_HOME", icon: "/icons/smart-home.svg" },
    { label: "CCTV", value: "CCTV", icon: "/icons/cctv.svg" },
    { label: "Gym", value: "GYM", icon: "/icons/gym.svg" },
    { label: "DSTV Netflix", value: "DSTV_NETFLIX", icon: "/icons/dstv.svg" },
  ];

  // Reset all filters
  const handleReset = () => {
    setApartmentType(null);
    setRatings(null);
    setBedrooms(null);
    setBathrooms(null);
    setElectricity(null);
    setGuests(null);
    setKitchenSize(null);
    setParkingSpace(null);
    setFacilities([]);
    setHouseRules([]);
    setBudget(30000);
    setLocation("");
    setError("");
    setFieldErrors({});
  };
  // Validate all required filters
  const validateFilters = () => {
    const newErrors = {};

    // Check required dropdowns
    if (!apartmentType)
      newErrors.apartmentType = "Please select apartment type";
    if (!ratings) newErrors.ratings = "Please select ratings";
    if (!bedrooms) newErrors.bedrooms = "Please select number of bedrooms";
    if (!bathrooms) newErrors.bathrooms = "Please select number of bathrooms";
    if (!electricity)
      newErrors.electricity = "Please select electricity choice";
    if (!guests) newErrors.guests = "Please select guest number";
    if (!kitchenSize) newErrors.kitchenSize = "Please select kitchen size";
    if (!parkingSpace) newErrors.parkingSpace = "Please select parking space";

    // Check multiple select dropdowns
    if (facilities.length === 0)
      newErrors.facilities = "Please select at least one facility";
    if (houseRules.length === 0)
      newErrors.houseRules = "Please select at least one house rule";

    // Check location
    if (!location.trim()) newErrors.location = "Please enter a location";

    // Check budget is above minimum
    if (budget <= 30000) newErrors.budget = "Please set a budget above ₦30,000";

    console.log("Validation errors found:", newErrors);
    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // Handle filter submission
  const handleProceed = async () => {
    try {
      setLoading(true);
      setError("");
      setFieldErrors({});

      console.log("Current form state:", {
        apartmentType,
        ratings,
        bedrooms,
        bathrooms,
        electricity,
        guests,
        kitchenSize,
        parkingSpace,
        facilities: facilities.length,
        houseRules: houseRules.length,
        location,
        budget,
      });

      // Validate all required filters
      const isValid = validateFilters();
      console.log("Validation result:", isValid);

      if (!isValid) {
        console.log("Validation errors:", fieldErrors);
        setLoading(false);
        return;
      }

      // Prepare filters for API call - only include selected filters
      const filters = {
        // Location filter - simple text input
        ...(location && {
          // Let backend handle partial matching for both state and town
          state: location,
          town: location,
        }),

        // Price filter - only if budget is not default
        ...(budget > 30000 &&
          budget < 1000000 && {
            minPrice: 0,
            maxPrice: budget,
          }),

        // Only include filters that user actually selected
        ...(apartmentType && { apartmentType: apartmentType.value }),
        ...(ratings && ratings.value > 0 && { minRating: ratings.value }),
        ...(bedrooms && {
          minBedrooms: bedrooms.value,
          maxBedrooms: bedrooms.value,
        }),
        ...(bathrooms && {
          minBathrooms: bathrooms.value,
          maxBathrooms: bathrooms.value,
        }),
        ...(electricity && { electricity: electricity.value }),
        ...(guests && { guestNumber: guests.value }),
        ...(kitchenSize && { kitchenSize: kitchenSize.value }),
        ...(parkingSpace && { parkingSpace: parkingSpace.value }),

        // Array filters - only if user selected any
        ...(facilities.length > 0 && {
          facilities: facilities.map((f) => f.value),
        }),
        ...(houseRules.length > 0 && {
          houseRules: houseRules.map((hr) => hr.value),
        }),

        // Default filters for active listings only
        isAvailable: true,
        isListed: true,

        // Pagination
        page: 1,
        limit: 10,
        sortBy: "createdAt",
        sortOrder: "desc",
      };

      // Remove minPrice if it's 0 (no budget filter effectively)
      if (filters.minPrice === 0 && !filters.maxPrice) {
        delete filters.minPrice;
      }

      console.log("Sending filters:", filters);

      // Call the filter API
      const response = await filterApartments(filters);

      if (response.success) {
        // Navigate to filtered results page with data
        navigate("/filtered-results", {
          state: {
            apartments: response.data.apartments,
            filters: filters,
            totalCount: response.data.pagination?.totalCount || 0,
          },
        });
      } else {
        setError(response.message || "Failed to filter apartments");
      }
    } catch (error) {
      console.error("Error filtering apartments:", error);
      setError(error.message || "An error occurred while filtering apartments");
    } finally {
      setLoading(false);
    }
  };

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
          <span
            className="text-[#A20BA2] font-medium text-[13.8px] cursor-pointer"
            onClick={handleReset}
          >
            Reset
          </span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-4 mt-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <div className="flex items-center">
              <img
                src="/icons/error.svg"
                alt="Error"
                className="w-4 h-4 mr-2"
              />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="flex-1 px-[20px] mt-[17px]">
        <form className="space-y-9" onSubmit={(e) => e.preventDefault()}>
          {/* Apartment Type */}
          <div>
            <Dropdown
              label="Apartment Type"
              placeholder="Choose Option"
              heading="Select Apartment Type"
              options={apartmentOptions}
              required
              isOpen={openDropdown === "apartment"}
              onToggle={() =>
                setOpenDropdown(
                  openDropdown === "apartment" ? null : "apartment"
                )
              }
              selected={apartmentType}
              setSelected={(value) => {
                setApartmentType(value);
                setFieldErrors((prev) => ({ ...prev, apartmentType: "" }));
              }}
            />
            {fieldErrors.apartmentType && (
              <p className="text-[#F81A0C] text-[10px] mt-1">
                {fieldErrors.apartmentType}
              </p>
            )}
          </div>

          {/* Location */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Ikorodu, Lagos"
              className={`w-full text-[#686464] text-[14px] rounded-lg px-3 py-2 border ${
                fieldErrors.location ? "border-[#F81A0C]" : "border-gray-300"
              }`}
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setFieldErrors((prev) => ({ ...prev, location: "" }));
              }}
            />
            {fieldErrors.location && (
              <p className="text-[#F81A0C] text-[10px] mt-1">
                {fieldErrors.location}
              </p>
            )}
          </div>
          {/* Budget Slider */}
          <div>
            <label className="block text-[14px] font-medium text-[#333333]">
              Budget <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center text-[14px] text-[#333333] justify-between mt-2">
              <span className="">Price</span>
              <span className="font-medium">₦{budget.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={30000}
              max={1000000}
              step={5000}
              value={budget}
              onChange={(e) => {
                setBudget(Number(e.target.value));
                setFieldErrors((prev) => ({ ...prev, budget: "" }));
              }}
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
            {fieldErrors.budget && (
              <p className="text-[#F81A0C] text-[10px] mt-1">
                {fieldErrors.budget}
              </p>
            )}
          </div>
          {/* Ratings */}
          <div>
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
              selected={ratings}
              setSelected={(value) => {
                setRatings(value);
                setFieldErrors((prev) => ({ ...prev, ratings: "" }));
              }}
            />
            {fieldErrors.ratings && (
              <p className="text-[#F81A0C] text-[10px] mt-1">
                {fieldErrors.ratings}
              </p>
            )}
          </div>

          {/* Bedrooms */}
          <div>
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
              selected={bedrooms}
              setSelected={(value) => {
                setBedrooms(value);
                setFieldErrors((prev) => ({ ...prev, bedrooms: "" }));
              }}
            />
            {fieldErrors.bedrooms && (
              <p className="text-[#F81A0C] text-[10px] mt-1">
                {fieldErrors.bedrooms}
              </p>
            )}
          </div>

          {/* Bathrooms */}
          <div>
            <Dropdown
              label="Bathroom Number"
              placeholder="Choose Number"
              heading="Select Number of Bathrooms"
              options={numberOptions}
              required
              isOpen={openDropdown === "bathrooms"}
              onToggle={() =>
                setOpenDropdown(
                  openDropdown === "bathrooms" ? null : "bathrooms"
                )
              }
              selected={bathrooms}
              setSelected={(value) => {
                setBathrooms(value);
                setFieldErrors((prev) => ({ ...prev, bathrooms: "" }));
              }}
            />
            {fieldErrors.bathrooms && (
              <p className="text-[#F81A0C] text-[10px] mt-1">
                {fieldErrors.bathrooms}
              </p>
            )}
          </div>

          {/* Electricity Choice */}
          <div>
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
              selected={electricity}
              setSelected={(value) => {
                setElectricity(value);
                setFieldErrors((prev) => ({ ...prev, electricity: "" }));
              }}
            />
            {fieldErrors.electricity && (
              <p className="text-[#F81A0C] text-[10px] mt-1">
                {fieldErrors.electricity}
              </p>
            )}
          </div>

          {/* Guest Number */}
          <div>
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
              selected={guests}
              setSelected={(value) => {
                setGuests(value);
                setFieldErrors((prev) => ({ ...prev, guests: "" }));
              }}
            />
            {fieldErrors.guests && (
              <p className="text-[#F81A0C] text-[10px] mt-1">
                {fieldErrors.guests}
              </p>
            )}
          </div>

          {/* Kitchen Size */}
          <div>
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
              selected={kitchenSize}
              setSelected={(value) => {
                setKitchenSize(value);
                setFieldErrors((prev) => ({ ...prev, kitchenSize: "" }));
              }}
            />
            {fieldErrors.kitchenSize && (
              <p className="text-[#F81A0C] text-[10px] mt-1">
                {fieldErrors.kitchenSize}
              </p>
            )}
          </div>

          {/* Parking Space */}
          <div>
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
              selected={parkingSpace}
              setSelected={(value) => {
                setParkingSpace(value);
                setFieldErrors((prev) => ({ ...prev, parkingSpace: "" }));
              }}
            />
            {fieldErrors.parkingSpace && (
              <p className="text-[#F81A0C] text-[10px] mt-1">
                {fieldErrors.parkingSpace}
              </p>
            )}
          </div>

          {/* Facilities & Services */}
          <div>
            <Dropdown
              label="Facilities & Services"
              placeholder="Select Options"
              heading="Select Facilities & Services"
              options={facilitiesOptions}
              required
              multiple={true}
              isOpen={openDropdown === "facilities"}
              onToggle={() =>
                setOpenDropdown(
                  openDropdown === "facilities" ? null : "facilities"
                )
              }
              selected={facilities}
              setSelected={(value) => {
                setFacilities(value);
                setFieldErrors((prev) => ({ ...prev, facilities: "" }));
              }}
            />
            {fieldErrors.facilities && (
              <p className="text-[#F81A0C] text-[10px] mt-1">
                {fieldErrors.facilities}
              </p>
            )}
          </div>

          {/* House Rules */}
          <div>
            <Dropdown
              label="House Rules"
              placeholder="Select Options"
              heading="Select House Rules"
              options={houseRulesOptions}
              required
              multiple={true}
              isOpen={openDropdown === "houseRules"}
              onToggle={() =>
                setOpenDropdown(
                  openDropdown === "houseRules" ? null : "houseRules"
                )
              }
              selected={houseRules}
              setSelected={(value) => {
                setHouseRules(value);
                setFieldErrors((prev) => ({ ...prev, houseRules: "" }));
              }}
            />
            {fieldErrors.houseRules && (
              <p className="text-[#F81A0C] text-[10px] mt-1">
                {fieldErrors.houseRules}
              </p>
            )}
          </div>
          {/* Proceed Button */}
          <div className="pt-[67px] pb-10">
            <Button
              text={loading ? "Filtering..." : "Proceed"}
              onClick={handleProceed}
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
