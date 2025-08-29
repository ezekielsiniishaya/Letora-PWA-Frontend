import { useNavigate } from "react-router-dom";
import ApartmentCard from "../../components/dashboard/ApartmentCard";

const apartment = {
  id: 1,
  title: "2-Bedroom Apartment",
  location: "Ikoyi, Lagos",
  likes: 15,
  rating: "4.0",
  price: "N100k",
  image: "/images/apartment.png",
};

export default function HotApartmentsPage() {
  const apartments = Array.from({ length: 6 }, (_, i) => ({
    ...apartment,
    id: i + 1,
  }));
  const navigate = useNavigate();
  return (
    <div className="bg-[#F9F9F9] min-h-screen">
      {/* Top Nav */}
      <div className="flex items-center justify-between px-[21px] py-3">
        {/* Left section: arrow + text */}
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate(-1)}>
            <img src="/icons/arrow-left.svg" alt="Back" className="w-5 h-4" />
          </button>
          <h1 className="text-[14px] font-medium text-[#000000]">
            Currently Hot Apartments!!!
          </h1>
        </div>
      </div>

      {/* Apartments list */}
      <div className="px-4 py-3 space-y-[5px]">
        {apartments.map((apt) => (
          <ApartmentCard key={apt.id} apt={apt} />
        ))}
      </div>
    </div>
  );
}
