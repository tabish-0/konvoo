import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, ShipWheelIcon, MessageCircleIcon, SunIcon, MoonIcon } from "lucide-react";
import useLogout from "../hooks/useLogout";
import { useStreamChat } from "../context/StreamChatContext";
import { useTheme } from "../context/ThemeContext";
import { handleAvatarError } from "../lib/utils";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");
  const { logoutMutation } = useLogout();
  const { totalUnreadCount } = useStreamChat();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30 h-16 flex items-center shadow-sm transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

        <Link to="/" className="flex items-center gap-2.5">
        <ShipWheelIcon className="size-6 text-indigo-600" />
        <h2 className="text-2xl pb-1 sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Konvoo
        </h2>
        </Link>
        {/* Logo only on chat page */}
        {/* {isChatPage && (
          <Link to="/" className="flex items-center gap-2.5">
            <ShipWheelIcon className="size-8 text-indigo-600" />
            <span className="text-2xl font-bold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-500">
              Konvoo
            </span>
          </Link>
        )} */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            {theme === "light" ? (
              <MoonIcon className="h-6 w-6 text-gray-600" />
            ) : (
              <SunIcon className="h-6 w-6 text-yellow-400" />
            )}
          </button>

          {/* Messages / unread count */}
          {/* <Link
            to="/messages"
            className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <MessageCircleIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            {totalUnreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {totalUnreadCount > 9 ? "9+" : totalUnreadCount}
              </span>
            )}
          </Link> */}

          {/* Notifications */}
          {/* <Link
            to="/notifications"
            className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <BellIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </Link> */}

          {/* User avatar -> profile */}
          <Link to="/profile">
            <img
              src={authUser?.profilePic}
              alt="User Avatar"
              onError={(e) => handleAvatarError(e, authUser?.fullName)}
              className="w-8 h-8 rounded-full object-cover border border-gray-300"
            />
          </Link>

          {/* Logout */}
          <button
            onClick={logoutMutation}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <LogOutIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;