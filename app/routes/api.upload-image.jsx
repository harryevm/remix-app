import { json } from '@remix-run/node';  // For JSON response
import { insertMongoData } from '../entry.server';

import cloudinary from 'cloudinary';

// Cloudinary configuration
cloudinary.config({
    cloud_name: 'de4fo1raf',
    api_key: '942849615248768',
    api_secret: 'QoigN9bkSQiqLiJ7AeVjWQElC4E',
});



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
    return json({ message: 'Invalid request' }, { status: 405 });

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
        
          
            // Parse the incoming JSON data
            // const jsonData = await request.json();
            const formData = await request.formData();
            const name = formData.get('name');
            const email = formData.get('email');
            const imageFile = formData.get('image');
            console.log(name)
            console.log(email)
            console.log(imageFile)

            // Upload image to Cloudinary
            const uploadResult = await cloudinary.v2.uploader.upload(imageFile, {
              folder: 'Shopify', // Optional: specify folder in Cloudinary
              resource_type: 'auto', // Automatically detect the resource type (e.g., image, video)
          });
          console.log('Cloudinary Upload Result:', uploadResult);
            const imageUrl = uploadResult.secure_url; 
            const jsonData = {
                name,
                email,
                imageFile: imageUrl, // Store the Shopify file URL
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
