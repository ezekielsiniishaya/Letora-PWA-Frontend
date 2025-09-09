import { useState } from "react";
import ApartmentCard from "../../components/dashboard/ApartmentCard";
import MyBooking from "../../components/dashboard/Bookings";
import { useNavigate } from "react-router-dom";

export default function HostDashboardPage() {
  const [activeTab, setActiveTab] = useState("myListings");
  const navigate = useNavigate();

  // Mock data for listings
  const listings = [
    {
      id: 1,
      title: "3-Bedroom Apartment",
      location: "Ikoyi, Lagos",
      image: "/images/apartment.png",
      price: "N100K",
      verified: true,
      rating: "4.0",
      likes: 15,
    },
    {
      id: 2,
      title: "Self-Con/ Studio",
      location: "Surulere, Lagos",
      image: "/images/apartment.png",
      price: "N100K",
      verified: false,
      rating: 0,
      likes: 15,
    },
    {
      id: 3,
      title: "BQ/Annex",
      location: "Ojodu Berger, Lagos",
      image: "/images/apartment.png",
      price: "N100K",
      verified: true,
      rating: "4.0",
      likes: 15,
    },
  ];

  // Mock data for bookings
  const bookings = [
    {
      id: 101,
      title: "2-Bedroom Shortlet",
      location: "Lekki, Lagos",
      image: "/images/apartment.png",
      price: "₦120,000",
      status: "ongoing",
      bookingDate: "30-Dec-2025 | 10:00 AM",
      checkIn: "30-Dec-2025",
      checkOut: "30-Dec-2025",
      duration: "30 Days",
      feePaid: "₦1,500,000",
      deposit: "₦100,000",
      total: "₦1,602,500",
    },
    {
      id: 102,
      title: "2-Bedroom Apartment",
      location: "Lekki, Lagos",
      image: "/images/apartment.png",
      price: "₦90,000",
      status: "completed",
      bookingDate: "15-Sep-2025 | 3:00 PM",
      checkIn: "15-Sep-2025",
      checkOut: "20-Sep-2025",
      duration: "5 Days",
      feePaid: "₦450,000",
      deposit: "₦50,000",
      total: "₦501,500",
    },
    {
      id: 103,
      title: "2-Bedroom Apartment",
      location: "Lekki, Lagos",
      image: "/images/apartment.png",
      price: "₦90,000",
      status: "cancelled",
      bookingDate: "15-Sep-2025 | 3:00 PM",
      checkIn: "15-Sep-2025",
      checkOut: "20-Sep-2025",
      duration: "5 Days",
      feePaid: "₦450,000",
      deposit: "₦50,000",
      total: "₦501,500",
    },
    {
      id: 104,
      title: "2-Bedroom Apartment",
      location: "Lekki, Lagos",
      image: "/images/apartment.png",
      price: "₦90,000",
      status: "cancelled",
      bookingDate: "15-Sep-2025 | 3:00 PM",
      checkIn: "15-Sep-2025",
      checkOut: "20-Sep-2025",
      duration: "5 Days",
      feePaid: "₦450,000",
      deposit: "₦50,000",
      total: "₦501,500",
    },
  ];

  const tabs = [
    { key: "myListings", label: "My Listings" },
    { key: "ongoing", label: "Ongoing" },
    { key: "completed", label: "Completed" },
    { key: "cancelled", label: "Cancelled" },
  ];

  // Filter bookings based on active tab
  const filteredBookings = bookings.filter(
    (booking) => booking.status === activeTab
  );

  return (
    <div className="flex px-[2px] flex-col min-h-screen bg-gray-50">
      {/* Heading */}
      <div className="w-full px-[20px] py-[25px]">
        <div className="flex items-center space-x-5">
          <img
            src="/icons/arrow-left.svg"
            alt="Back"
            className="w-[16.33px] cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <span className="font-medium text-[13.2px] text-[#333333]">
            My Dashboard
          </span>
        </div>
      </div>
      {/* Filter buttons */}
      <div className="flex bg-white justify-around rounded-[5px] mx-4 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-[4px] h-[25px] w-[85px] text-[12px] text-center font-medium whitespace-nowrap ${
              activeTab === tab.key
                ? "bg-[#A20BA2] text-white"
                : "bg-[#E9E9E9] text-[#666666]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main content */}
      <main className="flex-1 mt-[15px] p-4 space-y-1">
        {activeTab === "myListings" ? (
          listings.length > 0 ? (
            listings.map((apt) => <ApartmentCard key={apt.id} apt={apt} />)
          ) : (
            <p className="text-center text-gray-500">No listings found</p>
          )
        ) : filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <MyBooking
              key={booking.id}
              lodge={booking}
              status={booking.status}
              completedButtonText={
                booking.status === "completed"
                  ? "Hold Security Deposit"
                  : undefined
              }
            />
          ))
        ) : (
          <p className="text-center text-gray-500">No bookings found</p>
        )}
      </main>
    </div>
  );
}
