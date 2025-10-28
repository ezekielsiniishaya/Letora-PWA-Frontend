import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../Header";
import Button from "../Button";
import Alert from "../utils/Alerts.jsx";
import {
  verifyEmailAPI,
  resendVerificationEmailAPI,
} from "../../services/authApi.js";

export default function VerifyEmail() {
  const [code, setCode] = useState(["", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(120);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [inlineError, setInlineError] = useState("");
  const [alert, setAlert] = useState(null);
  const [hasVerified, setHasVerified] = useState(false);
  const [autoVerifyAttempted, setAutoVerifyAttempted] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Get email from location state OR localStorage as fallback
  const getStoredEmail = () => {
    try {
      return localStorage.getItem("verificationEmail");
    } catch (error) {
      console.error("Failed to get email from localStorage:", error);
      return null;
    }
  };

  const userEmail = location.state?.email || getStoredEmail() || "your email";

  // Countdown timer
  useEffect(() => {
    if (resendTimer === 0) return;
    const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1);
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const clearCode = () => {
    setCode(["", "", "", "", ""]);
    setAutoVerifyAttempted(false);
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleKeyPress = (key) => {
    const newCode = [...code];
    const emptyIndex = newCode.findIndex((c) => c === "");

    if (key === "del") {
      const lastIndex = newCode.findIndex((c) => c === "") - 1;
      if (lastIndex >= 0) newCode[lastIndex] = "";
      else newCode[4] = "";
    } else if (emptyIndex !== -1) {
      newCode[emptyIndex] = key;
    }

    setCode(newCode);
    setInlineError("");
    setAutoVerifyAttempted(false);
  };

  // ✅ Simple and reliable error handler - similar to SignIn component
  const handleError = (err) => {
    console.log("Raw error:", err);

    // Network errors - no response from server
    if (!err.response) {
      console.log("Network error detected");
      return {
        type: "network",
        message: "Network issues. Get better reception and try again",
      };
    }

    const status = err.response.status;
    const backendMsg =
      err.response.data?.error || err.response.data?.message || "";
    const errorMsg = String(backendMsg).toLowerCase();

    console.log("Backend error:", backendMsg);
    console.log("Status code:", status);

    // Database errors
    if (
      errorMsg.includes("can't reach database") ||
      errorMsg.includes("prisma") ||
      errorMsg.includes("database server") ||
      errorMsg.includes("database error") ||
      errorMsg.includes("neon.tech") ||
      errorMsg.includes("connection") ||
      errorMsg.includes("query") ||
      errorMsg.includes("orm")
    ) {
      console.log("Database error detected");
      return {
        type: "error",
        message: "Server or database error. Please try again later.",
      };
    }

    // Invalid verification code errors
    if (
      errorMsg.includes("invalid or expired verification code") ||
      errorMsg.includes("invalid verification code") ||
      errorMsg.includes("expired verification code") ||
      errorMsg.includes("invalid code")
    ) {
      console.log("Invalid code error detected");
      return {
        type: "error",
        message: "Invalid or expired verification code",
      };
    }

    // Server errors (5xx)
    if (status >= 500) {
      console.log("Server error detected (5xx)");
      return {
        type: "error",
        message: "Server or database error. Please try again later.",
      };
    }

    // Client errors (4xx) - show backend message
    if (status >= 400 && status < 500) {
      console.log("Client error detected (4xx)");
      if (backendMsg) {
        return { type: "error", message: backendMsg };
      }
      return {
        type: "error",
        message: "Request failed. Please try again.",
      };
    }

    // Default fallback
    console.log("Generic error fallback");
    return {
      type: "error",
      message: "Something went wrong. Please try again.",
    };
  };

  const handleVerify = async () => {
    const verificationCode = code.join("");

    if (verificationCode.length !== 5) {
      setInlineError("Please enter the complete 5-digit code");
      return;
    }

    setLoading(true);
    setInlineError("");

    try {
      const result = await verifyEmailAPI(verificationCode);
      showAlert("success", result.message || "Email verified successfully!");
      setHasVerified(true);

      if (result.token) localStorage.setItem("token", result.token);
      const userRole = result.user?.role || result.role;

      // ✅ Clear the stored email after successful verification
      try {
        localStorage.removeItem("verificationEmail");
      } catch (error) {
        console.error("Failed to clear email from localStorage:", error);
      }

      setTimeout(() => {
        navigate("/create-password", {
          state: { role: userRole, email: userEmail },
        });
      }, 1500);
    } catch (err) {
      const errorInfo = handleError(err);
      showAlert(errorInfo.type, errorInfo.message);
      setInlineError("");
      clearCode();
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0) return;
    setInlineError("");
    setAutoVerifyAttempted(false);
    clearCode();
    setResendLoading(true);

    try {
      // ✅ Use the userEmail which now comes from localStorage if needed
      const result = await resendVerificationEmailAPI(userEmail);
      showAlert(
        "success",
        result.message || "2FA  Required. OTP sent to your mail"
      );
      setResendTimer(120);
    } catch (err) {
      const errorInfo = handleError(err);

      // ✅ If the email doesn't exist in the system, clear localStorage
      if (
        err.response?.status === 404 ||
        err.response?.data?.error?.includes("not found")
      ) {
        try {
          localStorage.removeItem("verificationEmail");
        } catch (error) {
          console.error("Failed to clear email from localStorage:", error);
        }
      }

      showAlert(errorInfo.type, errorInfo.message);
      clearCode();
    } finally {
      setResendLoading(false);
    }
  };

  // Auto verify when code is complete
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
        setInlineError("");
        setAutoVerifyAttempted(true);

        try {
          const result = await verifyEmailAPI(verificationCode);
          showAlert(
            "success",
            result.message || "Email verified successfully!"
          );
          setHasVerified(true);

          if (result.token) localStorage.setItem("token", result.token);
          const userRole = result.user?.role || result.role;

          // ✅ Clear the stored email after successful verification
          try {
            localStorage.removeItem("verificationEmail");
          } catch (error) {
            console.error("Failed to clear email from localStorage:", error);
          }

          setTimeout(() => {
            navigate("/create-password", {
              state: { role: userRole, email: userEmail },
            });
          }, 1500);
        } catch (err) {
          const errorInfo = handleError(err);
          showAlert(errorInfo.type, errorInfo.message);
          clearCode();
        } finally {
          setLoading(false);
        }
      };

      verify();
    }
  }, [code, navigate, hasVerified, loading, userEmail, autoVerifyAttempted]);

  // ✅ Add a cleanup effect to remove email when leaving the page
  useEffect(() => {
    return () => {
      // Only remove if verification was successful
      if (!hasVerified) {
        // You might want to keep it for resend functionality
        // localStorage.removeItem('verificationEmail');
      }
    };
  }, [hasVerified]);

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

        {/* ✅ Alert below the "We've sent a code" text */}
        {alert && (
          <div className="mt-4">
            <Alert type={alert.type} message={alert.message} />
          </div>
        )}

        <p className="text-[16px] text-[#666666] mt-[32px] mb-2">
          Enter verification code
        </p>

        {/* ✅ Code Boxes */}
        <div className="flex justify-between mb-1">
          {code.map((c, i) => (
            <div
              key={i}
              className={`w-[48px] h-[48px] bg-white flex items-center justify-center text-lg font-medium rounded-md border-2 ${
                inlineError ? "border-[#F81A0C]" : "border-[#CCC]"
              }`}
            >
              {c}
            </div>
          ))}
        </div>

        {/* ✅ Inline small red text for incomplete code */}
        {inlineError && (
          <p className="text-[#F81A0C] text-[12px] mt-1">{inlineError}</p>
        )}

        {/* Resend */}
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
              className={resendLoading ? "text-[#666666]" : "text-[#A20BA2]"}
              disabled={resendLoading}
            >
              {resendLoading ? "Please wait..." : "Resend Code"}
            </button>
          )}
        </p>

        <Button
          text={loading ? "Verifying..." : "Verify"}
          onClick={handleVerify}
          disabled={loading || code.join("").length !== 5 || hasVerified}
        />

        {/* Keypad */}
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
