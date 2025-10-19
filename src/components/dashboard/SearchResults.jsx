// pages/SearchResultsPage.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ApartmentCard from "../../components/dashboard/ApartmentCard";
import { searchApartmentsByQuery } from "../../services/apartmentApi";
import { useSearchHistory } from "../../hooks/useSearchHistory";

export default function SearchResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { addSearchResults } = useSearchHistory();
  const hasSearchedRef = useRef(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('q');
    
    if (searchQuery && !hasSearchedRef.current) {
      hasSearchedRef.current = true;
      
      const fetchSearchResults = async () => {
        try {
          setLoading(true);
          setError(null);
          
          const response = await searchApartmentsByQuery(searchQuery);
          
          if (response.success) {
            const apartments = response.data.apartments || [];
            setSearchResults(apartments);
            
            if (apartments.length > 0) {
              addSearchResults(searchQuery, apartments);
            }
          } else {
            setError(response.message || "No apartments found");
            setSearchResults([]);
          }
        } catch (error) {
          console.error("Error fetching search results:", error);
          setError("Failed to load search results");
          setSearchResults([]);
        } finally {
          setLoading(false);
        }
      };

      fetchSearchResults();
    }
  },);

  // Reset the ref when search query changes
  useEffect(() => {
    hasSearchedRef.current = false;
  }, [location.search]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#F9F9F9] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A20BA2]"></div>
      </div>
    );
  }

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
            {searchResults.length} Searched Results
          </span>
        </div>
      </div>

      {/* Search Results */}
      <div className="px-4 mt-[17px]">
        {error ? (
          <div className="flex flex-col items-center justify-center py-8">
            <img
              src="/icons/no-search-results.png"
              alt="No results"
              className="w-[42px] h-[42px] mb-2 grayscale opacity-50"
            />
            <p className="text-[#505050] text-[14px] font-medium text-center">
              {error}
            </p>
            <p className="text-[#807F7F] text-[12px] text-center mt-1">
              Try adjusting your search terms
            </p>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="space-y-[5px]">
            {searchResults.map((apt) => (
              <ApartmentCard key={apt.id} apt={apt} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 min-h-[80vh] w-full">
         <img
  src="/icons/no-search-result.png"
  alt="No search history"
  className="w-[42px] h-[42px] mb-2 grayscale opacity-50 transform scale-x-[-1]"
/>
            <p className="text-[#505050] text-[14px] font-medium text-center">
              No search results
            </p>
            <p className="text-[#807F7F] text-[12px] text-center w-[250px] mt-1">Try adjusting your filters or exploring nearby areas. New listings are added every day.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}