import React from "react";
import { useNavigate } from "react-router-dom";
import ApartmentCard from "./ApartmentCard";
import { Link } from "react-router-dom";
const apartment = {
  id: 1,
  title: "2-Bedroom Apartment",
  location: "Ikoyi, Lagos",
  likes: 15,
  rating: "4.0",
  price: "N100k",
  image: "/images/apartment.png",
};

export default function SearchPage() {
  const navigate = useNavigate();
  // Example: generating fake results (replace with real search results later)
  const searchResults = Array.from({ length: 6 }, (_, i) => ({
    ...apartment,
    id: i + 1,
  }));

  return (
    <div className="w-full min-h-screen bg-[#F9F9F9]">
      {/* Header */}
      <div className="w-full px-[20px] py-[11px]">
        <div className="flex items-center space-x-[15px]">
          <img
            src="/icons/arrow-left.svg"
            alt="Back"
            className="w-[16.67px] h-[8.33px] cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <span className="text-[#333333] font-medium text-[13.2px]">
            580 Searched Results
          </span>
        </div>
      </div>
      {/* Recent Searches */}
      <div className="px-4 mt-[17px]">
        {/* Apartments list */}
        <div className="space-y-[5px]">
          {searchResults.map((apt) => (
            <ApartmentCard key={apt.id} apt={apt} />
          ))}
        </div>
      </div>{" "}
    </div>
  );
}
