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

export default function Reviews({ count = 10 }) {
  const review = {
    author: "Seun",
    date: "07-June-2025",
    content:
      "I could write a long note about this seller, due to i'm limited to 500 text I'II keep it short. She's incredible, very professional and knows how to handle business. Top notch to her a. Wonderful experience, successful & peaceful trade carried out.",
    avatar: "/images/review_guest.jpg",
    rating: 4,
  };

  const reviewsArray = Array(count)
    .fill(review)
    .map((item, index) => ({
      ...item,
      id: index + 1,
    }));

  return (
    <div className="mx-auto space-y-[10px] mt-2 w-full">
      {reviewsArray.map(({ id, author, date, content, avatar, rating }) => (
        <div key={id} className="bg-white">
          <div className="flex justify-between items-start mb-[10px]">
            <div className="flex gap-[9px] items-center">
              <img
                src={avatar}
                alt={author}
                className="w-[30px] h-[30px] rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-[13px] text-[#333333]">
                  {author}
                </h3>
                <p className="text-[#56575B] text-[10px]">{date}</p>
              </div>
            </div>
            <StarsMobile rating={rating} />
          </div>
          <p className="text-[#505050] text-[12px]">{content}</p>
        </div>
      ))}
    </div>
  );
}
