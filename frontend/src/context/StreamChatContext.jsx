import { createContext, useContext, useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import useAuthUser from "../hooks/useAuthUser";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;
const StreamChatContext = createContext();

export const StreamChatProvider = ({ children }) => {
  const { authUser } = useAuthUser();
  const [client, setClient] = useState(null);
  const [onlineUserIds, setOnlineUserIds] = useState(new Set());
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    if (!tokenData?.token || !authUser) return;

    let didUnmount = false;
    const chatClient = StreamChat.getInstance(STREAM_API_KEY);

    const connect = async () => {
      await chatClient.connectUser(
        { id: authUser._id, name: authUser.fullName, image: authUser.profilePic },
        tokenData.token
      );
      if (didUnmount) return;

      setClient(chatClient);
      setTotalUnreadCount(chatClient.user?.total_unread_count || 0);

      // Get initial presence for friends list
      try {
        const friendIds = authUser.friends || [];
        if (friendIds.length > 0) {
          const response = await chatClient.queryUsers(
            { id: { $in: friendIds } },
            {},
            { presence: true }
          );
          const online = new Set(
            response.users.filter((u) => u.online).map((u) => u.id)
          );
          if (!didUnmount) setOnlineUserIds(online);
        }
      } catch (err) {
        console.log("Error fetching presence:", err.message);
      }

      // Track unread count changes in real time
      chatClient.on("notification.message_new", () => {
        setTotalUnreadCount(chatClient.user?.total_unread_count || 0);
      });
      chatClient.on("notification.mark_read", () => {
        setTotalUnreadCount(chatClient.user?.total_unread_count || 0);
      });

      // Track presence changes
      chatClient.on("user.presence.changed", (event) => {
        setOnlineUserIds((prev) => {
          const updated = new Set(prev);
          if (event.user.online) updated.add(event.user.id);
          else updated.delete(event.user.id);
          return updated;
        });
      });
    };

    connect();

    return () => {
      didUnmount = true;
      chatClient.disconnectUser();
      setClient(null);
    };
  }, [tokenData, authUser]);

  return (
    <StreamChatContext.Provider value={{ client, onlineUserIds, totalUnreadCount, setOnlineUserIds }}>
      {children}
    </StreamChatContext.Provider>
  );
};

export const useStreamChat = () => useContext(StreamChatContext);