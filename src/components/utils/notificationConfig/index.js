import hostNotificationConfigs from "./hostNotifications";
import guestNotificationConfigs from "./guestNotifications";

export const getNotificationConfig = (notification, userRole) => {
  const configs =
    userRole === "HOST" ? hostNotificationConfigs : guestNotificationConfigs;

  const configEntry = configs[notification.type];

  if (!configEntry) {
    // Fallback for unknown notifications
    return {
      image: "/icons/info.svg",
      heading: notification.title,
      message: notification.message,
      buttonText: "See Details",
    };
  }

  // If the config is a function, call it with the notification
  if (typeof configEntry === "function") {
    return configEntry(notification);
  }

  // Otherwise, just return the static object
  return configEntry;
};

export { hostNotificationConfigs, guestNotificationConfigs };
