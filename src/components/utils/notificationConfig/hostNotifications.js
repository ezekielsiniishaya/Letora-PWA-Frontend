const hostNotificationConfigs = {
  PAYMENT_CONFIRMED: (notification) => ({
    image: "/icons/money.png",
    heading: "Payment Confirmed!!",
    message:
      notification.message ||
      "Your guest has completed payment for their booking. Review the details to prepare for their arrival.",
    buttonText: "See Dashboard",
    booking: true,
    imgHeight: "h-[60px]",
    width: "w-[60px]",
  }),
  CHECK_OUT: (notification) => ({
    image: "/icons/stopwatch.svg",
    heading: "Check-out Reminder",
    message:
      notification.message ||
      "It's check-out day. We hope you had a great stay at the property.",
    booking: true,
  }),
  GUEST_CHECKED_OUT: (notification) => ({
    image: "/icons/stopwatch.png",
    heading: "Guest Checked Out",
    message:
      notification.message ||
      "Your guest has successfully checked out of your apartment. You can now prepare the space for your next guest.",
    buttonText: "See Dashboard",
    width: "w-[60px]",
    imgHeight: "h-[60px]",
  }),
  GUEST_CHECKED_IN: (notification) => ({
    image: "/icons/success.svg",
    heading: "Guest Checked In",
    message:
      notification.message ||
      "Your guest has successfully checked into your apartment.",
    buttonText: "See Dashboard",
  }),
  APARTMENT_UPLOAD_SUCCESS: (notification) => ({
    image: "/icons/success.svg",
    heading: "Apartment Upload Successful!",
    message:
      notification.message ||
      "Your upload was successful. Your apartment is now visible to guests.",
    buttonText: "See Dashboard",
  }),
  APARTMENT_UPLOAD_FAILED: (notification) => ({
    image: "/icons/cancel-2.svg",
    heading: "Apartment Upload Failed",
    message:
      notification.message ||
      "We were unable to upload your apartment. Please ensure all required fields are filled correctly and try again.",
    buttonText: "Try Again",
  }),
  VERIFICATION_COMPLETE: (notification) => ({
    image: "/icons/correction.svg",
    heading: "Verification Complete",
    message:
      notification.message ||
      "You can now list your apartment, manage bookings, and start welcoming guests through Letora.",
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
  APARTMENT_POPULAR: (notification) => ({
    image: "/icons/trending.svg",
    heading: "Popular Choice",
    message:
      notification.message ||
      "Guests are loving your apartment. Check out the growing interest and potential bookings.",
    buttonText: "See Dashboard",
  }),
  WALLET_CREDITED: (notification) => ({
    image: "/icons/money.png",
    heading: "Wallet Credited",
    message:
      notification.message ||
      "Your wallet has been credited. The amount is now available for withdrawal.",
    buttonText: "See Revenue History",
    revenue: true,
    imgHeight: "h-[60px]",
    width: "w-[60px]",
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
  HOST_PAYMENT_PROCESSED: (notification) => ({
    image: "/icons/money.png",
    heading: "Wallet Debited",
    message:
      notification.message ||
      "Amount has been deducted from your wallet for service fees.",
    buttonText: "See Revenue History",
    revenue: true,
    imgHeight: "h-[60px]",
    width: "w-[60px]",
  }),
  AVAILABILITY_REQUEST: (notification) => ({
    image: "icons/success.svg",
    heading: "Availability Request",
    message:
      notification.message ||
      "A guest has requested availability for your apartment. Please confirm the dates.",
    buttonText: "Check Availability",
    booking: true,
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
  NEW_RATING: (notification) => ({
    image: "/icons/rating.svg",
    heading: "New Rating Received!",
    message:
      notification.message ||
      "A guest has rated your apartment. Check out their feedback and see how it affects your average rating.",
    buttonText: "See Dashboard",
  }),
  // In your notificationConfig file
  DEPOSIT_HOLD_APPROVED: (notification) => ({
    image: "/icons/lock.png",
    heading: "Deposit Hold Requested",
    message:
      notification.message ||
      "You have requested to hold an amount from the security deposit. This amount will be temporarily reserved.",
    buttonText: "View Details",
    revenue: true,
    imgHeight: "h-[60px]",
    width: "w-[60px]",
    // Add these to enable booking details navigation
    bookingId: notification.bookingId, // Make sure this is passed from the notification
    relatedId: notification.relatedId, // Fallback ID
    relatedType: notification.relatedType, // Should be "BOOKING"
  }),
  BOOKING_COMPLETED: (notification) => ({
    image: "/icons/success.svg",
    heading: "Booking Completed!",
    message:
      notification.message ||
      "A guest has successfully completed their stay. The security deposit will be processed accordingly.",
    buttonText: "See Booking Details",
    booking: true,
  }),
  REVIEW_REQUEST: (notification) => ({
    image: "/icons/rating.png",
    heading: "Rate & Review",
    message:
      notification.message ||
      "Share your thoughts on your recent stay so the host can improve and guests can make informed choices.",
    booking: true,
    imgHeight: "h-[60px]",
    width: "w-[60px]",
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
  BOOKING_ONGOING: (notification) => ({
    image: "/icons/clock.svg",
    heading: "Booking Ongoing",
    message:
      notification.message ||
      "A guest is currently staying at your apartment. The booking is in progress.",
    buttonText: "View Booking",
    booking: true,
  }),
  SECURITY_DEPOSIT_REFUNDED: (notification) => ({
    image: "/icons/lock.png",
    heading: "Security Deposit Refunded",
    message:
      notification.message ||
      "The security deposit has been refunded to the guest after successful check-out.",
    buttonText: "See Transaction History",
    revenue: true,
  }),
};

export default hostNotificationConfigs;
