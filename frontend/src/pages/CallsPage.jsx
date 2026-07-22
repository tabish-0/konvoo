import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { getUserFriends } from "../lib/api";
import { handleAvatarError } from "../lib/utils";
import { useStreamChat } from "../context/StreamChatContext";
import useAuthUser from "../hooks/useAuthUser";
import { PhoneIcon, VideoIcon } from "lucide-react";
import NoFriendsFound from "../components/NoFriendsFound";

const CallsPage = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthUser();
  const { onlineUserIds } = useStreamChat();

  const { data: friends = [], isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const startCall = (friendId) => {
    if (!authUser) return;
    const callId = [authUser._id, friendId].sort().join("-");
    navigate(`/call/${callId}`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 lg:pl-56 bg-white dark:bg-gray-950 min-h-screen transition-colors">
      <div className="container mx-auto max-w-3xl space-y-6">
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Calls
        </h1>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <span className="loading loading-spinner loading-lg text-indigo-600" />
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden divide-y divide-gray-100 dark:divide-gray-800">
            {friends.map((friend) => {
              const isOnline = onlineUserIds.has(friend._id);
              return (
                <div
                  key={friend._id}
                  className="flex items-center gap-4 p-4 sm:p-5 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={friend.profilePic}
                      alt={friend.fullName}
                      onError={(e) => handleAvatarError(e, friend.fullName)}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 ${
                        isOnline ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100 truncate">
                      {friend.fullName}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {isOnline ? "Online" : "Offline"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => startCall(friend._id)}
                      className="p-2.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition"
                      title="Audio call"
                    >
                      <PhoneIcon className="size-4" />
                    </button>
                    <button
                      onClick={() => startCall(friend._id)}
                      className="p-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90 transition"
                      title="Video call"
                    >
                      <VideoIcon className="size-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CallsPage;