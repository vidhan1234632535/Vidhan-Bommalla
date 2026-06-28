import { useState, useRef, useEffect, MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from "react";
import { Eye, Split } from "lucide-react";

interface BeforeAfterSliderProps {
  imageUrl: string;
  title: string;
  category?: string;
  aspectRatio?: string;
}

export default function BeforeAfterSlider({ imageUrl, title, category, aspectRatio = "aspect-video" }: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const onMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const onTouchMove = (e: ReactTouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    if (e.touches.length === 0) return;
    handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    const handlePointerUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("pointerup", handlePointerUp);
    }

    return () => {
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging]);

  return (
    <div className="flex flex-col h-full" id={`before-after-slider-container-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      {/* Title & Metadata */}
      {category && (
        <div className="flex justify-between items-center mb-2 px-1">
          <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">{category}</span>
          <span className="text-[10px] font-mono text-neutral-500">CLICK & DRAG DIVIDER</span>
        </div>
      )}

      {/* Main Slider Canvas */}
      <div
        ref={containerRef}
        onMouseMove={onMouseMove}
        onTouchMove={onTouchMove}
        onMouseDown={(e) => {
          e.preventDefault();
          setIsDragging(true);
          handleMove(e.clientX);
        }}
        onTouchStart={(e) => {
          setIsDragging(true);
          if (e.touches.length > 0) handleMove(e.touches[0].clientX);
        }}
        className={`relative ${aspectRatio} w-full overflow-hidden rounded-sm border border-white/10 bg-[#0c0c0c] cursor-ew-resize select-none group`}
      >
        {/* Underlay: After (Graded Rec.709) */}
        <img
          src={imageUrl}
          alt={`${title} Graded Rec.709`}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute bottom-3 right-4 z-10 bg-black/80 backdrop-blur-xs px-2 py-1 rounded-sm text-[9px] font-mono font-semibold tracking-wider text-green-400 border border-white/10 shadow-lg">
          REC.709 GRADED
        </div>

        {/* Overlay: Before (Simulated Flat LOG Footage) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
          }}
        >
          <img
            src={imageUrl}
            alt={`${title} Camera Log Raw`}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover filter contrast-[0.45] saturate-[0.35] brightness-[1.12]"
          />
          <div className="absolute bottom-3 left-4 z-10 bg-black/80 backdrop-blur-xs px-2 py-1 rounded-sm text-[9px] font-mono font-semibold tracking-wider text-neutral-400 border border-white/10 shadow-lg">
            LOG CAMERA RAW
          </div>
        </div>

        {/* Sliding Divider Line */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-white z-20 pointer-events-none filter drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Slider Circular Handle */}
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-black border-2 border-white flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110 group-active:scale-95 z-30 pointer-events-none">
            <Split className="h-4 w-4 text-white rotate-90" />
          </div>
        </div>

        {/* Dark subtle vignetting edge overlay */}
        <div className="absolute inset-0 pointer-events-none border border-inset border-white/5 rounded-sm" />
      </div>

      <div className="mt-2 px-1 flex justify-between items-center">
        <h4 className="text-sm font-medium text-neutral-100 font-sans tracking-wide">{title}</h4>
        <div className="flex items-center space-x-1 text-xs text-neutral-500 font-mono">
          <Eye className="h-3 w-3" />
          <span>LUT: Vidhan_Signature_Film</span>
        </div>
      </div>
    </div>
  );
}
