# Alok Kumar Singh — Portfolio

<div align="center">

![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Motion](https://img.shields.io/badge/Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

**Computational Sciences | Machine Learning | Multi-Agent AI Systems | Data Analytics**

[Live Portfolio](https://github.com/aloksingh70/My-Portfolio) • [ORCA Live Demo](https://orca-advisory.vercel.app) • [LinkedIn](https://www.linkedin.com/in/alok-kumar-singh-708525345) • [GitHub](https://github.com/aloksingh70)

</div>

---

## 📌 Overview

This repository houses the personal portfolio and interactive dossier of **Alok Kumar Singh**, a BCA (Honours) Computational Sciences student at Brainware University. 

The website blends a modern **dark-mode aesthetic**, **cinematic video-scrubbing visuals**, **pure CSS/canvas kinetic fallbacks**, and a **modular sliding dossier drawer** designed to present projects, machine learning experience, technical proficiencies, verified credentials, and an ATS-formatted resume in an accessible format.

---

## 🚀 Key Highlights & Features

### 1. 🎥 Kinetic Pointer-Scrub Video & Canvas Fallback (`ScrubBackgroundVideo.tsx`)
- Dynamically scrubs and tilts a background video loop based on mouse pointer coordinates and velocity.
- Smooth spring-based easing with directional following.
- Automatic graceful fallback to a real-time HTML5 Canvas radial-gradient orbit animation if video loading is delayed or when the user prefers reduced motion (`prefers-reduced-motion: reduce`).

### 2. ⌨️ Interactive Typewriter Hero (`HeroSection.tsx`, `useTypewriter.ts`)
- Segment-aware multi-line typewriter animation introducing Alok's background and core pillars.
- Accessible layout with instantaneous button fade-ins and seamless screen-reader labels (`aria-label`, `.sr-only`).
- Quick navigation pills to open the ORCA demo, inspect credentials, or view the full dossier.

### 3. 📂 Sliding Portfolio Dossier with Hash Routing (`PortfolioDossier.tsx`, `portfolioLogic.ts`)
- Full-screen modular drawer supporting hash-based deep linking:
  - `#projects` — Featured projects & architecture breakdowns
  - `#experience` — Industry internship details & highlights
  - `#skills` — Interactive 7-card tech stack grid
  - `#credentials` — Verified certificates with full-screen document preview
  - `#resume` — In-browser readable ATS resume and direct PDF download
  - `#contact` — Accessible contact form and direct mailto link generator
- Deep links can be shared directly (e.g. `your-url.com/#credentials`) and synced with the browser's history API (`popstate` / `hashchange`).
- Accessible keyboard dismissal via the `Escape` key and focus trapping (`inert` background when open).

### 4. 🐋 Featured Spotlight: ORCA — Multi-Agent AI Advisory System
- **Event**: Smart India Hackathon 2026 (Problem Statement SIH26176)
- **Role**: Team Tech Titans
- **Stack**: React, Vite, FastAPI, SQLAlchemy
- **Architecture**: A deterministic multi-agent simulation orchestrator combining 4 specialized agents:
  1. **Ocean Agent**: Sea-surface temperature and chlorophyll indicators.
  2. **Weather Agent**: Wind speed and wave-height risk assessment.
  3. **History Agent**: Seasonal historical catch analysis.
  4. **Sustainability Agent**: Marine protected zones and seasonal fishing bans acting as a **safety veto**.
- [Explore the ORCA Live Demo ↗](https://orca-advisory.vercel.app)

### 5. 🛠️ Interactive Tech Stack Grid (`TechStackGrid.tsx`)
- Categorized cards for **Python**, **SQL**, **PyTorch**, **TensorFlow**, **FastAPI**, **React**, and **Power BI**.
- Contextual tooltips explaining real-world application across FlyRank AI, ORCA, and academic coursework.
- Visual proficiency indicators (Proficient, Advanced, Intermediate).

### 6. 📜 Credentials & Proof-of-Work Carousel (`CertificatesCarousel.tsx`)
- High-resolution certificates with full-screen modal preview:
  - **Machine Learning Track Internship Completion Certificate** — FlyRank AI (Aug 2026)
  - **FlyRank AI Official Engagement Letter** — FlyRank AI (Aug 2026)
  - **SQL (Advanced) Certification** — HackerRank (Dec 2025)
  - **Getting Started with Power BI** — Microsoft (Jun 2026)
  - **Quantium Data Analytics Job Simulation** — Forage (Jun 2026)
  - **Deloitte Australia Data Analytics Job Simulation** — Forage (Dec 2025)
  - **The Future of Full Stack Development** — HCL GUVI (Jan 2026)
  - **Statement of Accomplishment** — DataCamp (2026)

### 7. 📄 ATS-Compliant Resume Integration (`atsResumeHtml.ts`, `sync-ats-resume.ts`)
- Downloadable PDF resume stored in [`public/assets/aistudio/`](public/assets/aistudio/).
- Synchronized semantic HTML generator to maintain ATS-readability.

---

## 🏗️ Architecture & Tech Stack

| Layer | Technologies |
|---|---|
| **Framework & UI** | [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/) |
| **Styling & Design** | [Tailwind CSS v4](https://tailwindcss.com/), [Motion (Framer Motion)](https://motion.dev/) |
| **Build Tooling** | [Vite 8](https://vite.dev/), `@vitejs/plugin-react`, `@tailwindcss/vite` |
| **Icons & Assets** | [Lucide React](https://lucide.dev/), Custom Typography (Helvetica Now Display) |
| **Testing** | Node.js Test Runner (`node:test`, `node:assert/strict`), `tsx` |
| **Linting & Types** | `tsc --noEmit` |

---

## 📁 Repository Structure

```text
My-Portfolio/
├── .env.example             # Environment variable template
├── .gitignore               # Comprehensive Git ignore rules
├── index.html               # Main HTML entrypoint with metadata and typography
├── metadata.json            # AI Studio applet configuration and capabilities
├── package.json             # Project dependencies, scripts, and package metadata
├── README.md                # Comprehensive documentation
├── tsconfig.json            # TypeScript strict configuration
├── vite.config.ts           # Vite configuration with Tailwind CSS v4 & React plugins
├── public/
│   └── assets/
│       └── aistudio/        # Downloadable resume PDF & certificate preview images
├── scripts/
│   └── sync-ats-resume.ts   # Node script for exporting ATS-compatible resume HTML
└── src/
    ├── App.tsx              # Root application component orchestrating sections & modal
    ├── index.css            # Tailwind CSS v4 directives & root font-family tokens
    ├── main.tsx             # React DOM entrypoint
    ├── components/
    │   ├── CertificatesCarousel.tsx  # Carousel & modal preview for credentials
    │   ├── HeroSection.tsx           # Typewriter hero with interactive CTAs
    │   ├── Navbar.tsx                # Responsive header & mobile overlay menu
    │   ├── PortfolioDossier.tsx      # Multi-tab sliding dossier drawer
    │   ├── ScrubBackgroundVideo.tsx  # Pointer-driven video scrubber & canvas fallback
    │   └── TechStackGrid.tsx         # Interactive proficiency grid with tooltips
    ├── data/
    │   └── resumeData.ts             # Single source of truth for resume & project data
    ├── hooks/
    │   └── useTypewriter.ts          # Smooth typewriter effect hook
    └── utils/
        ├── atsResumeHtml.ts          # ATS resume HTML markup builder
        ├── portfolioLogic.ts         # Pure helper functions (routing, math, validation)
        └── portfolioLogic.test.ts    # Unit test suite verifying logic & data consistency
```

---

## 💻 Local Development

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9+), **pnpm**, or **yarn**

### 1. Clone the repository
```bash
git clone https://github.com/aloksingh70/My-Portfolio.git
cd My-Portfolio
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for production
```bash
npm run build
```
The optimized production bundle will be generated in the `dist/` directory.

### 5. Preview production build
```bash
npm run preview
```

### 6. Run unit tests
```bash
npm run test
```

### 7. Run type checking
```bash
npm run lint
```

---

## 🧪 Unit Tests

The test suite in [`src/utils/portfolioLogic.test.ts`](src/utils/portfolioLogic.test.ts) validates:
- **Video Scrubbing Math**: Safe clamping to durations, edge case Handling (`NaN`, zero-width viewports).
- **Typewriter Slicing**: Boundary safety and multi-segment line splits.
- **Form Validation**: Strict email format and length assertions.
- **Hash-Routing**: Proper parsing and URL generation for all 6 dossier tabs.
- **Data Integrity**: Consistency of contact links, credentials, and ORCA metadata.

---

## 👤 Author & Contact

**Alok Kumar Singh**  
*BCA (Honours) Student in Computational Sciences | Brainware University*  
*Dhanbad–Ranchi Area, India*

- **LinkedIn**: [linkedin.com/in/alok-kumar-singh-708525345](https://www.linkedin.com/in/alok-kumar-singh-708525345)
- **GitHub**: [github.com/aloksingh70](https://github.com/aloksingh70)
- **Email**: [alokjan36@gmail.com](mailto:alokjan36@gmail.com)
- **ORCA Advisory System**: [orca-advisory.vercel.app](https://orca-advisory.vercel.app)

---

## 📄 License

This project is personal and open-source under the [MIT License](LICENSE). Feel free to explore the code or use the design patterns for your own portfolio.
