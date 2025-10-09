import { Link, useLocation } from "react-router-dom";
import { useUser } from "../../hooks/useUser"; // Adjust path as needed

export default function Navigation() {
  const location = useLocation();
  const { user } = useUser(); // Get user data from context

  // Only show "New Listing" if user is a verified host
  const navItems = [
    {
      name: "Home",
      paths: ["/guest-homepage", "/host-homepage"],
      icon: "/icons/home.svg",
      activeIcon: "/icons/home-purple.svg",
    },
    // Conditionally include New Listing
    ...(user?.role === "HOST" && user?.hostProfile?.isVerified
      ? [
          {
            name: "New Listing",
            paths: ["/guest-listing"],
            icon: "/icons/new-listing.svg",
            activeIcon: "/icons/new-listing-purple.svg",
          },
        ]
      : []),
    {
      name: "Bookings",
      paths: user?.role === "HOST" ? ["/host-dashboard"] : ["/bookings"],
      icon: "/icons/booking.svg",
      activeIcon: "/icons/booking-purple.svg",
    },
    {
      name: "Favorites",
      paths: ["/favorites"],
      icon: "/icons/heart.svg",
      activeIcon: "/icons/favorite-purple.svg",
    },
    {
      name: "Profile",
      paths: ["/profile"],
      icon: "/icons/profile.svg",
      activeIcon: "/icons/profile-purple.svg",
    },
  ];
  // Function to determine the correct home path based on user role
  const getHomePath = () => {
    // Use user role from localStorage if available
    if (user?.role === "HOST") {
      return "/host-homepage";
    }

    // Fallback: check current URL path
    if (
      location.pathname.includes("/host-") ||
      location.pathname === "/host-dashboard"
    ) {
      return "/host-homepage";
    }

    // Default to guest homepage
    return "/guest-homepage";
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md z-50">
      <div className="flex justify-around items-center h-[60px]">
        {navItems.map((item) => {
          const isActive = item.paths.some((p) =>
            location.pathname.startsWith(p)
          );

          // For Home item, use dynamic path based on user role
          // For other items, use the first path in the list
          const targetPath =
            item.name === "Home" ? getHomePath() : item.paths[0];

          return (
            <Link
              key={item.name}
              to={targetPath}
              className={`flex flex-col items-center ${
                isActive ? "text-[#A20BA2]" : "text-gray-600"
              }`}
            >
              <img
                src={isActive ? item.activeIcon : item.icon}
                alt={item.name}
                className="w-5 h-5"
              />
              <span className="text-[12px] mt-1">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
