import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import ApartmentCard from "../../components/dashboard/ApartmentCard";
import { apiRequest } from "../../services/apiRequest"; // used for fetching host apartments

export default function HostReviews() {
  const navigate = useNavigate();
  const { user } = useUser();

  const [apartments, setApartments] = useState([]);
  const hostId = user?.id;

  useEffect(() => {
    if (!hostId) return;

    const fetchHostApartments = async () => {
      try {
        const response = await apiRequest(`/api/apartments/host/${hostId}`, {
          method: "GET",
        });

        if (response?.success) {
          setApartments(response.data);
        }
      } catch (error) {
        console.error("Failed to load host apartments:", error);
      }
    };

    fetchHostApartments();
  }, [hostId]);

  // Filter apartments that have reviews - same logic as HotApartmentsPage
  const apartmentsWithReviews = apartments.filter(
    (apt) => apt.totalReviews > 0 || parseFloat(apt.averageRating || 0) > 0
  );

  const handleApartmentClick = (apt) => {
    navigate(`/reviews`, {
      state: {
        reviews: apt.reviews || [],
      },
    });
  };

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
      <div className="py-3 space-y-[5px]">
        {apartmentsWithReviews.length > 0 ? (
          apartmentsWithReviews.map((apt) => (
            <div
              key={apt.id}
              onClick={() => handleApartmentClick(apt)}
              className="cursor-pointer"
            >
              <ApartmentCard apt={apt} role="host" />
            </div>
          ))
        ) : (
          <div className="flex flex-col mt-[280px] items-center justify-center py-12 text-center">
                       <p className="text-[#666666] text-[14px]">
              No reviews yet for your apartments
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
