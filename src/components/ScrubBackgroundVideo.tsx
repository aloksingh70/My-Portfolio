import { useEffect, useRef } from 'react';
import {
  calculateAmbientGaze,
  calculateDirectionalFollow,
  calculateDirectGazeProgress,
  calculateOrientationFollow,
} from '../utils/portfolioLogic';

export function ScrubBackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const targetTimeRef = useRef<number>(2.0); // start looking straight ahead (center of 4s video)
  const baseProgressRef = useRef<number>(0.5); // normalized center [0..1]
  const isSeekingRef = useRef<boolean>(false);
  const targetPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const lastInteractionTimeRef = useRef<number>(performance.now());
  const isTouchingRef = useRef<boolean>(false);

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
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');

    // Queue-based seek preventing seek-flooding
    const commitSeek = () => {
      if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;
      if (isSeekingRef.current) return;

      const desired = Math.min(video.duration, Math.max(0, targetTimeRef.current));
      if (Math.abs(video.currentTime - desired) < 0.02) return;

      isSeekingRef.current = true;
      video.currentTime = desired;
    };

    const handleSeeked = () => {
      isSeekingRef.current = false;
      if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;
      if (Math.abs(video.currentTime - targetTimeRef.current) >= 0.03) {
        commitSeek();
      }
    };
    video.addEventListener('seeked', handleSeeked);

    // Warm up mobile hardware decoder once on metadata or user interaction
    const primeVideoDecoder = () => {
      if (!video) return;
      if (Number.isFinite(video.duration) && video.duration > 0) {
        const centerTime = video.duration * 0.5;
        targetTimeRef.current = centerTime;
        video.currentTime = centerTime;
      }
      // Brief play/pause primes mobile media pipeline without continuous runaway playback
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            video.pause();
          })
          .catch(() => {
            // Handled: gesture unlock listener below handles strict battery-saver policies
          });
      }
    };

    const handleLoadedMetadata = () => {
      primeVideoDecoder();
    };
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    if (video.readyState >= 1) {
      primeVideoDecoder();
    }

    // Canvas fallback rendering (glowing cosmic orbits behind video)
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
      const ambientX = prefersReducedMotion ? 0 : Math.sin(t * 0.5) * 0.05;
      const ambientY = prefersReducedMotion ? 0 : Math.cos(t * 0.4) * 0.05;

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

    // Continuous 60fps render loop for smooth 3D tilt, idle breathing & seek execution
    const renderLoop = (timestamp: number) => {
      if (isDestroyed) return;

      const now = performance.now();
      const idleElapsedMs = now - lastInteractionTimeRef.current;

      // When idle for >1.8s, initiate gentle ambient living breathing
      if (idleElapsedMs > 1800 && !isTouchingRef.current && !prefersReducedMotion) {
        const idleSec = (idleElapsedMs - 1800) * 0.001;
        const ambientRatio = calculateAmbientGaze({
          baseProgress: baseProgressRef.current,
          elapsedSeconds: idleSec,
          amplitude: 0.04,
          frequency: 0.7,
        });

        if (Number.isFinite(video.duration) && video.duration > 0) {
          targetTimeRef.current = ambientRatio * video.duration;
        }

        const swayX = Math.sin(idleSec * 0.7) * 0.08;
        const swayY = Math.cos(idleSec * 0.5) * 0.06;
        targetPointerRef.current = {
          x: (baseProgressRef.current - 0.5) * 1.5 + swayX,
          y: swayY,
        };
      }

      // Smooth pointer interpolation (lerp)
      const cur = currentPointerRef.current;
      const tgt = targetPointerRef.current;
      cur.x += (tgt.x - cur.x) * 0.14;
      cur.y += (tgt.y - cur.y) * 0.14;

      // Apply 3D perspective tilt to cartoon head
      if (video && !prefersReducedMotion) {
        const tx = cur.x * 24;
        const ty = cur.y * 22;
        const ry = cur.x * 8;
        const rx = -cur.y * 8;
        video.style.transform = `perspective(1100px) translate3d(${tx.toFixed(2)}px, ${ty.toFixed(
          2
        )}px, 0) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(1.08)`;
      }

      // Execute queued seek if target timestamp drifted
      if (!isSeekingRef.current && Math.abs(video.currentTime - targetTimeRef.current) >= 0.03) {
        commitSeek();
      }

      drawCanvasBackdrop(timestamp);
      rafId = window.requestAnimationFrame(renderLoop);
    };

    rafId = window.requestAnimationFrame(renderLoop);

    // Direct pointer tracking for Mouse (Desktop/Laptop) and Finger (Mobile/Tablet)
    const updateTargetFromCoordinates = (clientX: number, clientY: number) => {
      const vw = Math.max(1, window.innerWidth);
      const vh = Math.max(1, window.innerHeight);

      lastInteractionTimeRef.current = performance.now();

      // Horizontal ratio: 0 = left edge, 0.5 = center, 1 = right edge
      const ratio = Math.min(1, Math.max(0, clientX / vw));
      baseProgressRef.current = ratio;

      if (Number.isFinite(video.duration) && video.duration > 0) {
        targetTimeRef.current = calculateDirectGazeProgress({
          clientX,
          viewportWidth: vw,
          duration: video.duration,
        });
      }

      // Directional 3D tilt tracking (up/down/left/right)
      const follow = calculateDirectionalFollow({
        clientX,
        clientY,
        viewportWidth: vw,
        viewportHeight: vh,
      });
      targetPointerRef.current = { x: follow.nx, y: follow.ny };

      commitSeek();
    };

    // Desktop/Laptop Mouse Events
    const onMouseMove = (event: MouseEvent) => {
      updateTargetFromCoordinates(event.clientX, event.clientY);
    };

    // Mobile/Tablet Finger Touch Events
    const onTouchStart = (event: TouchEvent) => {
      isTouchingRef.current = true;
      const touch = event.touches[0];
      if (touch) {
        if (video.paused && video.readyState < 2) {
          primeVideoDecoder();
        }
        updateTargetFromCoordinates(touch.clientX, touch.clientY);
      }
    };

    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) {
        updateTargetFromCoordinates(touch.clientX, touch.clientY);
      }
    };

    const onTouchEnd = () => {
      isTouchingRef.current = false;
      lastInteractionTimeRef.current = performance.now();
    };

    // Mobile/Tablet Gyroscope Device Orientation
    const onDeviceOrientation = (event: DeviceOrientationEvent) => {
      if (isTouchingRef.current) return;
      if (event.gamma === null || event.beta === null) return;
      // Only react to tilt if user hasn't touched recently (>600ms)
      if (performance.now() - lastInteractionTimeRef.current < 600) return;

      const { nx, ny, gazeProgressRatio } = calculateOrientationFollow({
        gamma: event.gamma,
        beta: event.beta,
      });

      targetPointerRef.current = { x: nx, y: ny };
      baseProgressRef.current = gazeProgressRatio;

      if (Number.isFinite(video.duration) && video.duration > 0) {
        targetTimeRef.current = gazeProgressRatio * video.duration;
        commitSeek();
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', onTouchEnd, { passive: true });
    window.addEventListener('deviceorientation', onDeviceOrientation, { passive: true });

    return () => {
      isDestroyed = true;
      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
      window.removeEventListener('deviceorientation', onDeviceOrientation);
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
        muted
        playsInline
        preload="auto"
        src="/video.mp4"
        aria-hidden="true"
        className="fixed inset-0 z-0 h-full w-full object-cover object-[70%_center] max-sm:object-[66%_center] pointer-events-none scale-[1.08] will-change-transform"
      >
        <source src="/video.mp4" type="video/mp4" />
        <source src="/video.webm" type="video/webm" />
      </video>
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 bg-gradient-to-r from-black/40 via-black/15 to-transparent pointer-events-none"
      />
    </>
  );
}
