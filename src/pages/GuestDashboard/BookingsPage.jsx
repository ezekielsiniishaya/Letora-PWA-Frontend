import { useState } from "react";
import MyBooking from "../../components/dashboard/Bookings";
import Navigation from "../../components/dashboard/Navigation";

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState("ongoing");

  // Mock multiple bookings
  const bookings = [
    {
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
    },
    {
      id: 2,
      title: "Luxury Studio Apartment",
      location: "Lekki, Lagos",
      image: "/images/apartment.png",
      price: "₦90,000/Night",
      status: "completed",
      bookingDate: "15-Sep-2025 | 3:00 PM",
      checkIn: "15-Sep-2025",
      checkOut: "20-Sep-2025",
      duration: "5 Days",
      feePaid: "₦450,000",
      deposit: "₦50,000",
      convenience: "₦1,500",
      total: "₦501,500",
      hostPhone: "08123456789",
      hostEmail: "studiohost@mail.com",
    },
    {
      id: 3,
      title: "2-Bedroom Shortlet",
      location: "Ikeja, Lagos",
      image: "/images/apartment.png",
      price: "₦120,000/Night",
      status: "cancelled",
      bookingDate: "01-Aug-2025 | 1:00 PM",
      checkIn: "01-Aug-2025",
      checkOut: "05-Aug-2025",
      duration: "4 Days",
      feePaid: "₦480,000",
      deposit: "₦80,000",
      convenience: "₦1,200",
      total: "₦561,200",
      hostPhone: "08099887766",
      hostEmail: "ikejahost@mail.com",
      cancellationDate: "03-Aug-2025",
      cancellationReason:
        "HedamagedksckhkhcajadsakjhdbsjbkabkSKkjbxcjsakssdkhkdhkdfewdhwekdkdddkjhkjdhjashhadagasgdbcsdadghgdhaghagdh",
    },
  ];

  const tabs = [
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
      <header className="px-[21px] pt-4 pb-[20px]">
        <h1 className="text-[24px] font-medium text-[#0D1321]">Bookings</h1>
        <p className="text-[#666666] text-[14px]">
          Manage your Bookings here as a Guest
        </p>
      </header>

      {/* Filter buttons */}
      <div className="flex bg-white justify-around rounded-[5px] mx-4 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 rounded-[4px] h-[25px] w-[115px] text-[12px] font-medium ${
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
      <main className="flex-1 mt-[15px] p-4 space-y-4">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <MyBooking
              key={booking.id}
              lodge={booking}
              status={booking.status}
            />
          ))
        ) : (
          <p className="text-center text-gray-500">No bookings found</p>
        )}
      </main>

      <footer className="sticky bottom-0">
        <Navigation />
      </footer>
    </div>
  );
}
