import { useEffect, useRef, useState } from "react";
import { ColorGrade } from "../types";
import { Activity, Radio, Compass } from "lucide-react";

interface WaveformScopeProps {
  grade: ColorGrade;
}

type ScopeMode = "waveform" | "rgb-parade" | "vectorscope";

export default function WaveformScope({ grade }: WaveformScopeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<ScopeMode>("rgb-parade");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear background
    ctx.fillStyle = "#0c0c0c";
    ctx.fillRect(0, 0, width, height);

    // Draw reference grid
    ctx.strokeStyle = "rgba(40, 40, 40, 0.8)";
    ctx.lineWidth = 1;

    // Parameters mapped
    const exp = grade.exposure / 100; // -1 to 1
    const contrast = 1 + (grade.contrast / 100); // 0 to 2
    const sat = 1 + (grade.saturation / 100); // 0 to 2
    
    const liftR = grade.lift.r / 50; // -1 to 1
    const liftG = grade.lift.g / 50;
    const liftB = grade.lift.b / 50;

    const gammaR = grade.gamma.r / 50;
    const gammaG = grade.gamma.g / 50;
    const gammaB = grade.gamma.b / 50;

    const gainR = grade.gain.r / 50;
    const gainG = grade.gain.g / 50;
    const gainB = grade.gain.b / 50;

    const tempR = grade.temperature / 150;
    const tempB = -grade.temperature / 150;
    const tintG = -grade.tint / 150;
    const tintRM = grade.tint / 150;

    if (mode === "waveform" || mode === "rgb-parade") {
      // Draw horizontal horizontal percentage lines
      const steps = [0, 0.25, 0.5, 0.75, 1.0];
      steps.forEach((step) => {
        const y = height * (1 - step);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();

        // Percentage labels
        ctx.fillStyle = "#4a4a4a";
        ctx.font = "8px 'JetBrains Mono', monospace";
        ctx.fillText(`${Math.round(step * 100)}%`, 5, y - 4);
      });

      // Simple pseudo-random seed to generate organic-looking wave graphs
      // that represent cinematic composition (e.g. skin tones in mid, bright sky, dark shadows)
      const pointsCount = mode === "waveform" ? width : Math.floor(width / 3);
      const drawSubParade = (
        offsetX: number, 
        subWidth: number, 
        color: string, 
        channelOffsets: { lift: number; gamma: number; gain: number; tempTint: number }
      ) => {
        ctx.fillStyle = color;
        
        // Generate a synthetic image scan profile
        for (let i = 0; i < subWidth; i += 2) {
          const xNorm = i / subWidth;
          
          // Generate a base profile with a mountain structure (subject) and sky highlight
          let baseLuma = 0.35 + 
            Math.sin(xNorm * Math.PI) * 0.25 + 
            Math.sin(xNorm * 12) * 0.08 + 
            (xNorm > 0.7 ? 0.25 : 0); // sky/window highlight

          // Apply exposure, temperature/tint offsets
          baseLuma += exp * 0.25 + channelOffsets.tempTint;

          // Apply Lift, Gamma, Gain math
          // Lift adjusts shadows (bottom)
          baseLuma = baseLuma + (1 - baseLuma) * (channelOffsets.lift * 0.15);
          // Gamma bends midtones
          baseLuma = baseLuma + Math.sin(baseLuma * Math.PI) * (channelOffsets.gamma * 0.15);
          // Gain scales highlights (top)
          baseLuma = baseLuma * (1.0 + channelOffsets.gain * 0.3);

          // Apply contrast relative to 0.5 center
          baseLuma = (baseLuma - 0.5) * contrast + 0.5;

          // Clamp
          const finalVal = Math.max(0.01, Math.min(0.99, baseLuma));
          const y = height * (1 - finalVal);

          // Draw vertical glow brush
          const grad = ctx.createLinearGradient(0, y - 20, 0, y + 20);
          grad.addColorStop(0, "rgba(0,0,0,0)");
          grad.addColorStop(0.5, color);
          grad.addColorStop(1, "rgba(0,0,0,0)");
          
          ctx.fillStyle = grad;
          ctx.fillRect(offsetX + i, y - 10, 2, 20);

          // Also draw a dense central line
          ctx.fillStyle = color.replace("0.25", "0.85").replace("0.3", "0.9");
          ctx.fillRect(offsetX + i, y, 2, 2);
        }
      };

      if (mode === "waveform") {
        // Overlay of white/amber luma signal
        const lumaOffsets = {
          lift: (liftR + liftG + liftB) / 3,
          gamma: (gammaR + gammaG + gammaB) / 3,
          gain: (gainR + gainG + gainB) / 3,
          tempTint: (tempR + tempB + tintG) / 3
        };
        drawSubParade(0, width, "rgba(224, 242, 254, 0.25)", lumaOffsets);
      } else {
        // RGB Parade: Red, Green, Blue signals side by side
        const pWidth = Math.floor(width / 3);
        
        // Red
        drawSubParade(0, pWidth - 4, "rgba(239, 68, 68, 0.3)", {
          lift: liftR,
          gamma: gammaR,
          gain: gainR,
          tempTint: tempR + tintRM
        });

        // Green
        drawSubParade(pWidth, pWidth - 4, "rgba(34, 197, 94, 0.3)", {
          lift: liftG,
          gamma: gammaG,
          gain: gainG,
          tempTint: tintG
        });

        // Blue
        drawSubParade(2 * pWidth, pWidth - 4, "rgba(59, 130, 246, 0.3)", {
          lift: liftB,
          gamma: gammaB,
          gain: gainB,
          tempTint: tempB + tintRM
        });

        // Draw dividers
        ctx.strokeStyle = "rgba(60, 60, 60, 0.5)";
        ctx.beginPath();
        ctx.moveTo(pWidth - 2, 0);
        ctx.lineTo(pWidth - 2, height);
        ctx.moveTo(2 * pWidth - 2, 0);
        ctx.lineTo(2 * pWidth - 2, height);
        ctx.stroke();

        // Labels
        ctx.fillStyle = "rgba(239, 68, 68, 0.8)";
        ctx.fillText("R", pWidth * 0.5 - 5, height - 10);
        ctx.fillStyle = "rgba(34, 197, 94, 0.8)";
        ctx.fillText("G", pWidth * 1.5 - 5, height - 10);
        ctx.fillStyle = "rgba(59, 130, 246, 0.8)";
        ctx.fillText("B", pWidth * 2.5 - 5, height - 10);
      }
    } else if (mode === "vectorscope") {
      // Vectorscope displays hue/saturation
      const cx = width / 2;
      const cy = height / 2;
      const maxRadius = Math.min(width, height) / 2 - 15;

      // Draw concentric reference circles (saturation steps)
      ctx.strokeStyle = "rgba(45, 45, 45, 0.9)";
      [0.25, 0.5, 0.75, 1.0].forEach((ratio) => {
        ctx.beginPath();
        ctx.arc(cx, cy, maxRadius * ratio, 0, 2 * Math.PI);
        ctx.stroke();
      });

      // Draw axes
      ctx.beginPath();
      ctx.moveTo(cx - maxRadius, cy);
      ctx.lineTo(cx + maxRadius, cy);
      ctx.moveTo(cx, cy - maxRadius);
      ctx.lineTo(cx, cy + maxRadius);
      ctx.stroke();

      // Draw standard hue target boxes (R, Y, G, C, B, M)
      // Angle coordinates in radians for standard targets
      const targets = [
        { label: "R", angle: -Math.PI / 3, color: "#ef4444" },
        { label: "Y", angle: -Math.PI / 6, color: "#eab308" },
        { label: "G", angle: Math.PI / 4, color: "#22c55e" },
        { label: "C", angle: 2 * Math.PI / 3, color: "#06b6d4" },
        { label: "B", angle: Math.PI, color: "#3b82f6" },
        { label: "M", angle: -Math.PI * 4/5, color: "#ec4899" },
      ];

      targets.forEach((tgt) => {
        const tx = cx + Math.cos(tgt.angle) * (maxRadius * 0.75);
        const ty = cy + Math.sin(tgt.angle) * (maxRadius * 0.75);

        // Draw target box
        ctx.strokeStyle = tgt.color;
        ctx.lineWidth = 1;
        ctx.strokeRect(tx - 6, ty - 6, 12, 12);

        // Draw target label
        ctx.fillStyle = "#8a8a8a";
        ctx.font = "8px 'JetBrains Mono', monospace";
        ctx.fillText(tgt.label, tx - 4, ty + 18);
      });

      // Draw skin tone line (Barline/i-line is usually at ~ -123 degrees or -2.14 rad)
      const skinAngle = -Math.PI * 0.65;
      ctx.strokeStyle = "rgba(224, 130, 90, 0.3)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(skinAngle) * maxRadius, cy + Math.sin(skinAngle) * maxRadius);
      ctx.stroke();
      ctx.fillStyle = "rgba(224, 130, 90, 0.6)";
      ctx.fillText("SKIN TONE", cx + Math.cos(skinAngle) * (maxRadius * 0.8) - 10, cy + Math.sin(skinAngle) * (maxRadius * 0.8) - 8);

      // Draw synthetic glowing trace representing image pixels
      // Scale vectorscope radius and rotate base on temperature/tint
      const hueShift = (grade.temperature / 200.0) * Math.PI * 0.25; // Warm rotates towards R/Y, cool towards B/C
      const tintShift = (grade.tint / 200.0) * Math.PI * 0.2;
      const overallShift = hueShift + tintShift;
      
      const satMultiplier = sat * 0.6; // Saturation expands radius

      ctx.strokeStyle = "rgba(34, 211, 238, 0.4)"; // Cyan vectorscope trace
      ctx.lineWidth = 1.5;
      ctx.beginPath();

      // Create an organic cloud trace representing a cinematic sunset or cyberpunk shot
      const points = 180;
      for (let p = 0; p <= points; p++) {
        const theta = (p / points) * 2 * Math.PI;
        
        // Base distribution shape (weighted towards warm skin tones + cyan shadows)
        const warmWeight = Math.exp(-Math.pow(theta - (-Math.PI/4), 2) / 0.5) * 0.5;
        const coolWeight = Math.exp(-Math.pow(theta - (Math.PI * 0.8), 2) / 0.8) * 0.4;
        const baseRadius = 0.15 + warmWeight + coolWeight;

        // Apply temperature, tint, saturation
        const actualRadius = Math.min(0.95, baseRadius * satMultiplier) * maxRadius;
        const rotatedTheta = theta + overallShift;

        const px = cx + Math.cos(rotatedTheta) * actualRadius + (Math.sin(theta * 10) * 3);
        const py = cy + Math.sin(rotatedTheta) * actualRadius + (Math.cos(theta * 8) * 3);

        if (p === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.closePath();
      ctx.stroke();

      // Add a second inner glowing trace for high density midtones
      ctx.strokeStyle = "rgba(34, 211, 238, 0.8)";
      ctx.lineWidth = 0.75;
      ctx.beginPath();
      for (let p = 0; p <= points; p += 2) {
        const theta = (p / points) * 2 * Math.PI;
        const warmWeight = Math.exp(-Math.pow(theta - (-Math.PI/4), 2) / 0.2) * 0.3;
        const baseRadius = 0.08 + warmWeight;
        const actualRadius = Math.min(0.9, baseRadius * satMultiplier) * maxRadius;
        const rotatedTheta = theta + overallShift;
        const px = cx + Math.cos(rotatedTheta) * actualRadius + (Math.sin(theta * 12) * 1.5);
        const py = cy + Math.sin(rotatedTheta) * actualRadius + (Math.cos(theta * 6) * 1.5);

        if (p === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.closePath();
      ctx.stroke();
    }
  }, [grade, mode]);

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 flex flex-col h-full" id="scopes-panel">
      <div className="flex items-center justify-between mb-3 border-b border-neutral-800 pb-2">
        <div className="flex items-center space-x-2">
          <Activity className="h-4 w-4 text-cyan-400" />
          <span className="text-xs font-semibold tracking-wider text-neutral-400 uppercase font-sans">
            Reference Scopes
          </span>
        </div>

        {/* Scope Selectors */}
        <div className="flex space-x-1">
          <button
            id="scope-waveform-btn"
            onClick={() => setMode("waveform")}
            className={`px-2 py-1 rounded text-[10px] font-medium transition-all ${
              mode === "waveform"
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                : "text-neutral-500 hover:text-neutral-300 border border-transparent"
            }`}
          >
            <Radio className="h-3 w-3 inline mr-1" />
            Luma
          </button>
          <button
            id="scope-parade-btn"
            onClick={() => setMode("rgb-parade")}
            className={`px-2 py-1 rounded text-[10px] font-medium transition-all ${
              mode === "rgb-parade"
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                : "text-neutral-500 hover:text-neutral-300 border border-transparent"
            }`}
          >
            <Activity className="h-3 w-3 inline mr-1" />
            RGB Parade
          </button>
          <button
            id="scope-vectorscope-btn"
            onClick={() => setMode("vectorscope")}
            className={`px-2 py-1 rounded text-[10px] font-medium transition-all ${
              mode === "vectorscope"
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                : "text-neutral-500 hover:text-neutral-300 border border-transparent"
            }`}
          >
            <Compass className="h-3 w-3 inline mr-1" />
            Vectorscope
          </button>
        </div>
      </div>

      {/* Scope Canvas */}
      <div className="flex-1 flex items-center justify-center bg-black/60 rounded border border-neutral-950 p-2 overflow-hidden h-[240px]">
        <canvas
          ref={canvasRef}
          width={320}
          height={220}
          className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(6,182,212,0.15)]"
        />
      </div>

      <div className="mt-2 flex justify-between items-center text-[9px] text-neutral-600 font-mono">
        <span>MODE: {mode.toUpperCase()}</span>
        <span>REF: REC.709</span>
      </div>
    </div>
  );
}
