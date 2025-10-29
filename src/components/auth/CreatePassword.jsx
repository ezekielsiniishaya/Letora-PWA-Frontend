import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../Button";
import Header from "../Header";
import PasswordInput from "./PasswordInput";
import ShowSuccess from "../ShowSuccess";
import Alert from "../utils/Alerts.jsx";
import { setPasswordAPI } from "../../services/authApi";
import { useUser } from "../../hooks/useUser";

export default function CreatePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({
    password: "",
    confirmPassword: "",
    agreement: "",
  });
  const navigate = useNavigate();
  const location = useLocation();

  // Get user context functions
  const { login } = useUser();

  // Get user role ONLY from navigation state
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    // Get user role only from navigation state
    if (location.state?.role) {
      console.log("User role from navigation state:", location.state.role);
      setUserRole(location.state.role);
    } else {
      console.log("No role found in navigation state");
      // Optional: Handle case where no role is provided
      // You might want to navigate back or show an error
    }
  }, [location.state]);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 3000);
  };

  const clearFieldErrors = () => {
    setFieldErrors({
      password: "",
      confirmPassword: "",
      agreement: "",
    });
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Clear previous errors
    clearFieldErrors();
    setAlert(null);

    const newErrors = {
      password: "",
      confirmPassword: "",
      agreement: "",
    };

    // Password validation
    if (!password.trim()) {
      newErrors.password = "This field is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    // Confirm password validation
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "This field is required.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Agreement validation
    if (!agreed) {
      newErrors.agreement = "Please agree to the Terms and Conditions";
    }

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some((error) => error !== "");

    if (hasErrors) {
      setFieldErrors(newErrors);
      // Don't show alert for client-side validation errors
      return;
    }

    setLoading(true);

    try {
      console.log("🔄 Calling setPasswordAPI...");

      // Call the set password API
      const result = await setPasswordAPI(password);

      console.log("🔍 FULL API RESPONSE:", result);
      console.log("🔍 User data:", result?.user);
      console.log("🔍 Access token:", result?.accessToken);

      // Check what we actually received
      if (result?.user && result?.accessToken) {
        console.log("✅ Logging in user automatically");
        login(result.user, result.accessToken);

        // ✅ Store the token for authenticated requests
        localStorage.setItem("token", result.accessToken);
        setIsSuccessOpen(true);
      } else {
        console.log("❌ No user data received from setPasswordAPI");
        console.log("❌ API returned:", result);

        // If no user data, show error
        showAlert("error", "Failed to create account. Please try again.");
      }
    } catch (err) {
      console.error("Error setting password:", err);

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
          errorMsg.includes("foreign key")
        ) {
          return "Server temporarily unavailable. Please try again in a moment.";
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
            "please verify your email before setting password":
              "Please verify your email before setting your password.",
            "password already set":
              "Password has already been set for this account.",
            "invalid token": "Session expired. Please verify your email again.",
            "expired token":
              "Verification link expired. Please request a new one.",
          };

          // Check if we have a mapped message for this error
          for (const [key, message] of Object.entries(errorMappings)) {
            if (errorMsg.includes(key)) {
              return message;
            }
          }

          // Fallback: use backend message if it's user-friendly, otherwise generic message
          if (backendMsg && backendMsg.length < 100) {
            // Only show short, readable messages
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
      setLoading(false);
    }
  };

  const handleOkay = () => {
    console.log("Closing success modal, user role:", userRole);
    setIsSuccessOpen(false);

    // Redirect based on user role from navigation state
    if (userRole === "HOST") {
      navigate("/identity-id");
    } else {
      // For GUEST or any other role, redirect to home page
      navigate("/guest-homepage");
    }
  };

  // Determine the success message based on role
  const getSuccessMessage = () => {
    if (userRole === "HOST") {
      return "Account Created Successfully!";
    } else {
      return "Account Created Successfully";
    }
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    if (fieldErrors.password) {
      setFieldErrors((prev) => ({ ...prev, password: "" }));
    }
  };

  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
    if (fieldErrors.confirmPassword) {
      setFieldErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
  };

  const handleAgreementChange = (checked) => {
    setAgreed(checked);
    if (fieldErrors.agreement) {
      setFieldErrors((prev) => ({ ...prev, agreement: "" }));
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#F9F9F9] px-[20px] relative">
      <Header />

      <div className="w-full max-w-sm mt-[26px]">
        <h2 className="text-[22px] font-medium text-[#1A1A1A]">
          Create Password
        </h2>
        <p className="text-[14px] text-[#666666] mt-[4px]">
          Passwords must be at least 6 characters long
        </p>

        {/* ✅ Alert below the description text - ONLY for server responses */}
        {alert && (
          <div className="mt-4">
            <Alert type={alert.type} message={alert.message} />
          </div>
        )}

        {/* Show warning if no role found */}
        {!userRole && (
          <div className="mt-2 p-2 bg-yellow-100 border border-yellow-300 rounded text-yellow-700 text-sm">
            No user role detected. Please go back and verify your email again.
          </div>
        )}

        <form
          className="space-y-[41px] mt-[21px]"
          onSubmit={handleCreateAccount}
        >
          <div>
            <PasswordInput
              label="Create Password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              disabled={loading || !userRole}
              hasError={!!fieldErrors.password}
            />
            {fieldErrors.password && (
              <p className="text-[#F81A0C] text-[10px] mt-1">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <div>
            <PasswordInput
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => handleConfirmPasswordChange(e.target.value)}
              disabled={loading || !userRole}
              hasError={!!fieldErrors.confirmPassword}
            />
            {fieldErrors.confirmPassword && (
              <p className="text-[#F81A0C] text-[10px] mt-1">
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>
        </form>
      </div>

      <div className="flex flex-row pt-[15px] pb-[40px] w-full max-w-sm">
        <div className="flex items-start">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => handleAgreementChange(e.target.checked)}
            disabled={loading || !userRole}
            className={`peer appearance-none [-webkit-appearance:none] mt-[5px] border w-[20px] h-[18px] rounded-[5px]
              ${fieldErrors.agreement ? "border-[#F81A0C]" : "border-[#CCC]"}
              checked:bg-[#A20BA2] checked:border-[#A20BA2] disabled:opacity-50`}
          />
          <span
            className="absolute text-white text-[14px] hidden peer-checked:block"
            style={{ marginTop: "5px", marginLeft: "5px" }}
          >
            ✔
          </span>
        </div>
        <span className="text-[#0D132180] leading-snug  font-medium text-[12px] ml-2 flex-1">
          I have read Letora's{" "}
          <span className="text-[#A20BA2]">Terms and Conditions</span> and I
          agree to abide by it.
        </span>
      </div>

      {fieldErrors.agreement && (
        <div className="w-full max-w-sm -mt-[37px] mb-[86px]">
          <p className="text-[#F81A0C] text-[10px]">{fieldErrors.agreement}</p>
        </div>
      )}

      <Button
        text={loading ? "Creating Account..." : "Create Account"}
        className="mt-[20px] w-full max-w-sm"
        onClick={handleCreateAccount}
        disabled={loading || !userRole}
        type="button"
      />

      {isSuccessOpen && (
        <ShowSuccess
          image="/icons/Illustration.svg"
          heading={getSuccessMessage()}
          buttonText="Done"
          onClose={handleOkay}
        />
      )}
    </div>
  );
}
