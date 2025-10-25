import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ApartmentCreationProvider from "./contexts/ApartmentCreationProvider";
import HostProfileProvider from "./contexts/HostProfileProvider";
import ApartmentListingProvider from "./contexts/ApartmentListingProvider";
import UserProvider from "./contexts/UserProvider";

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
import HostBookingDetails from "./pages/GuestDashboard/BookingDetailsPage";
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

function App() {
  return (
    <Router>
      <HostProfileProvider>
        <UserProvider>
          <ApartmentCreationProvider>
            <ApartmentListingProvider>
              <SearchHistoryProvider>
                <GuestDocumentProvider>
                  <BookingProvider>
                    <Routes>
                      {/* ===== PUBLIC ROUTES ===== */}

                      {/* Onboarding & Authentication */}
                      <Route path="/" element={<SplashWithOnboarding />} />
                      <Route path="/choose-type" element={<ChooseType />} />
                      <Route path="/sign-in" element={<GeneralSignIn />} />
                      <Route path="/sign-up" element={<SignUpForm />} />
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
                      <Route path="/privacy-policy" element={<PrivacyPage />} />

                      {/* ===== HOST-SPECIFIC ROUTES ===== */}

                      {/* Host Onboarding & Verification */}
                      <Route path="/identity-id" element={<IdentityId />} />
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
                      <Route path="/host-homepage" element={<HostHomepage />} />
                      <Route
                        path="/host-dashboard"
                        element={<HostDashboard />}
                      />
                      <Route path="/confirm-edit" element={<ConfirmEdit />} />
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
                      <Route path="/edit-profile" element={<EditProfile />} />
                      <Route path="/revenue" element={<RevenuePage />} />
                      <Route
                        path="/change-bank-details"
                        element={<ChangeBankPage />}
                      />
                      <Route path="/host-reviews" element={<HostReviews />} />
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
                      <Route path="/guest" element={<GuestEmptyState />} />
                      <Route
                        path="/guest-notifications"
                        element={<GuestNotificationsPage />}
                      />

                      {/* Guest Search & Listings */}
                      <Route path="/apartments" element={<ApartmentsPage />} />
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
                      <Route path="/guest-listing" element={<GuestLIsting />} />

                      {/* Guest Bookings & Favorites */}
                      <Route path="/bookings" element={<BookingsPage />} />
                      <Route
                        path="/bookings/:id"
                        element={<BookingDetails />}
                      />
                      <Route path="/favorites" element={<FavoritesPage />} />

                      {/* Guest Identity Verification */}
                      <Route path="/id-check" element={<IdCheckPage />} />
                      <Route path="/guest-id" element={<GuestIdPage />} />
                      <Route path="/guest-id-last" element={<GuestIdLast />} />
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
                      <Route path="/house-rules" element={<HouseRulesPage />} />
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
                  </BookingProvider>
                </GuestDocumentProvider>
              </SearchHistoryProvider>
            </ApartmentListingProvider>
          </ApartmentCreationProvider>
        </UserProvider>
      </HostProfileProvider>
    </Router>
  );
}

export default App;
