import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Portfolio from "./components/Portfolio";
import GearSuite from "./components/GearSuite";
import blackmagicCertificateImg from "./components/blackmagic_certificate.svg";
import { 
  Film, Sparkles, 
  Mail, Globe, Award,
  Camera, RotateCcw, Phone
} from "lucide-react";
import { loadImageSafely, saveImageSafely, removeImageSafely } from "./utils/imageStorage";

type ActiveTab = "portfolio" | "gear";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("portfolio");
  const [bgSrc, setBgSrc] = useState<string>("https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1920&auto=format&fit=crop");

  useEffect(() => {
    // Load custom background safely (combining LocalStorage and IndexedDB checks)
    const loadBackground = async () => {
      try {
        const saved = await loadImageSafely("hero_bg_src");
        if (saved) {
          setBgSrc(saved);
        }
      } catch (err) {
        console.error("Failed to load background image from storage:", err);
      }
    };
    loadBackground();
  }, []);

  const handleScrollToSection = (tab: ActiveTab) => {
    setActiveTab(tab);
    // Smooth scroll to content container
    const element = document.getElementById("main-content-container");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const result = event.target?.result as string;
        try {
          // Compress and save the image safely to all available stores, automatically handling quotas
          const savedUrl = await saveImageSafely("hero_bg_src", result, 1200, 750, 0.6);
          setBgSrc(savedUrl);
        } catch (err) {
          console.error("Error processing background image upload:", err);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetBg = async () => {
    try {
      await removeImageSafely("hero_bg_src");
    } catch (err) {
      console.error("Error clearing background image:", err);
    }
    setBgSrc("https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1920&auto=format&fit=crop");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans selection:bg-white/20 selection:text-white overflow-x-hidden" id="app-root">
      {/* Top Professional Header */}
      <header className="sticky top-0 z-50 bg-[#050505]/95 backdrop-blur-md border-b border-white/10 px-4 md:px-8 py-5 flex justify-between items-center" id="site-header">
        <div className="flex flex-col">
          <h1 className="text-lg sm:text-2xl md:text-3xl font-light tracking-tighter text-white font-sans uppercase leading-none">
            VIDHAN BOMMALLA
          </h1>
          <p className="text-[8px] sm:text-[10px] tracking-[0.3em] uppercase opacity-50 mt-1.5 font-mono text-neutral-400">
            Colorist &amp; Look Development Artist
          </p>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex gap-2 sm:gap-4 items-center" id="header-nav">
          <button
            id="nav-tab-portfolio"
            onClick={() => handleScrollToSection("portfolio")}
            className={`relative px-3 py-1.5 rounded-sm text-[9px] sm:text-[10px] tracking-widest uppercase transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              activeTab === "portfolio" 
                ? "text-white bg-white/5 border border-white/20 font-medium" 
                : "text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <span className={`h-1 w-1 rounded-full ${activeTab === "portfolio" ? "bg-red-500 animate-pulse" : "bg-neutral-600"}`} />
            <span>Portfolio</span>
          </button>
          <button
            id="nav-tab-gear"
            onClick={() => handleScrollToSection("gear")}
            className={`relative px-3 py-1.5 rounded-sm text-[9px] sm:text-[10px] tracking-widest uppercase transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              activeTab === "gear" 
                ? "text-white bg-white/5 border border-white/20 font-medium" 
                : "text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <span className={`h-1 w-1 rounded-full ${activeTab === "gear" ? "bg-amber-500 animate-pulse" : "bg-neutral-600"}`} />
            <span>Gear Suite</span>
          </button>
        </nav>

        {/* Live Suite Status Indicator */}
        <div className="hidden md:flex items-center space-x-2 bg-[#111] border border-white/10 px-3 py-1.5 rounded-sm" id="suite-status">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-[9px] font-mono text-neutral-400 tracking-wider">RESOLVE SUITE ONLINE</span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 md:px-8 pt-24 pb-28 border-b border-white/10 overflow-hidden" id="hero-section">
        {/* Background Image with elegant overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <img 
            src={bgSrc}
            onError={() => {
              // High-end cinematic post production suite fallback
              setBgSrc("https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1920&auto=format&fit=crop");
            }}
            alt="Color Grading Studio Background"
            className="w-full h-full object-cover opacity-25 scale-105 transition duration-[2s]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#000_100%)] opacity-90" />
        </div>



        <div className="max-w-4xl mx-auto text-center flex flex-col items-center space-y-6 relative z-10">


          <h1 className="text-4xl md:text-5xl lg:text-6.5xl font-light tracking-tighter leading-[1.05] text-white uppercase max-w-3xl">
            Your Vision <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-300 via-neutral-100 to-white">My</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 via-yellow-400 via-green-400 via-blue-500 to-purple-500 font-medium">Color</span>
          </h1>

          <p className="text-sm md:text-base text-neutral-200 leading-relaxed font-sans max-w-2xl">
            Vidhan Bommalla is an IMDb-listed colorist with four years of experience; Serving as the Head of DI at Phoenix Studios and a Cannes International Film Festival-nominated colorist, he transforms his collaborators' films into beautiful visual experiences.
          </p>

          <div className="flex space-x-4 pt-4 justify-center">
            <button
              id="hero-cta-portfolio"
              onClick={() => handleScrollToSection("portfolio")}
              className="bg-white hover:bg-neutral-200 text-black font-semibold px-6 py-3 rounded-sm text-xs tracking-wide uppercase transition duration-150 flex items-center space-x-2 shadow-lg cursor-pointer"
            >
              <Film className="h-3.5 w-3.5" />
              <span>View Work Reel</span>
            </button>
            <button
              id="hero-cta-gear"
              onClick={() => handleScrollToSection("gear")}
              className="bg-[#111] hover:bg-[#1a1a1a] border border-white/10 text-neutral-300 font-semibold px-6 py-3 rounded-sm text-xs tracking-wide uppercase transition cursor-pointer"
            >
              Explore Gear Suite
            </button>
          </div>
        </div>
      </section>

      {/* Blackmagic Design Certification Section */}
      <section className="bg-black/40 border-b border-t border-white/10 py-10 px-4 md:px-8" id="certification-section">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-5 max-w-3xl">
            <div className="shrink-0 flex items-center justify-center">
              <svg className="h-16 w-16 select-none" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  {/* Outer Rainbow Border Gradient */}
                  <linearGradient id="resolve-rainbow-border" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#30E3DF" />
                    <stop offset="25%" stopColor="#9C47FC" />
                    <stop offset="50%" stopColor="#FF2E93" />
                    <stop offset="75%" stopColor="#FFAD2E" />
                    <stop offset="100%" stopColor="#7BE330" />
                  </linearGradient>

                  {/* Icon Body Background Gradient */}
                  <radialGradient id="resolve-bg-grad" cx="50%" cy="50%" r="70%">
                    <stop offset="0%" stopColor="#1E2B3E" />
                    <stop offset="100%" stopColor="#0B1017" />
                  </radialGradient>

                  {/* Petal Gradients with realistic 3D lighting */}
                  {/* Top Petal - Cyan/Blue */}
                  <linearGradient id="petal-cyan-blue" x1="0.3" y1="0" x2="0.7" y2="1">
                    <stop offset="0%" stopColor="#5EF1FF" />
                    <stop offset="45%" stopColor="#00A2FF" />
                    <stop offset="100%" stopColor="#00459E" />
                  </linearGradient>

                  {/* Bottom Left Petal - Yellow/Green */}
                  <linearGradient id="petal-yellow-green" x1="0.3" y1="0" x2="0.7" y2="1">
                    <stop offset="0%" stopColor="#EBF83E" />
                    <stop offset="45%" stopColor="#9BD512" />
                    <stop offset="100%" stopColor="#3C7F00" />
                  </linearGradient>

                  {/* Bottom Right Petal - Red/Pink */}
                  <linearGradient id="petal-red-pink" x1="0.3" y1="0" x2="0.7" y2="1">
                    <stop offset="0%" stopColor="#FF6B97" />
                    <stop offset="45%" stopColor="#FF185D" />
                    <stop offset="100%" stopColor="#96002E" />
                  </linearGradient>

                  {/* Drop shadow filter for petals */}
                  <filter id="resolve-petal-shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.5" />
                  </filter>
                </defs>

                {/* Main App Icon Squircle Container */}
                <rect x="5" y="5" width="90" height="90" rx="22" fill="url(#resolve-bg-grad)" />
                
                {/* Rainbow Stroke Border */}
                <rect x="5" y="5" width="90" height="90" rx="22" fill="none" stroke="url(#resolve-rainbow-border)" strokeWidth="3.5" />

                {/* Petals Group */}
                <g id="resolve-petals">
                  {/* 1. Top Petal (Cyan/Blue) - Points Downwards towards center (50, 52) */}
                  <g filter="url(#resolve-petal-shadow)">
                    <path 
                      d="M 50,51.5 C 48.5,47.5 39,41 39,33 C 39,25.5 44,21 50,21 C 56,21 61,25.5 61,33 C 61,41 51.5,47.5 50,51.5 Z" 
                      fill="url(#petal-cyan-blue)" 
                    />
                    {/* Top Highlight Reflection */}
                    <ellipse cx="50" cy="27" rx="5" ry="3" fill="#FFFFFF" opacity="0.4" />
                  </g>

                  {/* 2. Bottom Right Petal (Red/Pink) - Rotated 120 deg around center (50, 52) */}
                  <g transform="rotate(120 50 52)" filter="url(#resolve-petal-shadow)">
                    <path 
                      d="M 50,51.5 C 48.5,47.5 39,41 39,33 C 39,25.5 44,21 50,21 C 56,21 61,25.5 61,33 C 61,41 51.5,47.5 50,51.5 Z" 
                      fill="url(#petal-red-pink)" 
                    />
                    {/* Top Highlight Reflection */}
                    <ellipse cx="50" cy="27" rx="5" ry="3" fill="#FFFFFF" opacity="0.4" />
                  </g>

                  {/* 3. Bottom Left Petal (Yellow/Green) - Rotated -120 deg (240 deg) around center (50, 52) */}
                  <g transform="rotate(-120 50 52)" filter="url(#resolve-petal-shadow)">
                    <path 
                      d="M 50,51.5 C 48.5,47.5 39,41 39,33 C 39,25.5 44,21 50,21 C 56,21 61,25.5 61,33 C 61,41 51.5,47.5 50,51.5 Z" 
                      fill="url(#petal-yellow-green)" 
                    />
                    {/* Top Highlight Reflection */}
                    <ellipse cx="50" cy="27" rx="5" ry="3" fill="#FFFFFF" opacity="0.4" />
                  </g>
                </g>
              </svg>
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <span className="text-[9px] font-mono tracking-[0.25em] text-neutral-400 uppercase">OFFICIAL ACCREDITATION</span>
                <span className="bg-white/10 text-white border border-white/20 text-[8px] font-mono px-2 py-0.5 rounded-none uppercase tracking-widest">VERIFIED USER</span>
              </div>
              <h3 className="text-xl font-light text-white uppercase tracking-tight mt-1.5 font-sans">
                Blackmagic Design Certified User
              </h3>
              <p className="text-xs text-neutral-400 font-sans mt-2 leading-relaxed">
                Officially accredited as a certified colorist for Resolve 20. Thoroughly validated in professional primary and secondary grading workflows, high-dynamic-range (HDR) color spaces, ACES &amp; Vfx workflows
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full lg:w-auto font-mono text-[11px] text-neutral-400 border-t lg:border-t-0 lg:border-l border-white/10 pt-6 lg:pt-0 lg:pl-10">
            <div>
              <p className="text-neutral-500 uppercase tracking-widest text-[9px]">ACCREDITATION</p>
              <p className="text-neutral-200 mt-1 font-semibold">DaVinci Resolve 20</p>
            </div>
            <div>
              <p className="text-neutral-500 uppercase tracking-widest text-[9px]">ISSUING BODY</p>
              <p className="text-neutral-200 mt-1 font-semibold">Blackmagic Design</p>
            </div>
            <div className="col-span-2 md:col-span-1">
              <p className="text-neutral-500 uppercase tracking-widest text-[9px]">VERIFICATION ID</p>
              <p className="text-white mt-1 font-semibold">623C-2D9C-0BD5-4A29</p>
            </div>
          </div>
        </div>

        {/* Original Resolution Certificate Image Direct Display */}
        <div className="max-w-7xl mx-auto mt-8 flex justify-center" id="certification-image-wrapper">
          <div className="w-full max-w-4xl border border-white/10 shadow-2xl rounded-sm overflow-hidden bg-white">
            <img 
              src={blackmagicCertificateImg} 
              alt="Blackmagic Design Certified User Certificate for Vidhan Bommalla" 
              className="w-full h-auto block select-none"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* Main Tabbed Content Container */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-16" id="main-content-container">
        
        {/* Core Tab Switcher Navigation */}
        <div className="flex justify-center mb-12 border-b border-white/10 pb-4" id="workspace-tabs-bar">
          <div className="flex bg-[#111] border border-white/10 p-1 rounded-sm space-x-1">
            <button
              id="tab-btn-portfolio"
              onClick={() => setActiveTab("portfolio")}
              className={`flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-sm text-[10px] sm:text-xs font-semibold tracking-wider transition uppercase cursor-pointer ${
                activeTab === "portfolio"
                  ? "bg-white text-black shadow-md font-bold"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Film className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>1. SELECTED WORK REEL</span>
            </button>
            <button
              id="tab-btn-gear"
              onClick={() => setActiveTab("gear")}
              className={`flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-sm text-[10px] sm:text-xs font-semibold tracking-wider transition uppercase cursor-pointer ${
                activeTab === "gear"
                  ? "bg-white text-black shadow-md font-bold"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Camera className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>2. GEAR LOG</span>
            </button>
          </div>
        </div>

        {/* Content Render Grid based on Active Tab */}
        <div className="animate-fadeIn">
          {activeTab === "portfolio" && <Portfolio />}
          {activeTab === "gear" && <GearSuite />}
        </div>
      </main>

      {/* Professional Workspace Footer */}
      <footer className="bg-[#080808] border-t border-white/10 px-6 py-12 text-neutral-500 font-mono text-xs" id="site-footer">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Logo Readout */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <span className="text-xs font-bold text-neutral-300 tracking-[0.15em] font-sans">VIDHAN BOMMALLA</span>
            <span className="text-[9px] text-neutral-600 uppercase tracking-widest mt-0.5">POST COLOR SCIENCE LABS</span>
          </div>

          {/* Social Icons / Links */}
          <div className="flex space-x-6">
            <a 
              href="mailto:vidhanbommalla@gmail.com" 
              className="hover:text-white transition"
              id="social-link-email"
            >
              <Mail className="h-4 w-4 inline mr-1.5" />
              Email
            </a>
            <a 
              href="tel:+918309895359" 
              className="hover:text-white transition"
              id="social-link-phone"
            >
              <Phone className="h-4 w-4 inline mr-1.5" />
              +91 8309895359
            </a>
          </div>

          {/* Specs / Copy */}
          <div className="text-center md:text-right text-[10px] text-neutral-600">
            <p>© {new Date().getFullYear()} VIDHAN BOMMALLA. ALL RIGHTS RESERVED.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
