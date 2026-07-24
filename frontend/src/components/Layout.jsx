import { Chat } from "stream-chat-react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import BottomNav from "./BottomNav";
import { useStreamChat } from "../context/StreamChatContext";
import { useTheme } from "../context/ThemeContext";

const Layout = ({ children, showSidebar = false }) => {
  const { client } = useStreamChat();
  const { theme } = useTheme();

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

  return client ? (
    <Chat client={client} theme={theme === "dark" ? "str-chat__theme-dark" : "str-chat__theme-light"}>
      {content}
    </Chat>
  ) : (
    content
  );
};

export default Layout;