export type PortfolioSection = 'projects' | 'experience' | 'skills' | 'credentials' | 'resume' | 'contact';

export const VALID_PORTFOLIO_SECTIONS: PortfolioSection[] = [
  'projects',
  'experience',
  'skills',
  'credentials',
  'resume',
  'contact',
];

export function parseSectionFromHash(hash: string): PortfolioSection | null {
  const normalized = hash.replace(/^#\/?/, '').trim().toLowerCase();
  if (!normalized) return null;
  return (VALID_PORTFOLIO_SECTIONS as string[]).includes(normalized)
    ? (normalized as PortfolioSection)
    : null;
}

export function buildSectionHash(section: PortfolioSection | null): string {
  return section ? `#${section}` : '';
}

export function buildShareableSectionUrl(
  currentUrl: string,
  section: PortfolioSection | null
): string {
  const base = currentUrl.split('#')[0];
  return `${base}${buildSectionHash(section)}`;
}

export const NAV_SECTIONS: { key: PortfolioSection; label: string }[] = [
  { key: 'projects', label: 'Projects' },
  { key: 'experience', label: 'Experience' },
  { key: 'skills', label: 'Skills' },
  { key: 'credentials', label: 'Credentials' },
];

export const SCRUB_SENSITIVITY = 0.8;

export function calculateScrubTime(params: {
  currentTarget: number;
  deltaX: number;
  viewportWidth: number;
  duration: number;
  sensitivity?: number;
}): number {
  const { currentTarget, deltaX, viewportWidth, duration, sensitivity = SCRUB_SENSITIVITY } = params;

  if (!Number.isFinite(duration) || duration <= 0 || !Number.isFinite(viewportWidth) || viewportWidth <= 0) {
    return 0;
  }

  const timeOffset = (deltaX / viewportWidth) * sensitivity * duration;
  const nextTime = currentTarget + timeOffset;
  return Math.min(duration, Math.max(0, nextTime));
}

export function getTypewriterSlice(text: string, index: number): { displayed: string; done: boolean } {
  const safeIndex = Math.max(0, Math.min(text.length, Math.floor(index)));
  return {
    displayed: text.slice(0, safeIndex),
    done: safeIndex >= text.length,
  };
}

export interface MergedTypewriterParts {
  introLine1: string;
  introLine2: string;
  body: string;
  activeSegment: 'intro1' | 'intro2' | 'body' | 'none';
}

export function getMergedTypewriterParts(
  displayed: string,
  done: boolean,
  segments: { introLine1: string; introLine2: string; body: string }
): MergedTypewriterParts {
  const l1Len = segments.introLine1.length;
  const l2Len = segments.introLine2.length;
  const sep1End = l1Len + 1; // '\n'
  const sep2Start = sep1End + l2Len;
  const sep2End = sep2Start + 1; // '\n'

  const len = displayed.length;
  const introLine1 = displayed.slice(0, Math.min(len, l1Len));
  const introLine2 = len > sep1End ? displayed.slice(sep1End, Math.min(len, sep2Start)) : '';
  const body = len > sep2End ? displayed.slice(sep2End) : '';

  let activeSegment: MergedTypewriterParts['activeSegment'] = 'none';
  if (!done) {
    if (len <= l1Len) {
      activeSegment = 'intro1';
    } else if (len <= sep2Start) {
      activeSegment = 'intro2';
    } else {
      activeSegment = 'body';
    }
  }

  return { introLine1, introLine2, body, activeSegment };
}

export function buildMailtoHref(params: {
  recipient: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
}): string {
  const { recipient, senderName, senderEmail, subject, message } = params;
  const body = `From: ${senderName.trim()} (${senderEmail.trim()})\n\n${message.trim()}`;
  const query = new URLSearchParams({
    subject: subject.trim() || 'Portfolio Inquiry',
    body,
  });
  return `mailto:${recipient}?${query.toString()}`;
}

export interface DirectionalFollow {
  nx: number;
  ny: number;
  translateX: number;
  translateY: number;
  rotateX: number;
  rotateY: number;
}

export function calculateDirectionalFollow(params: {
  clientX: number;
  clientY: number;
  viewportWidth: number;
  viewportHeight: number;
}): DirectionalFollow {
  const { clientX, clientY, viewportWidth, viewportHeight } = params;
  if (
    !Number.isFinite(viewportWidth) ||
    viewportWidth <= 0 ||
    !Number.isFinite(viewportHeight) ||
    viewportHeight <= 0
  ) {
    return { nx: 0, ny: 0, translateX: 0, translateY: 0, rotateX: 0, rotateY: 0 };
  }

  const nx = Math.min(1, Math.max(-1, (clientX / viewportWidth - 0.5) * 2));
  const ny = Math.min(1, Math.max(-1, (clientY / viewportHeight - 0.5) * 2));

  return {
    nx,
    ny,
    translateX: nx * 24,
    translateY: ny * 22,
    rotateX: -ny * 7,
    rotateY: nx * 7,
  };
}

export function validateContactInput(params: {
  senderName: string;
  senderEmail: string;
  message: string;
}): string | null {
  if (!params.senderName.trim()) {
    return 'Please enter your name.';
  }
  const email = params.senderEmail.trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Please enter a valid email address.';
  }
  if (params.message.trim().length < 10) {
    return 'Please write a short message (at least 10 characters).';
  }
  return null;
}

export type CertificateFilter = 'all' | 'internship' | 'simulation' | 'course';

export function filterCertificates<T extends { category: string }>(
  certificates: T[],
  filter: CertificateFilter
): T[] {
  if (filter === 'all') return certificates;
  if (filter === 'internship') {
    return certificates.filter(
      (c) => c.category === 'Internship Certificate' || c.category === 'Engagement Letter'
    );
  }
  if (filter === 'simulation') {
    return certificates.filter((c) => c.category === 'Job Simulation');
  }
  return certificates.filter(
    (c) => c.category === 'Certification' || c.category === 'Course Certificate'
  );
}

export function getCarouselScrollDelta(
  direction: 'prev' | 'next',
  cardStepPx = 350
): number {
  const safeStep = Number.isFinite(cardStepPx) && cardStepPx > 0 ? cardStepPx : 350;
  return direction === 'next' ? safeStep : -safeStep;
}
