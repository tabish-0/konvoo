import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest, getFriendRequests } from "../lib/api";
import {
  BellIcon,
  ClockIcon,
  MessageSquareIcon,
  UserCheckIcon,
} from "lucide-react";
import NoNotificationsFound from "../components/NoNotificationsFound";

const NotificationsPage = () => {
  const queryClient = useQueryClient();

  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { mutate: acceptRequestMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const incomingRequests = friendRequests?.incomingReqs || [];
  const acceptedRequests = friendRequests?.acceptedReqs || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 lg:pl-50 bg-white min-h-screen">
      <div className="container mx-auto max-w-4xl space-y-12">
        {/* Page Title */}
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Notifications
        </h1>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-indigo-600"></span>
          </div>
        ) : (
          <>
            {/* Incoming Friend Requests */}
            {incomingRequests.length > 0 && (
              <section className="space-y-5">
                <h2 className="text-xl font-semibold flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  <UserCheckIcon className="h-5 w-5" />
                  Friend Requests
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-600 text-xs font-medium">
                    {incomingRequests.length}
                  </span>
                </h2>

                <div className="space-y-4">
                  {incomingRequests.map((request) => (
                    <div
                      key={request._id}
                      className="card rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="card-body p-5">
                        <div className="flex items-center justify-between gap-4">
                          {/* Avatar + Info */}
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-r from-indigo-500 to-purple-600">
                              <img
                                src={request.sender.profilePic}
                                alt={request.sender.fullName}
                                className="rounded-full w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800">
                                {request.sender.fullName}
                              </h3>
                              <div className="flex flex-wrap gap-2 mt-1 text-xs">
                                <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
                                  Native: {request.sender.nativeLanguage}
                                </span>
                                <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-600">
                                  Learning: {request.sender.learningLanguage}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Action */}
                          <button
                            className="btn btn-sm rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90 border-none px-4"
                            onClick={() => acceptRequestMutation(request._id)}
                            disabled={isPending}
                          >
                            {isPending ? (
                              <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                              "Accept"
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Accepted Requests / New Connections */}
            {acceptedRequests.length > 0 && (
              <section className="space-y-5">
                <h2 className="text-xl font-semibold flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  <BellIcon className="h-5 w-5" />
                  New Connections
                </h2>

                <div className="space-y-4">
                  {acceptedRequests.map((notification) => (
                    <div
                      key={notification._id}
                      className="card rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="card-body p-5">
                        <div className="flex items-start gap-4">
                          {/* Avatar */}
                          <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-r from-green-500 to-emerald-500">
                            <img
                              src={notification.recipient.profilePic}
                              alt={notification.recipient.fullName}
                              className="rounded-full w-full h-full object-cover"
                            />
                          </div>

                          {/* Info */}
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800">
                              {notification.recipient.fullName}
                            </h3>
                            <p className="text-sm text-gray-600 my-1">
                              accepted your friend request 🎉
                            </p>
                            <p className="text-xs flex items-center text-gray-400">
                              <ClockIcon className="h-3 w-3 mr-1" />
                              Recently
                            </p>
                          </div>

                          {/* Badge */}
                          <div className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-600 flex items-center gap-1 font-medium">
                            <MessageSquareIcon className="h-3 w-3" />
                            New Friend
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Empty State */}
            {incomingRequests.length === 0 &&
              acceptedRequests.length === 0 && <NoNotificationsFound />}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
