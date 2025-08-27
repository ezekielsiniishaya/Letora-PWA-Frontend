import { Link, useLocation } from "react-router-dom";

export default function Navigation() {
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/guest-dashboard", icon: "/icons/home.svg" },
    {
      name: "New Listing",
      path: "/apartments",
      icon: "/icons/new-listing.svg",
    },
    { name: "Bookings", path: "/bookings", icon: "/icons/book.svg" },
    { name: "Favorites", path: "/favorites", icon: "/icons/heart.svg" },
    { name: "Profile", path: "/profile", icon: "/icons/profile.svg" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md z-50">
      <div className="flex justify-around items-center h-[60px]">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center ${
                isActive ? "text-[#A20BA2]" : "text-gray-600"
              }`}
            >
              <img src={item.icon} alt={item.name} className="w-5 h-5" />
              <span className="text-[12px] mt-1">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
