import type { APIRoute } from 'astro';
// @ts-ignore — Cloudflare Workers module
import { env as cfEnv } from 'cloudflare:workers';

export const prerender = false;

const handlerPromise = (async () => {
  const { makeGenericAPIRouteHandler } = await import('@keystatic/core/api/generic');
  const { default: keystaticConfig } = await import('../../../../keystatic.config');

  return makeGenericAPIRouteHandler(
    {
      config: keystaticConfig,
      clientId: cfEnv.KEYSTATIC_GITHUB_CLIENT_ID,
      clientSecret: cfEnv.KEYSTATIC_GITHUB_CLIENT_SECRET,
      secret: cfEnv.KEYSTATIC_SECRET,
    },
    { slugEnvName: 'PUBLIC_KEYSTATIC_GITHUB_APP_SLUG' }
  );
})();

export const ALL: APIRoute = async (context) => {
  const handler = await handlerPromise;
  const { body, headers, status } = await handler(context.request);

  const responseHeaders = new Headers();
  if (headers) {
    if (Array.isArray(headers)) {
      for (const [key, value] of headers) {
        responseHeaders.append(key, value);
      }
    } else if (typeof headers.entries === 'function') {
      for (const [key, value] of headers.entries()) {
        responseHeaders.set(key, value);
      }
    } else {
      for (const [key, value] of Object.entries(headers)) {
        responseHeaders.set(key, value as string);
      }
    }
  }

  return new Response(body, { status, headers: responseHeaders });
};
