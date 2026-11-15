import { useState } from 'react';
import { RESUME_DATA } from '../data/resumeData';
import { NAV_SECTIONS, PortfolioSection } from '../utils/portfolioLogic';

interface NavbarProps {
  onSelectSection: (section: PortfolioSection) => void;
  onGoHome: () => void;
}

export function Navbar({ onSelectSection, onGoHome }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (section: PortfolioSection) => {
    setMobileMenuOpen(false);
    onSelectSection(section);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-10 flex w-full items-center justify-between px-5 py-4 sm:px-8 sm:py-5">
        <button
          type="button"
          onClick={() => {
            setMobileMenuOpen(false);
            onGoHome();
          }}
          className="flex items-center gap-3 text-left text-white cursor-pointer focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4"
          aria-label="Alok Singh Home"
        >
          <span className="text-[21px] sm:text-[26px] tracking-tight text-white [font-family:var(--font-heading)] whitespace-nowrap shrink-0">
            {RESUME_DATA.brandName}
          </span>
          <span
            aria-hidden="true"
            className="text-[25px] sm:text-[30px] text-white select-none tracking-[-0.02em] leading-none"
          >
            ✳︎
          </span>
        </button>

        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center text-[23px] text-white"
        >
          {NAV_SECTIONS.map((item, idx) => (
            <span key={item.key} className="inline-flex items-center">
              <button
                type="button"
                onClick={() => handleNavClick(item.key)}
                className="hover:opacity-60 transition-opacity whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4"
              >
                {item.label}
              </button>
              {idx < NAV_SECTIONS.length - 1 && (
                <span aria-hidden="true" className="select-none">
                  ,&nbsp;
                </span>
              )}
            </span>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => handleNavClick('contact')}
          className="hidden md:inline-block text-[23px] text-white underline underline-offset-2 hover:opacity-60 transition-opacity whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4"
        >
          Get in touch
        </button>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileMenuOpen}
          className="md:hidden relative z-10 flex flex-col justify-center items-center w-11 h-11 -mr-2 gap-[5px] cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
        >
          <span
            className={`block w-6 h-[2px] bg-white transition-all duration-300 ${
              mobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''
            }`}
          />
          <span
            className={`block w-6 h-[2px] bg-white transition-all duration-300 ${
              mobileMenuOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`block w-6 h-[2px] bg-white transition-all duration-300 ${
              mobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''
            }`}
          />
        </button>
      </header>

      <div
        aria-hidden={!mobileMenuOpen}
        className={`md:hidden fixed inset-0 z-[9] bg-black/95 backdrop-blur-md flex flex-col justify-center items-start px-8 gap-8 transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <nav aria-label="Mobile navigation" className="flex flex-col items-start gap-6">
          {NAV_SECTIONS.map((item) => (
            <button
              key={item.key}
              type="button"
              tabIndex={mobileMenuOpen ? 0 : -1}
              onClick={() => handleNavClick(item.key)}
              className="text-[32px] font-medium text-white hover:opacity-60 transition-opacity cursor-pointer text-left"
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            tabIndex={mobileMenuOpen ? 0 : -1}
            onClick={() => handleNavClick('contact')}
            className="text-[32px] font-medium text-white underline underline-offset-4 hover:opacity-60 transition-opacity cursor-pointer text-left mt-2"
          >
            Get in touch
          </button>
        </nav>
      </div>
    </>
  );
}
