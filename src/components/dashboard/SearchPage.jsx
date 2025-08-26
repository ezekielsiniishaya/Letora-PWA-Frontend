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
            Search
          </span>
        </div>
      </div>
      {/* Search Bar */}
      <div className="px-4 mt-[20px]">
        <div className="flex items-center space-x-3">
          <div className="flex items-center rounded-[5px] h-[44px] flex-1 bg-white border border-[#E6E6E6] px-3 py-2">
            <img
              src="/icons/search-gray.svg"
              alt="Search"
              className="w-[12.5px] h-[12.5px]"
            />
            <input
              type="text"
              placeholder="Type your search here"
              className="flex-1 outline-none px-2 text-[12px] text-[#505050]"
            />
          </div>
          <Link to="/filter">
            <img
              src="/icons/filter.svg"
              alt="Filter"
              className="w-[18.5px] h-[17.58px] cursor-pointer"
            />
          </Link>
        </div>
      </div>
      {/* Recent Searches */}
      <div className="px-4 mt-[17px]">
        <h2 className="text-[14px] font-medium text-black mb-[14px]">
          Recent Searches
        </h2>
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
