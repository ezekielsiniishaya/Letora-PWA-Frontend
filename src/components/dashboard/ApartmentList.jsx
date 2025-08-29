import React from "react";

export default function ApartmentList() {
  const lodge = {
    id: 1,
    title: "2-Bedroom Apartment",
    location: "Lekki, Lagos",
    rating: "4.0",
    price: "N150,000",
    image: "/images/apartment-dashboard.png",
  };

  // Repeat lodge info for multiple entries
  const apartments = Array(6).fill(lodge);

  return (
    <div className="w-full space-y-[10px] px-[21px] pb-[100px]">
      {apartments.map((apartment, index) => (
        <div
          key={index}
          onClick={() => alert(`Clicked apartment ${apartment.id}`)}
          className="relative rounded-[5px] overflow-hidden cursor-pointer group"
        >
          <img
            src={apartment.image}
            alt={apartment.title}
            className="w-full h-[267.92px]  object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Apartment info on image */}
          <div className="absolute bottom-0 left-0 mx-1 mb-1 w-[calc(100%-.5rem)] p-3 text-white text-xs bg-black/60 rounded-[5px]">
            {/* First row: title + rating */}
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
                  className="w-3 h-3"
                />
                <span className="text-[10px] font-medium">
                  {apartment.rating}
                </span>
              </span>
            </div>

            {/* Second row: location + price */}
            <div className="flex items-center font-medium justify-between mt-1">
              <p className="truncate">{apartment.location}</p>
              <p>{apartment.price}</p>
            </div>
          </div>

          {/* Favorite (heart) button */}
          <button className="absolute top-3 right-3 w-[20px] h-[20px] bg-white rounded-full flex items-center justify-center">
            <img
              src="/icons/heart-gray.svg"
              alt="heart"
              className="w-[13px] h-[11px]"
            />
          </button>
        </div>
      ))}
    </div>
  );
}
