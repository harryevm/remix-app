// import { json } from '@remix-run/node';  // For JSON response
// import { insertMongoData } from '../entry.server';


// export async function action({ request }) {
//   try {
//     // Parse the incoming form data (application/x-www-form-urlencoded or JSON)
//     const formData = await request.formData();

//     // Create an empty object to store form data dynamically
//     const data = {};

//     // Loop through each form field and dynamically add it to the data object
//     formData.forEach((value, key) => {
//       data[key] = value;
//     });

//     // Insert the data into MongoDB
//     const result = await insertMongoData(data);

//     // Return the result of the insertion
//     return json({ success: true, insertedId: result.insertedId });
//   } catch (error) {
//     console.error('Error inserting data:', error);
//     return json({ success: false, message: 'Error inserting data' }, { status: 500 });
//   }
// }

import { json } from '@remix-run/node';  // For JSON response
import { insertMongoData } from '../entry.server';
import formidable from 'formidable';
import { createReadStream } from 'fs';
import shopify from '../shopify.server';




export async function loader({ request }) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': 'https://trevorf-testing.myshopify.com/',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }
  }

  
export async function action({ request }) {
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://trevorf-testing.myshopify.com/',  // For testing. Change to your Shopify domain in production
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      };
    
      // Handle preflight requests
      if (request.method === 'POST') {

        try {

          const form = formidable({ multiples: true });
          const [fields, files] = await new Promise((resolve, reject) => {
            form.parse(request, (err, fields, files) => {
              if (err) reject(err);
              resolve([fields, files]);
            });
          });

          const { session } = await shopify.authenticate.admin(request);
          const fileStream = createReadStream(files.file.filepath);

          const uploadResponse = await shopify.rest.File.create({
            session,
            file: {
              attachment: fileStream,
              filename: files.file.originalFilename,
            },
          });

          const imageUrl = uploadResponse.public_url;

          console.log(fields);
          console.log(imageUrl);
      // Prepare data to insert into MongoDB
      const dataToInsert = {
        name: fields.name,
        password: fields.password,
        email: fields.email,
        imageUrl: imageUrl,
      };
      console.log(dataToInsert);
            // Parse the incoming JSON data
            // const jsonData = await request.json();
            
            // Insert the data into MongoDB
            const result = await insertMongoData(dataToInsert);
      console.log(result);

            
            // // return json({ success: true, insertedId: result.insertedId });
            return json({ success: true, insertedId: result.insertedId }, { headers });

            

        } catch (error) {
            console.error('Error inserting data:', error);
            return json({ success: false, message: 'Error inserting data' }, { status: 500, headers });
        }
    }
}
