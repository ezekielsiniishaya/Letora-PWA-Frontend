import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { useApartmentListing } from "../../hooks/useApartmentListing";

export default function ApartmentSlider() {
  const { hotApartments, hotApartmentsLoading } = useApartmentListing();
  const navigate = useNavigate();

  // State to track which slides are favorited
  const [favorites, setFavorites] = useState({});

  const toggleFavorite = (index, e) => {
    e.stopPropagation(); // Prevent navigating when clicking heart
    setFavorites((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
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

  // In the JSX, replace apartment.isVerified with isApartmentVerified(apartment)
  // Use real data if available, otherwise use empty array
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
        {slides.map((apartment, index) => (
          <SwiperSlide key={apartment.id || index}>
            <div
              onClick={() => navigate("/shortlet-overview")}
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
                className="absolute top-3 right-3 w-[19.82px] h-[19.82px] bg-white rounded-full px-1 flex items-center justify-center"
                onClick={(e) => toggleFavorite(index, e)}
              >
                <img
                  src={
                    favorites[index]
                      ? "/icons/heart-purple.svg"
                      : "/icons/heart-gray.svg"
                  }
                  alt="heart"
                  className="w-[13.1px] h-[11.27px]"
                />
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
