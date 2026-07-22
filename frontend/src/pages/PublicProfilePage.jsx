import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router";
import { getUserProfile } from "../lib/api";
import { getLanguageFlag } from "../components/FriendCard";
import { handleAvatarError } from "../lib/utils";
import { MapPinIcon, MessageCircleIcon } from "lucide-react";

const PublicProfilePage = () => {
  const { id } = useParams();
  const { data: user, isLoading } = useQuery({
    queryKey: ["userProfile", id],
    queryFn: () => getUserProfile(id),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <span className="loading loading-spinner loading-lg text-indigo-600" />
      </div>
    );
  }

  if (!user) {
    return <div className="text-center py-24 text-gray-500">User not found.</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 lg:pl-56 bg-white dark:bg-gray-950 min-h-screen transition-colors">
      <div className="container mx-auto max-w-2xl space-y-6">
        <div className="p-8 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 text-center">
          <img
            src={user.profilePic}
            alt={user.fullName}
            onError={(e) => handleAvatarError(e, user.fullName)}
            className="w-24 h-24 rounded-full object-cover border-2 border-indigo-200 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.fullName}</h1>
          {user.location && (
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1 mt-1">
              <MapPinIcon className="size-3" /> {user.location}
            </p>
          )}

          <div className="flex justify-center gap-2 mt-4">
            <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 text-xs font-medium flex items-center gap-1">
              {getLanguageFlag(user.nativeLanguage)}
              Native: {user.nativeLanguage}
            </span>
            <span className="px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-300 text-xs font-medium flex items-center gap-1">
              {getLanguageFlag(user.learningLanguage)}
              Learning: {user.learningLanguage}
            </span>
          </div>

          {user.bio && (
            <p className="text-gray-600 dark:text-gray-400 mt-5 max-w-md mx-auto">{user.bio}</p>
          )}

          <Link
            to={`/chat/${user._id}`}
            className="inline-flex items-center gap-2 mt-6 px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:opacity-90 transition"
          >
            <MessageCircleIcon className="size-4" />
            Message
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PublicProfilePage;