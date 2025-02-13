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
            // const name = formData.get('name');
            // const email = formData.get('email');
            // // const imageFile = formData.get('image');
            // const imageFiles = formData.getAll('image');
            // console.log(name)
            // console.log(email)
            // console.log(imageFiles)
            const formFields = {};
            const imageUrls = [];

            for (let [key, value] of formData.entries()) {
              
                  if (value instanceof File) {
                      const buffer = await value.arrayBuffer();  // Await the arrayBuffer
                      const fileBuffer = Buffer.from(buffer);

                      // Upload to Cloudinary and await the result
                      const uploadResult = await new Promise((resolve, reject) => {
                          const uploadStream = cloudinary.v2.uploader.upload_stream(
                              { folder: 'Shopify' },
                              (error, result) => {
                                  if (error) {
                                      reject(error);
                                  } else {
                                      resolve(result);
                                  }
                              }
                          );

                          const readableStream = new Readable();
                          readableStream.push(fileBuffer);
                          readableStream.push(null);
                          readableStream.pipe(uploadStream);
                      });

                      // Push the uploaded image URL to imageUrls array
                      imageUrls.push(uploadResult.secure_url);
                  }
                  else {
                    // Otherwise, store regular form fields (text, email, etc.)
                    formFields[key] = value;
                }
              
          }

          // After uploading all images, insert data into MongoDB
          const mongoData = {
              ...formFields,
              imageUrls,
          };

          await insertMongoData(mongoData);

          return json({ success: true, insertedId: mongoData._id, imageUrls }, { headers });

      } catch (error) {
          console.error('Error inserting data:', error);
          return json({ success: false, message: 'Error inserting data' }, { status: 500, headers });
      }
  }
}
