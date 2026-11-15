import { FormEvent, useEffect, useRef, useState } from 'react';
import { motion, MotionConfig } from 'motion/react';
import { ArrowUpRight, Check, Copy, ExternalLink, FileText, Link2, X } from 'lucide-react';
import { CertificationItem, RESUME_DATA } from '../data/resumeData';
import {
  buildMailtoHref,
  buildShareableSectionUrl,
  PortfolioSection,
  validateContactInput,
} from '../utils/portfolioLogic';
import { CertificatesCarousel } from './CertificatesCarousel';
import { TechStackGrid } from './TechStackGrid';

interface PortfolioDossierProps {
  activeSection: PortfolioSection | null;
  onChangeSection: (section: PortfolioSection) => void;
  onClose: () => void;
}

const DOSSIER_TABS: { key: PortfolioSection; label: string }[] = [
  { key: 'projects', label: 'Projects' },
  { key: 'experience', label: 'Experience' },
  { key: 'skills', label: 'Skills' },
  { key: 'credentials', label: 'Credentials' },
  { key: 'resume', label: 'Full Resume' },
  { key: 'contact', label: 'Contact' },
];

export function PortfolioDossier({
  activeSection,
  onChangeSection,
  onClose,
}: PortfolioDossierProps) {
  const dossierScrollRef = useRef<HTMLDivElement | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedSectionLink, setCopiedSectionLink] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<CertificationItem | null>(null);
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedHref, setSubmittedHref] = useState<string | null>(null);

  useEffect(() => {
    if (!activeSection) return;
    if (dossierScrollRef.current) {
      dossierScrollRef.current.scrollTop = 0;
    }
  }, [activeSection]);

  useEffect(() => {
    if (!activeSection) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (previewDoc) {
          setPreviewDoc(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSection, onClose, previewDoc]);

  if (!activeSection) return null;

  const handleCopyEmail = async () => {
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(RESUME_DATA.email);
      }
      setCopiedEmail(true);
    } catch {
      setCopiedEmail(true);
    }
    window.setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopySectionLink = async () => {
    const shareUrl = buildShareableSectionUrl(window.location.href, activeSection);
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(shareUrl);
      }
      setCopiedSectionLink(true);
    } catch {
      setCopiedSectionLink(true);
    }
    window.setTimeout(() => setCopiedSectionLink(false), 2000);
  };

  const handleSubmitContact = (event: FormEvent) => {
    event.preventDefault();
    const error = validateContactInput({ senderName, senderEmail, message });
    if (error) {
      setFormError(error);
      setSubmittedHref(null);
      return;
    }
    setFormError(null);
    const href = buildMailtoHref({
      recipient: RESUME_DATA.email,
      senderName,
      senderEmail,
      subject,
      message,
    });
    setSubmittedHref(href);
  };

  const internshipCert = RESUME_DATA.certifications.find(
    (c) => c.title === 'Machine Learning Internship Completion Certificate'
  );
  const engagementLetter = RESUME_DATA.certifications.find(
    (c) => c.title === 'FlyRank AI Engagement Letter'
  );

  return (
    <MotionConfig reducedMotion="user">
      <div
        ref={dossierScrollRef}
        role="dialog"
        aria-modal="true"
        aria-label="Alok Kumar Singh Portfolio Dossier"
        className="fixed inset-0 z-20 overflow-y-auto bg-black/92 backdrop-blur-xl text-white"
      >
      <div className="mx-auto max-w-5xl px-5 py-5 sm:px-8 sm:py-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-4">
          <div>
            <p className="text-xl sm:text-2xl tracking-tight text-white [font-family:var(--font-heading)]">
              {RESUME_DATA.name}
            </p>
            <p className="mt-1 text-sm text-white/70">
              {RESUME_DATA.location} · Brainware University · BCA (Hons.) Computational Sciences
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCopySectionLink}
              aria-label={`Copy shareable link for ${activeSection} section`}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/25 px-3.5 py-1.5 text-xs text-white/90 hover:bg-white hover:text-black transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {copiedSectionLink ? (
                <>
                  <Check className="h-3 w-3" aria-hidden="true" />
                  <span>Link Copied</span>
                </>
              ) : (
                <>
                  <Link2 className="h-3 w-3" aria-hidden="true" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
            <a
              href={RESUME_DATA.projects[0].liveDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/25 px-3.5 py-1.5 text-xs text-white/90 hover:bg-white hover:text-black transition-colors whitespace-nowrap shrink-0"
            >
              <span>ORCA Live</span>
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
            <a
              href={RESUME_DATA.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/25 px-3.5 py-1.5 text-xs text-white/90 hover:bg-white hover:text-black transition-colors whitespace-nowrap shrink-0"
            >
              <span>LinkedIn</span>
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
            <a
              href={RESUME_DATA.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/25 px-3.5 py-1.5 text-xs text-white/90 hover:bg-white hover:text-black transition-colors whitespace-nowrap shrink-0"
            >
              <span>GitHub</span>
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close portfolio dossier"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-1.5 text-sm text-white hover:bg-white hover:text-black transition-colors duration-200 cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>Close</span>
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <nav
          aria-label="Portfolio sections"
          className="mt-4 flex flex-wrap items-center gap-2 border-b border-white/15 pb-3.5"
        >
          {DOSSIER_TABS.map((tab) => {
            const isActive = activeSection === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onChangeSection(tab.key)}
                className={`rounded-full px-4 py-1.5 text-sm transition-colors duration-200 whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-white text-black'
                    : 'bg-white/5 text-white/80 hover:bg-white/15 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div className="py-6">
          {activeSection === 'projects' && (
            <section aria-labelledby="projects-heading" className="space-y-6">
              {RESUME_DATA.projects.map((project) => (
                <article key={project.id} className="space-y-6">
                  <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between border-b border-white/15 pb-5">
                    <div className="space-y-1.5 max-w-2xl">
                      <p className="text-sm text-white/65">
                        {project.event} · {project.period} · {project.team}
                      </p>
                      <h2
                        id="projects-heading"
                        className="text-2xl sm:text-4xl tracking-tight text-white [font-family:var(--font-heading)] text-balance"
                      >
                        {project.title}
                      </h2>
                    </div>

                    <a
                      href={project.liveDemoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-white text-black px-5 py-2 text-sm hover:bg-white/85 transition-colors whitespace-nowrap shrink-0 self-start md:self-auto"
                    >
                      <span>Live Demo: {project.liveDemoLabel}</span>
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </div>

                  <p className="text-base leading-relaxed text-white/85 max-w-3xl">
                    {project.summary}
                  </p>

                  <div>
                    <h3 className="text-sm font-medium text-white/70 mb-3">
                      Multi-Agent System Architecture
                    </h3>
                    <div className="grid gap-3.5 sm:grid-cols-2">
                      {project.agents.map((agent, index) => (
                        <div
                          key={agent.name}
                          className="border border-white/15 bg-white/[0.03] p-4 space-y-1.5"
                        >
                          <p className="text-xs text-white/55 tabular-nums">
                            0{index + 1}. Agent Module
                          </p>
                          <h4 className="text-lg text-white [font-family:var(--font-heading)]">
                            {agent.name}
                          </h4>
                          <p className="text-sm leading-relaxed text-white/75">
                            {agent.responsibility}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2 border-t border-white/15 pt-5">
                    <div className="space-y-1.5">
                      <h3 className="text-base font-medium text-white">
                        Orchestrator &amp; Safety Veto
                      </h3>
                      <p className="text-sm leading-relaxed text-white/75">
                        {project.orchestrator}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-base font-medium text-white">
                        Technology Stack &amp; Simulation
                      </h3>
                      <p className="text-sm text-white/90">{project.stack.join(' · ')}</p>
                      <p className="text-sm leading-relaxed text-white/70">
                        {project.architectureNote}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          )}

          {activeSection === 'experience' && (
            <section aria-labelledby="experience-heading" className="space-y-8">
              <div className="space-y-3 border-b border-white/15 pb-6">
                <h2
                  id="experience-heading"
                  className="text-2xl sm:text-3xl tracking-tight text-white [font-family:var(--font-heading)]"
                >
                  Experience &amp; Academic Background
                </h2>
                <p className="text-base leading-relaxed text-white/80 max-w-3xl">
                  {RESUME_DATA.professionalSummary}
                </p>
              </div>

              <div className="space-y-5">
                <h3 className="text-sm text-white/60">Work Experience &amp; Internship Documents</h3>
                {RESUME_DATA.experience.map((exp) => (
                  <div
                    key={`${exp.role}-${exp.organization}`}
                    className="border border-white/15 bg-white/[0.03] p-6 space-y-4"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h4 className="text-xl text-white [font-family:var(--font-heading)]">
                        {exp.role} — {exp.organization}
                      </h4>
                      <span className="text-sm text-white/65 tabular-nums">
                        {exp.period} · {exp.location}
                      </span>
                    </div>
                    <p className="text-xs text-white/60">{exp.certificateNote}</p>
                    <ul className="space-y-2 text-sm leading-relaxed text-white/80">
                      {exp.highlights.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-3 pt-1">
                      {internshipCert && (
                        <button
                          type="button"
                          onClick={() => setPreviewDoc(internshipCert)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-white text-black px-4 py-1.5 text-xs hover:bg-white/85 transition-colors cursor-pointer"
                        >
                          <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>View Completion Certificate</span>
                        </button>
                      )}
                      {engagementLetter && (
                        <button
                          type="button"
                          onClick={() => setPreviewDoc(engagementLetter)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-white/30 px-4 py-1.5 text-xs text-white hover:bg-white hover:text-black transition-colors cursor-pointer"
                        >
                          <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>View Engagement Letter</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 border-t border-white/15 pt-6">
                <h3 className="text-sm text-white/60">Education</h3>
                {RESUME_DATA.education.map((edu) => (
                  <div
                    key={edu.degree}
                    className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 border border-white/15 bg-white/[0.03] p-6"
                  >
                    <div>
                      <h4 className="text-xl text-white [font-family:var(--font-heading)]">
                        {edu.degree}
                      </h4>
                      <p className="mt-1 text-sm text-white/75">
                        {edu.field} · {edu.institution}
                      </p>
                    </div>
                    <span className="text-sm text-white/65 tabular-nums shrink-0">
                      {edu.period}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeSection === 'skills' && (
            <section aria-labelledby="skills-heading" className="space-y-8">
              <div className="border-b border-white/15 pb-5">
                <h2
                  id="skills-heading"
                  className="text-2xl sm:text-3xl tracking-tight text-white [font-family:var(--font-heading)]"
                >
                  Technical Skills &amp; Core Competencies
                </h2>
                <p className="mt-2 text-sm text-white/70">
                  Programming, Machine Learning, Multi-Agent Systems, Statistical Data Analysis, and Full-Stack Development.
                </p>
              </div>

              <TechStackGrid items={RESUME_DATA.techStack} scrollRootRef={dossierScrollRef} />

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.12, root: dossierScrollRef }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="divide-y divide-white/15 border-t border-b border-white/15"
              >
                {RESUME_DATA.skills.map((group, index) => (
                  <div
                    key={group.category}
                    className="py-4 grid gap-2 sm:grid-cols-[240px_1fr] sm:items-baseline"
                  >
                    <p className="text-sm text-white/65 tabular-nums">
                      0{index + 1}. {group.category}
                    </p>
                    <p className="text-base sm:text-lg text-white leading-relaxed">
                      {group.items.join(' · ')}
                    </p>
                  </div>
                ))}
              </motion.div>
            </section>
          )}

          {activeSection === 'credentials' && (
            <section aria-labelledby="credentials-heading" className="space-y-6">
              <div className="border-b border-white/15 pb-5">
                <h2
                  id="credentials-heading"
                  className="text-2xl sm:text-3xl tracking-tight text-white [font-family:var(--font-heading)]"
                >
                  Internship Certificate, Certifications &amp; Credentials
                </h2>
                <p className="mt-2 text-sm text-white/70">
                  Scroll horizontally to explore internship documents and verified course certificates from FlyRank AI, Microsoft, DataCamp, Forage, HCL GUVI, and HackerRank.
                </p>
              </div>

              <CertificatesCarousel
                certificates={RESUME_DATA.certifications}
                onPreviewDocument={(cert) => setPreviewDoc(cert)}
                scrollRootRef={dossierScrollRef}
              />
            </section>
          )}

          {activeSection === 'resume' && (
            <section aria-labelledby="resume-heading" className="space-y-7">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/15 pb-5">
                <div>
                  <h2
                    id="resume-heading"
                    className="text-2xl sm:text-3xl tracking-tight text-white [font-family:var(--font-heading)]"
                  >
                    {RESUME_DATA.name} — Curriculum Vitae
                  </h2>
                  <p className="mt-1 text-sm text-white/70">{RESUME_DATA.headline}</p>
                  <p className="mt-1.5 text-xs text-white/65">
                    {RESUME_DATA.email} ·{' '}
                    <a
                      href={RESUME_DATA.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 hover:text-white"
                    >
                      LinkedIn
                    </a>{' '}
                    ·{' '}
                    <a
                      href={RESUME_DATA.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 hover:text-white"
                    >
                      GitHub
                    </a>{' '}
                    ·{' '}
                    <a
                      href={RESUME_DATA.projects[0].liveDemoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 hover:text-white"
                    >
                      ORCA Live Demo
                    </a>
                  </p>
                </div>

                <a
                  href={RESUME_DATA.resumePdfPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-white text-black px-5 py-2 text-sm hover:bg-white/85 transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto"
                >
                  <FileText className="h-4 w-4" aria-hidden="true" />
                  <span>Open ATS Resume PDF</span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>

              <div className="space-y-7 text-sm leading-relaxed text-white/85">
                <div className="space-y-2">
                  <h3 className="text-base text-white [font-family:var(--font-heading)]">
                    Professional Summary
                  </h3>
                  <p>{RESUME_DATA.professionalSummary}</p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.12, root: dossierScrollRef }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-5 border-t border-white/15 pt-5"
                >
                  <TechStackGrid items={RESUME_DATA.techStack} scrollRootRef={dossierScrollRef} />

                  <div className="space-y-2">
                    <h3 className="text-base text-white [font-family:var(--font-heading)]">
                      Technical Skills
                    </h3>
                    <div className="space-y-1.5">
                      {RESUME_DATA.skills.map((group) => (
                        <p key={group.category}>
                          <span className="text-white">{group.category}:</span>{' '}
                          <span className="text-white/75">{group.items.join(', ')}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                </motion.div>

                <div className="space-y-3 border-t border-white/15 pt-5">
                  <h3 className="text-base text-white [font-family:var(--font-heading)]">
                    Experience
                  </h3>
                  {RESUME_DATA.experience.map((exp) => (
                    <div key={exp.role} className="space-y-1">
                      <p className="text-white">
                        {exp.role} | {exp.organization} · {exp.period} ({exp.location})
                      </p>
                      <p className="text-white/75">{exp.highlights[0]}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 border-t border-white/15 pt-5">
                  <h3 className="text-base text-white [font-family:var(--font-heading)]">
                    Projects
                  </h3>
                  {RESUME_DATA.projects.map((project) => (
                    <div key={project.id} className="space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-white">
                          {project.title} | {project.event} · {project.period} · {project.team}
                        </p>
                        <a
                          href={project.liveDemoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-white underline underline-offset-2 hover:opacity-75"
                        >
                          <span>{project.liveDemoLabel}</span>
                          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        </a>
                      </div>
                      <p className="text-white/75">{project.summary}</p>
                      <ul className="list-disc pl-5 space-y-1 text-white/75">
                        {project.agents.map((agent) => (
                          <li key={agent.name}>
                            <span className="text-white">{agent.name}:</span> {agent.responsibility}
                          </li>
                        ))}
                        <li>{project.orchestrator}</li>
                        <li>
                          Stack: {project.stack.join(', ')}. {project.architectureNote}
                        </li>
                      </ul>
                    </div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.12, root: dossierScrollRef }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-5 border-t border-white/15 pt-5"
                >
                  <div className="space-y-2">
                    <h3 className="text-base text-white [font-family:var(--font-heading)]">
                      Education
                    </h3>
                    {RESUME_DATA.education.map((edu) => (
                      <div key={edu.degree}>
                        <p className="text-white">
                          {edu.degree}, {edu.field}
                        </p>
                        <p className="text-white/75">
                          {edu.institution} · {edu.period}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-base text-white [font-family:var(--font-heading)]">
                      Credentials &amp; Certificates
                    </h3>
                    <CertificatesCarousel
                      certificates={RESUME_DATA.certifications}
                      onPreviewDocument={(cert) => setPreviewDoc(cert)}
                      scrollRootRef={dossierScrollRef}
                    />
                  </div>
                </motion.div>
              </div>
            </section>
          )}

          {activeSection === 'contact' && (
            <section aria-labelledby="contact-heading" className="grid gap-10 md:grid-cols-2">
              <div className="space-y-6">
                <div>
                  <h2
                    id="contact-heading"
                    className="text-2xl sm:text-3xl tracking-tight text-white [font-family:var(--font-heading)]"
                  >
                    Get in touch
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-white/75">
                    Open to internships, data analytics collaborations, and machine learning or multi-agent AI engineering roles.
                  </p>
                </div>

                <div className="space-y-4 border-t border-white/15 pt-5 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-white/55">Email</p>
                      <a
                        href={`mailto:${RESUME_DATA.email}`}
                        className="text-white underline underline-offset-4 hover:opacity-75"
                      >
                        {RESUME_DATA.email}
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-1.5 text-xs text-white hover:bg-white hover:text-black transition-colors cursor-pointer"
                    >
                      {copiedEmail ? (
                        <>
                          <Check className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Copy Email</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div>
                    <p className="text-white/55">LinkedIn</p>
                    <a
                      href={RESUME_DATA.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-white underline underline-offset-4 hover:opacity-75"
                    >
                      <span>{RESUME_DATA.linkedinLabel}</span>
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </div>

                  <div>
                    <p className="text-white/55">GitHub</p>
                    <a
                      href={RESUME_DATA.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-white underline underline-offset-4 hover:opacity-75"
                    >
                      <span>{RESUME_DATA.githubLabel}</span>
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </div>

                  <div>
                    <p className="text-white/55">Location</p>
                    <p className="text-white">{RESUME_DATA.location}</p>
                  </div>
                </div>
              </div>

              <form
                onSubmit={handleSubmitContact}
                noValidate
                className="space-y-4 border border-white/15 bg-white/[0.03] p-6"
              >
                <h3 className="text-lg text-white [font-family:var(--font-heading)]">
                  Send a direct inquiry
                </h3>

                <div className="space-y-1.5">
                  <label htmlFor="contact-name" className="block text-xs text-white/70">
                    Your Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Alex Sharma"
                    className="w-full border border-white/25 bg-black/60 px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-email" className="block text-xs text-white/70">
                    Your Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    placeholder="alex@organization.com"
                    className="w-full border border-white/25 bg-black/60 px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-subject" className="block text-xs text-white/70">
                    Subject (Optional)
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Internship / Collaboration Inquiry"
                    className="w-full border border-white/25 bg-black/60 px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-message" className="block text-xs text-white/70">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share details about the role, project, or collaboration..."
                    className="w-full border border-white/25 bg-black/60 px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-white focus:outline-none"
                  />
                </div>

                {formError && (
                  <p role="alert" className="text-sm text-red-300">
                    {formError}
                  </p>
                )}

                {submittedHref && (
                  <div className="border border-white/25 bg-white/10 p-3 text-sm text-white space-y-2">
                    <p>Message prepared for {RESUME_DATA.email}.</p>
                    <a
                      href={submittedHref}
                      className="inline-flex items-center gap-1.5 underline underline-offset-4 hover:opacity-80"
                    >
                      <span>Open in Mail Client</span>
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </div>
                )}

                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-white text-black px-6 py-2.5 text-sm hover:bg-white/85 transition-colors cursor-pointer"
                >
                  Prepare Email Message
                </button>
              </form>
            </section>
          )}
        </div>
      </div>

      {previewDoc && previewDoc.documentImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={previewDoc.title}
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/90 p-4 sm:p-8"
          onClick={() => setPreviewDoc(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-3xl overflow-auto border border-white/20 bg-zinc-950 p-4 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between gap-4 border-b border-white/15 pb-3">
              <div>
                <h3 className="text-lg text-white [font-family:var(--font-heading)]">
                  {previewDoc.title}
                </h3>
                <p className="text-xs text-white/65">
                  {previewDoc.issuer} · {previewDoc.date}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                aria-label="Close document preview"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/30 px-3.5 py-1.5 text-xs text-white hover:bg-white hover:text-black transition-colors cursor-pointer"
              >
                <span>Close</span>
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
            <img
              src={previewDoc.documentImage}
              alt={previewDoc.title}
              referrerPolicy="no-referrer"
              className="mx-auto max-h-[74vh] w-auto object-contain bg-white"
            />
          </div>
        </div>
      )}
      </div>
    </MotionConfig>
  );
}
