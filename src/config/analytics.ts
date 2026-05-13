// Analytics configuration for igawo.pl
// Replace placeholder values with your actual tracking IDs before deploying.

export const ANALYTICS_CONFIG = {
  /** Google Analytics 4 */
  ga4: {
    enabled: true,
    /** Your GA4 Measurement ID (e.g. G-XXXXXXXXXX) */
    measurementId: '',
  },
  /** Meta (Facebook) Pixel */
  metaPixel: {
    enabled: true,
    /** Your Meta Pixel ID (e.g. 1234567890123456) */
    pixelId: '',
  },
  /** Google Search Console — HTML tag verification */
  gsc: {
    enabled: true,
    /** Full content of the verification meta tag (e.g. abc123...xyz) */
    verificationCode: '',
  },
  /** LinkedIn Insight Tag */
  linkedInInsight: {
    enabled: true,
    /** Your LinkedIn Partner ID (e.g. 1234567) */
    partnerId: '',
  },
  /** Facebook JavaScript SDK — for social plugins (Like, Share, Messenger, etc.) */
  facebookSdk: {
    enabled: true,
    /** Your Facebook App ID */
    appId: '',
  },
} as const;

/** Languages mapped to GA4 locale strings */
export const GA4_LOCALES: Record<string, string> = {
  pl: 'pl_PL',
  en: 'en_US',
  de: 'de_DE',
};

/** Languages mapped to Meta Pixel language codes */
export const META_LOCALES: Record<string, string> = {
  pl: 'pl_PL',
  en: 'en_US',
  de: 'de_DE',
};

/** Languages mapped to Facebook SDK locale strings */
export const FACEBOOK_LOCALES: Record<string, string> = {
  pl: 'pl_PL',
  en: 'en_US',
  de: 'de_DE',
};
