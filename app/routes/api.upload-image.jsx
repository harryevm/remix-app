import { json } from '@remix-run/node';  // For JSON response
import { insertMongoData } from '../entry.server';
import shopify from "../shopify.server"; // Import your Shopify app config




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
        if (request.method !== "POST") {
            return json({ success: false, message: "Invalid request method" }, { status: 405, headers });
        }


        try {
            const { session } = await shopify.authenticate.admin(request);
            if (!session) {
                return json({ success: false, message: "Unauthorized" }, { status: 401, headers });
            }

            // Shopify access token for the current shop
            const shopifyAccessToken = session.accessToken;
            const shop = session.shop; // Store domain


            // Parse the incoming JSON data
            const jsonData = await request.json();
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
