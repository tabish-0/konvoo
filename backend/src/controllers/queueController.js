import MatchQueue from "../models/MatchQueue.js";
import User from "../models/User.js";

// Haversine formula — calculates real distance in km between two coordinates
function distanceKm(coord1, coord2) {
  if (!coord1 || !coord2 || coord1.lat == null || coord2.lat == null) return null;
  const R = 6371;
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const dLng = ((coord2.lng - coord1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((coord1.lat * Math.PI) / 180) *
      Math.cos((coord2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function sharesInterest(a = [], b = []) {
  return a.some((tag) => b.includes(tag));
}

// Checks if two queue tickets are a mutual match — both people's filters
// must accept each other, not just one direction.
function isMutualMatch(candidate, me, myUser, candidateUser) {
  if (candidate.genderPref !== "anyone" && candidate.genderPref !== myUser.gender) return false;
  if (me.genderPref !== "anyone" && me.genderPref !== candidateUser.gender) return false;

  const shareInterest = sharesInterest(myUser.interests, candidateUser.interests);
  if (candidate.matchType === "similar" && !shareInterest) return false;
  if (candidate.matchType === "dissimilar" && shareInterest) return false;
  if (me.matchType === "similar" && !shareInterest) return false;
  if (me.matchType === "dissimilar" && shareInterest) return false;

  if (candidate.locationMode === "nearby" || me.locationMode === "nearby") {
    const dist = distanceKm(candidate.coords, me.coords);
    if (dist === null || dist > 100) return false;
  }

  return true;
}

export async function joinQueue(req, res) {
  try {
    const userId = req.user._id;
    const { connectionType, matchType, genderPref, locationMode, coords } = req.body;

    if (!["audio", "video"].includes(connectionType)) {
      return res.status(400).json({ message: "Invalid connection type" });
    }

    await MatchQueue.deleteMany({ user: userId, status: "waiting" });

    const myUser = req.user;

    const candidates = await MatchQueue.find({
      user: { $ne: userId },
      connectionType,
      status: "waiting",
    }).populate("user", "fullName profilePic gender interests");

    for (const candidate of candidates) {
      if (!candidate.user) continue;
      if (isMutualMatch(candidate, { matchType, genderPref, locationMode, coords }, myUser, candidate.user)) {
        const roomId = [userId.toString(), candidate.user._id.toString()].sort().join("-");

        candidate.status = "matched";
        candidate.matchedWith = userId;
        candidate.roomId = roomId;
        await candidate.save();

        await MatchQueue.create({
          user: userId,
          connectionType,
          matchType,
          genderPref,
          locationMode,
          coords,
          status: "matched",
          matchedWith: candidate.user._id,
          roomId,
        });

        return res.status(200).json({
          status: "matched",
          roomId,
          match: {
            id: candidate.user._id,
            fullName: candidate.user.fullName,
            profilePic: candidate.user.profilePic,
            interests: candidate.user.interests,
          },
        });
      }
    }

    const ticket = await MatchQueue.create({
      user: userId,
      connectionType,
      matchType,
      genderPref,
      locationMode,
      coords,
      status: "waiting",
    });

    res.status(200).json({ status: "waiting", ticketId: ticket._id });
  } catch (error) {
    console.error("Error in joinQueue controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function checkQueueStatus(req, res) {
  try {
    const userId = req.user._id;

    const ticket = await MatchQueue.findOne({ user: userId })
      .sort({ createdAt: -1 })
      .populate("matchedWith", "fullName profilePic interests");

    if (!ticket) {
      return res.status(200).json({ status: "idle" });
    }

    if (ticket.status === "matched" && ticket.matchedWith) {
      return res.status(200).json({
        status: "matched",
        roomId: ticket.roomId,
        match: {
          id: ticket.matchedWith._id,
          fullName: ticket.matchedWith.fullName,
          profilePic: ticket.matchedWith.profilePic,
          interests: ticket.matchedWith.interests,
        },
      });
    }

    res.status(200).json({ status: ticket.status });
  } catch (error) {
    console.error("Error in checkQueueStatus controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function leaveQueue(req, res) {
  try {
    const userId = req.user._id;
    await MatchQueue.deleteMany({ user: userId, status: "waiting" });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error in leaveQueue controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}