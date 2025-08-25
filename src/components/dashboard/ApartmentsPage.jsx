import React from "react";
import ApartmentCard from "./ApartmentCard";

const apartment = {
  id: 1,
  title: "2-Bedroom Apartment",
  location: "Ikoyi, Lagos",
  likes: 15,
  rating: "4.0",
  price: "N100k",
  image: "/images/apartment.png",
};

export default function ApartmentsPage() {
  const apartments = Array.from({ length: 6 }, (_, i) => ({
    ...apartment,
    id: i + 1,
  }));

  return (
    <div className="bg-[#F9F9F9] min-h-screen">
      {/* Top Nav */}
      <div className="flex items-center justify-between px-[21px] py-3">
        {/* Left section: arrow + text */}
        <div className="flex items-center space-x-3">
          <button>
            <img src="/icons/arrow-left.svg" alt="Back" className="w-5 h-4" />
          </button>
          <h1 className="text-[14px] font-medium text-[#000000]">
            24 apartments available in Lagos
          </h1>
        </div>

        {/* Right section: filter */}
        <button className="p-2">
          <img
            src="/icons/filter.svg"
            alt="Filter"
            className="w-[21px] h-[21px]"
          />
        </button>
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
