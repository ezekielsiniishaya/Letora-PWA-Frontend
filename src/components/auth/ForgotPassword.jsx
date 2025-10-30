import { useState } from "react";
import Button from "../Button";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { forgotPasswordAPI } from "../../services/authApi";
import { useEffect } from "react";
import Alert from "../../components/utils/Alerts";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ email: "" });
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

  const validateEmail = (value) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setSuccess(false);

    const newFieldErrors = {};

    // ✅ Field validations
    if (!email.trim()) {
      newFieldErrors.email = "This field is required.";
    } else if (!validateEmail(email)) {
      newFieldErrors.email = "Please enter a valid email address.";
    }

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      return;
    }

    try {
      setIsLoading(true);

      // Send request to backend
      const response = await forgotPasswordAPI(email);

      if (response.success) {
        setSuccess(true);
        // Removed immediate navigation to let useEffect handle it after delay
      } else {
        throw new Error(response.message || "Failed to send reset code");
      }
    } catch (error) {
      console.error("Forgot password error:", error);

      // Enhanced error handling similar to SignIn page
      const errorMessage =
        error?.message || "Failed to send reset code. Please try again.";
      const lowerCaseMsg = errorMessage.toLowerCase();

      // Network error detection
      if (
        lowerCaseMsg.includes("network") ||
        lowerCaseMsg.includes("offline") ||
        lowerCaseMsg.includes("fetch") ||
        lowerCaseMsg.includes("failed to fetch") ||
        error?.name === "TypeError" ||
        error?.name === "NetworkError" ||
        !navigator.onLine
      ) {
        setError("network");
      } else if (
        lowerCaseMsg.includes("email") ||
        lowerCaseMsg.includes("user") ||
        lowerCaseMsg.includes("not found") ||
        error?.response?.status === 404
      ) {
        setFieldErrors({
          email: "No account found with this email address",
        });
      } else {
        setError("server");
      }
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

        {/* ✅ Alerts */}
        {error === "network" && (
          <div className="mt-4">
            <Alert
              type="network"
              message="Network issues. Get better reception and try again."
              onDismiss={() => setError("")}
              timeout={5000}
            />
          </div>
        )}

        {error === "server" && (
          <div className="mt-4">
            <Alert
              type="error"
              message="Server or database error. Please try again later."
              onDismiss={() => setError("")}
              timeout={5000}
            />
          </div>
        )}

        {success && (
          <div className="mt-4">
            <Alert
              type="success"
              message="Reset code sent successfully! Please check your email."
              onDismiss={() => setSuccess(false)}
              timeout={5000}
            />
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
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
                setFieldErrors((prev) => ({ ...prev, email: "" }));
                setError(""); // Clear general error when user types
              }}
              className={`border mt-[8px] w-full h-[48px] rounded-md px-3 py-2 text-sm outline-none disabled:opacity-50
                ${
                  fieldErrors.email
                    ? "border-[#F81A0C]"
                    : "focus:ring-[#A20BA2] focus:border-[#A20BA2]"
                }`}
              placeholder="Enter your email address"
              disabled={isLoading}
            />
            {fieldErrors.email && (
              <p className="text-[#F81A0C] text-[12px] mt-1">
                {fieldErrors.email}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-[175px]">
            <Button
              text={isLoading ? "Sending..." : "Proceed"}
              type="submit"
              disabled={isLoading}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
