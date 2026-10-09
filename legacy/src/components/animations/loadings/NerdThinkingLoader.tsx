import React from "react";

/**
 * NerdThinkingLoader
 * Super simple, lightweight loader using pure SVG + CSS (no Three.js).
 * A nerdy face blinks and a tiny thought bubble animates (…)
 *
 * Usage:
 * <div className="w-full h-[140px] grid place-items-center">
 *   <NerdThinkingLoader label="Thinking…" />
 * </div>
 */
export default function NerdThinkingLoader({
  size = 96,          // px size of the SVG
  label = "",
  accent = "#49d1ff", // glasses/thought color
  skin = "#ffe7c7",   // face fill
  outline = "#0b0f16",// stroke color
  textColor = "#e5e7eb",
}: {
  size?: number;
  label?: string;
  accent?: string;
  skin?: string;
  outline?: string;
  textColor?: string;
}) {
  return (
    <div className="inline-flex flex-col items-center gap-2 select-none">
      <style>{`
        @keyframes blink { 0%, 8%, 100% { transform: scaleY(1); } 4% { transform: scaleY(0.1); } }
        @keyframes think { 0% { opacity: .2; transform: translateY(0); } 50% { opacity: 1; transform: translateY(-2px); } 100% { opacity: .2; transform: translateY(0); } }
        @keyframes bob   { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-1px); } }
      `}</style>

      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={label || "Loading"}
        style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,.35))" }}
      >
        {/* Face */}
        <rect x="8" y="10" width="48" height="44" rx="10" fill={skin} stroke={outline} strokeWidth="2" />

        {/* Hair fringe */}
        <path d="M8 18 C20 8, 44 8, 56 18 L56 16 C42 6, 22 6, 8 16 Z" fill={outline} />

        {/* Glasses frame */}
        <rect x="16" y="28" width="12" height="10" rx="2" fill="none" stroke={accent} strokeWidth="2" />
        <rect x="36" y="28" width="12" height="10" rx="2" fill="none" stroke={accent} strokeWidth="2" />
        <rect x="28" y="31.5" width="8" height="2" rx="1" fill={accent} />

        {/* Eyes (blink via scaleY) */}
        <g transform="translate(0,1)">
          <rect x="20.5" y="32" width="3" height="3" fill={outline} style={{ transformOrigin: '22px 33.5px', animation: 'blink 2.6s infinite' }} />
          <rect x="40.5" y="32" width="3" height="3" fill={outline} style={{ transformOrigin: '42px 33.5px', animation: 'blink 2.8s infinite .2s' }} />
        </g>

        {/* Mouth (tiny bob) */}
        <rect x="29" y="42" width="6" height="2" rx="1" fill={outline} style={{ animation: 'bob 2.2s ease-in-out infinite' }} />

        {/* Thought bubble (ellipsis) */}
        <g>
          <circle cx="49" cy="14" r="4.5" fill={accent} opacity="0.15" />
          <circle cx="52" cy="9" r="6.5" fill={accent} opacity="0.12" />
          {/* dots */}
          <circle cx="52" cy="9" r="1.1" fill={accent} style={{ animation: 'think 1.2s infinite' }} />
          <circle cx="54.5" cy="9" r="1.1" fill={accent} style={{ animation: 'think 1.2s infinite .2s' }} />
          <circle cx="57" cy="9" r="1.1" fill={accent} style={{ animation: 'think 1.2s infinite .4s' }} />
        </g>
      </svg>

      {label ? (
        <div style={{ color: textColor }} className="text-xs tracking-wide opacity-80">
          {label}
        </div>
      ) : null}
    </div>
  );
}
