import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ApartmentList() {
  const lodge = {
    id: 1,
    title: "2-Bedroom Apartment",
    location: "Lekki, Lagos",
    rating: "4.0",
    price: "N150,000",
    image: "/images/apartment-dashboard.png",
  };

  const apartments = Array(6).fill(lodge);
  const navigate = useNavigate();

  // State to track which apartments are favorited
  const [favorites, setFavorites] = useState({});

  const toggleFavorite = (index, e) => {
    e.stopPropagation(); // Prevent navigating when clicking the heart
    setFavorites((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="w-full space-y-[10px] px-[21px] pb-[100px]">
      {apartments.map((apartment, index) => (
        <div
          key={index}
          onClick={() => navigate("/shortlet-overview")}
          className="relative rounded-[5px] overflow-hidden cursor-pointer group"
        >
          <img
            src={apartment.image}
            alt={apartment.title}
            className="w-full h-[267.92px] object-cover group-hover:scale-105 transition-transform duration-300"
          />

          <div className="absolute bottom-0 left-0 mx-1 mb-1 w-[calc(100%-.5rem)] p-3 text-white text-xs bg-black/60 rounded-[5px]">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-1 text-[16px] font-medium">
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
                  className="w-[17.47px] h-[17.47px]"
                />
                <span className="text-[14.3px] font-medium">
                  {apartment.rating}
                </span>
              </span>
            </div>

            <div className="flex items-center font-medium text-[14px] mt-3 justify-between">
              <p className="truncate">{apartment.location}</p>
              <p className="text-[16px]">{apartment.price}</p>
            </div>
          </div>

          {/* Favorite (heart) button */}
          <button
            className="absolute top-3 right-3 w-[28.39px] h-[28.39px] bg-white rounded-full flex items-center justify-center"
            onClick={(e) => toggleFavorite(index, e)}
          >
            <img
              src={
                favorites[index]
                  ? "/icons/heart-purple.svg"
                  : "/icons/heart-gray.svg"
              }
              alt="heart"
              className="w-[18.77px] h-[16.15px]"
            />
          </button>
        </div>
      ))}
    </div>
  );
}
