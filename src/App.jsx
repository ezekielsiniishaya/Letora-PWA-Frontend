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
      </Routes>
    </Router>
  );
}

export default App;
