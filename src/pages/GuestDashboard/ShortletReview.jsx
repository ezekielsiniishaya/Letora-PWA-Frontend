// pages/ListingOverviewPage.jsx - FOR VIEWING CREATED APARTMENTS
import { useState, useEffect } from "react";
import ShowSuccess from "../../components/ShowSuccess";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import ApartmentDisplay from "../../components/apartment/ApartmentDisplay";
import { useUser } from "../../hooks/useUser";
import { getApartmentById } from "../../services/apartmentApi";

export default function ListingOverviewPage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [apartment, setApartment] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // Get apartment ID from URL
  const { user } = useUser();

  useEffect(() => {
    const fetchApartment = async () => {
      try {
        setLoading(true);

        // First try to get from location state (if coming from creation)
        if (location.state?.apartment) {
          console.log("✅ Setting apartment from location state");
          setApartment(location.state.apartment);
          setLoading(false);
          return;
        }

        // If no location state but we have an ID, fetch from API
        if (id) {
          console.log("🔍 Fetching apartment by ID:", id);
          const response = await getApartmentById(id);
          if (response.success) {
            console.log("✅ Apartment fetched from API:", response.data);
            setApartment(response.data);
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
        status={apartment.isListed ? "under_review" : "draft"}
        showLegalDocuments={true}
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
