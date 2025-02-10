import { json } from '@remix-run/node';  // For JSON response
import { insertMongoData } from '../entry.server';





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
          console.log(request)
            // Parse the incoming JSON data
            const jsonData = await request.formData();
            const title = jsonData.get('title');
            const email = jsonData.get('email');
            const password = jsonData.get('password');
            const file = jsonData.get('file');

            // Ensure file is present
            if (!file) {
              return json({ success: false, message: 'No file uploaded' }, { status: 400, headers });
            }
            const session = await shopify.authenticate.admin(request);

            console.log(session)
            console.log(title,email,password,file)
            
            // Insert the data into MongoDB
            const result = await insertMongoData(jsonData);
            
            // // return json({ success: true, insertedId: result.insertedId });
            return json({ success: true, insertedId: result.insertedId }, { headers });

            

        } catch (error) {
            console.error('Error inserting data:', error);
            return json({ success: false, message: 'Error inserting data' }, { status: 500, headers });
        }
    }
}
