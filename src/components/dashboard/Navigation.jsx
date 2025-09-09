import { Link, useLocation } from "react-router-dom";

export default function Navigation() {
  const location = useLocation();

  const navItems = [
    {
      name: "Home",
      paths: ["/guest-dashboard", "/host-home"], // supports both
      icon: "/icons/home.svg",
      activeIcon: "/icons/home-purple.svg",
    },
    {
      name: "New Listing",
      paths: ["/guest-listing"],
      icon: "/icons/new-listing.svg",
      activeIcon: "/icons/new-listing-purple.svg",
    },
    {
      name: "Bookings",
      paths: ["/bookings"],
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

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md z-50">
      <div className="flex justify-around items-center h-[60px]">
        {navItems.map((item) => {
          const isActive = item.paths.some((p) =>
            location.pathname.startsWith(p)
          );

          // Always use the first path in the list as the navigation target
          const targetPath = item.paths[0];

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
