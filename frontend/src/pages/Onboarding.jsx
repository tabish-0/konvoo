import { useState, useEffect } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { completeOnboarding } from "../lib/api";
import { LoaderIcon, MapPinIcon, ShipWheelIcon, LocateIcon } from "lucide-react";
import { LANGUAGES, GENDER_OPTIONS, INTEREST_TAGS } from "../constants";
import { getCurrentCoords, reverseGeocode } from "../lib/location";
import AvatarUploader from "../components/AvatarUploader";

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

  const detectLocation = async () => {
    setDetectingLocation(true);
    try {
      const coords = await getCurrentCoords();
      const place = await reverseGeocode(coords.lat, coords.lng);
      if (place) {
        setFormState((prev) => ({ ...prev, location: place }));
        toast.success("Location detected!");
      } else {
        toast.error("Could not determine your location");
      }
    } catch (err) {
      toast.error("Location permission denied or unavailable");
    } finally {
      setDetectingLocation(false);
    }
  };

  useEffect(() => {
    if (formState.location) return;
    (async () => {
      try {
        setDetectingLocation(true);
        const coords = await getCurrentCoords();
        const place = await reverseGeocode(coords.lat, coords.lng);
        if (place) setFormState((prev) => ({ ...prev, location: place }));
      } catch (err) {
        // silent — manual Detect button still available
      } finally {
        setDetectingLocation(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile onboarded successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => toast.error(error.response?.data?.message || "Something went wrong"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formState);
  };

  const toggleInterest = (tag) => {
    setFormState((prev) => {
      const alreadySelected = prev.interests.includes(tag);
      if (alreadySelected) return { ...prev, interests: prev.interests.filter((t) => t !== tag) };
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
        <h1 className="text-3xl font-bold text-center text-gray-800">Complete Your Profile</h1>
        <p className="text-center text-gray-500 mt-2 mb-8 text-sm sm:text-base">
          Fill in your details so others can connect with you.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <AvatarUploader
            currentImage={formState.profilePic}
            name={formState.fullName}
            onUploaded={(url) => setFormState({ ...formState, profilePic: url })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={formState.fullName}
              onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none transition"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              value={formState.bio}
              onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none transition h-24 resize-none"
              placeholder="Tell others about yourself and your goals"
            />
          </div>

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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Native Language</label>
              <select
                value={formState.nativeLanguage}
                onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none transition"
              >
                <option value="">Select your native language</option>
                {LANGUAGES.map((lang) => (
                  <option key={`native-${lang}`} value={lang.toLowerCase()}>{lang}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Learning Language</label>
              <select
                value={formState.learningLanguage}
                onChange={(e) => setFormState({ ...formState, learningLanguage: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none transition"
              >
                <option value="">Select language you're learning</option>
                {LANGUAGES.map((lang) => (
                  <option key={`learning-${lang}`} value={lang.toLowerCase()}>{lang}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MapPinIcon className="absolute top-1/2 -translate-y-1/2 left-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formState.location}
                  onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 pl-10 px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none transition"
                  placeholder="City, Country"
                />
              </div>
              <button
                type="button"
                onClick={detectLocation}
                disabled={detectingLocation}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-indigo-300 text-indigo-600 text-sm font-medium hover:bg-indigo-50 transition disabled:opacity-50 whitespace-nowrap"
              >
                {detectingLocation ? <LoaderIcon className="size-4 animate-spin" /> : <LocateIcon className="size-4" />}
                <span className="hidden sm:inline">Detect</span>
              </button>
            </div>
          </div>

          <button
            disabled={isPending}
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-95 transition flex items-center justify-center gap-2"
          >
            {!isPending ? (
              <>
                <ShipWheelIcon className="w-5 h-5" /> Complete Onboarding
              </>
            ) : (
              <>
                <LoaderIcon className="animate-spin w-5 h-5" /> Onboarding...
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OnboardingPage;