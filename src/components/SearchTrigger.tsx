import { useState, useEffect } from 'react';
import SearchModal from './SearchModal';

interface SearchTriggerProps {
  lang: string;
  translations: Record<string, string>;
}

export default function SearchTrigger({ lang, translations }: SearchTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm text-stone-500 hover:text-stone-900 hover:bg-stone-100/50 rounded-full transition-colors"
        aria-label={translations['nav.search'] || 'Search'}
      >
        <svg
          className="w-4 h-4"
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
        <span className="hidden lg:inline">{translations['nav.search']}</span>
        <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium text-stone-400 bg-stone-100 rounded border border-stone-200">
          {translations['nav.searchShortcut'] || 'Ctrl+K'}
        </kbd>
      </button>

      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 rounded-full text-stone-600 hover:bg-stone-100 transition-colors"
        aria-label={translations['nav.search'] || 'Search'}
      >
        <svg
          className="w-5 h-5"
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
      </button>

      <SearchModal
        lang={lang}
        translations={translations}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
