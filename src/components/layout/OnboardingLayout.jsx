import { Link } from "react-router-dom";

const OnboardingLayout = ({
  bgImage,
  title,
  description,
  onGetStarted,
  onSignIn,
  currentIndex,
  totalSlides,
  showSignInButton = true, // Add this prop with default value
}) => {
  // Handle sign in click
  const handleSignIn = (e) => {
    e.preventDefault(); // Prevent default link behavior
    if (onSignIn) {
      console.log("OnboardingLayout: handleSignIn called");
      onSignIn(); // Call the onSignIn function
    }
  };

  // Handle skip click
  const handleSkip = () => {
    console.log("OnboardingLayout: Skip button clicked");
    if (onGetStarted) {
      onGetStarted(); // Use onGetStarted to mark as seen
    }
  };

  // Handle get started click
  const handleGetStarted = () => {
    console.log("OnboardingLayout: Get Started button clicked");
    if (onGetStarted) {
      onGetStarted();
    }
  };

  return (
    <div
      className="relative h-screen w-full bg-cover bg-center flex flex-col justify-between"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Gradient Overlay - above image, beneath content */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 76.97%)",
        }}
      />

      {/* Top Row: Progress + Skip */}
      <div className="flex justify-between items-center p-4 relative z-10">
        {/* Progress indicators */}
        <div className="flex space-x-2">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <div
              key={i}
              className={`h-[4px] rounded-full ${
                i === currentIndex
                  ? "w-[40px] bg-[#F711F7]"
                  : "w-[18px] bg-[#E6E6E6]"
              }`}
            />
          ))}
        </div>

        {/* Skip button - also needs to mark onboarding as seen */}
        <button
          onClick={handleSkip}
          className="text-white text-[14px] font-medium hover:opacity-80"
        >
          Skip
        </button>
      </div>

      {/* Bottom Content - All content centered at bottom */}
      <div className="px-6 pb-[105.26px] text-white relative z-10">
        <div className="flex flex-col items-center">
          {/* Text content */}
          <div className="text-center text-white max-w-md mb-[10px]">
            <h1 className="text-[24px] w-[303.2px] font-semibold mb-[14px]">
              {title}
            </h1>
            <p className="text-[16px] mx-auto w-[269.61px] font-medium mb-[35px]">
              {description}
            </p>
          </div>

          {/* Button and sign in link */}
          <button
            onClick={handleGetStarted}
            className="w-[314.18px] h-[45.82px] text-[14px] bg-[#A20BA2] rounded-[12.9px] text-white font-semibold hover:opacity-90 active:scale-95 transition-all"
          >
            Get Started
          </button>

          {/* Conditionally render sign in link */}
          {showSignInButton && (
            <p className="mt-[22px] text-center text-[13px] font-medium">
              Have an account?{" "}
              <button
                onClick={handleSignIn}
                className="text-[#F711F7] cursor-pointer hover:underline font-semibold bg-transparent border-none p-0"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingLayout;
