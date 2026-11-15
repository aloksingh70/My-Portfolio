import { useEffect, useState } from 'react';
import { RESUME_DATA } from '../data/resumeData';
import { useTypewriter } from '../hooks/useTypewriter';
import { getMergedTypewriterParts, PortfolioSection } from '../utils/portfolioLogic';

interface HeroSectionProps {
  onSelectSection: (section: PortfolioSection) => void;
}

const INTRO_LINE_1 = 'Hey there, meet Alok Kumar Singh,';
const INTRO_LINE_2 = 'Computational Sciences & AI/ML Portfolio';
const BODY_TEXT =
  'BCA (Hons.) builder crafting ML & multi-agent AI systems. Exploring Python, SQL & data analytics. What shall we inspect?';

const MERGED_HERO_TEXT = `${INTRO_LINE_1}\n${INTRO_LINE_2}\n${BODY_TEXT}`;

export function HeroSection({ onSelectSection }: HeroSectionProps) {
  const { displayed, done } = useTypewriter(MERGED_HERO_TEXT, 28, 450);
  const [buttonsVisible, setButtonsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const { introLine1, introLine2, body, activeSegment } = getMergedTypewriterParts(displayed, done, {
    introLine1: INTRO_LINE_1,
    introLine2: INTRO_LINE_2,
    body: BODY_TEXT,
  });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setButtonsVisible(true);
    }, 400);
    return () => window.clearTimeout(timer);
  }, []);

  const handleCopyEmail = async () => {
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(RESUME_DATA.email);
      }
      setCopied(true);
    } catch {
      setCopied(true);
    }
    window.setTimeout(() => setCopied(false), 2200);
  };

  const cursor = (
    <span
      aria-hidden="true"
      className="inline-block w-[2px] h-[1.1em] bg-white align-middle ml-[2px] cursor-blink"
    />
  );

  return (
    <main className="relative z-[1] flex h-screen flex-col justify-end pb-12 md:justify-center md:pb-0 px-5 sm:px-8 md:px-10 overflow-hidden">
      <div className="relative z-10 max-w-xl">
        <p
          aria-label={`${INTRO_LINE_1} ${INTRO_LINE_2}`}
          className="pointer-events-none select-none mb-5 sm:mb-6 text-[clamp(18px,4vw,26px)] leading-[1.3] font-normal text-white/90 min-h-[54px] sm:min-h-[68px]"
        >
          <span>
            {introLine1}
            {activeSegment === 'intro1' && cursor}
          </span>
          {(introLine2.length > 0 || activeSegment === 'intro2' || activeSegment === 'body' || done) && (
            <>
              <br />
              <span>
                {introLine2}
                {activeSegment === 'intro2' && cursor}
              </span>
            </>
          )}
        </p>

        <h1 className="sr-only">
          Alok Kumar Singh — Computational Sciences, Machine Learning &amp; Data Analytics Portfolio
        </h1>

        <p
          aria-label={BODY_TEXT}
          className="mb-5 sm:mb-6 text-[clamp(18px,4vw,26px)] leading-[1.35] font-normal text-white min-h-[84px] sm:min-h-[106px]"
        >
          {body}
          {activeSegment === 'body' && cursor}
        </p>

        <div
          className={`flex flex-wrap gap-y-1 transition-all duration-[400ms] ease-out ${
            buttonsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          <a
            href={RESUME_DATA.projects[0].liveDemoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center text-white bg-transparent border border-white rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap hover:bg-white hover:text-black transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
          >
            Open ORCA Live ↗
          </a>

          <a
            href={RESUME_DATA.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center text-white bg-transparent border border-white rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap hover:bg-white hover:text-black transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
          >
            Open LinkedIn ↗
          </a>

          <a
            href={RESUME_DATA.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center text-white bg-transparent border border-white rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap hover:bg-white hover:text-black transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
          >
            GitHub ↗
          </a>

          <button
            type="button"
            onClick={() => onSelectSection('resume')}
            className="inline-flex items-center justify-center text-white bg-transparent border border-white rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap hover:bg-white hover:text-black transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
          >
            Resume &amp; Credentials
          </button>

          <button
            type="button"
            onClick={handleCopyEmail}
            aria-label={`Copy email address ${RESUME_DATA.email}`}
            className="inline-flex items-center justify-center gap-2 sm:gap-3 text-white bg-transparent border border-white rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap hover:bg-white hover:text-black transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
          >
            <span>
              {copied ? 'Copied: ' : 'Reach me: '}
              <span className="underline underline-offset-1">{RESUME_DATA.email}</span>
            </span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="shrink-0"
            >
              <rect
                x="4"
                y="4"
                width="6.5"
                height="6.5"
                rx="1"
                stroke="currentColor"
                strokeWidth="1.2"
              />
              <path
                d="M8 2.25V1.5C8 1.08579 7.66421 0.75 7.25 0.75H1.5C1.08579 0.75 0.75 1.08579 0.75 1.5V7.25C0.75 7.66421 1.08579 8 1.5 8H2.25"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </main>
  );
}
