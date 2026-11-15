export interface SkillGroup {
  category: string;
  items: string[];
}

export interface TechStackItem {
  id: 'python' | 'sql' | 'pytorch' | 'powerbi' | 'fastapi' | 'tensorflow' | 'react';
  name: string;
  proficiency: string;
  tooltip: string;
}

export interface ExperienceItem {
  role: string;
  organization: string;
  period: string;
  location: string;
  certificateNote: string;
  highlights: string[];
}

export interface AgentModule {
  name: string;
  responsibility: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  event: string;
  period: string;
  team: string;
  summary: string;
  agents: AgentModule[];
  orchestrator: string;
  stack: string[];
  architectureNote: string;
  liveDemoUrl: string;
  liveDemoLabel: string;
}

export interface EducationItem {
  degree: string;
  field: string;
  institution: string;
  period: string;
}

export interface CertificationItem {
  title: string;
  issuer: string;
  date: string;
  category: string;
  details?: string;
  credentialUrl?: string;
  documentImage?: string;
}

export interface ResumeData {
  name: string;
  brandName: string;
  headline: string;
  location: string;
  email: string;
  linkedinUrl: string;
  linkedinLabel: string;
  githubUrl: string;
  githubLabel: string;
  resumePdfPath: string;
  professionalSummary: string;
  techStack: TechStackItem[];
  skills: SkillGroup[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
}

export const RESUME_DATA: ResumeData = {
  name: 'Alok Kumar Singh',
  brandName: 'Alok Singh®',
  headline:
    'BCA (Hons.) Student | Computational Sciences | Python, SQL, Data Analytics & Machine Learning',
  location: 'Dhanbad–Ranchi Area, India',
  email: 'alokjan36@gmail.com',
  linkedinUrl: 'https://www.linkedin.com/in/alok-kumar-singh-708525345',
  linkedinLabel: 'linkedin.com/in/alok-kumar-singh-708525345',
  githubUrl: 'https://github.com/aloksingh70',
  githubLabel: 'github.com/aloksingh70',
  resumePdfPath: '/assets/aistudio/Alok_Kumar_Singh_ATS_Resume_88b54a88.pdf',
  professionalSummary:
    'BCA (Hons.) student in Computational Sciences at Brainware University with hands-on exposure to machine learning through an internship at FlyRank AI and project experience building ORCA, a multi-agent AI advisory system developed for Smart India Hackathon 2026. Familiar with Python, PyTorch, TensorFlow, SQL, statistical data analysis, Power BI, React, FastAPI and SQLAlchemy. Interested in applying programming, data analytics and AI/ML to practical problems.',
  techStack: [
    {
      id: 'python',
      name: 'Python',
      proficiency: 'Proficient',
      tooltip: 'ML pipelines, FastAPI APIs & multi-agent orchestration (FlyRank AI, ORCA).',
    },
    {
      id: 'sql',
      name: 'SQL',
      proficiency: 'Advanced',
      tooltip: 'Complex joins, window functions & RDBMS design (HackerRank SQL Advanced).',
    },
    {
      id: 'pytorch',
      name: 'PyTorch',
      proficiency: 'Intermediate',
      tooltip: 'Neural network modeling, tensor computation & ML experimentation.',
    },
    {
      id: 'tensorflow',
      name: 'TensorFlow',
      proficiency: 'Intermediate',
      tooltip: 'Deep learning workflows, model training & ML track experimentation.',
    },
    {
      id: 'fastapi',
      name: 'FastAPI',
      proficiency: 'Proficient',
      tooltip: 'Async REST APIs, Pydantic schemas & ORCA multi-agent orchestrator backend.',
    },
    {
      id: 'react',
      name: 'React',
      proficiency: 'Proficient',
      tooltip: 'Modular TypeScript UIs, interactive state & ORCA advisory frontend with Vite.',
    },
    {
      id: 'powerbi',
      name: 'Power BI',
      proficiency: 'Intermediate',
      tooltip: 'Interactive analytics dashboards & data modeling (Microsoft Certified).',
    },
  ],
  skills: [
    {
      category: 'Programming',
      items: ['Python', 'SQL', 'HTML', 'CSS'],
    },
    {
      category: 'AI & Machine Learning',
      items: ['Machine Learning', 'PyTorch', 'TensorFlow', 'Artificial Intelligence', 'Multi-Agent Systems'],
    },
    {
      category: 'Data Analytics',
      items: ['Statistical Data Analysis', 'Data Analytics', 'Microsoft Power BI'],
    },
    {
      category: 'Web & Backend',
      items: ['React.js', 'Vite', 'FastAPI', 'SQLAlchemy'],
    },
    {
      category: 'Databases',
      items: ['SQL', 'DBMS', 'RDBMS'],
    },
  ],
  experience: [
    {
      role: 'Machine Learning Intern',
      organization: 'FlyRank AI',
      period: 'Jun 2026 – Aug 2026',
      location: 'Remote',
      certificateNote:
        'Engagement Letter (Aug 15, 2026) & Internship Completion Confirmation (Aug 21, 2026) issued',
      highlights: [
        'Completed the Machine Learning track internship program at FlyRank Corp (FlyRank AI), fulfilling all sessions, practical assignments, and final internship project.',
      ],
    },
  ],
  projects: [
    {
      id: 'orca',
      title: 'ORCA – Multi-Agent AI Advisory System',
      event: 'Smart India Hackathon 2026 (SIH26176)',
      period: 'Aug 2026 – Sep 2026',
      team: 'Team Tech Titans',
      summary:
        'Built ORCA, a multi-agent AI advisory system for the Smart India Hackathon 2026 problem statement SIH26176, focused on helping fishers along the Bay of Bengal make more informed fishing decisions.',
      agents: [
        {
          name: 'Ocean Agent',
          responsibility: 'Interprets sea-surface temperature and chlorophyll indicators.',
        },
        {
          name: 'Weather Agent',
          responsibility: 'Assesses wind and wave-height conditions.',
        },
        {
          name: 'History Agent',
          responsibility: 'Considers seasonal catch records.',
        },
        {
          name: 'Sustainability Agent',
          responsibility:
            'Accounts for fishing-ban windows and protected areas; sustainability constraints act as a safety veto.',
        },
      ],
      orchestrator:
        'Implemented an orchestrator that combines agent outputs into a ranked, explainable recommendation with a plain-language reasoning trace; sustainability constraints act as a safety veto.',
      stack: ['React', 'Vite', 'FastAPI', 'SQLAlchemy'],
      architectureNote:
        'Deterministic simulation architecture designed to support later integration of real INCOIS/IMD/CMFRI data.',
      liveDemoUrl: 'https://orca-advisory.vercel.app',
      liveDemoLabel: 'orca-advisory.vercel.app',
    },
  ],
  education: [
    {
      degree: 'Bachelor of Computer Applications (Honours)',
      field: 'Computational Sciences',
      institution: 'Brainware University',
      period: 'Aug 2025 – Present',
    },
  ],
  certifications: [
    {
      title: 'Machine Learning Internship Completion Certificate',
      issuer: 'FlyRank AI',
      date: 'Aug 21, 2026',
      category: 'Internship Certificate',
      details:
        'Official Internship Completion Confirmation for fulfilling all Machine Learning track assignments and final project.',
      documentImage: '/assets/aistudio/image_e8efb74a.png',
    },
    {
      title: 'FlyRank AI Engagement Letter',
      issuer: 'FlyRank AI',
      date: 'Aug 15, 2026',
      category: 'Engagement Letter',
      details: 'Official engagement confirmation in the FlyRank AI Machine Learning Internship track.',
      documentImage: '/assets/aistudio/image_e86b62e8.png',
    },
    {
      title: 'Quantium – Data Analytics Job Simulation',
      issuer: 'Forage',
      date: 'Jun 2026',
      category: 'Job Simulation',
      details: 'Customer analytics, commercial insights, and retail data modeling simulation.',
      credentialUrl:
        'https://www.theforage.com/completion-certificates/32A6DqtsbF7LbKdcq/NkaC7knWtjSbi6aYv_32A6DqtsbF7LbKdcq_695267d339ff7eaad90d9cd0_1781142354626_completion_certificate.pdf?raw=1',
    },
    {
      title: 'Getting Started with Power BI',
      issuer: 'Microsoft',
      date: 'Jun 2026',
      category: 'Certification',
      details: 'Microsoft Learn credential covering Power BI reporting, data shaping, and visuals.',
      credentialUrl:
        'https://learn.microsoft.com/api/achievements/share/en-us/AlokSingh-6464/K9L36FEB?sharingId=19271554974C1F1B',
    },
    {
      title: 'Statement of Accomplishment',
      issuer: 'DataCamp',
      date: '2026',
      category: 'Course Certificate',
      details: 'Verified DataCamp course completion in Python, analytics, and data workflows.',
      credentialUrl:
        'https://www.datacamp.com/statement-of-accomplishment/course/c1ea5eba14e7724b7de4410a17bd8b776234f9f1?raw=1',
    },
    {
      title: 'The Future of Full Stack Development',
      issuer: 'HCL GUVI',
      date: 'Jan 2026',
      category: 'Certification',
      details: 'Certificate of completion covering modern full-stack web architecture.',
      credentialUrl: 'https://www.guvi.in/share-certificate/U361mj66w94q797E64',
    },
    {
      title: 'Deloitte Australia – Data Analytics Job Simulation',
      issuer: 'Forage',
      date: 'Dec 2025',
      category: 'Job Simulation',
      details: 'Practical data analysis and forensic dashboarding job simulation by Deloitte.',
      credentialUrl:
        'https://www.theforage.com/completion-certificates/9PBTqmSxAf6zZTseP/io9DzWKe3PTsiS6GG_9PBTqmSxAf6zZTseP_695267d339ff7eaad90d9cd0_1767012327414_completion_certificate.pdf?raw=1',
    },
    {
      title: 'SQL (Advanced)',
      issuer: 'HackerRank',
      date: 'Dec 2025',
      category: 'Certification',
      details: 'Skill certification verifying complex queries, window functions, and optimization.',
      credentialUrl: 'https://www.hackerrank.com/certificates/b4ea29501b55',
    },
  ],
};
