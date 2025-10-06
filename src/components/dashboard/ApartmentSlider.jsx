import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";

export default function ApartmentSlider() {
  const lodge = {
    id: 1,
    title: "2-Bedroom Apartment",
    location: "Lekki, Lagos",
    rating: "4.0",
    price: "₦150,000",
    image: "/images/apartment-dashboard.png",
  };

  const slides = Array(6).fill(lodge);
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

  return (
    <div className="w-full">
      <Swiper
        slidesPerView={1.3}
        spaceBetween={8}
        loop={true}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        modules={[Autoplay]}
        breakpoints={{
          640: { slidesPerView: 2.2 },
          1024: { slidesPerView: 3.2 },
        }}
      >
        {slides.map((apartment, index) => (
          <SwiperSlide key={index}>
            <div
              onClick={() => navigate("/shortlet-overview")}
              className="relative rounded-[5px] overflow-hidden cursor-pointer group"
            >
              <img
                src={apartment.image}
                alt={apartment.title}
                className="w-full h-[229px] object-cover group-hover:scale-105 transition-transform duration-300"
              />

              <div className="absolute bottom-0 left-0 mx-1 mb-1 w-[calc(100%-.5rem)] p-3 text-white text-[14px] bg-black/60 rounded-[5px]">
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-1 text-[14px] font-medium">
                    <img
                      src="/icons/tick-white.svg"
                      alt="tick"
                      className="w-4 h-4"
                    />
                    {apartment.title}
                  </h3>
                  <span className="flex items-center gap-1">
                    <img
                      src="/icons/star-yellow.svg"
                      alt="star"
                      className="w-[12.19px] h-[12.19px]"
                    />
                    <span className="text-[12px] font-medium">
                      {apartment.rating}
                    </span>
                  </span>
                </div>

                <div className="flex items-center font-medium justify-between text-[10px] mt-1">
                  <p className="truncate">{apartment.location}</p>
                  <p className="text-[13px]">{apartment.price}</p>
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
