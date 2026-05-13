export const prerender = false;

import type { APIContext } from 'astro';

export async function POST(context: APIContext) {
  const env = (context.locals.runtime?.env as Record<string, string> | undefined) ?? {};
  const endpoint = env.CONTACT_FORM_ENDPOINT;

  try {
    const body = await context.request.json();

    const name = String(body.name ?? '').trim();
    const email = String(body.email ?? '').trim();
    const phone = String(body.phone ?? '').trim();
    const subject = String(body.subject ?? '').trim();
    const message = String(body.message ?? '').trim();
    const lang = String(body.lang ?? 'pl');

    const errors: Record<string, string> = {};
    if (!name || name.length < 2) errors.name = 'Invalid name';
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Invalid email';
    if (phone && !/^[+0-9\s\-()]{7,20}$/.test(phone)) errors.phone = 'Invalid phone';
    if (!subject) errors.subject = 'Invalid subject';
    if (!message || message.length < 10) errors.message = 'Invalid message';

    if (Object.keys(errors).length > 0) {
      return new Response(JSON.stringify({ error: 'Validation failed', errors }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const payload = { name, email, phone, subject, message, lang, _gotcha: '' };

    if (endpoint) {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        return new Response(JSON.stringify({ error: 'Upstream error' }), {
          status: 502,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
