import { useState, useEffect, useCallback } from 'react';

interface CookieBannerProps {
  lang: string;
  messages: {
    title: string;
    description: string;
    acceptAll: string;
    acceptNecessary: string;
    settings: string;
    save: string;
    necessary: string;
    necessaryDesc: string;
    analytics: string;
    analyticsDesc: string;
    marketing: string;
    marketingDesc: string;
  };
}

type ConsentType = 'all' | 'necessary' | 'custom';

interface ConsentState {
  type: ConsentType;
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
}

const STORAGE_KEY = 'igawo_cookie_consent';

function getInitialConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return null;
}

function saveConsent(state: ConsentState) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export default function CookieBanner({ lang, messages }: CookieBannerProps) {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [consent, setConsent] = useState<ConsentState>({
    type: 'necessary',
    necessary: true,
    analytics: false,
    marketing: false,
    timestamp: 0,
  });

  useEffect(() => {
    const existing = getInitialConsent();
    if (!existing) {
      setVisible(true);
    } else {
      setConsent(existing);
    }
  }, []);

  const handleAcceptAll = useCallback(() => {
    const newConsent: ConsentState = {
      type: 'all',
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: Date.now(),
    };
    saveConsent(newConsent);
    setConsent(newConsent);
    setVisible(false);
    setShowSettings(false);
  }, []);

  const handleAcceptNecessary = useCallback(() => {
    const newConsent: ConsentState = {
      type: 'necessary',
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: Date.now(),
    };
    saveConsent(newConsent);
    setConsent(newConsent);
    setVisible(false);
    setShowSettings(false);
  }, []);

  const handleSaveCustom = useCallback(() => {
    const newConsent: ConsentState = {
      type: 'custom',
      necessary: true,
      analytics: consent.analytics,
      marketing: consent.marketing,
      timestamp: Date.now(),
    };
    saveConsent(newConsent);
    setConsent(newConsent);
    setVisible(false);
    setShowSettings(false);
  }, [consent.analytics, consent.marketing]);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6"
      role="dialog"
      aria-label={messages.title}
      aria-modal="true"
      lang={lang}
    >
      <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-xl border border-stone-200/60 rounded-2xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.15)] overflow-hidden">
        {!showSettings ? (
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-stone-900 tracking-tight">
                  {messages.title}
                </h3>
                <p className="mt-2 text-sm text-stone-500 leading-relaxed max-w-2xl">
                  {messages.description}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <button
                  onClick={handleAcceptNecessary}
                  className="px-5 py-2.5 text-sm font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors"
                >
                  {messages.acceptNecessary}
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-full transition-colors shadow-sm"
                >
                  {messages.acceptAll}
                </button>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={() => setShowSettings(true)}
                className="text-sm text-stone-400 hover:text-stone-600 transition-colors underline underline-offset-2"
              >
                {messages.settings}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 md:p-8">
            <h3 className="text-lg font-semibold text-stone-900 tracking-tight">
              {messages.settings}
            </h3>
            <div className="mt-6 space-y-4">
              <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-stone-50 border border-stone-100">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-stone-900">{messages.necessary}</span>
                    <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-700 bg-brand-100 rounded-full">
                      {lang === 'pl' ? 'Wymagane' : lang === 'de' ? 'Erforderlich' : 'Required'}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-stone-500">{messages.necessaryDesc}</p>
                </div>
                <div className="shrink-0 w-11 h-6 rounded-full bg-brand-500 cursor-not-allowed opacity-60" aria-hidden="true">
                  <div className="w-5 h-5 bg-white rounded-full shadow-sm translate-x-[22px] translate-y-0.5" />
                </div>
              </div>

              <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-white border border-stone-200/60 hover:border-stone-300 transition-colors">
                <div className="flex-1">
                  <span className="text-sm font-medium text-stone-900">{messages.analytics}</span>
                  <p className="mt-1 text-sm text-stone-500">{messages.analyticsDesc}</p>
                </div>
                <button
                  onClick={() => setConsent((c) => ({ ...c, analytics: !c.analytics }))}
                  className={`shrink-0 w-11 h-6 rounded-full transition-colors ${consent.analytics ? 'bg-brand-500' : 'bg-stone-300'}`}
                  aria-pressed={consent.analytics}
                  role="switch"
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${consent.analytics ? 'translate-x-[22px]' : 'translate-x-0.5'} translate-y-0.5`}
                  />
                </button>
              </div>

              <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-white border border-stone-200/60 hover:border-stone-300 transition-colors">
                <div className="flex-1">
                  <span className="text-sm font-medium text-stone-900">{messages.marketing}</span>
                  <p className="mt-1 text-sm text-stone-500">{messages.marketingDesc}</p>
                </div>
                <button
                  onClick={() => setConsent((c) => ({ ...c, marketing: !c.marketing }))}
                  className={`shrink-0 w-11 h-6 rounded-full transition-colors ${consent.marketing ? 'bg-brand-500' : 'bg-stone-300'}`}
                  aria-pressed={consent.marketing}
                  role="switch"
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${consent.marketing ? 'translate-x-[22px]' : 'translate-x-0.5'} translate-y-0.5`}
                  />
                </button>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={() => setShowSettings(false)}
                className="text-sm text-stone-400 hover:text-stone-600 transition-colors"
              >
                {lang === 'pl' ? 'Wróć' : lang === 'de' ? 'Zurück' : 'Back'}
              </button>
              <button
                onClick={handleSaveCustom}
                className="px-5 py-2.5 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-full transition-colors shadow-sm"
              >
                {messages.save}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
