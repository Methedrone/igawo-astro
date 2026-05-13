import { useState, useCallback, useId } from 'react';
import { ui } from '../../i18n/ui';

type Lang = 'pl' | 'en' | 'de';

interface Props {
  lang: Lang;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

const subjects = [
  'contact.form.subject.germany',
  'contact.form.subject.netherlands',
  'contact.form.subject.kindergeld',
  'contact.form.subject.bankruptcy',
  'contact.form.subject.other',
] as const;

function useT(lang: Lang) {
  return (key: keyof (typeof ui)['pl']) => {
    const dict = ui[lang] as Record<string, string>;
    const fallback = ui['pl'] as Record<string, string>;
    return dict[key as string] ?? fallback[key as string] ?? key;
  };
}

export default function ContactForm({ lang }: Props) {
  const t = useT(lang);
  const [data, setData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: t('contact.form.subject.germany'),
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const idPrefix = useId();

  const validate = useCallback((values: FormData): FormErrors => {
    const e: FormErrors = {};
    if (!values.name.trim()) e.name = t('form.error.required');
    else if (values.name.trim().length < 2) e.name = t('form.error.minLength').replace('{min}', '2');

    if (!values.email.trim()) e.email = t('form.error.required');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) e.email = t('form.error.email');

    if (values.phone.trim() && !/^[+0-9\s\-()]{7,20}$/.test(values.phone)) {
      e.phone = t('form.error.phone');
    }

    if (!values.subject.trim()) e.subject = t('form.error.required');

    if (!values.message.trim()) e.message = t('form.error.required');
    else if (values.message.trim().length < 10) e.message = t('form.error.minLength').replace('{min}', '10');

    return e;
  }, [t]);

  const handleChange = (field: keyof FormData, value: string) => {
    const next = { ...data, [field]: value };
    setData(next);
    if (touched[field]) {
      setErrors(validate(next));
    }
  };

  const handleBlur = (field: keyof FormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate(data));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = Object.keys(data).reduce((acc, k) => ({ ...acc, [k]: true }), {});
    setTouched(allTouched);
    const validationErrors = validate(data);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      const firstError = document.querySelector<HTMLElement>('[aria-invalid="true"]');
      firstError?.focus();
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, lang }),
      });
      if (res.ok) {
        setStatus('success');
        setData({ name: '', email: '', phone: '', subject: t('contact.form.subject.germany'), message: '' });
        setTouched({});
        setErrors({});
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-2xl bg-brand-50 border border-brand-200 p-8 text-center"
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-brand-700">
          <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-stone-900">{t('form.success')}</h3>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-4 inline-flex items-center justify-center rounded-full bg-stone-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-stone-800 transition-all"
        >
          {t('common.back')}
        </button>
      </div>
    );
  }

  const inputClass = (field: keyof FormErrors) =>
    `w-full px-4 py-3 bg-white border rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all ${
      errors[field] && touched[field] ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-stone-200'
    }`;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6" aria-label={t('nav.contact')}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor={`${idPrefix}-name`} className="block text-sm font-medium text-stone-700 mb-2">
            {t('contact.form.name')} <span aria-hidden="true" className="text-red-500">*</span>
          </label>
          <input
            id={`${idPrefix}-name`}
            name="name"
            type="text"
            value={data.name}
            onChange={(e) => handleChange('name', e.target.value)}
            onBlur={() => handleBlur('name')}
            className={inputClass('name')}
            placeholder={t('contact.form.namePlaceholder')}
            aria-required="true"
            aria-invalid={!!errors.name && touched.name}
            aria-describedby={errors.name && touched.name ? `${idPrefix}-name-error` : undefined}
          />
          {errors.name && touched.name && (
            <p id={`${idPrefix}-name-error`} className="mt-1.5 text-sm text-red-600" role="alert">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={`${idPrefix}-email`} className="block text-sm font-medium text-stone-700 mb-2">
            {t('contact.form.email')} <span aria-hidden="true" className="text-red-500">*</span>
          </label>
          <input
            id={`${idPrefix}-email`}
            name="email"
            type="email"
            value={data.email}
            onChange={(e) => handleChange('email', e.target.value)}
            onBlur={() => handleBlur('email')}
            className={inputClass('email')}
            placeholder={t('contact.form.emailPlaceholder')}
            aria-required="true"
            aria-invalid={!!errors.email && touched.email}
            aria-describedby={errors.email && touched.email ? `${idPrefix}-email-error` : undefined}
          />
          {errors.email && touched.email && (
            <p id={`${idPrefix}-email-error`} className="mt-1.5 text-sm text-red-600" role="alert">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor={`${idPrefix}-phone`} className="block text-sm font-medium text-stone-700 mb-2">
            {t('contact.form.phone')}
          </label>
          <input
            id={`${idPrefix}-phone`}
            name="phone"
            type="tel"
            value={data.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            onBlur={() => handleBlur('phone')}
            className={inputClass('phone')}
            placeholder={t('contact.form.phonePlaceholder')}
            aria-invalid={!!errors.phone && touched.phone}
            aria-describedby={errors.phone && touched.phone ? `${idPrefix}-phone-error` : undefined}
          />
          {errors.phone && touched.phone && (
            <p id={`${idPrefix}-phone-error`} className="mt-1.5 text-sm text-red-600" role="alert">
              {errors.phone}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={`${idPrefix}-subject`} className="block text-sm font-medium text-stone-700 mb-2">
            {t('contact.form.subject')} <span aria-hidden="true" className="text-red-500">*</span>
          </label>
          <select
            id={`${idPrefix}-subject`}
            name="subject"
            value={data.subject}
            onChange={(e) => handleChange('subject', e.target.value)}
            onBlur={() => handleBlur('subject')}
            className={inputClass('subject')}
            aria-required="true"
            aria-invalid={!!errors.subject && touched.subject}
          >
            {subjects.map((key) => (
              <option key={key} value={t(key as keyof (typeof ui)['pl'])}>
                {t(key as keyof (typeof ui)['pl'])}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor={`${idPrefix}-message`} className="block text-sm font-medium text-stone-700 mb-2">
          {t('contact.form.message')} <span aria-hidden="true" className="text-red-500">*</span>
        </label>
        <textarea
          id={`${idPrefix}-message`}
          name="message"
          rows={5}
          value={data.message}
          onChange={(e) => handleChange('message', e.target.value)}
          onBlur={() => handleBlur('message')}
          className={`${inputClass('message')} resize-none`}
          placeholder={t('contact.form.messagePlaceholder')}
          aria-required="true"
          aria-invalid={!!errors.message && touched.message}
          aria-describedby={errors.message && touched.message ? `${idPrefix}-message-error` : undefined}
        />
        {errors.message && touched.message && (
          <p id={`${idPrefix}-message-error`} className="mt-1.5 text-sm text-red-600" role="alert">
            {errors.message}
          </p>
        )}
      </div>

      {status === 'error' && (
        <div role="alert" className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {t('form.error.generic')}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-stone-900 rounded-full hover:bg-stone-800 transition-all active:scale-[0.98] shadow-[0_8px_24px_-6px_rgba(0,0,0,0.25)] disabled:opacity-60 disabled:cursor-not-allowed"
        aria-busy={status === 'sending'}
      >
        {status === 'sending' ? t('form.sending') : t('contact.form.submit')}
        <svg className="ml-2 w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </form>
  );
}
