// pages/ListingOverviewPage.jsx - FIXED VERSION
import { useState, useEffect } from "react";
import ShowSuccess from "../../components/ShowSuccess";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import ApartmentDisplay from "../../components/apartment/ApartmentDisplay";
import { useUser } from "../../hooks/useUser";
import { getApartmentById, deleteApartment } from "../../services/apartmentApi"; // ✅ Import deleteApartment
import { StatusBar, Style } from "@capacitor/status-bar";
import { useBackgroundColor } from "../../contexts/BackgroundColorContext";

// Helper function to transform API data to match ApartmentDisplay expectations
const transformApartmentData = (apiData) => {
  if (!apiData) return null;

  return {
    // ✅ FIXED: Include the raw data structure that ApartmentDisplay expects
    data: apiData,
    // Basic info
    basicInfo: {
      title: apiData.title,
      apartmentType: apiData.apartmentType,
      state: apiData.state,
      town: apiData.town,
      price: apiData.price,
    },
    // ✅ FIXED: Include favorites data for likes display
    favorites: apiData.favorites || [],
    _count: {
      favorites: apiData._count?.favorites || 0,
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

    // ✅ FIXED: Include direct properties for flat structure access
    id: apiData.id,
    title: apiData.title,
    apartmentType: apiData.apartmentType,
    state: apiData.state,
    town: apiData.town,
    price: apiData.price,
    status: apiData.status,
    isVerified: apiData.status === "VERIFIED",

    // Include the raw API data for debugging
    _raw: apiData,
  };
};

export default function ListingOverviewPage() {
  const { setBackgroundColor } = useBackgroundColor();

  useEffect(() => {
    setBackgroundColor("#F9F9F9");

    if (window.Capacitor || window.capacitor) {
      StatusBar.setBackgroundColor({ color: "#F9F9F9" });
      StatusBar.setStyle({ style: Style.Light });
    }
  }, [setBackgroundColor]);

  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false); // ✅ Added loading state for delete
  const [error, setError] = useState(null); // ✅ Added error state

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
            location.state.apartment,
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
        setError("Failed to load apartment details");
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
      console.log("❤️ Favorites:", apartment.favorites);
      console.log("🔢 Favorites count:", apartment._count?.favorites);
    }
  }, [apartment]);

  const handleDeleteClick = () => {
    setShowConfirm(true);
    setError(null); // Clear previous errors
  };

  // ✅ FIXED: Actually call the delete API
  const handleConfirmDelete = async () => {
    if (!id) {
      console.error("❌ No apartment ID available for deletion");
      setError("No apartment ID found");
      return;
    }

    try {
      setIsDeleting(true);
      setShowConfirm(false);

      console.log("🗑️ Attempting to delete apartment:", id);

      const response = await deleteApartment(id);

      console.log("✅ Delete API response:", response);

      if (response && response.success) {
        console.log("✅ Apartment deleted successfully");
        setShowSuccess(true);
      } else {
        throw new Error(response?.message || "Failed to delete apartment");
      }
    } catch (error) {
      console.error("❌ Error deleting apartment:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete apartment. Please try again.";
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setError(null);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate("/host-dashboard"); // Navigate to dashboard after successful deletion
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
    <div className="min-h-screen bg-[#F9F9F9]">
      {/* Error Display */}
      {error && (
        <div className="mx-4 mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

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
          disabled={isDeleting} // ✅ Disable while deleting
          className="mx-auto w-full mt-[100px] bg-[#FFFFFF] text-[#686464] border border-[#E9E9E9] text-[16px] font-semibold h-[57px] rounded-[10px] mb-[54px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          {isDeleting ? "Deleting..." : "Delete Listing"}
        </button>
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <ShowSuccess
          image="/icons/delete.svg"
          confirmMode
          heading="Delete Listing?"
          message="Are you sure you want to delete this post? This action cannot be undone."
          onClose={handleCancelDelete} // ✅ Use proper cancel handler
          onConfirm={handleConfirmDelete}
          confirmText={isDeleting ? "Deleting..." : "Yes, Delete"} // ✅ Show loading state
          cancelText="Cancel"
          confirmDisabled={isDeleting} // ✅ Disable confirm button while deleting
        />
      )}

      {/* Success Modal */}
      {showSuccess && (
        <ShowSuccess
          image="/icons/success.svg"
          heading="List Deleted!"
          message="Your listing has been successfully deleted."
          buttonText="Done"
          onClose={handleSuccessClose} // ✅ Use proper success handler
        />
      )}
    </div>
  );
}
