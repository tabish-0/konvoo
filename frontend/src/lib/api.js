import { axiosInstance } from "./axios";
export const signup = async (signupData) => {
  const response = await axiosInstance.post("/auth/signup", signupData);
  return response.data;
};
export const login = async (loginData) => {
  const response = await axiosInstance.post("/auth/login", loginData);
  return response.data;
};
export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};
export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    console.log("Error in getAuthUser:", error);
    return null;
  }
};
export const completeOnboarding = async (userData) => {
  const response = await axiosInstance.post("/auth/onboarding", userData);
  return response.data;
};
export async function getUserFriends() {
  const response = await axiosInstance.get("/users/friends");
  return response.data;
}
export async function getRecommendedUsers(filters = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.append("search", filters.search);
  if (filters.nativeLanguage) params.append("nativeLanguage", filters.nativeLanguage);
  if (filters.learningLanguage) params.append("learningLanguage", filters.learningLanguage);
  if (filters.page) params.append("page", filters.page);
  if (filters.limit) params.append("limit", filters.limit);

  const response = await axiosInstance.get(`/users?${params.toString()}`);
  return response.data;
}
export async function getOutgoingFriendReqs() {
  const response = await axiosInstance.get("/users/outgoing-friend-requests");
  return response.data;
}
export async function sendFriendRequest(userId) {
  const response = await axiosInstance.post(`/users/friend-request/${userId}`);
  return response.data;
}
export async function getFriendRequests() {
  const response = await axiosInstance.get("/users/friend-requests");
  return response.data;
}
export async function acceptFriendRequest(requestId) {
  const response = await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
  return response.data;
}
export async function getStreamToken() {
  const response = await axiosInstance.get("/chat/token");
  return response.data;
}
export async function getUserProfile(userId) {
  const response = await axiosInstance.get(`/users/${userId}`);
  return response.data;
}
export async function updateProfile(profileData) {
  const response = await axiosInstance.put("/users/profile", profileData);
  return response.data;
}
export async function joinQueue(queueData) {
  const response = await axiosInstance.post("/queue/join", queueData);
  return response.data;
}
export async function checkQueueStatus() {
  const response = await axiosInstance.get("/queue/status");
  return response.data;
}
export async function leaveQueue() {
  const response = await axiosInstance.post("/queue/leave");
  return response.data;
}