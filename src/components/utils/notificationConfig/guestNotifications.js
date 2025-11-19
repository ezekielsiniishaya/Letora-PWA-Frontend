const guestNotificationConfigs = {
  PAYMENT_CONFIRMED: (notification) => ({
    image: "/icons/money-2.svg",
    heading: "Payment Received",
    message:
      notification.message ||
      "Your payment for the apartment has been received. We've sent your booking details to the host.",
    booking: true,
    showButton: false, // Hide button for payment confirmed
  }),
  BOOKING_CONFIRMED: (notification) => ({
    image: "/icons/firework.svg",
    heading: "Successful Booking!!!",
    message:
      notification.message ||
      "Well done, your stay at the apartment is locked in. Check your booking details anytime in your dashboard.",
    buttonText: "See Booking Details",
    booking: true,
  }),
  GUEST_CHECKED_OUT: (notification) => ({
    image: "/icons/stopwatch.svg",
    heading: "Check-out Reminder",
    message:
      notification.message ||
      "It's check-out day. We hope you had a great stay at the property.",
    booking: true,
  }),
  GUEST_CHECKED_IN: (notification) => ({
    image: "/icons/success.svg",
    heading: "Check-in Successful",
    message:
      notification.message ||
      "You have successfully checked into your apartment. Enjoy your stay!",
    buttonText: "See Booking Details",
    booking: true,
  }),
  VERIFICATION_COMPLETE: (notification) => ({
    image: "/icons/correction.svg",
    heading: "Verification Complete",
    message:
      notification.message ||
      "Your account verification is complete. You can now book apartments and manage your profile.",
    buttonText: "See Dashboard",
  }),
  VERIFICATION_FAILED: (notification) => ({
    image: "/icons/rejected.svg",
    heading: "Verification Failed",
    message:
      notification.message ||
      "We couldn't verify your account. Please update your details or upload clearer documents to proceed.",
    buttonText: "Update Details",
  }),
  BOOKING_CANCELLED: (notification) => ({
    image: "/icons/cancelled.png",
    heading: "Cancelled Booking!",
    message:
      notification.message ||
      "Your booking has been cancelled. Refunds will be issued as outlined in our Guest Refund Policy.",
    booking: true,
    imgHeight: "h-[60px]",
    width: "w-[60px]",
  }),
  REVIEW_REQUEST: (notification) => ({
    image: "/icons/rating.svg",
    heading: "Rate & Review",
    message:
      notification.message ||
      "How was your stay? Share your thoughts to help the host improve and inform other guests.",
    buttonText: "Write Review",
    booking: true,
  }),
  AVAILABILITY_REQUEST_SENT: (notification) => ({
    image: "/icons/calendar.svg",
    heading: "Availability Request Sent",
    message:
      notification.message ||
      "Your availability request has been sent to the host. You'll be notified when they respond.",
    buttonText: "See Requests",
    booking: true,
  }),
  AVAILABILITY_CONFIRMED: (notification) => ({
    image: "/icons/firework.svg",
    heading: "Availability Confirmed",
    message:
      notification.message ||
      "The host has confirmed the availability of your choiced apartment for short-stay. Please proceed to book and make payments",
    buttonText: "Book Now",
    booking: true,
    apartmentId: notification.metadata?.apartmentId,
  }),
  AVAILABILITY_REJECTED: (notification) => ({
    image: "/icons/error.png",
    heading: "Availability Declined",
    message: notification.message,
    buttonText: "Browse Around",
    booking: false,
    apartmentId: notification.metadata?.apartmentId,
    imgHeight: "h-[60px]",
    width: "w-[60px]",
  }),
  AVAILABILITY_DENIED: (notification) => ({
    image: "/icons/cancel-2.svg",
    heading: "Dates Not Available",
    message:
      notification.message ||
      "The host has indicated your requested dates are not available. Please try different dates.",
    buttonText: "Search Again",
  }),
  SYSTEM_ALERT: (notification) => ({
    image: "/icons/info.svg",
    heading: "System Alert",
    message: notification.message || "Important system update or announcement.",
    buttonText: "See Details",
  }),
  PROMOTIONAL: (notification) => ({
    image: "/icons/promotion.svg",
    heading: "Special Offer",
    message:
      notification.message ||
      "Check out our latest promotions and special offers.",
    buttonText: "View Offers",
  }),
};

export default guestNotificationConfigs;
