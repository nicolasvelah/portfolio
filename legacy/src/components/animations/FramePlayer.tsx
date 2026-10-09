// src/components/FramePlayer.tsx
import React, {
  CSSProperties,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export type FramePlayerHandle = {
  play: () => void;
  pause: () => void;
  toggle: () => void;
  seek: (index: number) => void;
  currentFrame: () => number;
  isPlaying: () => boolean;
  setFps: (fps: number) => void;
};

export type FramePlayerProps = {
  images: string[];
  fps?: number;
  autoPlay?: boolean;
  loop?: boolean;
  pauseOnBlur?: boolean;
  crossOrigin?: HTMLImageElement['crossOrigin'];
  initialFrame?: number;
  onFrame?: (index: number) => void;
  onEnd?: () => void;
  className?: string;
  style?: CSSProperties;
};

/**
 * Frame-by-frame image player.
 * - Preloads frames
 * - requestAnimationFrame scheduler respecting the given FPS
 * - Imperative API via ref: play/pause/toggle/seek/currentFrame/isPlaying/setFps
 */
const FramePlayer = forwardRef<FramePlayerHandle, FramePlayerProps>(function FramePlayer(
  {
    images,
    fps = 12,
    autoPlay = true,
    loop = true,
    pauseOnBlur = true,
    crossOrigin,
    initialFrame = 0,
    onFrame,
    onEnd,
    className,
    style,
  },
  ref
) {
  const [idx, setIdx] = useState<number>(clamp(initialFrame, 0, Math.max(0, images.length - 1)));
  const playingRef = useRef<boolean>(Boolean(autoPlay));
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const intervalRef = useRef<number>(1000 / Math.max(1, fps | 0));
  const preloadedRef = useRef<boolean>(false);

  // Imperative API
  useImperativeHandle(ref, (): FramePlayerHandle => ({
    play: () => {
      playingRef.current = true;
      tick(performance.now());
    },
    pause: () => {
      playingRef.current = false;
      cancelAnimationFrame(rafRef.current);
    },
    toggle: () => {
      if (playingRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      playingRef.current = !playingRef.current;
      if (playingRef.current) tick(performance.now());
    },
    seek: (i: number) => {
      setIdx(clamp(i | 0, 0, images.length - 1));
    },
    currentFrame: () => idx,
    isPlaying: () => playingRef.current,
    setFps: (newFps: number) => {
      intervalRef.current = 1000 / Math.max(1, newFps | 0);
    },
  }), [idx, images.length]);

  // Update interval when fps changes
  useEffect(() => {
    intervalRef.current = 1000 / Math.max(1, fps | 0);
  }, [fps]);

  // Preload frames
  useEffect(() => {
    preloadedRef.current = false;
    let alive = true;

    const preload = async () => {
      const tasks = images.map(
        (src) =>
          new Promise<boolean>((res) => {
            const img = new Image();
            if (crossOrigin) img.crossOrigin = crossOrigin;
            img.onload = () => res(true);
            img.onerror = () => res(false);
            img.src = src;
          })
      );
      await Promise.all(tasks);
      if (!alive) return;
      preloadedRef.current = true;
      if (autoPlay) {
        playingRef.current = true;
        tick(performance.now());
      }
    };

    if (images.length) preload();

    return () => {
      alive = false;
      cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.join('|'), crossOrigin, autoPlay]);

  // Pause/resume on window blur/focus
  useEffect(() => {
    if (!pauseOnBlur) return;
    const onBlur = () => {
      playingRef.current = false;
      cancelAnimationFrame(rafRef.current);
    };
    const onFocus = () => {
      if (autoPlay && preloadedRef.current) {
        playingRef.current = true;
        tick(performance.now());
      }
    };
    //window.addEventListener('blur', onBlur);
    //window.addEventListener('focus', onFocus);
    return () => {
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
    };
  }, [pauseOnBlur, autoPlay]);

  const tick = (t: number) => {
    if (!playingRef.current) return;
    if (!lastTimeRef.current) lastTimeRef.current = t;

    const dt = t - lastTimeRef.current;
    if (dt >= intervalRef.current) {
      lastTimeRef.current = t - (dt % intervalRef.current);
      setIdx((prev) => {
        const next = prev + 1;
        if (next >= images.length) {
          onEnd?.();
          if (loop && images.length > 0) {
            onFrame?.(0);
            return 0;
          } else {
            playingRef.current = false;
            return prev;
          }
        }
        onFrame?.(next);
        return next;
      });
    }
    rafRef.current = requestAnimationFrame(tick);
  };

  // Start if images already preloaded and autoPlay on mount
  useEffect(() => {
    if (autoPlay && images.length && preloadedRef.current) {
      playingRef.current = true;
      tick(performance.now());
    }
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, images.length]);

  const src = images[idx] ?? '';

  return (
    <img
      src={src}
      alt={`frame-${idx}`}
      className={className}
      style={{ imageRendering: 'pixelated', ...style }}
      draggable={false}
    />
  );
});

export default FramePlayer;
