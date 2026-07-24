import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user.id;
    const currentUser = req.user;
    const { search = "", nativeLanguage = "", learningLanguage = "", page = 1, limit = 9 } = req.query;
    const pageNum = Math.max(parseInt(page) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit) || 9, 1), 50);
    const skip = (pageNum - 1) * limitNum;

    const filters = [
      { _id: { $ne: currentUserId } },
      { _id: { $nin: currentUser.friends } },
      { isOnboarded: true },
    ];
    if (search.trim()) filters.push({ fullName: { $regex: search.trim(), $options: "i" } });
    if (nativeLanguage.trim()) filters.push({ nativeLanguage: { $regex: `^${nativeLanguage.trim()}$`, $options: "i" } });
    if (learningLanguage.trim()) filters.push({ learningLanguage: { $regex: `^${learningLanguage.trim()}$`, $options: "i" } });

    const query = { $and: filters };
    const [users, totalUsers] = await Promise.all([
      User.find(query).skip(skip).limit(limitNum),
      User.countDocuments(query),
    ]);

    res.status(200).json({ users, totalUsers, totalPages: Math.ceil(totalUsers / limitNum), currentPage: pageNum });
  } catch (error) {
    console.error("Error in getRecommendedUsers controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMyFriends(req, res) {
  try {
    const user = await User.findById(req.user.id)
      .select("friends")
      .populate("friends", "fullName profilePic nativeLanguage learningLanguage");
    res.status(200).json(user.friends);
  } catch (error) {
    console.error("Error in getMyFriends controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user.id;
    const { id: recipientId } = req.params;
    if (myId === recipientId) {
      return res.status(400).json({ message: "You can't send friend request to yourself" });
    }
    const recipient = await User.findById(recipientId);
    if (!recipient) return res.status(404).json({ message: "Recipient not found" });
    if (recipient.friends.includes(myId)) {
      return res.status(400).json({ message: "You are already friends with this user" });
    }
    const existingRequest = await FriendRequest.findOne({
      $or: [{ sender: myId, recipient: recipientId }, { sender: recipientId, recipient: myId }],
    });
    if (existingRequest) {
      return res.status(400).json({ message: "A friend request already exists between you and this user" });
    }
    const friendRequest = await FriendRequest.create({ sender: myId, recipient: recipientId });
    res.status(201).json(friendRequest);
  } catch (error) {
    console.error("Error in sendFriendRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function acceptFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;
    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) return res.status(404).json({ message: "Friend request not found" });
    if (friendRequest.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to accept this request" });
    }
    friendRequest.status = "accepted";
    await friendRequest.save();
    await User.findByIdAndUpdate(friendRequest.sender, { $addToSet: { friends: friendRequest.recipient } });
    await User.findByIdAndUpdate(friendRequest.recipient, { $addToSet: { friends: friendRequest.sender } });
    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.log("Error in acceptFriendRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getFriendRequests(req, res) {
  try {
    const incomingReqs = await FriendRequest.find({ recipient: req.user.id, status: "pending" })
      .populate("sender", "fullName profilePic nativeLanguage learningLanguage");
    const acceptedReqs = await FriendRequest.find({ sender: req.user.id, status: "accepted" })
      .populate("recipient", "fullName profilePic");
    res.status(200).json({ incomingReqs, acceptedReqs });
  } catch (error) {
    console.log("Error in getPendingFriendRequests controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getOutgoingFriendReqs(req, res) {
  try {
    const outgoingRequests = await FriendRequest.find({ sender: req.user.id, status: "pending" })
      .populate("recipient", "fullName profilePic nativeLanguage learningLanguage");
    res.status(200).json(outgoingRequests);
  } catch (error) {
    console.log("Error in getOutgoingFriendReqs controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getUserProfile(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in getUserProfile controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function updateProfile(req, res) {
  try {
    const userId = req.user._id;
    const { fullName, bio, nativeLanguage, learningLanguage, location, gender, interests, profilePic } = req.body;

    if (!fullName) {
      return res.status(400).json({ message: "Full name is required" });
    }

    const updateData = { fullName, bio, nativeLanguage, learningLanguage, location };
    if (gender !== undefined) updateData.gender = gender;
    if (interests !== undefined) updateData.interests = Array.isArray(interests) ? interests.slice(0, 8) : [];
    if (profilePic !== undefined && profilePic) updateData.profilePic = profilePic;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");
    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error in updateProfile controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}