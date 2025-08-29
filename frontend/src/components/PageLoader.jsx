import { LoaderIcon } from "lucide-react";

const PageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 relative overflow-hidden">
      {/* Subtle Glow */}
      <div className="absolute w-64 h-64 bg-indigo-400/20 blur-3xl rounded-full animate-pulse" />

      {/* Loader Container */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="p-6 rounded-full bg-white/70 shadow-lg backdrop-blur-md">
          <LoaderIcon className="animate-spin size-10 text-indigo-500" />
        </div>
        <p className="mt-4 text-gray-700 font-medium animate-pulse">
          Loading, please wait...
        </p>
      </div>
    </div>
  );
};

export default PageLoader;
