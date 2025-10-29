import { useNavigate } from "react-router-dom";
import ApartmentCard from "./ApartmentCard";
import { Link } from "react-router-dom";
import { useApartmentListing } from "../../hooks/useApartmentListing";
import { useContext, useEffect } from "react";
import { UserContext } from "../../contexts/UserContext";
import { useUser } from "../../hooks/useUser";

export default function ApartmentsPage() {
  const navigate = useNavigate();
  const { refreshUser } = useContext(UserContext);
  const { getUserLocation } = useUser(); // ✅ Properly call the hook

  // Use the apartment listing context to get actual apartments
  const { nearbyApartments, nearbyApartmentsLoading, error } =
    useApartmentListing();

  // Refresh user data when component mounts
  useEffect(() => {
    const refreshUserData = async () => {
      try {
        await refreshUser?.();
      } catch (err) {
        console.error("Failed to refresh user data:", err);
        // Silently fail - don't show error to user for background refresh
      }
    };

    refreshUserData();
  }, [refreshUser]);

  // Get location for the header (use first apartment's location or default)
  const location = getUserLocation();

  // Extract state from location object
  const locationState = location?.state || "your area"; // ✅ Extract the state property

  if (nearbyApartmentsLoading) {
    return (
      <div className="bg-[#F9F9F9] min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A20BA2]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#F9F9F9] min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error loading apartments: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-[#F9F9F9] min-h-screen">
      {/* Top Nav */}
      <div className="flex items-center justify-between px-[21px] py-3">
        {/* Left section: arrow + text */}
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate("/guest-homepage")}>
            <img src="/icons/arrow-left.svg" alt="Back" className="w-5 h-4" />
          </button>
          <h1 className="text-[14px] font-medium text-[#000000]">
            {nearbyApartments.length} apartments available in {locationState}{" "}
            {/* ✅ Use locationState instead of location object */}
          </h1>
        </div>

        {/* Right section: filter */}
        <Link to="/filter">
          <button className="p-2">
            <img
              src="/icons/filter.svg"
              alt="Filter"
              className="w-[21px] h-[21px]"
            />
          </button>
        </Link>
      </div>

      {/* Apartments list */}
      <div className="px-4 py-3 space-y-[5px]">
        {nearbyApartments.length > 0 ? (
          nearbyApartments.map((apt) => (
            <ApartmentCard key={apt.id} apt={apt} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[80vh] py-8 rounded-lg">
            <img
              src="/icons/no-apartment-location.png"
              alt="No apartments"
              className="w-[44px] h-[44px] mb-2 grayscale"
            />
            <p className="text-[#505050] mt-2 text-[14px] font-medium w-[250px] text-center">
              No Available Apartments
            </p>
            <p className="text-[#807F7F] mt-2 text-[12px] w-[250px] text-center">
              Looks like no shortlets are available in this area yet. You can
              widen your search or come back later
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
