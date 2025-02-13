import { json } from '@remix-run/node';  // For JSON response
import { insertMongoData } from '../entry.server';

import cloudinary from 'cloudinary';
import { Readable } from 'stream';

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
            // const imageFile = formData.get('image');
            const imageFiles = formData.getAll('image');
            if (!imageFiles || imageFiles.length === 0) {
                return json({ success: false, message: 'At least one image file is required' }, { status: 400, headers });
            }
            
            console.log(name)
            console.log(email)
            console.log(imageFile)

            const imageUrls = [];
            const buffer = await imageFile.arrayBuffer();
            const fileBuffer = Buffer.from(buffer);

            // 2. Return a Promise from the action
            await Promise.all(
              imageFiles.map(async (imageFile) => {
                  return new Promise((resolve, reject) => {
                      const buffer = await imageFile.arrayBuffer();
                      const fileBuffer = Buffer.from(buffer);

                      const uploadStream = cloudinary.v2.uploader.upload_stream(
                          {
                              folder: 'Shopify',
                          },
                          (error, result) => {
                              if (error) {
                                  console.error('Cloudinary Upload Error:', error);
                                  reject(error); // Reject with the error
                                  return;
                              }

                              imageUrls.push(result.secure_url); // Add URL to the array
                              resolve(); // Resolve when upload is complete
                          }
                      );

                      const readableStream = new Readable();
                      readableStream.push(fileBuffer);
                      readableStream.push(null);
                      readableStream.pipe(uploadStream);
                  });
              })
          );
          const mongoData = {
            name,
            email,
            imageUrls, // Store the array of image URLs
        };

        const result = await insertMongoData(mongoData);
        return json({ success: true, insertedId: result.insertedId }, { headers });

            

        } catch (error) {
            console.error('Error inserting data:', error);
            return json({ success: false, message: 'Error inserting data' }, { status: 500, headers });
        }
    }
}
