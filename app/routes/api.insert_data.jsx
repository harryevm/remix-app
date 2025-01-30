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
import { json } from '@remix-run/node';
import formidable from 'formidable';
import fs from 'fs';
import fetch from 'node-fetch';

const SHOPIFY_STORE = "trevorf-testing.myshopify.com";
const SHOPIFY_ACCESS_TOKEN = "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";

// Set up formidable options
const form = new formidable.IncomingForm();
form.uploadDir = "./tmp"; // Temporary folder to store uploaded files
form.keepExtensions = true; // Keep file extension

export async function action({ request }) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method !== 'POST') {
        return json({ success: false, message: 'Invalid request method' }, { status: 405, headers });
    }

    return new Promise((resolve, reject) => {
        form.parse(request, async (err, fields, files) => {
            if (err) {
                console.error("Error parsing form data:", err);
                return resolve(json({ success: false, message: 'Error parsing form data' }, { status: 500, headers }));
            }

            const title = fields.title[0];  // Assuming title is sent in fields
            const email = fields.email[0];  // Same for email
            const password = fields.password[0];  // Same for password

            const file = files.file[0]; // This will contain the file object
            const filePath = file.filepath; // Temporary path where the file is stored

            if (!filePath) {
                return resolve(json({ success: false, message: "File is missing" }, { status: 400, headers }));
            }

            // Read the file into a buffer and upload it to Shopify
            const fileBuffer = fs.readFileSync(filePath);

            try {
                // Upload file to Shopify
                const shopifyResponse = await fetch(`https://${SHOPIFY_STORE}/admin/api/2023-04/files.json`, {
                    method: "POST",
                    headers: {
                        "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        file: {
                            attachment: Buffer.from(fileBuffer).toString("base64"),
                            filename: file.originalFilename,
                        },
                    }),
                });

                const shopifyData = await shopifyResponse.json();
                if (!shopifyData.file) {
                    return resolve(json({ success: false, message: "Failed to upload to Shopify" }, { status: 500, headers }));
                }

                // Successfully uploaded to Shopify
                return resolve(json({
                    success: true,
                    shopifyFileUrl: shopifyData.file.url,
                    title,
                    email,
                    password,
                }, { headers }));

            } catch (uploadError) {
                console.error('Error uploading file to Shopify:', uploadError);
                return resolve(json({ success: false, message: 'Error uploading file to Shopify' }, { status: 500, headers }));
            }
        });
    });
}
