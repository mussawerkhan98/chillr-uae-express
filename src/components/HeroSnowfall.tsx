import { useEffect, useRef } from "react";

type Flake = {
  x: number;
  y: number;
  radius: number;
  speed: number;
  drift: number;
  driftPhase: number;
  opacity: number;
};

/**
 * Lightweight canvas snowfall effect for the homepage hero.
 * - Purely decorative: sits behind the headline text, in front of the
 *   hero photo + gradient overlay (see z-index stacking in Hero()).
 * - Performance-conscious: particle count scales down on narrow
 *   viewports, animation pauses when the tab isn't visible, and it
 *   never renders at all for prefers-reduced-motion users.
 * - Depth illusion: smaller/farther flakes are fainter and fall
 *   slower; larger/closer flakes are more opaque and faster, each
 *   drifting sideways on its own gentle sine wave.
 */
export function HeroSnowfall() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let flakes: Flake[] = [];
    let rafId: number | null = null;
    let running = true;

    function flakeCount(w: number) {
      // Fewer particles on small/mobile screens to keep this cheap everywhere.
      if (w < 480) return 35;
      if (w < 900) return 55;
      return 90;
    }

    function makeFlake(w: number, h: number, seedY?: number): Flake {
      const radius = 1 + Math.random() * 2.6;
      // Bigger flakes = "closer" = faster + more opaque (depth cue).
      const depth = radius / 3.6;
      return {
        x: Math.random() * w,
        y: seedY ?? Math.random() * h,
        radius,
        speed: 14 + depth * 26, // px/sec
        drift: 8 + Math.random() * 18,
        driftPhase: Math.random() * Math.PI * 2,
        opacity: 0.15 + depth * 0.55,
      };
    }

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas!.width = Math.max(1, Math.floor(width * dpr));
      canvas!.height = Math.max(1, Math.floor(height * dpr));
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = flakeCount(width);
      if (flakes.length === 0) {
        flakes = Array.from({ length: target }, () => makeFlake(width, height));
      } else if (flakes.length < target) {
        flakes = flakes.concat(
          Array.from({ length: target - flakes.length }, () => makeFlake(width, height)),
        );
      } else if (flakes.length > target) {
        flakes = flakes.slice(0, target);
      }
    }

    let lastT = performance.now();
    function frame(t: number) {
      if (!running) return;
      const dt = Math.min(0.05, (t - lastT) / 1000);
      lastT = t;

      ctx!.clearRect(0, 0, width, height);
      ctx!.fillStyle = "#ffffff";

      for (const f of flakes) {
        f.y += f.speed * dt;
        f.driftPhase += dt * 0.6;
        const x = f.x + Math.sin(f.driftPhase) * f.drift * 0.05;

        if (f.y - f.radius > height) {
          f.y = -f.radius;
          f.x = Math.random() * width;
        }

        ctx!.globalAlpha = f.opacity;
        ctx!.beginPath();
        ctx!.arc(x, f.y, f.radius, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;

      rafId = requestAnimationFrame(frame);
    }

    function handleVisibility() {
      if (document.hidden) {
        running = false;
        if (rafId) cancelAnimationFrame(rafId);
      } else if (!running) {
        running = true;
        lastT = performance.now();
        rafId = requestAnimationFrame(frame);
      }
    }

    resize();
    lastT = performance.now();
    rafId = requestAnimationFrame(frame);

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
