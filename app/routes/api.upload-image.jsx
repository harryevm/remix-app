// api.upload-image.jsx
import { json } from '@remix-run/node'; 
import { insertMongoData } from '../entry.server';
import shopify from '../shopify.server';

export async function action({ request }) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers,
    });
  }

  // Handle POST request for image upload
  if (request.method === 'POST') {
    try {
      console.log(request);
      const formData = await request.formData();
      const title = formData.get('title');
      const email = formData.get('email');
      const password = formData.get('password');
      const file = formData.get('file');

      // Ensure file is present
      if (!file) {
        return json({ success: false, message: 'No file uploaded' }, { status: 400, headers });
      }

      // Convert file to buffer and base64 string
      const fileBuffer = await file.arrayBuffer();
      const fileBase64 = Buffer.from(fileBuffer).toString('base64');

      // Authenticate and get session
      const session = await shopify.authenticate.admin(request);

      // Check if session exists and is valid
      if (!session) {
        return json({ success: false, message: 'Unauthorized' }, { status: 401, headers });
      }

      // Upload file to Shopify
      const fileUploadResponse = await shopify.rest.File.create({
        session: session.admin,
        input: {
          files: [
            {
              originalSource: `data:${file.type};base64,${fileBase64}`,
              alt: title,
            },
          ],
        },
      });

      // Check if the file upload was successful
      if (!fileUploadResponse || !fileUploadResponse.files || fileUploadResponse.files.length === 0) {
        return json({ success: false, message: 'File upload failed' }, { status: 500, headers });
      }

      const fileUrl = fileUploadResponse.files[0].url;

      // Insert data into MongoDB (or another database)
      const result = await insertMongoData({ title, email, password, fileUrl });

      return json({ success: true, insertedId: result.insertedId }, { headers });
    } catch (error) {
      console.error('Error processing image upload:', error);
      return json({ success: false, message: 'Error processing upload' }, { status: 500, headers });
    }
  }
}
