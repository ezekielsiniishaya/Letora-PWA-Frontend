// components/apartment/ApartmentDisplay.jsx
import { useState, useEffect, useCallback } from "react";
import PropertyDetails from "../dashboard/PropertyDetails";
import Facilities from "../dashboard/Facilities";
import HouseRules from "../dashboard/HouseRules";
import { useNavigate } from "react-router-dom";
import { toggleFavoriteAPI } from "../../services/apartmentApi";
import Reviews from "../dashboard/ReviewsSections"; // Add this import
import { Star } from "lucide-react"; // Add this import if not already there
import { useUser } from "../../hooks/useUser";
import {
  parkingSpaceMap,
  guestNumberMap,
  electricityMap,
  kitchenSizeMap,
  apartmentTypeMap,
  facilityMap,
  houseRuleMap,
} from "../utils/mapping";

// Reverse mapping helpers
const reverseMapPropertyDetails = (details = {}, basicInfo = {}) => {
  const {
    bedrooms,
    bathrooms,
    parkingSpace,
    guestNumber,
    electricity,
    kitchenSize,
  } = details;
  const { apartmentType } = basicInfo;

  return [
    {
      iconSrc: "/icons/bed-sm.svg",
      label: "Bedroom",
      value: bedrooms?.toString() || "0",
    },
    {
      iconSrc: "/icons/bath.svg",
      label: "Bathtub",
      value: bathrooms?.toString() || "0",
    },
    {
      iconSrc: "/icons/car.svg",
      label: "Parking Space",
      value: parkingSpaceMap[parkingSpace] || "Not specified",
    },
    {
      iconSrc: "/icons/apartment.svg",
      label: "Apartment Type",
      value: apartmentTypeMap[apartmentType] || "Not specified",
    },
    {
      iconSrc: "/icons/guest.svg",
      label: "Guest Size",
      value: guestNumberMap[guestNumber] || "0",
    },
    {
      iconSrc: "/icons/zap.svg",
      label: "Electricity",
      value: electricityMap[electricity] || "Not specified",
    },
    {
      iconSrc: "/icons/kitchen.svg",
      label: "Kitchen Size",
      value: kitchenSizeMap[kitchenSize] || "Not specified",
    },
  ];
};

const reverseMapFacilities = (facilities = []) =>
  facilities.map((f) => ({
    icon: facilityMap[f.value]?.icon || "/icons/default-facility.svg",
    text: facilityMap[f.value]?.label || f.value,
  }));

const reverseMapHouseRules = (rules = []) =>
  rules.map((r) => ({
    icon: houseRuleMap[r.value]?.icon || "/icons/default-rule.svg",
    text: houseRuleMap[r.value]?.label || r.value,
  }));

export const ApartmentOverview = ({
  apartment,
  user,
  showActions = false,
  onEdit,
  status = "draft",
  showLegalDocuments = true,
  backToHostDashboard = false,
  onPriceButtonClick,
}) => {
  const [showGallery, setShowGallery] = useState(false);
  const [favorites, setFavorites] = useState({});
  const [loadingStates, setLoadingStates] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [showThumbnailOverlay, setShowThumbnailOverlay] = useState(true);

  const { user: currentUser, refreshUser } = useUser();
  const navigate = useNavigate();

  const getApartmentId = useCallback(
    () => apartment?.securityDeposit?.apartmentId || apartment?.id,
    [apartment]
  );

  // Initialize selected image
  useEffect(() => {
    if (apartment?.images?.length) {
      const firstImage = apartment.images[0];
      setSelectedImage(
        typeof firstImage === "string"
          ? firstImage
          : firstImage.url || firstImage.data
      );
    }
  }, [apartment]);

  // Initialize favorites
  useEffect(() => {
    if (apartment && currentUser) {
      const apartmentId = getApartmentId();
      const isFav = currentUser.favorites?.some(
        (fav) => fav.apartmentId === apartmentId
      );
      setFavorites({ [apartmentId]: isFav || false });
    }
  }, [apartment, currentUser, getApartmentId]);

  const toggleFavorite = async (e) => {
    e.stopPropagation();
    const apartmentId = getApartmentId();
    if (!apartmentId) return;

    setLoadingStates((p) => ({ ...p, [apartmentId]: true }));
    try {
      const res = await toggleFavoriteAPI(apartmentId);
      if (res.success)
        setFavorites((p) => ({ ...p, [apartmentId]: res.isFavorited }));
      await refreshUser();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStates((p) => ({ ...p, [apartmentId]: false }));
    }
  };

  if (!apartment) return <div>Loading apartment details...</div>;

  // Handle both direct apartment object and nested data structure
  const apartmentData = apartment.data || apartment;

  // Extract apartment data - handle different field names
  const {
    basicInfo = {},
    details = apartmentData.details || {},
    facilities = apartmentData.facilities || [],
    images = apartmentData.images || [],
    pricing = {},
    securityDeposit = apartmentData.securityDeposit || {},
    houseRules = apartmentData.houseRules || [],
    legalDocuments = [],
    favorites: apartmentFavorites = apartmentData.favorites || [],
    _count = apartmentData._count || {},
    reviews: rawReviews,
    title = apartmentData.title,
    apartmentType = apartmentData.apartmentType,
    state = apartmentData.state,
    town = apartmentData.town,
  } = apartmentData;

  // Build basicInfo if it doesn't exist
  const actualBasicInfo = basicInfo.title
    ? basicInfo
    : {
        title: title || basicInfo.title,
        apartmentType: apartmentType || basicInfo.apartmentType,
        state: state || basicInfo.state,
        town: town || basicInfo.town,
      };
  // Ensure reviews are properly extracted
  const actualReviews = rawReviews ?? [];
  console.log(
    "DEBUG: apartmentData keys:",
    apartmentData && Object.keys(apartmentData)
  );
  console.log("DEBUG: apartmentData.reviews:", apartmentData?.reviews);
  console.log("DEBUG: apartment.reviews:", apartment?.reviews);
  console.log(
    "DEBUG: apartmentData.data?.reviews:",
    apartmentData?.data?.reviews
  );
  console.log("DEBUG: findReviewsDeep result length:", actualReviews.length);
  // Use the favorites from the extracted data
  const actualFavorites = apartmentFavorites;
  const totalLikes = _count.favorites || apartmentData.totalLikes || 0;

  console.log("Actual favorites:", actualFavorites);
  console.log("Total likes:", totalLikes);
  console.log("apartmentData.totalLikes:", apartmentData.totalLikes);

  const displayImages =
    images.length > 0
      ? images.map((img) =>
          typeof img === "string"
            ? img
            : img.url || img.data || "/images/apartment-dashboard.png"
        )
      : ["/images/apartment-dashboard.png"];

  const propertyDetails = reverseMapPropertyDetails(details, actualBasicInfo);
  const mappedFacilities = reverseMapFacilities(facilities);
  const mappedHouseRules = reverseMapHouseRules(houseRules);

  const formatCurrency = (v) => {
    if (!v) return "0";
    const n =
      typeof v === "string" ? parseInt(v.replace(/,/g, "")) : v.amount || v;
    return isNaN(n) ? "0" : n.toLocaleString();
  };

  const formatPrice = (price) => {
    if (!price) return "0";
    if (typeof price === "number") return price.toLocaleString();
    if (typeof price === "string") {
      const num = parseInt(price.replace(/,/g, ""));
      return isNaN(num) ? "0" : num.toLocaleString();
    }
    return "0";
  };

  const hostInfo = {
    name: user?.firstName || user?.username || "Host",
    surname: user?.lastName || "",
    avatar: user?.profilePic || "/images/profile-image.png",
  };

  // Check if apartment is verified
  const isVerified = () => {
    return (
      apartment.isVerified ||
      apartment.status === "VERIFIED" ||
      apartment.verified
    );
  };
  // Get total reviews count
  const getTotalReviews = () => {
    return apartmentData.reviews?.length || 0;
  };
  // Get liked users display text
  const getLikedUsersText = () => {
    const favorites = actualFavorites || [];
    const actualLikeCount = favorites.length;

    // If we have favorites data with user info, use it
    if (actualLikeCount > 0) {
      if (actualLikeCount === 1) {
        return `${favorites[0]?.user?.firstName || "Someone"} Liked this place`;
      } else if (actualLikeCount === 2) {
        return `${
          favorites[1]?.user?.firstName || "Someone"
        } +1 Liked this place`;
      } else if (actualLikeCount === 3) {
        return `${
          favorites[2]?.user?.firstName || "Someone"
        } +2 Liked this place`;
      } else if (actualLikeCount === 4) {
        return `${
          favorites[3]?.user?.firstName || "Someone"
        } +3 Liked this place`;
      } else if (actualLikeCount > 4) {
        return `+${actualLikeCount} Liked this place`;
      }
    }

    // Show 0 likes
    return "0 people Liked this place";
  };

  return (
    <div className="text-[#39302A] mb-[24px]">
      {/* Header Actions */}
      {showActions && (
        <div className="flex items-center mb-[20px] justify-between mx-[19px]">
          <button
            onClick={() =>
              backToHostDashboard
                ? navigate("/host-dashboard")
                : window.history.back()
            }
            className="hover:bg-gray-200"
          >
            <img src="/icons/arrow-left.svg" alt="Back" className="w-5 h-5" />
          </button>
          {status === "draft" && onEdit && (
            <button
              onClick={onEdit}
              className="bg-[#686464] text-[12px] font-medium w-[65px] h-[21px] text-white px-4 rounded-full hover:bg-gray-800"
            >
              Edit
            </button>
          )}
          {status === "under_review" && (
            <button className="bg-[#167DDD] text-[12px] font-medium w-[151px] h-[21px] text-white px-4 rounded-full">
              Undergoing Review
            </button>
          )}
        </div>
      )}

      {/* Image Gallery with Thumbnails on Top */}
      <div className="relative w-full md:hidden">
        {/* Main image */}
        <div className="relative w-full h-[328px]">
          <img
            src={selectedImage || displayImages[0]}
            alt="Main apartment view"
            className="w-full h-full object-cover"
            onError={(e) => (e.target.src = "/images/apartment-dashboard.png")}
          />

          <div
            className="scroll-x-only bg-white flex items-center gap-[6.48px] px-[6.48px] py-[6.48px] scrollbar-hide w-[373px] border-b absolute h-[66.61px] bottom-5 left-1/2 -translate-x-1/2 rounded-[7.2px]"
            onScroll={() => setShowThumbnailOverlay(false)}
          >
            {displayImages.map((src, i) => (
              <button
                key={i}
                onClick={() => {
                  setSelectedImage(src);
                  setShowThumbnailOverlay(false);
                }}
                className="flex-shrink-0 w-[63px] h-[57px] rounded-md overflow-hidden border-2 transition-all duration-200 relative"
              >
                <img
                  src={src}
                  alt={`Thumbnail ${i + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) =>
                    (e.target.src = "/images/apartment-dashboard.png")
                  }
                />
                {showThumbnailOverlay &&
                  i === displayImages.length - 1 &&
                  displayImages.length > 4 && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 rounded-md flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        +{displayImages.length - 4}
                      </span>
                    </div>
                  )}
              </button>
            ))}
          </div>

          {/* Top icons */}
          <div className="absolute top-[19px] left-[19px] flex items-center space-x-2">
            <button
              onClick={() =>
                backToHostDashboard
                  ? navigate("/host-dashboard")
                  : window.history.back()
              }
              className="bg-white/80 p-2 rounded-full"
            >
              <img
                src="/icons/arrow-left.svg"
                alt="Back"
                className="w-[18px] h-[18px]"
              />
            </button>
          </div>
          <div className="absolute top-[19px] right-[19px] flex items-center space-x-2">
            <button
              onClick={toggleFavorite}
              disabled={loadingStates[getApartmentId()]}
              className="bg-white/80 p-2 rounded-full"
            >
              {loadingStates[getApartmentId()] ? (
                <div className="w-3 h-3 border-2 border-[#A20BA2] border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <img
                  src={
                    favorites[getApartmentId()]
                      ? "/icons/heart-purple.svg"
                      : "/icons/heart-gray2.svg"
                  }
                  alt="heart"
                  className="w-[18px] h-[18px]"
                />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-[18px]">
        {/* Host info & Pricing */}
        <div className="flex flex-col mt-4 relative">
          <div className="flex flex-col items-start">
            <img
              src={hostInfo.avatar}
              alt="Host"
              className="w-[50px] h-[50px] rounded-full object-cover -mt-4 z-10 border-2 border-white"
              onError={(e) => (e.target.src = "/images/default-avatar.jpg")}
            />
            <span className="font-medium mt-[4px] text-[#39302A] text-[13px]">
              {hostInfo.name} {hostInfo.surname}
            </span>

            <div className="flex flex-col w-full mt-[4px] gap-[20px]">
              <div className="flex-1">
                {/* Verified badge and title */}
                <div className="flex gap-1 mb-1">
                  {/* Verified badge */}
                  {isVerified() && (
                    <img
                      src="/icons/tick-black.svg"
                      alt="Verified icon"
                      className="w-[16px] h-[18px]"
                    />
                  )}
                  <h1 className="text-[14px] font-semibold leading-snug">
                    {basicInfo.title?.length > 40
                      ? basicInfo.title.slice(0, 40) + "..."
                      : basicInfo.title}
                  </h1>
                </div>
                <p className="font-medium text-[12px]">
                  {basicInfo.town || "Maryland, Lagos"},{" "}
                  {basicInfo.state || "Maryland, Lagos"}
                </p>
                {/* Updated Rating and likes section - Always show */}
                <div className="flex items-center justify-between mt-[10px]">
                  <div className="flex items-center gap-1 md:gap-2">
                    {actualFavorites && actualFavorites.length > 0 ? (
                      <>
                        <div className="flex -space-x-2 md:-space-x-3">
                          {/* Display profile images based on likes count */}
                          {actualFavorites
                            .slice(0, Math.min(4, actualFavorites.length))
                            .map((favorite, index) => {
                              const profilePic = favorite.user?.profilePic;
                              const colors = [
                                "#8B44FF",
                                "#E00E9A",
                                "#FF4444",
                                "#70E5FF",
                              ];

                              if (!profilePic) {
                                return (
                                  <div
                                    key={favorite.id}
                                    className="w-[20.56px] h-[20.56px] rounded-full border-2 border-white md:w-[36.62px] md:h-[36.62px]"
                                    style={{
                                      backgroundColor:
                                        colors[index % colors.length],
                                    }}
                                  />
                                );
                              }

                              return (
                                <img
                                  key={favorite.id}
                                  src={profilePic}
                                  alt={favorite.user?.firstName || "User"}
                                  className="w-[20.56px] h-[20.56px] rounded-full border-2 border-white object-cover md:w-[36.62px] md:h-[36.62px]"
                                  onError={(e) => {
                                    const colors = [
                                      "#8B44FF",
                                      "#E00E9A",
                                      "#FF4444",
                                      "#70E5FF",
                                    ];
                                    e.target.style.display = "none";
                                    const div = document.createElement("div");
                                    div.className =
                                      "w-[20.56px] h-[20.56px] rounded-full border-2 border-white md:w-[36.62px] md:h-[36.62px]";
                                    div.style.backgroundColor =
                                      colors[index % colors.length];
                                    e.target.parentNode.insertBefore(
                                      div,
                                      e.target
                                    );
                                  }}
                                />
                              );
                            })}
                        </div>
                        <span className="text-[12px] font-medium text-[#333333] md:text-[20px]">
                          {getLikedUsersText()}
                        </span>
                      </>
                    ) : (
                      <span className="text-[12px] font-medium text-[#333333] md:text-[20px]">
                        {getLikedUsersText()}
                      </span>
                    )}
                  </div>

                  <button
                    className="mt-[-10px] text-white py-[6px] w-[128px] px-[6px] bg-[#A20BA2] h-[30px] font-semibold text-[12.5px] rounded-[5px] flex items-center justify-center"
                    onClick={onPriceButtonClick}
                  >
                    ₦{formatPrice(pricing.pricePerNight)}/Night
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Property details */}
        <div className="mt-[31.66px]">
          <h2 className="text-[14px] font-semibold">Property Details</h2>
          <PropertyDetails list={propertyDetails} />
        </div>

        {/* Description */}
        <div className="mt-[31.66px]">
          <h2 className="text-[14px] font-semibold">Description</h2>
          <p className="text-[12px] mt-2 text-[#505050]">
            {details.description || "No description provided"}
          </p>
        </div>

        {/* Facilities */}
        <div className="mt-[31.66px]">
          <h2 className="text-[14px] font-semibold">Facilities & Services</h2>
          {mappedFacilities.length ? (
            <Facilities list={mappedFacilities} />
          ) : (
            <p className="text-[12px] mt-2 text-[#505050]">
              No facilities selected
            </p>
          )}
        </div>

        {/* Reviews Section - Only render if there are reviews */}
        {getTotalReviews() > 0 && (
          <div className="mt-[31.66px]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[14px] font-semibold">
                Reviews ({getTotalReviews()})
              </h2>
            </div>
            <Reviews reviews={actualReviews} limit={3} />
            {/* Make "See more" a clickable button */}
            <div className="flex justify-end mt-[8px]">
              <button
                onClick={() =>
                  navigate(`/reviews`, { state: { reviews: actualReviews } })
                }
                className="text-[12px] font-semibold text-[#A20BA2] hover:text-[#8E0A8E] transition-colors"
              >
                See more...
              </button>
            </div>
          </div>
        )}
        {/* House Rules */}
        <div className="mt-[31.66px]">
          <h2 className="text-[14px] font-semibold">House Rules</h2>
          {mappedHouseRules.length ? (
            <HouseRules list={mappedHouseRules} />
          ) : (
            <p className="text-[12px] mt-2 text-[#505050]">
              No house rules selected
            </p>
          )}
        </div>

        {/* Security Deposit */}
        <div className="mt-[31.66px]">
          <h2 className="text-[14px] font-semibold">Security Deposit Fee</h2>
          <div className="flex items-center mt-[5px] gap-1 text-[14px] font-medium">
            <img
              src="/icons/money.svg"
              alt="money"
              className="w-[19px] h-[14px]"
            />
            <p>₦{formatCurrency(securityDeposit)}.00</p>
          </div>
        </div>

        {/* Documents */}
        {showLegalDocuments && legalDocuments?.documents && (
          <div className="mt-[31.66px]">
            <h2 className="text-[14px] font-semibold">Documentations</h2>
            <div className="flex gap-[7.5px] mt-[10px]">
              {legalDocuments.documents.slice(0, 3).map((doc, i) => (
                <div
                  key={i}
                  className="flex-1 border-[1.5px] border-[#D1D0D0] rounded-lg bg-[#CCCCCC42] h-[98px] flex flex-col items-center justify-center text-[#505050] text-[12px] p-1"
                >
                  <img
                    src={
                      doc.type?.includes("image")
                        ? "/icons/camera.svg"
                        : "/icons/pdf.svg"
                    }
                    alt="doc"
                    className="w-8 h-8 mb-1"
                  />
                  <span className="text-center text-[10px] truncate w-full">
                    {doc.name?.length > 15
                      ? `${doc.name.slice(0, 12)}...`
                      : doc.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Gallery Overlay */}
      {showGallery && (
        <div
          className="fixed inset-0 bg-[#313131]/80 flex items-center justify-center z-50"
          onClick={() => setShowGallery(false)}
        >
          <div
            className="flex gap-[13px] overflow-x-auto p-4 max-w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {displayImages.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Apartment ${i + 1}`}
                className="rounded-[5px] w-[319px] h-[203px] object-cover flex-shrink-0"
                onError={(e) => {
                  e.target.src = "/images/apartment-dashboard.png";
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApartmentOverview;
