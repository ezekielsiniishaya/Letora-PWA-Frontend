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
    try {
      const safeData = {
        ...hostProfileData,
        verificationDocuments: hostProfileData.verificationDocuments.map(
          (doc) => {
            let safeDoc = { ...doc };
            if (safeDoc.base64) {
              // Keep base64 in memory, not in localStorage
              delete safeDoc.base64;
            }
            return safeDoc;
          }
        ),
      };

      localStorage.setItem("hostProfileDraft", JSON.stringify(safeData));
    } catch (err) {
      console.error("Error saving to localStorage:", err);
    }
  }, [hostProfileData]);

  // Banking Information
  const updateBankingInfo = (bankingInfo) => {
    setHostProfileData((prev) => ({
      ...prev,
      bankingInfo: { ...prev.bankingInfo, ...bankingInfo },
    }));
  };
  useEffect(() => {
    const saved = localStorage.getItem("hostProfileDraft");
    if (saved) {
      const parsed = JSON.parse(saved);

      setHostProfileData((prev) => {
        // ✅ Only load from storage if there's no verification data yet
        if (!prev.verificationDocuments?.length) {
          return parsed;
        }
        return prev; // don’t overwrite
      });
    }
  }, []);

  // Verification Documents
  const updateVerificationDocuments = (documents) => {
    setHostProfileData((prev) => ({
      ...prev,
      verificationDocuments: documents,
    }));
  };

  const addVerificationDocument = (document, { replace = false } = {}) => {
    setHostProfileData((prev) => {
      let updatedDocs = [...prev.verificationDocuments];

      if (replace) {
        // Normalize both sides to be safe against case or spacing mismatches
        const normalizedType = document.type?.toUpperCase().trim();
        updatedDocs = updatedDocs.filter(
          (doc) => doc.type?.toUpperCase().trim() !== normalizedType
        );
      }

      // Add (or replace) document
      updatedDocs.push(document);

      return {
        ...prev,
        verificationDocuments: updatedDocs,
      };
    });
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
