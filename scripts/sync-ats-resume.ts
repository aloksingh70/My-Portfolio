import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { RESUME_DATA } from '../src/data/resumeData';
import { buildAtsResumeHtml } from '../src/utils/atsResumeHtml';

const outArg = process.argv[2] || '.playwright-cli/ats-resume.html';
const outPath = resolve(process.cwd(), outArg);
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, buildAtsResumeHtml(RESUME_DATA), 'utf8');
console.log(`Wrote ATS Resume HTML to ${outPath}`);
