import { ui, defaultLang, languages } from './ui';

export { languages, defaultLang };

const normalizePath = (path: string) => {
  if (!path) return '/';
  const withLeading = path.startsWith('/') ? path : `/${path}`;
  if (withLeading.length > 1 && withLeading.endsWith('/')) {
    return withLeading.slice(0, -1);
  }
  return withLeading;
};

export const slugTranslations = {
  pl: {
    '/o-nas': '/about',
    '/oferta': '/services',
    '/pliki': '/downloads',
    '/kwestionariusze': '/forms',
    '/kontakt': '/contact',
    '/cennik': '/pricing',
    '/faq': '/faq',
    '/polityka-prywatnosci': '/privacy-policy',
    '/regulamin': '/terms',
    '/szukaj': '/search',
  },
  en: {
    '/about': '/o-nas',
    '/services': '/oferta',
    '/downloads': '/pliki',
    '/forms': '/kwestionariusze',
    '/contact': '/kontakt',
    '/pricing': '/cennik',
    '/faq': '/faq',
    '/privacy-policy': '/polityka-prywatnosci',
    '/terms': '/regulamin',
    '/search': '/szukaj',
  },
  de: {
    '/about': '/o-nas',
    '/services': '/oferta',
    '/downloads': '/pliki',
    '/forms': '/kwestionariusze',
    '/contact': '/kontakt',
    '/preise': '/cennik',
    '/faq': '/faq',
    '/datenschutz': '/polityka-prywatnosci',
    '/agb': '/regulamin',
    '/search': '/szukaj',
  },
} as const;

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function getLocalizedPath(path: string, lang: keyof typeof ui): string {
  const normalizedPath = normalizePath(path);

  if (lang === defaultLang) {
    return normalizedPath === '/' ? '/pl' : `/pl${normalizedPath}`;
  }

  return normalizedPath === '/' ? `/${lang}` : `/${lang}${normalizedPath}`;
}

export function translatePath(
  path: string,
  fromLang: keyof typeof ui,
  toLang: keyof typeof ui
): string {
  const normalizedPath = normalizePath(path);
  if (fromLang === toLang) {
    return getLocalizedPath(normalizedPath, toLang);
  }

  // Strip source locale prefix
  const fromPrefix = `/${fromLang}`;
  const withoutSourceLocale = normalizedPath.startsWith(fromPrefix)
    ? normalizedPath.slice(fromPrefix.length) || '/'
    : normalizedPath;

  // Step 1: Convert source path to PL (default) path
  let plPath = withoutSourceLocale;
  if (fromLang !== defaultLang) {
    const toPlMap = slugTranslations[fromLang] as Record<string, string>;
    plPath = toPlMap[withoutSourceLocale] ?? withoutSourceLocale;
  }

  // Step 2: Convert PL path to target language path
  let targetPath = plPath;
  if (toLang !== defaultLang) {
    if (toLang === 'de') {
      const deToPl = slugTranslations['de'] as Record<string, string>;
      // Find which DE path maps to this PL path
      targetPath = Object.entries(deToPl).find(([, pl]) => pl === plPath)?.[0] ?? plPath;
    } else {
      const plToTargetMap = slugTranslations[defaultLang] as Record<string, string>;
      targetPath = plToTargetMap[plPath] ?? plPath;
    }
  }

  return getLocalizedPath(targetPath, toLang);
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof (typeof ui)['pl']) {
    return ui[lang][key as keyof typeof ui[typeof lang]] || ui[defaultLang][key as keyof typeof ui[typeof defaultLang]];
  }
}
