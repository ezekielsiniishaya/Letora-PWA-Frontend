// pages/ListingOverviewPage.jsx - FIXED VERSION
import { useState, useEffect } from "react";
import ShowSuccess from "../../components/ShowSuccess";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import ApartmentDisplay from "../../components/apartment/ApartmentDisplay";
import { useUser } from "../../hooks/useUser";
import { getApartmentById } from "../../services/apartmentApi";

// Helper function to transform API data to match ApartmentDisplay expectations
const transformApartmentData = (apiData) => {
  if (!apiData) return null;

  return {
    // Basic info
    basicInfo: {
      title: apiData.title,
      apartmentType: apiData.apartmentType,
      state: apiData.state,
      town: apiData.town,
      price: apiData.price,
    },

    // Details
    details: apiData.details || {},

    // Facilities - transform from array of objects to array of values
    facilities: apiData.facilities
      ? apiData.facilities.map((facility) => ({ value: facility.name }))
      : [],

    // House rules - transform from array of objects to array of values
    houseRules: apiData.houseRules
      ? apiData.houseRules.map((rule) => ({ value: rule.rule }))
      : [],

    // Images
    images: apiData.images || [],

    // Security deposit
    securityDeposit: apiData.securityDeposit || {},

    // Legal documents
    legalDocuments: {
      role: apiData.documents?.[0]?.role || "",
      documents: apiData.documents || [],
    },

    // Pricing
    pricing: {
      pricePerNight: apiData.price,
    },

    // Include the raw API data for debugging
    _raw: apiData,
  };
};

export default function ListingOverviewPage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { user } = useUser();

  useEffect(() => {
    const fetchApartment = async () => {
      try {
        setLoading(true);

        // First try to get from location state (if coming from creation)
        if (location.state?.apartment) {
          console.log("✅ Setting apartment from location state");
          const transformedData = transformApartmentData(
            location.state.apartment
          );
          console.log("📦 Transformed apartment data:", transformedData);
          setApartment(transformedData);
          setLoading(false);
          return;
        }

        // If no location state but we have an ID, fetch from API
        if (id) {
          console.log("🔍 Fetching apartment by ID:", id);
          const response = await getApartmentById(id);
          if (response.success) {
            console.log("✅ Raw API response:", response.data);
            const transformedData = transformApartmentData(response.data);
            console.log("📦 Transformed apartment data:", transformedData);
            setApartment(transformedData);
          } else {
            console.error("❌ Failed to fetch apartment");
          }
        } else {
          console.log("❌ No apartment ID provided");
        }
      } catch (error) {
        console.error("❌ Error fetching apartment:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApartment();
  }, [location.state, id]);

  // Debug: Log the current apartment data
  useEffect(() => {
    if (apartment) {
      console.log("🏠 Current apartment state:", apartment);
      console.log("🔧 Facilities:", apartment.facilities);
      console.log("📜 House Rules:", apartment.houseRules);
      console.log("💰 Pricing:", apartment.pricing);
      console.log("📄 Documents:", apartment.legalDocuments);
    }
  }, [apartment]);

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    setShowConfirm(false);
    setShowSuccess(true);
  };

  if (loading) {
    return (
      <div className="px-[18px] text-[#39302A] pb-[24px] mt-[10px] bg-[#F9F9F9]">
        <div className="flex items-center justify-center h-64">
          <p>Loading apartment details...</p>
        </div>
      </div>
    );
  }

  if (!apartment) {
    return (
      <div className="px-[18px] text-[#39302A] pb-[24px] mt-[10px] bg-[#F9F9F9]">
        <div className="flex items-center justify-center h-64 flex-col gap-4">
          <p>No apartment data found</p>
          <button
            onClick={() => navigate("/host-dashboard")}
            className="bg-[#A20BA2] text-white px-4 py-2 rounded"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F9F9F9] min-h-screen">
      <ApartmentDisplay
        apartment={apartment}
        user={user}
        showActions={true}
        status={"under_review"}
        showLegalDocuments={true}
        backToHostDashboard={true}
      />

      {/* Delete Button */}
      <div className="px-[18px] text-center">
        <button
          onClick={handleDeleteClick}
          className="mx-auto w-full mt-[100px] bg-[#FFFFFF] text-[#686464] border border-[#E9E9E9] text-[16px] font-semibold h-[57px] rounded-[10px] mb-[54px]"
        >
          Delete Listing
        </button>
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <ShowSuccess
          image="/icons/delete.svg"
          confirmMode
          heading="Delete Listing?"
          message="Are you sure you want to delete this post? This action cannot be undone."
          onClose={() => setShowConfirm(false)}
          onConfirm={handleConfirmDelete}
        />
      )}

      {/* Success Modal */}
      {showSuccess && (
        <ShowSuccess
          image="/icons/success.svg"
          heading="List Deleted!"
          message=" "
          buttonText="Done"
          onClose={() => {
            setShowSuccess(false);
            navigate("/shortlet-review");
          }}
        />
      )}
    </div>
  );
}
