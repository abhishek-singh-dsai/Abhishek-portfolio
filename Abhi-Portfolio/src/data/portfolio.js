/*
 * ─────────────────────────────────────────────────────────────────────────────
 *  PORTFOLIO CONTENT: the single place to edit what the site says.
 *
 *  ⚠️  TO FILL IN: everything written as "[in brackets]" is a placeholder and
 *      shows on the page exactly like that until you replace it. Empty strings
 *      ('') and empty lists ([]) hide the thing they control: a button, a link,
 *      a stat or a whole block. Nothing here is invented about you.
 *
 *      Search for "[" and "TODO(you)" to find every spot.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const portfolio = {
  personal: {
    name: 'Abhishek Singh',
    monogram: 'AS',
    title: '[Your title, e.g. Full-Stack Developer]', // page <title>, SEO, OG image
    headlineRole: '[Your role]', // second line of the big hero headline
    intro: '[One or two sentences about what you build and what you care about.]',
    status: '[Availability, e.g. Open to internships]', // '' hides the pill
    location: '', // TODO(you) e.g. 'Delhi, India'
    email: '', // TODO(you) needed for the contact form fallback and the footer
    phone: '', // optional
    github: '#', // TODO(you) full URL, e.g. 'https://github.com/you'
    linkedin: '#', // TODO(you)
    x: '#', // TODO(you)
    instagram: '#', // TODO(you)
    medium: '',
    // TODO(you): put your PDF at public/resume.pdf and a first-page image at
    // public/images/resume-preview.webp, then fill these in. While `url` is empty
    // the Resume buttons are hidden.
    resume: { url: '', preview: '', previewWidth: 1100, previewHeight: 1424, summary: '[One-line résumé summary.]' },
  },

  // Words in the scrolling marquee under the hero (alternating bold / italic serif).
  marquee: ['[Specialty]', '[Focus area]', '[Skill]', '[Tool]', '[Specialty]', '[Focus area]'],

  projectsIntro: '[A sentence introducing your work.]',
  // Each project card. Empty URLs hide their buttons. Give either `image` (+ size and alt)
  // or a `visual` (a small diagram drawn from rows of boxes, or a file tree).
  projects: [
    {
      id: 'project-1',
      title: '[Project name]',
      tagline: '[One-line summary]',
      description: '[What it does, who it is for and why it matters.]',
      bullets: ['[Key result or feature]', '[Key result or feature]', '[Key result or feature]'],
      technologies: ['[Tech]', '[Tech]', '[Tech]'],
      liveUrl: '',
      githubUrl: '',
      // image: '/images/projects/project-1.webp', imageWidth: 1600, imageHeight: 1000, imageAlt: '...',
      visual: {
        type: 'flow',
        label: '[Diagram caption]',
        rows: [['[Client]'], ['[API · detail]'], ['[Service]', '[Service]'], ['[Database]']],
      },
    },
    {
      id: 'project-2',
      title: '[Project name]',
      tagline: '[One-line summary]',
      description: '[What it does, who it is for and why it matters.]',
      bullets: ['[Key result or feature]', '[Key result or feature]'],
      technologies: ['[Tech]', '[Tech]'],
      liveUrl: '',
      githubUrl: '',
      visual: {
        type: 'tree',
        label: '[Caption]',
        lines: ['project/', '├── src/', '│   └── [file]', '└── [file]      # [note]'],
      },
    },
  ],

  // Jobs / internships. While empty the section is titled "Education & credentials".
  experience: [
    {
      role: '[Role]',
      company: '[Company]',
      location: '[City]',
      period: '[Start] to [End]',
      bullets: ['[What you did and the impact it had]', '[What you did and the impact it had]'],
    },
  ],

  education: [
    { degree: '[Degree]', institution: '[Institution]', period: '[Years]', score: '' },
  ],

  // Add `image` (e.g. '/images/certificates/name.webp') to make a certificate open in a viewer.
  certifications: [
    { id: 'cert-1', title: '[Certification]', issuer: '[Issuer]' },
    { id: 'cert-2', title: '[Certification]', issuer: '[Issuer]' },
  ],

  // Animated counters. Only real numbers, e.g. { value: 12, suffix: '+', label: 'Projects shipped' }.
  stats: [],

  skillsIntro: '[A sentence about your stack.] Hover a chip, it flips.',
  skills: [
    { group: '[Group, e.g. Languages]', items: ['[Skill]', '[Skill]', '[Skill]', '[Skill]'] },
    { group: '[Group, e.g. Frameworks]', items: ['[Skill]', '[Skill]', '[Skill]'] },
    { group: '[Group, e.g. Tools]', items: ['[Skill]', '[Skill]', '[Skill]', '[Skill]', '[Skill]'] },
  ],
  // TODO(you): logos in the rotating ring next to the chips. These are PLACEHOLDERS
  // chosen only to demo the ring; replace them with the tools you actually use.
  // Names are simple-icons exports; add new ones to src/lib/toolIcons.js too.
  toolLogos: [
    'siPython', 'siJavascript', 'siTypescript', 'siReact', 'siNextdotjs', 'siNodedotjs',
    'siTailwindcss', 'siThreedotjs', 'siGit', 'siGithub', 'siDocker', 'siLinux',
    'siMongodb', 'siPostgresql', 'siFigma', 'siBlender',
  ],

  creative: {
    title: ['Beyond the', 'code'], // second word renders in italic serif
    intro: '[What you do away from work: hobbies, side projects, communities.]',
    // icon: any of PenLine, Trophy, Cpu, Camera, Music, Palette, Gamepad2, Box. `href` '' = not a link.
    cards: [
      { icon: 'Palette', title: '[Interest]', text: '[A sentence about it.]', meta: '[Tools or tags]', href: '' },
      { icon: 'Camera', title: '[Interest]', text: '[A sentence about it.]', meta: '[Tools or tags]', href: '' },
      { icon: 'Box', title: '[Interest]', text: '[A sentence about it.]', meta: '[Tools or tags]', href: '' },
    ],
    articlesTitle: 'Latest write-ups',
    articles: [], // { title, date, readTime, url }
  },

  photography: {
    enabled: true, // false removes the section
    title: ['Moments, in', 'frames'],
    intro: 'A small gallery of photos. Coming soon.',
    // TODO(you): { src: '/images/photos/x.webp', alt: '...', width: 1600, height: 1067 }
    photos: [],
  },

  contact: {
    topics: ['Full-Time Role', 'Freelance', 'Collaboration', 'Something else'],
  },

  // Small captions at the corners of the big footer name. [] hides them.
  footerCorners: [],
};
