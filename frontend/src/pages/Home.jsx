import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";
import {
  CheckCircleIcon,
  MapPinIcon,
  UserPlusIcon,
  UsersIcon,
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XIcon,
  CompassIcon,
} from "lucide-react";

import { capitialize, handleAvatarError } from "../lib/utils";
import { LANGUAGES } from "../constants";

import FriendCard, { getLanguageFlag } from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());
  const [activeTab, setActiveTab] = useState("friends"); // "friends" | "discover"

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [nativeFilter, setNativeFilter] = useState("");
  const [learningFilter, setLearningFilter] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [nativeFilter, learningFilter]);

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedData, isLoading: loadingUsers } = useQuery({
    queryKey: ["users", debouncedSearch, nativeFilter, learningFilter, page],
    queryFn: () =>
      getRecommendedUsers({
        search: debouncedSearch,
        nativeLanguage: nativeFilter,
        learningLanguage: learningFilter,
        page,
        limit: 9,
      }),
    keepPreviousData: true,
    enabled: activeTab === "discover",
  });

  const recommendedUsers = recommendedData?.users || [];
  const totalPages = recommendedData?.totalPages || 1;

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

  const clearFilters = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setNativeFilter("");
    setLearningFilter("");
    setPage(1);
  };

  const hasActiveFilters = debouncedSearch || nativeFilter || learningFilter;

  return (
    <div className="p-4 sm:p-6 lg:p-5 lg:pl-66 bg-white dark:bg-gray-950 min-h-screen transition-colors">
      <div className="container mx-auto max-w-6xl space-y-6">
        {/* Header */}

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-gray-100 dark:bg-gray-900 w-fit">
          <button
            onClick={() => setActiveTab("friends")}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "friends"
                ? "bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            <UsersIcon className="size-4" />
            Friends
            {friends.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 text-xs">
                {friends.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("discover")}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "discover"
                ? "bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            <CompassIcon className="size-4" />
            Discover
          </button>
        </div>

        {/* Friends Tab */}
        {activeTab === "friends" && (
          <section>
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
          </section>
        )}

        {/* Discover Tab */}
        {activeTab === "discover" && (
          <section className="space-y-6">
            {/* Search + Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search by name..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                />
              </div>

              <select
                value={nativeFilter}
                onChange={(e) => setNativeFilter(e.target.value)}
                className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
              >
                <option value="">Any native language</option>
                {LANGUAGES.map((l) => (
                  <option key={l} value={l.toLowerCase()}>{l}</option>
                ))}
              </select>

              <select
                value={learningFilter}
                onChange={(e) => setLearningFilter(e.target.value)}
                className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
              >
                <option value="">Any learning language</option>
                {LANGUAGES.map((l) => (
                  <option key={l} value={l.toLowerCase()}>{l}</option>
                ))}
              </select>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition text-sm"
                >
                  <XIcon className="size-4" /> Clear
                </button>
              )}
            </div>

            {loadingUsers ? (
              <div className="flex justify-center py-16">
                <span className="loading loading-spinner loading-lg text-indigo-600" />
              </div>
            ) : recommendedUsers.length === 0 ? (
              <div className="card bg-indigo-50 dark:bg-indigo-950 p-10 text-center rounded-2xl shadow-sm border border-indigo-100 dark:border-indigo-900">
                <h3 className="font-semibold text-xl mb-3 text-indigo-700 dark:text-indigo-300">
                  No matches found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {hasActiveFilters
                    ? "Try adjusting your search or filters."
                    : "Check back later for new language partners!"}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="btn bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 text-white rounded-full mx-auto"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendedUsers.map((user) => {
                    const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

                    return (
                      <div
                        key={user._id}
                        className="card rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-md hover:shadow-lg transition-all duration-300 hover:border-indigo-200 dark:hover:border-indigo-800"
                      >
                        <div className="card-body p-6 space-y-5">
                          <div className="flex items-center gap-4">
                            <div className="avatar">
                              <div className="w-16 h-16 rounded-full ring-2 bg-gradient-to-r from-indigo-500 to-purple-500 p-0.5">
                                <img
                                  src={user.profilePic}
                                  alt={user.fullName}
                                  onError={(e) => handleAvatarError(e, user.fullName)}
                                  className="rounded-full"
                                />
                              </div>
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
                                {user.fullName}
                              </h3>
                              {user.location && (
                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  <MapPinIcon className="size-3 mr-1" />
                                  {user.location}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 text-xs font-medium flex items-center gap-1">
                              {getLanguageFlag(user.nativeLanguage)}
                              Native: {capitialize(user.nativeLanguage)}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-300 text-xs font-medium flex items-center gap-1">
                              {getLanguageFlag(user.learningLanguage)}
                              Learning: {capitialize(user.learningLanguage)}
                            </span>
                          </div>

                          {user.bio && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                              {user.bio}
                            </p>
                          )}

                          <button
                            className={`btn w-full mt-2 p-2 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2
                            ${
                              hasRequestBeenSent
                                ? "btn-disabled bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-500 cursor-not-allowed"
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

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-4">
                    <button
                      onClick={() => setPage((p) => Math.max(p - 1, 1))}
                      disabled={page === 1}
                      className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                      <ChevronLeftIcon className="size-4" />
                    </button>

                    <span className="text-sm text-gray-600 dark:text-gray-400 px-3">
                      Page {page} of {totalPages}
                    </span>

                    <button
                      onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                      disabled={page === totalPages}
                      className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                      <ChevronRightIcon className="size-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default HomePage;