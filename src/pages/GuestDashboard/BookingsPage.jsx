import Bookings from "../../components/dashboard/Bookings";
import Navigation from "../../components/dashboard/Navigation";

export default function BookingsPage() {
  const lodge = {
    id: 1,
    title: "2-Bedroom Apartment",
    location: "Lekki, Lagos",
    rating: "4.0",
    price: "₦150,000",
    image: "/images/apartment.png",
  };
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Heading */}
      <header className="px-4 pt-4 pb-[27px]">
        <h1 className="text-[24px] font-medium text-[#0D1321]">Bookings</h1>
        <p className="text-[#666666] text-[14px]">
          Manage your Bookings here as a Guest
        </p>
      </header>

      {/* Filter buttons */}
      <div className="flex justify-around px-4">
        <button className="px-4 rounded-[4px] h-[25px] w-[119px] bg-[#A20BA2] text-[12px] text-white font-medium">
          Ongoing
        </button>
        <button className="px-4 text-[12px] rounded-[4px] bg-[#E9E9E9] text-[#666666] h-[25px] w-[119px] font-medium">
          Completed
        </button>
        <button className="px-4 rounded-[4px] w-[119px] h-[25px] bg-[#E9E9E9] text-[#666666] text-[12px] font-medium">
          Cancelled
        </button>
      </div>

      {/* Bookings list */}
      <main className="flex-1 mt-[23px] p-4">
        <Bookings lodge={lodge} />
      </main>

      {/* Navigation */}
      <footer className="sticky bottom-0">
        <Navigation />
      </footer>
    </div>
  );
}
