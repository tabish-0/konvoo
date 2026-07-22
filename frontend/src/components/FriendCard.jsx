import { Link } from "react-router";
import { LANGUAGE_TO_FLAG } from "../constants";
import { useStreamChat } from "../context/StreamChatContext";
import { handleAvatarError } from "../lib/utils";

const FriendCard = ({ friend }) => {
  const { onlineUserIds } = useStreamChat();
  const isOnline = onlineUserIds.has(friend._id);

  return (
    <div className="card bg-base-200 dark:bg-gray-900 shadow-sm rounded-md hover:shadow-lg transition-shadow">
      <div className="card-body p-4">
        {/* USER INFO */}
        <div className="flex items-center gap-3 mb-3">
          <div className="avatar size-12 relative">
            <img
              src={friend.profilePic}
              alt={friend.fullName}
              onError={(e) => handleAvatarError(e, friend.fullName)}
              className="rounded-full"
            />
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 ${
                isOnline ? "bg-green-500" : "bg-gray-300"
              }`}
            />
          </div>
          <div>
            <h3 className="font-semibold truncate text-gray-800 dark:text-gray-100">{friend.fullName}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{isOnline ? "Online" : "Offline"}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 mb-3">
          <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 text-xs font-medium flex items-center gap-1">
            {getLanguageFlag(friend.nativeLanguage)}
            Native: {friend.nativeLanguage}
          </span>
          <span className="px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-300 text-xs font-medium flex items-center gap-1">
            {getLanguageFlag(friend.learningLanguage)}
            Learning: {friend.learningLanguage}
          </span>
        </div>
        <Link
          to={`/chat/${friend._id}`}
          className="btn flex items-center justify-center btn-outline mt-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-none hover:shadow-md hover:scale-[1.02] active:scale-[0.98] rounded-md p-1"
        >
          Message
        </Link>
      </div>
    </div>
  );
};
export default FriendCard;

export function getLanguageFlag(language) {
  if (!language) return null;
  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];
  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-3 mr-1 inline-block"
      />
    );
  }
  return null;
}