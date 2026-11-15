import { RefObject, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { TechStackItem } from '../data/resumeData';

interface TechStackGridProps {
  items: TechStackItem[];
  scrollRootRef?: RefObject<HTMLDivElement | null>;
}

function TechIcon({ id }: { id: TechStackItem['id'] }) {
  switch (id) {
    case 'python':
      return (
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" aria-hidden="true">
          <path
            d="M11.9 2.5C7.8 2.5 8.1 4.3 8.1 4.3V6.8H12.1V7.6H6.5C6.5 7.6 3.5 7.3 3.5 11.4C3.5 15.5 6.1 15.3 6.1 15.3H7.7V13.1C7.7 13.1 7.6 10.5 10.2 10.5H14.1C14.1 10.5 16.5 10.5 16.5 8.2V4.7C16.5 4.7 16.8 2.5 11.9 2.5ZM9.9 4.2C10.4 4.2 10.8 4.6 10.8 5.1C10.8 5.6 10.4 6 9.9 6C9.4 6 9 5.6 9 5.1C9 4.6 9.4 4.2 9.9 4.2Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <path
            d="M12.1 21.5C16.2 21.5 15.9 19.7 15.9 19.7V17.2H11.9V16.4H17.5C17.5 16.4 20.5 16.7 20.5 12.6C20.5 8.5 17.9 8.7 17.9 8.7H16.3V10.9C16.3 10.9 16.4 13.5 13.8 13.5H9.9C9.9 13.5 7.5 13.5 7.5 15.8V19.3C7.5 19.3 7.2 21.5 12.1 21.5ZM14.1 19.8C13.6 19.8 13.2 19.4 13.2 18.9C13.2 18.4 13.6 18 14.1 18C14.6 18 15 18.4 15 18.9C15 19.4 14.6 19.8 14.1 19.8Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'sql':
      return (
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" aria-hidden="true">
          <ellipse cx="12" cy="5.5" rx="7.5" ry="2.8" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M4.5 5.5V18.5C4.5 20.05 7.86 21.3 12 21.3C16.14 21.3 19.5 20.05 19.5 18.5V5.5"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M4.5 9.8C4.5 11.35 7.86 12.6 12 12.6C16.14 12.6 19.5 11.35 19.5 9.8"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M4.5 14.2C4.5 15.75 7.86 17 12 17C16.14 17 19.5 15.75 19.5 14.2"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      );
    case 'pytorch':
      return (
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" aria-hidden="true">
          <path
            d="M17.2 8.2C19.8 10.8 19.8 15.1 17.2 17.7C14.6 20.3 10.3 20.3 7.7 17.7C5.1 15.1 5.1 10.8 7.7 8.2L12.5 3.4V7.2"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="15.4" cy="6.4" r="1.3" fill="currentColor" />
        </svg>
      );
    case 'powerbi':
      return (
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" aria-hidden="true">
          <rect x="4" y="13" width="3.5" height="7" rx="0.8" stroke="currentColor" strokeWidth="1.5" />
          <rect x="10.25" y="8.5" width="3.5" height="11.5" rx="0.8" stroke="currentColor" strokeWidth="1.5" />
          <rect x="16.5" y="4" width="3.5" height="16" rx="0.8" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case 'fastapi':
      return (
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M13.2 6.8L8.4 13H12L10.8 17.2L15.6 11H12L13.2 6.8Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'tensorflow':
      return (
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" aria-hidden="true">
          <path
            d="M12 3.2L4.2 7.6V11.2L9.5 8.2V19.8L12 21.2V3.2Z"
            stroke="currentColor"
            strokeWidth="1.45"
            strokeLinejoin="round"
          />
          <path
            d="M12 3.2L19.8 7.6V11.2L14.5 8.2V11.8L17.4 13.4V16.6L14.5 15V19.8L12 21.2"
            stroke="currentColor"
            strokeWidth="1.45"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'react':
      return (
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="1.6" fill="currentColor" />
          <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="currentColor" strokeWidth="1.35" />
          <ellipse
            cx="12"
            cy="12"
            rx="9"
            ry="3.5"
            transform="rotate(60 12 12)"
            stroke="currentColor"
            strokeWidth="1.35"
          />
          <ellipse
            cx="12"
            cy="12"
            rx="9"
            ry="3.5"
            transform="rotate(120 12 12)"
            stroke="currentColor"
            strokeWidth="1.35"
          />
        </svg>
      );
  }
}

export function TechStackGrid({ items, scrollRootRef }: TechStackGridProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.12,
    root: scrollRootRef,
  });
  const [activeId, setActiveId] = useState<TechStackItem['id'] | null>(null);

  return (
    <motion.div
      ref={sectionRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-3"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-sm text-white/70">Interactive Core Stack</h3>
        <p className="text-xs text-white/55">Hover, focus, or tap an icon to view proficiency</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {items.map((item, idx) => {
          const isActive = activeId === item.id;
          const tooltipId = `tech-tooltip-${item.id}`;
          const mobileAlign = idx % 2 === 0 ? 'left-0' : 'right-0';
          const desktopAlign =
            idx % 4 === 0
              ? 'sm:left-0 sm:right-auto sm:translate-x-0'
              : idx % 4 === 3
              ? 'sm:right-0 sm:left-auto sm:translate-x-0'
              : 'sm:left-1/2 sm:right-auto sm:-translate-x-1/2';
          const alignClass = `${mobileAlign} ${desktopAlign}`;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{
                duration: 0.4,
                delay: idx * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative"
            >
              <button
                type="button"
                aria-describedby={tooltipId}
                aria-expanded={isActive}
                onMouseEnter={() => setActiveId(item.id)}
                onMouseLeave={() => setActiveId((prev) => (prev === item.id ? null : prev))}
                onFocus={() => setActiveId(item.id)}
                onBlur={() => setActiveId((prev) => (prev === item.id ? null : prev))}
                onClick={() => setActiveId((prev) => (prev === item.id ? null : item.id))}
                className={`group w-full border p-5 flex flex-col items-start gap-3 text-left transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-white ${
                  isActive
                    ? 'border-white/70 bg-white/[0.09] -translate-y-0.5'
                    : 'border-white/15 bg-white/[0.03] hover:border-white/55 hover:bg-white/[0.07] hover:-translate-y-0.5'
                }`}
              >
                <div className="text-white/90 group-hover:text-white transition-colors">
                  <TechIcon id={item.id} />
                </div>
                <div>
                  <p className="text-base text-white [font-family:var(--font-heading)]">
                    {item.name}
                  </p>
                  <p className="text-xs text-white/60 mt-0.5">{item.proficiency}</p>
                </div>
              </button>

              <div
                id={tooltipId}
                role="tooltip"
                aria-hidden={!isActive}
                className={`pointer-events-none absolute top-full mt-2.5 z-30 w-56 border border-black/15 bg-white px-3.5 py-2.5 text-xs leading-relaxed text-black shadow-2xl transition-all duration-150 ${alignClass} ${
                  isActive
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 -translate-y-1'
                }`}
              >
                <p className="font-medium text-black mb-0.5">
                  {item.name} · {item.proficiency}
                </p>
                <p className="text-black/75">{item.tooltip}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
