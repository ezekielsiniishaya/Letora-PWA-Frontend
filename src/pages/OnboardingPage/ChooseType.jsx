import Header from "../../components/Header";
import { Link } from "react-router-dom";

export default function ChooseType() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-[#F9F9F9] px-6">
      <Header />
      {/* Greeting */}
      <div className="flex flex-col items-center mt-[79.42px] text-center">
        <img
          src="/icons/hands.svg"
          alt="Letora Logo"
          className="w-[95px] h-[95px] mb-[14px]"
        />
        <p className="text-[#333333] text-[16px] font-medium">
          Hello there, What action do
          <br />
          you wanna carry out?
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col space-y-[21px] mt-[53px]">
        <button className="flex items-center space-x-3 border w-[334px] h-[54px] bg-[#FFFFFF] rounded-lg px-4 py-3">
          <img
            src="/icons/landlord.png"
            alt="Letora Logo"
            className="w-[32px] h-[34px]"
          />
          <span className="text-[#666666] font-regular text-[14px]">
            I want to list my apartment as Shortlet
          </span>
        </button>

        <Link to="/guest-sign-up">
          <button className="flex items-center space-x-3 border w-[334px] h-[54px] bg-[#FFFFFF] rounded-lg px-4 py-3">
            <img
              src="/icons/guests.png"
              alt="Letora Logo"
              className="w-[32px] h-[34px]"
            />
            <span className="text-[#666666] font-regular text-[14px]">
              I want to book a Shortlet apartment
            </span>
          </button>
        </Link>
      </div>

      {/* Footer */}
      <div className="mt-[172px]">
        <p className="text-sm text-[#000000] text-[14px] font-medium">
          Have an account?{" "}
          <Link to="/sign-in" className="text-[#8C068C]">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
