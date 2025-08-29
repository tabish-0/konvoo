import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, ShipWheelIcon } from "lucide-react";
import useLogout from "../hooks/useLogout";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");
  const { logoutMutation } = useLogout();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-30 h-16 flex items-center shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo only on chat page */}
        {isChatPage && (
          <Link to="/" className="flex items-center gap-2.5">
            <ShipWheelIcon className="size-8 text-indigo-600" />
            <span className="text-2xl font-bold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-500">
              Streamify
            </span>
          </Link>
        )}

        <div className="flex items-center gap-4 ml-auto">
          {/* Notifications */}
          <Link
            to="/notifications"
            className="relative p-2 rounded-full hover:bg-gray-100 transition"
          >
            <BellIcon className="h-6 w-6 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </Link>

          {/* User avatar */}
          <img
            src={authUser?.profilePic}
            alt="User Avatar"
            className="w-8 h-8 rounded-full object-cover border border-gray-300"
          />

          {/* Logout */}
          <button
            onClick={logoutMutation}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <LogOutIcon className="h-6 w-6 text-gray-600" />
          </button>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
