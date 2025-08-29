import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router";
import {
  CheckCircleIcon,
  MapPinIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";

import { capitialize } from "../lib/utils";

import FriendCard, { getLanguageFlag } from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  });

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        outgoingIds.add(req.recipient._id);
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  return (
    <div className="p-4 sm:p-6 lg:p-5 lg:pl-66 bg-white min-h-screen">
      <div className="container mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Your Friends
          </h2>
          <Link
            to="/notifications"
            className="btn btn-outline btn-sm rounded-full flex items-center gap-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50"
          >
            <UsersIcon className="size-6" />
            Friend Requests
          </Link>
        </div>

        {/* Friends Section */}
        {loadingFriends ? (
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

        {/* Meet New Learners Section */}
        <section>
          <div className="mb-6 sm:mb-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Meet New Learners
                </h2>
                <p className="opacity-70 text-sm sm:text-base text-gray-600">
                  Discover perfect language exchange partners based on your
                  profile
                </p>
              </div>
            </div>
          </div>

          {loadingUsers ? (
            <div className="flex justify-center py-16">
              <span className="loading loading-spinner loading-lg text-indigo-600" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="card bg-indigo-50 p-10 text-center rounded-2xl shadow-sm border border-indigo-100">
              <h3 className="font-semibold text-xl mb-3 text-indigo-700">
                No recommendations available
              </h3>
              <p className="text-gray-600 mb-4">
                Check back later for new language partners!
              </p>
              <button className="btn bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 text-white rounded-full">
                Refresh Suggestions
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

                return (
                  <div
                    key={user._id}
                    className="card rounded-2xl bg-white border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 hover:border-indigo-200"
                  >
                    <div className="card-body p-6 space-y-5">
                      {/* Profile Header */}
                      <div className="flex items-center gap-4">
                        <div className="avatar">
                          <div className="w-16 h-16 rounded-full ring-2 bg-gradient-to-r from-indigo-500 to-purple-500 p-0.5">
                            <img
                              src={user.profilePic}
                              alt={user.fullName}
                              className="rounded-full"
                            />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-gray-800">
                            {user.fullName}
                          </h3>
                          {user.location && (
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <MapPinIcon className="size-3 mr-1" />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Languages */}
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-medium flex items-center gap-1">
                          {getLanguageFlag(user.nativeLanguage)}
                          Native: {capitialize(user.nativeLanguage)}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-xs font-medium flex items-center gap-1">
                          {getLanguageFlag(user.learningLanguage)}
                          Learning: {capitialize(user.learningLanguage)}
                        </span>
                      </div>

                      {/* Bio */}
                      {user.bio && (
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {user.bio}
                        </p>
                      )}

                      {/* Action Button */}
                      <button
                        className={`btn w-full mt-2 p-2 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2
                        ${
                          hasRequestBeenSent
                            ? "btn-disabled bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-none hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                        }`}
                        onClick={() => sendRequestMutation(user._id)}
                        disabled={hasRequestBeenSent || isPending}
                      >
                        {isPending && !hasRequestBeenSent ? (
                          <span className="loading loading-spinner loading-sm"></span>
                        ) : hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="size-4" />
                            <span>Request Sent</span>
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4" />
                            <span>Send Friend Request</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
