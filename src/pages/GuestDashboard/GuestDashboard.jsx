import { useState } from "react";
import ApartmentSlider from "../../components/dashboard/ApartmentSlider";
import ApartmentCard from "../../components/dashboard/ApartmentCard";
import WithdrawPopup from "../../components/dashboard/WithdrawPopUp";
import ShowSuccess from "../../components/ShowSuccess";
import { Link } from "react-router-dom";
import Bookings from "../../components/dashboard/Bookings";
import Navigation from "../../components/dashboard/Navigation";
import { Verified } from "lucide-react";

export default function Dashboard() {
  const [showBalance, setShowBalance] = useState(true);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const balance = "569,098.879";

  const lodge = {
    id: 1,
    title: "3-Bedroom Apartment",
    location: "Maryland, Lagos",
    image: "/images/apartment.png",
    price: "₦150,000/Night",
    status: "ongoing",
    bookingDate: "30-Nov-2025 | 10:00 AM",
    checkIn: "30-Nov-2025",
    checkOut: "30-Dec-2025",
    duration: "30 Days",
    feePaid: "₦1,500,000",
    deposit: "₦100,000",
    convenience: "₦2,500",
    total: "₦1,602,500",
    hostPhone: "09876543221",
    hostEmail: "host@mail.com",
    cancellationDate: "15-Dec-2025",
    cancellationReason:
      "HedamagedksckhkhcajadsakjhdbsjbkabkSKkjbxcjsakssdkhkdhkdfewdhwekdkdddkjhkjdhjashhadagasgdbcsdadghgdhaghagdh",
  };
  const apartment = {
    id: 1,
    title: "3-Bedroom Apartment",
    location: "Maryland, Lagos",
    image: "/images/apartment.png",
    price: "₦150,000",
    verified: "true",
    rating: "4.0",
    status: "ongoing",
    bookingDate: "30-Nov-2025 | 10:00 AM",
    checkIn: "30-Nov-2025",
    checkOut: "30-Dec-2025",
    duration: "30 Days",
    feePaid: "₦1,500,000",
    deposit: "₦100,000",
    convenience: "₦2,500",
    likes: "15",
    total: "₦1,602,500",
    hostPhone: "09876543221",
    hostEmail: "host@mail.com",
    cancellationDate: "15-Dec-2025",
    cancellationReason:
      "HedamagedksckhkhcajadsakjhdbsjbkabkSKkjbxcjsakssdkhkdhkdfewdhwekdkdddkjhkjdhjashhadagasgdbcsdadghgdhaghagdh",
  };
  const apartments = Array.from({ length: 6 }, (_, i) => ({
    ...apartment,
    id: i + 1,
    verified: i % 2 === 0, // odd → true, even → false
    rating: i % 2 === 0 ? "4.0" : "0.0", // alternate stars
    title: i % 2 === 0 ? "2-Bedroom Apartment" : "Self-Con/Studio", // alternate title
    location: i % 2 === 0 ? "Ikoyi, Lagos" : "Surulere, Lagos", // alternate location
  }));

  return (
    <div className="w-full min-h-screen bg-[#F9F9F9] overflow-x-hidden pb-[80px]">
      <div className="relative bg-[#8C068C] h-[252px] text-white px-[20px] pt-[14px]">
        {/* Header Row */}
        <div className="flex flex-row justify-between items-center">
          {/* Left: Guest info */}
          <div className="flex items-center gap-3">
            <img
              src="/images/guest.jpg"
              alt="Guest"
              className="w-[40px] h-[40px] rounded-full object-cover"
            />
            <div>
              <h2 className="text-[16px] font-semibold">Paul Ayodamola</h2>
              <p className="text-[12px] text-[#FBD0F8]">Good morning</p>
            </div>
          </div>

          {/* Right: Search + Notifications */}
          <div className="flex items-center gap-5">
            <Link to="/search">
              <img
                src="/icons/search.svg"
                alt="Search"
                className="w-[16.67px] h-[16.67px] cursor-pointer"
              />
            </Link>
            <div className="relative">
              <img
                src="/icons/notification.svg"
                alt="Notifications"
                className="w-[16.65px] h-[16.65px] cursor-pointer"
              />
              {/* Badge */}
              <span className="absolute -top-1 -right-[6px] bg-white text-purple-600 text-[8.69px] font-medium rounded-full w-[15px] h-[15px] flex items-center justify-center shadow">
                5
              </span>
            </div>
          </div>
        </div>

        {/* Balance Section */}
        <div className="mt-[26px] flex flex-col items-center">
          <div className="flex items-center gap-2">
            <p className="text-[14px] font-medium text-[#FBD0FB]">
              Current Balance
            </p>
            <img
              src={showBalance ? "/icons/eye-open.svg" : "/icons/eye-close.svg"}
              alt="Toggle Balance"
              className="w-[18.58px] h-[18.58px] cursor-pointer"
              onClick={() => setShowBalance(!showBalance)}
            />
          </div>
          <h1 className="text-[40px] font-semibold mt-[1px]">
            <span className="text-[28.43px]">N</span>
            {showBalance ? (
              <>
                569,098.
                <span className="text-[#FBD0FB] text-[20px] font-medium">
                  879
                </span>
              </>
            ) : (
              <>
                {"******."}
                <span className="text-[#FBD0FB] text-[18px] font-medium">
                  ***
                </span>
              </>
            )}
          </h1>
          <button
            onClick={() => setShowWithdraw(true)}
            className="mt-[18px] bg-white text-[#8C167E] text-[15.3px] rounded-[5px] font-semibold flex items-center justify-center gap-2 w-[197.03px] h-[41.53px]"
          >
            <img
              src="/icons/arrow-slant.svg"
              alt="arrow-slant"
              className="w-[14px] h-[12px] object-cover"
            />
            <span>Withdraw</span>
          </button>
          {/* Popups */}
          {showWithdraw && (
            <WithdrawPopup
              balance={balance}
              onClose={() => setShowWithdraw(false)}
              onSuccess={() => setShowSuccess(true)}
            />
          )}
          {/* Show Success Popup */}
          {showSuccess && (
            <ShowSuccess
              image="/icons/Illustration.svg"
              heading="Withdrawal Successful"
              message="₦550,000 has been moved from your Letora wallet to your bank account. Arrival time may vary by bank."
              buttonText="Done"
              onClose={() => setShowSuccess(false)}
              height="auto"
            />
          )}
        </div>

        {/* Background Logo (watermark bottom-right) */}
        <img
          src="/icons/logo.svg"
          alt="Logo"
          className="absolute -bottom-5 -right-10 opacity-10 w-[196px] h-[189.88px]"
        />
      </div>

      {/* My Booking Section */}
      {/* Header */}
      <div className="px-[21px] mt-[25px]">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium text-[14px]">My Booking 🗂</h3>
          <Link to="/bookings">
            <button className="text-[12px] font-medium text-[#A20BA2]">
              See all
            </button>
          </Link>
        </div>
        <Bookings lodge={lodge} status={"ongoing"} />
      </div>
      {/* Hot Apartments Section */}
      <div className="px-[22px] mt-1">
        <div className="flex justify-between items-center">
          <h3 className="font-medium my-4 text-[14px]">Hot Apartments 🔥</h3>
          <Link to="/hot-apartments">
            <button className="text-[12px] font-medium text-[#A20BA2]">
              See all
            </button>
          </Link>
        </div>
      </div>
      <div className="pl-[22px] pb-3">
        <ApartmentSlider />
      </div>
      {/* Become a Host Section */}
      <Link to="/identity-id">
        <div className="px-[22px]">
          <div className="relative bg-gradient-to-r from-[#910A91] to-[#F711F7] rounded-[8px] px-[12px] flex items-center justify-between overflow-hidden h-[106.04px]">
            {/* Left: Text Content */}
            <div className="text-white max-w-[70%] z-10">
              <h3 className="font-semibold text-[16px] mb-1">Become a Host</h3>
              <p className="text-[12px] leading-snug">
                Ready to cash in on your space? <br />
                Verify your identity and list today.
              </p>
              <button className="mt-2 text-[10px]">Click here to begin</button>
            </div>

            {/* Right: Host Image + Star + Doodle */}
            <div className="absolute right-[-10px] bottom-0 h-full flex items-end justify-end">
              {/* Host Image */}
              <img
                src="/images/background/become-host.png"
                alt="Become a Host"
                className="h-[117px] object-contain transform scale-x-[-1] relative z-10"
              />

              {/* Star (top) */}
              <img
                src="/icons/star.svg"
                alt="star"
                className="absolute top-[15px] right-[114.3px] w-[9px] h-[9px] z-20"
              />

              {/* Doodle (bottom) */}
              <img
                src="/icons/doodle.svg"
                alt="doodle"
                className="absolute bottom-[12.27px] right-[121.73px] w-[6.3px] h-[5.4px] z-20"
              />
            </div>
          </div>
        </div>
      </Link>

      <div className="px-[22px]">
        <div className="flex justify-between items-center">
          <h3 className="font-medium my-4 text-[14px]">
            Available in your Location 📍
          </h3>
          <Link to="/apartments">
            <button className="text-[12px] font-medium text-[#A20BA2]">
              See all
            </button>
          </Link>
        </div>
        <div className="space-y-1">
          {apartments.map((apt) => (
            <ApartmentCard key={apt.id} apt={apt} />
          ))}
        </div>
      </div>
      {/* Bottom Navigation */}
      <Navigation />
    </div>
  );
}
