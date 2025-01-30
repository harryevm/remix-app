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

/*****************************************************************/
// import { json } from '@remix-run/node';  // For JSON response
// import { insertMongoData } from '../entry.server';





// export async function loader({ request }) {
//     if (request.method === 'OPTIONS') {
//       return new Response(null, {
//         status: 204,
//         headers: {
//           'Access-Control-Allow-Origin': '*',
//           'Access-Control-Allow-Methods': 'POST, OPTIONS',
//           'Access-Control-Allow-Headers': 'Content-Type',
//         },
//       });
//     }
//   }

  
// export async function action({ request }) {
//     const headers = {
//         'Content-Type': 'application/json',
//         'Access-Control-Allow-Origin': '*',  // For testing. Change to your Shopify domain in production
//         'Access-Control-Allow-Methods': 'POST, OPTIONS',
//         'Access-Control-Allow-Headers': 'Content-Type'
//       };
    
//       // Handle preflight requests
//       if (request.method === 'POST') {

//         try {
//             // Parse the incoming JSON data
//             const jsonData = await request.json();
            
//             // Insert the data into MongoDB
//             const result = await insertMongoData(jsonData);
            
//             // // return json({ success: true, insertedId: result.insertedId });
//             return json({ success: true, insertedId: result.insertedId }, { headers });

            

//         } catch (error) {
//             console.error('Error inserting data:', error);
//             return json({ success: false, message: 'Error inserting data' }, { status: 500, headers });
//         }
//     }
// }
/************************************************************************** */
import { json, redirect, unstable_parseMultipartFormData } from '@remix-run/node';
import fs from 'fs';
import fetch from 'node-fetch';


const SHOPIFY_STORE = "trevorf-testing.myshopify.com";
const SHOPIFY_ACCESS_TOKEN = "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";

// Define the upload directory
const UPLOAD_DIR = "./tmp";

export async function action({ request }) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*', // For testing, change in production
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    console.log("Start parsing form data...");
    
    // Parse the multipart form data
    const formData = await unstable_parseMultipartFormData(request, {
      // Handle the file upload
      file: async ({ filename, stream }) => {
        const filePath = `${UPLOAD_DIR}/${filename}`;
        const fileStream = fs.createWriteStream(filePath);
        stream.pipe(fileStream);

        // Return the path where the file is saved
        return new Promise((resolve, reject) => {
          fileStream.on('finish', () => resolve(filePath));
          fileStream.on('error', reject);
        });
      },
    });

    console.log("Form data parsed successfully!");

    const title = formData.get('title');
    const email = formData.get('email');
    const password = formData.get('password');
    const filePath = formData.get('file'); // Path to the uploaded file

    if (!filePath) {
      console.log("File is missing in the request");
      return json({ success: false, message: 'File is missing' }, { status: 400, headers });
    }

    console.log("File saved at:", filePath);

    // Read the uploaded file
    const fileBuffer = fs.readFileSync(filePath);

    // Upload the file to Shopify
    console.log("Uploading file to Shopify...");

    const shopifyResponse = await fetch(`https://${SHOPIFY_STORE}/admin/api/2023-04/files.json`, {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        file: {
          attachment: Buffer.from(fileBuffer).toString("base64"),
          filename: filePath.split("/").pop(),
        },
      }),
    });

    if (!shopifyResponse.ok) {
      console.log("Error uploading to Shopify:", shopifyResponse.statusText);
      const shopifyErrorText = await shopifyResponse.text();
      console.error("Shopify error:", shopifyErrorText);
      return json({ success: false, message: 'Failed to upload to Shopify' }, { status: 500, headers });
    }

    const shopifyData = await shopifyResponse.json();

    if (!shopifyData.file) {
      console.log("No file data returned from Shopify");
      return json({ success: false, message: "Failed to upload to Shopify" }, { status: 500, headers });
    }

    // Successfully uploaded to Shopify
    console.log("File successfully uploaded to Shopify:", shopifyData.file.url);

    return json({
      success: true,
      shopifyFileUrl: shopifyData.file.url,
      title,
      email,
      password,
    }, { headers });

  } catch (error) {
    console.error('Error during the action:', error);
    return json({ success: false, message: 'Error processing the file upload' }, { status: 500, headers });
  }
}