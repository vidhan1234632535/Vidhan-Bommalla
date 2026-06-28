import { useRef, useEffect, MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from "react";
import { ColorWheelValue } from "../types";

interface ColorWheelProps {
  label: string;
  value: ColorWheelValue;
  onChange: (newValue: ColorWheelValue) => void;
  colorTheme: string; // e.g. "text-red-500", "text-cyan-500" for the glowing tracker
}

export default function ColorWheel({ label, value, onChange, colorTheme }: ColorWheelProps) {
  const wheelRef = useRef<HTMLDivElement>(null);

  // Convert R, G, B offsets (-30 to 30) into 2D Cartesian coordinates (x, y) from -100 to 100 for visual mapping
  // Angle axes:
  // Red = 90deg (Straight up: x=0, y=-1)
  // Green = 210deg (Bottom right: x=cos(210), y=sin(210))
  // Blue = 330deg (Bottom left: x=cos(330), y=sin(330))
  const getCoordinatesFromRGB = (r: number, g: number, b: number) => {
    // Basic projection:
    // x coordinate is influenced positively by Green, negatively by Blue
    // y coordinate is influenced negatively by Red (upwards), positively by Green and Blue (downwards)
    const radG = (210 * Math.PI) / 180;
    const radB = (330 * Math.PI) / 180;
    const radR = (90 * Math.PI) / 180;

    let x = g * Math.cos(radG) + b * Math.cos(radB);
    let y = r * -1 + g * Math.sin(radG) + b * Math.sin(radB);

    // Scale to fit within wheel boundary
    const maxVal = 30;
    const normX = (x / maxVal) * 45; // Max radius 45px
    const normY = (y / maxVal) * 45;

    // Clamp radius
    const dist = Math.sqrt(normX * normX + normY * normY);
    if (dist > 45) {
      return {
        x: (normX / dist) * 45,
        y: (normY / dist) * 45,
      };
    }
    return { x: normX, y: normY };
  };

  const coords = getCoordinatesFromRGB(value.r, value.g, value.b);

  // Update R,G,B based on 2D joystick displacement (x, y from center, radius up to 45px)
  const updateFromCoordinates = (dx: number, dy: number) => {
    const radius = Math.sqrt(dx * dx + dy * dy);
    const clampedRadius = Math.min(45, radius);
    
    // Normalize coordinates to [-1, 1] relative to max radius 45
    const nx = clampedRadius === 0 ? 0 : dx / 45;
    const ny = clampedRadius === 0 ? 0 : dy / 45;

    // Map normalized x, y back to R, G, B offsets
    // Upwards (negative y) is RED
    // Bottom-Right (positive x, positive y) is GREEN
    // Bottom-Left (negative x, positive y) is BLUE
    const maxOffset = 30; // Max offset in our system (-30 to 30)

    // Direct offset formulation:
    // We project the 2D joystick position onto three axes:
    // Red axis: (0, -1) -> dot product (nx, ny) . (0, -1) = -ny
    // Green axis: (cos(210), sin(210))
    // Blue axis: (cos(330), sin(330))
    const radG = (210 * Math.PI) / 180;
    const radB = (330 * Math.PI) / 180;

    const rOffset = -ny * maxOffset;
    const gOffset = (nx * Math.cos(radG) + ny * Math.sin(radG)) * maxOffset;
    const bOffset = (nx * Math.cos(radB) + ny * Math.sin(radB)) * maxOffset;

    onChange({
      r: Math.round(rOffset),
      g: Math.round(gOffset),
      b: Math.round(bOffset),
    });
  };

  const handlePointerDown = (clientX: number, clientY: number) => {
    const wheel = wheelRef.current;
    if (!wheel) return;

    const rect = wheel.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;

    updateFromCoordinates(dx, dy);

    // Event listeners for dragging
    const handlePointerMove = (moveEvent: PointerEvent) => {
      const moveDx = moveEvent.clientX - centerX;
      const moveDy = moveEvent.clientY - centerY;
      updateFromCoordinates(moveDx, moveDy);
    };

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  const onMouseDown = (e: ReactMouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    handlePointerDown(e.clientX, e.clientY);
  };

  const onTouchStart = (e: ReactTouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 0) return;
    handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
  };

  // Adjust overall master luma ring
  const handleMasterChange = (e: any) => {
    const masterVal = parseInt(e.target.value);
    // Keep current color ratios, but offset R, G, B equally to adjust overall luma
    const average = (value.r + value.g + value.b) / 3;
    const diffR = value.r - average;
    const diffG = value.g - average;
    const diffB = value.b - average;

    onChange({
      r: Math.max(-30, Math.min(30, Math.round(masterVal + diffR))),
      g: Math.max(-30, Math.min(30, Math.round(masterVal + diffG))),
      b: Math.max(-30, Math.min(30, Math.round(masterVal + diffB))),
    });
  };

  const masterValue = Math.round((value.r + value.g + value.b) / 3);

  const resetWheel = () => {
    onChange({ r: 0, g: 0, b: 0 });
  };

  return (
    <div className="flex flex-col items-center select-none" id={`wheel-container-${label.toLowerCase()}`}>
      {/* Reset Label Click */}
      <div className="flex justify-between items-center w-full mb-1 px-1">
        <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">{label}</span>
        <button
          id={`reset-wheel-${label.toLowerCase()}`}
          onClick={resetWheel}
          className="text-[9px] font-mono text-neutral-600 hover:text-cyan-400 transition"
        >
          RESET
        </button>
      </div>

      {/* Wheel Circle */}
      <div
        ref={wheelRef}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        className="relative w-[110px] h-[110px] rounded-full border-2 border-neutral-800 bg-radial from-neutral-900 via-neutral-950 to-neutral-900 cursor-crosshair shadow-inner flex items-center justify-center overflow-hidden"
        style={{
          background: "radial-gradient(circle, rgba(16,16,16,1) 0%, rgba(30,30,30,1) 70%, rgba(10,10,10,1) 100%)",
        }}
      >
        {/* Subtle vectorscope targets overlay */}
        <div className="absolute inset-0 border border-neutral-800/40 rounded-full scale-75" />
        <div className="absolute inset-0 border border-neutral-800/20 rounded-full scale-50" />
        <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-neutral-800/30" />
        <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-neutral-800/30" />

        {/* Color overlay highlights */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-red-500/20 filter blur-xs" />
        <div className="absolute bottom-2 right-4 w-2 h-2 rounded-full bg-green-500/20 filter blur-xs" />
        <div className="absolute bottom-2 left-4 w-2 h-2 rounded-full bg-blue-500/20 filter blur-xs" />

        {/* Handle Tracker */}
        <div
          className={`absolute w-3 h-3 rounded-full border-2 border-white shadow-lg bg-black filter drop-shadow-[0_0_5px_rgba(255,255,255,0.5)] transition-all duration-75 cursor-grab active:cursor-grabbing`}
          style={{
            transform: `translate(${coords.x}px, ${coords.y}px)`,
          }}
        />
      </div>

      {/* RGB Values Readout */}
      <div className="mt-2 flex space-x-2 text-[9px] font-mono">
        <span className={value.r !== 0 ? "text-red-400" : "text-neutral-600"}>R:{value.r > 0 ? `+${value.r}` : value.r}</span>
        <span className={value.g !== 0 ? "text-green-400" : "text-neutral-600"}>G:{value.g > 0 ? `+${value.g}` : value.g}</span>
        <span className={value.b !== 0 ? "text-blue-400" : "text-neutral-600"}>B:{value.b > 0 ? `+${value.b}` : value.b}</span>
      </div>

      {/* Luma Master Ring Slider */}
      <div className="mt-2 w-full px-2 flex items-center space-x-1">
        <span className="text-[8px] font-mono text-neutral-500">L</span>
        <input
          id={`luma-slider-${label.toLowerCase()}`}
          type="range"
          min="-30"
          max="30"
          value={masterValue}
          onChange={handleMasterChange}
          className="flex-1 h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
        />
        <span className="text-[8px] font-mono text-neutral-400 w-4 text-right">
          {masterValue > 0 ? `+${masterValue}` : masterValue}
        </span>
      </div>
    </div>
  );
}
