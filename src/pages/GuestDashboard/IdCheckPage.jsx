import { Link, useNavigate } from "react-router-dom";

export default function IdCheckPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col min-h-screen bg-[#F9F9F9]">
      {/* Header */}
      <div className="w-full mt-[20px] px-[20px]">
        <img
          src="/icons/arrow-left.svg"
          alt="Back"
          className="w-[18px] cursor-pointer"
          onClick={() => navigate(-1)}
        />

        <header className="mt-4">
          <h1 className="text-[24px] font-medium text-[#0D1321]">
            Identity Verification
          </h1>
          <p className="text-[#666666] text-[14px]">
            Let's Quickly confirm its you
          </p>
        </header>
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Card */}
        <div className="bg-white rounded-[5px] overflow-hidden max-w-sm w-full">
          <img
            src="/images/guest-id.jpg"
            alt="Listing"
            className="w-[330px] mx-auto mt-3 rounded-[13px] h-[210px]"
          />

          <div className="mt-3 mb-5 w-[309px] mx-auto text-center">
            <h2 className="text-[16px] font-medium text-black">
              Welcome to ID Check
            </h2>
            <p className="mt-3 text-[14px] text-black leading-relaxed">
              Before you book, we just need to confirm your identity for
              everyone’s safety on Letora. It only takes a minute and your
              details stay private.
            </p>
          </div>
        </div>

        {/* Start Button */}
        <Link to="/guest-id" className="block mt-[110px] w-full max-w-sm">
          <button className="w-full bg-[#A20BA2] text-white text-[16px]  h-[57px] font-medium py-3 rounded-[10px]">
            Continue
          </button>
        </Link>
      </main>
    </div>
  );
}
