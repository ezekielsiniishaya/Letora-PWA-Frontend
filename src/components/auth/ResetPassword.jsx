import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../Button";
import Header from "../Header";
import PasswordInput from "./PasswordInput";
import ShowSuccess from "../ShowSuccess";
import { resetPasswordAPI } from "../../services/authApi"; // Import the API function

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Get reset token and email from navigation state
  const resetToken = location.state?.resetCode;
  const userEmail = location.state?.email;

  const handleResetPassword = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setError(""); // Clear previous errors

    // Validation
    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!resetToken) {
      setError("Reset token is missing. Please request a new reset code.");
      return;
    }

    try {
      setIsLoading(true);

      // Call the reset password API
      const response = await resetPasswordAPI(resetToken, password);

      if (response.success) {
        console.log("Password reset successfully");
        setIsSuccessOpen(true);
      } else {
        throw new Error(response.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      setError(error.message || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOkay = () => {
    console.log("Closing success modal");
    setIsSuccessOpen(false);
    navigate("/sign-in");
  };

  const handleResendCode = () => {
    // Navigate back to verify reset code page to request a new code
    navigate("/verify-reset-code", { state: { email: userEmail } });
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#F9F9F9] px-[20px] relative">
      <Header />

      <div className="w-full max-w-sm mt-[26px]">
        <h2 className="text-[22px] font-medium text-[#1A1A1A]">
          Reset Password
        </h2>
        <p className="text-[14px] text-[#666666] mt-[4px]">
          Please enter your new password
        </p>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center gap-2">
              <img
                src="/icons/error.svg"
                alt="Error"
                className="w-4 h-4 text-red-500"
              />
              <span className="text-red-700 text-sm font-medium">{error}</span>
            </div>
            {error.includes("token") && (
              <button
                onClick={handleResendCode}
                className="text-[#A20BA2] text-sm mt-2 underline"
              >
                Request new reset code
              </button>
            )}
          </div>
        )}

        <form
          className="space-y-[30px] mt-[21px]"
          onSubmit={handleResetPassword}
        >
          <PasswordInput
            label="Create Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(""); // Clear error when user types
            }}
            placeholder="Enter your new password"
            disabled={isLoading}
          />
          <PasswordInput
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setError(""); // Clear error when user types
            }}
            placeholder="Confirm your new password"
            disabled={isLoading}
          />

          {/* Submit Button */}
          <Button
            text={isLoading ? "Resetting..." : "Reset Password"}
            className="mt-8 w-full"
            type="submit"
            disabled={isLoading || !password || !confirmPassword}
          />
        </form>
      </div>

      {isSuccessOpen && (
        <ShowSuccess
          image="/icons/Illustration.svg"
          heading="Password Reset Successful"
          message="Your password has been reset successfully. You can now sign in with your new password."
          buttonText="Sign in"
          onClose={handleOkay}
        />
      )}
    </div>
  );
}
