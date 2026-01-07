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
    statusBarStyle: Style.Light,
    title: "Welcome to Letora",
    description:
      "Hosting made easy. Take full control of your shortlet business directly from your app",
  },
  {
    bg: "/images/background/onboard-bg-2.jpg",
    statusBarColor: "#000000",
    statusBarStyle: Style.Dark,
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
  const [navigationTarget, setNavigationTarget] = useState(null);

  // At the top of your component, add this useEffect FIRST
  useEffect(() => {
    // Ensure body stays purple until we change it
    document.body.style.backgroundColor = "#A20BA2";
    document.documentElement.style.backgroundColor = "#A20BA2";

    const initializeStatusBar = async () => {
      if (window.Capacitor || window.capacitor) {
        try {
          await StatusBar.setBackgroundColor({ color: "#A20BA2" });
          await StatusBar.setStyle({ style: Style.Light });
          await StatusBar.setOverlaysWebView({ overlay: false });
          console.log("✅ React: Status bar confirmed purple");
        } catch (error) {
          console.error("Error initializing status bar:", error);
        }
      }
    };

    initializeStatusBar();
  }, []); // Run once on mount/
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
        navigationTarget !== null
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

          const verificationResult = await Preferences.get({
            key: "hostVerificationStatus",
          });

          console.log(
            "Host verification status from storage:",
            verificationResult.value
          );

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
        setNavigationTarget("onboarding");
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
        setCurrentPhase("transitioning");
        setSplashOpacity(0);

        setTimeout(() => {
          setOnboardingOpacity(100);
        }, 300);

        setTimeout(() => {
          setCurrentPhase("onboarding");
        }, 1200);
      } else {
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
    }, 3000);

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
      navigate(navigateTo, { replace: true });
    }
  };

  // When user signs in from onboarding
  const handleSignIn = async () => {
    console.log("🔐 User signing in from onboarding");

    try {
      await Preferences.set({
        key: HAS_SEEN_ONBOARDING_KEY,
        value: "true",
      });
      setHasSeenOnboarding(true);
      navigate("/sign-in", { replace: true });
    } catch (error) {
      console.error("Error in handleSignIn:", error);
      navigate("/sign-in", { replace: true });
    }
  };

  // When user taps "Get Started"
  const handleGetStarted = async () => {
    console.log("🚀 Get Started clicked on slide", activeSlideIndex);
    try {
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

  // Status bar style and background color (Secondary update)
  useEffect(() => {
    const updateStatusBar = async () => {
      if (window.Capacitor || window.capacitor) {
        if (
          currentPhase === "splash" ||
          currentPhase === "checking" ||
          currentPhase === "navigatingToHostHome" ||
          currentPhase === "navigatingToGuestHome" ||
          currentPhase === "navigatingToChooseType" ||
          (currentPhase === "transitioning" && onboardingOpacity < 50)
        ) {
          // This will now just confirm the purple color (already set on mount)
          await StatusBar.setBackgroundColor({ color: "#A20BA2" });
          await StatusBar.setStyle({ style: Style.Light });
        } else if (
          currentPhase === "onboarding" ||
          (currentPhase === "transitioning" && onboardingOpacity >= 50)
        ) {
          const slideColor = onboardingSlides[activeSlideIndex].statusBarColor;
          await StatusBar.setBackgroundColor({ color: slideColor });

          const isDarkBackground = slideColor === "#000000";
          await StatusBar.setStyle({
            style: isDarkBackground ? Style.Dark : Style.Light,
          });
        }
      }
    };

    updateStatusBar();
  }, [currentPhase, activeSlideIndex, onboardingOpacity]);

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
      {/* SPLASH SCREEN LAYER */}
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
            <h1 className="text-[43.04px] font-semibold tracking-tight text-white">
              Letora
            </h1>
          </div>
          <p className="mt-4 text-[14px] font-medium opacity-90 text-center max-w-xs text-white">
            Enjoy the Mi Casa Su Casa Experience
          </p>
        </div>
      )}

      {/* ONBOARDING CAROUSEL LAYER */}
      {(currentPhase === "transitioning" || currentPhase === "onboarding") &&
        !hasSeenOnboarding && (
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
                    onSignIn={handleSignIn}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
    </div>
  );
}
