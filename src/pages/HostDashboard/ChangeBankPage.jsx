import { useState, useEffect, useContext } from "react";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import ShowSuccess from "../../components/ShowSuccess";
import Dropdown from "../../components/dashboard/Dropdown";
import { updateBankingInfoAPI } from "../../services/apartmentApi";
import { UserContext } from "../../contexts/UserContext";
import bankOptions from "../../components/dashboard/BankingOptions.js";
import Alert from "../../components/utils/Alerts.jsx";

export default function BankAccount() {
  const [selectedBank, setSelectedBank] = useState(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    bank: "",
    accountNumber: "",
  });
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [canUpdateBankDetails, setCanUpdateBankDetails] = useState(true);

  // Get user data from context
  const { user, loading, refreshUser } = useContext(UserContext);

  // Check if bank details can be updated (3-month restriction)
  useEffect(() => {
    if (user?.hostProfile?.bankDetailsUpdatedAt) {
      const lastUpdated = new Date(user.hostProfile.bankDetailsUpdatedAt);
      const threeMonthsFromLastUpdate = new Date(lastUpdated);
      threeMonthsFromLastUpdate.setMonth(
        threeMonthsFromLastUpdate.getMonth() + 3
      );

      const now = new Date();
      const canUpdate = now >= threeMonthsFromLastUpdate;

      setCanUpdateBankDetails(canUpdate);

      if (!canUpdate) {
        return;
      }
    }
  }, [user]);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const clearFieldErrors = () => {
    setFieldErrors({
      bank: "",
      accountNumber: "",
    });
  };

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

    // Check if update is allowed
    if (!canUpdateBankDetails) {
      return;
    }

    // Clear previous errors
    clearFieldErrors();
    setAlert(null);

    const newErrors = {
      bank: "",
      accountNumber: "",
    };

    // Validation
    if (!selectedBank) {
      newErrors.bank = "Please select a bank";
    }

    if (!accountNumber) {
      newErrors.accountNumber = "This field is required";
    } else if (accountNumber.length !== 10) {
      newErrors.accountNumber = "Account number must be 10 digits";
    }

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some((error) => error !== "");

    if (hasErrors) {
      setFieldErrors(newErrors);
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
    } catch (err) {
      console.error("Error updating bank account:", err);

      // ✅ Enhanced error handler with user-friendly messages
      const getErrorMessage = (error) => {
        // Network errors
        if (!error.response) {
          return "Network issues. Get better reception and try again";
        }

        const status = error.response.status;
        const backendMsg =
          error.response.data?.error || error.response.data?.message || "";
        const errorMsg = String(backendMsg).toLowerCase();

        console.log("Backend error:", backendMsg);
        console.log("Status code:", status);

        // Database errors - provide generic message
        if (
          errorMsg.includes("database") ||
          errorMsg.includes("prisma") ||
          errorMsg.includes("query") ||
          errorMsg.includes("orm") ||
          errorMsg.includes("connection") ||
          errorMsg.includes("neon.tech") ||
          errorMsg.includes("sql") ||
          errorMsg.includes("constraint") ||
          errorMsg.includes("unique constraint") ||
          errorMsg.includes("foreign key") ||
          errorMsg.includes("timeout") ||
          errorMsg.includes("connection pool") ||
          errorMsg.includes("transaction") ||
          errorMsg.includes("deadlock")
        ) {
          return "Server error, Please try again in a moment.";
        }

        // Server errors (5xx)
        if (status >= 500) {
          return "Server temporarily unavailable. Please try again later.";
        }

        // Client errors (4xx) - show user-friendly backend messages
        if (status >= 400 && status < 500) {
          // Map common backend errors to user-friendly messages
          const errorMappings = {
            "user not found":
              "Account not found. Please verify your email first.",
            "invalid account number": "Please enter a valid account number.",
            "bank name and account number are required":
              "Please fill in all bank details.",
            "account update not allowed":
              "Account details cannot be modified yet. Please wait until the lock period ends.",
            "bank verification failed":
              "Bank account verification failed. Please check your details.",
          };

          // Check if we have a mapped message for this error
          for (const [key, message] of Object.entries(errorMappings)) {
            if (errorMsg.includes(key)) {
              return message;
            }
          }

          // Fallback: use backend message if it's user-friendly, otherwise generic message
          if (
            backendMsg &&
            backendMsg.length < 100 &&
            !backendMsg.includes("prisma")
          ) {
            return backendMsg;
          }

          return "Request failed. Please check your information and try again.";
        }

        // Default fallback
        return "Something went wrong. Please try again.";
      };

      const errorMessage = getErrorMessage(err);
      showAlert("error", errorMessage);
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
    clearFieldErrors();
  };

  const handleAccountNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setAccountNumber(value);
    if (fieldErrors.accountNumber) {
      setFieldErrors((prev) => ({ ...prev, accountNumber: "" }));
    }
  };

  const handleBankSelect = (bank) => {
    setSelectedBank(bank);
    if (fieldErrors.bank) {
      setFieldErrors((prev) => ({ ...prev, bank: "" }));
    }
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

        {/* ✅ Alert display - for backend responses and update restrictions */}
        {alert && (
          <div className="mt-4">
            <Alert type={alert.type} message={alert.message} />
          </div>
        )}

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
              setSelected={handleBankSelect}
              hasError={!!fieldErrors.bank}
              showIndicators={false}
              disabled={!canUpdateBankDetails} // Disable if cannot update
            />
            {/* ✅ Inline error for bank selection */}
            {fieldErrors.bank && (
              <p className="text-[#F81A0C] text-[12px] mt-1">
                {fieldErrors.bank}
              </p>
            )}
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
              onChange={handleAccountNumberChange}
              maxLength={10}
              className={`border mt-[8px] w-full h-[48px] rounded-md px-3 py-2 text-sm focus:ring-[#A20BA2] focus:border-[#A20BA2] outline-none ${
                fieldErrors.accountNumber ? "border-[#F81A0C]" : "border-[#CCC]"
              } ${
                !canUpdateBankDetails ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
              placeholder="Enter account number"
              disabled={!canUpdateBankDetails} // Disable if cannot update
            />
            {/* ✅ Inline error for account number */}
            {fieldErrors.accountNumber && (
              <p className="text-[#F81A0C] text-[12px] mt-1">
                {fieldErrors.accountNumber}
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
              {canUpdateBankDetails
                ? "Submitted account details cannot be modified for the first 3 months."
                : `Submitted account details cannot be modified for the first 3 months.`}
            </span>
          </div>
          <Button
            text={isSubmitting ? "Submitting..." : "Submit"}
            className={`mt-[20px] w-full ${
              !canUpdateBankDetails ? "cursor-not-allowed bg-[#FFBEFF]" : ""
            }`}
            onClick={handleCreateAccount}
            type="submit"
            disabled={
              isSubmitting ||
              !selectedBank ||
              accountNumber.length !== 10 ||
              !canUpdateBankDetails
            }
            style={{
              backgroundColor: !canUpdateBankDetails ? "#FFBEFF" : "",
            }}
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
