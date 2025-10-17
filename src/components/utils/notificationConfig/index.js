import hostNotificationConfigs from "./hostNotifications";
import guestNotificationConfigs from "./guestNotifications";

export const getNotificationConfig = (notification, userRole) => {
  const configs =
    userRole === "HOST" ? hostNotificationConfigs : guestNotificationConfigs;

  return (
    configs[notification.type] || {
      image: "/icons/info.svg",
      heading: notification.title,
      message: notification.message,
      buttonText: "See Details",
    }
  );
};

export { hostNotificationConfigs, guestNotificationConfigs };
