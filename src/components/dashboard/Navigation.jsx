import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useUser } from "../../hooks/useUser";

export default function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useUser();

  // 🧭 Auto-redirect to correct home after user data loads
  useEffect(() => {
    if (!loading && user) {
      const homePath =
        user.role === "HOST" && user.hostProfile?.isVerified
          ? "/host-homepage"
          : "/guest-homepage";

      // Redirect only if the current route is mismatched
      if (
        (user.role === "HOST" &&
          location.pathname.includes("guest-homepage")) ||
        (user.role === "GUEST" && location.pathname.includes("host-homepage"))
      ) {
        navigate(homePath, { replace: true });
      }
    }
  }, [user, loading, location.pathname, navigate]);

  // 🧠 Prevent rendering before user initialization
  if (loading) return null;

  // 🏠 Dynamic nav items
  const navItems = [
    {
      name: "Home",
      paths: ["/guest-homepage", "/host-homepage"],
      icon: "/icons/home.svg",
      activeIcon: "/icons/home-purple.svg",
    },
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
      paths:
        user?.role === "HOST" && user?.hostProfile?.isVerified
          ? ["/host-dashboard"]
          : ["/bookings"],
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

  const getHomePath = () => {
    if (user?.role === "HOST" && user?.hostProfile?.isVerified)
      return "/host-homepage";
    return "/guest-homepage";
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md z-50">
      <div className="flex justify-around items-center h-[60px]">
        {navItems.map((item) => {
          const isActive = item.paths.some((p) =>
            location.pathname.startsWith(p)
          );

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
              <span
                className={`text-[12px] mt-1 ${isActive ? "font-medium" : ""}`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
