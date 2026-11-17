import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildMailtoHref,
  buildSectionHash,
  buildShareableSectionUrl,
  calculateAmbientGaze,
  calculateDirectionalFollow,
  calculateDirectGazeProgress,
  calculateOrientationFollow,
  calculateScrubTime,
  filterCertificates,
  getCarouselScrollDelta,
  getMergedTypewriterParts,
  getTypewriterSlice,
  NAV_SECTIONS,
  parseSectionFromHash,
  validateContactInput,
} from './portfolioLogic';
import { buildAtsResumeHtml } from './atsResumeHtml';
import { RESUME_DATA } from '../data/resumeData';

test('calculateScrubTime moves forward and clamps to duration', () => {
  const t1 = calculateScrubTime({
    currentTarget: 2,
    deltaX: 360,
    viewportWidth: 1440,
    duration: 10,
  });
  assert.equal(t1, 4);

  const clampedMax = calculateScrubTime({
    currentTarget: 9,
    deltaX: 720,
    viewportWidth: 1440,
    duration: 10,
  });
  assert.equal(clampedMax, 10);

  const clampedMin = calculateScrubTime({
    currentTarget: 1,
    deltaX: -720,
    viewportWidth: 1440,
    duration: 10,
  });
  assert.equal(clampedMin, 0);
});

test('calculateScrubTime handles invalid duration or viewport width safely', () => {
  assert.equal(
    calculateScrubTime({ currentTarget: 2, deltaX: 100, viewportWidth: 0, duration: 10 }),
    0
  );
  assert.equal(
    calculateScrubTime({ currentTarget: 2, deltaX: 100, viewportWidth: 1200, duration: Number.NaN }),
    0
  );
});

test('calculateDirectGazeProgress maps pointer coordinate across duration and clamps safely', () => {
  assert.equal(
    calculateDirectGazeProgress({ clientX: 0, viewportWidth: 1000, duration: 4.0 }),
    0
  );
  assert.equal(
    calculateDirectGazeProgress({ clientX: 500, viewportWidth: 1000, duration: 4.0 }),
    2.0
  );
  assert.equal(
    calculateDirectGazeProgress({ clientX: 1000, viewportWidth: 1000, duration: 4.0 }),
    4.0
  );
  assert.equal(
    calculateDirectGazeProgress({ clientX: 1500, viewportWidth: 1000, duration: 4.0 }),
    4.0
  );
  assert.equal(
    calculateDirectGazeProgress({ clientX: 500, viewportWidth: 0, duration: 4.0 }),
    0
  );
});

test('calculateAmbientGaze keeps gaze gently oscillating near base progress', () => {
  const g1 = calculateAmbientGaze({ baseProgress: 0.5, elapsedSeconds: 0, amplitude: 0.1 });
  assert.equal(g1, 0.5);

  const g2 = calculateAmbientGaze({
    baseProgress: 0.5,
    elapsedSeconds: Math.PI / 1.6, // sin(pi/2) = 1 with frequency 0.8
    amplitude: 0.1,
    frequency: 0.8,
  });
  assert.ok(Math.abs(g2 - 0.6) < 0.01);
});

test('calculateOrientationFollow maps device tilt safely', () => {
  const neutral = calculateOrientationFollow({ gamma: 0, beta: 45 });
  assert.equal(neutral.nx, 0);
  assert.equal(neutral.ny, 0);
  assert.equal(neutral.gazeProgressRatio, 0.5);

  const tiltedRight = calculateOrientationFollow({ gamma: 35, beta: 45 });
  assert.equal(tiltedRight.nx, 1);
  assert.equal(tiltedRight.gazeProgressRatio, 1);

  const nullData = calculateOrientationFollow({ gamma: null, beta: null });
  assert.equal(nullData.gazeProgressRatio, 0.5);
});

test('getTypewriterSlice returns exact substring and done state', () => {
  assert.deepEqual(getTypewriterSlice('Hello', 0), { displayed: '', done: false });
  assert.deepEqual(getTypewriterSlice('Hello', 3), { displayed: 'Hel', done: false });
  assert.deepEqual(getTypewriterSlice('Hello', 5), { displayed: 'Hello', done: true });
  assert.deepEqual(getTypewriterSlice('Hello', 99), { displayed: 'Hello', done: true });
});

test('validateContactInput enforces required fields and email format', () => {
  assert.equal(
    validateContactInput({ senderName: '', senderEmail: 'a@b.com', message: 'Hello world!' }),
    'Please enter your name.'
  );
  assert.equal(
    validateContactInput({ senderName: 'Jane', senderEmail: 'invalid-email', message: 'Hello world!' }),
    'Please enter a valid email address.'
  );
  assert.equal(
    validateContactInput({ senderName: 'Jane', senderEmail: 'jane@example.com', message: 'Hi' }),
    'Please write a short message (at least 10 characters).'
  );
  assert.equal(
    validateContactInput({
      senderName: 'Jane',
      senderEmail: 'jane@example.com',
      message: 'Interested in collaborating on ML systems.',
    }),
    null
  );
});

test('buildMailtoHref encodes recipient, subject, and sender metadata', () => {
  const href = buildMailtoHref({
    recipient: 'alokjan36@gmail.com',
    senderName: 'Alex',
    senderEmail: 'alex@company.com',
    subject: 'ML Internship Follow-up',
    message: 'Would love to connect regarding your ORCA project.',
  });
  assert.ok(href.startsWith('mailto:alokjan36@gmail.com?'));
  assert.ok(href.includes('ML+Internship+Follow-up'));
});

test('resumeData contains updated email, links, and complete credentials including internship certificate', () => {
  assert.equal(NAV_SECTIONS.length, 4);
  assert.equal(RESUME_DATA.name, 'Alok Kumar Singh');
  assert.equal(RESUME_DATA.email, 'alokjan36@gmail.com');
  assert.equal(RESUME_DATA.linkedinUrl, 'https://www.linkedin.com/in/alok-kumar-singh-708525345');
  assert.equal(RESUME_DATA.githubUrl, 'https://github.com/aloksingh70');
  assert.equal(RESUME_DATA.projects[0].liveDemoUrl, 'https://orca-advisory.vercel.app');
  assert.equal(RESUME_DATA.skills.length, 5);
  assert.equal(RESUME_DATA.projects[0].agents.length, 4);
  assert.equal(RESUME_DATA.certifications.length, 8);
  const mlCert = RESUME_DATA.certifications.find(
    (c) => c.title === 'Machine Learning Internship Completion Certificate'
  );
  assert.ok(mlCert?.documentImage);
  assert.ok(
    RESUME_DATA.certifications.filter((c) => Boolean(c.credentialUrl)).length === 6
  );
  assert.equal(RESUME_DATA.education[0].institution, 'Brainware University');
});

test('calculateDirectionalFollow tracks X and Y in all directions and clamps bounds', () => {
  const center = calculateDirectionalFollow({
    clientX: 720,
    clientY: 450,
    viewportWidth: 1440,
    viewportHeight: 900,
  });
  assert.deepEqual(center, {
    nx: 0,
    ny: 0,
    translateX: 0,
    translateY: 0,
    rotateX: -0,
    rotateY: 0,
  });

  const topRight = calculateDirectionalFollow({
    clientX: 1440,
    clientY: 0,
    viewportWidth: 1440,
    viewportHeight: 900,
  });
  assert.equal(topRight.nx, 1);
  assert.equal(topRight.ny, -1);
  assert.equal(topRight.translateX, 24);
  assert.equal(topRight.translateY, -22);
  assert.equal(topRight.rotateX, 7);
  assert.equal(topRight.rotateY, 7);

  const bottomLeft = calculateDirectionalFollow({
    clientX: -50,
    clientY: 1000,
    viewportWidth: 1440,
    viewportHeight: 900,
  });
  assert.equal(bottomLeft.nx, -1);
  assert.equal(bottomLeft.ny, 1);
  assert.equal(bottomLeft.translateX, -24);
  assert.equal(bottomLeft.translateY, 22);
});

test('getMergedTypewriterParts splits merged typewriter progression cleanly across segments', () => {
  const segments = {
    introLine1: 'Hey there,',
    introLine2: 'Portfolio',
    body: 'Building AI.',
  };
  const full = `${segments.introLine1}\n${segments.introLine2}\n${segments.body}`;

  assert.deepEqual(getMergedTypewriterParts(full.slice(0, 4), false, segments), {
    introLine1: 'Hey ',
    introLine2: '',
    body: '',
    activeSegment: 'intro1',
  });

  assert.deepEqual(getMergedTypewriterParts(full.slice(0, 15), false, segments), {
    introLine1: 'Hey there,',
    introLine2: 'Port',
    body: '',
    activeSegment: 'intro2',
  });

  assert.deepEqual(getMergedTypewriterParts(full.slice(0, 25), false, segments), {
    introLine1: 'Hey there,',
    introLine2: 'Portfolio',
    body: 'Buil',
    activeSegment: 'body',
  });

  assert.deepEqual(getMergedTypewriterParts(full, true, segments), {
    introLine1: 'Hey there,',
    introLine2: 'Portfolio',
    body: 'Building AI.',
    activeSegment: 'none',
  });
});

test('filterCertificates filters by internship, simulation, course, and all', () => {
  assert.equal(filterCertificates(RESUME_DATA.certifications, 'all').length, 8);
  assert.equal(filterCertificates(RESUME_DATA.certifications, 'internship').length, 2);
  assert.equal(filterCertificates(RESUME_DATA.certifications, 'simulation').length, 2);
  assert.equal(filterCertificates(RESUME_DATA.certifications, 'course').length, 4);
});

test('getCarouselScrollDelta returns signed horizontal scroll step', () => {
  assert.equal(getCarouselScrollDelta('next', 356), 356);
  assert.equal(getCarouselScrollDelta('prev', 356), -356);
  assert.equal(getCarouselScrollDelta('next', -10), 350);
});

test('resumeData techStack includes Python, SQL, PyTorch, TensorFlow, FastAPI, React, and Power BI', () => {
  assert.deepEqual(
    RESUME_DATA.techStack.map((item) => item.name),
    ['Python', 'SQL', 'PyTorch', 'TensorFlow', 'FastAPI', 'React', 'Power BI']
  );
  assert.ok(
    RESUME_DATA.techStack.every((item) => item.proficiency.length > 0 && item.tooltip.length > 10)
  );
});

test('parseSectionFromHash and shareable URL builders handle valid and invalid hashes', () => {
  assert.equal(parseSectionFromHash('#credentials'), 'credentials');
  assert.equal(parseSectionFromHash('#/RESUME'), 'resume');
  assert.equal(parseSectionFromHash('#unknown'), null);
  assert.equal(parseSectionFromHash(''), null);

  assert.equal(buildSectionHash('projects'), '#projects');
  assert.equal(buildSectionHash(null), '');
  assert.equal(
    buildShareableSectionUrl('https://example.com/#skills', 'credentials'),
    'https://example.com/#credentials'
  );
  assert.equal(
    buildShareableSectionUrl('https://example.com/#skills', null),
    'https://example.com/'
  );
});

test('buildAtsResumeHtml keeps ATS PDF content synced with RESUME_DATA', () => {
  const html = buildAtsResumeHtml(RESUME_DATA);
  assert.ok(html.includes('alokjan36@gmail.com'));
  assert.ok(html.includes('github.com/aloksingh70'));
  assert.ok(html.includes('PyTorch'));
  assert.ok(html.includes('Machine Learning Internship Completion Certificate'));
  assert.ok(html.includes('Statement of Accomplishment'));
  assert.ok(html.includes('orca-advisory.vercel.app'));
});
