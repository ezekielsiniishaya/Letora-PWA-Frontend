import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SplashWithOnboarding from "./pages/OnboardingPage/SplashWithOnboarding";
import ChooseType from "./pages/OnboardingPage/ChooseType";
import GeneralSignIn from "./pages/AuthPages/GeneralSignIn";

function App() {
  return (
    <Router>
      <Routes>
        {/* Combined splash + onboarding route */}
        <Route path="/" element={<SplashWithOnboarding />} />
        <Route path="/choose-type" element={<ChooseType />} />
        <Route path="/sign-in" element={<GeneralSignIn />} />
      </Routes>
    </Router>
  );
}

export default App;
