#!/usr/bin/env node
// Generates seed data for Sanity import.
// Usage: node scripts/seed-sanity.mjs > sanity-seed.ndjson
// Then:  npx sanity dataset import sanity-seed.ndjson production

const docs = []

// ─── Web Projects ──────────────────────────────────────────────────────────────

docs.push({
  _id: 'project-atlas',
  _type: 'project',
  id: 'atlas',
  title: 'Atlas',
  year: '2025',
  kind: 'web',
  role: 'Design & Development',
  desc: 'A geographic data explorer for tracking field research across 40+ sites in the northeast.',
  tags: ['React', 'Mapbox', 'D3', 'Node'],
  accent: 'red',
  thumb: 'atlas',
  live: '',
  repo: '',
  body: [
    'Atlas started as an internal tool for a research team managing ecological data across dozens of field sites.',
    'The core challenge was presenting dense coordinate-level data in a way that was scannable without a GIS background.',
    'Built with React and Mapbox, with a custom D3 layer for overlaying measurement trends over time.',
  ],
})

docs.push({
  _id: 'project-field',
  _type: 'project',
  id: 'field',
  title: 'Field',
  year: '2024',
  kind: 'web',
  role: 'Design & Development',
  desc: 'A structured content editor for journalists and researchers — built around long-form, not short-form.',
  tags: ['Next.js', 'ProseMirror', 'PostgreSQL'],
  accent: 'cobalt',
  thumb: 'field',
  live: '',
  repo: '',
  body: [
    'Field is a minimal writing tool designed for people who work with documents, not tweets.',
    'The editor is ProseMirror-based with a schema that enforces sections, citations, and media blocks.',
    'The pitch was: what if your CMS felt like a good notebook instead of a bad spreadsheet?',
  ],
})

docs.push({
  _id: 'project-bodega',
  _type: 'project',
  id: 'bodega',
  title: 'Bodega Radio',
  year: '2024',
  kind: 'web',
  role: 'Design & Development',
  desc: 'Website and streaming dashboard for a neighborhood community radio station in Brooklyn.',
  tags: ['Astro', 'React', 'Icecast', 'Tailwind'],
  accent: 'sun',
  thumb: 'bodega',
  live: '',
  repo: '',
  body: [
    "Community radio is weirdly underserved by web tooling — everything is either too corporate or too DIY.",
    'This project wrapped Icecast streaming with a custom schedule manager, show archive, and on-air indicator.',
    'The design leans into the physical ephemera of neighborhood radio: stickers, handwritten schedules, lo-fi energy.',
  ],
})

docs.push({
  _id: 'project-parcel',
  _type: 'project',
  id: 'parcel',
  title: 'Parcel',
  year: '2023',
  kind: 'web',
  role: 'Product Design',
  desc: 'Last-mile delivery route optimizer for small couriers — 14-stop routes, live traffic, driver handoffs.',
  tags: ['Vue', 'Google Maps', 'Firebase'],
  accent: 'lime',
  thumb: 'parcel',
  live: '',
  repo: '',
  body: [
    'Parcel came out of a conversation with a courier who was still doing route planning on paper.',
    'The key insight: drivers do not want "optimal" — they want predictable and tweakable.',
    'Designed for single-handed use on a phone mount. Handoff screens are large-target, glanceable.',
  ],
})

// ─── Game Projects ─────────────────────────────────────────────────────────────

docs.push({
  _id: 'project-moth',
  _type: 'project',
  id: 'moth',
  title: 'Moth',
  year: '2025',
  kind: 'game',
  role: 'Design, Code, Art',
  desc: 'A narrative stargazing game. You are a moth. You chart constellations that no one else can see.',
  tags: ['Godot', 'GDScript', 'Pixel Art'],
  accent: 'plum',
  thumb: 'moth',
  itch: '',
  body: [
    'Moth started as a jam entry for Cozy Autumn Game Jam 2024 and kept growing.',
    'The core loop: each night you find three stars and name the shape you see. The game remembers every name.',
    'It is quiet, slow, and very much about the act of paying attention.',
  ],
})

docs.push({
  _id: 'project-rewind',
  _type: 'project',
  id: 'rewind',
  title: 'Rewind',
  year: '2024',
  kind: 'game',
  role: 'Design, Code',
  desc: 'A puzzle platformer where every death rewinds time exactly 4.8 seconds — and you can see the ghost.',
  tags: ['Unity', 'C#'],
  accent: 'red',
  thumb: 'rewind',
  itch: '',
  body: [
    'The 4.8 second number came from testing — long enough to be useful, short enough to stay tense.',
    'The ghost mechanic came from a bug where a previous character state was rendering twice.',
    'Shipped for Ludum Dare 55. Rated top 12% for innovation.',
  ],
})

docs.push({
  _id: 'project-lattice',
  _type: 'project',
  id: 'lattice',
  title: 'Lattice',
  year: '2025',
  kind: 'game',
  role: 'Design, Code, Art',
  desc: 'A graph traversal puzzle game. Find the path. Every node is a choice and every edge has a cost.',
  tags: ['Godot', 'GDScript'],
  accent: 'mint',
  thumb: 'lattice',
  itch: '',
  body: [
    'Lattice is the game I make when I want to think about systems without any story wrapper.',
    'Each level is a hand-authored graph — no procedural generation, because I want the surprise to be precise.',
    'Currently in late development with 30 levels drafted.',
  ],
})

docs.push({
  _id: 'project-thicket',
  _type: 'project',
  id: 'thicket',
  title: 'Thicket',
  year: '2023',
  kind: 'game',
  role: 'Design, Code, Art',
  desc: 'A tree simulation idle game. Your trees age, scar, fork, and die. You keep records.',
  tags: ['Unity', 'C#', 'Pixel Art'],
  accent: 'cobalt',
  thumb: 'thicket',
  itch: '',
  body: [
    'Every tree in Thicket has a permanent record: age, height, lightning strikes, disease events.',
    'You are the arborist. You do not save the trees — you document them.',
    'Shipped in 2023 and still has a small fanbase of people who find it meditative.',
  ],
})

// ─── Devlog Posts ──────────────────────────────────────────────────────────────

docs.push({
  _id: 'post-001',
  _type: 'post',
  id: 'p001',
  date: '2026-04',
  title: 'Why I moved the portfolio to Sanity',
  excerpt: 'The hardcoded data era is over. Here is what changed and why headless CMS actually makes sense for a portfolio now.',
  read: '4 min',
  tag: 'Meta',
  thumb: 'meta',
  body: [
    'For the last two years my portfolio data lived as TypeScript constants in PortfolioApp.tsx. It worked fine. Until I wanted to update something from my phone at 11pm.',
    'Sanity is a good fit here: the GROQ query language maps cleanly onto the data shapes I was already using, and Sanity Studio gives me a real editing interface without building one.',
    'The migration took an afternoon. The only thing that changed in the component was swapping constants for useEffect + fetch. All the rendering logic stayed the same.',
  ],
})

docs.push({
  _id: 'post-002',
  _type: 'post',
  id: 'p002',
  date: '2026-03',
  title: 'The 4.8 second rule',
  excerpt: 'How an arbitrary number became the core mechanic of Rewind, and what it taught me about scope.',
  read: '6 min',
  tag: 'Devlog',
  thumb: 'devlog',
  body: [
    "Ludum Dare 55's theme was 'summoning'. My first idea was terrible. My second idea involved summoning a past version of yourself.",
    'I tried 3 seconds, 5 seconds, 8 seconds. 4.8 felt wrong enough to be interesting. The awkwardness is the mechanic.',
    'The ghost came from a render bug. I left it in. Players rated it the best part of the game.',
  ],
})

docs.push({
  _id: 'post-003',
  _type: 'post',
  id: 'p003',
  date: '2026-02',
  title: 'Designing for glanceability',
  excerpt: 'Parcel taught me that mobile UI for working people is different from mobile UI for browsing people.',
  read: '5 min',
  tag: 'Design',
  thumb: 'design',
  body: [
    "A courier in motion can't read. They can recognize shapes and tap targets.",
    'Every screen in Parcel was designed to answer one question in under a second. Address, next stop, time to arrival.',
    'The insight: "simple" is not a visual property. It is a cognitive one. You can have a lot of information on screen and still be simple if the hierarchy is right.',
  ],
})

docs.push({
  _id: 'post-004',
  _type: 'post',
  id: 'p004',
  date: '2026-01',
  title: 'Six months of Godot',
  excerpt: 'Notes from switching my game dev stack from Unity to Godot 4 mid-project.',
  read: '7 min',
  tag: 'Code',
  thumb: 'code',
  body: [
    'I switched to Godot in October after the Unity runtime fee announcement. I had two projects mid-build.',
    'GDScript is fine once you stop trying to write it like C#. The node system clicked after about two weeks.',
    'Lattice and Moth are both Godot 4 now. Thicket stays in Unity because the port cost is not worth it.',
  ],
})

// ─── Now Items ─────────────────────────────────────────────────────────────────

docs.push({
  _id: 'now-001',
  _type: 'nowItem',
  title: 'Lattice — wrapping up',
  body: 'Final 8 levels drafted. In playtest now. Targeting a May itch.io release.',
  progress: 78,
  color: 'mint',
  icon: '◇',
})

docs.push({
  _id: 'now-002',
  _type: 'nowItem',
  title: 'Reading: A Pattern Language',
  body: 'Taking my time with it. The density is the point.',
  progress: null,
  color: 'sun',
  icon: '📖',
})

docs.push({
  _id: 'now-003',
  _type: 'nowItem',
  title: 'Portfolio migration',
  body: 'Moved from Convex to Sanity. Feels much calmer.',
  progress: 90,
  color: 'cobalt',
  icon: '⬡',
})

docs.push({
  _id: 'now-004',
  _type: 'nowItem',
  title: 'Available for work',
  body: 'Taking 1–2 new projects starting May 2026. Best for weird briefs.',
  progress: null,
  color: 'red',
  icon: '★',
})

// ─── Resume ────────────────────────────────────────────────────────────────────

docs.push({
  _id: 'resume-singleton',
  _type: 'resume',
  work: [
    { title: 'Independent', org: 'Self', year: '2023–now', tag: 'current' },
    { title: 'Lead Product Designer', org: 'Fieldnotes', year: '2021–2023' },
    { title: 'Senior Designer', org: 'Muse Studio', year: '2019–2021' },
    { title: 'Designer', org: 'R/GA', year: '2018' },
    { title: 'Product Designer', org: 'Parcel Labs', year: '2016–2019' },
  ],
  speaking: [
    { title: 'Making games for 4 people', org: 'Indiecade East', year: '2025' },
    { title: 'Design systems at human scale', org: 'CSS Day', year: '2024' },
  ],
  education: [
    { title: 'BFA Graphic Design', org: 'Pratt Institute', year: '2016' },
  ],
  skills: ['React', 'Next.js', 'TypeScript', 'Figma', 'Godot', 'Unity', 'Aseprite', 'Tailwind', 'Node.js', 'PostgreSQL'],
})

// ─── Output ────────────────────────────────────────────────────────────────────

for (const doc of docs) {
  process.stdout.write(JSON.stringify(doc) + '\n')
}
