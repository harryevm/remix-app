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


// const SHOPIFY_STORE = "trevorf-testing.myshopify.com";
// const SHOPIFY_ACCESS_TOKEN = "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";
import { json } from '@remix-run/node';  // For JSON response
import { insertMongoData } from '../entry.server';
import { shopifyApp } from '@shopify/shopify-app-remix/server';


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

      try {
          // Parse the incoming JSON data
          const jsonData = await request.json();

          // 1. Get the Shopify session from shopifyApp
         const session = await shopifyApp.api.getSessionFromRequest(request);
         

         console.log(jsonData+' '+'----------JsonData');
         console.log(session+' '+'----------Session');
         if (!session) {
          return json({ success: false, message: 'No Shopify session found' }, { status: 401, headers }); // Important!
        }

         // 2. Handle Image Upload to Shopify Files (using the session)
          let shopifyImageURL = null;
          if (jsonData.image) {
            try {
              const uploadResponse = await shopifyApp.api.rest.Asset.create({
                session: session, // Use the session from shopifyApp
                data: {
                  key: `product_image_${Date.now()}`,
                  attachment: jsonData.image.startsWith('data:') ? jsonData.image.split(',')[1] : jsonData.image,
                  // public_url: true  // If needed
                },
                shop: session.shop, // Use the shop from the session
              });

              shopifyImageURL = uploadResponse.body.asset.public_url;
              console.log("Shopify Image URL:", shopifyImageURL);

            } catch (shopifyError) {
              console.error('Shopify Image Upload Error:', shopifyError);
              return json({ success: false, message: 'Error uploading image to Shopify' }, { status: 500, headers });
            }
          }
          
          // Insert the data into MongoDB
          // 3. Insert Data into MongoDB (same as before)
          const dataToInsert = { ...jsonData };
          if (shopifyImageURL) {
            dataToInsert.imageUrl = shopifyImageURL;
          }
          const result = await insertMongoData(dataToInsert);
          
          // // return json({ success: true, insertedId: result.insertedId });
          return json({ success: true, insertedId: result.insertedId }, { headers });

          

      } catch (error) {
          console.error('Error inserting data:', error);
          return json({ success: false, message: 'Error inserting data' }, { status: 500, headers });
      }
  }
}