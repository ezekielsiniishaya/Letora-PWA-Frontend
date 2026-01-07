import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import Button from "../Button";
import Header from "../Header";
import GenderDropdown from "./GenderDropDown";
import StateDropdown from "./StateDropDown";
import Alert from "../utils/Alerts";
import { registerAPI } from "../../services/authApi";
import { useBackgroundColor } from "../../contexts/BackgroundColorContext.jsx";
import { StatusBar, Style } from "@capacitor/status-bar";

export default function SignUpForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { setBackgroundColor } = useBackgroundColor();

  useEffect(() => {
    setBackgroundColor("#F9F9F9"); // page background

    if (window.Capacitor || window.capacitor) {
      StatusBar.setBackgroundColor({ color: "#F9F9F9" });
      StatusBar.setStyle({ style: Style.Light }); // dark icons on light bar
    }
  }, [setBackgroundColor]);
  const urlRole = searchParams.get("role") || "guest";

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    stateOrigin: "",
    email: "",
    phone: "",
    phone2: "",
    role: urlRole.toUpperCase(),
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      role: urlRole.toUpperCase(),
    }));
  }, [urlRole]);

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const newErrors = {};

    // ✅ Required text fields
    if (!formData.firstName.trim())
      newErrors.firstName = "This field is required.";
    if (!formData.lastName.trim())
      newErrors.lastName = "This field is required.";
    if (!formData.phone.trim()) newErrors.phone = "This field is required.";

    // ✅ Dropdowns
    if (!formData.gender.trim())
      newErrors.gender = "Please select your gender.";
    if (!formData.stateOrigin.trim())
      newErrors.stateOrigin = "Please select your state of origin.";

    // ✅ Email validation
    if (!formData.email.trim()) {
      newErrors.email = "This field is required.";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await registerAPI({
        ...formData,
        role: urlRole.toUpperCase(),
      });

      // ✅ Save email to localStorage before navigation
      localStorage.setItem("verificationEmail", formData.email);

      navigate("/verify-email", { state: { email: formData.email } });
    } catch (err) {
      console.error("Error registering user:", err);

      const errorResponse = err.response?.data || {};
      const errorMessage = errorResponse.error || errorResponse.message || "";

      console.log("Error response data:", errorResponse);

      // Check for specific backend error messages
      if (
        errorMessage.toLowerCase().includes("network") ||
        errorMessage.toLowerCase().includes("fetch")
      ) {
        setError("network");
      } else if (errorMessage.toLowerCase().includes("email")) {
        setError("email");
      } else if (errorMessage.toLowerCase().includes("phone")) {
        // Handle phone-related errors specifically
        setError("phone");
      } else if (
        err.response?.status === 409 ||
        errorMessage.toLowerCase().includes("already exists") ||
        errorMessage.toLowerCase().includes("duplicate")
      ) {
        // Generic duplicate error - show backend message
        setError(errorMessage || "User already exists");
      } else if (err.response?.status === 400) {
        if (errorResponse.errors) {
          const serverFieldErrors = {};
          Object.keys(errorResponse.errors).forEach((field) => {
            serverFieldErrors[field] = errorResponse.errors[field][0];
          });
          setFieldErrors(serverFieldErrors);
        } else {
          setError("validation");
        }
      } else if (err.response?.status >= 500) {
        setError("server");
      } else {
        setError("unknown");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#F9F9F9] px-[20px]">
      <Header />

      <div className="w-full max-w-sm mt-[26.42px]">
        <h2 className="text-[24px] font-medium text-[#1A1A1A]">
          Let’s Get to Know You 🤟
        </h2>
        <p className="text-[16px] text-[#666666] mt-[4px]">
          Create an account as a {urlRole}
        </p>

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          {/* First Name */}
          <div>
            <label className="block text-[14px] font-medium text-[#686464] mt-[32px]">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter first name as seen on your BVN"
              type="text"
              className={`border mt-[8px] w-full h-[48px] rounded-md px-4 py-2 text-sm outline-none
                ${
                  fieldErrors.firstName
                    ? "border-[#F81A0C]"
                    : "focus:ring-[#A20BA2] focus:border-[#A20BA2]"
                }`}
              disabled={loading}
            />
            {fieldErrors.firstName && (
              <p className="text-[#F81A0C] text-[10px] mt-1">
                {fieldErrors.firstName}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-[14px] font-medium text-[#686464] mt-[32px]">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter last name as seen on your BVN"
              type="text"
              className={`border mt-[8px] w-full h-[48px] rounded-md px-4 py-2 text-sm outline-none
                ${
                  fieldErrors.lastName
                    ? "border-[#F81A0C]"
                    : "focus:ring-[#A20BA2] focus:border-[#A20BA2]"
                }`}
              disabled={loading}
            />
            {fieldErrors.lastName && (
              <p className="text-[#F81A0C] text-[10px] mt-1">
                {fieldErrors.lastName}
              </p>
            )}
          </div>

          {/* Gender */}
          <div className="mt-[10px]">
            <GenderDropdown
              value={formData.gender}
              onChange={(gender) => {
                setFormData({ ...formData, gender });
                setFieldErrors((prev) => ({ ...prev, gender: "" }));
              }}
              disabled={loading}
            />
            {fieldErrors.gender && (
              <p className="text-[#F81A0C] text-[10px] mt-1">
                {fieldErrors.gender}
              </p>
            )}
          </div>

          {/* State of Origin */}
          <div className="mt-[10px]">
            <StateDropdown
              value={formData.stateOrigin}
              onChange={(stateOrigin) => {
                setFormData({ ...formData, stateOrigin });
                setFieldErrors((prev) => ({ ...prev, stateOrigin: "" }));
              }}
              disabled={loading}
            />
            {fieldErrors.stateOrigin && (
              <p className="text-[#F81A0C] text-[10px] mt-1">
                {fieldErrors.stateOrigin}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-[14px] font-medium text-[#686464] mt-[32px]">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              placeholder="Enter a valid email"
              className={`border mt-[8px] w-full h-[48px] rounded-md px-3 py-2 text-sm outline-none
                ${
                  fieldErrors.email
                    ? "border-[#F81A0C]"
                    : "focus:ring-[#A20BA2] focus:border-[#A20BA2]"
                }`}
              disabled={loading}
            />
            {fieldErrors.email && (
              <p className="text-[#F81A0C] text-[10px] mt-1">
                {fieldErrors.email}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="pt-[18px]">
            <label className="block text-[14px] font-medium text-[#686464] mb-2">
              Valid Phone Number <span className="text-red-500">*</span>
            </label>
            <div
              className={`flex items-center border rounded-md h-[48px] px-3 bg-white
                ${
                  fieldErrors.phone
                    ? "border-[#F81A0C]"
                    : "focus-within:border-[#A20BA2]"
                }`}
            >
              <div
                className="w-5 h-5 rounded-full flex-shrink-0 mr-2"
                style={{
                  background:
                    "linear-gradient(to right, #008751 33%, #F5F5F5 33%, #F5F5F5 66%, #008751 66%)",
                }}
              ></div>
              <span className="text-sm text-[#666666] mr-2">+234</span>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                type="tel"
                placeholder="Enter phone number"
                className="flex-1 outline-none bg-white text-sm disabled:opacity-50"
                required
                disabled={loading}
              />
            </div>
            {fieldErrors.phone && (
              <p className="text-[#F81A0C] text-[10px] mt-1">
                {fieldErrors.phone}
              </p>
            )}
          </div>

          {/* Alternate Phone */}
          <div className="pt-[18px]">
            <label className="block text-[14px] font-medium text-[#686464] mb-2">
              Alternate Valid Phone Number (optional)
            </label>
            <div className="flex items-center border rounded-md h-[48px] px-3 bg-white">
              <div
                className="w-5 h-5 rounded-full flex-shrink-0 mr-2"
                style={{
                  background:
                    "linear-gradient(to right, #008751 33%, #F5F5F5 33%, #F5F5F5 66%, #008751 66%)",
                }}
              ></div>
              <span className="text-sm text-[#666666] mr-2">+234</span>
              <input
                name="phone2"
                value={formData.phone2}
                onChange={handleChange}
                type="tel"
                placeholder="Enter alternate phone number"
                className="flex-1 outline-none bg-white text-sm disabled:opacity-50"
                disabled={loading}
              />
            </div>
          </div>
          {/* ✅ Alerts */}
          {error === "network" && (
            <div className="mt-4 pb-[62px]">
              <Alert
                type="network"
                message="Network issues. Get better reception and try again."
                onDismiss={() => setError("")} // This will clear the error
                timeout={5000} // Optional: specify timeout in milliseconds
              />
            </div>
          )}
          {error === "email" && (
            <div className="mt-4 pb-[62px]">
              <Alert
                type="error"
                message="Email already exists."
                onDismiss={() => setError("")}
                timeout={5000}
              />
            </div>
          )}
          {error === "server" && (
            <div className="mt-4 pb-[62px]">
              <Alert
                type="error"
                message="Server error. Please try again later."
                onDismiss={() => setError("")}
                timeout={5000}
              />
            </div>
          )}
          {error === "validation" && (
            <div className="mt-4 pb-[62px]">
              <Alert
                type="error"
                message="Please check your input and try again."
                onDismiss={() => setError("")}
                timeout={5000}
              />
            </div>
          )}
          {error === "unknown" && (
            <div className="mt-4 pb-[62px]">
              <Alert
                type="error"
                message="An unexpected error occurred. Please try again."
                onDismiss={() => setError("")}
                timeout={5000}
              />
            </div>
          )}
          {error === "phone" && (
            <div className="mt-4 pb-[62px]">
              <Alert
                type="error"
                message="Phone number already exists."
                onDismiss={() => setError("")}
                timeout={5000}
              />
            </div>
          )}
          <div className="pt-[60px]">
            <Button
              type="submit"
              text={loading ? "Creating Account..." : "Proceed"}
              disabled={loading}
            />
          </div>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-[#E6E6E6]" />
          <span className="px-2 text-sm text-[#666666]">OR</span>
          <hr className="flex-grow border-[#E6E6E6]" />
        </div>

        {/* Sign in */}
        <Link to="/sign-in">
          <button
            className="w-full bg-[#E6E6E6] py-3 rounded-[10px] text-[#666666] h-[56px] mb-[56px] text-[16px] font-regular disabled:opacity-50"
            disabled={loading}
          >
            Sign in
          </button>
        </Link>
      </div>
    </div>
  );
}
