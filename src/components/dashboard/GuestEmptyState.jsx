import { useState } from "react";
import MyBooking from "../../components/dashboard/Bookings";
import Navigation from "../../components/dashboard/Navigation";

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState("ongoing");

  // Mock multiple bookings
  const bookings = [];

  const tabs = [
    { key: "ongoing", label: "Ongoing" },
    { key: "completed", label: "Completed" },
    { key: "cancelled", label: "Cancelled" },
  ];

  // Filter bookings based on active tab
  const filteredBookings = bookings.filter(
    (booking) => booking.status === activeTab
  );

  // Dynamic empty messages
  const emptyMessages = {
    ongoing: {
      title: "No Ongoing Bookings",
      subtitle:
        "Your next adventure is just around the corner. Start booking now",
    },
    completed: {
      title: "No Completed Bookings",
      subtitle:
        "Your next adventure is just around the corner. Start booking now",
    },
    cancelled: {
      title: "No Cancelled Bookings",
      subtitle:
        "Your next adventure is just around the corner. Start booking now",
    },
  };

  return (
    <div className="flex px-[2px] flex-col min-h-screen bg-[#F9F9F9">
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
          <div className="mt-[105px] flex flex-col items-center">
            {/* Image stack */}
            <div className="relative w-full h-[180px]">
              <img
                src="/icons/Rectangle1.svg"
                alt="Back"
                className="absolute top-0 left-[70px] w-[131.37px] h-[151.83px] z-30"
              />
              <img
                src="/icons/rectangle3.svg"
                alt="Back"
                className="absolute top-2 right-[82px] w-[111.37px] h-[141.83px] border-[2.5px] border-white z-20"
              />
              <img
                src="/icons/rectangle2.jpg"
                alt="Back"
                className="absolute top-7 right-[132px] w-[111.37px] h-[141.83px] rounded-[10px] border-[2.5px] border-white z-40"
              />
            </div>

            {/* Text below */}
            <h2 className="mt-3 text-center text-[14px] font-medium text-[#505050]">
              {emptyMessages[activeTab].title}
            </h2>
            <p className="text-[12px] text-[#807F7F] mx-auto text-center mt-2 w-[240px]">
              {emptyMessages[activeTab].subtitle}
            </p>
          </div>
        )}
      </main>

      <footer className="sticky bottom-0">
        <Navigation />
      </footer>
    </div>
  );
}
