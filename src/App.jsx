import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import ApartmentCreationProvider from "./contexts/ApartmentCreationProvider";
import HostProfileProvider from "./contexts/HostProfileProvider";
import ApartmentListingProvider from "./contexts/ApartmentListingProvider";
import UserProvider from "./contexts/UserProvider";
import { useEffect } from "react";
import { StatusBar, Style } from "@capacitor/status-bar";
import { rgb2hex, updateThemeColorFromBody } from "./utils/themeColor";

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
import ApartmentsPage from "./components/dashboard/ApartmentsPage";
import TermsPage from "./pages/StaticPages/TermsPage";
import PrivacyPage from "./pages/StaticPages/PrivacyPage";
import SearchPage from "./components/dashboard/SearchPage";
import FilterPage from "./components/dashboard/FilterPage";
import SearchResultsPage from "./components/dashboard/SearchResults";
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
import HostHomepage from "./pages/HostDashboard/HostHomepage";
import HostDashboard from "./pages/HostDashboard/HostDashboard";
import ConfirmEdit from "./pages/HostDashboard/ConfirmEdit";
import ViewListing from "./pages/HostDashboard/ViewListing";
import HostBookingDetails from "../src/components/dashboard/HostBookingDetails";
import ProfilePage from "./components/dashboard/ProfilePage";
import EditProfile from "./pages/HostDashboard/EditProfile";
import RevenuePage from "./pages/HostDashboard/RevenuePage";
import ChangeBankPage from "./pages/HostDashboard/ChangeBankPage";
import HostReviews from "./pages/HostDashboard/HostReviews";
import FaqPage from "./pages/HostDashboard/FaqPage";
import GuestNotificationsPage from "./pages/GuestDashboard/GuestNotificationsPage";
import NotificationsPage from "./components/dashboard/NotificationsPage";
import GuestEmptyState from "./components/dashboard/GuestEmptyState";
import HostEmptyState from "./components/dashboard/HostEmptyState";
import GuestHomepage from "./components/dashboard/GuestHomepage";
import VerifyPasswordEmail from "./components/auth/VerifyPasswordEmail";
import SearchHistoryProvider from "./contexts/SearchHistoryProvider";
import FilteredResultsPage from "./components/dashboard/FilterResultsPage";
import GuestDocumentProvider from "./contexts/GuestDocumentProvider";
import BookingProvider from "./contexts/BookingProvider";
import CurrentBookingOverviewPage from "./pages/GuestDashboard/CurrentBookingOverviewPage";
import BookingStatusPage from "./pages/GuestDashboard/BookingStatus";
import PaymentPage from "./pages/GuestDashboard/PaymentPage";
import ApartmentAvailability from "./components/apartment/AvailabilityResponsePage";
import { BackgroundColorProvider } from "./contexts/BackgroundColorProvider";
import MainLayout from "./components/MainLayout";
import { LocationProvider } from "./contexts/LocationProvider";
import {
  useNavigate,
  UNSAFE_NavigationContext as NavigationContext,
} from "react-router-dom";
import { App as CapacitorApp } from "@capacitor/app";
import PullToRefresh from "./components/PullToRefresh";
function App() {
  // Global back button handler component
  function GlobalBackButtonHandler() {
    const navigate = useNavigate();

    useEffect(() => {
      const handleBackButton = async () => {
        // Check if we can go back in history
        if (window.history.length > 1) {
          navigate(-1); // Go back one page
        } else {
          // On root page - show confirmation before exit
          const shouldExit = window.confirm("Do you want to exit the app?");
          if (shouldExit) {
            await CapacitorApp.exitApp();
          }
        }
      };

      const backButtonListener = CapacitorApp.addListener(
        "backButton",
        handleBackButton
      );

      return () => {
        backButtonListener.remove();
      };
    }, [navigate]);

    return null; // This component doesn't render anything
  }
  function RefreshController() {
    const location = useLocation();

    const refreshableRoutes = [
      "/host-dashboard",
      "/guest-homepage",
      "/apartments",
      "/bookings",
      "/favorites",
      "/notifications",
    ];

    const disabledSubRoutes = [
      "/booking-",
      "/media-upload",
      "/identity",
      "/listing-",
    ];

    const enabled =
      refreshableRoutes.some((r) => location.pathname.startsWith(r)) &&
      !disabledSubRoutes.some((r) => location.pathname.includes(r));

    const handleRefresh = () => {
      // Trigger app-level refresh event
      window.dispatchEvent(new Event("app-refresh"));
    };

    return (
      <PullToRefresh
        enabled={enabled}
        onRefresh={handleRefresh}
        containerId="main-scroll"
      />
    );
  }

  useEffect(() => {
    const configureStatusBar = async () => {
      // Make sure we are in a native environment
      if (!window.Capacitor && !window.capacitor) return;

      const bg = window.getComputedStyle(document.body).backgroundColor;
      const hex = rgb2hex(bg);

      await StatusBar.setOverlaysWebView({ overlay: false });
      await StatusBar.setBackgroundColor({ color: hex });
      await StatusBar.setStyle({ style: Style.Dark });
    };

    updateThemeColorFromBody();
    configureStatusBar();
  }, []);
  return (
    <Router>
      <LocationProvider>
        <BackgroundColorProvider>
          <HostProfileProvider>
            <UserProvider>
              <ApartmentCreationProvider>
                <ApartmentListingProvider>
                  <SearchHistoryProvider>
                    <GuestDocumentProvider>
                      <BookingProvider>
                        <MainLayout>
                          <GlobalBackButtonHandler />
                          <RefreshController />{" "}
                          <Routes>
                            {/* ===== PUBLIC ROUTES ===== */}
                            <Route
                              path="/apartment-availability/"
                              element={<ApartmentAvailability />}
                            />
                            {/* Onboarding & Authentication */}
                            <Route
                              path="/"
                              element={<SplashWithOnboarding />}
                            />
                            <Route
                              path="/choose-type"
                              element={<ChooseType />}
                            />
                            <Route
                              path="/sign-in"
                              element={<GeneralSignIn />}
                            />
                            <Route path="/sign-up" element={<SignUpForm />} />
                            <Route
                              path="/verify-email"
                              element={<VerifyEmail />}
                            />
                            <Route
                              path="/verify-password-email"
                              element={<VerifyPasswordEmail />}
                            />
                            <Route
                              path="/verify-password-email"
                              element={<VerifyPasswordEmail />}
                            />
                            <Route
                              path="/create-password"
                              element={<CreatePassword />}
                            />
                            <Route
                              path="/forgot-password"
                              element={<ForgotPassword />}
                            />
                            <Route
                              path="/reset-password"
                              element={<ResetPassword />}
                            />

                            {/* Static Pages */}
                            <Route path="/terms" element={<TermsPage />} />
                            <Route
                              path="/privacy-policy"
                              element={<PrivacyPage />}
                            />

                            {/* ===== HOST-SPECIFIC ROUTES ===== */}

                            {/* Host Onboarding & Verification */}
                            <Route
                              path="/identity-id"
                              element={<IdentityId />}
                            />
                            <Route
                              path="/identity-with-picture-info"
                              element={<IdentityWithPictureInfo />}
                            />
                            <Route
                              path="/identity-selfie"
                              element={<IdentitySelfie />}
                            />
                            <Route
                              path="/add-bank-details"
                              element={<AddBankDetails />}
                            />

                            {/* Host Dashboard & Management */}
                            <Route
                              path="/host-homepage"
                              element={<HostHomepage />}
                            />
                            <Route
                              path="/host-dashboard"
                              element={<HostDashboard />}
                            />
                            <Route
                              path="/confirm-edit"
                              element={<ConfirmEdit />}
                            />
                            <Route
                              path="/view-listing/:apartmentId"
                              element={<ViewListing />}
                            />
                            <Route
                              path="/host-booking-details/:id"
                              element={<HostBookingDetails />}
                            />
                            <Route
                              path="/booking-status/:id"
                              element={<BookingStatusPage />}
                            />
                            {/* Host Profile & Settings */}
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route
                              path="/edit-profile"
                              element={<EditProfile />}
                            />
                            <Route path="/revenue" element={<RevenuePage />} />
                            <Route
                              path="/change-bank-details"
                              element={<ChangeBankPage />}
                            />
                            <Route
                              path="/host-reviews"
                              element={<HostReviews />}
                            />
                            <Route path="/faq" element={<FaqPage />} />
                            <Route
                              path="/notifications"
                              element={<NotificationsPage />}
                            />
                            <Route path="/host" element={<HostEmptyState />} />

                            {/* ===== GUEST-SPECIFIC ROUTES ===== */}

                            {/* Guest Dashboard & Navigation */}
                            <Route
                              path="/guest-homepage"
                              element={<GuestHomepage />}
                            />
                            <Route
                              path="/guest"
                              element={<GuestEmptyState />}
                            />
                            <Route
                              path="/guest-notifications"
                              element={<GuestNotificationsPage />}
                            />

                            {/* Guest Search & Listings */}
                            <Route
                              path="/apartments"
                              element={<ApartmentsPage />}
                            />
                            <Route path="/search" element={<SearchPage />} />
                            <Route path="/filter" element={<FilterPage />} />
                            <Route
                              path="/search-results"
                              element={<SearchResultsPage />}
                            />
                            <Route
                              path="/filtered-results"
                              element={<FilteredResultsPage />}
                            />
                            <Route
                              path="/hot-apartments"
                              element={<HotApartmentsPage />}
                            />
                            <Route
                              path="/guest-listing"
                              element={<GuestLIsting />}
                            />

                            {/* Guest Bookings & Favorites */}
                            <Route
                              path="/bookings"
                              element={<BookingsPage />}
                            />
                            <Route
                              path="/bookings/:id"
                              element={<BookingDetails />}
                            />
                            <Route
                              path="/host-booking-details/:id"
                              element={<HostBookingDetails />}
                            />
                            <Route
                              path="/favorites"
                              element={<FavoritesPage />}
                            />

                            {/* Guest Identity Verification */}
                            <Route path="/id-check" element={<IdCheckPage />} />
                            <Route path="/guest-id" element={<GuestIdPage />} />
                            <Route
                              path="/guest-id-last"
                              element={<GuestIdLast />}
                            />
                            <Route
                              path="/guest-id-selfie"
                              element={<GuestIdSelfie />}
                            />

                            {/* ===== LISTING CREATION FLOW (Shared) ===== */}

                            {/* Listing Creation Steps */}
                            <Route
                              path="/basic-info/:apartmentId?"
                              element={<BasicInfoPage />}
                            />
                            <Route
                              path="/listing-apartment-details"
                              element={<ListingApartmentDetails />}
                            />
                            <Route
                              path="/facilities"
                              element={<ListingFacilitiesPage />}
                            />
                            <Route
                              path="/media-upload"
                              element={<MediaUploadPage />}
                            />
                            <Route
                              path="/booking-pricing"
                              element={<BookingPricingPage />}
                            />
                            <Route
                              path="/security-deposit"
                              element={<SecurityDepositPage />}
                            />
                            <Route
                              path="/house-rules"
                              element={<HouseRulesPage />}
                            />
                            <Route
                              path="/upload-legals"
                              element={<UploadLegalsPage />}
                            />
                            <Route
                              path="/listing-overview"
                              element={<ListingOverviewPage />}
                            />

                            {/* ===== BOOKING FLOW (Shared) ===== */}

                            {/* Booking Process */}
                            <Route
                              path="/booking-dates/:id"
                              element={<BookingDatePage />}
                            />
                            <Route
                              path="/booking-overview/:id"
                              element={<BookingOverviewPage />}
                            />
                            <Route
                              path="/current-booking-overview/:id"
                              element={<CurrentBookingOverviewPage />}
                            />
                            <Route
                              path="/shortlet-review/:id?"
                              element={<ShortletReview />}
                            />
                            <Route
                              path="/shortlet-overview/:id"
                              element={<ShortletOverviewPage />}
                            />
                            <Route
                              path="/booking-payment/:id?"
                              element={<PaymentPage />}
                            />
                            {/* ===== SHARED ROUTES ===== */}

                            {/* Reviews & Social Features */}
                            <Route path="/reviews" element={<ReviewsPage />} />
                          </Routes>
                        </MainLayout>
                      </BookingProvider>
                    </GuestDocumentProvider>
                  </SearchHistoryProvider>
                </ApartmentListingProvider>
              </ApartmentCreationProvider>
            </UserProvider>
          </HostProfileProvider>
        </BackgroundColorProvider>
      </LocationProvider>
    </Router>
  );
}

export default App;
