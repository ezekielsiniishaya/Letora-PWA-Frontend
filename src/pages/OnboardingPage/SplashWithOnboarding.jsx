import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import OnboardingLayout from "../../components/layout/OnboardingLayout";
import { useBackgroundColor } from "../../contexts/BackgroundColorContext.jsx";
import { StatusBar, Style } from "@capacitor/status-bar";
import { Preferences } from "@capacitor/preferences";

const onboardingSlides = [
  {
    bg: "/images/background/onboard-bg-1.jpg",
    statusBarColor: "#B3B6BC",
    title: "Welcome to Letora",
    description:
      "Hosting made easy. Take full control of your shortlet business directly from your app",
  },
  {
    bg: "/images/background/onboard-bg-2.jpg",
    statusBarColor: "#000000",
    title: "Turn your Space into Steady Income",
    description:
      "List your apartment on Letora and start earning from verified short-stay guests",
  },
];

const HAS_SEEN_ONBOARDING_KEY = "hasSeenOnboarding";
const REMEMBER_ME_KEY = "rememberMe";
const AUTH_TOKEN_KEY = "token";

export default function SplashWithOnboarding() {
  const { setBackgroundColor } = useBackgroundColor();
  const navigate = useNavigate();

  const [currentPhase, setCurrentPhase] = useState("checking");
  const [splashOpacity, setSplashOpacity] = useState(100);
  const [onboardingOpacity, setOnboardingOpacity] = useState(0);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(null);
  const [hasRememberMe, setHasRememberMe] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [navigationTarget, setNavigationTarget] = useState(null); // Track where to navigate after splash

  // Load all user status data from persistent storage
  useEffect(() => {
    const loadUserStatus = async () => {
      try {
        // Check if user has seen onboarding
        const onboardingResult = await Preferences.get({
          key: HAS_SEEN_ONBOARDING_KEY,
        });
        const hasSeen = onboardingResult.value === "true";
        setHasSeenOnboarding(hasSeen);

        // Check if "remember me" was enabled
        const rememberMeResult = await Preferences.get({
          key: REMEMBER_ME_KEY,
        });
        const remembered = rememberMeResult.value === "true";
        setHasRememberMe(remembered);

        // Check if user is logged in (has auth token)
        const authTokenResult = await Preferences.get({ key: AUTH_TOKEN_KEY });
        setIsLoggedIn(!!authTokenResult.value);

        console.log("Loaded user status:", {
          hasSeenOnboarding: hasSeen,
          hasRememberMe: remembered,
          isLoggedIn: !!authTokenResult.value,
        });
      } catch (error) {
        console.error("Error loading user status:", error);
        setHasSeenOnboarding(false);
        setHasRememberMe(false);
        setIsLoggedIn(false);
      }
    };

    loadUserStatus();
  }, []);

  // Determine where to navigate after splash
  useEffect(() => {
    const determineNavigation = async () => {
      if (
        hasSeenOnboarding === null ||
        hasRememberMe === null ||
        isLoggedIn === null ||
        navigationTarget !== null // Already determined
      )
        return;

      console.log("Determining navigation target...", {
        hasSeenOnboarding,
        hasRememberMe,
        isLoggedIn,
      });

      // LOGIC FLOW:
      // 1. If user is logged in AND has seen onboarding AND has "remember me" enabled
      if (isLoggedIn && hasSeenOnboarding && hasRememberMe) {
        try {
          console.log("✅ Checking for verified host redirect...");

          // Get host verification status from Preferences (stored by UserProvider)
          const verificationResult = await Preferences.get({
            key: "hostVerificationStatus",
          });

          console.log(
            "Host verification status from storage:",
            verificationResult.value
          );

          // Check if user is a VERIFIED HOST
          const isVerifiedHost = verificationResult.value === "verified";

          if (isVerifiedHost) {
            console.log(
              "🎯 Verified host - will navigate to host-homepage after splash"
            );
            setNavigationTarget("/host-homepage");
          } else {
            console.log(
              "👤 Not a verified host - will navigate to guest-homepage after splash"
            );
            setNavigationTarget("/guest-homepage");
          }
        } catch (error) {
          console.error("Error checking verification status:", error);
          // Fallback to guest homepage
          setNavigationTarget("/guest-homepage");
        }
      }
      // 2. If user has seen onboarding (but not logged in or no remember me)
      else if (hasSeenOnboarding) {
        console.log(
          "✅ User has seen onboarding - will navigate to choose-type after splash"
        );
        setNavigationTarget("/choose-type");
      }
      // 3. User hasn't seen onboarding - will show onboarding after splash
      else {
        console.log("👋 First time user - will show onboarding after splash");
        setNavigationTarget("onboarding"); // Special value for showing onboarding
      }
    };

    determineNavigation();
  }, [hasSeenOnboarding, hasRememberMe, isLoggedIn, navigationTarget]);

  // Handle the splash timer and navigation
  useEffect(() => {
    if (navigationTarget === null) return;

    console.log(
      "🚀 Starting 3-second splash timer for target:",
      navigationTarget
    );
    setCurrentPhase("splash");

    const splashTimer = setTimeout(() => {
      if (navigationTarget === "onboarding") {
        // Show onboarding flow after splash
        setCurrentPhase("transitioning");
        setSplashOpacity(0);

        setTimeout(() => {
          setOnboardingOpacity(100);
        }, 300);

        setTimeout(() => {
          setCurrentPhase("onboarding");
        }, 1200);
      } else {
        // Navigate directly to target page
        console.log("⏰ Splash complete, navigating to:", navigationTarget);
        if (navigationTarget === "/host-homepage") {
          setCurrentPhase("navigatingToHostHome");
        } else if (navigationTarget === "/guest-homepage") {
          setCurrentPhase("navigatingToGuestHome");
        } else {
          setCurrentPhase("navigatingToChooseType");
        }

        navigate(navigationTarget, { replace: true });
      }
    }, 3000); // 3-second splash for EVERYONE

    return () => clearTimeout(splashTimer);
  }, [navigationTarget, navigate]);

  // Function to mark onboarding as seen and navigate
  const completeOnboarding = async (navigateTo = "/choose-type") => {
    try {
      console.log(
        "🎯 Marking onboarding as seen and navigating to:",
        navigateTo
      );
      await Preferences.set({
        key: HAS_SEEN_ONBOARDING_KEY,
        value: "true",
      });
      setHasSeenOnboarding(true);
      navigate(navigateTo, { replace: true });
    } catch (error) {
      console.error("Error marking onboarding as seen:", error);
      // Still navigate even if there's an error
      navigate(navigateTo, { replace: true });
    }
  };

  // When user signs in from onboarding
  const handleSignIn = async () => {
    console.log("🔐 User signing in from onboarding - handleSignIn called");

    try {
      // Mark onboarding as seen
      console.log("Setting hasSeenOnboarding to true");
      await Preferences.set({
        key: HAS_SEEN_ONBOARDING_KEY,
        value: "true",
      });

      // Update state
      setHasSeenOnboarding(true);
      console.log("hasSeenOnboarding state updated");

      // Navigate to sign in page
      console.log("Navigating to /sign-in");
      navigate("/sign-in", { replace: true });
    } catch (error) {
      console.error("Error in handleSignIn:", error);
      // Still navigate even if there's an error
      navigate("/sign-in", { replace: true });
    }
  };

  // When user taps "Get Started" on any slide
  const handleGetStarted = async () => {
    console.log("🚀 Get Started clicked on slide", activeSlideIndex);

    try {
      console.log("Calling completeOnboarding with /choose-type");
      await completeOnboarding("/choose-type");
    } catch (error) {
      console.error("Error in handleGetStarted:", error);
    }
  };

  // Background color per phase/slide
  useEffect(() => {
    if (
      currentPhase === "splash" ||
      currentPhase === "transitioning" ||
      currentPhase === "checking" ||
      currentPhase === "navigatingToHostHome" ||
      currentPhase === "navigatingToGuestHome" ||
      currentPhase === "navigatingToChooseType"
    ) {
      setBackgroundColor("#A20BA2");
    } else if (currentPhase === "onboarding") {
      setBackgroundColor(onboardingSlides[activeSlideIndex].statusBarColor);
    }
  }, [currentPhase, activeSlideIndex, setBackgroundColor]);

  // Status bar style
  useEffect(() => {
    if (window.Capacitor || window.capacitor) {
      StatusBar.setStyle({ style: Style.Dark });
    }
  }, []);

  // Don't render anything while checking or navigating
  if (
    currentPhase === "checking" ||
    currentPhase === "navigatingToHostHome" ||
    currentPhase === "navigatingToGuestHome" ||
    currentPhase === "navigatingToChooseType"
  ) {
    return (
      <div className="full-screen-container bg-[#A20BA2] flex items-center justify-center">
        <div className="flex flex-row items-center text-center">
          <img
            src="/icons/logo.svg"
            alt="Letora Logo"
            className="w-[63.79px] h-[63.79px] mr-[12px]"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <h1 className="text-[43.04px] font-semibold tracking-tight text-white">
            Letora
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="full-screen-container">
      {/* SPLASH SCREEN LAYER - Show for everyone during splash phase */}
      {(currentPhase === "splash" || currentPhase === "transitioning") && (
        <div
          className="splash-screen"
          style={{
            opacity: splashOpacity / 100,
            transition:
              currentPhase === "splash"
                ? "none"
                : "opacity 1200ms cubic-bezier(0.4, 0.0, 0.2, 1)",
            pointerEvents: currentPhase === "onboarding" ? "none" : "auto",
          }}
        >
          <div className="flex flex-row items-center text-center transform transition-transform duration-300 hover:scale-105">
            <img
              src="/icons/logo.svg"
              alt="Letora Logo"
              className="w-[63.79px] h-[63.79px] mr-[12px]"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <h1 className="text-[43.04px] font-semibold tracking-tight">
              Letora
            </h1>
          </div>
          <p className="mt-4 text-[14px] font-medium opacity-90 text-center max-w-xs">
            Enjoy the Mi Casa Su Casa Experience
          </p>
        </div>
      )}

      {/* ONBOARDING CAROUSEL LAYER - Only shown when hasn't seen onboarding */}
      {currentPhase === "onboarding" && !hasSeenOnboarding && (
        <div
          className="onboarding-container"
          style={{
            opacity: onboardingOpacity / 100,
            transition: "opacity 1200ms cubic-bezier(0.4, 0.0, 0.2, 1)",
            pointerEvents: "auto",
          }}
        >
          <Swiper
            spaceBetween={0}
            slidesPerView={1}
            onSlideChange={(swiper) => {
              setActiveSlideIndex(swiper.activeIndex);
              swiper.allowSlidePrev = swiper.activeIndex !== 0;
              swiper.allowSlideNext =
                swiper.activeIndex !== swiper.slides.length - 1;
            }}
            allowTouchMove={true}
            loop={false}
            speed={400}
            resistance={false}
            resistanceRatio={0}
            className="h-full"
          >
            {onboardingSlides.map((slide, index) => (
              <SwiperSlide key={index} className="h-full">
                <OnboardingLayout
                  bgImage={slide.bg}
                  title={slide.title}
                  description={slide.description}
                  currentIndex={activeSlideIndex}
                  totalSlides={onboardingSlides.length}
                  onGetStarted={handleGetStarted}
                  onSignIn={handleSignIn} // Pass sign in handler
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
}
