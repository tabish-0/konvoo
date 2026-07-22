import { useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Thread,
  TypingIndicator,
  Window,
} from "stream-chat-react";
import toast from "react-hot-toast";
import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";
import { useStreamChat } from "../context/StreamChatContext";
import useAuthUser from "../hooks/useAuthUser";

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const { client } = useStreamChat();
  const { authUser } = useAuthUser();
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initChannel = async () => {
      if (!client || !authUser || !targetUserId) return;
      try {
        const channelId = [authUser._id, targetUserId].sort().join("-");
        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });
        await currChannel.watch();
        setChannel(currChannel);
      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error("Could not connect to chat. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    initChannel();
  }, [client, authUser, targetUserId]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;
      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });
      toast.success("Video call link sent successfully!");
    }
  };

  if (loading || !client || !channel) return <ChatLoader />;

  return (
    <div className="h-[90vh]">
      <Channel channel={channel}>
        <div className="w-full relative">
          <CallButton handleVideoCall={handleVideoCall} />
          <Window>
            <ChannelHeader />
            <MessageList />
            <TypingIndicator />
            <MessageInput focus />
          </Window>
        </div>
        <Thread />
      </Channel>
    </div>
  );
};
export default ChatPage;