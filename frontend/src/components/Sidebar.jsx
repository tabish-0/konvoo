import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import {
  BellIcon,
  HomeIcon,
  ShipWheelIcon,
  UsersIcon,
} from "lucide-react";
import { handleAvatarError } from "../lib/utils";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  const linkClasses = (path) =>
    `flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 ${
      currentPath === path
        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-indigo-600"
    }`;

  return (
    <aside className="hidden lg:flex fixed top-0 left-0 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-col z-50">
      {/* Logo */}
      <div className="p-3.5 border-b border-gray-200 dark:border-gray-800">
        <Link to="/" className="flex items-center gap-2.5">
          <ShipWheelIcon className="size-9 text-indigo-600" />
          <span className="text-3xl font-bold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-500">
            Streamify
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <Link to="/" className={linkClasses("/")}>
          <HomeIcon className="size-5" />
          <span>Home</span>
        </Link>
        <Link to="/friends" className={linkClasses("/friends")}>
          <UsersIcon className="size-5" />
          <span>Friends</span>
        </Link>
        <Link to="/notifications" className={linkClasses("/notifications")}>
          <BellIcon className="size-5" />
          <span>Notifications</span>
        </Link>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 mt-auto">
        <Link to="/profile" className="flex items-center gap-3 hover:opacity-80 transition">
          <img
            src={authUser?.profilePic}
            alt="User Avatar"
            onError={(e) => handleAvatarError(e, authUser?.fullName)}
            className="w-10 h-10 rounded-full object-cover border border-gray-300"
          />
          <div className="flex-1">
            <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">
              {authUser?.fullName}
            </p>
            <p className="text-xs text-green-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              Online
            </p>
          </div>
        </Link>
      </div>
    </aside>
  );
};
export default Sidebar;