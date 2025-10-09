import { Link } from "react-router-dom";

export default function ApartmentCard({ apt, role = "guest" }) {
  // role can be "guest" or "host"
  const link =
    role === "host"
      ? `/view-listing/${apt.id || apt._id}`
      : `/shortlet-overview/${apt.id || apt._id}`;

  // Transform the data to match the expected format
  const getPrimaryImage = () => {
    const primaryImage =
      apt.images?.find((img) => img.isPrimary) || apt.images?.[0];
    return primaryImage?.url || "/images/apartment.png";
  };

  const getLocation = () => {
    if (apt.town && apt.state) {
      return `${apt.town}, ${apt.state}`;
    }
    return apt.location || "Location not specified";
  };

  const getPrice = () => {
    if (typeof apt.price === "number") {
      if (apt.price >= 1000000) {
        // For millions: 1.5M, 2M, etc.
        const millions = apt.price / 1000000;
        return `₦${millions % 1 === 0 ? millions : millions.toFixed(1)}M`;
      } else if (apt.price >= 1000) {
        // For thousands: 150K, 200K, etc.
        const thousands = apt.price / 1000;
        return `₦${thousands % 1 === 0 ? thousands : thousands.toFixed(1)}K`;
      } else {
        // For amounts less than 1000
        return `₦${apt.price.toLocaleString()}`;
      }
    }
    return apt.price || "₦0";
  };

  const getRating = () => {
    if (apt.averageRating) {
      return apt.averageRating.toFixed(1);
    }
    return apt.rating || "0.0";
  };

  const getLikes = () => {
    return apt.totalLikes?.toString() || apt.likes || "0";
  };

  const isVerified = () => {
    return apt.isVerified || apt.status === "VERIFIED" || apt.verified;
  };

  return (
    <Link
      to={link}
      className="bg-white rounded-[5px] p-[8px] flex gap-2 hover:shadow-md transition mb-2 w-full"
    >
      {/* Image */}
      <img
        src={getPrimaryImage()}
        alt={apt.title}
        className="w-[97px] h-[86px] rounded-[2.3px] object-cover flex-shrink-0"
      />

      {/* Info */}
      <div className="flex-1 flex flex-col gap-y-2 mt-3 mr-1 min-h-[86px]">
        {/* Top row: tick + title + rating */}
        <div className="flex items-start gap-2">
          <div className="flex items-center gap-1 flex-1 min-w-0">
            {isVerified() && (
              <img
                src="/icons/tick-black.svg"
                alt="Verified"
                className="w-[14px] h-[14px]"
              />
            )}
            <h2 className="text-[13px] font-medium text-[#333333] truncate leading-tight max-w-[180px] whitespace-nowrap overflow-hidden">
              {apt.title}
            </h2>
          </div>
          <div className="flex text-[10px] font-medium text-[#666666] gap-1">
            <img
              src="/icons/star-gray.svg"
              alt="Rating"
              className="w-[13.19px] -mt-[.5px] h-[13.19px]"
            />
            <span>{getRating()}</span>
          </div>
        </div>

        {/* Location row */}
        <div className="flex items-center gap-1 text-[11px] text-[#333333]">
          <img
            src="/icons/location.svg"
            alt="Location"
            className="w-[11px] h-[13px] flex-shrink-0"
          />
          <span className="truncate">{getLocation()}</span>
        </div>

        {/* Bottom row: circles + liked / price */}
        <div className="flex items-center gap-2 text-[12px] text-[#505050]">
          {/* Circles + liked */}
          <div className="flex items-center gap-1 flex-1 min-w-0">
            <div className="flex -space-x-[6px] flex-shrink-0">
              <div
                className="w-4 h-4 rounded-full border border-white"
                style={{ backgroundColor: "#008751" }}
              ></div>
              <div
                className="w-4 h-4 rounded-full border border-white"
                style={{ backgroundColor: "#F711F7" }}
              ></div>
            </div>
            <span className="truncate">+{getLikes()} people liked this</span>
          </div>

          {/* Price */}
          <span className="font-semibold text-[12px] text-[#333333] flex-shrink-0">
            {getPrice()}
          </span>
        </div>
      </div>
    </Link>
  );
}
