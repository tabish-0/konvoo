import { MessageSimple, useMessageContext, useChannelActionContext } from "stream-chat-react";
import { ReplyIcon } from "lucide-react";

const QuotedReplyMessage = (props) => {
  const { message } = useMessageContext();
  const { setQuotedMessage } = useChannelActionContext();

  return (
    <div className="group relative">
      <MessageSimple {...props} />
      <button
        onClick={() => setQuotedMessage(message)}
        className="hidden group-hover:flex items-center justify-center absolute top-1 right-1 p-1.5 rounded-full bg-white dark:bg-gray-800 shadow border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition z-10"
        title="Reply"
      >
        <ReplyIcon className="size-3.5 text-gray-500 dark:text-gray-300" />
      </button>
    </div>
  );
};

export default QuotedReplyMessage;