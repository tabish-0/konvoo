import { Link, useLocation } from "react-router";
import { HomeIcon, ShuffleIcon, MessageCircleIcon, BellIcon } from "lucide-react";
import { useStreamChat } from "../context/StreamChatContext";
import { useQuery } from "@tanstack/react-query";
import { getFriendRequests } from "../lib/api";

const BottomNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { totalUnreadCount } = useStreamChat();

  const { data: friendRequests } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
    refetchInterval: 10000,
  });
  const pendingCount = friendRequests?.incomingReqs?.length || 0;

  const items = [
    { path: "/", icon: HomeIcon, label: "Home" },
    { path: "/instant-connect", icon: ShuffleIcon, label: "Connect" },
    { path: "/messages", icon: MessageCircleIcon, label: "Chats", badge: totalUnreadCount },
    { path: "/notifications", icon: BellIcon, label: "Alerts", badge: pendingCount },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex items-center justify-around px-2 py-2">
      {items.map(({ path, icon: Icon, label, badge }) => {
        const isActive = currentPath === path;
        return (
          <Link
            key={path}
            to={path}
            className={`relative flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-colors ${
              isActive
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            <div className="relative">
              <Icon className="size-5" fill={isActive ? "currentColor" : "none"} strokeWidth={isActive ? 0 : 2} />
              {badge > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[16px] h-[16px] px-1 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {badge > 9 ? "9+" : badge}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;