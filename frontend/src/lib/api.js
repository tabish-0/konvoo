import { axiosInstance } from "./axios";
export const signup = async (signupData) => (await axiosInstance.post("/auth/signup", signupData)).data;
export const login = async (loginData) => (await axiosInstance.post("/auth/login", loginData)).data;
export const logout = async () => (await axiosInstance.post("/auth/logout")).data;
export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    console.log("Error in getAuthUser:", error);
    return null;
  }
};
export const completeOnboarding = async (userData) => (await axiosInstance.post("/auth/onboarding", userData)).data;
export const forgotPassword = async (email) => (await axiosInstance.post("/auth/forgot-password", { email })).data;
export const resetPassword = async (token, password) => (await axiosInstance.post(`/auth/reset-password/${token}`, { password })).data;
export async function getUserFriends() {
  return (await axiosInstance.get("/users/friends")).data;
}
export async function getRecommendedUsers(filters = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.append("search", filters.search);
  if (filters.nativeLanguage) params.append("nativeLanguage", filters.nativeLanguage);
  if (filters.learningLanguage) params.append("learningLanguage", filters.learningLanguage);
  if (filters.page) params.append("page", filters.page);
  if (filters.limit) params.append("limit", filters.limit);
  return (await axiosInstance.get(`/users?${params.toString()}`)).data;
}
export async function getOutgoingFriendReqs() {
  return (await axiosInstance.get("/users/outgoing-friend-requests")).data;
}
export async function sendFriendRequest(userId) {
  return (await axiosInstance.post(`/users/friend-request/${userId}`)).data;
}
export async function getFriendRequests() {
  return (await axiosInstance.get("/users/friend-requests")).data;
}
export async function acceptFriendRequest(requestId) {
  return (await axiosInstance.put(`/users/friend-request/${requestId}/accept`)).data;
}
export async function getStreamToken() {
  return (await axiosInstance.get("/chat/token")).data;
}
export async function getUserProfile(userId) {
  return (await axiosInstance.get(`/users/${userId}`)).data;
}
export async function updateProfile(profileData) {
  return (await axiosInstance.put("/users/profile", profileData)).data;
}
export async function joinQueue(queueData) {
  return (await axiosInstance.post("/queue/join", queueData)).data;
}
export async function checkQueueStatus() {
  return (await axiosInstance.get("/queue/status")).data;
}
export async function leaveQueue() {
  return (await axiosInstance.post("/queue/leave")).data;
}