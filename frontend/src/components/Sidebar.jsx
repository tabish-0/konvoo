import { useState } from "react";
import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import {
  BellIcon,
  HomeIcon,
  ShipWheelIcon,
  UsersIcon,
  MenuIcon,
  XIcon,
} from "lucide-react";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;
  const [isOpen, setIsOpen] = useState(false);

  const linkClasses = (path) =>
    `flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 ${
      currentPath === path
        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
        : "text-gray-600 hover:bg-gray-100 hover:text-indigo-600"
    }`;

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white border rounded-lg shadow-md"
        onClick={() => setIsOpen(true)}
      >
        <MenuIcon className="size-4 text-gray-700" />
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
  className={`fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col z-50 transform transition-transform duration-300
  ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
>
        {/* Close button (only mobile) */}
        <div className="lg:hidden flex justify-end p-4">
          <button onClick={() => setIsOpen(false)}>
            <XIcon className="size-6 text-gray-600" />
          </button>
        </div>

        {/* Logo */}
        <div className="p-3.5 border-b border-gray-200">
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
        <div className="p-4 border-t border-gray-200 mt-auto">
          <div className="flex items-center gap-3">
            <img
              src={authUser?.profilePic}
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover border border-gray-300"
            />
            <div className="flex-1">
              <p className="font-semibold text-sm text-gray-800">
                {authUser?.fullName}
              </p>
              <p className="text-xs text-green-500 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                Online
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
