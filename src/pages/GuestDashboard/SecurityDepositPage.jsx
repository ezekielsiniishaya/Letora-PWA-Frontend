import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { useApartmentCreation } from "../../hooks/useApartmentCreation";

export default function SecurityDeposit() {
  const [deposit, setDeposit] = useState(""); // formatted value
  const [rawDeposit, setRawDeposit] = useState(""); // numeric raw value
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { apartmentData, updateSecurityDeposit, setCurrentStep } =
    useApartmentCreation();

  const MAX_DEPOSIT = 100000;

  // Use existing data or initialize
  useEffect(() => {
    if (apartmentData.securityDeposit?.amount) {
      const amount = apartmentData.securityDeposit.amount;
      setRawDeposit(amount.toString());
      setDeposit(amount.toLocaleString());
    }
  }, [apartmentData.securityDeposit]);

  const handleChange = (e) => {
    const numericValue = e.target.value.replace(/,/g, "");
    if (!/^\d*$/.test(numericValue)) return;

    setRawDeposit(numericValue);

    if (numericValue === "") {
      setDeposit("");
      setError("");
      return;
    }

    const number = Number(numericValue);
    setDeposit(number.toLocaleString());

    if (number > MAX_DEPOSIT) {
      return;
    } else {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate deposit amount
    if (!rawDeposit || rawDeposit === "") {
      setError("Please enter a security deposit amount");
      return;
    }

    if (error) {
      return;
    }

    const depositAmount = Number(rawDeposit);

    if (depositAmount <= 0) {
      setError("Please enter a valid security deposit amount");
      return;
    }

    setLoading(true);

    try {
      // Save to context
      updateSecurityDeposit({ amount: depositAmount });

      // Update current step
      setCurrentStep(7);

      // Navigate to next step - NO API CALL!
      navigate("/house-rules");
    } catch (err) {
      console.error("Error saving security deposit:", err);
      setError("An error occurred while saving the security deposit");
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
          6/8
        </span>
      </div>

      {/* Content */}
      <div className="w-full max-w-sm mt-[26px]">
        <h2 className="text-[24px] font-medium text-[#0D1321]">
          Security Deposit
        </h2>
        <p className="text-[14px] text-[#666666] mt-[4px]">
          Set your security deposit amount
        </p>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form className="mt-[75px] flex flex-col" onSubmit={handleSubmit}>
          {/* Deposit Input */}
          <label className="block text-[14px] font-medium text-[#333333] mb-2">
            Security Deposit Amount <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter amount"
            value={deposit}
            onChange={handleChange}
            className={`w-full h-[48px] border rounded-[8px] px-3 py-2 text-[14px] focus:outline-none focus:ring-2 ${
              error
                ? "border-red-500 focus:ring-red-500"
                : "border-[#D9D9D9] focus:ring-[#A20BA2]"
            }`}
            disabled={loading}
          />

          {/* Error message */}
          {error && (
            <div className="text-red-500 text-[12px] mt-1">{error}</div>
          )}

          {/* Max note */}
          {!error && (
            <div className="text-right text-[12px] text-[#666666] mt-1">
              Max. ₦100,000
            </div>
          )}

          {/* Next Button */}
          <div className="mt-[296px]">
            <Button
              text={loading ? "Saving..." : "Next"}
              type="submit"
              disabled={loading || !!error || !rawDeposit}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
