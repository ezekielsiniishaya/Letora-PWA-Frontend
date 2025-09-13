import { useState } from "react";
import ApartmentCard from "../../components/dashboard/ApartmentCard";
import MyBooking from "../../components/dashboard/Bookings";
import Navigation from "../../components/dashboard/Navigation";
import { useNavigate } from "react-router-dom";

export default function HostDashboardPage() {
  const [activeTab, setActiveTab] = useState("myListings");
  const navigate = useNavigate();

  // Mock data for listings
  // Mock data for bookings
  const bookings = [];

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

  // Dynamic empty messages
  const emptyMessages = {
    ongoing: {
      title: "No Ongoing Bookings",
      subtitle: "There are no ongoing booking on your apartments yet",
    },
    completed: {
      title: "No Completed Bookings",
      subtitle: "There  are no completed booking on your apartment yet.",
    },
    cancelled: {
      title: "No Cancelled Bookings",
      subtitle: "Cancelled bookings will show up here for your reference.",
    },
    myListings: {
      title: "No Current Listings",
      subtitle:
        "You have no current listing. List your apartment now and start earning",
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F9F9F9]">
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
          <div className="mt-[80px] flex flex-col items-center">
            {/* Image stack */}
            <div className="relative w-full h-[180px] flex justify-center">
              <img
                src="/icons/Rectangle1.svg"
                alt="Back"
                className="absolute top-0 left-[70px] w-[131px] h-[151px] z-30"
              />
              <img
                src="/icons/rectangle3.svg"
                alt="Back"
                className="absolute top-2 right-[82px] w-[111px] h-[141px] border-[2.5px] border-white z-20"
              />
              <img
                src="/icons/rectangle2.jpg"
                alt="Back"
                className="absolute top-7 right-[132px] w-[111px] h-[141px] rounded-[10px] border-[2.5px] border-white z-40"
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
