import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  const navigate = useNavigate();
  const location = useLocation();
  const hasHydrated = useRef(false);

  const { apartmentData, updateLegalDocuments } = useApartmentCreation();

  const hostTypeOptions = useMemo(
    () => [
      { value: "LANDLORD", label: "Landlord" },
      { value: "TENANT", label: "Tenant" },
      { value: "AGENT", label: "Agent" },
    ],
    []
  );

  // 🔹 FIXED: Proper hydration without circular dependencies
  const hydrateFromState = useCallback(() => {
    if (hasHydrated.current) return;

    console.log("=== HYDRATION START ===");
    console.log("Navigation state:", location.state);
    console.log("Apartment legalDocuments:", apartmentData.legalDocuments);

    let roleToSet = null;
    let filesToSet = {};

    // Priority 1: Navigation state
    if (location.state?.role) {
      roleToSet = hostTypeOptions.find(
        (opt) => opt.value === location.state.role
      );
      console.log("Role from navigation:", roleToSet);
    }

    if (location.state?.documents) {
      location.state.documents.forEach((doc) => {
        const fieldName = doc.documentType.toLowerCase();
        filesToSet[fieldName] = {
          name: doc.name,
          data: doc.data,
          type: doc.type,
        };
      });
      console.log("Files from navigation:", filesToSet);
    }

    // Priority 2: Extract from apartment legalDocuments
    if (!roleToSet && apartmentData.legalDocuments) {
      // Get role from the legalDocuments object or first document
      const documentRole =
        apartmentData.legalDocuments.role ||
        apartmentData.legalDocuments.documents?.[0]?.role;

      roleToSet = hostTypeOptions.find((opt) => opt.value === documentRole);
      console.log("Role from legalDocuments:", roleToSet);

      // Restore files from legalDocuments
      if (apartmentData.legalDocuments.documents) {
        apartmentData.legalDocuments.documents.forEach((doc) => {
          const fieldName = doc.documentType.toLowerCase();
          filesToSet[fieldName] = {
            name: doc.name,
            data: doc.data || doc.url,
            type: doc.type || "application/pdf",
          };
        });
        console.log("Files from legalDocuments:", filesToSet);
      }
    }

    // Apply the hydrated state
    if (roleToSet) {
      setSelectedRole(roleToSet);
    }
    if (Object.keys(filesToSet).length > 0) {
      setFiles(filesToSet);
    }

    hasHydrated.current = true;
    console.log("=== HYDRATION COMPLETE ===");
  }, [location.state, apartmentData.legalDocuments, hostTypeOptions]);

  useEffect(() => {
    console.log("Running hydration...");
    hydrateFromState();
  }, [hydrateFromState]);

  // Reset hydration when legal documents change
  useEffect(() => {
    hasHydrated.current = false;
    console.log("Legal documents changed, resetting hydration");
  }, [
    apartmentData.legalDocuments?.documents?.length,
    apartmentData.legalDocuments?.role,
  ]);

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
    setError(""); // Clear error when file is selected
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
    } else {
      setSelectedRole(role);
    }
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
    const requiredFields = getRequiredFields();
    const missingFields = requiredFields.filter((field) => !files[field]);

    if (missingFields.length > 0) {
      setError(`Please upload all required documents`);
      return false;
    }

    const uploadedFiles = Object.values(files).filter(Boolean);
    if (uploadedFiles.length === 0) {
      setError("Please select at least one document");
      return false;
    }

    return true;
  };

  const mapFieldToDocumentType = (fieldName) => {
    const fieldMap = {
      proof_of_ownership: "PROOF_OF_OWNERSHIP",
      utility_bill: "UTILITY_BILL",
      tenancy_agreement: "TENANCY_AGREEMENT",
      authorization_document: "AUTHORIZATION_DOCUMENT",
      professional_license: "PROFESSIONAL_LICENSE",
      consent_letter: "CONSENT_LETTER",
    };

    return fieldMap[fieldName] || "UTILITY_BILL";
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedRole) {
      setError("Please select your host type");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Prepare documents for context
      const legalDocuments = Object.entries(files).map(([field, file]) => ({
        documentType: mapFieldToDocumentType(field),
        name: file.name,
        type: file.type,
        data: file.data, // base64 encoded string
        role: selectedRole.value, // Make sure role is included
      }));

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
        return <LandlordForm files={files} onFileChange={handleFileChange} />;
      case "TENANT":
        return <TenantForm files={files} onFileChange={handleFileChange} />;
      case "AGENT":
        return <AgentForm files={files} onFileChange={handleFileChange} />;
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

        <form
          className="mt-[35px] flex flex-col space-y-8"
          onSubmit={handleSubmit}
        >
          {/* Host Type Dropdown */}
          <Dropdown
            label="What type of host are you?"
            placeholder="Choose option"
            options={hostTypeOptions}
            required={true}
            heading="Choose who you are"
            isOpen={isDropdownOpen}
            onToggle={() => setIsDropdownOpen(!isDropdownOpen)}
            selected={selectedRole}
            setSelected={handleRoleSelect}
            multiple={false}
          />

          {/* Dynamic Form based on selection */}
          {selectedRole && renderForm()}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

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
