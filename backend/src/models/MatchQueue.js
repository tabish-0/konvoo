import mongoose from "mongoose";

const matchQueueSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    connectionType: {
      type: String,
      enum: ["audio", "video"],
      required: true,
    },
    matchType: {
      type: String,
      enum: ["similar", "dissimilar"],
      default: "similar",
    },
    genderPref: {
      type: String,
      enum: ["anyone", "male", "female"],
      default: "anyone",
    },
    locationMode: {
      type: String,
      enum: ["nearby", "global"],
      default: "global",
    },
    coords: {
      lat: Number,
      lng: Number,
    },
    status: {
      type: String,
      enum: ["waiting", "matched", "cancelled"],
      default: "waiting",
    },
    matchedWith: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    roomId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// Auto-delete stale queue entries after 5 minutes so abandoned tickets
// (e.g. user closed the tab) don't clog the queue forever.
matchQueueSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

const MatchQueue = mongoose.model("MatchQueue", matchQueueSchema);
export default MatchQueue;