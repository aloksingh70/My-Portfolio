import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { ChevronLeft, ChevronRight, ExternalLink, FileText } from 'lucide-react';
import { CertificationItem } from '../data/resumeData';
import {
  CertificateFilter,
  filterCertificates,
  getCarouselScrollDelta,
} from '../utils/portfolioLogic';

interface CertificatesCarouselProps {
  certificates: CertificationItem[];
  onPreviewDocument: (certificate: CertificationItem) => void;
  scrollRootRef?: RefObject<HTMLDivElement | null>;
}

const FILTER_OPTIONS: { key: CertificateFilter; label: string }[] = [
  { key: 'all', label: 'All Credentials' },
  { key: 'internship', label: 'Internship' },
  { key: 'simulation', label: 'Forage Simulations' },
  { key: 'course', label: 'Courses & Certs' },
];

export function CertificatesCarousel({
  certificates,
  onPreviewDocument,
  scrollRootRef,
}: CertificatesCarouselProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.12,
    root: scrollRootRef,
  });
  const [activeFilter, setActiveFilter] = useState<CertificateFilter>('all');
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const visibleCertificates = filterCertificates(certificates, activeFilter);

  const updateScrollButtons = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
    setCanScrollPrev(track.scrollLeft > 8);
    setCanScrollNext(track.scrollLeft < maxScroll - 8);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: 0, behavior: 'auto' });
    updateScrollButtons();
  }, [activeFilter, updateScrollButtons]);

  useEffect(() => {
    updateScrollButtons();
    window.addEventListener('resize', updateScrollButtons);
    return () => window.removeEventListener('resize', updateScrollButtons);
  }, [updateScrollButtons]);

  const handleScroll = (direction: 'prev' | 'next') => {
    const track = trackRef.current;
    if (!track) return;
    const delta = getCarouselScrollDelta(direction, 356);
    track.scrollBy({ left: delta, behavior: 'smooth' });
  };

  return (
    <motion.div
      ref={sectionRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div role="tablist" aria-label="Filter certificates by category" className="flex flex-wrap gap-2">
          {FILTER_OPTIONS.map((option) => {
            const selected = activeFilter === option.key;
            return (
              <button
                key={option.key}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveFilter(option.key)}
                className={`rounded-full px-3.5 py-1 text-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  selected
                    ? 'bg-white text-black'
                    : 'border border-white/25 text-white/80 hover:border-white hover:text-white'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-white/60 tabular-nums mr-1">
            {visibleCertificates.length} {visibleCertificates.length === 1 ? 'item' : 'items'}
          </span>
          <button
            type="button"
            onClick={() => handleScroll('prev')}
            disabled={!canScrollPrev}
            aria-label="Scroll certificates left"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white hover:text-black disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => handleScroll('next')}
            disabled={!canScrollNext}
            aria-label="Scroll certificates right"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white hover:text-black disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        onScroll={updateScrollButtons}
        tabIndex={0}
        role="region"
        aria-label="Certificates horizontal carousel"
        data-testid="certificates-carousel-track"
        className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth focus-visible:outline-2 focus-visible:outline-white/70"
      >
        {visibleCertificates.map((cert, index) => (
          <motion.article
            key={cert.title}
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{
              duration: 0.4,
              delay: Math.min(index * 0.05, 0.25),
              ease: [0.16, 1, 0.3, 1],
            }}
            className="w-[290px] sm:w-[340px] shrink-0 snap-start border border-white/15 bg-white/[0.03] p-5 flex flex-col justify-between gap-4"
          >
            <div className="space-y-4">
              {cert.documentImage ? (
                <button
                  type="button"
                  onClick={() => onPreviewDocument(cert)}
                  aria-label={`Inspect ${cert.title}`}
                  className="group relative block w-full overflow-hidden border border-white/15 bg-white text-left cursor-pointer"
                >
                  <img
                    src={cert.documentImage}
                    alt={cert.title}
                    referrerPolicy="no-referrer"
                    className="h-40 w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </button>
              ) : (
                <div className="h-40 border border-white/15 bg-white/[0.04] p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-white/60 tabular-nums">
                    <span>{cert.category}</span>
                    <span>{cert.date}</span>
                  </div>
                  <div>
                    <p className="text-2xl tracking-tight text-white [font-family:var(--font-heading)]">
                      {cert.issuer}
                    </p>
                    <p className="mt-1 text-xs text-white/65">Verified Credential</p>
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <p className="text-xs text-white/60 tabular-nums">
                  0{index + 1} · {cert.issuer} · {cert.date}
                </p>
                <h3 className="text-lg leading-snug text-white [font-family:var(--font-heading)]">
                  {cert.title}
                </h3>
                {cert.details && (
                  <p className="text-xs leading-relaxed text-white/70">{cert.details}</p>
                )}
              </div>
            </div>

            <div className="border-t border-white/10 pt-3">
              {cert.credentialUrl ? (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white px-4 py-1.5 text-xs text-white hover:bg-white hover:text-black transition-colors whitespace-nowrap"
                >
                  <span>View Certificate</span>
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              ) : cert.documentImage ? (
                <button
                  type="button"
                  onClick={() => onPreviewDocument(cert)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white px-4 py-1.5 text-xs text-white hover:bg-white hover:text-black transition-colors whitespace-nowrap cursor-pointer"
                >
                  <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>View Certificate</span>
                </button>
              ) : null}
            </div>
          </motion.article>
        ))}
      </div>
    </motion.div>
  );
}
