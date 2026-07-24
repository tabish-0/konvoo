import { useRef, useState, useEffect } from "react";
import { XIcon, ZoomInIcon, ZoomOutIcon } from "lucide-react";

const VIEWPORT_SIZE = 260;
const OUTPUT_SIZE = 400;

const AvatarCropperModal = ({ imageSrc, onCancel, onConfirm }) => {
  const imgElRef = useRef(null);
  const baseScaleRef = useRef(1);
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });
  const [zoom, setZoom] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dragState = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const minDim = Math.min(img.naturalWidth, img.naturalHeight);
      baseScaleRef.current = VIEWPORT_SIZE / minDim;
      imgElRef.current = img;
      setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
      setZoom(1);
      setPos({ x: 0, y: 0 });
    };
    img.src = imageSrc;
  }, [imageSrc]);

  const handlePointerDown = (e) => {
    dragState.current = { startX: e.clientX, startY: e.clientY, origX: pos.x, origY: pos.y };
  };
  const handlePointerMove = (e) => {
    if (!dragState.current) return;
    setPos({
      x: dragState.current.origX + (e.clientX - dragState.current.startX),
      y: dragState.current.origY + (e.clientY - dragState.current.startY),
    });
  };
  const handlePointerUp = () => {
    dragState.current = null;
  };

  const handleConfirm = () => {
    if (!imgElRef.current || !naturalSize.w) return;
    const totalScale = baseScaleRef.current * zoom;
    const outputScale = OUTPUT_SIZE / VIEWPORT_SIZE;
    const drawScale = totalScale * outputScale;
    const drawW = naturalSize.w * drawScale;
    const drawH = naturalSize.h * drawScale;
    const drawX = OUTPUT_SIZE / 2 - drawW / 2 + pos.x * outputScale;
    const drawY = OUTPUT_SIZE / 2 - drawH / 2 + pos.y * outputScale;

    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.arc(OUTPUT_SIZE / 2, OUTPUT_SIZE / 2, OUTPUT_SIZE / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(imgElRef.current, drawX, drawY, drawW, drawH);

    canvas.toBlob((blob) => blob && onConfirm(blob), "image/jpeg", 0.92);
  };

  const displayScale = baseScaleRef.current * zoom;

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800 dark:text-white">Adjust photo</h3>
          <button onClick={onCancel} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <XIcon className="size-5 text-gray-500" />
          </button>
        </div>

        <div
          className="relative mx-auto rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-grab active:cursor-grabbing select-none touch-none"
          style={{ width: VIEWPORT_SIZE, height: VIEWPORT_SIZE }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {naturalSize.w > 0 && (
            <img
              src={imageSrc}
              draggable={false}
              alt="Crop preview"
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: naturalSize.w * displayScale,
                height: naturalSize.h * displayScale,
                maxWidth: "none",
                transform: `translate(-50%, -50%) translate(${pos.x}px, ${pos.y}px)`,
              }}
            />
          )}
          <div className="absolute inset-0 rounded-full ring-2 ring-inset ring-white/70 pointer-events-none" />
        </div>

        <div className="flex items-center gap-3">
          <ZoomOutIcon className="size-4 text-gray-400 flex-shrink-0" />
          <input
            type="range"
            min="1"
            max="3"
            step="0.05"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="flex-1 accent-indigo-500"
          />
          <ZoomInIcon className="size-4 text-gray-400 flex-shrink-0" />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:opacity-90 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarCropperModal;