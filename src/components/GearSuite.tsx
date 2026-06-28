import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, Trash2, Edit2, Camera, Upload, Info, 
  X, Check, Search, Filter, Sliders, HardDrive, 
  Cpu, Monitor, Layers, Eye, RefreshCw
} from "lucide-react";
import { GearItem } from "../types";
import { loadImageSafely, saveImageSafely, compressImage } from "../utils/imageStorage";

// Premium preloaded professional gear presets for Vidhan Bommalla
const INITIAL_GEAR_PRESETS: GearItem[] = [
  {
    id: "phoenix-master-grading-suite",
    name: "Phoenix Studios - Master Grading Suite",
    category: "Color Panels",
    manufacturer: "Blackmagic Design / Apple",
    specs: "Premium dual-display master grading console. Left monitor dedicated to real-time ultra-precise RGB Parade, Waveform, Vectorscope, and Histogram analysis. Right monitor serves as the main calibrated color reference monitor. Driven physically by a DaVinci Resolve Micro Panel control surface, backed by a Mac Studio workstation with custom acoustic treatment.",
    status: "In Suite",
    photoUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop",
    serialNumber: "PS-MGS-9921",
    acquisitionDate: "2025-01-10",
    notes: "Main reference environment calibrated monthly to Rec.709 and BT.1886 specifications to guarantee broadcast-level color fidelity.",
  }
];

export default function GearSuite() {
  const [gear, setGear] = useState<GearItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("portfolio_gear_suite");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Automatically clear and migrate if old templates are found in localStorage
          const hasOldIds = parsed.some((item: any) => 
            ["arri-alexa-mini-lf", "sony-fx6", "resolve-micro-panel", "dual-calibrated-monitors", "mac-studio-m2"].includes(item.id)
          );
          if (hasOldIds) {
            return INITIAL_GEAR_PRESETS;
          }
          return parsed;
        } catch (e) {
          console.error("Error loading gear preset", e);
        }
      }
    }
    return INITIAL_GEAR_PRESETS;
  });

  const [selectedGear, setSelectedGear] = useState<GearItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeStatus, setActiveStatus] = useState<string>("All");

  // Add/Edit modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GearItem | null>(null);
  
  // Form input fields
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState<GearItem["category"]>("Camera Bodies");
  const [formManufacturer, setFormManufacturer] = useState("");
  const [formSpecs, setFormSpecs] = useState("");
  const [formPhotoUrl, setFormPhotoUrl] = useState("");
  const [formSerialNumber, setFormSerialNumber] = useState("");
  const [formAcquisitionDate, setFormAcquisitionDate] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [formStatus, setFormStatus] = useState<GearItem["status"]>("In Suite");

  // Drag and drop states
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load gear safely on mount
  useEffect(() => {
    const loadGear = async () => {
      try {
        const saved = await loadImageSafely("portfolio_gear_suite", "[]");
        if (saved && saved !== "[]") {
          try {
            const parsed = JSON.parse(saved);
            const hasOldIds = parsed.some((item: any) => 
              ["arri-alexa-mini-lf", "sony-fx6", "resolve-micro-panel", "dual-calibrated-monitors", "mac-studio-m2"].includes(item.id)
            );
            if (!hasOldIds) {
              setGear(parsed);
            }
          } catch (e) {
            console.error("Error parsing gear from safe storage:", e);
          }
        }
      } catch (err) {
        console.error("Error loading gear list from safe storage:", err);
      }
    };
    loadGear();
  }, []);

  // Save to safe storage on change (automatically manages IndexedDB and localStorage quotas)
  useEffect(() => {
    const saveGear = async () => {
      try {
        await saveImageSafely("portfolio_gear_suite", JSON.stringify(gear));
      } catch (err) {
        console.error("Failed to save gear state to safe storage:", err);
      }
    };
    saveGear();
  }, [gear]);

  const categories = ["All", "Camera Bodies", "Lenses", "Color Panels", "Reference Monitors", "Post Infrastructure", "Other Equipment"];
  const statuses = ["All", "In Suite", "On Location", "Maintenance", "Backup"];

  // Open modal for editing
  const handleEditClick = (item: GearItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingItem(item);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormManufacturer(item.manufacturer);
    setFormSpecs(item.specs);
    setFormPhotoUrl(item.photoUrl);
    setFormSerialNumber(item.serialNumber || "");
    setFormAcquisitionDate(item.acquisitionDate || "");
    setFormNotes(item.notes || "");
    setFormStatus(item.status);
    setIsFormOpen(true);
  };

  // Open modal for adding
  const handleAddClick = () => {
    setEditingItem(null);
    setFormName("");
    setFormCategory("Camera Bodies");
    setFormManufacturer("");
    setFormSpecs("");
    setFormPhotoUrl("");
    setFormSerialNumber("");
    setFormAcquisitionDate("");
    setFormNotes("");
    setFormStatus("In Suite");
    setIsFormOpen(true);
  };

  // Delete handler
  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to remove this equipment from your gear log?")) {
      setGear(prev => prev.filter(item => item.id !== id));
      if (selectedGear?.id === id) {
        setSelectedGear(null);
      }
    }
  };

  // Convert uploaded image file to base64 and compress extremely efficiently
  const handleImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (PNG, JPG, WEBP, etc.)");
      return;
    }
    const reader = new FileReader();
    reader.onload = async (event) => {
      const result = event.target?.result as string;
      try {
        // High quality but extremely optimized dimensions (640x480 at 0.5 quality)
        const compressed = await compressImage(result, 640, 480, 0.5);
        setFormPhotoUrl(compressed);
      } catch (err) {
        console.error("Image compression failed, fallback to original size:", err);
        setFormPhotoUrl(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageFile(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageFile(file);
    }
  };

  // Handle submit form
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formManufacturer.trim() || !formSpecs.trim()) {
      alert("Please enter Name, Manufacturer, and Key Specifications.");
      return;
    }

    // Default photo url if none provided
    const finalPhotoUrl = formPhotoUrl.trim() || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop";

    if (editingItem) {
      // Edit existing item
      const updatedItem: GearItem = {
        ...editingItem,
        name: formName,
        category: formCategory,
        manufacturer: formManufacturer,
        specs: formSpecs,
        photoUrl: finalPhotoUrl,
        serialNumber: formSerialNumber || undefined,
        acquisitionDate: formAcquisitionDate || undefined,
        notes: formNotes || undefined,
        status: formStatus
      };
      setGear(prev => prev.map(item => item.id === editingItem.id ? updatedItem : item));
      if (selectedGear?.id === editingItem.id) {
        setSelectedGear(updatedItem);
      }
    } else {
      // Add new item
      const newItem: GearItem = {
        id: "gear-" + Date.now(),
        name: formName,
        category: formCategory,
        manufacturer: formManufacturer,
        specs: formSpecs,
        photoUrl: finalPhotoUrl,
        serialNumber: formSerialNumber || undefined,
        acquisitionDate: formAcquisitionDate || undefined,
        notes: formNotes || undefined,
        status: formStatus
      };
      setGear(prev => [newItem, ...prev]);
    }

    setIsFormOpen(false);
  };

  // Restore presets
  const handleRestorePresets = () => {
    if (confirm("Restore all default premium gear presets? This will append the default items back into your inventory.")) {
      // Avoid adding duplicates by key
      setGear(prev => {
        const existingIds = new Set(prev.map(i => i.id));
        const filteredPresets = INITIAL_GEAR_PRESETS.filter(item => !existingIds.has(item.id));
        return [...filteredPresets, ...prev];
      });
    }
  };

  // Filter & Search logic
  const filteredGear = gear.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.specs.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesStatus = activeStatus === "All" || item.status === activeStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: GearItem["status"]) => {
    switch (status) {
      case "In Suite":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "On Location":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "Maintenance":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";
      case "Backup":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      default:
        return "bg-neutral-500/10 text-neutral-400 border-neutral-500/30";
    }
  };

  return (
    <div className="space-y-10" id="gear-section-container">
      {/* Intro Header & Quick stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono tracking-[0.25em] text-neutral-400 uppercase">CALIBRATED INVENTORY</span>
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          </div>
        </div>


      </div>



      {/* Grid listing */}
      {filteredGear.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-sm bg-[#080808]">
          <HardDrive className="h-8 w-8 text-neutral-600 mx-auto stroke-1" />
          <h3 className="text-neutral-300 font-mono text-sm mt-4">No matching equipment found</h3>
          <p className="text-xs text-neutral-500 mt-2 max-w-md mx-auto leading-relaxed">
            Try adjusting your search terms, selecting "All" categories, or add new custom equipment using the button above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="gear-grid">
          {filteredGear.map((item) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              key={item.id}
              onClick={() => setSelectedGear(item)}
              className="bg-[#0b0b0b] hover:bg-[#111] border border-white/10 hover:border-white/20 rounded-none overflow-hidden group transition-all duration-300 cursor-pointer flex flex-col justify-between"
              id={`gear-card-${item.id}`}
            >
              {/* Photo section */}
              <div className="relative aspect-video w-full bg-neutral-900 overflow-hidden border-b border-white/5">
                <img
                  src={item.photoUrl}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                
                {/* Status tag */}
                <div className="absolute top-3 left-3">
                  <span className={`px-2.5 py-1 text-[8px] font-mono uppercase tracking-widest rounded-none border ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>

                {/* Category tag */}
                <div className="absolute bottom-3 left-3">
                  <span className="text-[9px] font-mono tracking-widest text-neutral-400 uppercase bg-black/60 px-2 py-0.5 border border-white/5 rounded-none">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Detail block */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-500">
                    {item.manufacturer}
                  </span>
                  <h3 className="text-base font-semibold text-white tracking-tight leading-snug group-hover:text-neutral-100 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-neutral-400 font-sans line-clamp-3 leading-relaxed pt-1.5">
                    {item.specs}
                  </p>
                </div>

                {item.serialNumber && (
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-neutral-500">
                    <span>S/N REF:</span>
                    <span className="text-neutral-400 select-all font-semibold uppercase">{item.serialNumber}</span>
                  </div>
                )}
              </div>

            </motion.div>
          ))}
        </div>
      )}

      {/* Equipment Inspection Slider/Modal Overlay */}
      <AnimatePresence>
        {selectedGear && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end"
            onClick={() => setSelectedGear(null)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl bg-[#090909] border-l border-white/10 h-full overflow-y-auto flex flex-col"
              id="gear-inspector-panel"
            >
              {/* Header */}
              <div className="sticky top-0 z-10 bg-[#090909]/95 backdrop-blur-md border-b border-white/10 p-6 flex justify-between items-center">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">Master Pipeline Log</span>
                  <h3 className="text-lg font-light text-white uppercase tracking-tight">Inspection Profile</h3>
                </div>
                <button
                  onClick={() => setSelectedGear(null)}
                  className="p-2 border border-white/10 hover:border-white/20 rounded-sm hover:text-white text-neutral-400 transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Inspect content */}
              <div className="p-6 space-y-6 flex-1">
                {/* Full-res Photo Container */}
                <div className="relative aspect-video w-full rounded-sm overflow-hidden border border-white/10 bg-neutral-900">
                  <img
                    src={selectedGear.photoUrl}
                    alt={selectedGear.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent" />
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    <span className={`px-2.5 py-1 text-[9px] font-mono uppercase tracking-widest border ${getStatusColor(selectedGear.status)}`}>
                      {selectedGear.status}
                    </span>
                    <span className="text-[9px] font-mono tracking-widest text-neutral-400 uppercase bg-black/70 px-2 py-1 border border-white/10">
                      {selectedGear.category}
                    </span>
                  </div>
                </div>

                {/* Meta details */}
                <div className="space-y-2">
                  <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
                    {selectedGear.manufacturer}
                  </span>
                  <h4 className="text-2xl font-light text-white tracking-tight">
                    {selectedGear.name}
                  </h4>
                </div>

                {/* Grid readouts */}
                <div className="grid grid-cols-2 gap-4 border-t border-b border-white/5 py-4 font-mono text-xs">
                  <div>
                    <span className="text-neutral-500 block uppercase tracking-widest text-[9px]">Manufacturer</span>
                    <span className="text-neutral-200 mt-1 block font-semibold">{selectedGear.manufacturer}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block uppercase tracking-widest text-[9px]">S/N (Serial Reference)</span>
                    <span className="text-neutral-200 mt-1 block font-semibold uppercase">{selectedGear.serialNumber || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block uppercase tracking-widest text-[9px]">Acquisition Date</span>
                    <span className="text-neutral-200 mt-1 block font-semibold">{selectedGear.acquisitionDate || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block uppercase tracking-widest text-[9px]">Current Pipeline Location</span>
                    <span className="text-neutral-200 mt-1 block font-semibold">{selectedGear.status}</span>
                  </div>
                </div>

                {/* Key specs */}
                <div className="space-y-2">
                  <h5 className="text-xs font-mono text-neutral-400 uppercase tracking-wider flex items-center space-x-1">
                    <Cpu className="h-3.5 w-3.5" />
                    <span>Technical Specifications</span>
                  </h5>
                  <div className="bg-[#111] border border-white/5 p-4 rounded-sm">
                    <p className="text-xs text-neutral-300 leading-relaxed font-mono whitespace-pre-wrap">
                      {selectedGear.specs}
                    </p>
                  </div>
                </div>

                {/* Notes & operational reviews */}
                {selectedGear.notes && (
                  <div className="space-y-2">
                    <h5 className="text-xs font-mono text-neutral-400 uppercase tracking-wider flex items-center space-x-1">
                      <Info className="h-3.5 w-3.5" />
                      <span>Calibration & Operational Notes</span>
                    </h5>
                    <p className="text-xs text-neutral-400 leading-relaxed italic bg-[#111] border border-white/5 p-4 rounded-sm font-sans">
                      "{selectedGear.notes}"
                    </p>
                  </div>
                )}
              </div>


            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Gear Modal Form Dialog */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setIsFormOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#090909] border border-white/10 w-full max-w-2xl rounded-sm shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
              id="gear-form-modal"
            >
              {/* Header */}
              <div className="bg-[#0c0c0c] border-b border-white/10 p-5 flex justify-between items-center shrink-0">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">Calibrated Inventory</span>
                  <h3 className="text-lg font-light text-white uppercase tracking-tight">
                    {editingItem ? `Edit: ${editingItem.name}` : "Log New Studio Equipment"}
                  </h3>
                </div>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="text-neutral-400 hover:text-white p-1 rounded-sm border border-transparent hover:border-white/10 transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Form container */}
              <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
                {/* 2 Column grid for basic details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Equipment Name */}
                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] uppercase text-neutral-400 block tracking-wider">
                      Equipment Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Flanders Scientific XM310K"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full bg-[#111] border border-white/10 focus:border-white/30 text-white rounded-sm px-3 py-2.5 outline-none transition font-mono"
                    />
                  </div>

                  {/* Manufacturer */}
                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] uppercase text-neutral-400 block tracking-wider">
                      Manufacturer *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Flanders Scientific"
                      value={formManufacturer}
                      onChange={(e) => setFormManufacturer(e.target.value)}
                      className="w-full bg-[#111] border border-white/10 focus:border-white/30 text-white rounded-sm px-3 py-2.5 outline-none transition font-mono"
                    />
                  </div>

                  {/* Category dropdown */}
                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] uppercase text-neutral-400 block tracking-wider">
                      Category
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as GearItem["category"])}
                      className="w-full bg-[#111] border border-white/10 focus:border-white/30 text-white rounded-sm px-3 py-2.5 outline-none transition font-mono"
                    >
                      {categories.filter(c => c !== "All").map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Status dropdown */}
                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] uppercase text-neutral-400 block tracking-wider">
                      Pipeline Status
                    </label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as GearItem["status"])}
                      className="w-full bg-[#111] border border-white/10 focus:border-white/30 text-white rounded-sm px-3 py-2.5 outline-none transition font-mono"
                    >
                      {statuses.filter(s => s !== "All").map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Technical Specifications */}
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase text-neutral-400 block tracking-wider">
                    Key Specifications *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe sensory array, sensor, resolution, color accuracy standards, calibrated color spaces (e.g. 31-inch Master Monitor, 3000 nits Peak Luminance, 1000000:1 Contrast, 12G-SDI Input)"
                    value={formSpecs}
                    onChange={(e) => setFormSpecs(e.target.value)}
                    className="w-full bg-[#111] border border-white/10 focus:border-white/30 text-white rounded-sm px-3 py-2.5 outline-none transition font-mono resize-none leading-relaxed"
                  />
                </div>

                {/* Custom Photo Upload Component (Supports Drop & Selection) */}
                <div className="space-y-2">
                  <label className="font-mono text-[10px] uppercase text-neutral-400 block tracking-wider">
                    Equipment Photograph
                  </label>
                  
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-sm p-5 text-center cursor-pointer transition-colors duration-200 flex flex-col items-center justify-center space-y-2 relative min-h-[120px] ${
                      isDragging 
                        ? "border-white bg-white/5 text-white" 
                        : formPhotoUrl 
                          ? "border-emerald-500/40 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400" 
                          : "border-white/15 bg-black/40 hover:bg-white/5 hover:border-white/30 text-neutral-400"
                    }`}
                    id="gear-drag-dropzone"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileInputChange}
                      accept="image/*"
                      className="hidden"
                    />

                    {formPhotoUrl ? (
                      <div className="flex items-center space-x-3 w-full justify-center">
                        <div className="w-16 h-10 border border-white/10 rounded-sm overflow-hidden bg-neutral-900 shrink-0">
                          <img src={formPhotoUrl} alt="Equipment Upload preview" className="w-full h-full object-cover" />
                        </div>
                        <div className="text-left">
                          <span className="block font-mono text-[10px] text-emerald-400 font-bold flex items-center space-x-1">
                            <Check className="h-3 w-3" />
                            <span>PHOTO DETECTED &amp; COMPRESSED</span>
                          </span>
                          <span className="text-[9px] text-neutral-400 uppercase font-mono tracking-wider block mt-0.5">Click or drag alternative image to change</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-6 w-6 text-neutral-400" />
                        <div className="space-y-1">
                          <p className="font-semibold text-neutral-300">Drag &amp; drop equipment photo</p>
                          <p className="text-[9px] text-neutral-500 uppercase tracking-wider font-mono">or click to choose image file from local files</p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Manual URL input fallback if they want to paste online source */}
                  <div className="pt-1.5 flex items-center space-x-2">
                    <span className="text-[9px] text-neutral-500 font-mono uppercase shrink-0">or paste web URL:</span>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={formPhotoUrl.startsWith("data:") ? "" : formPhotoUrl}
                      onChange={(e) => setFormPhotoUrl(e.target.value)}
                      className="flex-1 bg-[#111] border border-white/10 focus:border-white/30 text-white rounded-sm px-2.5 py-1.5 text-[10px] outline-none transition font-mono"
                    />
                  </div>
                </div>

                {/* Auxiliary Details (S/N & Acquisition date) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/5 pt-4">
                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] uppercase text-neutral-400 block tracking-wider">
                      Serial Number Reference (S/N)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. S/N 8921-X9A"
                      value={formSerialNumber}
                      onChange={(e) => setFormSerialNumber(e.target.value)}
                      className="w-full bg-[#111] border border-white/10 focus:border-white/30 text-white rounded-sm px-3 py-2.5 outline-none transition font-mono uppercase"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] uppercase text-neutral-400 block tracking-wider">
                      Acquisition Date
                    </label>
                    <input
                      type="date"
                      value={formAcquisitionDate}
                      onChange={(e) => setFormAcquisitionDate(e.target.value)}
                      className="w-full bg-[#111] border border-white/10 focus:border-white/30 text-white rounded-sm px-3 py-2.5 outline-none transition font-mono"
                    />
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase text-neutral-400 block tracking-wider">
                    Calibration &amp; Operation Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Rec.709 Calibrated using Klein K10-A on 1st of every month."
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    className="w-full bg-[#111] border border-white/10 focus:border-white/30 text-white rounded-sm px-3 py-2.5 outline-none transition font-mono resize-none leading-relaxed"
                  />
                </div>

                {/* Submit row */}
                <div className="pt-4 border-t border-white/10 flex justify-end space-x-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="bg-[#111] hover:bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white px-4 py-2.5 rounded-sm font-semibold uppercase tracking-wider transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-white hover:bg-neutral-200 text-black px-5 py-2.5 rounded-sm font-semibold uppercase tracking-wider transition flex items-center space-x-1 shadow-lg cursor-pointer"
                    id="btn-submit-gear"
                  >
                    <Check className="h-4 w-4" />
                    <span>{editingItem ? "Update Log Record" : "Commit to Inventory"}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
