import { PushNotifications } from "@capacitor/push-notifications";
import { LocalNotifications } from "@capacitor/local-notifications";

class PushNotificationService {
  constructor() {
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      console.log("Starting push notification initialization...");

      // Request permissions
      const permissionStatus = await PushNotifications.requestPermissions();
      console.log("Permission status:", permissionStatus);

      if (permissionStatus.receive === "granted") {
        // Register for push notifications
        await PushNotifications.register();
        console.log("Push notifications registered successfully");
      } else {
        console.warn("Push notification permission denied");
        return;
      }

      // Setup listeners
      this.setupListeners();

      this.isInitialized = true;
      console.log("Push notification service initialized");
    } catch (error) {
      console.error("Failed to initialize push notifications:", error);
    }
  }

  setupListeners() {
    // Listen for registration
    PushNotifications.addListener("registration", (token) => {
      console.log("Push registration success. Token:", token.value);
      this.saveTokenToServer(token.value);
    });

    // Listen for registration errors
    PushNotifications.addListener("registrationError", (error) => {
      console.error("Push registration error:", error);
    });

    // Handle notifications when app is OPEN
    PushNotifications.addListener(
      "pushNotificationReceived",
      (notification) => {
        console.log("Push received (foreground):", notification);

        // Show a local notification when app is in foreground
        this.showLocalNotification(notification);
      }
    );

    // Handle notification taps (app was in background or closed)
    PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (notification) => {
        console.log("Push action performed:", notification);

        // Handle navigation or other actions
        this.handleNotificationAction(notification);
      }
    );
  }

  async saveTokenToServer(token) {
    try {
      // Replace with your backend endpoint
      const response = await fetch(
        "https://your-backend.com/api/save-push-token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token,
            platform: this.getPlatform(),
            userId: this.getUserId(),
          }),
        }
      );

      const data = await response.json();
      console.log("Token saved to server:", data);
    } catch (error) {
      console.error("Error saving token:", error);
    }
  }

  async showLocalNotification(notification) {
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: notification.title || "Notification",
            body: notification.body || "",
            id: new Date().getTime() % 100000, // Random ID
            extra: notification.data || {},
          },
        ],
      });
    } catch (error) {
      console.error("Error showing local notification:", error);
    }
  }

  handleNotificationAction(notification) {
    // Handle deep linking or navigation
    const data = notification.notification.data;

    if (data && data.url) {
      // Navigate to specific URL
      window.location.href = data.url;
    }

    // You can add more custom handling here
    if (data && data.type === "message") {
      // Navigate to messages page
      // history.push('/messages');
    }
  }

  getPlatform() {
    if (window.Capacitor && window.Capacitor.getPlatform) {
      return window.Capacitor.getPlatform();
    }
    return "web";
  }

  getUserId() {
    // Implement based on your auth system
    // Example: get from localStorage, context, or Redux
    return localStorage.getItem("userId") || "anonymous";
  }

  // Method to manually check permission
  async checkPermissions() {
    return await PushNotifications.checkPermissions();
  }

  // Method to get delivered notifications
  async getDeliveredNotifications() {
    return await PushNotifications.getDeliveredNotifications();
  }

  // Method to remove delivered notifications
  async removeDeliveredNotifications() {
    await PushNotifications.removeDeliveredNotifications();
  }
}

// Create a singleton instance
export const pushNotificationService = new PushNotificationService();
