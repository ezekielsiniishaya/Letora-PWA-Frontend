// contexts/GuestDocumentsContext.jsx
import React, { useState, useCallback } from "react";
import { GuestDocumentContext } from "./GuestDocumentContext";

// Provider component
const GuestDocumentProvider = ({ children }) => {
  const [documents, setDocuments] = useState({
    idCard: null,
    idPhotograph: null,
  });

  // Add document to context
  const addDocument = useCallback((type, file) => {
    setDocuments((prev) => ({
      ...prev,
      [type]: file, // Store the actual File object directly
    }));
  }, []);

  // Remove document from context
  const removeDocument = useCallback((type) => {
    setDocuments((prev) => ({
      ...prev,
      [type]: null,
    }));
  }, []);

  // Clear all documents
  const clearDocuments = useCallback(() => {
    setDocuments({
      idCard: null,
      idPhotograph: null,
    });
  }, []);

  // Check if all required documents are uploaded
  const hasAllDocuments = useCallback(() => {
    return !!(documents.idCard && documents.idPhotograph); // Force boolean conversion
  }, [documents]);
  // Get document status
  const getDocumentStatus = useCallback(() => {
    return {
      hasIdCard: !!documents.idCard,
      hasIdPhotograph: !!documents.idPhotograph,
      hasAllDocuments: hasAllDocuments(),
      documents,
    };
  }, [documents, hasAllDocuments]);

  const value = {
    documents,
    addDocument,
    removeDocument,
    clearDocuments,
    hasAllDocuments,
    getDocumentStatus,
  };

  return (
    <GuestDocumentContext.Provider value={value}>
      {children}
    </GuestDocumentContext.Provider>
  );
};

export default GuestDocumentProvider;
