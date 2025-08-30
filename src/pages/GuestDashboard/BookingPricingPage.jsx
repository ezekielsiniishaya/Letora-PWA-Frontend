import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "../../components/Button";

export default function BookingPricingPage() {
  const [budget, setBudget] = useState(30000); // slider state
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#F9F9F9] px-[20px]">
      {/* Header */}
      <div className="w-full flex items-center justify-between mt-[20px]">
        <img
          src="/icons/arrow-left.svg"
          alt="Back"
          className="w-[16px] cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <span className="text-[13.2px] font-medium bg-[#A20BA2] text-white px-[6.6px] w-[33px] h-[18.43px] rounded-[7.92px]">
          5/8
        </span>
      </div>

      {/* Content */}
      <div className="w-full max-w-sm mt-[26px]">
        <h2 className="text-[24px] font-medium text-[#0D1321]">
          Booking Pricing
        </h2>
        <p className="text-[14px] text-[#666666] mt-[4px]">
          Now let's talk Money{" "}
        </p>

        <form className="mt-[45px] flex flex-col" onSubmit={handleSubmit}>
          {/* Money Icon */}
          <div className="flex justify-center">
            <img
              src="/icons/money.png"
              alt="Money Icon"
              className="w-[111px] h-[111px]"
            />
          </div>
          <p className="text-center mb-[50px] mt-[-8px] text-[14px] font-medium text-[#333333]">
            Set your Price
          </p>

          {/* Deposit Slider */}
          <div>
            <input
              type="range"
              min={30000}
              max={1000000}
              step={1000}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full mt-3 slider-custom"
              style={{
                background: `linear-gradient(
                  to right, 
                  #A20BA2 0%, 
                  #A20BA2 ${((budget - 30000) / (1000000 - 30000)) * 100}%, 
                  #FBD0FB ${((budget - 30000) / (1000000 - 30000)) * 100}%, 
                  #FBD0FB 100%
                )`,
              }}
            />

            {/* Price / Night */}
            <div className="text-center mt-4">
              <span className="text-[18px] font-semibold text-[#333333]">
                N{budget.toLocaleString()}/{" "}
                <span className="font-light text-[15px]">Night</span>
              </span>
            </div>
          </div>

          {/* Next Button */}
          <Link to="/security-deposit">
            <div className="mt-[196px]">
              <Button text="Next" type="submit" />
            </div>
          </Link>
        </form>
      </div>
    </div>
  );
}
