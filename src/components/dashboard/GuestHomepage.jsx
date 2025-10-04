import { useState } from "react";
import ApartmentSlider from "../../components/dashboard/ApartmentSlider";
import ApartmentCard from "../../components/dashboard/ApartmentCard";
import WithdrawPopup from "../../components/dashboard/WithdrawPopUp";
import ShowSuccess from "../../components/ShowSuccess";
import { Link } from "react-router-dom";
import Bookings from "../../components/dashboard/Bookings";
import Navigation from "../../components/dashboard/Navigation";

export default function Dashboard() {
  const [showSuccess, setShowSuccess] = useState(false);

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
    verified: i % 2 === 0,
    rating: i % 2 === 0 ? "4.0" : "0.0",
    title: i % 2 === 0 ? "2-Bedroom Apartment" : "Self-Con/Studio",
    location: i % 2 === 0 ? "Ikoyi, Lagos" : "Surulere, Lagos",
  }));

  return (
    <div className="w-full min-h-screen bg-[#F9F9F9] overflow-x-hidden pb-[80px]">
      {/* Header */}
      <div
        className="relative h-[270px] text-white px-[21.5px] pt-[60px] bg-cover bg-center"
        style={{
          backgroundImage: "url(/images/background/guest-bg-homepage.png)",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-65"></div>

        {/* Top row: Image + Notification */}
        <div className="relative flex flex-row justify-between items-center z-10">
          <img
            src="/images/guest-image.png"
            alt="Guest"
            className="w-[43.77px] h-[43.77px] rounded-full object-cover border-2 border-white"
          />

          <Link to="/guest-notifications">
            <div className="relative w-[30px] h-[30px] bg-[#1A1A1A] rounded-full flex items-center justify-center">
              <img
                src="/icons/notification.svg"
                alt="Notifications"
                className="w-[17px] h-[17px] cursor-pointer"
              />
              <span className="absolute -top-1 -right-2 bg-[#1A1A1A] text-white text-[9px] font-medium rounded-full w-[18px] h-[18px] flex items-center justify-center border">
                5
              </span>
            </div>
          </Link>
        </div>

        {/* Guest name + Discover text */}
        <div className="relative mt-[20px] z-10">
          <h2 className="text-[16px] font-semibold">Paul Ayodamola</h2>
          <p className="text-[12.02px]">Discover wonderful Apartments</p>
        </div>

        {/* Search Bar */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[32px] w-[90%] h-[42.91px] z-10">
          <div className="bg-white rounded-full flex items-center px-[17px] py-[13px] shadow">
            <img
              src="/icons/search.svg"
              alt="Search"
              className="w-[14px] h-[14px] mr-[14.3px]"
            />
            <input
              type="text"
              placeholder="Search Apartments, Apartment type, Location..."
              className="flex-1 text-[11px] text-[#666666] outline-none"
            />
          </div>
        </div>
      </div>

      {/* My Booking Section */}
      <div className="px-[21px] mt-[27px]">
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

      {/* Hot Apartments */}
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

      {/* Become a Host */}
      <Link to="/identity-id">
        <div className="px-[22px]">
          <div className="relative bg-gradient-to-r from-[#910A91] to-[#F711F7] rounded-[8px] px-[12px] flex items-center justify-between overflow-hidden h-[106.04px]">
            <div className="text-white max-w-[70%] z-10">
              <h3 className="font-semibold text-[16px] mb-1">Become a Host</h3>
              <p className="text-[12px] leading-snug">
                Ready to cash in on your space? <br />
                Verify your identity and list today.
              </p>
              <button className="mt-2 text-[10px]">Click here to begin</button>
            </div>
            <div className="absolute right-[-10px] bottom-0 h-full flex items-end justify-end">
              <img
                src="/images/background/become-host.png"
                alt="Become a Host"
                className="h-[117px] object-contain transform scale-x-[-1] relative z-10"
              />
              <img
                src="/icons/star.svg"
                alt="star"
                className="absolute top-[15px] right-[114.3px] w-[9px] h-[9px] z-20"
              />
              <img
                src="/icons/doodle.svg"
                alt="doodle"
                className="absolute bottom-[12.27px] right-[121.73px] w-[6.3px] h-[5.4px] z-20"
              />
            </div>
          </div>
        </div>
      </Link>

      {/* Available Apartments */}
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
  );
}
