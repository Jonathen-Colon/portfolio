export const PAGES = [
  { id: 'home', label: 'Home' },
  { id: 'web', label: 'Web' },
  { id: 'games', label: 'Games' },
  { id: 'blog', label: 'Devlog' },
  { id: 'about', label: 'About' },
  { id: 'resume', label: 'Resume' },
  { id: 'contact', label: 'Contact' },
] as const;

export const NAV_WORK_ITEMS = [
  { id: 'web', label: 'Web' },
  { id: 'games', label: 'Games' },
  { id: 'blog', label: 'Devlog' },
] as const;

export const NAV_ABOUT_ITEMS = [
  { id: 'about', label: 'About' },
  { id: 'resume', label: 'Resume' },
  { id: 'contact', label: 'Contact' },
] as const;

export const NAV_WORK_IDS = new Set<string>(NAV_WORK_ITEMS.map((i) => i.id));
export const NAV_ABOUT_IDS = new Set<string>(NAV_ABOUT_ITEMS.map((i) => i.id));

export const PAGE_TO_PATH: Record<string, string> = {
  home: '/',
  web: '/web',
  games: '/games',
  blog: '/devlog',
  about: '/about',
  resume: '/resume',
  contact: '/contact',
};

const PATH_TO_PAGE: Record<string, string> = Object.fromEntries(
  Object.entries(PAGE_TO_PATH).map(([k, v]) => [v, k])
);

export function normalizePathname(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1);
  return pathname;
}

export function pathToPage(pathname: string) {
  const p = normalizePathname(pathname);
  return PATH_TO_PAGE[p] ?? 'home';
}

export function pageToPath(pageId: string) {
  return PAGE_TO_PATH[pageId] ?? '/';
}
