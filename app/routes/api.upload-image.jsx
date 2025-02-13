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
            const imageFile = formData.get('image');
            console.log(name)
            console.log(email)
            console.log(imageFile)

            const buffer = await imageFile.arrayBuffer();
            const fileBuffer = Buffer.from(buffer);

            // 2. Return a Promise from the action
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.v2.uploader.upload_stream(
                    {
                        folder: 'Shopify',
                    },
                    (error, result) => {
                        if (error) {
                            console.error('Cloudinary Upload Error:', error);
                            reject(json({ success: false, message: 'Error uploading image to Cloudinary', error: error.message }, { status: 500, headers })); // Reject with error response
                            return; // Important: Stop further execution in the callback
                        }

                        const imageUrl = result.secure_url;

                        const mongoData = {
                            name,
                            email,
                            imageUrl,
                        };

                        insertMongoData(mongoData)
                            .then(() => {
                                resolve(json({ success: true, insertedId: result.public_id }, { headers })); // Resolve with success response
                            })
                            .catch((mongoError) => {
                                console.error("MongoDB Error:", mongoError);
                                reject(json({ success: false, message: 'Error inserting into MongoDB', error: mongoError.message }, { status: 500, headers }));
                            });
                    }
                );
                const readableStream = new Readable();
                readableStream.push(fileBuffer);
                readableStream.push(null);
                readableStream.pipe(uploadStream);
            });
            

        } catch (error) {
            console.error('Error inserting data:', error);
            return json({ success: false, message: 'Error inserting data' }, { status: 500, headers });
        }
    }
}
