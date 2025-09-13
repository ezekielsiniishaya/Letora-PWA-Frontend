import { useNavigate, Link } from "react-router-dom";
import ApartmentCard from "../../components/dashboard/ApartmentCard";

export default function HostReviews() {
  const navigate = useNavigate();

  const apartment = {
    id: 1,
    title: "BQ/Annex",
    location: "Ojodu Berger, Lagos",
    image: "/images/apartment.png",
    price: "N100K",
    verified: true,
    rating: "4.0",
    likes: 15,
  };

  const apartments = Array.from({ length: 1 }, (_, i) => ({
    ...apartment,
    id: i + 1,
  }));

  return (
    <div className="flex flex-col min-h-screen bg-[#F9F9F9] px-[20px]">
      {/* Top bar */}
      <div className="flex justify-between items-center mt-5">
        <button onClick={() => navigate(-1)}>
          <img src="/icons/arrow-left.svg" alt="Back" className="w-5 h-4" />
        </button>
      </div>

      {/* Heading */}
      <header className="pt-4">
        <h1 className="text-[24px] font-medium text-[#0D1321]">Reviews</h1>
        <p className="text-[#666666] text-[14px]">
          Read what people are saying about you
        </p>
      </header>

      {/* Apartments list */}
      <Link to="/reviews">
        <div className="py-3 space-y-[5px]">
          {apartments.map((apt) => (
            <ApartmentCard key={apt.id} apt={apt} />
          ))}
        </div>
      </Link>
    </div>
  );
}
