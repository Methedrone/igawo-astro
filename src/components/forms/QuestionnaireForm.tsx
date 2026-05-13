import { useState, useCallback, useId } from 'react';
import { ui } from '../../i18n/ui';

type Lang = 'pl' | 'en' | 'de';
type QType = 'tax' | 'kindergeld' | 'soka';

interface Props {
  lang: Lang;
  type: QType;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  privacyConsent: boolean;
  country?: string;
  workYears?: string;
  familyStatus?: string;
  steuernummer?: string;
  childrenCount?: string;
  sokaType?: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  privacyConsent?: string;
  country?: string;
  workYears?: string;
  familyStatus?: string;
  steuernummer?: string;
  childrenCount?: string;
  sokaType?: string;
}

function useT(lang: Lang) {
  return (key: keyof (typeof ui)['pl']) => {
    const dict = ui[lang] as Record<string, string>;
    const fallback = ui['pl'] as Record<string, string>;
    return dict[key as string] ?? fallback[key as string] ?? key;
  };
}

export default function QuestionnaireForm({ lang, type }: Props) {
  const t = useT(lang);
  const [data, setData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
    privacyConsent: false,
    country: type === 'tax' ? 'germany' : undefined,
    familyStatus: type === 'tax' ? 'single' : undefined,
    sokaType: type === 'soka' ? 'new' : undefined,
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

    if (!values.privacyConsent) e.privacyConsent = t('q.privacyConsent.required');

    if (type === 'tax') {
      if (!values.country) e.country = t('form.error.required');
      if (!values.workYears?.trim()) e.workYears = t('form.error.required');
      if (!values.familyStatus) e.familyStatus = t('form.error.required');
    }

    if (type === 'kindergeld') {
      if (!values.childrenCount?.trim()) e.childrenCount = t('form.error.required');
    }

    if (type === 'soka') {
      if (!values.sokaType) e.sokaType = t('form.error.required');
    }

    if (!values.message?.trim()) e.message = t('form.error.required');
    else if (values.message.trim().length < 10) e.message = t('form.error.minLength').replace('{min}', '10');

    return e;
  }, [t, type]);

  const handleChange = (field: keyof FormData, value: string | boolean) => {
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
      const res = await fetch('/api/questionnaire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, lang, type }),
      });
      if (res.ok) {
        setStatus('success');
        setData({
          name: '', email: '', phone: '', message: '', privacyConsent: false,
          country: type === 'tax' ? 'germany' : undefined,
          familyStatus: type === 'tax' ? 'single' : undefined,
          sokaType: type === 'soka' ? 'new' : undefined,
        });
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
      <div role="status" aria-live="polite" className="rounded-2xl bg-brand-50 border border-brand-200 p-8 text-center">
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

  const FieldError = ({ field }: { field: keyof FormErrors }) => {
    if (!errors[field] || !touched[field]) return null;
    return (
      <p id={`${idPrefix}-${field}-error`} className="mt-1.5 text-sm text-red-600" role="alert">
        {errors[field]}
      </p>
    );
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6" aria-label={t(`q.${type}.title` as keyof (typeof ui)['pl'])}>
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
          <FieldError field="name" />
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
          <FieldError field="email" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor={`${idPrefix}-phone`} className="block text-sm font-medium text-stone-700 mb-2">
            {t('form.phone')}
          </label>
          <input
            id={`${idPrefix}-phone`}
            name="phone"
            type="tel"
            value={data.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            onBlur={() => handleBlur('phone')}
            className={inputClass('phone')}
            placeholder={t('form.phonePlaceholder')}
            aria-invalid={!!errors.phone && touched.phone}
            aria-describedby={errors.phone && touched.phone ? `${idPrefix}-phone-error` : undefined}
          />
          <FieldError field="phone" />
        </div>

        {type === 'tax' && (
          <div>
            <label htmlFor={`${idPrefix}-country`} className="block text-sm font-medium text-stone-700 mb-2">
              {t('q.country')} <span aria-hidden="true" className="text-red-500">*</span>
            </label>
            <select
              id={`${idPrefix}-country`}
              name="country"
              value={data.country}
              onChange={(e) => handleChange('country', e.target.value)}
              onBlur={() => handleBlur('country')}
              className={inputClass('country')}
              aria-required="true"
              aria-invalid={!!errors.country && touched.country}
            >
              <option value="germany">{t('q.country.germany')}</option>
              <option value="netherlands">{t('q.country.netherlands')}</option>
              <option value="other">{t('q.country.other')}</option>
            </select>
            <FieldError field="country" />
          </div>
        )}

        {type === 'kindergeld' && (
          <div>
            <label htmlFor={`${idPrefix}-childrenCount`} className="block text-sm font-medium text-stone-700 mb-2">
              {t('q.childrenCount')} <span aria-hidden="true" className="text-red-500">*</span>
            </label>
            <input
              id={`${idPrefix}-childrenCount`}
              name="childrenCount"
              type="text"
              inputMode="numeric"
              value={data.childrenCount}
              onChange={(e) => handleChange('childrenCount', e.target.value)}
              onBlur={() => handleBlur('childrenCount')}
              className={inputClass('childrenCount')}
              placeholder={t('q.childrenCountPlaceholder')}
              aria-required="true"
              aria-invalid={!!errors.childrenCount && touched.childrenCount}
              aria-describedby={errors.childrenCount && touched.childrenCount ? `${idPrefix}-childrenCount-error` : undefined}
            />
            <FieldError field="childrenCount" />
          </div>
        )}

        {type === 'soka' && (
          <div>
            <label htmlFor={`${idPrefix}-sokaType`} className="block text-sm font-medium text-stone-700 mb-2">
              {t('q.sokaType')} <span aria-hidden="true" className="text-red-500">*</span>
            </label>
            <select
              id={`${idPrefix}-sokaType`}
              name="sokaType"
              value={data.sokaType}
              onChange={(e) => handleChange('sokaType', e.target.value)}
              onBlur={() => handleBlur('sokaType')}
              className={inputClass('sokaType')}
              aria-required="true"
              aria-invalid={!!errors.sokaType && touched.sokaType}
            >
              <option value="new">{t('q.sokaType.new')}</option>
              <option value="correction">{t('q.sokaType.correction')}</option>
              <option value="question">{t('q.sokaType.question')}</option>
            </select>
            <FieldError field="sokaType" />
          </div>
        )}
      </div>

      {type === 'tax' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor={`${idPrefix}-workYears`} className="block text-sm font-medium text-stone-700 mb-2">
              {t('q.workYears')} <span aria-hidden="true" className="text-red-500">*</span>
            </label>
            <input
              id={`${idPrefix}-workYears`}
              name="workYears"
              type="text"
              value={data.workYears}
              onChange={(e) => handleChange('workYears', e.target.value)}
              onBlur={() => handleBlur('workYears')}
              className={inputClass('workYears')}
              placeholder={t('q.workYearsPlaceholder')}
              aria-required="true"
              aria-invalid={!!errors.workYears && touched.workYears}
              aria-describedby={errors.workYears && touched.workYears ? `${idPrefix}-workYears-error` : undefined}
            />
            <FieldError field="workYears" />
          </div>
          <div>
            <label htmlFor={`${idPrefix}-familyStatus`} className="block text-sm font-medium text-stone-700 mb-2">
              {t('q.familyStatus')} <span aria-hidden="true" className="text-red-500">*</span>
            </label>
            <select
              id={`${idPrefix}-familyStatus`}
              name="familyStatus"
              value={data.familyStatus}
              onChange={(e) => handleChange('familyStatus', e.target.value)}
              onBlur={() => handleBlur('familyStatus')}
              className={inputClass('familyStatus')}
              aria-required="true"
              aria-invalid={!!errors.familyStatus && touched.familyStatus}
            >
              <option value="single">{t('q.familyStatus.single')}</option>
              <option value="married">{t('q.familyStatus.married')}</option>
              <option value="divorced">{t('q.familyStatus.divorced')}</option>
              <option value="widowed">{t('q.familyStatus.widowed')}</option>
            </select>
            <FieldError field="familyStatus" />
          </div>
        </div>
      )}

      {type === 'tax' && (
        <div>
          <label htmlFor={`${idPrefix}-steuernummer`} className="block text-sm font-medium text-stone-700 mb-2">
            {t('q.steuernummer')}
          </label>
          <input
            id={`${idPrefix}-steuernummer`}
            name="steuernummer"
            type="text"
            value={data.steuernummer}
            onChange={(e) => handleChange('steuernummer', e.target.value)}
            onBlur={() => handleBlur('steuernummer')}
            className={inputClass('steuernummer')}
            placeholder={t('q.steuernummerPlaceholder')}
          />
        </div>
      )}

      <div>
        <label htmlFor={`${idPrefix}-message`} className="block text-sm font-medium text-stone-700 mb-2">
          {t('q.message')} <span aria-hidden="true" className="text-red-500">*</span>
        </label>
        <textarea
          id={`${idPrefix}-message`}
          name="message"
          rows={5}
          value={data.message}
          onChange={(e) => handleChange('message', e.target.value)}
          onBlur={() => handleBlur('message')}
          className={`${inputClass('message')} resize-none`}
          placeholder={t('q.messagePlaceholder')}
          aria-required="true"
          aria-invalid={!!errors.message && touched.message}
          aria-describedby={errors.message && touched.message ? `${idPrefix}-message-error` : undefined}
        />
        <FieldError field="message" />
      </div>

      <div className="flex items-start gap-3">
        <input
          id={`${idPrefix}-privacy`}
          name="privacyConsent"
          type="checkbox"
          checked={data.privacyConsent}
          onChange={(e) => handleChange('privacyConsent', e.target.checked)}
          onBlur={() => handleBlur('privacyConsent')}
          className="mt-1 h-5 w-5 rounded border-stone-300 text-brand-600 focus:ring-brand-500"
          aria-required="true"
          aria-invalid={!!errors.privacyConsent && touched.privacyConsent}
          aria-describedby={errors.privacyConsent && touched.privacyConsent ? `${idPrefix}-privacy-error` : undefined}
        />
        <label htmlFor={`${idPrefix}-privacy`} className="text-sm text-stone-600 leading-relaxed">
          {t('q.privacyConsent')} <span aria-hidden="true" className="text-red-500">*</span>
        </label>
      </div>
      {errors.privacyConsent && touched.privacyConsent && (
        <p id={`${idPrefix}-privacy-error`} className="text-sm text-red-600 -mt-3" role="alert">
          {errors.privacyConsent}
        </p>
      )}

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
        {status === 'sending' ? t('form.sending') : t('form.submit')}
        <svg className="ml-2 w-4 h-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </form>
  );
}
