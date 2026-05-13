export const SITE_URL = 'https://igawo.pl';

export const BUSINESS = {
  name: 'Izabela Gawłowska-Wolak',
  alternateName: 'igawo.pl',
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo-dark.png`,
  email: 'igawo14@gmail.com',
  phone: ['+49 157 526 669 22', '+48 570 016 826'],
  address: {
    streetAddress: 'ul. Przykładowa 12',
    addressLocality: 'Warszawa',
    postalCode: '00-001',
    addressCountry: 'PL',
  },
  geo: {
    latitude: 52.2297,
    longitude: 21.0122,
  },
  openingHours: ['Mo-Fr 09:00-18:00'],
  priceRange: '€€',
  sameAs: [],
  image: `${SITE_URL}/images/about.jpg`,
  description: {
    pl: 'Profesjonalne rozliczenia podatkowe z Niemiec i Holandii. Kindergeld, SOKA-BAU, upadłość konsumencka.',
    en: 'Professional tax returns from Germany and the Netherlands. Kindergeld, SOKA-BAU, consumer insolvency.',
    de: 'Professionelle Steuererklärungen aus Deutschland und den Niederlanden. Kindergeld, SOKA-BAU, Verbraucherinsolvenz.',
  },
  areaServed: [
    { name: 'Niemcy', lang: 'pl' },
    { name: 'Holandia', lang: 'pl' },
    { name: 'Polska', lang: 'pl' },
    { name: 'Germany', lang: 'en' },
    { name: 'Netherlands', lang: 'en' },
    { name: 'Poland', lang: 'en' },
    { name: 'Deutschland', lang: 'de' },
    { name: 'Niederlande', lang: 'de' },
    { name: 'Polen', lang: 'de' },
  ],
};

export type Lang = 'pl' | 'en' | 'de';

function getLang(l: string): Lang {
  if (l === 'en' || l === 'de') return l;
  return 'pl';
}

export function organizationSchema(lang: string) {
  const l = getLang(lang);
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: BUSINESS.name,
    alternateName: BUSINESS.alternateName,
    url: BUSINESS.url,
    logo: BUSINESS.logo,
    email: BUSINESS.email,
    telephone: BUSINESS.phone,
    description: BUSINESS.description[l],
    sameAs: BUSINESS.sameAs,
    image: BUSINESS.image,
  };
}

export function localBusinessSchema(lang: string) {
  const l = getLang(lang);
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${BUSINESS.url}/#business`,
    name: BUSINESS.name,
    alternateName: BUSINESS.alternateName,
    url: BUSINESS.url,
    logo: BUSINESS.logo,
    email: BUSINESS.email,
    telephone: BUSINESS.phone,
    description: BUSINESS.description[l],
    image: BUSINESS.image,
    priceRange: BUSINESS.priceRange,
    openingHoursSpecification: BUSINESS.openingHours.map((oh) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: oh.startsWith('Mo-Fr') ? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] : oh,
      opens: oh.split(' ')[1]?.split('-')[0] ?? '09:00',
      closes: oh.split(' ')[1]?.split('-')[1] ?? '18:00',
    })),
    address: {
      '@type': 'PostalAddress',
      ...BUSINESS.address,
    },
    geo: {
      '@type': 'GeoCoordinates',
      ...BUSINESS.geo,
    },
    areaServed: BUSINESS.areaServed
      .filter((a) => a.lang === l)
      .map((a) => ({
        '@type': 'Country',
        name: a.name,
      })),
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: BUSINESS.phone[0],
        contactType: 'customer service',
        availableLanguage: ['Polish', 'German', 'English'],
      },
      {
        '@type': 'ContactPoint',
        telephone: BUSINESS.phone[1],
        contactType: 'customer service',
        availableLanguage: ['Polish', 'German', 'English'],
      },
    ],
  };
}

export function websiteSchema(lang: string) {
  const l = getLang(lang);
  const siteName = l === 'pl' ? 'igawo.pl' : l === 'en' ? 'igawo.pl EN' : 'igawo.pl DE';
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: `${BUSINESS.url}${l === 'pl' ? '/pl' : `/${l}`}`,
    publisher: {
      '@type': 'Organization',
      name: BUSINESS.name,
      logo: BUSINESS.logo,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BUSINESS.url}/faq?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function breadcrumbSchema(
  items: { name: string; item?: string }[],
  lang: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => {
      const listItem: Record<string, unknown> = {
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
      };
      if (item.item) {
        listItem.item = `${BUSINESS.url}${item.item}`;
      }
      return listItem;
    }),
  };
}

export function serviceSchema(
  service: {
    title: string;
    description: string;
    url: string;
  },
  lang: string
) {
  const l = getLang(lang);
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: service.title,
    name: service.title,
    description: service.description,
    url: service.url,
    provider: {
      '@type': 'Organization',
      name: BUSINESS.name,
      url: BUSINESS.url,
    },
    areaServed: BUSINESS.areaServed
      .filter((a) => a.lang === l)
      .map((a) => ({
        '@type': 'Country',
        name: a.name,
      })),
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceType: 'Online and phone consultation',
      availableLanguage: ['Polish', 'German', 'English'],
    },
  };
}

export function faqPageSchema(
  faqs: { question: string; answer: string }[],
  lang: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function contactPageSchema(lang: string) {
  const l = getLang(lang);
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: l === 'pl' ? 'Kontakt' : l === 'en' ? 'Contact' : 'Kontakt',
    url: `${BUSINESS.url}${l === 'pl' ? '/pl/kontakt' : `/${l}/kontakt`}`,
    mainEntity: {
      '@type': 'Organization',
      name: BUSINESS.name,
      telephone: BUSINESS.phone,
      email: BUSINESS.email,
      address: {
        '@type': 'PostalAddress',
        ...BUSINESS.address,
      },
    },
  };
}

export function pricingPageSchema(lang: string) {
  const l = getLang(lang);
  const name = l === 'pl' ? 'Cennik' : l === 'en' ? 'Pricing' : 'Preise';
  const offers = [
    {
      name: l === 'pl' ? 'Start' : l === 'en' ? 'Start' : 'Start',
      price: '150.00',
      priceCurrency: 'EUR',
      description: l === 'pl' ? 'Podstawowe rozliczenie z jednego kraju' : l === 'en' ? 'Basic tax return from one country' : 'Grundlegende Steuererklärung aus einem Land',
    },
    {
      name: l === 'pl' ? 'Rozwój' : l === 'en' ? 'Growth' : 'Wachstum',
      price: '280.00',
      priceCurrency: 'EUR',
      description: l === 'pl' ? 'Więcej zwrotów, priorytetowa obsługa' : l === 'en' ? 'More refunds, priority handling' : 'Mehr Erstattungen, bevorzugte Bearbeitung',
    },
    {
      name: l === 'pl' ? 'Premium' : l === 'en' ? 'Premium' : 'Premium',
      price: '450.00',
      priceCurrency: 'EUR',
      description: l === 'pl' ? 'Kompleksowa obsługa bez limitu' : l === 'en' ? 'Full service with no limits' : 'Kompletter Service ohne Limit',
    },
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description: l === 'pl' ? 'Pakiety usług podatkowych igawo.pl' : l === 'en' ? 'igawo.pl tax service packages' : 'igawo.pl Steuerdienstleistungen Pakete',
    url: `${BUSINESS.url}${l === 'pl' ? '/cennik' : `/${l}${l === 'en' ? '/pricing' : '/preise'}`}`,
    provider: {
      '@type': 'Organization',
      name: BUSINESS.name,
    },
    offers: offers.map((o) => ({
      '@type': 'Offer',
      name: o.name,
      price: o.price,
      priceCurrency: o.priceCurrency,
      description: o.description,
      availability: 'https://schema.org/InStock',
      url: `${BUSINESS.url}${l === 'pl' ? '/cennik' : `/${l}${l === 'en' ? '/pricing' : '/preise'}`}`,
    })),
  };
}

export function articleSchema(
  article: {
    headline: string;
    description: string;
    image?: string;
    datePublished?: string;
    dateModified?: string;
    url: string;
    author?: string;
  },
  lang: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.headline,
    description: article.description,
    image: article.image ? `${BUSINESS.url}${article.image}` : BUSINESS.image,
    datePublished: article.datePublished ?? new Date().toISOString(),
    dateModified: article.dateModified ?? article.datePublished ?? new Date().toISOString(),
    url: `${BUSINESS.url}${article.url}`,
    author: {
      '@type': 'Person',
      name: article.author ?? BUSINESS.name,
    },
    publisher: {
      '@type': 'Organization',
      name: BUSINESS.name,
      logo: BUSINESS.logo,
    },
    inLanguage: lang,
  };
}
