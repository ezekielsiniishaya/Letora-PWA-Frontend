import { useState, useEffect, useContext } from "react";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import ShowSuccess from "../../components/ShowSuccess";
import Dropdown from "../../components/dashboard/Dropdown";
import { updateBankingInfoAPI } from "../../services/apartmentApi";
import { UserContext } from "../../contexts/UserContext";
import bankOptions from "./BankingOptions.js";

export default function BankAccount() {
  const [selectedBank, setSelectedBank] = useState(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Get user data from context
  const { user, loading, refreshUser } = useContext(UserContext);

  // Pre-populate form with existing bank data when user context is available
  useEffect(() => {
    if (user?.hostProfile) {
      const { bankName, accountNo } = user.hostProfile;

      // Find and set the selected bank
      const existingBank = bankOptions.find(
        (bank) =>
          bank.label === bankName ||
          bank.value === bankName?.toLowerCase().replace(/\s+/g, "_")
      );
      if (existingBank) {
        setSelectedBank(existingBank);
      }

      // Set account number
      if (accountNo) {
        setAccountNumber(accountNo);
      }
    }
  }, [user]);

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setError(""); // Clear previous errors

    if (!selectedBank || !accountNumber) {
      setError("Please fill in all required fields");
      return;
    }

    if (accountNumber.length !== 10) {
      setError("Please enter a valid 10-digit account number");
      return;
    }

    try {
      setIsSubmitting(true);

      const bankingInfo = {
        bankName: selectedBank.label,
        accountNo: accountNumber,
        accountBalance: user?.hostProfile?.accountBalance || "0",
      };

      // Use the new dedicated banking endpoint
      const response = await updateBankingInfoAPI(bankingInfo);

      if (response.success) {
        console.log("Bank account updated successfully");
        await refreshUser();
        setIsSuccessOpen(true);
      } else {
        throw new Error(response.message || "Failed to update bank account");
      }
    } catch (error) {
      console.error("Error updating bank account:", error);
      const errorMessage =
        error.message || "Failed to update bank account. Please try again.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOkay = () => {
    console.log("Closing success modal");
    setIsSuccessOpen(false);
    navigate("/profile");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F9F9F9]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A20BA2] mx-auto"></div>
          <p className="mt-4 text-[#666666]">Loading your information...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F9F9F9]">
        <div className="text-center">
          <p className="text-[#666666]">Please log in to access this page.</p>
          <Button
            text="Go to Login"
            className="mt-4"
            onClick={() => navigate("/login")}
          />
        </div>
      </div>
    );
  }

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
      </div>

      {/* Content */}
      <div className="w-full max-w-sm mt-[26px]">
        <h2 className="text-[24px] font-medium text-[#0D1321]">Bank Account</h2>
        <p className="text-[14px] text-[#666666] mt-[4px]">
          {user?.hostProfile
            ? "Update your bank account details"
            : "Yeah, We need to pay you 😏"}
        </p>

        <form
          className="mt-[32px] flex flex-col"
          onSubmit={handleCreateAccount}
        >
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
              onChange={(e) => {
                // Only allow numbers and limit to 10 digits
                const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                setAccountNumber(value);
                setError(""); // Clear error when user types
              }}
              className="border mt-[8px] w-full h-[48px] rounded-md px-3 py-2 text-sm focus:ring-[#A20BA2] focus:border-[#A20BA2] outline-none"
              placeholder="Enter your account number"
              maxLength={10}
            />
            {accountNumber.length > 0 && accountNumber.length !== 10 && (
              <p className="text-red-500 text-xs mt-1">
                Account number must be exactly 10 digits
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

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center gap-2">
                <img
                  src="/icons/error.svg"
                  alt="Error"
                  className="w-4 h-4 text-red-500"
                />
                <span className="text-red-700 text-sm font-medium">
                  {error}
                </span>
              </div>
            </div>
          )}

          {/* Terms */}
          <p className="text-[12px] text-[#666666] font-medium text-center mb-[20px] leading-snug">
            By clicking on Submit, you accept the Terms and Conditions, and
            Privacy Policies
          </p>

          <Button
            text={isSubmitting ? "Submitting..." : "Submit"}
            className="mt-[20px] w-full"
            onClick={handleCreateAccount}
            type="submit"
            disabled={
              isSubmitting || !selectedBank || accountNumber.length !== 10
            }
          />

          {isSuccessOpen && (
            <ShowSuccess
              image="/icons/Illustration.svg"
              heading={
                user?.hostProfile
                  ? "Bank Account Updated"
                  : "Bank Account Added"
              }
              message="Your bank account details have been updated successfully"
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
