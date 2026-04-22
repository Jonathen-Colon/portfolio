/** Per-route document title + meta description (used by Astro + client nav). */
export const SITE_PAGE_META = {
  home: {
    title: 'Jon Colon — Designer, Developer, Game Dev',
    description:
      'Designer, developer and part-time game dev. Portfolio, devlog, and selected work.',
  },
  web: {
    title: 'Web work — Jon Colon',
    description: 'Selected web design and development — sites, products, and marketing pages.',
  },
  games: {
    title: 'Games — Jon Colon',
    description: 'Indie games and prototypes — small weird games shipped in off-hours.',
  },
  blog: {
    title: 'Devlog — Jon Colon',
    description: "Short posts about what I'm making and why — design, code, and gamedev notes.",
  },
  about: {
    title: 'About — Jon Colon',
    description: 'Bio, background, and how I work — design, development, and game projects.',
  },
  resume: {
    title: 'Resume — Jon Colon',
    description: 'Work history, speaking, education, and skills — condensed CV.',
  },
  contact: {
    title: 'Contact — Jon Colon',
    description: 'Project inquiries and collaboration — best way to get in touch.',
  },
} as const;

export type SitePageId = keyof typeof SITE_PAGE_META;

export function sitePageTitle(pageId: string): string {
  const meta = SITE_PAGE_META[pageId as SitePageId];
  return meta?.title ?? SITE_PAGE_META.home.title;
}

export function sitePageDescription(pageId: string): string {
  const meta = SITE_PAGE_META[pageId as SitePageId];
  return meta?.description ?? SITE_PAGE_META.home.description;
}
