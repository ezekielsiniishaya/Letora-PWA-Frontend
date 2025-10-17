import { useState } from "react";
import ApartmentCard from "../../components/dashboard/ApartmentCard";
import MyBooking from "../../components/dashboard/Bookings";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/useUser"; // Import your user hook

export default function HostDashboardPage() {
  const [activeTab, setActiveTab] = useState("myListings");
  const navigate = useNavigate();
  const { user } = useUser(); // Get user data from context

  // Use actual listings from user context
  const listings = user?.apartments || [];

  // Use actual bookings from user context and filter by host role
  const allBookings = user?.bookings || [];

  // Filter bookings where the user is the host (you might need to adjust this logic based on your data structure)
  const hostBookings = allBookings.filter(
    (booking) =>
      booking.apartment?.host?.id === user?.id || booking.hostId === user?.id
  );

  const tabs = [
    { key: "myListings", label: "My Listings" },
    { key: "ongoing", label: "Ongoing" },
    { key: "completed", label: "Completed" },
    { key: "cancelled", label: "Cancelled" },
  ];

  // Filter bookings based on active tab
  const filteredBookings = hostBookings.filter(
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
            onClick={() => navigate("/host-homepage")}
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
            listings.map((apt) => (
              <ApartmentCard role="host" key={apt.id} apt={apt} />
            ))
          ) : (
            <p className="text-center text-gray-500">No listings found</p>
          )
        ) : filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <MyBooking
              key={booking.id}
              lodge={booking}
              status={booking.status}
              onClick={() =>
                navigate(`/host-booking/${booking.id}`, {
                  state: {
                    lodge: booking,
                    status: booking.status,
                    role: "host",
                  },
                })
              }
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
