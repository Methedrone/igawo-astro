import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },
  ui: {
    brand: { name: 'igawo CMS' },
  },
  collections: {
    services: collection({
      label: 'Usługi / Services',
      slugField: 'title',
      path: 'src/content/services/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Tytuł' } }),
        lang: fields.select({
          label: 'Język',
          options: [
            { label: 'Polski', value: 'pl' },
            { label: 'English', value: 'en' },
            { label: 'Deutsch', value: 'de' },
          ],
          defaultValue: 'pl',
        }),
        description: fields.text({ label: 'Opis' }),
        featured: fields.checkbox({ label: 'Wyróżnione', defaultValue: false }),
        content: fields.markdoc({ label: 'Treść' }),
      },
    }),
    downloads: collection({
      label: 'Pliki / Downloads',
      slugField: 'title',
      path: 'src/content/downloads/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Tytuł' } }),
        lang: fields.select({
          label: 'Język',
          options: [
            { label: 'Polski', value: 'pl' },
            { label: 'English', value: 'en' },
            { label: 'Deutsch', value: 'de' },
          ],
          defaultValue: 'pl',
        }),
        fileUrl: fields.text({ label: 'URL pliku' }),
        fileType: fields.text({ label: 'Typ pliku (pdf, docx)' }),
        content: fields.markdoc({ label: 'Treść' }),
      },
    }),
    forms: collection({
      label: 'Kwestionariusze / Forms',
      slugField: 'title',
      path: 'src/content/forms/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Tytuł' } }),
        lang: fields.select({
          label: 'Język',
          options: [
            { label: 'Polski', value: 'pl' },
            { label: 'English', value: 'en' },
            { label: 'Deutsch', value: 'de' },
          ],
          defaultValue: 'pl',
        }),
        formId: fields.text({ label: 'ID formularza' }),
        content: fields.markdoc({ label: 'Treść' }),
      },
    }),
    pages: collection({
      label: 'Strony / Pages',
      slugField: 'title',
      path: 'src/content/pages/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Tytuł' } }),
        lang: fields.select({
          label: 'Język',
          options: [
            { label: 'Polski', value: 'pl' },
            { label: 'English', value: 'en' },
            { label: 'Deutsch', value: 'de' },
          ],
          defaultValue: 'pl',
        }),
        description: fields.text({ label: 'Opis (SEO)' }),
        content: fields.markdoc({ label: 'Treść' }),
      },
    }),
    posts: collection({
      label: 'Wpisy / Posts',
      slugField: 'title',
      path: 'src/content/posts/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Tytuł' } }),
        lang: fields.select({
          label: 'Język',
          options: [
            { label: 'Polski', value: 'pl' },
            { label: 'English', value: 'en' },
            { label: 'Deutsch', value: 'de' },
          ],
          defaultValue: 'pl',
        }),
        date: fields.date({ label: 'Data' }),
        excerpt: fields.text({ label: 'Wstęp' }),
        featured: fields.checkbox({ label: 'Wyróżnione', defaultValue: false }),
        content: fields.markdoc({ label: 'Treść' }),
      },
    }),
    testimonials: collection({
      label: 'Opinie / Testimonials',
      slugField: 'title',
      path: 'src/content/testimonials/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Tytuł' } }),
        lang: fields.select({
          label: 'Język',
          options: [
            { label: 'Polski', value: 'pl' },
            { label: 'English', value: 'en' },
            { label: 'Deutsch', value: 'de' },
          ],
          defaultValue: 'pl',
        }),
        author: fields.text({ label: 'Autor' }),
        role: fields.text({ label: 'Rola / Stanowisko' }),
        featured: fields.checkbox({ label: 'Wyróżnione', defaultValue: false }),
        content: fields.markdoc({ label: 'Treść opinii' }),
      },
    }),
    partners: collection({
      label: 'Partnerzy / Partners',
      slugField: 'title',
      path: 'src/content/partners/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Tytuł' } }),
        lang: fields.select({
          label: 'Język',
          options: [
            { label: 'Polski', value: 'pl' },
            { label: 'English', value: 'en' },
            { label: 'Deutsch', value: 'de' },
          ],
          defaultValue: 'pl',
        }),
        description: fields.text({ label: 'Opis' }),
        content: fields.markdoc({ label: 'Treść' }),
      },
    }),
    faq: collection({
      label: 'FAQ',
      slugField: 'title',
      path: 'src/content/faq/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Tytuł / URL' } }),
        lang: fields.select({
          label: 'Język',
          options: [
            { label: 'Polski', value: 'pl' },
            { label: 'English', value: 'en' },
            { label: 'Deutsch', value: 'de' },
          ],
          defaultValue: 'pl',
        }),
        question: fields.text({ label: 'Pytanie / Question / Frage' }),
        order: fields.integer({ label: 'Kolejność / Order', defaultValue: 0 }),
        content: fields.markdoc({ label: 'Odpowiedź / Answer / Antwort' }),
      },
    }),
  },
});
