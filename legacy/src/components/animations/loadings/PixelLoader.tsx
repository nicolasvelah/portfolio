import React, { useEffect, useRef } from "react";

/**
 * PixelLoader
 * Retro 2D pixel-art loader for portfolio UIs.
 *
 * - No external assets: sprites are drawn programmatically on a tiny offscreen canvas (8x8 / 16x16) and scaled.
 * - Features: running condor (Andean vibe) over looping terrain with stars and parallax mountains.
 * - CRT/scanline overlay for retro feel (toggle via prop).
 *
 * Usage:
 * <div className="h-[220px] w-full">
 *   <PixelLoader label="Loading portfolio…" />
 * </div>
 */
export default function PixelLoader({
  label = "Loading…",
  pixelSize = 4,         // logical pixel scale multiplier
  speed = 0.8,           // world scroll speed (0.5—2 recommended)
  showScanlines = true,  // CRT overlay
  background = "#0b0f16",
}: {
  label?: string;
  pixelSize?: number;
  speed?: number;
  showScanlines?: boolean;
  background?: string;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dpr = Math.min(2, typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1);

  useEffect(() => {
    const wrap = wrapRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    let raf = 0;
    let vw = 0, vh = 0; // viewport (css) size in CSS pixels

    const logicalW = 240; // base logical resolution (like old handhelds)
    const logicalH = 120;

    // Offscreen sprite canvas (tiny)
    const sprite = document.createElement("canvas");
    const sctx = sprite.getContext("2d")!;

    // Palette (OKLCH-like tints approximated): midnight, cyan, sun, mountain, ground
    const P = {
      sky: background,
      star: "#b6e3ff",
      cyan: "#49d1ff",
      sun: "#ffd166",
      mountainDark: "#243042",
      mountain: "#2f3e56",
      groundDark: "#2a2a2a",
      ground: "#3a3a3a",
      condorBody: "#161616",
      condorBeak: "#f4b23f",
      condorEye: "#ffffff",
    } as const;

    const resize = () => {
      // Use the wrapper's size. If it's zero, bail.
      const rect = wrap.getBoundingClientRect();
      vw = Math.max(1, Math.floor(rect.width));
      vh = Math.max(1, Math.floor(rect.height));
      // Pick an integer pixel scale to keep the pixels crisp
      const intScale = Math.max(2, Math.floor(Math.min(vw / logicalW, vh / logicalH) * pixelSize));
      const fbWidth = Math.max(logicalW * intScale, 1);
      const fbHeight = Math.max(logicalH * intScale, 1);
      // Set backing store in device pixels
      canvas.width = Math.floor(fbWidth * dpr);
      canvas.height = Math.floor(fbHeight * dpr);
      // Stretch to fill wrapper while preserving aspect via CSS
      canvas.style.width = `${fbWidth}px`;
      canvas.style.height = `${fbHeight}px`;
      // Center via parent styles (we'll center with flex in the JSX)
      ctx.imageSmoothingEnabled = false;
    };

    const drawCondorFrame = (frame: number) => {
      // 16x12 sprite grid
      const sw = 16, sh = 12;
      sprite.width = sw; sprite.height = sh;
      sctx.imageSmoothingEnabled = false;
      sctx.clearRect(0,0,sw,sh);

      // body
      sctx.fillStyle = P.condorBody;
      // torso
      sctx.fillRect(5,5,6,4);
      // head
      sctx.fillRect(11,6,2,2);
      // eye
      sctx.fillStyle = P.condorEye; sctx.fillRect(12,6,1,1);
      // beak
      sctx.fillStyle = P.condorBeak; sctx.fillRect(13,7,2,1);
      // tail
      sctx.fillStyle = P.condorBody; sctx.fillRect(4,7,1,2);

      // wings (simple flap between two poses)
      sctx.fillStyle = P.condorBody;
      if (frame % 2 === 0) {
        // wings up
        sctx.fillRect(3,4,3,1);
        sctx.fillRect(8,4,3,1);
        sctx.fillRect(2,3,1,1);
        sctx.fillRect(12,3,1,1);
      } else {
        // wings down
        sctx.fillRect(3,8,3,1);
        sctx.fillRect(8,8,3,1);
        sctx.fillRect(2,9,1,1);
        sctx.fillRect(12,9,1,1);
      }
    };

    const stars: {x:number,y:number,tw:number}[] = Array.from({length: 40}, () => ({
      x: Math.random()*1,
      y: Math.random()*1,
      tw: Math.random()*1
    }));

    let t0 = performance.now();
    let worldX = 0;
    let flap = 0;

    const loop = (t: number) => {
      const dt = (t - t0) / 1000; t0 = t;
      worldX += dt * 30 * speed; // scroll logical x
      flap += dt * 8;            // flap speed

      const ctxW = canvas.width; // device pixels
      const ctxH = canvas.height;

      // Convert to a logical scale relative to device pixels
      const scale = Math.max(1, Math.floor(Math.min(ctxW / (logicalW*dpr), ctxH / (logicalH*dpr))));
      const ox = Math.floor((ctxW - logicalW*scale*dpr) / 2);
      const oy = Math.floor((ctxH - logicalH*scale*dpr) / 2);

      // Clear to sky
      ctx.fillStyle = P.sky; ctx.fillRect(0,0,ctxW,ctxH);

      // Stars layer
      for (const s of stars) {
        const px = ((s.x * logicalW - (worldX*0.2) % logicalW) + logicalW) % logicalW;
        const py = Math.floor(s.y * (logicalH*0.5));
        const tw = (Math.sin(t*0.005 + s.tw*6.28) * 0.5 + 0.5) > 0.6;
        if (tw) {
          ctx.fillStyle = P.star;
          ctx.fillRect(ox + Math.floor(px)*scale*dpr, oy + Math.floor(py)*scale*dpr, scale*dpr, scale*dpr);
        }
      }

      // Distant mountains (parallax)
      const drawMounts = (color: string, yBase: number, amp: number, parallax: number) => {
        ctx.fillStyle = color;
        for (let x= -logicalW; x< logicalW*2; x+=4) {
          const px = Math.floor(x - (worldX*parallax)%logicalW);
          const y = Math.floor(yBase + Math.sin((x+worldX*0.1)*0.03)*amp);
          ctx.fillRect(ox + px*scale*dpr, oy + y*scale*dpr, 4*scale*dpr, logicalH*scale*dpr);
        }
      };
      drawMounts(P.mountainDark, 70, 6, 0.35);
      drawMounts(P.mountain, 84, 4, 0.5);

      // Ground stripes (near)
      for (let x= -logicalW; x< logicalW*2; x+=8) {
        const px = Math.floor(x - (worldX)%logicalW);
        ctx.fillStyle = P.groundDark;
        ctx.fillRect(ox + px*scale*dpr, oy + 100*scale*dpr, 8*scale*dpr, 4*scale*dpr);
        ctx.fillStyle = P.ground;
        ctx.fillRect(ox + px*scale*dpr, oy + 104*scale*dpr, 8*scale*dpr, 4*scale*dpr);
      }

      // Condor sprite
      const frame = Math.floor(flap) % 2;
      drawCondorFrame(frame);
      const sx = 16, sy = 12;
      const condorScale = 4 * scale * dpr;
      const cx = ox + Math.floor(logicalW*0.35)*scale*dpr;
      const cy = oy + Math.floor(64 + Math.sin(t*0.004)*6)*scale*dpr;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(sprite, 0,0,sx,sy, cx, cy, sx*condorScale, sy*condorScale);

      // UI label box
      const text = label;
      if (text) {
        const s = scale * dpr;
        const boxW = text.length * 6 + 10;
        const bx = ox + Math.floor((logicalW - boxW)/2)*s;
        const by = oy + (logicalH - 18)*s;
        ctx.fillStyle = "#0f172a"; ctx.fillRect(bx, by, boxW*s, 12*s);
        ctx.strokeStyle = P.cyan; ctx.lineWidth = 2;
        ctx.strokeRect(bx, by, boxW*s, 12*s);
        drawPixelText(ctx, text, bx + 5*s, by + 3*s, s, "#e5e7eb");
      }

      // Scanlines
      if (showScanlines) {
        ctx.globalAlpha = 0.08;
        for (let y=oy; y< oy + logicalH*scale*dpr; y += 2*scale*dpr) {
          ctx.fillStyle = "#000"; ctx.fillRect(ox, y, logicalW*scale*dpr, scale*dpr);
        }
        ctx.globalAlpha = 1;
      }

      raf = requestAnimationFrame(loop);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    raf = requestAnimationFrame(loop);

    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [background, pixelSize, speed, showScanlines]);

  return (
    <div ref={wrapRef} className="relative h-full w-full grid place-items-center overflow-hidden bg-transparent">
      <canvas ref={canvasRef} style={{ display: 'block', imageRendering: 'pixelated' }} />
      {/* Glow vignette for extra vibe */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(73,209,255,0.10)_0%,rgba(0,0,0,0.0)_40%,rgba(0,0,0,0.45)_100%)]" />
    </div>
  );
}

// Tiny 3x5 pixel font renderer
function drawPixelText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  scale: number,
  color: string
) {
  const font: Record<string, number[]> = {
    "A":[0b010,0b101,0b111,0b101,0b101],
    "B":[0b110,0b101,0b110,0b101,0b110],
    "C":[0b011,0b100,0b100,0b100,0b011],
    "D":[0b110,0b101,0b101,0b101,0b110],
    "E":[0b111,0b100,0b110,0b100,0b111],
    "F":[0b111,0b100,0b110,0b100,0b100],
    "G":[0b011,0b100,0b101,0b101,0b011],
    "H":[0b101,0b101,0b111,0b101,0b101],
    "I":[0b111,0b010,0b010,0b010,0b111],
    "J":[0b111,0b001,0b001,0b101,0b010],
    "K":[0b101,0b101,0b110,0b101,0b101],
    "L":[0b100,0b100,0b100,0b100,0b111],
    "M":[0b101,0b111,0b111,0b101,0b101],
    "N":[0b101,0b111,0b111,0b111,0b101],
    "O":[0b010,0b101,0b101,0b101,0b010],
    "P":[0b110,0b101,0b110,0b100,0b100],
    "Q":[0b010,0b101,0b101,0b010,0b001],
    "R":[0b110,0b101,0b110,0b101,0b101],
    "S":[0b011,0b100,0b010,0b001,0b110],
    "T":[0b111,0b010,0b010,0b010,0b010],
    "U":[0b101,0b101,0b101,0b101,0b111],
    "V":[0b101,0b101,0b101,0b101,0b010],
    "W":[0b101,0b101,0b111,0b111,0b101],
    "X":[0b101,0b101,0b010,0b101,0b101],
    "Y":[0b101,0b101,0b010,0b010,0b010],
    "Z":[0b111,0b001,0b010,0b100,0b111],
    "0":[0b111,0b101,0b101,0b101,0b111],
    "1":[0b010,0b110,0b010,0b010,0b111],
    "2":[0b111,0b001,0b111,0b100,0b111],
    "3":[0b111,0b001,0b111,0b001,0b111],
    "4":[0b101,0b101,0b111,0b001,0b001],
    "5":[0b111,0b100,0b111,0b001,0b111],
    "6":[0b111,0b100,0b111,0b101,0b111],
    "7":[0b111,0b001,0b001,0b001,0b001],
    "8":[0b111,0b101,0b111,0b101,0b111],
    "9":[0b111,0b101,0b111,0b001,0b111],
    " ":[0,0,0,0,0],
    ".":[0,0,0,0,0b010],
    ":":[0,0b010,0,0b010,0],
    "-": [0,0,0b111,0,0],
    "?": [0b111,0b001,0b011,0,0b010],
  };
  ctx.fillStyle = color;
  let cx = x, cy = y;
  for (const ch of text.toUpperCase()) {
    if (ch === "\n") { cy += 6*scale; cx = x; continue; }
    const glyph = font[ch] || font["?"];
    for (let row=0; row<5; row++) {
      const bits = glyph[row];
      for (let col=0; col<3; col++) {
        if (bits & (1 << (2-col))) {
          ctx.fillRect(cx + col*scale, cy + row*scale, scale, scale);
        }
      }
    }
    cx += 4*scale; // 3px glyph + 1px space
  }
}
