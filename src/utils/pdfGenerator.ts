import { jsPDF } from "jspdf";

export interface BriefContent {
  title: string;
  subtitle: string;
  metadata: {
    director: string;
    colorist: string;
    delivery: string;
    format: string;
    aspectRatio: string;
    camera: string;
  };
  sections: {
    title: string;
    type: "text" | "bullets" | "subsections" | "numbered_list" | "table";
    content?: string;
    items?: string[];
    subsections?: {
      title: string;
      goal?: string;
      direction?: string[];
      feel?: string;
    }[];
    tableData?: { label: string; value: string }[];
  }[];
  finalWords: string;
}

export const TEN_DAYS_APART_BRIEF: BriefContent = {
  title: "COLOR GRADING BRIEF",
  subtitle: "10 Days Apart — Final Scene Focus",
  metadata: {
    director: "Nikhil Binny",
    colorist: "Vidhan Bommalla",
    delivery: "Festival (Cannes International)",
    format: "DCP",
    aspectRatio: "16:9",
    camera: "Sony FX3, S-Log3 / S-Gamut3.Cine"
  },
  sections: [
    {
      title: "1. CORE INTENT (MOST IMPORTANT)",
      type: "text",
      content: "This film is performance-led and emotionally restrained. The grade must disappear and let faces, silence, and time carry the emotion. The audience should feel closer to the character — not admire the image."
    },
    {
      title: "2. OVERALL LOOK PHILOSOPHY",
      type: "bullets",
      content: "Naturalistic, muted, emotionally neutral base with very subtle emotional temperature shifts. Key qualities include:",
      items: [
        "Low to moderate saturation",
        "Soft contrast",
        "Lifted blacks (no crushed shadows)",
        "Protected, natural skin tones",
        "No stylized LUT identity",
        "This is not a dramatic or 'cinematic' grade — it is intimate and human."
      ]
    },
    {
      title: "3. EMOTIONAL COLOR LOGIC (SCENE-BASED)",
      type: "subsections",
      subsections: [
        {
          title: "A. Present-time grief scenes (cemetery / letter / breakdown)",
          goal: "Containment, silence, internal heaviness.",
          direction: [
            "Slightly cooler midtones",
            "Neutral shadows (no blue/green push)",
            "Highlights soft, not bright",
            "Saturation gently reduced"
          ],
          feel: "Color has drained slightly from the world, but life hasn't disappeared."
        },
        {
          title: "B. Exhaustion / pause moments (after crying peaks)",
          goal: "Emptiness, stillness, breath.",
          direction: [
            "Nearly neutral temperature",
            "Lowest contrast point in the film",
            "Let skin look a bit drained, but healthy"
          ],
          feel: "The image should feel weightless here."
        },
        {
          title: "C. Cassette / sound / sky look (emotional shift)",
          goal: "Presence returning — not hope, not relief.",
          direction: [
            "Very subtle warmth returning only in highlights and skin",
            "Do NOT warm shadows",
            "No saturation increase"
          ],
          feel: "The warmth is subconscious here."
        },
        {
          title: "D. Montage / memory moments",
          goal: "Fragile memory, continuation.",
          direction: [
            "Slightly warmer than present",
            "Slightly softer contrast",
            "Same saturation level"
          ],
          feel: "Memory will feel delicate, not idealized. (Avoid: Golden nostalgia, Sunset orange, Dreamy glow)."
        }
      ]
    },
    {
      title: "4. SKIN TONE PRIORITY (NON-NEGOTIABLE)",
      type: "bullets",
      content: "Faces are the film. Skin tones must stay natural and believable with absolute precision:",
      items: [
        "No orange push, no green shadows",
        "No emphasizing redness during crying scenes",
        "Crying faces should look: Human, Vulnerable, and Slightly tired",
        "Avoid glossy, dramatic, or 'beautiful' commercial highlights"
      ]
    },
    {
      title: "5. CONTRAST & BLACK LEVELS",
      type: "bullets",
      content: "Soft global contrast with rich shadow separation:",
      items: [
        "Soft global contrast to support the delicate tone",
        "Preserve high detail in shadows; do not crush the black point",
        "Black levels should be slightly lifted to let them breathe",
        "Crushed blacks will make the film feel aggressive and emotionally closed."
      ]
    },
    {
      title: "6. SATURATION CONTROL",
      type: "bullets",
      content: "Rigorous saturation gating:",
      items: [
        "Overall saturation slightly reduced",
        "Strictly avoid selective color pops",
        "Greens and blues will be kept muted, organic, and natural",
        "If any color draws undue attention, it must be pulled back."
      ]
    },
    {
      title: "7. GRAIN & TEXTURE",
      type: "bullets",
      content: "Organic texturing to diffuse digital sensors:",
      items: [
        "Very fine, organic grain is acceptable",
        "Just enough to soften modern digital sharpness",
        "Avoid heavy film grain, vintage looks, or stylized halation."
      ]
    },
    {
      title: "8. SHOT-TO-SHOT CONSISTENCY",
      type: "bullets",
      content: "Emotional matching over physical matching:",
      items: [
        "Maintain emotional continuity over technical matching",
        "Minor exposure shifts are acceptable if they support the active emotion",
        "Faces take priority over backgrounds. If there's a conflict: Protect the face."
      ]
    },
    {
      title: "9. WHAT I'M AVOIDING (IMPORTANT)",
      type: "bullets",
      content: "Strict negative rules to preserve raw realism:",
      items: [
        "Teal & orange looks and heavy stylization",
        "Dramatic contrast curves and high digital glare",
        "Overly distinct 'Festival LUT' identity presets",
        "Romanticized memory colors or sunset oranges",
        "Blue grief cliches."
      ]
    }
  ],
  finalWords: "This is my workflow guide to color grade our film. I want the audience to feel that the story happened in the streets of Paris - so naturalistic yet deeply Cinematic.\n\nThanks,\nVidhan Bommalla"
};

export const SATYA_BRIEF: BriefContent = {
  title: "COLOR GRADING BRIEF",
  subtitle: "SATYA — Final Scene Focus",
  metadata: {
    director: "Sai Smaran",
    colorist: "Vidhan Bommalla",
    delivery: "Youtube / Web Premiere",
    format: "Rec 709",
    aspectRatio: "16:9",
    camera: "Sony a7 III (ILCE-7M3) SLOG2"
  },
  sections: [
    {
      title: "1. CORE INTENT (MOST IMPORTANT)",
      type: "text",
      content: "This film is performance-led and emotionally restrained. The color grade must adapt from scene to scene to enhance the characters' performances, while respecting the intended lighting conditions of each scene. The audience should feel closer to the character — not admire the image."
    },
    {
      title: "2. OVERALL LOOK PHILOSOPHY",
      type: "bullets",
      content: "Subtle vibrant and soft-contrast, low-light image with temperature shifts. This is a moody grade, not a dramatic one. Key qualities include:",
      items: [
        "No or low saturation",
        "Soft contrast",
        "Slightly lifted blacks (no crushed shadows)",
        "Protected and lighting conditioned skin tones",
        "No stylized LUT identity"
      ]
    },
    {
      title: "3. EMOTIONAL COLOR LOGIC (SCENE-BASED)",
      type: "subsections",
      subsections: [
        {
          title: "A. Opening Scene",
          goal: "The tension in this film is psychological, relying on an atmosphere of unease rather than aggressive visual styling. Suspense must be built through what is felt but not immediately seen.",
          direction: [
            "Mild Noise Reduction to clean low-light sensor artifacts",
            "Neutral shadows (no blue/green push)",
            "Highlights soft, not bright",
            "Saturation zero or low"
          ],
          feel: "The colors shouldn't pop; rather, the grade must create tension and introduce the audience to the film."
        },
        {
          title: "B. Blue Scene",
          goal: "A sense of confusion and a feeling of being caught in a loop.",
          direction: [
            "The color direction is similar to the opening scene, keeping contrast muted and blue tones subtle."
          ]
        },
        {
          title: "C. Warm Lit Scene",
          goal: "A breathless, slightly panicked atmosphere.",
          direction: [
            "Maintain consistency with the opening scene's soft density, but with delicate organic warmth."
          ]
        },
        {
          title: "D. Earthquake Scene",
          goal: "The low-light images should feel more predatory and warning-like.",
          direction: [
            "Introduce more red into the midtones or offset channel to heighten themes of warning and catastrophe.",
            "The red should not be bright or over-saturated like it's in the image; it needs to be a subtle, desaturated red."
          ]
        },
        {
          title: "E. The Climax",
          goal: "A sense of resolution and the freedom to breathe again.",
          direction: [
            "Less contrast",
            "Whitish soft halation",
            "Low saturation or a mild balanced level"
          ],
          feel: "Avoid golden nostalgia, sunset orange, or dreamy glow."
        }
      ]
    },
    {
      title: "4. SKIN TONE PRIORITY (NON-NEGOTIABLE)",
      type: "bullets",
      content: "Faces are the film. Absolute skin fidelity must be protected:",
      items: [
        "Skin tones must stay natural and believable",
        "Skin tones must blend organically with the lighting used on set",
        "No green shadows or artificial color shifts",
        "Emphasize slight redness during crying to support performance",
        "Crying faces should look: Human, Vulnerable, and Slightly tired (not glossy/beautiful)"
      ]
    },
    {
      title: "5. CONTRAST & BLACK LEVELS",
      type: "bullets",
      content: "Subtle values and soft roll-offs:",
      items: [
        "Soft global contrast to maintain low-light readability",
        "Preserve detail in deep shadows; no hard crushed blacks",
        "Blacks should breathe a little",
        "Crushed blacks make the film feel aggressive and emotionally closed."
      ]
    },
    {
      title: "6. SATURATION CONTROL",
      type: "bullets",
      content: "Restrained spectrum parameters:",
      items: [
        "Overall saturation slightly reduced or near zero",
        "Avoid selective color pops entirely",
        "Greens and blues will be kept muted, neutral, and natural",
        "If any color draws undue attention, pull it back."
      ]
    },
    {
      title: "7. DEPTH OF FIELD",
      type: "bullets",
      content: "Two depth of field approaches can be used based on the image:",
      items: [
        "Desaturating the background and highlighting the subject",
        "Defocusing the background to isolate performances",
        "Avoid: Heavy film grain, vintage look-up tables, or stylized halation."
      ]
    },
    {
      title: "8. SHOT-TO-SHOT CONSISTENCY",
      type: "bullets",
      content: "Continuity of mood:",
      items: [
        "Maintain emotional continuity over technical matching",
        "Minor exposure shifts are acceptable if they support the active emotion",
        "Faces take priority over backgrounds. If there's a conflict: Protect the face."
      ]
    },
    {
      title: "9. WHAT I'M AVOIDING (IMPORTANT)",
      type: "bullets",
      content: "Industry tropes to avoid:",
      items: [
        "Teal & orange looks and heavy stylization",
        "Dramatic contrast curves",
        "Distinctive 'Festival LUT' identity",
        "Romanticized memory colors",
        "Blue grief cliches."
      ]
    }
  ],
  finalWords: "This is my workflow guide for color grading our film. The goal is to achieve a moody, shadowy aesthetic rather than a heavy or vibrant look.\n\nThanks,\nVidhan Bommalla"
};

export function generateBriefPDF(brief: BriefContent, filename: string) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);

  let y = 20;

  // Custom helper for multi-page support
  function checkPageBreak(neededHeight: number) {
    if (y + neededHeight > pageHeight - 20) {
      doc.addPage();
      y = 20;
      drawPageBorder();
    }
  }

  function drawPageBorder() {
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.2);
    // Draw an elegant outer border frame for the brief
    doc.rect(margin - 5, margin - 5, contentWidth + 10, pageHeight - (margin * 2) + 10);
  }

  // Draw initial page border
  drawPageBorder();

  // Header Logo / Watermark Look
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text("MASTER LOOK DEVELOPMENT & COLOR WORKFLOW BRIEF", margin, y);
  y += 5;

  // Decorative Accent Line
  doc.setDrawColor(245, 158, 11); // Amber accent color
  doc.setLineWidth(1);
  doc.line(margin, y, margin + 40, y);
  
  doc.setDrawColor(100, 116, 139); // Slate line
  doc.setLineWidth(0.2);
  doc.line(margin + 40, y, margin + contentWidth, y);
  y += 10;

  // Main Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42); // Deep slate
  doc.text(brief.title, margin, y);
  y += 8;

  // Subtitle
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(245, 158, 11); // Amber
  doc.text(brief.subtitle, margin, y);
  y += 12;

  // Metadata Table Block
  checkPageBreak(35);
  doc.setFillColor(248, 250, 252); // Light background for metadata
  doc.rect(margin, y, contentWidth, 26, "F");
  doc.setDrawColor(226, 232, 240);
  doc.rect(margin, y, contentWidth, 26, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);

  // Row 1
  doc.text("DIRECTOR:", margin + 5, y + 6);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(15, 23, 42);
  doc.text(brief.metadata.director, margin + 30, y + 6);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 116, 139);
  doc.text("CAMERA / CODEC:", margin + 90, y + 6);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(15, 23, 42);
  doc.text(brief.metadata.camera, margin + 125, y + 6);

  // Row 2
  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 116, 139);
  doc.text("COLORIST:", margin + 5, y + 12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(15, 23, 42);
  doc.text(brief.metadata.colorist, margin + 30, y + 12);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 116, 139);
  doc.text("FORMAT / SPACE:", margin + 90, y + 12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(15, 23, 42);
  doc.text(brief.metadata.format, margin + 125, y + 12);

  // Row 3
  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 116, 139);
  doc.text("DELIVERY:", margin + 5, y + 18);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(15, 23, 42);
  doc.text(brief.metadata.delivery, margin + 30, y + 18);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 116, 139);
  doc.text("ASPECT RATIO:", margin + 90, y + 18);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(15, 23, 42);
  doc.text(brief.metadata.aspectRatio, margin + 125, y + 18);

  y += 34;

  // Render Sections
  brief.sections.forEach((sec) => {
    checkPageBreak(15);
    
    // Section Header Accent
    doc.setFillColor(241, 245, 249);
    doc.rect(margin, y, contentWidth, 7, "F");
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(sec.title, margin + 3, y + 5);
    y += 11;

    // Content types
    if (sec.type === "text" && sec.content) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);
      
      const lines = doc.splitTextToSize(sec.content, contentWidth - 4);
      checkPageBreak(lines.length * 5 + 2);
      lines.forEach((line: string) => {
        doc.text(line, margin + 2, y);
        y += 5;
      });
      y += 4;
    } 
    else if (sec.type === "bullets" && sec.items) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);

      if (sec.content) {
        const introLines = doc.splitTextToSize(sec.content, contentWidth - 4);
        checkPageBreak(introLines.length * 5 + 2);
        introLines.forEach((line: string) => {
          doc.text(line, margin + 2, y);
          y += 5;
        });
        y += 2;
      }

      sec.items.forEach((item) => {
        const bulletText = `•  ${item}`;
        const itemLines = doc.splitTextToSize(bulletText, contentWidth - 8);
        checkPageBreak(itemLines.length * 5 + 1);
        itemLines.forEach((line: string, index: number) => {
          doc.text(line, margin + 4 + (index > 0 ? 3 : 0), y);
          y += 5;
        });
      });
      y += 4;
    } 
    else if (sec.type === "subsections" && sec.subsections) {
      sec.subsections.forEach((sub) => {
        checkPageBreak(15);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(30, 41, 59);
        doc.text(sub.title, margin + 2, y);
        y += 5;

        if (sub.goal) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8.5);
          doc.setTextColor(100, 116, 139);
          doc.text("EMOTIONAL GOAL:", margin + 4, y);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(51, 65, 85);
          const goalLines = doc.splitTextToSize(sub.goal, contentWidth - 36);
          goalLines.forEach((line: string, index: number) => {
            doc.text(line, margin + 35, y + (index * 4.5));
          });
          y += Math.max(5, goalLines.length * 4.5 + 2);
        }

        if (sub.direction && sub.direction.length > 0) {
          checkPageBreak(8);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8.5);
          doc.setTextColor(100, 116, 139);
          doc.text("COLOR LOGIC:", margin + 4, y);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(51, 65, 85);

          let startY = y;
          sub.direction.forEach((dir, dirIdx) => {
            const lines = doc.splitTextToSize(`- ${dir}`, contentWidth - 36);
            checkPageBreak(lines.length * 4.5 + 2);
            lines.forEach((line: string) => {
              doc.text(line, margin + 35, startY);
              startY += 4.5;
            });
          });
          y = startY + 2;
        }

        if (sub.feel) {
          checkPageBreak(6);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8.5);
          doc.setTextColor(100, 116, 139);
          doc.text("ATMOSPHERE:", margin + 4, y);
          doc.setFont("helvetica", "italic");
          doc.setTextColor(15, 23, 42);
          const feelLines = doc.splitTextToSize(`"${sub.feel}"`, contentWidth - 36);
          feelLines.forEach((line: string, index: number) => {
            doc.text(line, margin + 35, y + (index * 4.5));
          });
          y += feelLines.length * 4.5 + 3;
        }
        y += 2;
      });
      y += 2;
    }
  });

  // Final Words Section
  checkPageBreak(35);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(margin, y, margin + contentWidth, y);
  y += 7;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text("10. FINAL WORDS & WORKFLOW NOTES", margin, y);
  y += 6;

  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  const finalWordsLines = doc.splitTextToSize(brief.finalWords, contentWidth);
  finalWordsLines.forEach((line: string) => {
    checkPageBreak(5);
    doc.text(line, margin, y);
    y += 5;
  });

  // Save the generated PDF
  doc.save(filename);
}
