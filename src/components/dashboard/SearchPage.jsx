// pages/SearchPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSearchHistory } from "../../hooks/useSearchHistory";
import ApartmentCard from "../../components/dashboard/ApartmentCard";

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { 
    searchHistory, 
  
    clearSearchHistory, 
  
  } = useSearchHistory();

  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      if (searchTerm.trim()) {
        // Navigate to search results page - results will be saved there
        navigate(`/search-results?q=${encodeURIComponent(searchTerm.trim())}`);
      }
    }
  };


  const handleClearHistory = () => {
    if (window.confirm("Clear all search history?")) {
      clearSearchHistory();
    }
  };

  // Flatten all apartments from search history for display
  const allRecentApartments = searchHistory.flatMap(search => 
    search.apartments?.map(apartment => ({
      ...apartment,
      searchId: search.id, // Keep reference to which search it came from
      searchTerm: search.searchTerm
    })) || []
  );

  // Remove duplicates (same apartment ID)
  const uniqueRecentApartments = allRecentApartments.filter((apartment, index, array) => 
    array.findIndex(a => a.id === apartment.id) === index
  );

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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleSearch}
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

      {/* Recent Searches - Show actual apartment results from previous searches */}
      <div className="px-4 mt-[17px]">
        <div className="flex justify-between items-center mb-[14px]">
          <h2 className="text-[14px] font-medium text-black">
            Recent Searches
          </h2>
          {searchHistory.length > 0 && (
            <button 
              onClick={handleClearHistory}
              className="text-[12px]"
            >
              Clear all
            </button>
          )}
        </div>
        
        {uniqueRecentApartments.length > 0 ? (
          <div>
            {/* Show search terms as sections */}
            {searchHistory.map((search) => (
              search.apartments && search.apartments.length > 0 && (
                <div key={search.id} className="mb-6">
                
                  
                  {/* Show apartments from this search */}
                  <div className="space-y-[5px]">
                    {search.apartments.slice(0, 3).map((apartment) => (
                      <ApartmentCard key={apartment.id} apt={apartment} />
                    ))}
                  </div>
               
                </div>
              )
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 min-h-[80vh] w-full">
            <img
              src="/icons/no-recent-search.png"
              alt="No search history"
              className="w-[42px] h-[42px] mb-2 grayscale opacity-50"
            />
            <p className="text-[#505050] text-[14px] font-medium text-center">
              No recent searches
            </p>
            <p className="text-[#807F7F] text-[12px] text-center w-[180px] mt-1">
              Start exploring to find shortlets that suit you.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}