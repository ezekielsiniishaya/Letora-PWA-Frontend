import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { useApartmentListing } from "../../hooks/useApartmentListing";
import { toggleFavoriteAPI } from "../../services/apartmentApi";
import { useUser } from "../../hooks/useUser"; // Import user hook to check favorites

export default function ApartmentSlider() {
  const { hotApartments, hotApartmentsLoading } = useApartmentListing();
  const { user, refreshUser } = useUser(); // Get user to check their favorites
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState({});
  const [loadingStates, setLoadingStates] = useState({});

  // Initialize favorites from user's favorite apartments
  useEffect(() => {
    if (hotApartments && user) {
      const initialFavorites = {};
      hotApartments.forEach((apartment) => {
        // Check if this apartment is in user's favorites
        const isFavorited = user.favorites?.some(
          (fav) => fav.apartmentId === apartment.id
        );
        initialFavorites[apartment.id] = isFavorited || false;
      });
      setFavorites(initialFavorites);
    }
  }, [hotApartments, user]);

  const toggleFavorite = async (apartmentId, e) => {
    e.stopPropagation();

    setLoadingStates((prev) => ({ ...prev, [apartmentId]: true }));

    try {
      const response = await toggleFavoriteAPI(apartmentId);

      if (response.success) {
        // Update local state with the actual API response
        setFavorites((prev) => ({
          ...prev,
          [apartmentId]: response.isFavorited,
        }));
      }
      // Refresh favorites data
      await refreshUser();
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [apartmentId]: false }));
    }
  };

  // Get primary image for apartment
  const getPrimaryImage = (apartment) => {
    const primaryImage = apartment.images?.find((img) => img.isPrimary);
    return (
      primaryImage?.url ||
      apartment.images?.[0]?.url ||
      "/images/apartment-dashboard.png"
    );
  };

  // Format price
  const formatPrice = (price) => {
    return `₦${price?.toLocaleString() || "0"}`;
  };

  // Truncate long apartment titles
  const truncateTitle = (title, maxLength = 70) => {
    if (!title) return "";
    return title.length > maxLength
      ? `${title.substring(0, maxLength)}...`
      : title;
  };

  // Navigate to apartment details
  const handleApartmentClick = (apartmentId) => {
    navigate(`/shortlet-overview/${apartmentId}`);
  };

  if (hotApartmentsLoading) {
    return (
      <div className="w-full flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A20BA2]"></div>
      </div>
    );
  }

  // Check if apartment is verified based on status
  const isApartmentVerified = (apartment) => {
    return apartment.status === "VERIFIED";
  };

  const slides = hotApartments && hotApartments.length > 0 ? hotApartments : [];

  return (
    <div className="w-full">
      <Swiper
        slidesPerView={1.3}
        spaceBetween={8}
        loop={slides.length > 1}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        modules={[Autoplay]}
        breakpoints={{
          640: { slidesPerView: 2.2 },
          1024: { slidesPerView: 3.2 },
        }}
      >
        {slides.map((apartment) => (
          <SwiperSlide key={apartment.id}>
            <div
              onClick={() => handleApartmentClick(apartment.id)}
              className="relative rounded-[5px] overflow-hidden cursor-pointer group"
            >
              <img
                src={getPrimaryImage(apartment)}
                alt={apartment.title}
                className="w-full h-[187px] object-cover group-hover:scale-105 transition-transform duration-300"
              />

              <div className="absolute bottom-0 left-0 mx-1 mb-1 w-[calc(100%-.5rem)] p-3 text-white text-[14px] bg-black/60 rounded-[5px]">
                <div className="flex items-center justify-between">
                  <h3 className="text-[14px] font-medium truncate max-w-[70%]">
                    {isApartmentVerified(apartment) && (
                      <img
                        src="/icons/tick-white.svg"
                        alt="verified"
                        className="w-4 h-4 inline mr-1"
                      />
                    )}
                    {truncateTitle(apartment.title)}
                  </h3>
                  <span className="flex items-center gap-1 flex-shrink-0">
                    <img
                      src="/icons/star-yellow.svg"
                      alt="star"
                      className="w-[12.19px] h-[12.19px]"
                    />
                    <span className="text-[12px] font-medium">
                      {apartment.averageRating?.toFixed(1) || "0.0"}
                    </span>
                  </span>
                </div>

                <div className="flex items-center font-medium justify-between text-[10px] mt-1">
                  <p className="truncate max-w-[60%]">
                    {apartment.town}, {apartment.state}
                  </p>
                  <p className="text-[13px] flex-shrink-0">
                    {formatPrice(apartment.price)}
                  </p>
                </div>
              </div>

              {/* Favorite (heart) button */}
              <button
                className="absolute top-3 right-3 w-[19.82px] h-[19.82px] bg-white rounded-full px-1 flex items-center justify-center disabled:opacity-50"
                onClick={(e) => toggleFavorite(apartment.id, e)}
                disabled={loadingStates[apartment.id]}
              >
                {loadingStates[apartment.id] ? (
                  <div className="w-3 h-3 border-2 border-[#A20BA2] border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <img
                    src={
                      favorites[apartment.id]
                        ? "/icons/heart-purple.svg"
                        : "/icons/heart-gray.svg"
                    }
                    alt="heart"
                    className="w-[13.1px] h-[11.27px]"
                  />
                )}
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
