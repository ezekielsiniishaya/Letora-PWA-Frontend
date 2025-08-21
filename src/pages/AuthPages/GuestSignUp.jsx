import Button from "../../components/Button";
import Header from "../../components/Header";
import GenderDropdown from "./GenderDropDown";
import StateDropdown from "./StateDropDown";
import { Link } from "react-router-dom";

export default function GuestSignUp() {
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
          Create an account as a Guest
        </p>

        <form className="space-y-4">
          {/* First Name */}
          <div>
            <label className="block text-[14px] font-medium text-[#686464] mt-[32px]">
              First Name <span className="text-red-500 mr-1">*</span>
            </label>
            <input
              placeholder="As seen in your documents"
              type="text"
              className="border mt-[8px] w-full h-[48px] bg-white rounded-md px-4 py-2 text-sm"
            />
          </div>
          {/* Last Name */}
          <div>
            <label className="block text-[14px] font-medium text-[#686464] mt-[32px]">
              Last Name <span className="text-red-500 mr-1">*</span>
            </label>
            <input
              placeholder="As seen in your documents"
              type="text"
              className="border mt-[8px] w-full h-[48px] text-[#666666] rounded-md px-4 py-2 text-sm"
            ></input>
          </div>
          {/* Gender */}
          <GenderDropdown />

          {/* State of Origin */}
          <StateDropdown />

          {/* Email */}
          <div>
            <label className="block text-[14px] font-medium text-[#686464] mt-[32px]">
              Email <span className="text-red-500 mr-1">*</span>
            </label>
            <input
              type="email"
              className="border mt-[8px] w-full h-[48px] rounded-md px-3 py-2 text-sm focus:ring-[#A20BA2] focus:border-[#A20BA2] outline-none"
            />
          </div>
          {/* Phone Number */}
          <div className="mt-[32px]">
            <label className="block text-[14px] font-medium text-[#686464] mb-2">
              Valid Phone Number <span className="text-red-500 mr-1">*</span>
            </label>
            <div className="flex items-center border rounded-md h-[48px] px-3 bg-white">
              {/* Nigerian flag circle */}
              <div
                className="w-5 h-5 rounded-full flex-shrink-0 mr-2"
                style={{
                  background:
                    "linear-gradient(to right, #008751 33%, #F5F5F5 33%, #F5F5F5 66%, #008751 66%)",
                }}
              ></div>
              <span className="text-sm text-[#666666] mr-2">+234</span>
              <input
                type="tel"
                placeholder="Enter phone number"
                className="flex-1 outline-none bg-white text-sm"
              />
            </div>
          </div>

          {/* Alternate Phone Number */}
          <div className="mt-[16px] pb-[62px]">
            <label className="block text-[14px] font-medium text-[#686464] mb-2">
              Alternate Valid Phone Number (optional)
            </label>
            <div className="flex items-center border rounded-md h-[48px] px-3 bg-white">
              {/* Nigerian flag circle */}
              <div
                className="w-5 h-5 rounded-full flex-shrink-0 mr-2"
                style={{
                  background:
                    "linear-gradient(to right, #008751 33%, #F5F5F5 33%, #F5F5F5 66%, #008751 66%)",
                }}
              ></div>
              <span className="text-sm text-[#666666] mr-2">+234</span>
              <input
                type="tel"
                placeholder="Enter alternate phone number"
                className="flex-1 outline-none bg-white text-sm"
              />
            </div>
          </div>
          <Link to="/verify-email">
            {/* Sign in button */}
            <Button text="Proceed" />
          </Link>
        </form>

        {/* OR divider */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-[#E6E6E6]" />
          <span className="px-2 text-sm text-[#666666]">OR</span>
          <hr className="flex-grow border-[#E6E6E6]" />
        </div>

        {/* Sign up button */}
        <Link to="/sign-in">
          <button className="w-full  bg-[#E6E6E6] py-3 rounded-[10px] text-[#666666] h-[56px] mb-[56px] text-[16px] font-regular">
            Sign in
          </button>
        </Link>
      </div>
    </div>
  );
}
