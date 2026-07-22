import { Chat } from "stream-chat-react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import BottomNav from "./BottomNav";
import { useStreamChat } from "../context/StreamChatContext";

const Layout = ({ children, showSidebar = false }) => {
  const { client } = useStreamChat();

  const content = (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      <div className="flex">
        {showSidebar && <Sidebar />}
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">{children}</main>
        </div>
      </div>
      {showSidebar && <BottomNav />}
    </div>
  );

  return client ? <Chat client={client}>{content}</Chat> : content;
};

export default Layout;