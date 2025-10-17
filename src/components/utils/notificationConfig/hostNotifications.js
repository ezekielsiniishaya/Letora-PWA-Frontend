const hostNotificationConfigs = {
  PAYMENT_CONFIRMED: {
    image: "/icons/money-2.svg",
    heading: "Payment Confirmed!!",
    message:
      "Your guest has completed payment for their booking. Review the details to prepare for their arrival.",
    buttonText: "See Dashboard",
    booking: true,
  },
  GUEST_CHECKED_OUT: {
    image: "/icons/stopwatch.svg",
    heading: "Guest Checked Out",
    message:
      "Your guest has successfully checked out of your apartment. You can now prepare the space for your next guest.",
    buttonText: "See Dashboard",
  },
  GUEST_CHECKED_IN: {
    image: "/icons/success.svg",
    heading: "Guest Checked In",
    message: "Your guest has successfully checked into your apartment.",
    buttonText: "See Dashboard",
  },
  APARTMENT_UPLOAD_SUCCESS: {
    image: "/icons/success.svg",
    heading: "Apartment Upload Successful!",
    message:
      "Your upload was successful. Your apartment is now visible to guests.",
    buttonText: "See Dashboard",
  },
  APARTMENT_UPLOAD_FAILED: {
    image: "/icons/cancel-2.svg",
    heading: "Apartment Upload Failed",
    message:
      "We were unable to upload your apartment. Please ensure all required fields are filled correctly and try again.",
    buttonText: "Try Again",
  },
  VERIFICATION_COMPLETE: {
    image: "/icons/correction.svg",
    heading: "Verification Complete",
    message:
      "You can now list your apartment, manage bookings, and start welcoming guests through Letora.",
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
    heading: "Cancelled Booking!",
    message:
      "Your booking has been cancelled. Refunds will be issued as outlined in our Guest Refund Policy.",
    buttonText: "See Bookings",
    booking: true,
  },
  APARTMENT_POPULAR: {
    image: "/icons/trending.svg",
    heading: "Popular Choice",
    message:
      "Guests are loving your apartment. Check out the growing interest and potential bookings.",
    buttonText: "See Dashboard",
  },
  WALLET_CREDITED: {
    image: "/icons/money-2.svg",
    heading: "Wallet Credited",
    message:
      "Your wallet has been credited. The amount is now available for withdrawal.",
    buttonText: "See Revenue History",
    revenue: true,
  },
  WALLET_DEBITED: {
    image: "/icons/money-2.svg",
    heading: "Wallet Debited",
    message: "Amount has been deducted from your wallet for service fees.",
    buttonText: "See Revenue History",
    revenue: true,
  },
  AVAILABILITY_REQUEST: {
    image: "/icons/calendar.svg",
    heading: "Availability Request",
    message:
      "A guest has requested availability for your apartment. Please confirm the dates.",
    buttonText: "Check Availability",
    booking: true,
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
  NEW_RATING: {
  image: "/icons/rating.svg", 
  heading: "New Rating Received!",
  message: "A guest has rated your apartment. Check out their feedback and see how it affects your average rating.",
  buttonText: "See Dashboard", 
},
};

export default hostNotificationConfigs;
