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

/************ My Code *********************************/

// import { json } from '@remix-run/node';  // For JSON response
// import { insertMongoData } from '../entry.server';
// import fs from "fs";
// import path from "path";




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


/****************** End my code *****************************/

import { json } from '@remix-run/node'; 
import { insertMongoData } from '../entry.server'; 
import { writeFile } from "fs/promises";
import path, { dirname } from "path";
import { fileURLToPath } from 'url';
const SHOPIFY_STORE = "trevorf-testing.myshopify.com"; // Replace with your Shopify store URL
const ADMIN_API_TOKEN = "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";


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
        'Access-Control-Allow-Origin': '*', 
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    };

    try {
      // const __filename = fileURLToPath(import.meta.url);
      // const __dirname = dirname(__filename);
      // const uploadDir = path.join(__dirname, "../public/uploads");

      const formData = await request.formData();
      const file = formData.get("file");
      const title = formData.get("title");
      const email = formData.get("email");
      const password = formData.get("password");

      console.log(formData);
      console.log(file);
      console.log(title);

      if (!file || !title || !email || !password) {
          return json({ success: false, message: "Missing required fields" }, { status: 400, headers });
      }

      const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Image = buffer.toString("base64"); 

        // Upload file to Shopify Files API
        const response = await fetch(`https://${SHOPIFY_STORE}/admin/api/2025-01/graphql.json`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "X-Shopify-Access-Token": ADMIN_API_TOKEN,
          },
          body: JSON.stringify({
              query: `
                  mutation fileCreate($files: [FileCreateInput!]!) {
                      fileCreate(files: $files) {
                          files {
                              id
                              url
                          }
                          userErrors {
                              field
                              message
                          }
                      }
                  }
              `,
              variables: {
                  files: [
                      {
                          originalSource: `data:image/png;base64,${base64Image}`, // Convert to base64
                      },
                  ],
              },
          }),
      });

      const result = await response.json();

      if (result.data.fileCreate.userErrors.length > 0) {
          return json({ success: false, message: result.data.fileCreate.userErrors[0].message }, { status: 400,headers });
      }

      return json({ success: true, fileUrl: result.data.fileCreate.files[0].url },{ headers });

      // const result = await insertMongoData({ title, email, password, fileUrl });

      //  return json({ success: true, fileUrl, insertedId: result.insertedId }, { headers });

  } catch (error) {
      console.error("Error inserting data:", error);
      return json({ success: false, message: "Error inserting data" }, { status: 500, headers });
  }
}
