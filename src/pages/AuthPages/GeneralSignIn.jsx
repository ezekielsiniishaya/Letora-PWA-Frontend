import { useState, useEffect } from "react";
import Button from "../../components/Button";
import Header from "../../components/Header";
import PasswordInput from "../../components/auth/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { loginAPI } from "../../services/authApi";
import { useUser } from "../../hooks/useUser";
import { useHostProfile } from "../../contexts/HostProfileContext";
import { useApartmentListing } from "../../hooks/useApartmentListing";
import Alert from "../../components/utils/Alerts";
import { useBackgroundColor } from "../../contexts/BackgroundColorContext.jsx";
import { StatusBar, Style } from "@capacitor/status-bar";
import { Preferences } from "@capacitor/preferences";

const REMEMBER_ME_KEY = "rememberMe";
const REMEMBERED_EMAIL_KEY = "rememberedEmail";
const REQUIRES_ID_VERIFICATION_KEY = "requiresIdentityVerification";
const DOCUMENT_STATUS_KEY = "documentStatus";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({ email: "", password: "" });

  const navigate = useNavigate();
  const { login, logout } = useUser();
  const { clearHostProfileData } = useHostProfile();
  const { clearApartments } = useApartmentListing();
  const { setBackgroundColor } = useBackgroundColor();

  useEffect(() => {
    setBackgroundColor("#F9F9F9");

    if (window.Capacitor || window.capacitor) {
      StatusBar.setBackgroundColor({ color: "#F9F9F9" });
      StatusBar.setStyle({ style: Style.Light });
    }

    // Restore rememberMe + email from Preferences
    const initRememberMe = async () => {
      const { value: rememberValue } = await Preferences.get({
        key: REMEMBER_ME_KEY,
      });

      const remembered = rememberValue === "true";
      setRememberMe(remembered);

      if (remembered) {
        const { value: savedEmail } = await Preferences.get({
          key: REMEMBERED_EMAIL_KEY,
        });
        if (savedEmail) setEmail(savedEmail);
      }
    };

    initRememberMe();
  }, [setBackgroundColor]);

  const clearAllUserData = async () => {
    await Preferences.remove({ key: REMEMBER_ME_KEY });
    await Preferences.remove({ key: REMEMBERED_EMAIL_KEY });
    await Preferences.remove({ key: REQUIRES_ID_VERIFICATION_KEY });
    await Preferences.remove({ key: DOCUMENT_STATUS_KEY });

    logout();
    clearHostProfileData();
    clearApartments();
  };

  const validateEmail = (value) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    await clearAllUserData();

    const newFieldErrors = {};

    if (!email.trim()) {
      newFieldErrors.email = "This field is required.";
    } else if (!validateEmail(email)) {
      newFieldErrors.email = "Please enter a valid email address.";
    }

    if (!password.trim()) {
      newFieldErrors.password = "This field is required.";
    }

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      return;
    }

    setLoading(true);
    try {
      const result = await loginAPI(email, password);

      // This will store token in Preferences via UserProvider
      await login(result.user, result.accessToken);

      if (rememberMe) {
        await Preferences.set({ key: REMEMBER_ME_KEY, value: "true" });
        await Preferences.set({ key: REMEMBERED_EMAIL_KEY, value: email });
      } else {
        await Preferences.remove({ key: REMEMBER_ME_KEY });
        await Preferences.remove({ key: REMEMBERED_EMAIL_KEY });
      }

      if (result.requiresIdentityVerification) {
        await Preferences.set({
          key: REQUIRES_ID_VERIFICATION_KEY,
          value: "true",
        });
        await Preferences.set({
          key: DOCUMENT_STATUS_KEY,
          value: JSON.stringify(result.documentStatus),
        });
      }

      navigate(result.redirectPath);
    } catch (err) {
      console.error("Login error details:", {
        fullError: err,
        message: err?.message,
        response: err?.response?.data,
        status: err?.response?.status,
        name: err?.name,
      });

      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        err?.toString() ||
        "";
      const lowerCaseMsg = errorMessage.toLowerCase();

      if (
        lowerCaseMsg.includes("network") ||
        lowerCaseMsg.includes("offline") ||
        lowerCaseMsg.includes("fetch") ||
        lowerCaseMsg.includes("failed to fetch") ||
        err?.name === "TypeError" ||
        err?.name === "NetworkError" ||
        !navigator.onLine
      ) {
        setError("network");
      } else if (
        lowerCaseMsg.includes("credential") ||
        lowerCaseMsg.includes("unauthorized") ||
        lowerCaseMsg.includes("invalid") ||
        lowerCaseMsg.includes("incorrect") ||
        err?.response?.status === 401
      ) {
        if (!validateEmail(email)) {
          setFieldErrors({
            email: "",
            password: "",
          });
        } else {
          setFieldErrors({
            email: "Wrong or incorrect email address",
            password: "Wrong or incorrect password",
          });
        }
      } else {
        setError("server");
      }
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

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label className="block text-[14px] font-medium text-[#686464] mt-[32px]">
              Email Address
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setFieldErrors((prev) => ({ ...prev, email: "" }));
              }}
              className={`border mt-[8px] w-full h-[48px] rounded-md px-3 py-2 text-sm outline-none disabled:opacity-50
                ${
                  fieldErrors.email
                    ? "border-[#F81A0C]"
                    : "focus:ring-[#A20BA2] focus:border-[#A20BA2]"
                }`}
              disabled={loading}
            />
            {fieldErrors.email && (
              <p className="text-[#F81A0C] text-[12px] mt-1">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <PasswordInput
            label="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setFieldErrors((prev) => ({ ...prev, password: "" }));
            }}
            disabled={loading}
            hasError={!!fieldErrors.password}
            errorMessage={fieldErrors.password}
          />

          <div className="flex items-center justify-between text-[14px] pb-[32px] font-medium">
            <label className="flex items-center space-x-[8px]">
              <span className="relative inline-flex items-center justify-center w-[18px] h-[18px]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                  className="peer appearance-none [-webkit-appearance:none] border border-[#CCC] w-full h-full rounded-[5px]
      checked:bg-[#A20BA2] checked:border-[#A20BA2] disabled:opacity-50"
                />
                <span className="pointer-events-none absolute inset-0 items-center justify-center text-white text-xs hidden peer-checked:flex">
                  ✓
                </span>
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

          <Button
            text={loading ? "Signing in..." : "Sign in"}
            type="submit"
            disabled={loading}
          />
        </form>

        <div className="flex items-center my-6">
          <hr className="flex-grow border-[#E6E6E6]" />
          <span className="px-2 text-sm text-[#666666]">OR</span>
          <hr className="flex-grow border-[#E6E6E6]" />
        </div>

        <Link to="/choose-type">
          <button
            className="w-full bg-[#E6E6E6] py-3 rounded-[10px] text-[#666666] mb-[140px] h-[56px] text-[16px] font-regular disabled:opacity-50"
            disabled={loading}
          >
            Sign up
          </button>
        </Link>

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
