import { useEffect, useRef, useState } from 'react';
import { calculateDirectionalFollow, calculateScrubTime } from '../utils/portfolioLogic';

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_041744_63efcd78-bf7d-4039-99e2-2461e8a61903.mp4';

export function ScrubBackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prevXRef = useRef<number | null>(null);
  const targetTimeRef = useRef<number>(0);
  const isSeekingRef = useRef<boolean>(false);
  const targetPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let rafId = 0;
    let isDestroyed = false;

    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Ensure critical mobile video attributes are set on DOM element
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.loop = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');

    // Attempt autoplay immediately
    const startVideoPlayback = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            if (!isDestroyed) {
              setVideoReady(true);
            }
          })
          .catch(() => {
            // Autoplay may be restricted until user touch; fallback canvas handles animation
          });
      }
    };
    startVideoPlayback();

    // User touch/click gesture unlock for strict mobile autoplay policies
    const handleUserInteraction = () => {
      if (video.paused) {
        startVideoPlayback();
      }
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('pointerdown', handleUserInteraction);
    };
    window.addEventListener('touchstart', handleUserInteraction, { passive: true });
    window.addEventListener('pointerdown', handleUserInteraction, { passive: true });

    // Mark video ready as soon as frames are available
    const markVideoReady = () => {
      if (isDestroyed) return;
      if (Number.isFinite(video.duration) && video.duration > 0) {
        targetTimeRef.current = Math.min(video.duration, Math.max(0, video.currentTime));
      }
      setVideoReady(true);
    };

    if (video.readyState >= 2) {
      markVideoReady();
    }

    video.addEventListener('loadeddata', markVideoReady);
    video.addEventListener('canplay', markVideoReady);
    video.addEventListener('playing', markVideoReady);
    video.addEventListener('timeupdate', () => {
      if (!isDestroyed && video.currentTime > 0) {
        setVideoReady(true);
      }
    });
    video.addEventListener('ended', () => {
      video.currentTime = 0;
      startVideoPlayback();
    });

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

      // Continuous ambient breathing drift (essential for mobile when idle)
      const t = timestamp * 0.001;
      const ambientX = prefersReducedMotion ? 0 : Math.sin(t * 0.5) * 0.06;
      const ambientY = prefersReducedMotion ? 0 : Math.cos(t * 0.4) * 0.06;

      const nx = currentPointerRef.current.x + ambientX;
      const ny = currentPointerRef.current.y + ambientY;

      ctx.fillStyle = '#050507';
      ctx.fillRect(0, 0, width, height);

      const cx = width * (0.7 + nx * 0.1);
      const cy = height * (0.5 + ny * 0.12);
      const radius = Math.max(width, height) * 0.55;

      const grad = ctx.createRadialGradient(cx, cy, radius * 0.04, cx, cy, radius);
      grad.addColorStop(0, 'rgba(215, 224, 240, 0.22)');
      grad.addColorStop(0.32, 'rgba(110, 128, 160, 0.11)');
      grad.addColorStop(0.68, 'rgba(32, 38, 52, 0.06)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 4; i++) {
        const ringR = radius * (0.22 + i * 0.14);
        ctx.beginPath();
        ctx.ellipse(
          cx,
          cy,
          ringR,
          ringR * (0.52 + ny * 0.08),
          nx * 0.3 + i * 0.18 + (prefersReducedMotion ? 0 : t * 0.08),
          0,
          Math.PI * 2
        );
        ctx.stroke();
      }
    };

    // Continuous animation loop ensuring uninterrupted movement on mobile and desktop
    const renderLoop = (timestamp: number) => {
      if (isDestroyed) return;

      const cur = currentPointerRef.current;
      const tgt = targetPointerRef.current;

      // Smooth spring interpolation
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

    const commitSeek = () => {
      if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;
      const desired = Math.min(video.duration, Math.max(0, targetTimeRef.current));
      if (Math.abs(video.currentTime - desired) < 0.01) {
        isSeekingRef.current = false;
        return;
      }
      isSeekingRef.current = true;
      video.currentTime = desired;
    };

    const handlePointerMove = (clientX: number, clientY: number, isTouch = false) => {
      const vw = Math.max(1, window.innerWidth);
      const vh = Math.max(1, window.innerHeight);

      const follow = calculateDirectionalFollow({
        clientX,
        clientY,
        viewportWidth: vw,
        viewportHeight: vh,
      });
      targetPointerRef.current = { x: follow.nx, y: follow.ny };

      // On mobile touch devices, let the video play naturally without pausing or stuttering seek calls
      if (isTouch) {
        return;
      }

      // On desktop with mouse, support interactive timeline scrubbing
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
      });

      if (!isSeekingRef.current) {
        commitSeek();
      }
    };

    const onMouseMove = (event: MouseEvent) => {
      handlePointerMove(event.clientX, event.clientY, false);
    };

    const onTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) {
        prevXRef.current = touch.clientX;
        handlePointerMove(touch.clientX, touch.clientY, true);
      }
    };

    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) {
        handlePointerMove(touch.clientX, touch.clientY, true);
      }
    };

    const handleSeeked = () => {
      isSeekingRef.current = false;
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;
      if (Math.abs(video.currentTime - targetTimeRef.current) >= 0.02) {
        commitSeek();
      }
    };

    const handleError = () => {
      if (!isDestroyed) {
        setVideoReady(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    video.addEventListener('seeked', handleSeeked);
    video.addEventListener('error', handleError);

    return () => {
      isDestroyed = true;
      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('pointerdown', handleUserInteraction);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      video.removeEventListener('seeked', handleSeeked);
      video.removeEventListener('loadeddata', markVideoReady);
      video.removeEventListener('canplay', markVideoReady);
      video.removeEventListener('playing', markVideoReady);
      video.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`fixed inset-0 z-0 h-full w-full pointer-events-none transition-opacity duration-700 ${
          videoReady ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <video
        ref={videoRef}
        src={VIDEO_URL}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        className={`fixed inset-0 z-0 h-full w-full object-cover object-[70%_center] pointer-events-none transition-opacity duration-700 scale-[1.08] will-change-transform ${
          videoReady ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 bg-gradient-to-r from-black/65 via-black/35 to-black/20 pointer-events-none"
      />
    </>
  );
}
