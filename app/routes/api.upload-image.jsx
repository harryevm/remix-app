import { json } from '@remix-run/node';  // For JSON response
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

  
export async function action({ request }) {
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',  // For testing. Change to your Shopify domain in production
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      };
    
      // Handle preflight requests
      if (request.method === 'POST') {
        console.log(shopify)
        try {
          
            // Parse the incoming JSON data
            // const jsonData = await request.json();
            const formData = await request.formData();
            const name = formData.get('name');
            const email = formData.get('email');
            const imageFile = formData.get('image');
            console.log(name)
            console.log(email)
            console.log(imageFile)

            const jsonData = {
                name,
                email,
                imageFile, // Store the Shopify file URL
            };
            console.log(jsonData)
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
