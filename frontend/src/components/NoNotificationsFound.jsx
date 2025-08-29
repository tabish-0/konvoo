import { BellIcon } from "lucide-react";

function NoNotificationsFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {/* Icon with gradient background ring */}
      <div className="size-20 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 p-[2px] flex items-center justify-center mb-6 shadow-md">
        <div className="size-full rounded-full bg-white flex items-center justify-center">
          <BellIcon className="size-9 text-indigo-600 opacity-70" />
        </div>
      </div>

      {/* Heading */}
      <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        No Notifications Yet
      </h3>

      {/* Subtext */}
      <p className="text-gray-600 opacity-80 max-w-md text-sm sm:text-base">
        When you receive <span className="font-medium">friend requests</span> or{" "}
        <span className="font-medium">messages</span>, they’ll appear here.
      </p>

      {/* Optional action button */}
      <button className="mt-6 btn p-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90 shadow">
        Refresh
      </button>
    </div>
  );
}

export default NoNotificationsFound;
