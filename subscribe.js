// POST /api/subscribe — the only server-side piece.
// Holds the beehiiv API key so it never appears in the page source.
// Deploys automatically on Vercel as a serverless function.

const PUBLICATION_ID = 'pub_c08760ed-e3d3-4932-a673-547e90852451'; // Blockspace
const CAMPAIGN = 'megawatt-report'; // must match the automation trigger

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, utm_source, utm_medium } = req.body || {};

  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  if (!process.env.BEEHIIV_API_KEY) {
    console.error('BEEHIIV_API_KEY is not set');
    return res.status(500).json({ error: 'Server is not configured yet.' });
  }

  try {
    const r = await fetch(
      `https://api.beehiiv.com/v2/publications/${PUBLICATION_ID}/subscriptions`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.BEEHIIV_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          reactivate_existing: true,  // past unsubscribers can still request the report
          send_welcome_email: false,  // the automation's report email is the welcome
          utm_source: utm_source || 'landing_page',
          utm_medium: utm_medium || 'paid_social',
          utm_campaign: CAMPAIGN,     // fires the automation
        }),
      }
    );

    const data = await r.json().catch(() => ({}));

    if (!r.ok) {
      console.error('beehiiv error', r.status, data);
      return res.status(502).json({ error: 'Something went wrong on our end — try again in a moment.' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('subscribe failed', err);
    return res.status(500).json({ error: 'Something went wrong on our end — try again in a moment.' });
  }
}
