import React, { useState, useCallback } from "react";
import { BookingContext } from "./BookingContext";

// Provider component
const BookingProvider = ({ children }) => {
  const [bookingData, setBookingData] = useState({
    apartmentId: null,
    apartmentPrice: 0,
    checkinDate: null,
    checkoutDate: null,
    duration: 0,
    bookingFee: 0,
    securityDeposit: 0,
    convenienceFee: 0,
    totalAmount: 0,
  });

  // Save apartment details
  const setApartmentDetails = useCallback(
    (apartmentId, apartmentPrice, securityDeposit = 0) => {
      if (!apartmentId || !apartmentPrice) {
        console.warn("Invalid apartment details provided");
        return;
      }

      setBookingData((prev) => ({
        ...prev,
        apartmentId,
        apartmentPrice,
        securityDeposit,
      }));
    },
    []
  );

  // Set booking dates and calculate duration with automatic fee calculation
  const setBookingDates = useCallback((checkinDate, checkoutDate) => {
    if (!checkinDate || !checkoutDate) return;

    const checkin = new Date(checkinDate);
    const checkout = new Date(checkoutDate);
    const duration = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));

    setBookingData((prev) => ({
      ...prev,
      checkinDate,
      checkoutDate,
      duration,
    }));
  }, []);

  // Calculate and set fees - FIXED: No dependencies to avoid loops
  const calculateFees = useCallback(() => {
    setBookingData((prev) => {
      const { apartmentPrice, duration, securityDeposit = 0 } = prev;

      if (!apartmentPrice || !duration || duration <= 0) {
        return prev;
      }

      const baseAmount = apartmentPrice * duration;
      const bookingFee = baseAmount; // apartment price per night x number of nights
      const convenienceFee = 2500; // Fixed ₦2500 convenience fee
      const totalAmount = bookingFee + convenienceFee + securityDeposit;

      return {
        ...prev,
        baseAmount,
        bookingFee,
        convenienceFee,
        totalAmount,
      };
    });
  }, []); // No dependencies - uses functional update

  // Update all booking data at once
  const updateBookingData = useCallback((newData) => {
    setBookingData((prev) => ({
      ...prev,
      ...newData,
    }));
  }, []);

  // Clear booking data
  const clearBookingData = useCallback(() => {
    setBookingData({
      apartmentId: null,
      apartmentPrice: 0,
      checkinDate: null,
      checkoutDate: null,
      duration: 0,
      bookingFee: 0,
      securityDeposit: 0,
      convenienceFee: 0,
      totalAmount: 0,
    });
  }, []);

  // Get booking summary
  const getBookingSummary = useCallback(() => {
    const {
      apartmentPrice,
      duration,
      bookingFee,
      securityDeposit,
      convenienceFee,
      totalAmount,
      baseAmount,
    } = bookingData;

    return {
      baseAmount: baseAmount || apartmentPrice * duration,
      bookingFee,
      securityDeposit,
      convenienceFee,
      totalAmount,
      duration,
      pricePerNight: apartmentPrice,
    };
  }, [bookingData]);

  const value = {
    bookingData,
    setApartmentDetails,
    setBookingDates,
    calculateFees,
    updateBookingData,
    clearBookingData,
    getBookingSummary,
  };

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
};

export default BookingProvider;
