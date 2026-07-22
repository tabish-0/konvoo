import { useState, useEffect, useRef } from "react";
import {
  PhoneIcon,
  VideoIcon,
  UsersIcon,
  GlobeIcon,
  MapPinIcon,
  ShuffleIcon,
  SparklesIcon,
  LoaderIcon,
  PhoneOffIcon,
} from "lucide-react";
import { useNavigate } from "react-router";
import { joinQueue, checkQueueStatus, leaveQueue } from "../lib/api";
import { handleAvatarError } from "../lib/utils";
import toast from "react-hot-toast";

const POLL_INTERVAL_MS = 2500;

const InstantConnectPage = () => {
  const navigate = useNavigate();

  const [matchType, setMatchType] = useState("similar"); // "similar" | "dissimilar"
  const [genderPref, setGenderPref] = useState("anyone"); // "anyone" | "male" | "female"
  const [locationStatus, setLocationStatus] = useState("checking"); // "checking" | "granted" | "denied"
  const [coords, setCoords] = useState(null);

  const [phase, setPhase] = useState("idle"); // "idle" | "searching" | "found" | "connected"
  const [searchType, setSearchType] = useState(null); // "audio" | "video"
  const [currentMatch, setCurrentMatch] = useState(null);
  const [roomId, setRoomId] = useState(null);

  const pollTimerRef = useRef(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus("denied");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLocationStatus("granted");
      },
      () => setLocationStatus("denied"),
      { timeout: 8000 }
    );
  }, []);

  useEffect(() => {
    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, []);

  const stopPolling = () => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  };

  const startPolling = () => {
    stopPolling();
    pollTimerRef.current = setInterval(async () => {
      try {
        const result = await checkQueueStatus();
        if (result.status === "matched") {
          stopPolling();
          setCurrentMatch(result.match);
          setRoomId(result.roomId);
          setPhase("found");
        }
      } catch (err) {
        console.log("Error polling queue status:", err.message);
      }
    }, POLL_INTERVAL_MS);
  };

  const handleConnect = async (type) => {
    if (locationStatus === "checking") return; // guard: never send incomplete coords
    setSearchType(type);
    setPhase("searching");

    try {
      const result = await joinQueue({
        connectionType: type,
        matchType,
        genderPref,
        locationMode: locationStatus === "granted" ? "nearby" : "global",
        coords,
      });

      if (result.status === "matched") {
        setCurrentMatch(result.match);
        setRoomId(result.roomId);
        setPhase("found");
      } else {
        startPolling();
      }
    } catch (err) {
      toast.error("Could not join the queue. Please try again.");
      setPhase("idle");
    }
  };

  const cancelSearch = async () => {
    stopPolling();
    setPhase("idle");
    setSearchType(null);
    try {
      await leaveQueue();
    } catch (err) {
      console.log("Error leaving queue:", err.message);
    }
  };

  const acceptMatch = () => {
    setPhase("connected");
  };

  const declineMatch = async () => {
    setCurrentMatch(null);
    setRoomId(null);
    setPhase("searching");
    try {
      await leaveQueue();
      const result = await joinQueue({
        connectionType: searchType,
        matchType,
        genderPref,
        locationMode: locationStatus === "granted" ? "nearby" : "global",
        coords,
      });
      if (result.status === "matched") {
        setCurrentMatch(result.match);
        setRoomId(result.roomId);
        setPhase("found");
      } else {
        startPolling();
      }
    } catch (err) {
      toast.error("Could not find a new match. Please try again.");
      setPhase("idle");
    }
  };

  const endCall = () => {
    setPhase("idle");
    setCurrentMatch(null);
    setRoomId(null);
    setSearchType(null);
  };

  const joinCall = () => {
    if (roomId) navigate(`/call/${roomId}?type=${searchType}`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 lg:pl-56 bg-white dark:bg-gray-950 min-h-screen transition-colors">
      <div className="container mx-auto max-w-2xl space-y-8">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Instant Connect
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Get matched instantly with someone new. No browsing, no profiles.
          </p>
        </div>

        {/* SEARCHING STATE */}
        {phase === "searching" && (
          <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-12 text-center space-y-6">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 rounded-full bg-indigo-100 dark:bg-indigo-950 animate-ping" />
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                {searchType === "video" ? (
                  <VideoIcon className="size-9 text-white" />
                ) : (
                  <PhoneIcon className="size-9 text-white" />
                )}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Finding someone for you...
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {locationStatus === "granted" ? "Searching nearby" : "Searching globally"}
              </p>
            </div>
            <button
              onClick={cancelSearch}
              className="px-6 py-2.5 rounded-full border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              Cancel
            </button>
          </div>
        )}

        {/* MATCH FOUND STATE */}
        {phase === "found" && currentMatch && (
          <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 text-center space-y-6">
            <span className="inline-block px-3 py-1 rounded-full bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-300 text-xs font-semibold">
              Match found!
            </span>

            <img
              src={currentMatch.profilePic}
              alt={currentMatch.fullName}
              onError={(e) => handleAvatarError(e, currentMatch.fullName)}
              className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-indigo-200"
            />

            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{currentMatch.fullName}</h3>

            {currentMatch.interests?.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2">
                {currentMatch.interests.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={declineMatch}
                className="px-6 py-2.5 rounded-full border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                Skip
              </button>
              <button
                onClick={acceptMatch}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:opacity-90 transition"
              >
                Accept
              </button>
            </div>
          </div>
        )}

        {/* CONNECTED STATE — ready to join the real call */}
        {phase === "connected" && currentMatch && (
          <div className="rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-center space-y-6 min-h-[400px] flex flex-col items-center justify-center">
            <img
              src={currentMatch.profilePic}
              alt={currentMatch.fullName}
              onError={(e) => handleAvatarError(e, currentMatch.fullName)}
              className="w-28 h-28 rounded-full object-cover border-4 border-white/30"
            />
            <div>
              <h3 className="text-xl font-bold text-white">{currentMatch.fullName}</h3>
              <p className="text-sm text-indigo-100 mt-1">Ready to connect</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={endCall}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 transition"
              >
                <PhoneOffIcon className="size-4" /> Cancel
              </button>
              <button
                onClick={joinCall}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-indigo-600 font-semibold hover:opacity-90 transition"
              >
                {searchType === "video" ? <VideoIcon className="size-4" /> : <PhoneIcon className="size-4" />}
                Join {searchType === "video" ? "Video" : "Audio"} Call
              </button>
            </div>
          </div>
        )}

        {/* IDLE STATE */}
        {phase === "idle" && (
          <>
            <div
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium ${
                locationStatus === "checking"
                  ? "bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400"
                  : locationStatus === "granted"
                  ? "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300"
                  : "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
              }`}
            >
              {locationStatus === "checking" && (
                <>
                  <LoaderIcon className="size-4 animate-spin" />
                  Detecting your location...
                </>
              )}
              {locationStatus === "granted" && (
                <>
                  <MapPinIcon className="size-4" />
                  Location on — you'll be matched with people nearby
                </>
              )}
              {locationStatus === "denied" && (
                <>
                  <GlobeIcon className="size-4" />
                  Location off — you'll be matched with people globally
                </>
              )}
            </div>

            <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-6">
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <ShuffleIcon className="size-4" /> Match style
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setMatchType("similar")}
                    className={`p-3 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition ${
                      matchType === "similar"
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300"
                        : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <SparklesIcon className="size-4" /> Similar interests
                  </button>
                  <button
                    onClick={() => setMatchType("dissimilar")}
                    className={`p-3 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition ${
                      matchType === "dissimilar"
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300"
                        : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <ShuffleIcon className="size-4" /> Something new
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <UsersIcon className="size-4" /> Match with
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["anyone", "male", "female"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setGenderPref(opt)}
                      className={`p-3 rounded-xl border text-sm font-medium capitalize transition ${
                        genderPref === opt
                          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300"
                          : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleConnect("audio")}
                disabled={locationStatus === "checking"}
                className="flex flex-col items-center justify-center gap-2 py-8 rounded-2xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-800 transition group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="w-14 h-14 rounded-full bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center group-hover:scale-105 transition">
                  <PhoneIcon className="size-6 text-indigo-600" />
                </div>
                <span className="font-semibold text-gray-800 dark:text-gray-100">Audio Connect</span>
              </button>

              <button
                onClick={() => handleConnect("video")}
                disabled={locationStatus === "checking"}
                className="flex flex-col items-center justify-center gap-2 py-8 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 hover:opacity-90 transition group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center group-hover:scale-105 transition">
                  <VideoIcon className="size-6 text-white" />
                </div>
                <span className="font-semibold text-white">Video Connect</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InstantConnectPage;