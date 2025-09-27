import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SplashWithOnboarding from "./pages/OnboardingPage/SplashWithOnboarding";
import ChooseType from "./pages/OnboardingPage/ChooseType";
import GeneralSignIn from "./pages/AuthPages/GeneralSignIn";
import SignUpForm from "./pages/AuthPages/SignUpPage";
import VerifyEmail from "./components/auth/VerifyEmail";
import CreatePassword from "./components/auth/CreatePassword";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
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
import BookingsPage from "./pages/GuestDashboard/BookingsPage";
import BookingDetails from "./pages/GuestDashboard/BookingDetailsPage";
import FavoritesPage from "./pages/GuestDashboard/FavoritesPages";
import HotApartmentsPage from "./pages/GuestDashboard/HotApartmentsPage";
import GuestLIsting from "./pages/GuestDashboard/GuestListingPage";
import BasicInfoPage from "./pages/GuestDashboard/BasicInfoPage";
import ListingApartmentDetails from "./pages/GuestDashboard/ListingApartmentDetails";
import ListingFacilitiesPage from "./pages/GuestDashboard/ListingFacilitiesPage";
import MediaUploadPage from "./pages/GuestDashboard/MediaUploadPage";
import BookingPricingPage from "./pages/GuestDashboard/BookingPricingPage";
import SecurityDepositPage from "./pages/GuestDashboard/SecurityDepositPage";
import HouseRulesPage from "./pages/GuestDashboard/HouseRulesPage";
import UploadLegalsPage from "./pages/GuestDashboard/UploadLegalsPage";
import ListingOverviewPage from "./pages/GuestDashboard/ListingOverviewPage";
import ShortletOverviewPage from "./pages/GuestDashboard/ShortletOverview";
import ReviewsPage from "./components/dashboard/ReviewsPage";
import BookingDatePage from "./pages/GuestDashboard/BookingDatePage";
import BookingOverviewPage from "./pages/GuestDashboard/BookingOverviewPage";
import IdCheckPage from "./pages/GuestDashboard/IdCheckPage";
import GuestIdPage from "./pages/GuestDashboard/GuestIdPage";
import GuestIdLast from "./pages/GuestDashboard/GuestIdLast";
import GuestIdSelfie from "./pages/GuestDashboard/GuestIdSelfie";
import ShortletReview from "./pages/GuestDashboard/ShortletReview";
import HostDashboardPage from "./pages/HostDashboard/HostDashboardPage";
import ConfirmEdit from "./pages/HostDashboard/ConfirmEdit";
import ViewListing from "./pages/HostDashboard/ViewListing";
import HostBookingDetails from "./pages/GuestDashboard/BookingDetailsPage";
import HostHome from "./pages/HostDashboard/HostHome";
import ProfilePage from "./pages/HostDashboard/ProfilePage";
import EditProfile from "./pages/HostDashboard/EditProfile";
import RevenuePage from "./pages/HostDashboard/RevenuePage";
import ChangeBankPage from "./pages/HostDashboard/ChangeBankPage";
import HostReviews from "./pages/HostDashboard/HostReviews";
import FaqPage from "./pages/HostDashboard/FaqPage";
import GuestNotificationsPage from "./pages/GuestDashboard/GuestNotificationsPage";
import HostNotificationsPage from "./pages/HostDashboard/HostNotificationsPage";
import GuestEmptyState from "./components/dashboard/GuestEmptyState";
import HostEmptyState from "./components/dashboard/HostEmptyState";

function App() {
  return (
    <Router>
      <Routes>
        {/* Combined splash + onboarding route */}
        <Route path="/" element={<SplashWithOnboarding />} />
        <Route path="/choose-type" element={<ChooseType />} />
        <Route path="/sign-in" element={<GeneralSignIn />} />
        <Route path="/sign-up" element={<SignUpForm />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="create-password" element={<CreatePassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
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
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/bookings/:id" element={<BookingDetails />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/hot-apartments" element={<HotApartmentsPage />} />
        <Route path="/guest-listing" element={<GuestLIsting />} />
        <Route path="/basic-info" element={<BasicInfoPage />} />
        <Route
          path="/listing-apartment-details"
          element={<ListingApartmentDetails />}
        />
        <Route path="/facilities" element={<ListingFacilitiesPage />} />
        <Route path="/media-upload" element={<MediaUploadPage />} />
        <Route path="/booking-pricing" element={<BookingPricingPage />} />
        <Route path="/security-deposit" element={<SecurityDepositPage />} />
        <Route path="/house-rules" element={<HouseRulesPage />} />
        <Route path="/upload-legals" element={<UploadLegalsPage />} />
        <Route path="/listing-overview" element={<ListingOverviewPage />} />
        <Route path="/shortlet-overview" element={<ShortletOverviewPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/booking-dates" element={<BookingDatePage />} />
        <Route path="/booking-overview" element={<BookingOverviewPage />} />
        <Route path="/id-check" element={<IdCheckPage />} />
        <Route path="/guest-id" element={<GuestIdPage />} />
        <Route path="/guest-id-last" element={<GuestIdLast />} />
        <Route path="/guest-id-selfie" element={<GuestIdSelfie />} />
        <Route path="/shortlet-review" element={<ShortletReview />} />
        <Route path="/host-dashboard" element={<HostDashboardPage />} />
        <Route path="/confirm-edit" element={<ConfirmEdit />} />
        <Route path="/view-listing" element={<ViewListing />} />
        <Route
          path="/host-booking-details/:id"
          element={<HostBookingDetails />}
        />
        <Route path="/host-home" element={<HostHome />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/revenue" element={<RevenuePage />} />
        <Route path="/change-bank-details" element={<ChangeBankPage />} />
        <Route path="/host-reviews" element={<HostReviews />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route
          path="/guest-notifications"
          element={<GuestNotificationsPage />}
        />
        <Route path="/host-notifications" element={<HostNotificationsPage />} />
        <Route path="/guest" element={<GuestEmptyState />} />
        <Route path="/host" element={<HostEmptyState />} />
      </Routes>
    </Router>
  );
}

export default App;
