// contexts/HostProfileProvider.jsx
import React, { useState, useEffect } from "react";
import { HostProfileContext } from "./HostProfileContext";

const getInitialHostProfileData = () => {
  const saved = localStorage.getItem("hostProfileDraft");
  return saved
    ? JSON.parse(saved)
    : {
        bankingInfo: {
          bankName: "",
          accountNo: "",
          accountBalance: 0,
        },
        verificationDocuments: [],
      };
};

const HostProfileProvider = ({ children }) => {
  const [hostProfileData, setHostProfileData] = useState(
    getInitialHostProfileData
  );
  const [currentStep, setCurrentStep] = useState(1);

  // Save to localStorage whenever hostProfileData changes
  useEffect(() => {
    localStorage.setItem("hostProfileDraft", JSON.stringify(hostProfileData));
  }, [hostProfileData]);

  // Banking Information
  const updateBankingInfo = (bankingInfo) => {
    setHostProfileData((prev) => ({
      ...prev,
      bankingInfo: { ...prev.bankingInfo, ...bankingInfo },
    }));
  };

  // Verification Documents
  const updateVerificationDocuments = (documents) => {
    setHostProfileData((prev) => ({
      ...prev,
      verificationDocuments: documents,
    }));
  };

  const addVerificationDocument = (document) => {
    setHostProfileData((prev) => ({
      ...prev,
      verificationDocuments: [...prev.verificationDocuments, document],
    }));
  };

  const removeVerificationDocument = (documentId) => {
    setHostProfileData((prev) => ({
      ...prev,
      verificationDocuments: prev.verificationDocuments.filter(
        (doc) => doc.id !== documentId
      ),
    }));
  };

  const updateVerificationDocument = (documentId, updates) => {
    setHostProfileData((prev) => ({
      ...prev,
      verificationDocuments: prev.verificationDocuments.map((doc) =>
        doc.id === documentId ? { ...doc, ...updates } : doc
      ),
    }));
  };

  // Clear all data
  const clearHostProfileData = () => {
    setHostProfileData({
      bankingInfo: {
        bankName: "",
        accountNo: "",
        accountBalance: 0,
      },
      verificationDocuments: [],
    });
    localStorage.removeItem("hostProfileDraft");
    setCurrentStep(1);
  };

  const value = {
    hostProfileData,
    currentStep,
    setCurrentStep,
    updateBankingInfo,
    updateVerificationDocuments,
    addVerificationDocument,
    removeVerificationDocument,
    updateVerificationDocument,
    clearHostProfileData,
  };

  return (
    <HostProfileContext.Provider value={value}>
      {children}
    </HostProfileContext.Provider>
  );
};

export default HostProfileProvider;
