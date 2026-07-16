// POST /api/subscribe
// Creates a Beehiiv subscriber and enrolls them in the Megawatt Report automation.

const PUBLICATION_ID = 'pub_c08760ed-e3d3-4932-a673-547e90852451';

const AUTOMATION_ID =
  'aut_8ec5ca18-2868-4beb-9f45-e66a17d40fda';

const CAMPAIGN = 'megawatt-report';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
    });
  }

  const { email, utm_source, utm_medium } = req.body || {};

  const isValidEmail =
    typeof email === 'string' &&
    /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);

  if (!isValidEmail) {
    return res.status(400).json({
      error: 'Please enter a valid email address.',
    });
  }

  if (!process.env.BEEHIIV_API_KEY) {
    console.error('BEEHIIV_API_KEY is not set');

    return res.status(500).json({
      error: 'Server is not configured yet.',
    });
  }

  try {
    const response = await fetch(
      `https://api.beehiiv.com/v2/publications/${PUBLICATION_ID}/subscriptions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.BEEHIIV_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          reactivate_existing: true,
          send_welcome_email: false,
          utm_source: utm_source || 'landing_page',
          utm_medium: utm_medium || 'paid_social',
          utm_campaign: CAMPAIGN,
          automation_ids: [AUTOMATION_ID],
        }),
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error('Beehiiv API error:', {
        status: response.status,
        data,
      });

      return res.status(502).json({
        error:
          data?.errors?.[0]?.message ||
          data?.message ||
          'Beehiiv could not process the subscription.',
      });
    }

    console.log('Beehiiv subscription created:', {
      email: email.trim().toLowerCase(),
      automationId: AUTOMATION_ID,
      response: data,
    });

    return res.status(200).json({
      ok: true,
      message: 'Subscription created successfully.',
    });
  } catch (error) {
    console.error('Subscription request failed:', error);

    return res.status(500).json({
      error: 'Something went wrong. Please try again.',
    });
  }
}
