// RatingPopup.jsx
import { useState } from "react";
import ShowSuccess from "../ShowSuccess";
import Alert from "../utils/Alerts"; // Import your Alert component
import { createRating } from "../../services/userApi";

export default function RatingPopup({ onClose, apartmentId, bookingId }) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "error",
  });

  const showAlert = (message, type = "error") => {
    setAlert({ show: true, message, type });
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "error" });
    }, 5000);
  };

  const handleRateNow = async () => {
    if (rating === 0) {
      showAlert("Please select a rating", "error");
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await createRating(
        apartmentId,
        rating,
        feedback,
        bookingId
      );

      if (result.success) {
        setShowSuccess(true);
      } else {
        showAlert(result.message || "Failed to submit rating", "error");
      }
    } catch (error) {
      const errorMessage = error.message || "Failed to submit rating";
      showAlert(errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {!showSuccess ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white px-2 rounded-[6px] shadow-lg w-[375px] h-[460px] relative">
            {/* Alert Container - Inside the popup at the top */}
            {alert.show && (
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10 w-[340px]">
                <Alert
                  type={alert.type}
                  message={alert.message}
                  onDismiss={() =>
                    setAlert({ show: false, message: "", type: "error" })
                  }
                  timeout={5000}
                />
              </div>
            )}

            <h2 className="text-[15px] mx-auto w-[281px] mt-[37px] text-[#010814] font-medium text-center mb-2">
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
                className="border rounded-[6.67px] w-[360px] h-[133.33px] text-[13.33px] p-3 focus:ring-2 focus:ring-purple-500 outline-none"
                rows="3"
                placeholder="Add feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              ></textarea>
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
