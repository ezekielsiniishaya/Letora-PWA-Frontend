import { useState, useEffect } from "react";
import Navigation from "../../components/dashboard/Navigation";
import { Link } from "react-router-dom";

export default function GuestListing() {
  const [currentImage, setCurrentImage] = useState("/images/listing-img.png");

  useEffect(() => {
    const images = ["/images/listing-img.png", "/images/listing-img-2.png"];
    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % images.length;
      setCurrentImage(images[index]);
    }, 3000); // 3 seconds

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#F9F9F9]">
      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-[21px]">
        {/* Card */}
        <div className="bg-white rounded-[5px] overflow-hidden max-w-sm w-full">
          <img
            src={currentImage}
            alt="Listing"
            className="w-full p-3 rounded-[5px] h-[242px] object-cover"
          />

          <div className="mt-2 mb-5 w-[329px] px-[-12px] mx-auto text-center">
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
        <Link to="/basic-info" className="block mt-40 w-full">
          <button className="w-full bg-[#A20BA2] text-white h-[57px] text-[16px] font-semibold py-3 rounded-md">
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
