import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  ParticipantView,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import toast from "react-hot-toast";
import PageLoader from "../components/PageLoader";
const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
  const { id: callId } = useParams();
  const [searchParams] = useSearchParams();
  const callType = searchParams.get("type") || "video";
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const { authUser, isLoading } = useAuthUser();
  const callRef = useRef(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    hasStartedRef.current = false;
  }, [callId]);

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    let cancelled = false;

    const initCall = async () => {
      if (!tokenData?.token || !authUser || !callId) return;
      if (hasStartedRef.current) return;
      hasStartedRef.current = true;
      setIsConnecting(true);

      try {
        const user = { id: authUser._id, name: authUser.fullName, image: authUser.profilePic };
        const videoClient = new StreamVideoClient({ apiKey: STREAM_API_KEY, user, token: tokenData.token });
        const callInstance = videoClient.call("default", callId);

        if (callType === "audio") {
          try {
            await callInstance.camera.disable();
          } catch (camErr) {
            console.log("Could not disable camera pre-join:", camErr.message);
          }
        }

        await callInstance.join({ create: true });

        try {
          await callInstance.microphone.enable();
        } catch (micErr) {
          console.log("Could not enable microphone:", micErr.message);
        }

        callRef.current = callInstance;

        if (!cancelled) {
          setClient(videoClient);
          setCall(callInstance);
        }
      } catch (error) {
        console.error("Error joining call:", error);
        hasStartedRef.current = false;
        if (!cancelled) toast.error("Could not join the call. Please try again.");
      } finally {
        if (!cancelled) setIsConnecting(false);
      }
    };

    initCall();

    const handleUnload = () => {
      if (callRef.current) callRef.current.leave().catch(() => {});
    };
    window.addEventListener("pagehide", handleUnload);
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      cancelled = true;
      window.removeEventListener("pagehide", handleUnload);
      window.removeEventListener("beforeunload", handleUnload);
      if (callRef.current) {
        callRef.current.leave().catch(() => {});
        callRef.current = null;
      }
    };
  }, [tokenData, authUser, callId, callType]);

  if (isLoading || isConnecting) return <PageLoader />;

  return (
    <div className="h-screen bg-gray-950">
      {client && call ? (
        <StreamVideo client={client}>
          <StreamCall call={call}>
            <CallContent />
          </StreamCall>
        </StreamVideo>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-white">Could not initialize call. Please refresh or try again later.</p>
        </div>
      )}
    </div>
  );
};

const CallContent = () => {
  const { useParticipants, useCallCallingState } = useCallStateHooks();
  const participants = useParticipants();
  const callingState = useCallCallingState();
  const navigate = useNavigate();

  if (callingState === CallingState.LEFT) return navigate("/");

  // Dedupe: if the same person has more than one active session
  // (e.g. a stale/ghost session left over from an abrupt disconnect),
  // only show their most recently joined one.
  const uniqueParticipants = Object.values(
    participants.reduce((acc, p) => {
      const existing = acc[p.userId];
      const pJoined = p.joinedAt ? new Date(p.joinedAt).getTime() : 0;
      const existingJoined = existing?.joinedAt ? new Date(existing.joinedAt).getTime() : 0;
      if (!existing || pJoined >= existingJoined) {
        acc[p.userId] = p;
      }
      return acc;
    }, {})
  );

  return (
    <StreamTheme>
      <div className="w-full h-[calc(100%-80px)] p-2 grid gap-2 auto-rows-fr" style={{
        gridTemplateColumns: uniqueParticipants.length > 1 ? "repeat(auto-fit, minmax(280px, 1fr))" : "1fr",
      }}>
        {uniqueParticipants.map((participant) => (
          <div key={participant.userId} className="relative rounded-xl overflow-hidden bg-gray-900 min-h-[200px]">
            <ParticipantView participant={participant} />
          </div>
        ))}
      </div>
      <CallControls />
    </StreamTheme>
  );
};

export default CallPage;