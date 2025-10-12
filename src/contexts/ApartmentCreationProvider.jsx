// contexts/ApartmentCreationProvider.jsx
import React, { useState, useEffect } from "react";
import { ApartmentCreationContext } from "./ApartmentCreationContext";

// Move the initial state outside
const getInitialApartmentData = () => {
  const saved = localStorage.getItem("apartmentDraft");
  return saved
    ? JSON.parse(saved)
    : {
        basicInfo: {},
        details: {},
        facilities: [],
        images: [],
        pricing: {},
        securityDeposit: {},
        houseRules: [],
        legalDocuments: {
          role: "",
          documents: [],
        },
        isEditing: false,
        existingApartmentId: null,
      };
};

// Only export the Provider component
const ApartmentCreationProvider = ({ children }) => {
  const [apartmentData, setApartmentData] = useState(getInitialApartmentData);
  const [currentStep, setCurrentStep] = useState(1);

  // Save to localStorage whenever apartmentData changes (excluding images)
  useEffect(() => {
    try {
      // Create a copy without images to prevent localStorage quota issues
      const { images: _images, ...dataWithoutImages } = apartmentData;
      localStorage.setItem("apartmentDraft", JSON.stringify(dataWithoutImages));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
      // If still failing, try to save only essential data
      try {
        const essentialData = {
          basicInfo: apartmentData.basicInfo,
          details: apartmentData.details,
          facilities: apartmentData.facilities,
          pricing: apartmentData.pricing,
          securityDeposit: apartmentData.securityDeposit,
          currentStep: currentStep,
        };
        localStorage.setItem("apartmentDraft", JSON.stringify(essentialData));
      } catch (fallbackError) {
        console.error("Fallback save also failed:", fallbackError);
      }
    }
  }, [apartmentData, currentStep]);

  const updateBasicInfo = (basicInfo) => {
    setApartmentData((prev) => ({
      ...prev,
      basicInfo: { ...prev.basicInfo, ...basicInfo },
    }));
  };

  const updateDetails = (details) => {
    setApartmentData((prev) => ({
      ...prev,
      details: { ...prev.details, ...details },
    }));
  };

  const updateFacilities = (facilities) => {
    setApartmentData((prev) => ({
      ...prev,
      facilities,
    }));
  };

  const updateImages = (images) => {
    setApartmentData((prev) => ({
      ...prev,
      images,
    }));
  };

  const updatePricing = (pricing) => {
    setApartmentData((prev) => ({
      ...prev,
      pricing: { ...prev.pricing, ...pricing },
    }));
  };

  const updateSecurityDeposit = (securityDeposit) => {
    setApartmentData((prev) => ({
      ...prev,
      securityDeposit: { ...prev.securityDeposit, ...securityDeposit },
    }));
  };

  const updateHouseRules = (houseRules) => {
    setApartmentData((prev) => ({
      ...prev,
      houseRules,
    }));
  };

  const updateLegalDocuments = (legalDocuments) => {
    setApartmentData((prev) => ({
      ...prev,
      legalDocuments,
    }));
  };

  const clearApartmentData = () => {
    setApartmentData({
      basicInfo: {},
      details: {},
      facilities: [],
      images: [],
      pricing: {},
      securityDeposit: {},
      houseRules: [],
      legalDocuments: {
        role: "",
        documents: [],
      },
      isEditing: false,
      existingApartmentId: null,
    });
    localStorage.removeItem("apartmentDraft");
    setCurrentStep(1);
  };

  // Helper method to enable editing mode and load existing apartment
  const loadExistingApartment = (apartmentId, apartmentData) => {
    setApartmentData({
      ...apartmentData,
      isEditing: true,
      existingApartmentId: apartmentId,
    });
    // Clear any existing draft since we're editing an existing apartment
    localStorage.removeItem("apartmentDraft");
  };

  // Helper method to check if we're in editing mode
  const isEditing = () => apartmentData.isEditing;

  const value = {
    apartmentData,
    currentStep,
    setCurrentStep,
    updateBasicInfo,
    updateDetails,
    updateFacilities,
    updateImages,
    updatePricing,
    updateSecurityDeposit,
    updateHouseRules,
    updateLegalDocuments,
    clearApartmentData,
    loadExistingApartment,
    isEditing,
  };

  return (
    <ApartmentCreationContext.Provider value={value}>
      {children}
    </ApartmentCreationContext.Provider>
  );
};

export default ApartmentCreationProvider;
