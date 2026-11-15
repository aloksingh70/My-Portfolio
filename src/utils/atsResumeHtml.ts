import { ResumeData } from '../data/resumeData';

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function buildAtsResumeHtml(data: ResumeData): string {
  const skillsHtml = data.skills
    .map(
      (group) =>
        `<p class="skill-row"><strong>${escapeHtml(group.category)}:</strong> ${escapeHtml(
          group.items.join(', ')
        )}</p>`
    )
    .join('\n');

  const experienceHtml = data.experience
    .map(
      (exp) => `
      <div class="block">
        <div class="row-head">
          <strong>${escapeHtml(exp.role)} | ${escapeHtml(exp.organization)}</strong>
          <span class="meta">${escapeHtml(exp.period)} | ${escapeHtml(exp.location)}</span>
        </div>
        <ul>
          ${exp.highlights.map((h) => `<li>${escapeHtml(h)}</li>`).join('')}
          <li>${escapeHtml(exp.certificateNote)}.</li>
        </ul>
      </div>`
    )
    .join('\n');

  const projectsHtml = data.projects
    .map(
      (project) => `
      <div class="block">
        <div class="row-head">
          <strong>${escapeHtml(project.title)} | ${escapeHtml(project.event)}</strong>
          <span class="meta">${escapeHtml(project.period)} | ${escapeHtml(project.team)}</span>
        </div>
        <ul>
          <li>${escapeHtml(project.summary)}</li>
          <li>Designed ${project.agents
            .map((a) => {
              const article = /^[aeiou]/i.test(a.name) ? 'an' : 'a';
              const desc = a.responsibility.replace(/\.$/, '');
              const lowerDesc = desc.charAt(0).toLowerCase() + desc.slice(1);
              return `${article} ${escapeHtml(a.name)} (${escapeHtml(lowerDesc)})`;
            })
            .join(', ')}.</li>
          <li>${escapeHtml(project.orchestrator)}</li>
          <li>Technology stack: ${escapeHtml(project.stack.join(', '))}. ${escapeHtml(
            project.architectureNote
          )}</li>
          <li>Live demo: <a href="${escapeHtml(project.liveDemoUrl)}">${escapeHtml(
            project.liveDemoLabel
          )}</a></li>
        </ul>
      </div>`
    )
    .join('\n');

  const educationHtml = data.education
    .map(
      (edu) => `
      <div class="row-head">
        <strong>${escapeHtml(edu.degree)}, ${escapeHtml(edu.field)} | ${escapeHtml(
          edu.institution
        )}</strong>
        <span class="meta">${escapeHtml(edu.period)}</span>
      </div>`
    )
    .join('\n');

  const certsHtml = data.certifications
    .map(
      (cert) =>
        `<p class="cert-row"><strong>${escapeHtml(cert.title)}</strong> &mdash; ${escapeHtml(
          cert.issuer
        )} (${escapeHtml(cert.date)})</p>`
    )
    .join('\n');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>${escapeHtml(data.name)} - ATS Resume</title>
    <style>
      @page {
        size: letter;
        margin: 0.4in 0.48in;
      }
      * {
        box-sizing: border-box;
      }
      body {
        margin: 0;
        font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
        color: #1a202c;
        font-size: 9.5pt;
        line-height: 1.34;
        background: #ffffff;
      }
      a {
        color: #163a5f;
        text-decoration: none;
      }
      .header {
        text-align: center;
        margin-bottom: 10px;
      }
      .name {
        margin: 0;
        font-size: 19pt;
        font-weight: 700;
        letter-spacing: 0.4px;
        color: #163a5f;
      }
      .headline {
        margin: 2px 0;
        font-size: 9.5pt;
        font-weight: 700;
        color: #2d3748;
      }
      .contact-line {
        margin: 2px 0 0;
        font-size: 8.3pt;
        color: #334155;
        white-space: nowrap;
      }
      h2 {
        margin: 9px 0 5px;
        padding-bottom: 2px;
        border-bottom: 1.2px solid #163a5f;
        font-size: 10pt;
        font-weight: 700;
        letter-spacing: 0.4px;
        text-transform: uppercase;
        color: #163a5f;
      }
      p {
        margin: 0 0 4px;
      }
      .skill-row,
      .cert-row {
        margin: 0 0 3px;
      }
      .row-head {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 12px;
        margin-bottom: 2px;
      }
      .meta {
        font-style: italic;
        font-size: 9pt;
        color: #334155;
        white-space: nowrap;
      }
      ul {
        margin: 2px 0 5px 16px;
        padding: 0;
      }
      li {
        margin-bottom: 2.5px;
      }
    </style>
  </head>
  <body>
    <header class="header">
      <h1 class="name">${escapeHtml(data.name.toUpperCase())}</h1>
      <p class="headline">${escapeHtml(data.headline)}</p>
      <p class="contact-line">
        ${escapeHtml(data.location)} |
        <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a> |
        LinkedIn: <a href="${escapeHtml(data.linkedinUrl)}">${escapeHtml(data.linkedinLabel)}</a> |
        GitHub: <a href="${escapeHtml(data.githubUrl)}">${escapeHtml(data.githubLabel)}</a>
      </p>
    </header>

    <section>
      <h2>Professional Summary</h2>
      <p>${escapeHtml(data.professionalSummary)}</p>
    </section>

    <section>
      <h2>Technical Skills</h2>
      ${skillsHtml}
    </section>

    <section>
      <h2>Experience</h2>
      ${experienceHtml}
    </section>

    <section>
      <h2>Projects</h2>
      ${projectsHtml}
    </section>

    <section>
      <h2>Education</h2>
      ${educationHtml}
    </section>

    <section>
      <h2>Certifications &amp; Professional Development</h2>
      ${certsHtml}
    </section>
  </body>
</html>`;
}
