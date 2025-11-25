import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ApartmentDisplay } from "../../components/apartment/ApartmentDisplay";
import { getApartmentById, deleteApartment } from "../../services/apartmentApi";
import ShowSuccess from "../../components/ShowSuccess";
import { useUser } from "../../hooks/useUser";

export default function ViewListing() {
  const { apartmentId } = useParams();
  const [apartment, setApartment] = useState(null);
  const [host, setHost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [successType, setSuccessType] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    const fetchApartment = async () => {
      try {
        setLoading(true);
        const response = await getApartmentById(apartmentId);

        console.log("API Response:", response); // Debug log

        if (response && response.data) {
          // Transform the API response to match ApartmentDisplay expected structure
          const transformedApartment = transformApartmentData(response.data);
          setApartment(transformedApartment);
          setHost(response.data.host);
        } else {
          console.log("No apartment data received");
        }
      } catch (error) {
        console.error("Failed to load apartment:", error);
      } finally {
        setLoading(false);
      }
    };

    if (apartmentId) {
      fetchApartment();
    } else {
      console.error("No apartment ID provided");
      setLoading(false);
    }
  }, [apartmentId]);

  // Transform API data to match ApartmentDisplay component structure
  const transformApartmentData = (apiData) => {
    return {
      // ✅ FIXED: Include the raw data structure that ApartmentDisplay expects
      data: apiData, // Pass the raw data for proper favorites access
      basicInfo: {
        title: apiData.title,
        apartmentType: apiData.apartmentType,
        state: apiData.state,
        town: apiData.town,
      },
      // ✅ FIXED: Include favorites data directly
      favorites: apiData.favorites || [],
      _count: {
        favorites: apiData._count?.favorites || 0,
      },
      totalLikes: apiData.totalLikes || apiData._count?.favorites || 0,
      details: {
        bedrooms: apiData.details?.bedrooms,
        bathrooms: apiData.details?.bathrooms,
        electricity: apiData.details?.electricity,
        guestNumber: apiData.details?.guestNumber,
        parkingSpace: apiData.details?.parkingSpace,
        kitchenSize: apiData.details?.kitchenSize,
        description: apiData.details?.description,
      },
      facilities:
        apiData.facilities?.map((facility) => ({
          value: facility.name,
        })) || [],
      houseRules:
        apiData.houseRules?.map((rule) => ({
          value: rule.rule,
        })) || [],
      images: apiData.images || [],
      pricing: {
        pricePerNight: apiData.price,
      },
      securityDeposit: apiData.securityDeposit,
      legalDocuments: {
        documents: apiData.documents || [],
      },
      // Include other fields that might be needed
      status: apiData.status,
      isListed: apiData.isListed,
      isAvailable: apiData.isAvailable,
      isVerified: apiData.status === "VERIFIED",
      // ✅ FIXED: Include direct properties for flat structure access
      id: apiData.id,
      title: apiData.title,
      apartmentType: apiData.apartmentType,
      state: apiData.state,
      town: apiData.town,
      price: apiData.price,
    };
  };

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!apartmentId) {
      console.error("Apartment ID is missing");
      return;
    }

    try {
      setIsDeleting(true);
      setShowConfirm(false);

      const response = await deleteApartment(apartmentId);

      if (response.success) {
        setSuccessType("delete");
      } else {
        throw new Error(response.message || "Failed to delete apartment");
      }
    } catch (error) {
      console.error("Error deleting apartment:", error);
      alert(error.message || "Failed to delete apartment. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    if (apartmentId) {
      navigate(`/basic-info/${apartmentId}`);
    }
  };
  const handleSuccessClose = () => {
    setSuccessType(null);
    if (successType === "delete") {
      navigate("/host-dashboard");
    }
  };

  // Show loading spinner
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A20BA2]"></div>
      </div>
    );
  }

  if (!apartment) {
    return (
      <div className="text-center mt-10 text-red-500">Apartment not found.</div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header with back button and edit button - handled by ApartmentDisplay */}

      <ApartmentDisplay
        apartment={apartment}
        user={host || user} // Use fetched host or current user
        showActions={true}
        onEdit={handleEdit}
        showLegalDocuments={true}
        backToHostDashboard={true}  
      />

      {/* Delete Button */}
      <div className="px-[18px] text-center">
        <button
          onClick={handleDeleteClick}
          disabled={isDeleting}
          className="mx-auto w-full mt-[59px] bg-[#FFFFFF] text-[#686464] border border-[#E9E9E9] text-[16px] font-semibold h-[57px] rounded-[10px] mb-[72px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDeleting ? "Deleting..." : "Delete Listing"}
        </button>
      </div>

      {/* Confirm Delete Modal */}
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

      {/* Success Modal for Deletion */}
      {successType === "delete" && (
        <ShowSuccess
          image="/icons/success.svg"
          heading="List Deleted!"
          message=" "
          buttonText="Done"
          onClose={handleSuccessClose}
        />
      )}
    </div>
  );
}
