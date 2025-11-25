import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navigation from "../../components/dashboard/Navigation";
import LogoutConfirmPopup from "../../components/dashboard/LogoutConfirmPopup";
import { useUser } from "../../hooks/useUser";
import BecomeHostBanner from "../../components/dashboard/BecomeHostBanner";

export default function ProfilePage() {
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useUser();

  // Check if user is a verified host
  const isVerifiedHost =
    user?.role === "HOST" && user?.verificationStatus === "VERIFIED";

  // Calculate total reviews count for host's apartments - FIXED
  const getTotalReviewsCount = () => {
    if (!isVerifiedHost || !user?.apartments?.length) return 0;

    return user.apartments.reduce((total, apartment) => {
      return total + (apartment.totalReviews || 0);
    }, 0);
  };

  const totalReviews = getTotalReviewsCount();

  const handleLogout = () => {
    logout();
    navigate("/sign-in");
  };

  return (
    <div className="w-full min-h-screen bg-[#F9F9F9] pb-[80px]">
      {/* Header */}
      <div className="px-5 pt-[32px]">
        <h1 className="text-[24px] font-medium">My Profile</h1>
        <p className="text-sm text-gray-500">
          View and manage your profile details below
        </p>
      </div>

      {/* Host Info Card */}
      <div className="bg-white rounded-[5px] px-4 py-4 mt-4 mx-5 relative">
        <div className="flex items-center gap-2">
          <img
            src={user?.profilePic || "/images/profile-image.png"}
            alt={user?.firstName || "User"}
            className="w-[43px] h-[43px] mt-[-25px] rounded-full object-cover"
          />
          <div className="flex-1">
            <h2 className="text-[18px] font-medium text-[#333333]">
              {user ? `${user.firstName} ${user.lastName}` : "Guest User"}
            </h2>
            <div className="flex items-center text-[12px] gap-1 text-gray-600 mt-1">
              <img
                src="/icons/location.svg"
                alt="Location"
                className="w-[12px] h-[13px]"
              />
              <span>{user?.location?.state || "Location not set"}</span>
            </div>
            <div className="flex items-center gap-1 text-[#505050] text-[12px] mt-1">
              <img
                src="/icons/email.svg"
                alt="Email"
                className="w-[12px] h-[11px]"
              />
              <span className="no-underline" style={{ textDecoration: "none" }}>
                {user?.email || "Email not available"}
              </span>
            </div>
          </div>
          <Link to="/edit-profile">
            <button className="w-[33px] h-[33px] bg-[#A20BA2] rounded-full flex items-center justify-center">
              <img
                src="/icons/pen.svg"
                alt="Edit Profile"
                className="w-[12.37px] h-[12.37px]"
              />
            </button>
          </Link>
        </div>
      </div>

      <div className="relative mt-3">
        {/* Become a Host Banner - Now self-contained */}
        <BecomeHostBanner />
      </div>

      {/* Dashboard Options */}
      <div className="bg-white rounded-lg mt-3 mx-5">
        {/* Show only for VERIFIED hosts */}
        {isVerifiedHost && (
          <>
            <OptionItem
              icon="/icons/my-dashboard.svg"
              text="My Dashboard"
              link="/host-dashboard"
            />
            <OptionItem
              icon="/icons/my-revenue.svg"
              text="My Revenue History"
              link="/revenue"
            />{" "}
            <OptionItem
              icon="/icons/review.svg"
              text="Reviews"
              link="/host-reviews"
              badgeCount={totalReviews}
            />
          </>
        )}
        <OptionItem
          icon="/icons/change-bank.svg"
          text="Change Bank Details"
          link="/change-bank-details"
        />
      </div>

      {/* Account Options (Available for all users) */}
      <div className="bg-white rounded-lg mt-3 mb-10 mx-5">
        <OptionItem
          icon="/icons/change-password.svg"
          text="Change Password"
          link="/forgot-password"
        />
        <OptionItem icon="/icons/faq.svg" text="FAQ" link="/faq" />
        <OptionItem
          icon="/icons/support.svg"
          text="Support"
          link="mailto:support@letora.com"
        />
        <OptionItem
          icon="/icons/logout.svg"
          text="Logout"
          noArrow
          onClick={() => setShowLogout(true)}
        />
      </div>
      {showLogout && (
        <LogoutConfirmPopup
          onClose={() => setShowLogout(false)}
          onConfirm={handleLogout}
        />
      )}

      {/* Bottom Navigation */}
      <Navigation />
    </div>
  );
}

function OptionItem({ icon, text, link, noArrow, onClick, badgeCount }) {
  const content = (
    <div className="flex items-center justify-between px-4 py-6">
      <div className="flex items-center gap-3">
        <img src={icon} alt={text} className="w-[18px] h-[18px]" />
        <span
          className={`text-[14px] ${
            text === "Logout" ? "text-[#F81A0C]" : "text-[#333333]"
          }`}
        >
          {text}
        </span>
      </div>

      {!noArrow ? (
        badgeCount > 0 ? (
          <span className="bg-[#A20BA2] text-white text-xs font-medium w-[22px] h-[22px] flex items-center justify-center rounded-full">
            {badgeCount}
          </span>
        ) : (
          <img src="/icons/greater-than.svg" alt=">" className="w-3 h-3" />
        )
      ) : null}
    </div>
  );

  return link ? (
    <Link to={link}>{content}</Link>
  ) : (
    <button onClick={onClick} className="w-full text-left">
      {content}
    </button>
  );
}
