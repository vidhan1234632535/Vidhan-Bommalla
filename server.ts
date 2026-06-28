import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Share-ready health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// AI Color Grading Look Assistant Endpoint
app.post("/api/gemini/analyze-look", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== "string") {
    res.status(400).json({ error: "A search or grading look prompt is required." });
    return;
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(500).json({
        error: "GEMINI_API_KEY environment variable is not configured. Please add it in Settings > Secrets."
      });
      return;
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });

    const systemInstruction = `You are a professional elite Hollywood Colorist and Color Scientist.
Your task is to take a creative request, mood, reference, or color palette prompt and translate it into:
1. A creative, high-end LUT name.
2. A professional, emotionally evocative explanation of the look, explaining the contrast curve, shadow characteristics, and specific hue offsets.
3. A concise color scientist explanation of why this look fits the requested vibe.
4. A 5-color dominant color palette (hex codes) representing the graded image.
5. Exact numeric slider values for our real-time grading playground.

Guidelines for grading slider values:
- exposure: -100 to 100 (0 is neutral. Avoid extreme values unless requested, e.g. -15 to +15 is standard).
- contrast: -100 to 100 (0 is neutral. Positive values add contrast, negative softens).
- saturation: -100 to 100 (0 is neutral. -100 is pure monochrome, +30 is vibrant, -20 is muted cinematic).
- temperature: -100 to 100 (0 is neutral. Negative is cool/blue, positive is warm/golden).
- tint: -100 to 100 (0 is neutral. Negative is green/teal, positive is magenta/pink).
- vignette: 0 to 100 (0 is none, 10-40 is a subtle focus border, 50+ is dramatic).
- lift: R, G, B offsets (-30 to 30) targeting the shadow colors (e.g. lift green slightly for a matrix shadows look).
- gamma: R, G, B offsets (-30 to 30) targeting the midtone colors (skin tones, primary environment).
- gain: R, G, B offsets (-30 to 30) targeting the highlight colors (sky, bright lights).

Be creative, authentic, and cinematic! Avoid generic styles unless requested. Return a structured JSON object strictly matching the schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Generate a film-grade look for: "${prompt}"`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["lutName", "description", "explanation", "palette", "grade"],
          properties: {
            lutName: {
              type: Type.STRING,
              description: "Creative, premium name for this specific grade look, e.g. 'Neo-Noir Chrome', 'Sunset Gold Vintage'."
            },
            description: {
              type: Type.STRING,
              description: "An emotionally descriptive paragraph describing the visual character and mood of this look."
            },
            explanation: {
              type: Type.STRING,
              description: "A technical colorist breakdown of how to achieve this look, focusing on shadows, skin-tones, and primary contrast."
            },
            palette: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Array of exactly 5 CSS-compliant hex color codes that match this aesthetic."
            },
            grade: {
              type: Type.OBJECT,
              required: ["exposure", "contrast", "saturation", "temperature", "tint", "vignette", "lift", "gamma", "gain"],
              properties: {
                exposure: { type: Type.INTEGER, description: "Exposure offset (-100 to 100, default 0)" },
                contrast: { type: Type.INTEGER, description: "Contrast offset (-100 to 100, default 0)" },
                saturation: { type: Type.INTEGER, description: "Saturation offset (-100 to 100, default 0)" },
                temperature: { type: Type.INTEGER, description: "Color temperature offset (-100 to 100, negative=cool, positive=warm)" },
                tint: { type: Type.INTEGER, description: "Tint offset (-100 to 100, negative=green, positive=magenta)" },
                vignette: { type: Type.INTEGER, description: "Vignette amount (0 to 100, default 0)" },
                lift: {
                  type: Type.OBJECT,
                  required: ["r", "g", "b"],
                  properties: {
                    r: { type: Type.INTEGER, description: "Red channel offset (-30 to 30)" },
                    g: { type: Type.INTEGER, description: "Green channel offset (-30 to 30)" },
                    b: { type: Type.INTEGER, description: "Blue channel offset (-30 to 30)" }
                  }
                },
                gamma: {
                  type: Type.OBJECT,
                  required: ["r", "g", "b"],
                  properties: {
                    r: { type: Type.INTEGER, description: "Red channel offset (-30 to 30)" },
                    g: { type: Type.INTEGER, description: "Green channel offset (-30 to 30)" },
                    b: { type: Type.INTEGER, description: "Blue channel offset (-30 to 30)" }
                  }
                },
                gain: {
                  type: Type.OBJECT,
                  required: ["r", "g", "b"],
                  properties: {
                    r: { type: Type.INTEGER, description: "Red channel offset (-30 to 30)" },
                    g: { type: Type.INTEGER, description: "Green channel offset (-30 to 30)" },
                    b: { type: Type.INTEGER, description: "Blue channel offset (-30 to 30)" }
                  }
                }
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text from Gemini API.");
    }

    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error("Gemini Look Generation Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate look using Gemini AI." });
  }
});

// Configure Vite middleware in development or serve built files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
