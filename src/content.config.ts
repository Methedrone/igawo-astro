import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const slugField = z.object({
  name: z.string(),
  slug: z.string(),
});

const services = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/services' }),
  schema: z.object({
    title: slugField,
    lang: z.enum(['pl', 'en', 'de']).default('pl'),
    description: z.string(),
    featured: z.boolean().default(false),
  }),
});

const downloads = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/downloads' }),
  schema: z.object({
    title: slugField,
    lang: z.enum(['pl', 'en', 'de']).default('pl'),
    fileUrl: z.string(),
    fileType: z.string(),
  }),
});

const forms = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/forms' }),
  schema: z.object({
    title: slugField,
    lang: z.enum(['pl', 'en', 'de']).default('pl'),
    formId: z.string(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/pages' }),
  schema: z.object({
    title: slugField,
    lang: z.enum(['pl', 'en', 'de']).default('pl'),
    description: z.string(),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/posts' }),
  schema: z.object({
    title: slugField,
    lang: z.enum(['pl', 'en', 'de']).default('pl'),
    date: z.date(),
    excerpt: z.string(),
    featured: z.boolean().default(false),
  }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/testimonials' }),
  schema: z.object({
    title: slugField,
    lang: z.enum(['pl', 'en', 'de']).default('pl'),
    author: z.string(),
    role: z.string(),
    featured: z.boolean().default(false),
  }),
});

const partners = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/partners' }),
  schema: z.object({
    title: slugField,
    lang: z.enum(['pl', 'en', 'de']).default('pl'),
    description: z.string(),
  }),
});

const faq = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/faq' }),
  schema: z.object({
    title: slugField,
    lang: z.enum(['pl', 'en', 'de']).default('pl'),
    question: z.string(),
    order: z.number().default(0),
  }),
});

export const collections = { services, downloads, forms, pages, posts, testimonials, partners, faq };
