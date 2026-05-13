import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return new Response(
        JSON.stringify({ success: false, message: 'Email is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid email format' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = import.meta.env.BREVO_API_KEY;
    const listId = import.meta.env.BREVO_LIST_ID;

    if (!apiKey) {
      console.error('BREVO_API_KEY is not configured');
      return new Response(
        JSON.stringify({ success: false, message: 'Service not configured' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const brevoBody: Record<string, unknown> = {
      email,
      updateEnabled: true,
    };

    if (listId) {
      brevoBody.listIds = [parseInt(String(listId), 10)];
    }

    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify(brevoBody),
    });

    if (response.ok) {
      return new Response(
        JSON.stringify({ success: true, message: 'Subscribed successfully' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const errorData = await response.json().catch(() => ({}));
    const isDuplicate = errorData?.code === 'duplicate_parameter' ||
                        errorData?.message?.toLowerCase?.().includes('already exist');

    if (isDuplicate) {
      return new Response(
        JSON.stringify({ success: true, message: 'Already subscribed' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.error('Brevo API error:', errorData);
    return new Response(
      JSON.stringify({ success: false, message: 'Subscription failed' }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Newsletter API error:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Internal error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
