import Navigation from "../../components/dashboard/Navigation";
import { Link } from "react-router-dom";

export default function GuestListing() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F9F9F9]">
      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Card */}
        <div className="bg-white rounded-[5px] shadow-md overflow-hidden max-w-sm w-full">
          <img
            src="/images/listing-img.png"
            alt="Listing"
            className="w-full p-2 rounded-[13px] h-[202px] object-cover"
          />

          <div className="mt-2 mb-5 w-[309px] mx-auto text-center">
            <h2 className="text-[16px] font-medium text-black">
              Start Hosting in Minutes.
            </h2>
            <p className="mt-3 text-[14px] text-black leading-relaxed">
              Get bookings from verified guests. You set the price, rules, and
              deposit. We handle the rest with secure escrow and ID checks.
            </p>
          </div>
        </div>

        {/* Start Button */}
        <Link to="/basic-info" className="block mt-40 w-full max-w-sm">
          <button className="w-full bg-[#A20BA2] text-white text-[16px] font-medium py-3 rounded-md">
            Start
          </button>
        </Link>
      </main>

      {/* Bottom Navigation */}
      <footer className="sticky bottom-0">
        <Navigation />
      </footer>
    </div>
  );
}
