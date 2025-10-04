import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import Button from "../Button";
import Header from "../Header";
import GenderDropdown from "./GenderDropDown";
import StateDropdown from "./StateDropDown";
import { registerAPI } from "../../services/authApi"; // Import from authApi

export default function SignUpForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get role from URL parameter, default to "guest"
  const urlRole = searchParams.get("role") || "guest";

  // Track form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    stateOrigin: "",
    email: "",
    phone: "",
    phone2: "",
    role: urlRole.toUpperCase(), // Convert to uppercase for server
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Update role when URL parameter changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      role: urlRole.toUpperCase(),
    }));
  }, [urlRole]);

  // Update form data on change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(""); // Clear error when user starts typing
  };

  // Handle form submission - ensure role is included
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Prepare the data with the correct role
    const submissionData = {
      ...formData,
      role: urlRole.toUpperCase(), // Ensure role is from URL, not form input
    };

    try {
      // Remove the const result declaration since we don't use it
      await registerAPI(submissionData);

      // Success - redirect to verify email page
      // You might want to pass the email as state or store it in context
      navigate("/verify-email", {
        state: { email: formData.email },
      });
    } catch (err) {
      console.error("Error registering user:", err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col items-center min-h-screen bg-[#F9F9F9] px-[20px]">
      {/* Header */}
      <Header />

      {/* Form */}
      <div className="w-full max-w-sm mt-[26.42px]">
        <h2 className="text-[24px] font-medium text-[#1A1A1A]">
          Lets Get to Know you 🤟
        </h2>
        <p className="text-[16px] text-[#666666] mt-[4px]">
          Create an account as a {urlRole}
        </p>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* First Name */}
          <div>
            <label className="block text-[14px] font-medium text-[#686464] mt-[32px]">
              First Name <span className="text-red-500 mr-1">*</span>
            </label>
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="As seen in your documents"
              type="text"
              className="border mt-[8px] w-full h-[48px] bg-white rounded-md px-4 py-2 text-sm"
              required
              disabled={loading}
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-[14px] font-medium text-[#686464] mt-[32px]">
              Last Name <span className="text-red-500 mr-1">*</span>
            </label>
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="As seen in your documents"
              type="text"
              className="border mt-[8px] w-full h-[48px] text-[#666666] rounded-md px-4 py-2 text-sm"
              required
              disabled={loading}
            />
          </div>

          {/* Gender */}
          <div className="mt-[10px]">
            <GenderDropdown
              value={formData.gender}
              onChange={(gender) => setFormData({ ...formData, gender })}
              disabled={loading}
            />
          </div>

          {/* State of Origin */}
          <div className="mt-[10px]">
            <StateDropdown
              value={formData.stateOrigin}
              onChange={(stateOrigin) =>
                setFormData({ ...formData, stateOrigin })
              }
              disabled={loading}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-[14px] font-medium text-[#686464] mt-[32px]">
              Email <span className="text-red-500 mr-1">*</span>
            </label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              className="border mt-[8px] w-full h-[48px] rounded-md px-3 py-2 text-sm focus:ring-[#A20BA2] focus:border-[#A20BA2] outline-none disabled:opacity-50"
              required
              disabled={loading}
            />
          </div>

          {/* Phone Number */}
          <div className="pt-[18px]">
            <label className="block text-[14px] font-medium text-[#686464] mb-2">
              Valid Phone Number <span className="text-red-500 mr-1">*</span>
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
          </div>

          {/* Alternate Phone */}
          <div className="pt-[18px] pb-[62px]">
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

          {/* Submit Button */}
          <Button
            type="submit"
            text={loading ? "Creating Account..." : "Proceed"}
            disabled={loading}
          />
        </form>

        {/* OR divider */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-[#E6E6E6]" />
          <span className="px-2 text-sm text-[#666666]">OR</span>
          <hr className="flex-grow border-[#E6E6E6]" />
        </div>

        {/* Sign in button */}
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
