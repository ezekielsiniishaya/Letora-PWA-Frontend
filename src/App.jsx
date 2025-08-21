import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SplashWithOnboarding from "./pages/OnboardingPage/SplashWithOnboarding";
import ChooseType from "./pages/OnboardingPage/ChooseType";
import GeneralSignIn from "./pages/AuthPages/GeneralSignIn";
import GuestSignUp from "./pages/AuthPages/GuestSignUp";
import VerifyEmail from "./pages/AuthPages/VerifyEmail";
import CreatePassword from "./pages/AuthPages/CreatePassword";
import ForgotPassword from "./pages/AuthPages/ForgotPassword";
import ResetPassword from "./pages/AuthPages/ResetPassword";

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
      </Routes>
    </Router>
  );
}

export default App;
