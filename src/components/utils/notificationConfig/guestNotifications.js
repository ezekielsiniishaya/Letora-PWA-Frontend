const guestNotificationConfigs = {
  PAYMENT_CONFIRMED: {
    image: "/icons/money-2.svg",
    heading: "Payment Received!!!",
    message:
      "Your payment for the apartment has been received. We've sent your booking details to the host.",
    buttonText: "See Booking Details",
    booking: true,
  },
  BOOKING_CONFIRMED: {
    image: "/icons/firework.svg",
    heading: "Successful Booking!!!",
    message:
      "Well done, your stay at the apartment is locked in. Check your booking details anytime in your dashboard.",
    buttonText: "See Booking Details",
    booking: true,
  },
  GUEST_CHECKED_OUT: {
    image: "/icons/stopwatch.svg",
    heading: "Check-out Reminder",
    message:
      "It's check-out day. We hope you had a great stay at the property.",
    buttonText: "See Booking Details",
    booking: true,
  },
  GUEST_CHECKED_IN: {
    image: "/icons/success.svg",
    heading: "Check-in Successful",
    message:
      "You have successfully checked into your apartment. Enjoy your stay!",
    buttonText: "See Booking Details",
    booking: true,
  },
  VERIFICATION_COMPLETE: {
    image: "/icons/correction.svg",
    heading: "Verification Complete",
    message:
      "Your account verification is complete. You can now book apartments and manage your profile.",
    buttonText: "See Dashboard",
  },
  VERIFICATION_FAILED: {
    image: "/icons/rejected.svg",
    heading: "Verification Failed",
    message:
      "We couldn't verify your account. Please update your details or upload clearer documents to proceed.",
    buttonText: "Update Details",
  },
  BOOKING_CANCELLED: {
    image: "/icons/cancelled.svg",
    heading: "Booking Cancelled",
    message:
      "Your booking has been cancelled. Refunds will be issued as outlined in our Guest Refund Policy.",
    buttonText: "See Bookings",
    booking: true,
  },
  REVIEW_REQUEST: {
    image: "/icons/rating.svg",
    heading: "Rate & Review",
    message:
      "How was your stay? Share your thoughts to help the host improve and inform other guests.",
    buttonText: "Write Review",
    booking: true,
  },
  AVAILABILITY_REQUEST_SENT: {
    image: "/icons/calendar.svg",
    heading: "Availability Request Sent",
    message:
      "Your availability request has been sent to the host. You'll be notified when they respond.",
    buttonText: "See Requests",
    booking: true,
  },
  AVAILABILITY_CONFIRMED: {
    image: "/icons/success.svg",
    heading: "Availability Confirmed",
    message:
      "The host has confirmed your requested dates are available. You can now proceed with booking.",
    buttonText: "Book Now",
    booking: true,
  },
  AVAILABILITY_DENIED: {
    image: "/icons/cancel-2.svg",
    heading: "Dates Not Available",
    message:
      "The host has indicated your requested dates are not available. Please try different dates.",
    buttonText: "Search Again",
  },
  SYSTEM_ALERT: {
    image: "/icons/info.svg",
    heading: "System Alert",
    message: "Important system update or announcement.",
    buttonText: "See Details",
  },
  PROMOTIONAL: {
    image: "/icons/promotion.svg",
    heading: "Special Offer",
    message: "Check out our latest promotions and special offers.",
    buttonText: "View Offers",
  },
};
export default guestNotificationConfigs;
