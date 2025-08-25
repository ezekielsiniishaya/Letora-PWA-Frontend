import { useState } from "react";
import ApartmentSlider from "../../components/dashboard/ApartmentSlider";
import ApartmentCard from "../../components/dashboard/ApartmentCard";
import WithdrawPopup from "../../components/dashboard/WithdrawPopUp";
import ShowSuccess from "../../components/ShowSuccess";
import CancelBookingPopup from "../../components/dashboard/CancelBookingPopup";
import ConfirmCancelPopup from "../../components/dashboard/ConfirmCancelPopup";

export default function Dashboard() {
  const [showBalance, setShowBalance] = useState(true);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [showCancelBooking, setShowCancelBooking] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);

  const balance = "569,098.879";

  const lodge = {
    id: 1,
    title: "2-Bedroom Apartment",
    location: "Lekki, Lagos",
    rating: "4.0",
    price: "₦150,000",
    image: "/images/apartment.png",
  };
  const apartment = {
    id: 1,
    title: "2-Bedroom Apartment",
    location: "Ikoyi, Lagos",
    likes: 15,
    rating: "4.0",
    price: "N100k",
    image: "/images/apartment.png",
  };
  const apartments = Array.from({ length: 6 }, (_, i) => ({
    ...apartment,
    id: i + 1,
  }));

  return (
    <div className="w-full min-h-screen bg-[#F9F9F9] overflow-x-hidden pb-[80px]">
      <div className="relative bg-[#8C068C] h-[272px] text-white px-[20px] pt-[14px]">
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
            <img
              src="/icons/search.svg"
              alt="Search"
              className="w-[16.67px] h-[16.67px] cursor-pointer"
            />

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
            <p className="text-[12px] font-regular text-[#FBD0FB]">
              Current Balance
            </p>
            <img
              src={showBalance ? "/icons/eye-open.svg" : "/icons/eye-close.svg"}
              alt="Toggle Balance"
              className="w-[16px] h-[16px] cursor-pointer"
              onClick={() => setShowBalance(!showBalance)}
            />
          </div>
          <h1 className="text-[34px] font-semibold mt-[1px]">
            <span className="text-[21px]">N</span>
            {showBalance ? (
              <>
                569,098.
                <span className="text-[#FBD0FB] text-[18px] font-medium">
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
            className="mt-[18px] bg-white text-[#8C167E] text-[14px] rounded-[5px] font-semibold flex items-center justify-center gap-2 w-[180.41px] h-[38px]"
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
          className="absolute -bottom-4 -right-9 opacity-10 w-[176px] h-[169.88px]"
        />
      </div>

      {/* My Booking Section */}
      <div className="px-[21px] mt-[25px]">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium text-[14px]">My Booking 🏬</h3>
          <button className="text-sm text-[#A20BA2]">See all</button>
        </div>
        <div className="bg-white rounded-[5px] w-full h-[158px] pt-[10px] px-[10px] ">
          <div className="flex gap-4">
            {/* Apartment Image */}
            <img
              src={lodge.image}
              alt={lodge.title}
              className="w-[105.32px] h-[86px] rounded-[2.3px] object-cover"
            />

            {/* Apartment Info */}
            <div className="flex-1 text-[#333333]  flex flex-col">
              {/* Title + Status */}
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-[12px]">{lodge.title}</h4>
                <span className="text-[12px] font-medium bg-[#FFEFD7] text-[#FB9506] px-2 py-[2px] rounded-full">
                  Ongoing
                </span>
              </div>

              {/* Location */}
              <div className="flex items-center mt-[4px] mb-[7px] gap-1">
                <img
                  src="/icons/location.svg"
                  alt="Location"
                  className="w-[11px] h-[13px]"
                />
                <p className="text-[12px]">{lodge.location}</p>
              </div>

              {/* Check-in / Check-out */}
              <div className="flex gap-[30px] mt-[1px] text-[12px] text-[#505050]">
                <div className="flex flex-col items-start">
                  <span className="font-medium">Check-in</span>
                  <span className="text-[#666666]">30-Nov-2025</span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="">Check-out</span>
                  <span className="text-[#666666]">30-Dec-2026</span>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute left-5 right-5 mt-1 border-t border-[#E6E6E6]"></div>

          {/* Buttons */}
          <div className="flex justify-between mt-3">
            <button
              onClick={() => setShowCancelBooking(true)}
              className="border border-[#A20BA2] text-[#A20BA2] px-7 rounded-[5px] text-[12px] font-semibold"
            >
              Cancel Booking
            </button>

            <button className="bg-[#A20BA2] text-white px-6 py-2 rounded-[5px] text-[12px] font-medium">
              View Booking
            </button>
            {showCancelBooking && (
              <CancelBookingPopup
                onClose={() => setShowCancelBooking(false)}
                onSubmit={(reasons) => {
                  console.log("User reasons:", reasons);
                  setShowCancelBooking(false);
                  setShowConfirmCancel(true);
                }}
              />
            )}

            {showConfirmCancel && (
              <ConfirmCancelPopup
                onClose={() => setShowConfirmCancel(false)}
                onConfirm={() => {
                  setShowConfirmCancel(false);
                  setShowCancelSuccess(true);
                }}
              />
            )}

            {showCancelSuccess && (
              <ShowSuccess
                image="/icons/Illustration.svg"
                heading="Booking Successfully Cancelled!"
                message="Your booking has been cancelled.If you're eligible for a refund, it will be processed within 7–10 business days. "
                buttonText="Done"
                onClose={() => setShowCancelSuccess(false)}
                height="auto"
              />
            )}
          </div>
        </div>
      </div>

      {/* Hot Apartments Section */}
      <div className="px-[22px]">
        <div className="flex justify-between items-center">
          <h3 className="font-medium my-4 text-[14px]">Hot Apartments 🔥</h3>
          <button className="text-[12px] font-medium text-[#A20BA2]">
            See all
          </button>
        </div>
      </div>
      <div className="pl-[22px]">
        <ApartmentSlider />
      </div>
      {/* Become a Host Section */}
      <div className="px-[22px] mt-5">
        <div className="relative bg-gradient-to-r from-[#910A91] to-[#F711F7] rounded-[8px] py-[8px] px-[12px] flex items-center justify-between overflow-hidden h-[91px]">
          {/* Left: Text Content */}
          <div className="text-white max-w-[60%] z-10">
            <h3 className="font-semibold text-[16px] mb-1">Become a Host</h3>
            <p className="text-[12px] leading-snug">
              Ready to cash in on your space? <br />
              Verify your identity and list today.
            </p>
            <button className="mt-2 text-[10px]">Click here to begin</button>
          </div>

          {/* Right: Host Image + Star + Doodle */}
          <div className="absolute right-0 bottom-0 h-full flex items-end justify-end">
            {/* Host Image */}
            <img
              src="/images/background/become-host.png"
              alt="Become a Host"
              className="h-[102px] object-contain transform scale-x-[-1] relative z-10"
            />

            {/* Star (top) */}
            <img
              src="/icons/star.svg"
              alt="star"
              className="absolute top-[8px] right-[104.3px] w-[9px] h-[9px] z-20"
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

      <div className="px-[22px]">
        <div className="flex justify-between items-center">
          <h3 className="font-medium my-4 text-[14px]">
            Available in your Location 📍
          </h3>
          <button className="text-[12px] font-medium text-[#A20BA2]">
            See all
          </button>
        </div>
        <div className="space-y-1">
          {apartments.map((apt) => (
            <ApartmentCard key={apt.id} apt={apt} />
          ))}
        </div>
      </div>
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md z-50">
        <div className="flex justify-around items-center h-[60px]">
          {/* Home */}
          <button className="flex flex-col items-center text-[#A20BA2]">
            <img src="/icons/home.svg" alt="Home" className="w-5 h-5" />
            <span className="text-[12px] mt-1">Home</span>
          </button>

          {/* New Listing */}
          <button className="flex flex-col items-center text-gray-600">
            <img
              src="/icons/new-listing.svg"
              alt="New Listing"
              className="w-5 h-5"
            />
            <span className="text-[12px] mt-1">New Listing</span>
          </button>

          {/* Bookings */}
          <button className="flex flex-col items-center text-gray-600">
            <img src="/icons/book.svg" alt="Bookings" className="w-5 h-5" />
            <span className="text-[12px] mt-1">Bookings</span>
          </button>

          {/* Favorites */}
          <button className="flex flex-col items-center text-gray-600">
            <img src="/icons/heart.svg" alt="Favorites" className="w-5 h-5" />
            <span className="text-[12px] mt-1">Favorites</span>
          </button>

          {/* Profile */}
          <button className="flex flex-col items-center text-gray-600">
            <img src="/icons/profile.svg" alt="Profile" className="w-5 h-5" />
            <span className="text-[12px] mt-1">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
