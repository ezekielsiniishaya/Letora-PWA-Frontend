import React, { useEffect } from "react";
import { useBackgroundColor } from "../contexts/BackgroundColorContext.jsx";
import { Preferences } from "@capacitor/preferences";
import { updateFcmToken } from "../services/userApi.js";

function MainLayout({ children }) {
  const { backgroundColor } = useBackgroundColor();

  useEffect(() => {
    // Test Firebase connection
    const testFirebase = () => {
      if (window.Capacitor && window.Capacitor.getPlatform() === "android") {
        console.log(
          "Android platform detected - Firebase should initialize automatically"
        );

        window.testFirebase = () => {
          console.log("Firebase test function called from Logcat");
          return "Firebase test successful - check Logcat for FirebaseApp initialization";
        };

        console.log("To test Firebase, run in Android Studio Logcat:");
        console.log("1. Filter by 'Firebase'");
        console.log("2. Look for 'FirebaseApp initialization successful'");
        console.log(
          "3. Type in Logcat console: evaluate expression window.testFirebase()"
        );
      }
    };

    testFirebase();
  }, []);

  useEffect(() => {
    const initializePushNotifications = async () => {
      // Only run on native platforms (Android/iOS)
      if (window.Capacitor && window.Capacitor.isNativePlatform()) {
        try {
          console.log("Initializing push notifications...");

          // Import Capacitor plugins dynamically
          const { PushNotifications } = await import(
            "@capacitor/push-notifications"
          );

          // Notification channel is now created in native Android code (MainActivity.java)
          console.log("✅ Notification channel handled by native Android");

          // First, let's check current permissions
          const currentPermission = await PushNotifications.checkPermissions();
          console.log(
            "Current push permission status:",
            JSON.stringify(currentPermission)
          );

          // Request permission if not granted
          if (currentPermission.receive !== "granted") {
            const permission = await PushNotifications.requestPermissions();
            console.log(
              "Push permission result after request:",
              JSON.stringify(permission)
            );

            if (permission.receive === "granted") {
              // Register for push
              await PushNotifications.register();
              console.log("Push notifications registered!");

              // Setup listeners
              setupPushListeners(PushNotifications);
            } else {
              console.warn("Push notification permission not granted");
            }
          } else {
            // Already granted, just register
            await PushNotifications.register();
            console.log("Push notifications already granted, registering...");
            setupPushListeners(PushNotifications);
          }
        } catch (error) {
          console.error("Error initializing push notifications:", error);
        }
      } else {
        console.log("Web platform - push notifications not available");
      }
    };

    const setupPushListeners = (PushNotifications) => {
      // Listen for registration
      PushNotifications.addListener("registration", async (token) => {
        console.log("✅ Push registration success. Token:", token.value);
        console.log("📋 COPY THIS TOKEN FOR TESTING:", token.value);

        // Save token to localStorage for testing
        localStorage.setItem("fcm_token", token.value);

        // Send token to your backend
        try {
          await updateFcmToken(token.value);
          console.log("✅ FCM token synced to backend");
        } catch (error) {
          console.error("❌ Failed to sync FCM token to backend:", error);
        }
      });

      // Listen for registration errors
      PushNotifications.addListener("registrationError", (error) => {
        console.error("❌ Push registration error:", error);
      });

      // Handle notifications when app is OPEN
      PushNotifications.addListener(
        "pushNotificationReceived",
        (notification) => {
          console.log(
            "📬 Push received (foreground):",
            JSON.stringify(notification, null, 2)
          );
        }
      );

      // Handle notification taps (app was in background or closed)
      PushNotifications.addListener(
        "pushNotificationActionPerformed",
        (notification) => {
          console.log(
            "👆 Push action performed:",
            JSON.stringify(notification, null, 2)
          );
        }
      );
    };

    // Initialize after a short delay to ensure app is stable
    setTimeout(() => {
      initializePushNotifications();
    }, 1000);
  }, []);

  useEffect(() => {
    // FIX: Check if backgroundColor exists and is valid
    if (!backgroundColor || backgroundColor.length === 0) {
      console.log("Background color is empty, using default");
      return;
    }

    // Meta theme-color for PWA
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", backgroundColor);

    // Native status bar background - only if valid color
    if (window.Capacitor || window.capacitor) {
      import("@capacitor/status-bar")
        .then(({ StatusBar }) => {
          // Add a default color fallback
          const color = backgroundColor.startsWith("#")
            ? backgroundColor
            : "#F9F9F9";
          StatusBar.setBackgroundColor({ color: color });
        })
        .catch((error) => {
          console.error("Status bar error:", error);
        });
    }
  }, [backgroundColor]);

  return <div id="main-scroll">{children}</div>;
}

export default MainLayout;
