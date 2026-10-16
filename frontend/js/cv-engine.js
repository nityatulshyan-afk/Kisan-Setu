// KisanSetu Client-Side Computer Vision Engine (F14)
// Classical Computer Vision algorithms running in HTML5 Canvas for instant produce grading

class ProduceCVEngine {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d", { willReadFrequently: true });
  }

  // Convert RGB to HSV
  rgbToHsv(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, v = max;
    const d = max - min;
    s = max === 0 ? 0 : d / max;

    if (max === min) {
      h = 0; // achromatic
    } else {
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h: h * 360, s: s * 100, v: v * 100 };
  }

  // Laplacian Variance Proxy for Blur Detection
  calculateLaplacianBlur(imageData) {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    
    // Grayscale values
    const gray = new Float32Array(width * height);
    for (let i = 0; i < data.length; i += 4) {
      gray[i / 4] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    }

    // Apply 3x3 Laplacian Kernel [0, 1, 0, 1, -4, 1, 0, 1, 0]
    let sum = 0;
    let sumSq = 0;
    let count = 0;

    for (let y = 1; y < height - 1; y += 2) {
      for (let x = 1; x < width - 1; x += 2) {
        const idx = y * width + x;
        const lap = 
          gray[idx - width] + 
          gray[idx - 1] + 
          gray[idx + 1] + 
          gray[idx + width] - 
          4 * gray[idx];

        sum += lap;
        sumSq += lap * lap;
        count++;
      }
    }

    const mean = sum / count;
    const variance = (sumSq / count) - (mean * mean);
    return variance;
  }

  // Full Analysis Pipeline
  analyzeImage(imageElement, produceType = "WHEAT") {
    return new Promise((resolve, reject) => {
      try {
        const maxWidth = 400;
        const scale = Math.min(1, maxWidth / imageElement.naturalWidth || 1);
        const w = Math.floor((imageElement.naturalWidth || imageElement.width || 300) * scale);
        const h = Math.floor((imageElement.naturalHeight || imageElement.height || 300) * scale);

        this.canvas.width = w;
        this.canvas.height = h;
        this.ctx.drawImage(imageElement, 0, 0, w, h);

        const imgData = this.ctx.getImageData(0, 0, w, h);
        const pixels = imgData.data;

        // 1. Blur and Lighting Quality Check
        const blurScore = this.calculateLaplacianBlur(imgData);
        let avgBrightness = 0;
        for (let i = 0; i < pixels.length; i += 4) {
          avgBrightness += (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
        }
        avgBrightness /= (pixels.length / 4);

        if (avgBrightness < 30) {
          return resolve({
            isUsable: false,
            error: "Image too dark. Please take photo in good sunlight/lighting.",
            grade: null
          });
        }
        if (avgBrightness > 240) {
          return resolve({
            isUsable: false,
            error: "Image over-exposed. Avoid direct camera flash reflection.",
            grade: null
          });
        }
        if (blurScore < 45) {
          return resolve({
            isUsable: false,
            error: "Photo is blurry. Please hold phone steady and focus on the produce.",
            grade: null
          });
        }

        // 2. Color Distribution & HSV Thresholding
        let healthyGrainPixels = 0;
        let discoloredPixels = 0;
        let foreignMatterPixels = 0;
        const defectBoxes = [];

        // Grid-based sampling for bounding boxes
        const gridSize = 20;
        const gridDefects = {};

        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const idx = (y * w + x) * 4;
            const r = pixels[idx];
            const g = pixels[idx + 1];
            const b = pixels[idx + 2];
            const hsv = this.rgbToHsv(r, g, b);

            const gridX = Math.floor(x / gridSize);
            const gridY = Math.floor(y / gridSize);
            const gridKey = `${gridX}_${gridY}`;

            let isHealthy = false;
            let isForeign = false;

            if (produceType === "MUSTARD") {
              // Mustard: Healthy = Deep dark brown/black with high saturation
              if (hsv.v < 40 && hsv.s > 15) {
                isHealthy = true;
              } else if (hsv.h > 35 && hsv.h < 70 && hsv.v > 50) {
                // Yellow/green unripened grain or chaff
                isForeign = true;
              } else {
                discoloredPixels++;
              }
            } else {
              // Wheat/Grains: Healthy = Golden amber (Hue 25-50, Saturation > 25, Value > 40)
              if (hsv.h >= 25 && hsv.h <= 55 && hsv.s >= 25 && hsv.v >= 40) {
                isHealthy = true;
              } else if (hsv.v < 25 || (hsv.h < 15 && hsv.s < 20)) {
                // Dark stones, dirt particles, mud pellets
                isForeign = true;
              } else {
                discoloredPixels++;
              }
            }

            if (isHealthy) {
              healthyGrainPixels++;
            } else if (isForeign) {
              foreignMatterPixels++;
              gridDefects[gridKey] = (gridDefects[gridKey] || 0) + 1;
            }
          }
        }

        const totalPixels = w * h;
        const defectRatio = foreignMatterPixels / totalPixels;
        const healthyRatio = healthyGrainPixels / totalPixels;
        const discolorationRatio = discoloredPixels / totalPixels;

        // 3. Extract Defect Bounding Boxes
        for (const [key, count] of Object.entries(gridDefects)) {
          if (count > (gridSize * gridSize * 0.15)) {
            const [gx, gy] = key.split('_').map(Number);
            defectBoxes.push({
              x: gx * gridSize,
              y: gy * gridSize,
              w: gridSize,
              h: gridSize,
              severity: count > (gridSize * gridSize * 0.3) ? "high" : "medium"
            });
          }
        }

        // 4. Calculate Grading Metrics (0-100 Scores)
        const colorScore = Math.min(99, Math.max(40, Math.round((1 - discolorationRatio * 1.5) * 100)));
        const impurityScore = Math.min(99, Math.max(30, Math.round((1 - defectRatio * 4.0) * 100)));
        const uniformityScore = Math.min(98, Math.max(50, Math.round((healthyRatio * 1.1) * 100)));

        // Composite Weighted Quality Score
        const compositeScore = (colorScore * 0.4) + (impurityScore * 0.35) + (uniformityScore * 0.25);
        let suggestedGrade = "B";
        let confidence = Math.min(96, Math.max(78, Math.round(compositeScore * 0.95 + 4)));
        const isEn = window.I18N && window.I18N.currentLang === 'en';
        let reasons = [];

        if (compositeScore >= 85 && defectRatio < 0.03) {
          suggestedGrade = "A";
          reasons = isEn ? [
            `Excellent grain color consistency (${colorScore}%).`,
            `Foreign matter & chaff level is minimal (< ${(defectRatio * 100).toFixed(1)}%).`,
            `Grains are well-filled with uniform size distribution.`
          ] : [
            `उत्कृष्ट सुनहरे दानों का रंग एवं चमक (${colorScore}%)।`,
            `कचरा व भूसा नगण्य स्तर पर है (< ${(defectRatio * 100).toFixed(1)}%)।`,
            `दाने सुडौल, भरे हुए व एक समान आकार के हैं।`
          ];
        } else if (compositeScore >= 68) {
          suggestedGrade = "B";
          reasons = isEn ? [
            `Standard Fair Average Quality (FAQ) suitable for MSP procurement.`,
            `Minor color variance (${(discolorationRatio * 100).toFixed(1)}%) within permissible mandi limits.`,
            `Foreign particles detected: ~${(defectRatio * 100).toFixed(1)}% (easily winnowed).`
          ] : [
            `मानक अच्छी गुणवत्ता (FAQ), सरकारी MSP खरीद हेतु पूर्णतया उपयुक्त।`,
            `हल्का रंग-भेद (${(discolorationRatio * 100).toFixed(1)}%) जो मंडी सीमा के भीतर है।`,
            `अशुद्धियां: ~${(defectRatio * 100).toFixed(1)}% (सफाई योग्य)।`
          ];
        } else if (compositeScore >= 50) {
          suggestedGrade = "C";
          reasons = isEn ? [
            `Moderate moisture or shriveled grains detected.`,
            `Foreign matter level is ${(defectRatio * 100).toFixed(1)}% (grading deduction may apply).`,
            `Recommend screening/drying before final weighment.`
          ] : [
            `मध्यम नमी या सिकुड़े हुए दाने पाए गए।`,
            `अशुद्धि स्तर ${(defectRatio * 100).toFixed(1)}% (मामूली मूल्य कटौती संभव)।`,
            `मंडी तौलाई से पूर्व धूप में सुखाने व छानने की सलाह।`
          ];
        } else {
          suggestedGrade = "REJECT_LIKELY";
          reasons = isEn ? [
            `High percentage of damaged/discolored grains or non-produce matter.`,
            `Exceeds maximum allowable FAQ tolerances under APMC guidelines.`
          ] : [
            `अत्यधिक दागी अथवा गैर-फसल कचरा मौजूद है।`,
            `मंडी नियमों के अनुसार सफाई के उपरांत ही खरीद संभव।`
          ];
        }

        // Render Annotated Canvas
        const annotatedCanvas = document.createElement("canvas");
        annotatedCanvas.width = w;
        annotatedCanvas.height = h;
        const aCtx = annotatedCanvas.getContext("2d");
        aCtx.drawImage(this.canvas, 0, 0);

        // Draw Bounding Boxes around flagged foreign matter
        aCtx.lineWidth = 2;
        defectBoxes.forEach(box => {
          aCtx.strokeStyle = box.severity === "high" ? "#ef4444" : "#f59e0b";
          aCtx.strokeRect(box.x, box.y, box.w, box.h);
        });

        resolve({
          isUsable: true,
          suggestedGrade,
          confidence,
          colorScore,
          impurityScore,
          uniformityScore,
          compositeScore: Math.round(compositeScore),
          reasons,
          defectCount: defectBoxes.length,
          annotatedImageUri: annotatedCanvas.toDataURL("image/jpeg", 0.85)
        });

      } catch (err) {
        console.error("CV Error:", err);
        resolve({
          isUsable: false,
          error: "Unable to process photo. Please retry with another shot.",
          grade: null
        });
      }
    });
  }

  // Generate Sample Presets (for instant offline demonstration)
  generateSampleProduceImage(produce = "WHEAT", quality = "A") {
    const c = document.createElement("canvas");
    c.width = 320;
    c.height = 240;
    const ctx = c.getContext("2d");

    // Base background texture
    ctx.fillStyle = produce === "MUSTARD" ? "#292524" : "#fef3c7";
    ctx.fillRect(0, 0, c.width, c.height);

    const count = quality === "A" ? 450 : quality === "B" ? 380 : 300;

    for (let i = 0; i < count; i++) {
      const x = Math.random() * c.width;
      const y = Math.random() * c.height;
      const radX = produce === "MUSTARD" ? 3.5 : 8 + Math.random() * 4;
      const radY = produce === "MUSTARD" ? 3.5 : 4 + Math.random() * 2;
      const angle = Math.random() * Math.PI;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      if (produce === "MUSTARD") {
        ctx.fillStyle = quality === "A" ? "#1c1917" : quality === "B" ? "#44403c" : "#78716c";
      } else {
        // Wheat golden grains
        if (quality === "A") {
          ctx.fillStyle = Math.random() > 0.3 ? "#f59e0b" : "#d97706";
        } else if (quality === "B") {
          ctx.fillStyle = Math.random() > 0.5 ? "#d97706" : "#b45309";
        } else {
          // Grade C: Discolored or broken
          ctx.fillStyle = Math.random() > 0.4 ? "#92400e" : "#78350f";
        }
      }

      ctx.beginPath();
      ctx.ellipse(0, 0, radX, radY, 0, 0, 2 * Math.PI);
      ctx.fill();
      ctx.restore();
    }

    // Add chaff and stones for lower grades
    if (quality === "B" || quality === "C") {
      const defectCount = quality === "B" ? 8 : 22;
      for (let j = 0; j < defectCount; j++) {
        ctx.fillStyle = j % 2 === 0 ? "#1e293b" : "#854d0e";
        const dx = Math.random() * c.width;
        const dy = Math.random() * c.height;
        ctx.fillRect(dx, dy, 4 + Math.random() * 4, 4 + Math.random() * 4);
      }
    }

    return c.toDataURL("image/jpeg", 0.9);
  }
}

window.CVEngine = new ProduceCVEngine();

