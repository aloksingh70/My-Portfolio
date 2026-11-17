import { useEffect, useRef } from 'react';
import { calculateDirectionalFollow, calculateScrubTime, SCRUB_SENSITIVITY } from '../utils/portfolioLogic';

export function ScrubBackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prevXRef = useRef<number | null>(null);
  const targetTimeRef = useRef<number>(0);
  const isSeekingRef = useRef<boolean>(false);
  const targetPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let rafId = 0;
    let isDestroyed = false;

    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Mobile WebKit / Chromium attribute enforcement
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.loop = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');

    // Autoplay start
    const startPlayback = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Handled: gesture unlock listener below handles strict battery-saver policies
        });
      }
    };
    startPlayback();

    // Unlock on first user touch gesture on mobile
    const unlockPlaybackOnGesture = () => {
      if (video.paused) {
        startPlayback();
      }
      window.removeEventListener('touchstart', unlockPlaybackOnGesture);
      window.removeEventListener('pointerdown', unlockPlaybackOnGesture);
    };
    window.addEventListener('touchstart', unlockPlaybackOnGesture, { passive: true });
    window.addEventListener('pointerdown', unlockPlaybackOnGesture, { passive: true });

    // Loop fallback
    const handleEnded = () => {
      video.currentTime = 0;
      startPlayback();
    };
    video.addEventListener('ended', handleEnded);

    const handleLoadedMetadata = () => {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        targetTimeRef.current = Math.min(video.duration, Math.max(0, video.currentTime));
      }
    };
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    // Canvas fallback rendering (glowing cosmic orbits)
    const drawCanvasBackdrop = (timestamp: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = window.innerWidth;
      const height = window.innerHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      const t = timestamp * 0.001;
      const ambientX = prefersReducedMotion ? 0 : Math.sin(t * 0.5) * 0.08;
      const ambientY = prefersReducedMotion ? 0 : Math.cos(t * 0.4) * 0.08;

      const nx = currentPointerRef.current.x + ambientX;
      const ny = currentPointerRef.current.y + ambientY;

      ctx.fillStyle = '#05070a';
      ctx.fillRect(0, 0, width, height);

      const cx = width * (0.68 + nx * 0.12);
      const cy = height * (0.5 + ny * 0.14);
      const radius = Math.max(width, height) * 0.6;

      const grad = ctx.createRadialGradient(cx, cy, radius * 0.03, cx, cy, radius);
      grad.addColorStop(0, 'rgba(180, 215, 255, 0.40)');
      grad.addColorStop(0.28, 'rgba(95, 140, 220, 0.22)');
      grad.addColorStop(0.62, 'rgba(30, 50, 95, 0.12)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(210, 235, 255, 0.22)';
      ctx.lineWidth = 1.2;
      for (let i = 0; i < 4; i++) {
        const ringR = radius * (0.2 + i * 0.15);
        ctx.beginPath();
        ctx.ellipse(
          cx,
          cy,
          ringR,
          ringR * (0.5 + ny * 0.09),
          nx * 0.3 + i * 0.2 + (prefersReducedMotion ? 0 : t * 0.07),
          0,
          Math.PI * 2
        );
        ctx.stroke();
      }
    };

    // Continuous 60fps render loop for parallax tilt & canvas
    const renderLoop = (timestamp: number) => {
      if (isDestroyed) return;

      const cur = currentPointerRef.current;
      const tgt = targetPointerRef.current;

      cur.x += (tgt.x - cur.x) * 0.12;
      cur.y += (tgt.y - cur.y) * 0.12;

      if (video && !prefersReducedMotion) {
        const tx = cur.x * 24;
        const ty = cur.y * 22;
        const ry = cur.x * 7;
        const rx = -cur.y * 7;
        video.style.transform = `perspective(1100px) translate3d(${tx.toFixed(2)}px, ${ty.toFixed(
          2
        )}px, 0) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(1.08)`;
      }

      drawCanvasBackdrop(timestamp);
      rafId = window.requestAnimationFrame(renderLoop);
    };

    rafId = window.requestAnimationFrame(renderLoop);

    // Queue-based seek preventing seek-flooding
    const commitSeek = () => {
      if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;
      const desired = Math.min(video.duration, Math.max(0, targetTimeRef.current));
      if (Math.abs(video.currentTime - desired) < 0.02) {
        isSeekingRef.current = false;
        return;
      }
      isSeekingRef.current = true;
      video.currentTime = desired;
    };

    const handleSeeked = () => {
      isSeekingRef.current = false;
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;
      if (Math.abs(video.currentTime - targetTimeRef.current) >= 0.02) {
        commitSeek();
      }
    };
    video.addEventListener('seeked', handleSeeked);

    // Horizontal scrub calculation on pointer move / touch drag
    const handlePointerDelta = (clientX: number, clientY: number) => {
      const vw = Math.max(1, window.innerWidth);
      const vh = Math.max(1, window.innerHeight);

      const follow = calculateDirectionalFollow({
        clientX,
        clientY,
        viewportWidth: vw,
        viewportHeight: vh,
      });
      targetPointerRef.current = { x: follow.nx, y: follow.ny };

      if (prevXRef.current === null) {
        prevXRef.current = clientX;
        return;
      }

      const deltaX = clientX - prevXRef.current;
      prevXRef.current = clientX;

      if (!Number.isFinite(video.duration) || video.duration <= 0) return;

      targetTimeRef.current = calculateScrubTime({
        currentTarget: targetTimeRef.current,
        deltaX,
        viewportWidth: vw,
        duration: video.duration,
        sensitivity: SCRUB_SENSITIVITY,
      });

      if (!isSeekingRef.current) {
        commitSeek();
      }
    };

    const onMouseMove = (event: MouseEvent) => {
      handlePointerDelta(event.clientX, event.clientY);
    };

    const onTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) {
        prevXRef.current = touch.clientX;
        handlePointerDelta(touch.clientX, touch.clientY);
      }
    };

    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) {
        handlePointerDelta(touch.clientX, touch.clientY);
      }
    };

    const onTouchEnd = () => {
      prevXRef.current = null;
      startPlayback();
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      isDestroyed = true;
      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener('touchstart', unlockPlaybackOnGesture);
      window.removeEventListener('pointerdown', unlockPlaybackOnGesture);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('seeked', handleSeeked);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="fixed inset-0 -z-10 h-full w-full pointer-events-none"
      />
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        className="fixed inset-0 z-0 h-full w-full object-cover object-[70%_center] pointer-events-none scale-[1.08] will-change-transform"
      >
        <source src="/video.webm" type="video/webm" />
        <source src="/video.mp4" type="video/mp4" />
      </video>
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 bg-gradient-to-r from-black/40 via-black/15 to-transparent pointer-events-none"
      />
    </>
  );
}
