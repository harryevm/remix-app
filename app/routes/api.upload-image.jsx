import { json } from '@remix-run/node'; // For JSON response
import { insertMongoData } from '../entry.server';
import shopify from '../shopify.server';

export async function loader({ request }) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }
}

async function authenticateShopifySession(request) {
  const session = await shopify.authenticate.admin(request);
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}

export async function action({ request }) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*', // For testing. Change in production
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method !== 'POST') {
    return json({ success: false, message: 'Invalid request method' }, { status: 405, headers });
  }

  try {
    const formData = await request.formData();

    const title = formData.get('title');
    const email = formData.get('email');
    const password = formData.get('password');
    const file = formData.get('file');

    console.log(formData)

    if (!file) {
      return json({ success: false, message: 'No file uploaded' }, { status: 400, headers });
    }

    // Convert file to base64 for Shopify upload
    const fileBuffer = await file.arrayBuffer();
    const fileBase64 = Buffer.from(fileBuffer).toString('base64');

    // Authenticate Shopify session
    const session = await authenticateShopifySession(request);
    console.log(session)

    // Upload to Shopify Files API
    const fileUploadResponse = await shopify.rest.File.create({
      session,
      input: {
        files: [
          {
            originalSource: `data:${file.type};base64,${fileBase64}`,
            alt: title || 'Uploaded File',
          },
        ],
      },
    });

    if (!fileUploadResponse || !fileUploadResponse.files || fileUploadResponse.files.length === 0) {
      return json({ success: false, message: 'File upload failed' }, { status: 500, headers });
    }

    const fileUrl = fileUploadResponse.files[0].url;
    console.log(fileUrl)

    // Insert data into MongoDB
    const result = await insertMongoData({ title, email, password, fileUrl });

    return json({ success: true, insertedId: result.insertedId }, { headers });

  } catch (error) {
    console.error('Error:', error);
    return json({ success: false, message: 'Internal server error' }, { status: 500, headers });
  }
}
