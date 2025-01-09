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

// import { json } from '@remix-run/node';  // For JSON response
// import { insertMongoData } from '../entry.server';
// import fs from 'fs/promises' 




  
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
            
//             // return json({ success: true, insertedId: result.insertedId });
//             return json({ success: true, insertedId: result.insertedId }, { headers });
//         } catch (error) {
//             console.error('Error inserting data:', error);
//             return json({ success: false, message: 'Error inserting data' }, { status: 500, headers });
//         }
//     }
// }




import { json } from '@remix-run/node'; // For JSON response
import { insertMongoData } from '../entry.server';
import fs from 'fs/promises';
import path from 'path';
import { commitSession, getSession } from '../session.server';




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
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'POST') {
    const session = await getSession(request);  
    const formData = await request.formData();
    const email = formData.get("email"); 
    try {
      // Parse the incoming form data
      


      // Extract form fields
      const name = formData.get('name');
      
      const address = formData.get('address');
      const phone = formData.get('phone');
      const image = formData.get('image'); // File object

      if (!image || typeof image === 'string') {
        throw new Error('Invalid image file.');
      }

      // Read the image as a buffer
      const imageBuffer = await image.arrayBuffer();
      
      
      if (!email) {
        throw new Error('User not logged in or user ID not available');
      }
      const userId = email; 
      session.set("customerId", userId);
      const cookie = await commitSession(session);


      // Define the base upload folder path
      const uploadFolderPath = path.join('./uploads', userId.toString());

      // Ensure the user's folder exists or create it
      await fs.mkdir(uploadFolderPath, { recursive: true });

      // Now, handle file uploads (assuming 'image' is the form field name)
   
  

      const imagePath = path.join(uploadFolderPath, image.name); // Example: './uploads/12/image.png'

      // Save the image to the specified path
      await fs.writeFile(imagePath, Buffer.from(imageBuffer));
      return json({ success: true, imageUrl: `/uploads/${customerId}/${file.name}` }, {
        headers: {
          "Set-Cookie": cookie,  // Set the session cookie
        },
      });

      // Option 1: Store the image as base64 in MongoDB
    //   const base64Image = Buffer.from(imageBuffer).toString('base64');

    //   // Option 2: Save the image file to a local folder (for simplicity)
    //   const filePath = `./uploads/${image.name}`;
    //   await fs.writeFile(filePath, Buffer.from(imageBuffer));

      // Prepare the data to be saved in MongoDB
      // Prepare the data to be saved in MongoDB (e.g., file path or base64)
      const data = {
        name,
        email,
        address,
        phone,
        image: `uploads/${userId}/${image.name}`, // Image URL relative to your server (e.g., 'uploads/12/image.png')
      };

      // Insert the data into MongoDB
      const result = await insertMongoData(data);

      return json({ success: true, insertedId: result.insertedId }, { headers });
    } catch (error) {
      console.error('Error inserting data:', error);
      return json({ success: false, message: 'Error inserting data' }, { status: 500, headers });
    }
  }
}
