import { useState } from "react";
import Button from "../Button";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { forgotPasswordAPI } from "../../services/authApi"; // Import the API function
import { useEffect } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  // Add this useEffect to handle navigation on success
  useEffect(() => {
    if (success) {
      // Navigate after a short delay to show success message
      const timer = setTimeout(() => {
        navigate("/verify-password-email", { state: { email } });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate, email]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Basic email validation
    if (!email) {
      setError("Email address is required");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setIsLoading(true);

      // Send request to backend
      const response = await forgotPasswordAPI(email);

      if (response.success) {
        setSuccess(true);
         navigate("/verify-password-email", { state: { email } });
      } else {
        throw new Error(response.message || "Failed to send reset code");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      setError(error.message || "Failed to send reset code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#F9F9F9] px-[20px]">
      <div className="w-full flex justify-start">
        <img
          src="/icons/arrow-left.svg"
          alt="Back"
          className="w-[16.67px] mt-[20px] cursor-pointer"
          onClick={() => navigate(-1)}
        />
      </div>

      <div className="w-full max-w-sm mt-[26.42px]">
        <h2 className="text-[22px] font-medium text-[#1A1A1A]">
          Forget Password
        </h2>
        <p className="text-[14px] text-[#666666] mt-[4px]">
          Enter your email and we'll send a code to your inbox to reset your
          password.
        </p>

        <form className="space-y-[175px]" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="block text-[14px] font-medium text-[#333333] mt-[40px]">
              Email Address <span className="text-red-500 mr-1">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(""); // Clear error when user types
              }}
              className="border mt-[8px] w-full h-[48px] rounded-md mb-[175px] px-3 py-2 text-sm focus:ring-[#A20BA2] focus:border-[#A20BA2] outline-none"
              placeholder="Enter your email address"
              disabled={isLoading}
            />
          </div>

          {/* Error Message */}
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

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center gap-2">
                <img
                  src="/icons/success.svg"
                  alt="Success"
                  className="w-4 h-4 text-green-500"
                />
                <span className="text-green-700 text-sm font-medium">
                  Reset code sent successfully! Please check your email.
                </span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            text={isLoading ? "Sending..." : "Proceed"}
            type="submit"
            disabled={isLoading}
          />

          {/* Only show the reset password link if you want manual navigation */}
          {/* Alternatively, you can automatically navigate on success */}
          {success && (
            <div className="text-center mt-4">
              <Link
                to="/reset-password"
                state={{ email }}
                className="text-[#A20BA2] font-medium hover:underline"
              >
                Go to Reset Password
              </Link>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
