import type { PageId } from '../components/portfolio/types';

export const NAV_PAGES: { id: PageId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'web', label: 'Web' },
  { id: 'games', label: 'Games' },
  { id: 'blog', label: 'Devlog' },
  { id: 'about', label: 'About' },
  { id: 'now', label: 'Now' },
  { id: 'resume', label: 'Resume' },
  { id: 'contact', label: 'Contact' },
];

const PAGE_IDS = new Set<PageId>([
  'home',
  'web',
  'games',
  'blog',
  'about',
  'now',
  'resume',
  'contact',
]);

/** Browser path for each logical page (home is `/`). */
export function pathForPage(id: PageId): string {
  if (id === 'home') return '/';
  return `/${id}`;
}

export function pageTitleFor(id: PageId): string {
  const base = 'Jon Colon — Designer, Developer, Game Dev';
  const map: Partial<Record<PageId, string>> = {
    home: base,
    web: `Web design — ${base}`,
    games: `Game dev — ${base}`,
    blog: `Devlog — ${base}`,
    about: `About — ${base}`,
    now: `Now — ${base}`,
    resume: `Resume — ${base}`,
    contact: `Contact — ${base}`,
  };
  return map[id] ?? base;
}

/** Resolve `PageId` from React Router pathname (leading slash, no hash). */
export function pageIdFromPathname(pathname: string): PageId {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  if (normalized === '/') return 'home';
  const seg = normalized.slice(1).split('/')[0];
  if (seg && PAGE_IDS.has(seg as PageId) && seg !== 'home') return seg as PageId;
  return 'home';
}
