export interface ColorWheelValue {
  r: number; // Offset from -50 to 50
  g: number;
  b: number;
}

export interface ColorGrade {
  exposure: number;     // -100 to 100
  contrast: number;     // -100 to 100
  saturation: number;   // -100 to 100
  temperature: number;  // -100 to 100 (cool to warm)
  tint: number;         // -100 to 100 (green to magenta)
  vignette: number;     // 0 to 100
  lift: ColorWheelValue;
  gamma: ColorWheelValue;
  gain: ColorWheelValue;
}

export interface ReferenceImage {
  id: string;
  name: string;
  url: string;
  category: string;
  photographer: string;
}

export interface LUTPreset {
  id: string;
  name: string;
  description: string;
  grade: ColorGrade;
  category: 'Cinematic' | 'Commercial' | 'Creative' | 'Utility';
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  client: string;
  director: string;
  camera: string;
  logProfile: string;
  imageUrl: string; // Rec.709 graded image
  beforeUrl?: string; // Optional raw log image (if not specified, we can generate a flat log look dynamically)
  palette: string[]; // 5 dominant hex codes
  description: string;
}

export interface AIColoristResponse {
  lutName: string;
  description: string;
  explanation: string;
  palette: string[];
  grade: ColorGrade;
}

export interface ClientInquiry {
  name: string;
  email: string;
  projectType: string;
  rawDuration: string;
  timeline: string;
  budgetRange: string;
  moodReference: string;
  details: string;
}

export interface GearItem {
  id: string;
  name: string;
  category: 'Camera Bodies' | 'Lenses' | 'Color Panels' | 'Reference Monitors' | 'Post Infrastructure' | 'Other Equipment';
  manufacturer: string;
  specs: string;
  photoUrl: string;
  serialNumber?: string;
  acquisitionDate?: string;
  notes?: string;
  status: 'In Suite' | 'On Location' | 'Maintenance' | 'Backup';
}

