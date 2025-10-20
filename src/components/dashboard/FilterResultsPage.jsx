// pages/FilteredResultsPage.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ApartmentCard from "../../components/dashboard/ApartmentCard";

export default function FilteredResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { apartments = [], totalCount = 0 } = location.state || {};

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
            {totalCount} Filtered Results
          </span>
        </div>
      </div>

      {/* Filtered Results */}
      <div className="px-4 mt-[17px]">
        {apartments.length > 0 ? (
          <div className="space-y-[5px]">
            {apartments.map((apt) => (
              <ApartmentCard key={apt.id} apt={apt} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 min-h-[80vh] w-full">
            <img
              src="/icons/no-search-result.png"
              alt="No results"
              className="w-[42px] h-[42px] mb-2 grayscale opacity-50 transform scale-x-[-1]"
            />
            <p className="text-[#505050] text-[14px] font-medium text-center">
              No apartments found
            </p>
            <p className="text-[#807F7F] text-[12px] text-center w-[250px] mt-1">
              Try adjusting your filters or exploring nearby areas. New listings
              are added every day.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
