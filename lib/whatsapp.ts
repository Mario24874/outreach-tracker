const WHATSAPP_API = 'https://graph.facebook.com/v21.0';

function authHeaders() {
  return {
    Authorization: `Bearer ${process.env.META_WHATSAPP_TOKEN}`,
    'Content-Type': 'application/json',
  };
}

export async function sendTextMessage(to: string, body: string) {
  const res = await fetch(
    `${WHATSAPP_API}/${process.env.META_PHONE_NUMBER_ID}/messages`,
    {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body },
      }),
    }
  );
  return res.json();
}

export async function sendTemplateMessage(
  to: string,
  templateName: string,
  languageCode: string,
  bodyParams: string[]
) {
  const components = [];
  if (bodyParams.length > 0) {
    components.push({
      type: 'body',
      parameters: bodyParams.map((text) => ({ type: 'text', text })),
    });
  }

  const res = await fetch(
    `${WHATSAPP_API}/${process.env.META_PHONE_NUMBER_ID}/messages`,
    {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        type: 'template',
        template: {
          name: templateName,
          language: { code: languageCode },
          components,
        },
      }),
    }
  );
  return res.json();
}

export async function listTemplates() {
  const res = await fetch(
    `${WHATSAPP_API}/${process.env.META_WABA_ID}/message_templates?limit=100`,
    { headers: { Authorization: `Bearer ${process.env.META_WHATSAPP_TOKEN}` } }
  );
  return res.json();
}

export async function createTemplate(
  name: string,
  category: 'MARKETING' | 'UTILITY',
  language: string,
  components: unknown[]
) {
  const res = await fetch(
    `${WHATSAPP_API}/${process.env.META_WABA_ID}/message_templates`,
    {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ name, category, language, components }),
    }
  );
  return res.json();
}

export async function markMessageRead(wamid: string) {
  const res = await fetch(
    `${WHATSAPP_API}/${process.env.META_PHONE_NUMBER_ID}/messages`,
    {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        status: 'read',
        message_id: wamid,
      }),
    }
  );
  return res.json();
}
