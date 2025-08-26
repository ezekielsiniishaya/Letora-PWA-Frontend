import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SplashWithOnboarding from "./pages/OnboardingPage/SplashWithOnboarding";
import ChooseType from "./pages/OnboardingPage/ChooseType";
import GeneralSignIn from "./pages/AuthPages/GeneralSignIn";
import GuestSignUp from "./pages/AuthPages/GuestSignUp";
import VerifyEmail from "./components/auth/VerifyEmail";
import CreatePassword from "./components/auth/CreatePassword";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import HostSignUp from "./pages/AuthPages/HostSignUp";
import IdentityId from "./pages/HostIdentificationPages/IdentityID";
import IdentityWithPictureInfo from "./pages/HostIdentificationPages/IdentityWithPictureInfo";
import IdentitySelfie from "./pages/HostIdentificationPages/IndentitySelfie";
import AddBankDetails from "./pages/HostIdentificationPages/AddBankDetails";
import GuestDashboard from "./pages/GuestDashboard/GuestDashboard";
import ApartmentsPage from "./components/dashboard/ApartmentsPage";
import TermsPage from "./pages/StaticPages/TermsPage";
import PrivacyPage from "./pages/StaticPages/PrivacyPage";
import SearchPage from "./components/dashboard/SearchPage";
import FilterPage from "./components/dashboard/FilterPage";
import FilteredSearchPage from "./components/dashboard/FilteredSearchPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Combined splash + onboarding route */}
        <Route path="/" element={<SplashWithOnboarding />} />
        <Route path="/choose-type" element={<ChooseType />} />
        <Route path="/sign-in" element={<GeneralSignIn />} />
        <Route path="/guest-sign-up" element={<GuestSignUp />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="create-password" element={<CreatePassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/host-sign-up" element={<HostSignUp />} />
        <Route path="/identity-id" element={<IdentityId />} />
        <Route
          path="/identity-with-picture-info"
          element={<IdentityWithPictureInfo />}
        />
        <Route path="/identity-selfie" element={<IdentitySelfie />} />
        <Route path="/add-bank-details" element={<AddBankDetails />} />
        <Route path="/guest-dashboard" element={<GuestDashboard />} />
        <Route path="/apartments" element={<ApartmentsPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy-policy" element={<PrivacyPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/filter" element={<FilterPage />} />
        <Route path="/filtered-search" element={<FilteredSearchPage />} />
      </Routes>
    </Router>
  );
}

export default App;
