// hooks/useBackButton.js
import { useEffect, useRef } from "react";
import { App } from "@capacitor/app";
import { useNavigate, useLocation } from "react-router-dom";

const useBackButton = (callback = null, shouldExitOnRoot = true) => {
  const navigate = useNavigate();
  const location = useLocation();
  const navigationStack = useRef(["/"]);

  useEffect(() => {
    // Track navigation history manually
    const currentPath = location.pathname + location.search;

    // Don't add duplicate consecutive entries
    if (
      navigationStack.current[navigationStack.current.length - 1] !==
      currentPath
    ) {
      navigationStack.current.push(currentPath);
    }
  }, [location]);

  useEffect(() => {
    const handleBackButton = async () => {
      if (typeof callback === "function") {
        callback();
        return;
      }

      // Pop current location from stack
      navigationStack.current.pop();

      // If we have previous pages in stack
      if (navigationStack.current.length > 0) {
        // Go back in history
        navigate(-1);
      } else {
        // On root page
        if (shouldExitOnRoot) {
          const shouldExit = window.confirm("Press back again to exit the app");
          if (shouldExit) {
            await App.exitApp();
          } else {
            // Stay on current page - push it back to stack
            navigationStack.current.push(location.pathname + location.search);
          }
        } else {
          // Navigate to home if not exiting
          navigate("/");
        }
      }
    };

    // Add the back button listener
    const backButtonListener = App.addListener("backButton", handleBackButton);

    // Cleanup
    return () => {
      backButtonListener.remove();
    };
  }, [callback, navigate, location, shouldExitOnRoot]);
};

export default useBackButton;
