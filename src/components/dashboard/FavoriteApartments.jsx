import { useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import { useEffect, useState } from "react";

export default function ApartmentList() {
  const navigate = useNavigate();
  const { loading: userLoading, error } = useUser();
  const [loadingStates, setLoadingStates] = useState({});

  const apartmentsLoading = userLoading;
  const { getUserFavorites, addToFavorites, removeFromFavorites, refreshUser } =
    useUser();
  const userFavorites = getUserFavorites();
  const favoriteApartments = userFavorites.map((fav) => fav.apartment);

  // Refresh favorites when component mounts - only once
  useEffect(() => {
    refreshUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleFavorite = async (apartmentId, e) => {
    e.stopPropagation();

    // Set loading state for this specific apartment
    setLoadingStates((prev) => ({ ...prev, [apartmentId]: true }));

    try {
      if (isFavorited(apartmentId)) {
        // Call API to remove from favorites
        await removeFromFavorites(apartmentId);
      } else {
        // Call API to add to favorites
        await addToFavorites(apartmentId);
      }

      // Refresh favorites data
      await refreshUser();
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      // Clear loading state for this apartment
      setLoadingStates((prev) => ({ ...prev, [apartmentId]: false }));
    }
  };

  const isFavorited = (apartmentId) => {
    return userFavorites.some((fav) => fav.apartmentId === apartmentId);
  };

  // Helper function to get primary image
  const getPrimaryImage = (apartment) => {
    if (!apartment?.images) return "/images/apartment-dashboard.png";
    const primaryImage = apartment.images.find((img) => img.isPrimary);
    return (
      primaryImage?.url ||
      apartment.images[0]?.url ||
      "/images/apartment-dashboard.png"
    );
  };

  // Helper function to format location
  const getLocation = (apartment) => {
    if (apartment.town && apartment.state) {
      return `${apartment.town}, ${apartment.state}`;
    }
    return apartment.state || "Location not specified";
  };

  // Helper function to format price
  const formatPrice = (price) => {
    if (!price) return "N/A";
    return `₦${price.toLocaleString()}`;
  };

  // Helper function to format rating safely
  const formatRating = (rating) => {
    if (typeof rating === "number") {
      return rating.toFixed(1);
    }
    // Try to convert string to number if needed
    const numericRating = parseFloat(rating);
    if (!isNaN(numericRating)) {
      return numericRating.toFixed(1);
    }
    return "0.0";
  };

  if (apartmentsLoading) {
    return (
      <div className="w-full min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A20BA2]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <p className="text-red-500">Error loading apartments: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-[#F9F9F9] min-h-screen">
      {/* Apartments list */}
      <div className="w-full space-y-[10px] px-[21px] pb-[100px]">
        {favoriteApartments.length < 0 ? (
          favoriteApartments.map((apartment) => (
            <div
              key={apartment.id}
              onClick={() => navigate(`/shortlet-overview/${apartment.id}`)}
              className="relative rounded-[5px] overflow-hidden cursor-pointer group"
            >
              <img
                src={getPrimaryImage(apartment)}
                alt={apartment.title}
                className="w-full h-[267.92px] object-cover group-hover:scale-105 transition-transform duration-300"
              />

              <div className="absolute bottom-0 left-0 mx-1 mb-1 w-[calc(100%-.5rem)] p-3 text-white text-xs bg-black/60 rounded-[5px]">
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-1 text-[16px] font-medium">
                    {apartment.status === "VERIFIED" && (
                      <img
                        src="/icons/tick-white.svg"
                        alt="Verified"
                        className="w-4 h-4"
                      />
                    )}
                    {apartment.title}
                  </h3>
                  <span className="flex items-center gap-1">
                    <img
                      src="/icons/star-yellow.svg"
                      alt="star"
                      className="w-[17.47px] h-[17.47px]"
                    />
                    <span className="text-[14.3px] font-medium">
                      {formatRating(apartment.averageRating)}
                    </span>
                  </span>
                </div>

                <div className="flex items-center font-medium text-[14px] mt-3 justify-between">
                  <p className="truncate">{getLocation(apartment)}</p>
                  <p className="text-[16px]">{formatPrice(apartment.price)}</p>
                </div>
              </div>

              {/* Favorite (heart) button with loading indicator */}
              <button
                className="absolute top-3 right-3 w-[28.39px] h-[28.39px] bg-white rounded-full flex items-center justify-center disabled:opacity-50"
                onClick={(e) => toggleFavorite(apartment.id, e)}
                disabled={loadingStates[apartment.id]}
              >
                {loadingStates[apartment.id] ? (
                  <div className="w-4 h-4 border-2 border-[#A20BA2] border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <img
                    src={
                      isFavorited(apartment.id)
                        ? "/icons/heart-purple.svg"
                        : "/icons/heart-gray.svg"
                    }
                    alt="heart"
                    className="w-[18.77px] h-[16.15px]"
                  />
                )}
              </button>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[80vh] py-8 rounded-lg">
            <img
              src="/icons/no-favorite.png"
              alt="No apartments"
              className="w-[44px] h-[44px] grayscale mb-2"
            />
            <p className="text-[#505050] mt-2 text-[14px] font-medium w-[250px] text-center">
              No Favorites Yet.{" "}
            </p>
            <p className="text-[#807F7F] mt-2 text-[12px] w-[250px] text-center">
              Your saved apartments will appear here once you start adding them.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
