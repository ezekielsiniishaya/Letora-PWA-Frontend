// SplashWithOnboarding.jsx - Modified version
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import OnboardingLayout from "../../components/layout/OnboardingLayout";

export default function SplashWithOnboarding() {
  const navigate = useNavigate();

  // State management for transition phases
  const [currentPhase, setCurrentPhase] = useState("splash");
  const [splashOpacity, setSplashOpacity] = useState(100);
  const [onboardingOpacity, setOnboardingOpacity] = useState(0);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Onboarding slides data
  const onboardingSlides = [
    {
      bg: "/images/background/onboard-bg-1.jpg",
      title: "Welcome to Letora",
      description:
        "Hosting made easy. Take full control of your shortlet business directly from your app",
    },
    {
      bg: "/images/background/onboard-bg-2.jpg",
      title: "Turn your Space into Steady Income",
      description:
        "List your apartment on Letora and start earning from verified short-stay guests",
    },
  ];

  // Handle the transition sequence
  useEffect(() => {
    const transitionTimer = setTimeout(() => {
      setCurrentPhase("transitioning");
      setSplashOpacity(0);

      setTimeout(() => {
        setOnboardingOpacity(100);
      }, 300);

      setTimeout(() => {
        setCurrentPhase("onboarding");
      }, 1200);
    }, 3000);

    return () => clearTimeout(transitionTimer);
  }, []);

  const handleGetStarted = () => {
    navigate("/choose-type");
  };

  return (
    <div className="h-screen w-full relative overflow-hidden bg-[#A20BA2]">
      {/* SPLASH SCREEN LAYER - No overlay */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center bg-[#A20BA2] text-white z-20"
        style={{
          opacity: splashOpacity / 100,
          transition: "opacity 1200ms cubic-bezier(0.4, 0.0, 0.2, 1)",
          pointerEvents: currentPhase === "onboarding" ? "none" : "auto",
        }}
      >
        {/* Logo + Brand Section */}
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
        <p className="mt-4 text-[14px] font-normal opacity-90 text-center max-w-xs">
          Enjoy the <span className="italic font-medium">Mi Casa Su Casa</span>{" "}
          Experience
        </p>
      </div>

      {/* ONBOARDING CAROUSEL LAYER */}
      <div
        className="absolute inset-0 z-10"
        style={{
          opacity: onboardingOpacity / 100,
          transition: "opacity 1200ms cubic-bezier(0.4, 0.0, 0.2, 1)",
          pointerEvents: currentPhase === "onboarding" ? "auto" : "none",
        }}
      >
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          onSlideChange={(swiper) => {
            setActiveSlideIndex(swiper.activeIndex);
            // Control navigation based on current position
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
          style={{ overflow: "hidden" }} // Add this
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
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
