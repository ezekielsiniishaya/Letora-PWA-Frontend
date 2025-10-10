import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header";
import Button from "../Button";
import {
  verifyEmailAPI,
  resendVerificationEmailAPI,
} from "../../services/authApi.js";

export default function VerifyPassswordEmail() {
  const [code, setCode] = useState(["", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(120);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [hasVerified, setHasVerified] = useState(false);
  const [autoVerifyAttempted, setAutoVerifyAttempted] = useState(false);
  const navigate = useNavigate();

  // Get email from navigation state or use a default
  const userEmail = location.state?.email || "your email";

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer === 0) return;
    const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleKeyPress = (key) => {
    const newCode = [...code];
    const emptyIndex = newCode.findIndex((c) => c === "");

    if (key === "del") {
      const lastIndex = newCode.findIndex((c) => c === "") - 1;
      if (lastIndex >= 0) {
        newCode[lastIndex] = "";
      } else {
        newCode[4] = "";
      }
    } else if (emptyIndex !== -1) {
      newCode[emptyIndex] = key;
    }
    setCode(newCode);
    setError(""); // Clear error when user types
    setAutoVerifyAttempted(false); // Reset when user types
  };

  // NEW: Function to clear the code input
  const clearCode = () => {
    setCode(["", "", "", "", ""]);
    setAutoVerifyAttempted(false);
  };

  const handleVerify = async () => {
    const verificationCode = code.join("");

    if (verificationCode.length !== 5) {
      setError("Please enter the complete 5-digit code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await verifyEmailAPI(verificationCode);
      setSuccess(result.message || "Email verified successfully!");
      setHasVerified(true);

      // Store token if needed
      if (result.token) {
        localStorage.setItem("token", result.token);
        console.log("Token stored after email verification");
      }

      // Get user role from API response
      const userRole = result.user?.role || result.role;
      console.log("User role from API:", userRole);

      // Redirect to create password page with user role in state
      setTimeout(() => {
        navigate("/create-password", {
          state: {
            role: userRole,
            email: userEmail,
          },
        });
      }, 1500);
    } catch (err) {
      setError(err.message || "Verification failed. Please try again.");
      // NEW: Clear code on verification failure
      clearCode();
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0) return;

    setError("");
    setSuccess("");
    setAutoVerifyAttempted(false);
    // NEW: Clear the code input when resending
    clearCode();

    try {
      const result = await resendVerificationEmailAPI(userEmail);
      setSuccess(result.message || "Verification code sent!");
      setResendTimer(120);
    } catch (err) {
      setError(err.message || "Failed to resend code. Please try again.");
    }
  };

  // Auto-submit when code is complete
  useEffect(() => {
    const verificationCode = code.join("");

    if (
      verificationCode.length === 5 &&
      !loading &&
      !hasVerified &&
      !autoVerifyAttempted
    ) {
      const verify = async () => {
        setLoading(true);
        setError("");
        setAutoVerifyAttempted(true);

        try {
          const result = await verifyEmailAPI(verificationCode);
          setSuccess(result.message || "Email verified successfully!");
          setHasVerified(true);

          if (result.token) {
            localStorage.setItem("token", result.token);
          }

          // Get user role from API response
          const userRole = result.user?.role || result.role;
          console.log("User role from API (auto-verify):", userRole);

          setTimeout(() => {
            navigate("/create-password", {
              state: {
                role: userRole,
                email: userEmail,
              },
            });
          }, 1500);
        } catch (err) {
          setError(err.message || "Verification failed. Please try again.");
          // NEW: Clear code on auto-verification failure
          clearCode();
        } finally {
          setLoading(false);
        }
      };

      verify();
    }
  }, [code, navigate, hasVerified, loading, userEmail, autoVerifyAttempted]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#F9F9F9] px-[20px]">
      <Header />

      <div className="w-full max-w-sm mt-[26px]">
        <h2 className="text-[22px] font-medium text-[#1A1A1A]">
          Verify Email Address
        </h2>
        <p className="text-[14px] text-[#666666] mt-[4px]">
          We've sent a code to {userEmail}. Enter the code below.
        </p>

        {/* Error and Success Messages */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        {/* Enter verification code text */}
        <p className="text-[16px] text-[#666666] mt-[32px] mb-2">
          Enter verification code
        </p>

        {/* Verification Code Boxes */}
        <div className="flex justify-between">
          {code.map((c, i) => (
            <div
              key={i}
              className={`w-[48px] h-[48px] bg-white flex items-center justify-center text-lg font-medium rounded-md border-2 ${
                error ? "border-red-500" : "border-gray-300"
              }`}
            >
              {c}
            </div>
          ))}
        </div>

        {/* Resend code */}
        <p className="text-[16px] mt-[36px] mb-[24px] text-center">
          {resendTimer > 0 ? (
            <span className="text-[#505050]">
              Resend code in{" "}
              {`${Math.floor(resendTimer / 60)}:${String(
                resendTimer % 60
              ).padStart(2, "0")}`}
            </span>
          ) : (
            <button
              onClick={handleResendCode}
              className="text-[#A20BA2] underline"
              disabled={loading}
            >
              Resend Code
            </button>
          )}
        </p>

        {/* Verify button - Only show if not auto-submitting */}
        <Button
          text={loading ? "Verifying..." : "Verify"}
          onClick={handleVerify}
          disabled={loading || code.join("").length !== 5 || hasVerified}
        />

        {/* On-screen keyboard */}
        <div className="grid grid-cols-3 gap-4 mt-[48px]">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "del"].map(
            (key) => (
              <button
                key={key}
                onClick={() => handleKeyPress(key)}
                disabled={loading || hasVerified}
                className="w-full h-[60px] text-[#0D1321] text-[24px] font-semibold flex items-center justify-center disabled:opacity-50"
              >
                {key === "del" ? "⌫" : key}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
