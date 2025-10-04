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
        legalDocuments: [],
      };
};

// Only export the Provider component
const ApartmentCreationProvider = ({ children }) => {
  const [apartmentData, setApartmentData] = useState(getInitialApartmentData);
  const [currentStep, setCurrentStep] = useState(1);

  // Save to localStorage whenever apartmentData changes
  useEffect(() => {
    localStorage.setItem("apartmentDraft", JSON.stringify(apartmentData));
  }, [apartmentData]);

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
      legalDocuments: [],
    });
    localStorage.removeItem("apartmentDraft");
    setCurrentStep(1);
  };

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
  };

  return (
    <ApartmentCreationContext.Provider value={value}>
      {children}
    </ApartmentCreationContext.Provider>
  );
};

export default ApartmentCreationProvider;
