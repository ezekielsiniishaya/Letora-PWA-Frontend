import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../Button";
import Header from "../Header";
import PasswordInput from "./PasswordInput";
import ShowSuccess from "../ShowSuccess";
import { setPasswordAPI } from "../../services/authApi";

export default function CreatePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!agreed) {
      setError("Please agree to the Terms and Conditions");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Call the set password API
      const result = await setPasswordAPI(password);

      console.log("Password set successfully:", result);
      console.log("User role for redirection:", userRole);
      setIsSuccessOpen(true);
    } catch (err) {
      console.error("Error setting password:", err);
      setError(err.message || "Failed to create account. Please try again.");
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

        {/* Show warning if no role found */}
        {!userRole && (
          <div className="mt-2 p-2 bg-yellow-100 border border-yellow-300 rounded text-yellow-700 text-sm">
            No user role detected. Please go back and verify your email again.
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form
          className="space-y-[41px] mt-[21px]"
          onSubmit={handleCreateAccount}
        >
          <PasswordInput
            label="Create Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            disabled={loading || !userRole} // Disable if no role
          />
          <PasswordInput
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setError("");
            }}
            disabled={loading || !userRole} // Disable if no role
          />
        </form>
      </div>

      <div className="flex flex-row pt-[15px] pb-[40px]">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => {
            setAgreed(e.target.checked);
            setError("");
          }}
          disabled={loading || !userRole} // Disable if no role
          className="peer appearance-none [-webkit-appearance:none] mt-[5px] border border-[#CCC] w-[20px] h-[18px] rounded-[5px]
             checked:bg-[#A20BA2] checked:border-[#A20BA2] disabled:opacity-50"
        />
        <span className="absolute top-[428px] left-6 text-white text-xs hidden peer-checked:block">
          ✔
        </span>
        <span className="text-[#0D132180] leading-snug pb-[86px] font-medium text-[12px] ml-2">
          I have read Letora's{" "}
          <span className="text-[#A20BA2]">Terms and Conditions</span> and I
          agree to abide by it.
        </span>
      </div>

      <Button
        text={loading ? "Creating Account..." : "Create Account"}
        className="mt-[20px] w-full"
        onClick={handleCreateAccount}
        disabled={loading || !userRole} // Disable if no role
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
