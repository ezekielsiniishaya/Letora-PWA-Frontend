import { useState } from "react";
import Button from "../../components/Button";
import Header from "../../components/Header";
import PasswordInput from "../../components/auth/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { loginAPI } from "../../services/authApi";
import { useUser } from "../../hooks/useUser";
import { useHostProfile } from "../../contexts/HostProfileContext";
import { useApartmentListing } from "../../hooks/useApartmentListing";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, logout } = useUser(); // Get the login function from user context
  const { clearHostProfileData } = useHostProfile();
  const { clearApartments } = useApartmentListing();

  const clearAllUserData = () => {
    // Clear localStorage
    localStorage.clear();

    // Clear all context states
    logout(); // From UserProvider
    clearHostProfileData(); // From HostProfileProvider
    clearApartments(); // From ApartmentListingProvider (after you add it)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Clear previous user data firts
    clearAllUserData();
    try {
      const result = await loginAPI(email, password);

      // ✅ Use the user context login function instead of localStorage
      login(result.user, result.accessToken);

      // Store token for API requests
      localStorage.setItem("authToken", result.accessToken);

      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberMe");
      }

      // Store verification info for identity-id page if needed
      if (result.requiresIdentityVerification) {
        localStorage.setItem("requiresIdentityVerification", "true");
        localStorage.setItem(
          "documentStatus",
          JSON.stringify(result.documentStatus)
        );
      }

      console.log("Login successful, redirecting to:", result.redirectPath);

      // Use the redirect path from backend
      navigate(result.redirectPath);
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#F9F9F9] px-[20px]">
      <Header />

      <div className="w-full max-w-sm mt-[26.42px]">
        <h2 className="text-[22px] font-medium text-[#1A1A1A]">Sign in</h2>
        <p className="text-[16px] text-[#666666] mt-[4px]">
          Sign in if you already have an account
        </p>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-[14px] font-medium text-[#686464] mt-[32px]">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(""); // Clear error when user types
              }}
              className="border mt-[8px] w-full h-[48px] rounded-md px-3 py-2 text-sm focus:ring-[#A20BA2] focus:border-[#A20BA2] outline-none disabled:opacity-50"
              required
              disabled={loading}
            />
          </div>

          {/* Password */}
          <PasswordInput
            label="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(""); // Clear error when user types
            }}
            disabled={loading}
          />

          {/* Remember / Forgot */}
          <div className="flex items-center justify-between text-[14px] pb-[32px] font-medium">
            <label className="flex items-center space-x-[8px]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
                className="peer appearance-none [-webkit-appearance:none] border border-[#CCC] w-[18px] h-[18px] rounded-[5px]
             checked:bg-[#A20BA2] checked:border-[#A20BA2] disabled:opacity-50"
              />
              <span className="absolute left-4 text-white text-xs hidden peer-checked:block">
                ✔
              </span>

              <span className="text-[#999999]">Remember me</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-[#4D4D4D] hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Sign in button */}
          <Button
            text={loading ? "Signing in..." : "Sign in"}
            type="submit"
            disabled={loading}
          />
        </form>

        {/* OR divider */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-[#E6E6E6]" />
          <span className="px-2 text-sm text-[#666666]">OR</span>
          <hr className="flex-grow border-[#E6E6E6]" />
        </div>

        {/* Sign up button */}
        <Link to="/choose-type">
          <button
            className="w-full bg-[#E6E6E6 ] py-3 rounded-[10px] text-[#666666] mb-[140px] h-[56px] text-[16px] font-regular disabled:opacity-50"
            disabled={loading}
          >
            Sign up
          </button>
        </Link>

        {/* Footer */}
        <div className="flex justify-center space-x-4 text-[14px] text-[#333333] pb-[-1px]">
          <Link to="/terms" className="hover:underline">
            Terms & Conditions
          </Link>
          <Link to="/privacy-policy" className="hover:underline">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
