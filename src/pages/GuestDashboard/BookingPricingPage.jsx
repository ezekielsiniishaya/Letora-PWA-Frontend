import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { useApartmentCreation } from "../../hooks/useApartmentCreation";

export default function BookingPricingPage() {
  const [budget, setBudget] = useState(30000);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { apartmentData, updatePricing, setCurrentStep } =
    useApartmentCreation();

  // Use existing data or initialize
  useEffect(() => {
    if (apartmentData.pricing?.pricePerNight) {
      setBudget(apartmentData.pricing.pricePerNight);
    }
  }, [apartmentData.pricing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Save to context
      updatePricing({ pricePerNight: budget });

      // Update current step
      setCurrentStep(6);

      // Navigate to next step - NO API CALL!
      navigate("/security-deposit");
    } catch (err) {
      console.error("Error saving pricing:", err);
      setError("An error occurred while saving the price");
    } finally {
      setLoading(false);
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
          5/8
        </span>
      </div>

      {/* Content */}
      <div className="w-full max-w-sm mt-[26px]">
        <h2 className="text-[24px] font-medium text-[#0D1321]">
          Booking Pricing
        </h2>
        <p className="text-[14px] text-[#666666] mt-[4px]">
          Now let's talk Money
        </p>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form className="mt-[45px] flex flex-col" onSubmit={handleSubmit}>
          {/* Money Icon */}
          <div className="flex justify-center">
            <img
              src="/icons/moneyStack.png"
              alt="Money Icon"
              className="w-[111px] h-[119px]"
            />
          </div>
          <p className="text-center mb-[50px] mt-[-8px] text-[14px] font-medium text-[#333333]">
            Set your Price
          </p>

          {/* Deposit Slider */}
          <div>
            <input
              type="range"
              min={30000}
              max={1000000}
              step={5000}
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

            {/* Price / Night */}
            <div className="text-center mt-4">
              <span className="text-[18px] font-semibold text-[#333333]">
                ₦{budget.toLocaleString()}/{" "}
                <span className="font-light text-[15px]">Night</span>
              </span>
            </div>
          </div>

          {/* Next Button */}
          <div className="mt-[196px]">
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
