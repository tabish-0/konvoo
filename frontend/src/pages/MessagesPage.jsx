import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useStreamChat } from "../context/StreamChatContext";
import useAuthUser from "../hooks/useAuthUser";
import { handleAvatarError } from "../lib/utils";
import { MessageCircleIcon, VideoIcon } from "lucide-react";

const formatTimestamp = (date) => {
  if (!date) return "";
  const now = new Date();
  const msgDate = new Date(date);
  const diffMs = now - msgDate;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return msgDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const MessagesPage = () => {
  const { client, onlineUserIds } = useStreamChat();
  const { authUser } = useAuthUser();
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChannels = async () => {
      if (!client || !authUser) return;
      try {
        const result = await client.queryChannels(
          { type: "messaging", members: { $in: [authUser._id] } },
          { last_message_at: -1 },
          { watch: true, state: true }
        );
        setChannels(result);
      } catch (err) {
        console.log("Error fetching channels:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchChannels();
  }, [client, authUser]);

  if (!client || loading) {
    return (
      <div className="flex justify-center py-24 bg-white dark:bg-gray-950 min-h-screen">
        <span className="loading loading-spinner loading-lg text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 lg:pl-56 bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors">
      <div className="container mx-auto max-w-3xl space-y-8">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Messages
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {channels.length} {channels.length === 1 ? "conversation" : "conversations"}
          </p>
        </div>

        {channels.length === 0 ? (
          <div className="text-center py-24 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center mx-auto mb-4">
              <MessageCircleIcon className="size-8 text-indigo-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-300 font-medium">No conversations yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-600 mt-1">
              Start chatting with a friend from your Friends list.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden divide-y divide-gray-100 dark:divide-gray-800">
            {channels.map((channel) => {
              const otherMember = Object.values(channel.state.members).find(
                (m) => m.user.id !== authUser._id
              );
              if (!otherMember) return null;

              const messages = channel.state.messages;
              const lastMessage = messages[messages.length - 1];
              const isOnline = onlineUserIds.has(otherMember.user.id);
              const unreadCount = channel.countUnread();
              const isCallLink = lastMessage?.text?.includes("/call/");

              return (
                <Link
                  key={channel.id}
                  to={`/chat/${otherMember.user.id}`}
                  className="flex items-center gap-4 p-4 sm:p-5 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors group"
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={otherMember.user.image}
                      alt={otherMember.user.name}
                      onError={(e) => handleAvatarError(e, otherMember.user.name)}
                      className="w-14 h-14 rounded-full object-cover border-2 border-gray-100 dark:border-gray-800 group-hover:border-indigo-200 dark:group-hover:border-indigo-800 transition-colors"
                    />
                    <span
                      className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-gray-900 ${
                        isOnline ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3
                        className={`truncate ${
                          unreadCount > 0
                            ? "font-bold text-gray-900 dark:text-white"
                            : "font-semibold text-gray-800 dark:text-gray-200"
                        }`}
                      >
                        {otherMember.user.name}
                      </h3>
                      <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
                        {formatTimestamp(lastMessage?.created_at)}
                      </span>
                    </div>
                    <p
                      className={`text-sm truncate mt-0.5 flex items-center gap-1 ${
                        unreadCount > 0
                          ? "text-gray-700 dark:text-gray-300 font-medium"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {isCallLink && <VideoIcon className="size-3.5 flex-shrink-0 text-green-500" />}
                      {isCallLink ? "Video call started" : lastMessage?.text || "Say hello 👋"}
                    </p>
                  </div>

                  {unreadCount > 0 && (
                    <span className="min-w-[22px] h-[22px] px-1.5 bg-indigo-600 text-white text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;