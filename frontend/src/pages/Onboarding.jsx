import { useState, useEffect } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { completeOnboarding } from "../lib/api";
import {
  LoaderIcon,
  MapPinIcon,
  ShipWheelIcon,
  ShuffleIcon,
  CameraIcon,
} from "lucide-react";
import { LANGUAGES, GENDER_OPTIONS, INTEREST_TAGS } from "../constants";
import { getFallbackAvatar } from "../lib/utils";

const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const [detectingLocation, setDetectingLocation] = useState(false);

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
    gender: authUser?.gender || "prefer-not-to-say",
    interests: authUser?.interests || [],
  });

  // Auto-detect location on mount and fill the Location field
  useEffect(() => {
    if (formState.location || !navigator.geolocation) return;
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          const city =
            data?.address?.city ||
            data?.address?.town ||
            data?.address?.village ||
            data?.address?.county ||
            "";
          const country = data?.address?.country || "";
          const label = [city, country].filter(Boolean).join(", ");
          if (label) {
            setFormState((prev) => ({ ...prev, location: label }));
            toast.success("Location detected!");
          }
        } catch (err) {
          console.log("Reverse geocoding failed:", err.message);
        } finally {
          setDetectingLocation(false);
        }
      },
      () => setDetectingLocation(false),
      { timeout: 8000 }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile onboarded successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formState);
  };

  const handleRandomAvatar = () => {
    const seed = formState.fullName || `user-${Date.now()}`;
    setFormState({ ...formState, profilePic: getFallbackAvatar(seed) });
    toast.success("Random profile picture generated!");
  };

  const toggleInterest = (tag) => {
    setFormState((prev) => {
      const alreadySelected = prev.interests.includes(tag);
      if (alreadySelected) {
        return { ...prev, interests: prev.interests.filter((t) => t !== tag) };
      }
      if (prev.interests.length >= 8) {
        toast.error("You can select up to 8 interests");
        return prev;
      }
      return { ...prev, interests: [...prev.interests, tag] };
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 px-4 py-10">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 sm:p-10 border border-gray-100">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Complete Your Profile
        </h1>
        <p className="text-center text-gray-500 mt-2 mb-8 text-sm sm:text-base">
          Fill in your details so others can connect with you.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* PROFILE PIC */}
          <div className="flex flex-col items-center space-y-4">
            <div className="w-28 h-28 rounded-full bg-gray-100 border-2 border-gray-200 overflow-hidden shadow-md">
              {formState.profilePic ? (
                <img
                  src={formState.profilePic}
                  alt="Profile Preview"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = getFallbackAvatar(formState.fullName);
                  }}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <CameraIcon className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleRandomAvatar}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500 text-white text-sm font-medium shadow hover:bg-indigo-600 transition"
            >
              <ShuffleIcon className="w-4 h-4" />
              Generate Random Avatar
            </button>
          </div>

          {/* FULL NAME */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={formState.fullName}
              onChange={(e) =>
                setFormState({ ...formState, fullName: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none transition"
              placeholder="Your full name"
            />
          </div>

          {/* GENDER */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {GENDER_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFormState({ ...formState, gender: opt.value })}
                  className={`px-3 py-2 rounded-lg border text-sm font-medium transition ${
                    formState.gender === opt.value
                      ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                      : "border-gray-300 text-gray-600 hover:border-gray-400"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* BIO */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              value={formState.bio}
              onChange={(e) =>
                setFormState({ ...formState, bio: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none transition h-24 resize-none"
              placeholder="Tell others about yourself and your goals"
            />
          </div>

          {/* INTERESTS */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interests <span className="text-gray-400 font-normal">(pick up to 8)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {INTEREST_TAGS.map((tag) => {
                const isSelected = formState.interests.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleInterest(tag)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition ${
                      isSelected
                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-transparent"
                        : "border-gray-300 text-gray-600 hover:border-indigo-300"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* LANGUAGES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Native Language
              </label>
              <select
                value={formState.nativeLanguage}
                onChange={(e) =>
                  setFormState({ ...formState, nativeLanguage: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none transition"
              >
                <option value="">Select your native language</option>
                {LANGUAGES.map((lang) => (
                  <option key={`native-${lang}`} value={lang.toLowerCase()}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Learning Language
              </label>
              <select
                value={formState.learningLanguage}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    learningLanguage: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none transition"
              >
                <option value="">Select language you're learning</option>
                {LANGUAGES.map((lang) => (
                  <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* LOCATION */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              Location
              {detectingLocation && (
                <span className="text-xs text-indigo-500 flex items-center gap-1">
                  <LoaderIcon className="w-3 h-3 animate-spin" /> Detecting...
                </span>
              )}
            </label>
            <div className="relative">
              <MapPinIcon className="absolute top-1/2 -translate-y-1/2 left-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formState.location}
                onChange={(e) =>
                  setFormState({ ...formState, location: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 pl-10 px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none transition"
                placeholder="City, Country"
              />
            </div>
          </div>

          {/* SUBMIT */}
          <button
            disabled={isPending}
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-95 transition flex items-center justify-center gap-2"
          >
            {!isPending ? (
              <>
                <ShipWheelIcon className="w-5 h-5" />
                Complete Onboarding
              </>
            ) : (
              <>
                <LoaderIcon className="animate-spin w-5 h-5" />
                Onboarding...
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OnboardingPage;