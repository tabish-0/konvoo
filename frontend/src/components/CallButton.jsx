import { VideoIcon } from "lucide-react";

function CallButton({ handleVideoCall }) {
  return (
    <div className="absolute top-3 right-3 z-50">
      <button
        onClick={handleVideoCall}
        className="flex items-center gap-2 rounded-full bg-green-500 px-4 py-2 text-white shadow-lg hover:bg-green-600 transition-all duration-200"
      >
        <VideoIcon className="w-5 h-5" />
        <span className="font-medium">Call</span>
      </button>
    </div>
  );
}

export default CallButton;
