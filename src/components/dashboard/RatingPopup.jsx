import { useState } from "react";
import ShowSuccess from "../ShowSuccess";
import { createRating } from "../../services/userApi";

export default function RatingPopup({ onClose, apartmentId }) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
const [error, setError] = useState("");
const handleRateNow = async () => {
  if (rating === 0) {
    setError("Please select a rating");
    return;
  }

  setError("");
  
  try {
    setIsSubmitting(true);
    const result = await createRating(apartmentId, rating, feedback);
    
    if (result.success) {
      setShowSuccess(true);
    }
  } catch (error) {
    setError(error.message || "Failed to submit rating");
  } finally {
    setIsSubmitting(false);
  }
};
  return (
    <>
      {!showSuccess ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white px-2 rounded-[6px] shadow-lg w-[375px] h-[460px]">
            <h2 className="text-[15px] mx-auto w-[281px] mt-[37px] text-[#010814] font-medium  text-center mb-2">
              How would you rate your experience with the host and the
              apartment?
            </h2>
            <p className="text-[12px] text-[#354259] text-center mb-[30px]">
              Were you satisfied?
            </p>

            {/* Stars */}
            <div className="flex mx-6 gap-10 mb-[30px] justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  className={`cursor-pointer text-[30px] ${
                    star <= rating ? "text-[#FB9506]" : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>

            {/* Feedback */}
            <div>
              <label className="text-[12px] font-medium text-[#354259] block mb-1">
                Can you tell us more?
              </label>
              <textarea
                className="border rounded-[6.67px] w-[360px] h-[133.33px] text-[13.33px] p-3 focus:ring-2  focus:ring-purple-500 outline-none"
                rows="3"
                placeholder="Add feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              ></textarea>  
              {error && (
  <p className="text-red-500 text-[12px] mt-2 text-center">{error}</p>
)}
            </div>

            {/* Actions */}
            <div className="flex mt-[20px] justify-between gap-4">
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="w-1/2 py-2 border border-gray-300 rounded-[5px] text-gray-600 disabled:opacity-50"
              >
                Later
              </button>
              <button
                onClick={handleRateNow}
                disabled={isSubmitting || rating === 0}
                className="w-1/2 py-2 bg-[#A20BA2] text-white rounded-[5px] disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Rate Now"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <ShowSuccess
          image="/icons/Illustration.svg"
          heading="Thanks for the Review!"
          message="We appreciate your feedback. It helps keep the community informed and transparent."
          buttonText="Done"
          onClose={onClose}
          height="auto"
        />
      )}
    </>
  );
}