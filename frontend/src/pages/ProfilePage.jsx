import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthUser from "../hooks/useAuthUser";
import { updateProfile } from "../lib/api";
import { LANGUAGES, GENDER_OPTIONS, INTEREST_TAGS } from "../constants";
import { handleAvatarError } from "../lib/utils";
import toast from "react-hot-toast";
import { SaveIcon, MapPinIcon, LoaderIcon, LocateIcon } from "lucide-react";

const ProfilePage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const [detectingLocation, setDetectingLocation] = useState(false);

  const [formData, setFormData] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    gender: authUser?.gender || "prefer-not-to-say",
    interests: authUser?.interests || [],
  });

  const { mutate: saveMutation, isPending } = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success("Profile updated!");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update profile");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation(formData);
  };

  const toggleInterest = (tag) => {
    setFormData((prev) => {
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

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
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
            setFormData((prev) => ({ ...prev, location: label }));
            toast.success("Location updated!");
          } else {
            toast.error("Could not determine your city");
          }
        } catch (err) {
          toast.error("Could not detect location");
        } finally {
          setDetectingLocation(false);
        }
      },
      () => {
        toast.error("Location permission denied");
        setDetectingLocation(false);
      },
      { timeout: 8000 }
    );
  };

  if (!authUser) return null;

  return (
    <div className="p-4 sm:p-6 lg:p-8 lg:pl-56 bg-white dark:bg-gray-950 min-h-screen transition-colors">
      <div className="container mx-auto max-w-2xl space-y-8">
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Your Profile
        </h1>

        {/* Avatar + summary */}
        <div className="flex items-center gap-5 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
          <img
            src={authUser.profilePic}
            alt={authUser.fullName}
            onError={(e) => handleAvatarError(e, authUser.fullName)}
            className="w-20 h-20 rounded-full object-cover border-2 border-indigo-200"
          />
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{authUser.fullName}</h2>
            {authUser.location && (
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                <MapPinIcon className="size-3" /> {authUser.location}
              </p>
            )}
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Member since {new Date(authUser.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </p>
          </div>
        </div>

        {/* Edit form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              required
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gender</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {GENDER_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, gender: opt.value })}
                  className={`px-3 py-2 rounded-lg border text-sm font-medium transition ${
                    formData.gender === opt.value
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300"
                      : "border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-600"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={3}
              placeholder="Tell others a bit about yourself..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none resize-none"
            />
          </div>

          {/* Interests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Interests <span className="text-gray-400 dark:text-gray-500 font-normal">(pick up to 8)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {INTEREST_TAGS.map((tag) => {
                const isSelected = formData.interests.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleInterest(tag)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition ${
                      isSelected
                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-transparent"
                        : "border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-indigo-300 dark:hover:border-indigo-700"
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Native Language</label>
              <select
                value={formData.nativeLanguage}
                onChange={(e) => setFormData({ ...formData, nativeLanguage: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              >
                <option value="">Select language</option>
                {LANGUAGES.map((l) => (
                  <option key={l} value={l.toLowerCase()}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Learning Language</label>
              <select
                value={formData.learningLanguage}
                onChange={(e) => setFormData({ ...formData, learningLanguage: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              >
                <option value="">Select language</option>
                {LANGUAGES.map((l) => (
                  <option key={l} value={l.toLowerCase()}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="City, Country"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={detectLocation}
                disabled={detectingLocation}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-300 text-sm font-medium hover:bg-indigo-50 dark:hover:bg-indigo-950 transition disabled:opacity-50 whitespace-nowrap"
                title="Detect my current location"
              >
                {detectingLocation ? (
                  <LoaderIcon className="size-4 animate-spin" />
                ) : (
                  <LocateIcon className="size-4" />
                )}
                <span className="hidden sm:inline">Detect</span>
              </button>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Moved to a new city? Tap Detect to update it automatically.
            </p>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            <SaveIcon className="size-4" />
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;