// components/dashboard/ReviewsSections.jsx
import { Star } from "lucide-react";

function StarsMobile({ rating }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={15}
          fill={i < rating ? "#FBBF24" : "#505050"}
          stroke={i < rating ? "#FBBF24" : "#9CA3AF"}
          strokeWidth={0}
        />
      ))}
    </div>
  );
}

export default function Reviews({ reviews = [], limit }) {
  console.log("🔍 Reviews component received:", reviews);

  // Apply limit if provided, otherwise show all reviews
  const displayReviews = limit ? reviews.slice(0, limit) : reviews;

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Get default avatar if profilePic is null
  const getAvatar = (profilePic) => {
    return profilePic || "/images/default-avatar.jpg";
  };

  if (!reviews || reviews.length === 0) {
    return (
      <div className="mx-auto mt-2 w-full">
        <p className="text-[#505050] text-[12px] text-center py-4">
          No reviews yet
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto space-y-[10px] mt-2 w-full">
      {displayReviews.map((review) => (
        <div key={review.id} className="bg-white">
          <div className="flex justify-between items-start mb-[10px]">
            <div className="flex gap-[9px] items-center">
              <img
                src={getAvatar(review.guest?.profilePic)}
                alt={review.guest?.firstName || "Guest"}
                className="w-[30px] h-[30px] rounded-full object-cover"
                onError={(e) => {
                  e.target.src = "/images/profile-image.png";
                }}
              />
              <div>
                <h3 className="font-semibold text-[13px] text-[#333333]">
                  {review.guest?.firstName} {review.guest?.lastName}
                </h3>
                <p className="text-[#56575B] text-[10px]">
                  {formatDate(review.createdAt)}
                </p>
              </div>
            </div>
            <StarsMobile rating={review.rating} />
          </div>
          <p className="text-[#505050] text-[12px]">{review.comment}</p>
        </div>
      ))}
    </div>
  );
}
