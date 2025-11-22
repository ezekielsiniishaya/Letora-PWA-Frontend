import { useNavigate } from "react-router-dom";
import ApartmentCard from "../../components/dashboard/ApartmentCard";
import { useApartmentListing } from "../../hooks/useApartmentListing";

export default function HotApartmentsPage() {
  const navigate = useNavigate();

  // Use the apartment listing context to get actual hot apartments
  const { hotApartments, hotApartmentsLoading, error } = useApartmentListing();

  return (
    <div className="bg-[#F9F9F9] min-h-screen">
      {/* Top Nav */}
      <div className="flex items-center justify-between px-[21px] py-3">
        {/* Left section: arrow + text */}
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate(-1)}>
            <img src="/icons/arrow-left.svg" alt="Back" className="w-5 h-4" />
          </button>
          <h1 className="text-[14px] font-medium text-[#000000]">
            Currently Hot Apartments!!!
          </h1>
        </div>
      </div>

      {/* Apartments list */}
      <div className="px-4 py-3 space-y-[5px]">
        {hotApartmentsLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A20BA2]"></div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-8">
            <p className="text-red-500">Error loading apartments: {error}</p>
          </div>
        ) : hotApartments.length > 0 ? (
          hotApartments.map((apt) => <ApartmentCard key={apt.id} apt={apt} />)
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[80vh] py-8 rounded-lg">
            <img
              src="/icons/no-hot-apartment.png"
              alt="No bookingsa"
              className="w-[44px] h-[44px] mb-2 grayscale"
            />
            <p className="text-[#505050] mt-2 text-[14px] font-medium w-[250px] text-center">
              No Hot Apartments at the moment
            </p>
            <p className="text-[#807F7F] mt-2 text-[12px] w-[250px] text-center">
              Check back soon. Top-rated stays and trending listings update
              regularly!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
