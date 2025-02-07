
import { json } from '@remix-run/node';  // For JSON response
import { insertMongoData } from '../entry.server';
import  shopify  from '../shopify.server'

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

  
export async function action({ request }) {
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',  // For testing. Change to your Shopify domain in production
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      };
    
      // Handle preflight requests
      if (request.method === 'POST') {

        try {

          const formData = await request.formData();
          console.log(formData);
          // Extract form fields
          const title = formData.get('title');
          const email = formData.get('email');
          const password = formData.get('password');
          const file = formData.get('file');
          console.log(title);
          console.log(email);
          console.log(password);
          console.log(file);

          if (!file) {
            return json({ success: false, message: 'No file uploaded' }, { status: 400, headers });
        }

        // Convert file to buffer for Shopify upload
        const fileBuffer = await file.arrayBuffer();
        const fileBase64 = Buffer.from(fileBuffer).toString('base64');

        // Upload to Shopify Files using Remix's built-in Shopify API
        const client = await shopify.api.rest.File.create({
            session: await shopify.api.session.customAppSession("your-shop-name.myshopify.com"),
            input: {
                files: [
                    {
                        originalSource: `data:${file.type};base64,${fileBase64}`,
                        alt: title
                    }
                ]
            }
        });

        if (!client || !client.files || client.files.length === 0) {
            return json({ success: false, message: 'File upload failed' }, { status: 500, headers });
        }

        const fileUrl = client.files[0].url;
          
            // Parse the incoming JSON data
            // const jsonData = await request.json();
            
            // Insert the data into MongoDB
            // const result = await insertMongoData(jsonData);
            const result = await insertMongoData({ title, email, password, fileUrl });

        
            // // return json({ success: true, insertedId: result.insertedId });
            return json({ success: true, insertedId: result.insertedId }, { headers });
        } catch (error) {
            console.error('Error inserting data:', error);
            return json({ success: false, message: 'Error inserting data' }, { status: 500, headers });
        }
    }
}
