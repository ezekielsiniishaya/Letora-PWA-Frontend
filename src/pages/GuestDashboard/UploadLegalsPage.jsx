import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Dropdown from "../../components/dashboard/Dropdown";
import LandlordForm from "./LandlordForm";
import TenantForm from "./TenantForm";
import AgentForm from "./AgentForm";
import { useApartmentCreation } from "../../hooks/useApartmentCreation";

export default function UploadLegalsPage() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  const { apartmentData, updateLegalDocuments } = useApartmentCreation();

  const hostTypeOptions = useMemo(
    () => [
      { value: "LANDLORD", label: "Landlord" },
      { value: "TENANT", label: "Tenant" },
      { value: "AGENT", label: "Agent" },
    ],
    []
  );

  // Helper function to map documentType back to field name
  const getFieldFromDocumentType = (documentType) => {
    const reverseMap = {
      PROOF_OF_OWNERSHIP: "proof_of_ownership",
      UTILITY_BILL: "utility_bill",
      TENANCY_AGREEMENT: "tenancy_agreement",
      AUTHORIZATION_DOCUMENT: "authorization_document",
      PROFESSIONAL_LICENSE: "professional_license",
      CONSENT_LETTER: "consent_letter",
    };
    return reverseMap[documentType] || documentType.toLowerCase();
  };

  // 🔹 FIXED: Reset and hydrate on every mount
  useEffect(() => {
    console.log("=== RESETTING AND HYDRATING ===");
    console.log("Apartment legalDocuments:", apartmentData.legalDocuments);

    // Reset local state first
    setSelectedRole(null);
    setFiles({});

    // Then hydrate from context
    if (
      apartmentData.legalDocuments &&
      apartmentData.legalDocuments.documents
    ) {
      const { role, documents } = apartmentData.legalDocuments;

      // Set role
      if (role) {
        const roleOption = hostTypeOptions.find((opt) => opt.value === role);
        if (roleOption) {
          setSelectedRole(roleOption);
          console.log("Setting role from context:", role);
        }
      }

      // Set files - FIXED: Use reverse mapping
      if (documents.length > 0) {
        const filesToSet = {};
        documents.forEach((doc) => {
          // Use reverse mapping to get the correct field name
          const fieldName = getFieldFromDocumentType(doc.documentType);
          filesToSet[fieldName] = {
            name: doc.name,
            data: doc.data,
            type: doc.type || "application/pdf",
          };
          console.log(`Mapping ${doc.documentType} to field: ${fieldName}`);
        });
        setFiles(filesToSet);
        console.log("Setting files from context:", filesToSet);
      }
    }
  }, [apartmentData.legalDocuments, hostTypeOptions]);

  // Debug useEffect
  useEffect(() => {
    console.log("Selected role updated:", selectedRole);
  }, [selectedRole]);

  useEffect(() => {
    console.log("Files updated:", files);
  }, [files]);

  const handleFileChange = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const base64 = await fileToBase64(file);
    setFiles((prev) => ({
      ...prev,
      [field]: { name: file.name, data: base64, type: file.type },
    }));
    // Clear field error when file is selected
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }
    // Clear general error
    setError("");
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleRoleSelect = (role) => {
    console.log("Role selected:", role);
    if (selectedRole?.value !== role.value) {
      setSelectedRole(role);
      setFiles({});
      setFieldErrors({});
    } else {
      setSelectedRole(role);
    }
    // Clear errors when role is selected
    setFieldErrors((prev) => ({ ...prev, role: "" }));
    setError("");
  };

  const getRequiredFields = () => {
    switch (selectedRole?.value) {
      case "LANDLORD":
        return ["proof_of_ownership", "utility_bill"];
      case "TENANT":
        return ["tenancy_agreement", "utility_bill", "authorization_document"];
      case "AGENT":
        return [
          "professional_license",
          "utility_bill",
          "authorization_document",
        ];
      default:
        return [];
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Check role selection
    if (!selectedRole) {
      newErrors.role = "Please select your host type";
    }

    // Check required files
    const requiredFields = getRequiredFields();
    requiredFields.forEach((field) => {
      if (!files[field]) {
        newErrors[field] = "This document is required";
      }
    });

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // FIXED: This is the only mapFieldToDocumentType function you need
  const mapFieldToDocumentType = (fieldName) => {
    // Direct mapping - no default fallback to UTILITY_BILL
    if (fieldName === "proof_of_ownership") return "PROOF_OF_OWNERSHIP";
    if (fieldName === "utility_bill") return "UTILITY_BILL";
    if (fieldName === "tenancy_agreement") return "TENANCY_AGREEMENT";
    if (fieldName === "authorization_document") return "AUTHORIZATION_DOCUMENT";
    if (fieldName === "professional_license") return "PROFESSIONAL_LICENSE";
    if (fieldName === "consent_letter") return "CONSENT_LETTER";

    // If field doesn't match, convert to uppercase with underscores
    return fieldName.toUpperCase().replace(/\s+/g, "_");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      // Validate form
      const isValid = validateForm();
      if (!isValid) {
        console.log("Validation errors:", fieldErrors);
        setLoading(false);
        return;
      }

      // Prepare documents for context
      const legalDocuments = Object.entries(files).map(([field, file]) => {
        const docType = mapFieldToDocumentType(field);
        console.log(`Mapping field "${field}" to documentType: "${docType}"`);
        
        return {
          documentType: docType,
          name: file.name,
          type: file.type,
          data: file.data,
        };
      });

      console.log("Saving to context:", {
        role: selectedRole.value,
        documents: legalDocuments,
      });

      // Save role + documents to context
      updateLegalDocuments({
        role: selectedRole.value,
        documents: legalDocuments,
      });

      // Navigate to final overview
      navigate("/listing-overview");
    } catch (err) {
      console.error("Error saving legal documents:", err);
      setError("An error occurred while saving documents");
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    switch (selectedRole?.value) {
      case "LANDLORD":
        return (
          <LandlordForm
            files={files}
            onFileChange={handleFileChange}
            fieldErrors={fieldErrors}
          />
        );
      case "TENANT":
        return (
          <TenantForm
            files={files}
            onFileChange={handleFileChange}
            fieldErrors={fieldErrors}
          />
        );
      case "AGENT":
        return (
          <AgentForm
            files={files}
            onFileChange={handleFileChange}
            fieldErrors={fieldErrors}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#F9F9F9] px-[20px]">
      {/* Header */}
      <div className="w-full flex items-center justify-between mt-[20px]">
        <button onClick={() => navigate(-1)}>
          <img src="/icons/arrow-left.svg" alt="Back" className="w-5 h-4" />
        </button>
        <span className="text-[13.2px] font-medium bg-[#A20BA2] text-white px-[6.6px] w-[33px] h-[18.43px] rounded-[7.92px]">
          8/8
        </span>
      </div>

      {/* Content */}
      <div className="w-full max-w-sm mt-[26px]">
        <h2 className="text-[24px] font-medium text-[#0D1321]">Legals</h2>
        <p className="text-[14px] text-[#666666] mt-[4px]">
          Your paperwork, our partnership
        </p>

        {/* Error Message */}
        {error && (
          <div className="mt-4 mx-4">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              <div className="flex items-center">
                <img
                  src="/icons/error.svg"
                  alt="Error"
                  className="w-4 h-4 mr-2"
                />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          </div>
        )}

        <form
          className="mt-[35px] flex flex-col space-y-8"
          onSubmit={handleSubmit}
          noValidate
        >
          {/* Host Type Dropdown */}
          <div>
            <Dropdown
              label="What type of host are you?"
              placeholder="Choose option"
              options={hostTypeOptions}
              heading="Choose who you are"
              isOpen={isDropdownOpen}
              onToggle={() => setIsDropdownOpen(!isDropdownOpen)}
              selected={selectedRole}
              setSelected={handleRoleSelect}
              multiple={false}
            />
            {fieldErrors.role && (
              <p className="text-[#F81A0C] text-[10px] mt-1">
                {fieldErrors.role}
              </p>
            )}
          </div>

          {/* Dynamic Form based on selection */}
          {selectedRole && renderForm()}

          {/* Next Button */}
          {selectedRole && (
            <div className="pt-[50px] pb-20">
              <Button
                text={loading ? "Saving..." : "Next"}
                type="submit"
                disabled={loading}
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
}