import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Channel, ChannelHeader, MessageInput, MessageList, TypingIndicator, Window } from "stream-chat-react";
import toast from "react-hot-toast";
import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";
import QuotedReplyMessage from "../components/QuotedReplyMessage";
import { useStreamChat } from "../context/StreamChatContext";
import useAuthUser from "../hooks/useAuthUser";

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const { client } = useStreamChat();
  const { authUser } = useAuthUser();
  const navigate = useNavigate();
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const tryInit = async (attempt = 1) => {
      if (!client || !authUser || !targetUserId) return;
      try {
        const channelId = [authUser._id, targetUserId].sort().join("-");
        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });
        await currChannel.watch();
        if (!cancelled) {
          setChannel(currChannel);
          setLoading(false);
        }
      } catch (error) {
        console.error(`Error initializing chat (attempt ${attempt}):`, error);
        if (attempt < 3 && !cancelled) {
          setTimeout(() => tryInit(attempt + 1), 1000);
        } else if (!cancelled) {
          toast.error("Could not connect to chat. Please try again.");
          setLoading(false);
        }
      }
    };

    tryInit();
    return () => {
      cancelled = true;
    };
  }, [client, authUser, targetUserId]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}?type=video`;
      channel.sendMessage({ text: `I've started a video call. Join me here: ${callUrl}` });
      toast.success("Video call link sent successfully!");
    }
  };

  const handleAreaClick = (e) => {
    const anchor = e.target.closest("a");
    if (!anchor) return;
    const href = anchor.getAttribute("href");
    if (href && href.includes("/call/")) {
      e.preventDefault();
      try {
        const url = new URL(href, window.location.origin);
        navigate(url.pathname + url.search);
      } catch {
        navigate(href);
      }
    }
  };

  if (loading || !client || !channel) return <ChatLoader />;

  return (
    <div
      className="fixed inset-0 top-16 flex flex-col overflow-hidden"
      onClick={handleAreaClick}
    >
      <Channel channel={channel} Message={QuotedReplyMessage}>
        <div className="flex-1 flex flex-col min-h-0 relative">
          <CallButton handleVideoCall={handleVideoCall} />
          <Window>
            <ChannelHeader />
            <div className="flex-1 overflow-y-auto min-h-0">
              <MessageList />
            </div>
            <TypingIndicator />
            <MessageInput focus />
          </Window>
        </div>
      </Channel>
    </div>
  );
};

export default ChatPage;