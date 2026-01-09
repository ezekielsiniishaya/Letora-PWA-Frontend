import { useState } from "react";
import Button from "../Button";
import { processWithdrawal } from "../../services/userApi";

export default function WithdrawPopup({ balance, onClose, onSuccess }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Convert balance string to number for comparison
  const numericBalance = parseFloat(balance.replace(/,/g, ""));
  const numericAmount = parseFloat(amount.replace(/,/g, "")) || 0;

  // Check if amount exceeds balance
  const amountExceedsBalance = numericAmount > numericBalance;

  // Check minimum amount
  const isBelowMinimum = numericAmount > 0 && numericAmount < 100;

  // Check if amount is valid (greater than 0, minimum ₦100, doesn't exceed balance)
  const isAmountValid = numericAmount >= 100 && !amountExceedsBalance;

  const formatAmount = (value) => {
    // Remove non-digit characters
    const numericValue = value.replace(/\D/g, "");

    if (numericValue === "") return "";

    // Convert to number and format with commas
    return parseInt(numericValue, 10).toLocaleString("en-US");
  };

  // Handle withdrawal
  const handleWithdraw = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (numericAmount < 100) {
      setError("Minimum withdrawal amount is ₦100");
      return;
    }

    if (amountExceedsBalance) {
      setError("Amount exceeds available balance");
      return;
    }

    if (!isAmountValid) return;

    setLoading(true);
    setError("");

    try {
      const response = await processWithdrawal(numericAmount);

      if (response.success) {
        onClose();
        onSuccess(amount, response.data);
      } else {
        setError(response.message || "Withdrawal failed");
      }
    } catch (err) {
      // Check for specific error messages
      if (err.message && err.message.includes("Minimum withdrawal amount")) {
        setError("Minimum withdrawal amount is ₦100");
      } else {
        setError(err.message || "Withdrawal request failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Overlay - clicking closes popup */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      ></div>

      {/* Popup at the bottom */}
      <div className="fixed bottom-0 left-0 w-full h-[244px] max-w-md mx-auto bg-white rounded-t-[15px] p-6 z-50">
        {/* Withdraw form */}
        <form onSubmit={handleWithdraw} className="mt-4 space-y-3">
          <div>
            <label className="text-[14px] font-medium text-[#333333]">
              Withdraw Amount
            </label>
            <input
              type="text"
              inputMode="numeric"
              min="1"
              value={amount}
              onChange={(e) => {
                const formattedValue = formatAmount(e.target.value);
                setAmount(formattedValue);
                // Clear error when user types
                if (error) setError("");
              }}
              placeholder="Enter amount"
              className={`border mt-1 w-full h-[45px] rounded-[5px] px-3 py-2 text-smtext-black outline-none ${
                amountExceedsBalance || isBelowMinimum ? "border-red-500" : ""
              }`}
            />

            {/* Frontend validation messages */}
            {isBelowMinimum && numericAmount > 0 && (
              <p className="text-red-500 text-[12px] mt-1">
                Minimum withdrawal amount is ₦100
              </p>
            )}

            {amountExceedsBalance && (
              <p className="text-red-500 text-[12px] mt-1">
                Amount exceeds available balance
              </p>
            )}

            {/* Backend API error message */}
            {error && !isBelowMinimum && !amountExceedsBalance && (
              <p className="text-red-500 text-[12px] mt-1">{error}</p>
            )}

            <p className="text-[12px] text-[#0D132180] mt-1">
              Available balance: <span>₦{balance}</span>
            </p>
          </div>

          <Button
            text={loading ? "Processing..." : "Submit"}
            type="submit"
            className={
              !isAmountValid || loading ? "bg-gray-400 cursor-not-allowed" : ""
            }
            disabled={!isAmountValid || loading}
          />
        </form>
      </div>
    </>
  );
}
