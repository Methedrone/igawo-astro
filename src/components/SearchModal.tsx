import { useState, useEffect, useRef, useCallback } from 'react';

interface SearchResult {
  url: string;
  title: string;
  excerpt: string;
  meta: Record<string, string>;
}

interface SearchModalProps {
  lang: string;
  translations: Record<string, string>;
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ lang, translations, isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagefindReady, setPagefindReady] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pagefindRef = useRef<any>(null);

  const t = (key: string) => translations[key] || key;

  // Initialize Pagefind
  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;

    async function initPagefind() {
      // Pagefind index only exists after production build
      if (import.meta.env.DEV) {
        setError(t('search.devMode') || 'Wyszukiwarka działa po zbudowaniu strony (npm run build).');
        return;
      }
      try {
        // @ts-ignore — loaded from /pagefind output directory, hidden from Vite
        const pagefind = await new Function('return import("/pagefind/pagefind.js")')();
        if (cancelled) return;
        await pagefind.init();
        if (cancelled) return;
        pagefindRef.current = pagefind;
        setPagefindReady(true);
      } catch (err) {
        if (cancelled) return;
        setError(t('search.error'));
        setPagefindReady(false);
      }
    }

    initPagefind();

    return () => {
      cancelled = true;
    };
  }, [isOpen, t]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, pagefindReady]);

  // Perform search
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!pagefindRef.current || !searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const search = await pagefindRef.current.search(searchQuery, {
        filters: {
          language: lang,
        },
      });

      const processedResults: SearchResult[] = [];

      for (const result of search.results.slice(0, 8)) {
        const data = await result.data();
        processedResults.push({
          url: data.url,
          title: data.meta?.title || data.url,
          excerpt: data.excerpt || '',
          meta: data.meta || {},
        });
      }

      setResults(processedResults);
    } catch (err) {
      setError(t('search.error'));
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [lang, t]);

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(query);
    }, 150);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query, performSearch]);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (!isOpen) {
          // This will be handled by the parent trigger
        } else {
          onClose();
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4"
      role="dialog"
      aria-modal="true"
      aria-label={t('nav.search')}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-stone-900/30 backdrop-blur-sm" aria-hidden="true" />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl glass-panel rounded-2xl shadow-2xl overflow-hidden border border-white/40"
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-stone-200/50">
          <svg
            className="w-5 h-5 text-stone-400 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('search.placeholder')}
            className="flex-1 bg-transparent text-stone-900 placeholder-stone-400 text-base outline-none"
            aria-label={t('search.placeholder')}
          />
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs font-medium text-stone-400 bg-stone-100 rounded-md hover:bg-stone-200 transition-colors"
            aria-label={t('search.close')}
          >
            ESC
          </button>
        </div>

        {/* Results area */}
        <div className="max-h-[50vh] overflow-y-auto">
          {!pagefindReady && !error && (
            <div className="px-5 py-12 text-center text-stone-400">
              <div className="inline-block w-6 h-6 border-2 border-stone-300 border-t-brand-500 rounded-full animate-spin mb-3" />
              <p className="text-sm">{t('search.loading')}</p>
            </div>
          )}

          {error && (
            <div className="px-5 py-12 text-center">
              <p className="text-sm text-stone-500">{error}</p>
              <p className="text-xs text-stone-400 mt-2">
                {lang === 'pl'
                  ? 'Wyszukiwarka jest dostępna po zbudowaniu strony (npm run build).'
                  : lang === 'de'
                  ? 'Die Suche ist verfügbar, nachdem die Seite gebaut wurde (npm run build).'
                  : 'Search is available after building the site (npm run build).'}
              </p>
            </div>
          )}

          {!error && pagefindReady && !query.trim() && (
            <div className="px-5 py-12 text-center">
              <svg
                className="w-10 h-10 text-stone-300 mx-auto mb-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <p className="text-sm text-stone-400">{t('search.hint')}</p>
            </div>
          )}

          {loading && query.trim() && (
            <div className="px-5 py-8 text-center">
              <div className="inline-block w-5 h-5 border-2 border-stone-300 border-t-brand-500 rounded-full animate-spin" />
            </div>
          )}

          {!loading && query.trim() && results.length === 0 && pagefindReady && (
            <div className="px-5 py-12 text-center">
              <p className="text-sm text-stone-500">{t('search.noResults')}</p>
            </div>
          )}

          {results.length > 0 && (
            <ul className="py-2">
              {results.map((result, index) => (
                <li key={index}>
                  <a
                    href={result.url}
                    className="block px-5 py-3 hover:bg-stone-50/80 transition-colors group"
                    onClick={onClose}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center shrink-0 group-hover:bg-brand-50 transition-colors">
                        <svg
                          className="w-4 h-4 text-stone-400 group-hover:text-brand-600 transition-colors"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-stone-900 group-hover:text-brand-700 transition-colors truncate">
                          {result.title}
                        </h3>
                        {result.excerpt && (
                          <p
                            className="text-xs text-stone-500 mt-1 line-clamp-2"
                            dangerouslySetInnerHTML={{ __html: result.excerpt }}
                          />
                        )}
                      </div>
                      <svg
                        className="w-4 h-4 text-stone-300 shrink-0 mt-1 group-hover:text-stone-500 transition-colors"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {results.length > 0 && (
          <div className="px-5 py-2.5 border-t border-stone-200/50 bg-stone-50/50">
            <p className="text-xs text-stone-400">
              {results.length} {results.length === 1 ? t('search.result') : t('search.results')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
