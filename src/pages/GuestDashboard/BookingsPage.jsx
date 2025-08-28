import { useState } from "react";
import Bookings from "../../components/dashboard/Bookings";
import Navigation from "../../components/dashboard/Navigation";

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState("ongoing");

  const lodge = {
    id: 1,
    title: "2-Bedroom Apartment",
    location: "Lekki, Lagos",
    rating: "4.0",
    price: "₦150,000",
    image: "/images/apartment.png",
  };

  const tabs = [
    { key: "ongoing", label: "Ongoing" },
    { key: "completed", label: "Completed" },
    { key: "cancelled", label: "Cancelled" },
  ];

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
            className={`px-4 rounded-[4px] h-[25px] w-[121px] text-[12px] font-medium ${
              activeTab === tab.key
                ? "bg-[#A20BA2] text-white"
                : "bg-[#E9E9E9] text-[#666666]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings list */}
      <main className="flex-1 mt-[15px] p-4">
        <Bookings lodge={lodge} status={activeTab} />
      </main>

      {/* Navigation */}
      <footer className="sticky bottom-0">
        <Navigation />
      </footer>
    </div>
  );
}
