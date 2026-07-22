import { useQuery } from "@tanstack/react-query";
import { getUserFriends } from "../lib/api";
import { UsersIcon } from "lucide-react";
import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";

const FriendsPage = () => {
  const { data: friends = [], isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 lg:pl-56 bg-white dark:bg-gray-950 min-h-screen transition-colors">
      <div className="container mx-auto max-w-6xl space-y-8">
        <div className="flex items-center gap-3">
          <UsersIcon className="size-8 text-indigo-600" />
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Your Friends
          </h1>
          <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 text-sm font-medium">
            {friends.length}
          </span>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <span className="loading loading-spinner loading-lg text-indigo-600" />
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default FriendsPage;