import { useCallback, useEffect, useState } from 'react';
import { HeroSection } from './components/HeroSection';
import { Navbar } from './components/Navbar';
import { PortfolioDossier } from './components/PortfolioDossier';
import { ScrubBackgroundVideo } from './components/ScrubBackgroundVideo';
import {
  buildSectionHash,
  parseSectionFromHash,
  PortfolioSection,
} from './utils/portfolioLogic';

export default function App() {
  const [activeSection, setActiveSection] = useState<PortfolioSection | null>(() => {
    if (typeof window === 'undefined') return null;
    return parseSectionFromHash(window.location.hash);
  });

  const navigateSection = useCallback((section: PortfolioSection | null) => {
    setActiveSection(section);
    if (typeof window === 'undefined') return;

    const nextHash = buildSectionHash(section);
    if (window.location.hash !== nextHash) {
      const nextUrl = nextHash
        ? `${window.location.pathname}${window.location.search}${nextHash}`
        : `${window.location.pathname}${window.location.search}`;
      window.history.pushState(null, '', nextUrl);
    }
  }, []);

  useEffect(() => {
    const syncFromHash = () => {
      setActiveSection(parseSectionFromHash(window.location.hash));
    };

    window.addEventListener('hashchange', syncFromHash);
    window.addEventListener('popstate', syncFromHash);
    return () => {
      window.removeEventListener('hashchange', syncFromHash);
      window.removeEventListener('popstate', syncFromHash);
    };
  }, []);

  const isModalOpen = activeSection !== null;

  return (
    <div className="relative min-h-screen w-full bg-black text-white">
      <ScrubBackgroundVideo />
      <div aria-hidden={isModalOpen} inert={isModalOpen ? true : undefined}>
        <Navbar
          onSelectSection={(section) => navigateSection(section)}
          onGoHome={() => navigateSection(null)}
        />
        <HeroSection onSelectSection={(section) => navigateSection(section)} />
      </div>
      <PortfolioDossier
        activeSection={activeSection}
        onChangeSection={(section) => navigateSection(section)}
        onClose={() => navigateSection(null)}
      />
    </div>
  );
}
