import React, { useState, useRef, useEffect } from "react";
import { PortfolioItem } from "../types";
import { loadImageSafely, saveImageSafely, compressImage, getIndexedDBItem, setIndexedDBItem, removeIndexedDBItem } from "../utils/imageStorage";
import { 
  Film, Play, Pause, Info, Camera, Compass, BookOpen, 
  ChevronDown, ChevronUp, Sliders, Layers, FileText, 
  Volume2, VolumeX, Sparkles, X, Upload, RotateCcw, Download
} from "lucide-react";
import { generateBriefPDF, TEN_DAYS_APART_BRIEF, SATYA_BRIEF } from "../utils/pdfGenerator";

const SHOWREEL_VIDEO_URL = "https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0227e339f37a925cbd29228a9918c7d&profile_id=139&oauth2_token_id=57447761";

const PORTFOLIO_PROJECTS: PortfolioItem[] = [
  {
    id: "ascension",
    title: "Ascension — Sci-Fi Indie Feature",
    category: "Feature Film",
    client: "Chronos Pictures",
    director: "Rocky Rodriguez Jr",
    camera: "RED V-Raptor 8K",
    logProfile: "REDLog3G10 / REDWideGamutRGB",
    imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop",
    palette: ["#020617", "#0f172a", "#1e1b4b", "#06b6d4", "#f59e0b"],
    description: "Designed a low-saturated, film-inspired look with global shadows. Skin tones were isolated and compressed to remain natural against the background"
  },
  {
    id: "nocturnal",
    title: "Nocturnal — Luxury Automotive Spot",
    category: "Micro Drama",
    client: "Aether Motors",
    director: "Rahul Naidu",
    camera: "Sony FX3",
    logProfile: "S-Log3 / S-Gamut3.Cine",
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1000&auto=format&fit=crop",
    palette: ["#09090b", "#1c1917", "#b91c1c", "#4b5563", "#cbd5e1"],
    description: "The goal was a highly naturalistic look that replicates exactly how the human eye sees the world. By treating the camera as a character, I kept the grade incredibly organic while maintaining soft global contrast with absolutely no artificial saturation"
  },
  {
    id: "vortex",
    title: "Vortex — Indie Pop Music Video",
    category: "Short Films",
    client: "Neon Sound Records",
    director: "Vishwas Reddy",
    camera: "Sony FX6",
    logProfile: "Sony S-Log3 / S-Gamut3.Cine",
    imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1000&auto=format&fit=crop",
    palette: ["#09090b", "#1e3a8a", "#3b82f6", "#eab308", "#f8fafc"],
    description: "Crafted a naturally pleasing aesthetic with rich contrast, clean saturation, and soft exposure and created  depth of field by utilizing color contrast to separate the subject from the background and adding a selective color pop."
  },
  {
    id: "blind-thief",
    title: "Satya — Final Scene Focus",
    category: "Short Films",
    client: "Noir Film Society",
    director: "Sai Smaran",
    camera: "Sony a7 III (ILCE-7M3)",
    logProfile: "Sony S-Log2 / S-Gamut",
    imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1000&auto=format&fit=crop",
    palette: ["#09090b", "#172554", "#1e3a8a", "#eab308", "#fef08a"],
    description: "Subtle vibrant and soft-contrast, low-light image with temperature shifts Key qualities:\n• No or Low saturation\n• Soft contrast\n• Slightly lifted blacks (no crushed shadows)\n• Protected and lighting conditioned skin tones\n• No stylized LUT identity\nThis is a moody grade, not a dramatic one."
  },
  {
    id: "solitude",
    title: "Solitude — Nordic Climbers Short Doc",
    category: "Film Festivals",
    client: "Alpine Expeditions",
    director: "Anjan Kommineni",
    camera: "Panasonic S1 Lumix",
    logProfile: "Panasonic V gamut / V Log",
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop",
    palette: ["#0f172a", "#334155", "#475569", "#94a3b8", "#f8fafc"],
    description: "This film is performance-led and emotionally restrained. The color grade must adapt from scene to scene to enhance the characters' performances, while respecting the intended lighting conditions of each scene .The audience should feel closer to the character ,not admire the image"
  },
  {
    id: "ten-days-apart",
    title: "10 Days Apart — Indie Short",
    category: "Film Festivals",
    client: "Kommineni Films",
    director: "Nikhil Binny",
    camera: "Sony FX3",
    logProfile: "Sony S-Log3 / S-Gamut3.Cine",
    imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1000&auto=format&fit=crop",
    palette: ["#1c1917", "#374151", "#4b5563", "#6b7280", "#9ca3af"],
    description: "Developed a moody, heavily desaturated look to show depression. By strictly avoiding artificial color pops or saturation pulls, the grade captures the coastal aesthetics of Goa with unpolished, raw realism. This grounded approach is designed to deeply immerse the audience, making them feel the exact emotional weight of the scene"
  },
  {
    id: "after-what-comes-after",
    title: "After What Comes After — Experimental Drama",
    category: "Film Festivals",
    client: "Cannes Short Corner",
    director: "Ganesh",
    camera: "Sony FX3",
    logProfile: "Sony S-Log3 / S-Gamut3.Cine",
    imageUrl: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=1000&auto=format&fit=crop",
    palette: ["#1c1917", "#3f3f46", "#fed7aa", "#ffedd5", "#fff7ed"],
    description: "Crafted a nostalgic film emulation of 2004 East Godavari aesthetics. The grade leans into a heavily desaturated palette and prominent film grain to replicate a vintage celluloid print, while utilizing deep, rich shadows and strong contrast to anchor the visual depth"
  }
];

const LOOK_DEV_BRIEFS: Record<string, {
  concept: string;
  challenge: string;
  artisticIntent: string;
  technicalFormula: {
    inputSpace: string;
    primaryCurve: string;
    skinTones: string;
    shadows: string;
    outputODT: string;
  };
}> = {
  "ten-days-apart": {
    concept: "Desaturated, melancholic coastal palette with natural realism.",
    challenge: "Subduing vibrant landscape greens without turning foliage grey or introducing unnatural color tints in overcast sky zones.",
    artisticIntent: "This film is performance-led and emotionally restrained. The grade must disappear and let faces, silence, and time carry the emotion. The audience should feel closer to the character — not admire the image.",
    technicalFormula: {
      inputSpace: "Sony FX3, S-Log3 / S-Gamut3.Cine",
      primaryCurve: "Soft global contrast with lifted blacks",
      skinTones: "Natural and believable skin tone preservation, no orange push",
      shadows: "Slightly lifted shadow point allowing shadows to breathe",
      outputODT: "DCP (Cannes Festival standard)"
    }
  },
  "blind-thief": {
    concept: "Subtle vibrant and soft-contrast, low-light image with temperature shifts.",
    challenge: "Maintaining shadow definition and organic skin values during dramatic shifts under warm-lit and low-light scenes.",
    artisticIntent: "This film is performance-led and emotionally restrained. The color grade must adapt from scene to scene to enhance the characters' performances, while respecting the intended lighting conditions of each scene. The audience should feel closer to the character — not admire the image.",
    technicalFormula: {
      inputSpace: "Sony a7 III (ILCE-7M3) SLOG2",
      primaryCurve: "Soft global contrast with slightly lifted blacks",
      skinTones: "Natural and believable skin tone preservation, no green shadows",
      shadows: "Slightly lifted shadow point allowing shadows to breathe",
      outputODT: "Rec 709 (YouTube / Web standard)"
    }
  }
};

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  const [showBriefsModal, setShowBriefsModal] = useState(false);
  const [selectedBriefProjectId, setSelectedBriefProjectId] = useState<string>("All");

  // Thumbnail images state, reading from localStorage initially for fast sync loading
  const [projectImages, setProjectImages] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem("portfolio_project_thumbnails");
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error("Failed to load custom thumbnails from localStorage:", e);
      return {};
    }
  });

  const [allProjects, setAllProjects] = useState<PortfolioItem[]>(PORTFOLIO_PROJECTS);
  const [dragActiveId, setDragActiveId] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Asynchronously load/restore thumbnails from both IndexedDB and localStorage
  useEffect(() => {
    const loadThumbnails = async () => {
      try {
        const saved = await loadImageSafely("portfolio_project_thumbnails", "{}");
        if (saved && saved !== "{}") {
          setProjectImages(JSON.parse(saved));
        }
      } catch (err) {
        console.error("Error loading custom thumbnails from safe storage:", err);
      }
    };
    loadThumbnails();
  }, []);

  useEffect(() => {
    const updated = PORTFOLIO_PROJECTS.map(proj => ({
      ...proj,
      imageUrl: projectImages[proj.id] || proj.imageUrl
    }));
    setAllProjects(updated);
  }, [projectImages]);

  const handleThumbnailUpload = async (projectId: string, base64Url: string) => {
    try {
      // Compress the uploaded thumbnail image to a very fast & lightweight aspect ratio (800x450, quality 0.6)
      const compressed = await compressImage(base64Url, 800, 450, 0.6);
      const updated = { ...projectImages, [projectId]: compressed };
      setProjectImages(updated);
      
      // Save permanently and safely (automatically handles quotas and downscales further if needed)
      await saveImageSafely("portfolio_project_thumbnails", JSON.stringify(updated));
    } catch (err) {
      console.error("Error updating custom thumbnail:", err);
    }
  };

  const handleResetThumbnail = async (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = { ...projectImages };
    delete updated[projectId];
    setProjectImages(updated);
    try {
      await saveImageSafely("portfolio_project_thumbnails", JSON.stringify(updated));
    } catch (err) {
      console.error("Error resetting custom thumbnail:", err);
    }
  };

  const handleDrag = (e: React.DragEvent, id: string, active: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    if (active) {
      setDragActiveId(id);
    } else {
      setDragActiveId(null);
    }
  };

  const handleDrop = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveId(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result && typeof event.target.result === "string") {
            handleThumbnailUpload(id, event.target.result);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result && typeof event.target.result === "string") {
            handleThumbnailUpload(id, event.target.result);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const triggerFileInput = (id: string) => {
    fileInputRefs.current[id]?.click();
  };

  // Showreel playback states
  const [isGraded, setIsGraded] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [customVideoUrl, setCustomVideoUrl] = useState<string | null>(null);
  const [showreelDragActive, setShowreelDragActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const showreelFileInputRef = useRef<HTMLInputElement>(null);

  // Load saved video from IndexedDB on mount
  useEffect(() => {
    const loadCustomVideo = async () => {
      try {
        const savedVideoBlob = await getIndexedDBItem<Blob>("custom_showreel_video");
        if (savedVideoBlob instanceof Blob) {
          const url = URL.createObjectURL(savedVideoBlob);
          setCustomVideoUrl(url);
        }
      } catch (err) {
        console.error("Error loading custom video from IndexedDB:", err);
      }
    };
    loadCustomVideo();
    
    return () => {
      if (customVideoUrl && customVideoUrl.startsWith("blob:")) {
        URL.revokeObjectURL(customVideoUrl);
      }
    };
  }, []);

  const handleVideoUpload = async (file: File) => {
    if (file && file.type.startsWith("video/")) {
      try {
        if (customVideoUrl && customVideoUrl.startsWith("blob:")) {
          URL.revokeObjectURL(customVideoUrl);
        }
        
        const url = URL.createObjectURL(file);
        setCustomVideoUrl(url);
        setIsPlaying(false);
        
        await setIndexedDBItem("custom_showreel_video", file);
      } catch (err) {
        console.error("Error saving custom video:", err);
      }
    }
  };

  const handleShowreelFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleVideoUpload(e.target.files[0]);
    }
  };

  const handleShowreelDrag = (e: React.DragEvent, active: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setShowreelDragActive(active);
  };

  const handleShowreelDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowreelDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("video/")) {
        handleVideoUpload(file);
      }
    }
  };

  const handleResetVideo = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await removeIndexedDBItem("custom_showreel_video");
      if (customVideoUrl && customVideoUrl.startsWith("blob:")) {
        URL.revokeObjectURL(customVideoUrl);
      }
      setCustomVideoUrl(null);
      setIsPlaying(false);
    } catch (err) {
      console.error("Error resetting custom video:", err);
    }
  };

  const handleDownloadPDF = (projectId: string) => {
    if (projectId === "ten-days-apart") {
      generateBriefPDF(TEN_DAYS_APART_BRIEF, "10_Days_Apart_Color_Brief.pdf");
    } else if (projectId === "blind-thief") {
      generateBriefPDF(SATYA_BRIEF, "Satya_Color_Brief.pdf");
    }
  };

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => console.log(err));
    }
  };

  const handleMuteToggle = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleScrubChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const newTime = parseFloat(e.target.value);
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "0:00";
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const filteredProjects = allProjects.filter((project) => {
    if (activeFilter === "All") return true;
    return project.category === activeFilter;
  });

  return (
    <div className="flex flex-col space-y-8" id="portfolio-section">
      {/* Portfolio Header & Filter controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">Selected Works</span>
          <h2 className="text-2xl md:text-3xl font-light text-white tracking-tight mt-1 font-sans">
            Cinematic Color Reel
          </h2>
        </div>

        {/* Categories filters */}
        <div className="flex flex-wrap gap-1.5 items-center self-start" id="portfolio-category-filters">
          {["All", "Feature Film", "Micro Drama", "Short Films", "Film Festivals"].map((cat) => (
            <button
              key={cat}
              id={cat === "Micro Drama" ? "portfolio-filter-commercial" : cat === "Short Films" ? "portfolio-filter-music-video" : cat === "Film Festivals" ? "portfolio-filter-documentary" : `portfolio-filter-${cat.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => {
                setActiveFilter(cat);
                setSelectedProject(null);
              }}
              className={`px-3 py-1.5 rounded-sm text-[10px] md:text-[11px] font-medium tracking-wide transition-all uppercase cursor-pointer ${
                activeFilter === cat
                  ? "bg-white text-black font-semibold"
                  : "bg-[#111] text-neutral-400 border border-white/10 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}

          <button
            onClick={() => setShowBriefsModal(true)}
            className="px-3 py-1.5 rounded-sm text-[10px] md:text-[11px] font-semibold tracking-wide uppercase transition-all flex items-center space-x-1.5 cursor-pointer bg-amber-500 hover:bg-amber-600 text-black"
            id="btn-read-color-briefs"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Read My Color Briefs</span>
          </button>
        </div>
      </div>

      {/* MASTER SHOWREEL SHOWCASE (SINGLE VIDEO) */}
      <div className="bg-[#0b0b0c] border border-white/10 rounded-sm p-4 sm:p-6 shadow-2xl flex flex-col space-y-4" id="master-showreel-hero">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-red-500/10 text-red-400 border border-red-500/20 text-[8px] font-mono px-1.5 py-0.5 rounded-none uppercase tracking-widest animate-pulse">
                MASTER REEL
              </span>
            </div>
            <h3 className="text-lg font-light text-white uppercase tracking-tight mt-1 font-sans flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-white opacity-80" />
              Vidhan's Master Showreel
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="file"
              ref={showreelFileInputRef}
              onChange={handleShowreelFileChange}
              accept="video/*"
              className="hidden"
            />
          </div>
        </div>

        {/* Video Player Box - Fully responsive and self-contained */}
        <div className="flex flex-col space-y-3">
          <div 
            onDragOver={(e) => handleShowreelDrag(e, true)}
            onDragLeave={(e) => handleShowreelDrag(e, false)}
            onDrop={handleShowreelDrop}
            className={`relative aspect-video w-full rounded-sm overflow-hidden bg-black border shadow-lg transition-all duration-200 ${
              showreelDragActive ? "border-amber-500 bg-amber-500/10 scale-[0.99] shadow-inner" : "border-white/10"
            }`}
          >
            <video
              ref={videoRef}
              src={customVideoUrl || SHOWREEL_VIDEO_URL}
              loop
              muted={isMuted}
              playsInline
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onClick={handlePlayPause}
              className="w-full h-full object-cover transition-all duration-300 cursor-pointer"
              style={{
                filter: isGraded 
                  ? "contrast(1.05) saturate(1.1) brightness(1.0)" 
                  : "contrast(0.45) saturate(0.35) brightness(1.15) sepia(0.05)"
              }}
            />

            {/* Drag & drop overlay */}
            {showreelDragActive && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center border-2 border-dashed border-amber-500 z-30 pointer-events-none animate-fade-in">
                <Upload className="h-10 w-10 text-amber-400 animate-bounce mb-2" />
                <p className="text-sm font-mono text-white font-medium">Drop your Master Showreel video here</p>
                <p className="text-xs font-mono text-neutral-400 mt-1">Supports MP4, MOV, WEBM, etc.</p>
              </div>
            )}

            {/* Play overlay button */}
            {!isPlaying && !showreelDragActive && (
              <button 
                onClick={handlePlayPause}
                className="absolute inset-0 m-auto h-14 w-14 sm:h-16 sm:w-16 flex items-center justify-center rounded-full bg-black/80 hover:bg-white text-white hover:text-black transition border border-white/10 shadow-2xl cursor-pointer"
              >
                <Play className="h-5 w-5 sm:h-6 sm:w-6 fill-current translate-x-0.5" />
              </button>
            )}
          </div>

          {/* Minimalist Professional Controller Bar */}
          <div className="bg-[#111] border border-white/10 rounded-sm p-3 flex flex-col space-y-2.5">
            {/* Timeline Scrub */}
            <div className="flex items-center space-x-3">
              <span className="text-[9px] font-mono text-neutral-500">{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={duration || 100}
                step="0.1"
                value={currentTime}
                onChange={handleScrubChange}
                className="flex-1 h-1 bg-white/10 appearance-none rounded-full accent-white cursor-pointer"
              />
              <span className="text-[9px] font-mono text-neutral-500">{formatTime(duration)}</span>
            </div>

            {/* Control buttons */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <button
                  onClick={handlePlayPause}
                  className="p-2 bg-white text-black hover:bg-neutral-200 transition rounded-sm cursor-pointer"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                </button>

                <button
                  onClick={handleMuteToggle}
                  className="p-2 bg-[#1b1b1c] hover:bg-[#252526] text-neutral-300 hover:text-white border border-white/5 transition rounded-sm cursor-pointer"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Portfolio projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="portfolio-grid">
        {filteredProjects.map((proj) => (
          <div 
            key={proj.id} 
            className="bg-[#111] border border-white/10 rounded-sm p-4 flex flex-col space-y-4 shadow-xl hover:border-white/20 transition duration-200"
            id={`portfolio-card-${proj.id}`}
          >
            {/* Graded Frame Preview */}
            <div 
              className="relative aspect-video w-full rounded-sm overflow-hidden border border-white/10 bg-black group/thumbnail"
              id={`thumbnail-preview-${proj.id}`}
            >
              <img
                src={proj.imageUrl}
                alt={proj.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-all duration-500 group-hover/thumbnail:scale-[1.03]"
              />
              
              {/* Elegant Film Still Tag */}
              <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-0.5 border border-white/10 rounded-xs text-[8px] font-mono text-neutral-400 uppercase tracking-widest">
                Still Frame
              </div>
            </div>

            {/* Project tech specs metadata */}
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 border-t border-b border-white/10 py-3 text-[10px] sm:text-xs font-mono text-neutral-400">
              <div className="flex items-center space-x-2">
                <Camera className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                <span>Camera: {proj.camera}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Compass className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                <span>Director: {proj.director}</span>
              </div>
              <div className="flex items-center space-x-2 col-span-2">
                <Info className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                <span className="text-neutral-500">Profile: {proj.logProfile}</span>
              </div>
            </div>

            {/* Description & Palette */}
            <div className="space-y-4">
              <p className="text-xs text-neutral-400 font-sans leading-relaxed whitespace-pre-line">
                {proj.description}
              </p>

              {/* Dominant Palette Blocks */}
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono text-neutral-500 uppercase shrink-0">Graded Palette:</span>
                <div className="flex h-4 rounded-sm overflow-hidden flex-1 border border-neutral-900">
                  {proj.palette.map((color, idx) => (
                    <div
                      key={idx}
                      className="flex-1 group relative cursor-pointer"
                      style={{ backgroundColor: color }}
                      title={color}
                    >
                      <span className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-black/85 text-[8px] text-white flex items-center justify-center font-mono">
                        {color}
                      </span>
                    </div>
                  ))}
                </div>
              </div>


            </div>
          </div>
        ))}
      </div>

      {showBriefsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-hidden animate-fadeIn" id="color-briefs-modal-overlay">
          <div className="relative bg-[#0d0d0e] border border-white/10 w-full max-w-6xl h-[85vh] flex flex-col rounded-sm shadow-2xl overflow-hidden" id="color-briefs-modal-container">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-black/40">
              <div>
                <div className="flex items-center space-x-2 text-[10px] font-mono text-amber-400 uppercase tracking-widest">
                  <Sparkles className="h-3 w-3 animate-pulse" />
                  <span>Look Development Specifications</span>
                </div>
                <h3 className="text-lg md:text-xl font-light text-white uppercase tracking-tight mt-1 font-sans">
                  Master Color Briefs &amp; Look Dev Logs
                </h3>
              </div>
              <button 
                onClick={() => setShowBriefsModal(false)}
                className="p-1.5 rounded-sm hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body with Sidebar and Content Panel */}
            <div className="flex-1 flex overflow-hidden">
              {/* Sidebar: Projects Selector List */}
              <div className="w-64 border-r border-white/10 bg-black/20 overflow-y-auto hidden md:block p-3 space-y-1 shrink-0">
                <span className="block text-[9px] font-mono text-neutral-500 uppercase tracking-wider px-2 pb-2">Select Project</span>
                <button
                  onClick={() => setSelectedBriefProjectId("All")}
                  className={`w-full text-left px-3 py-2 rounded-sm text-xs font-mono transition uppercase ${
                    selectedBriefProjectId === "All" 
                      ? "bg-amber-500 text-black font-semibold" 
                      : "text-neutral-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  [ View All Projects ]
                </button>
                <div className="h-px bg-white/10 my-2" />
                {allProjects.filter(p => LOOK_DEV_BRIEFS[p.id]).map((proj) => (
                  <button
                    key={proj.id}
                    onClick={() => setSelectedBriefProjectId(proj.id)}
                    className={`w-full text-left px-3 py-2 rounded-sm text-xs transition truncate ${
                      selectedBriefProjectId === proj.id 
                        ? "bg-white text-black font-semibold" 
                        : "text-neutral-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {proj.title.split(" — ")[0]}
                  </button>
                ))}
              </div>

              {/* Main Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-black/5">
                {/* Mobile View Selector Tabs */}
                <div className="md:hidden flex flex-wrap gap-1.5 pb-4 border-b border-white/5">
                  <button
                    onClick={() => setSelectedBriefProjectId("All")}
                    className={`px-2.5 py-1.5 rounded-sm text-[10px] font-mono uppercase ${
                      selectedBriefProjectId === "All"
                        ? "bg-amber-500 text-black font-semibold"
                        : "bg-[#111] text-neutral-400 border border-white/10"
                    }`}
                  >
                    All
                  </button>
                  {allProjects.filter(p => LOOK_DEV_BRIEFS[p.id]).map((proj) => (
                    <button
                      key={proj.id}
                      onClick={() => setSelectedBriefProjectId(proj.id)}
                      className={`px-2.5 py-1.5 rounded-sm text-[10px] font-sans truncate max-w-[120px] ${
                        selectedBriefProjectId === proj.id
                          ? "bg-white text-black font-semibold"
                          : "bg-[#111] text-neutral-400 border border-white/10"
                      }`}
                    >
                      {proj.title.split(" — ")[0]}
                    </button>
                  ))}
                </div>

                {/* Render Selected Color Brief Cards */}
                {allProjects.filter(p => LOOK_DEV_BRIEFS[p.id]).filter(p => selectedBriefProjectId === "All" || p.id === selectedBriefProjectId).map((proj) => {
                  const brief = LOOK_DEV_BRIEFS[proj.id];
                  if (!brief) return null;
                  return (
                    <div key={proj.id} className="bg-[#121213] border border-white/10 rounded-sm p-5 space-y-5 shadow-xl transition-all duration-300">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-3 gap-2">
                        <div>
                          <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">{proj.category}</span>
                          <h4 className="text-base font-semibold text-white mt-0.5">{proj.title}</h4>
                        </div>
                        <div className="flex h-3 rounded-sm overflow-hidden w-28 border border-neutral-950">
                          {proj.palette.map((color, cIdx) => (
                            <div key={cIdx} className="flex-1" style={{ backgroundColor: color }} title={color} />
                          ))}
                        </div>
                      </div>

                      {/* Official PDF Document Card */}
                      <div className="bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/25 p-4 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center space-x-3.5 border-neutral-800">
                          <div className="h-14 w-11 bg-red-600/15 border border-red-500/30 rounded flex flex-col items-center justify-center font-mono text-[10px] text-red-400 font-bold shrink-0 shadow-lg select-none relative overflow-hidden">
                            <div className="absolute top-0 inset-x-0 h-1 bg-red-500" />
                            PDF
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="bg-amber-500/10 text-amber-400 text-[8px] font-mono uppercase tracking-widest px-1.5 py-0.5 border border-amber-500/20">
                                Official Document
                              </span>
                              <span className="text-[10px] font-mono text-neutral-500">
                                A4 Paper | 1 Page
                              </span>
                            </div>
                            <h5 className="text-white font-medium text-xs font-mono mt-1.5 break-all">
                              {proj.id === "ten-days-apart" ? "10_Days_Apart_Color_Brief.pdf" : "Satya_Color_Brief.pdf"}
                            </h5>
                            <p className="text-[10px] text-neutral-400 mt-0.5 leading-relaxed">
                              Includes scene-by-scene look philosophy, saturation/grain guidelines, and negative color constraints.
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDownloadPDF(proj.id)}
                          className="w-full sm:w-auto px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs rounded-none uppercase tracking-wider transition-all duration-150 cursor-pointer flex items-center justify-center space-x-2 shadow-lg hover:shadow-amber-500/10 whitespace-nowrap shrink-0"
                          title={`Download official PDF for ${proj.title.split(" — ")[0]}`}
                        >
                          <Download className="h-4 w-4 stroke-[2.5]" />
                          <span>Download PDF</span>
                        </button>
                      </div>


                      {/* Artistic Intent */}
                      <div className="border-t border-white/5 pt-3 space-y-1 text-xs">
                        <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest flex items-center gap-1">
                          <FileText className="h-3 w-3 text-neutral-400" /> ARTISTIC INTENT &amp; COLOR SCRIPTS
                        </span>
                        <p className="text-neutral-300 leading-relaxed italic font-light">
                          "{brief.artisticIntent}"
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
