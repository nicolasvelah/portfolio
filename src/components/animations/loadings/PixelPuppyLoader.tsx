import React, { useEffect, useRef } from "react";

/**
 * PixelPuppyLoader
 * A tiny centered pixel-dog loader for dark backgrounds.
 * The dog sits happily and wags its tail with a soft ground shadow.
 *
 * Usage:
 * <div className="w-full h-[160px]">
 *   <PixelPuppyLoader label="Loading…" />
 * </div>
 */
export default function PixelPuppyLoader({
  label = "",
  size = 5,               // logical pixel size multiplier (2–8)
  background = "transparent",
  showScanlines = false,  // optional CRT effect
}: {
  label?: string;
  size?: number;
  background?: string;
  showScanlines?: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dpr = Math.min(2, typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1);

  useEffect(() => {
    const wrap = wrapRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    let raf = 0;
    const LW = 64; // logical width
    const LH = 64; // logical height

    // Palette for dark bg
    const P = {
      fur: "#e7c59a",       // light tan
      ear: "#b0855b",
      nose: "#2b2b2b",
      eye: "#1a1a1a",
      collar: "#49d1ff",
      white: "#ffffff",
      outline: "#0b0f16",   // dark outline
      shadow: "rgba(0,0,0,0.35)",
      uiBox: "#0f172a",
      uiText: "#e5e7eb",
    } as const;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const scale = Math.max(2, Math.floor(Math.min(rect.width / LW, rect.height / LH) * size));
      const w = Math.max(LW * scale, 1);
      const h = Math.max(LH * scale, 1);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.imageSmoothingEnabled = false;
    };

    const drawPixel = (x:number, y:number, s:number, color:string) => {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, s, s);
    };

    // Draw a tiny 16x16 dog sprite at the center, tail animated
    const drawDog = (frame:number) => {
      const s = Math.max(1, Math.floor(Math.min(canvas.width / LW, canvas.height / LH))); // device px per logical px
      const cx = (canvas.width >> 1);
      const cy = (canvas.height >> 1);

      // sprite origin (top-left) so that dog is centered
      const sprW = 16, sprH = 16;
      const ox = cx - Math.floor((sprW * s)/2);
      const oy = cy - Math.floor((sprH * s)/2) + Math.floor(3*s); // slight vertical bias for shadow

      // ground shadow (ellipse approximation using rows)
      const shW = 12, shH = 3;
      for (let i=0; i<shH; i++) {
        const rowW = shW - i*2;
        const sx = cx - Math.floor((rowW * s)/2);
        const sy = oy + 13*s + i*s;
        ctx.fillStyle = P.shadow;
        ctx.fillRect(sx, sy, rowW*s, 1*s);
      }

      // simple tail wag: shift left/right
      const wag = frame % 20 < 10 ? -1 : 1;

      // helper to put a block in sprite grid coordinates
      const px = (x: number, y: number, w = 1, h = 1, color: string = P.fur) => {
        drawPixel(ox + x * s, oy + y * s, s, color);
        if (w > 1 || h > 1) {
          ctx.fillRect(ox + x * s, oy + y * s, w * s, h * s);
        }
      };

      // Clear sprite area (for safe redraw)
      ctx.clearRect(ox - 2*s, oy - 2*s, (sprW+4)*s, (sprH+4)*s);

      // OUTLINE pass (draw under and offset for rim-light look on dark bg)
      const outline = (x:number, y:number, w=1, h=1) => {
        drawPixel(ox + x*s, oy + y*s, s, P.outline);
        if (w > 1 || h > 1) {
          ctx.fillRect(ox + x*s, oy + y*s, w*s, h*s);
        }
      };

      // ---- DOG SPRITE (sitting) ----
      // Ears + head outline
      outline(6,2,4,1); outline(5,3,6,1); outline(5,4,6,1);
      // body outline
      outline(4,5,8,1); outline(3,6,10,1); outline(3,7,10,1); outline(4,8,8,1);
      outline(5,9,6,1); outline(5,10,6,1); outline(6,11,4,1); outline(7,12,2,1);

      // Tail outline (animated)
      outline(13+wag,8,1,1); outline(12+wag,9,1,1);

      // Fill head
      px(6,3,4,1); px(5,4,6,1); px(6,5,4,1);
      // Face details
      px(9,5,1,1,P.eye); // eye
      px(8,6,1,1,P.nose); // nose

      // Ears
      px(6,2,1,1,P.ear); px(9,2,1,1,P.ear);

      // Body
      px(4,6,8,1); px(4,7,8,1); px(5,8,6,1); px(5,9,6,1); px(6,10,4,1); px(7,11,2,1);

      // Chest (white tuft)
      px(6,7,2,1,P.white); px(6,8,2,1,P.white);

      // Collar
      px(5,6,6,1,P.collar);

      // Front paws
      px(6,12,1,1,P.white); px(9,12,1,1,P.white);

      // Tail (fill animated)
      px(13+wag,8,1,1); px(12+wag,9,1,1);
    };

    let t0 = performance.now();
    const loop = (t:number) => {
      const dt = (t - t0) / 1000; t0 = t; // not used but handy
      // clear bg
      ctx.fillStyle = background; ctx.fillRect(0,0,canvas.width,canvas.height);

      // center dog
      const frame = Math.floor(t/60 * 60) % 60; // stable frame counter using time
      drawDog(frame);

      // label (optional)
      if (label) {
        const s = Math.max(1, Math.floor(Math.min(canvas.width / LW, canvas.height / LH)));
        const text = label.toUpperCase();
        // draw a tiny rounded box imitation with pixels
        const boxW = Math.max(32, text.length * 6 + 10);
        const bx = (canvas.width - boxW*s) >> 1;
        const by = Math.floor(canvas.height * 0.78);
        ctx.fillStyle = P.uiBox; ctx.fillRect(bx, by, boxW*s, 10*s);
        ctx.strokeStyle = P.collar; ctx.lineWidth = Math.max(1, Math.floor(s*0.6));
        ctx.strokeRect(bx, by, boxW*s, 10*s);
        drawPixelText(ctx, text, bx + 5*s, by + 2*s, s, P.uiText);
      }

      // optional scanlines
      if (showScanlines) {
        const s = Math.max(1, Math.floor(Math.min(canvas.width / LW, canvas.height / LH)));
        ctx.globalAlpha = 0.06;
        for (let y=0; y< canvas.height; y += 2*s) {
          ctx.fillStyle = "#000"; ctx.fillRect(0, y, canvas.width, s);
        }
        ctx.globalAlpha = 1;
      }

      raf = requestAnimationFrame(loop);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();
    raf = requestAnimationFrame(loop);

    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [background, size, label, showScanlines]);

  return (
    <div ref={wrapRef} className="relative h-full w-full grid place-items-center overflow-hidden">
      <canvas ref={canvasRef} style={{ display: 'block', imageRendering: 'pixelated' }} />
    </div>
  );
}

// tiny 3x5 pixel font
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
    "C":[0b111,0b100,0b100,0b100,0b111],
    "D":[0b110,0b101,0b101,0b101,0b110],
    "E":[0b111,0b100,0b110,0b100,0b111],
    "F":[0b111,0b100,0b110,0b100,0b100],
    "G":[0b111,0b100,0b101,0b101,0b111],
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
    cx += 4*scale;
  }
}
