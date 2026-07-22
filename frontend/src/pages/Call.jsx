import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
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
  const callType = searchParams.get("type") || "video"; // "audio" | "video"
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const { authUser, isLoading } = useAuthUser();
  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });
  useEffect(() => {
    const initCall = async () => {
      if (!tokenData?.token || !authUser || !callId) return;
      try {
        console.log("Initializing Stream video client...");
        const user = {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic,
        };
        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData.token,
        });
        const callInstance = videoClient.call("default", callId);
        await callInstance.join({ create: true });

        // For audio-only calls, disable the camera right after joining
        if (callType === "audio") {
          try {
            await callInstance.camera.disable();
          } catch (camErr) {
            console.log("Could not disable camera:", camErr.message);
          }
        }

        console.log("Joined call successfully");
        setClient(videoClient);
        setCall(callInstance);
      } catch (error) {
        console.error("Error joining call:", error);
        toast.error("Could not join the call. Please try again.");
      } finally {
        setIsConnecting(false);
      }
    };
    initCall();
  }, [tokenData, authUser, callId, callType]);
  if (isLoading || isConnecting) return <PageLoader />;
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="relative">
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent isAudioOnly={callType === "audio"} />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Could not initialize call. Please refresh or try again later.</p>
          </div>
        )}
      </div>
    </div>
  );
};
const CallContent = ({ isAudioOnly }) => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const navigate = useNavigate();
  if (callingState === CallingState.LEFT) return navigate("/");
  return (
    <StreamTheme>
      {isAudioOnly ? (
        <div className="flex flex-col items-center justify-center gap-6 p-10 text-center">
          <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
            📞
          </div>
          <p className="text-white text-lg font-medium">Audio call in progress</p>
        </div>
      ) : (
        <SpeakerLayout />
      )}
      <CallControls />
    </StreamTheme>
  );
};
export default CallPage;