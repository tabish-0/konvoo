import { useRef, useState } from "react";
import { CameraIcon, LoaderIcon } from "lucide-react";
import toast from "react-hot-toast";
import { handleAvatarError } from "../lib/utils";
import AvatarCropperModal from "./AvatarCropperModal";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const MAX_DIMENSION = 1400; // downscale huge mobile photos before they ever hit the cropper

const AvatarUploader = ({ currentImage, name, onUploaded }) => {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const [cropSrc, setCropSrc] = useState(null);

  const downscaleImage = (dataUrl) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width <= MAX_DIMENSION && height <= MAX_DIMENSION) {
          resolve(dataUrl);
          return;
        }
        const scale = MAX_DIMENSION / Math.max(width, height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.9));
      };
      img.onerror = () => reject(new Error("Could not read image"));
      img.src = dataUrl;
    });

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type && !file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      toast.error("Image must be under 15MB");
      return;
    }

    setPreparing(true);
    try {
      const rawDataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Could not read file"));
        reader.readAsDataURL(file);
      });

      const resized = await downscaleImage(rawDataUrl);
      setCropSrc(resized);
    } catch (err) {
      console.log("Error preparing image:", err.message);
      toast.error("Could not load that photo. Try a different one.");
    } finally {
      setPreparing(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleCropConfirm = async (blob) => {
    setCropSrc(null);
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      toast.error("Image upload isn't configured yet.");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", blob, "avatar.jpg");
      formData.append("upload_preset", UPLOAD_PRESET);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        onUploaded(data.secure_url);
        toast.success("Photo updated!");
      } else {
        throw new Error(data.error?.message || "Upload failed");
      }
    } catch (err) {
      toast.error("Could not upload image");
      console.log("Cloudinary upload error:", err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-28 h-28 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 overflow-hidden shadow-md">
        {currentImage ? (
          <img
            src={currentImage}
            alt="Profile"
            onError={(e) => handleAvatarError(e, name)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <CameraIcon className="w-8 h-8 text-gray-400" />
          </div>
        )}
        {(uploading || preparing) && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <LoaderIcon className="w-6 h-6 text-white animate-spin" />
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading || preparing}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500 text-white text-sm font-medium shadow hover:bg-indigo-600 transition disabled:opacity-50"
      >
        <CameraIcon className="w-4 h-4" />
        {preparing ? "Loading photo..." : uploading ? "Uploading..." : "Upload Photo"}
      </button>
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

      {cropSrc && (
        <AvatarCropperModal imageSrc={cropSrc} onCancel={() => setCropSrc(null)} onConfirm={handleCropConfirm} />
      )}
    </div>
  );
};

export default AvatarUploader;