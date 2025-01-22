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
import fs from "fs";
import path from "path";
// import formidable from 'formidable';


const uploadsDir = path.resolve('app', 'routes', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  await fs.mkdir(uploadsDir, { recursive: true });
}


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
        // const form = formidable({
        //   multiples: false,
        //   uploadDir: uploadsDir,
        //   keepExtensions: true,
        // });
        
        try {
            // Parse the incoming JSON data
            // const jsonData = await request.json();
            
            // Insert the data into MongoDB
            // const result = await insertMongoData(jsonData);
            
            // // return json({ success: true, insertedId: result.insertedId });
            // return json({ success: true, insertedId: result.insertedId }, { headers });

            const formData = await request.json();
            console.log(formData);

            const name = formData.name;
            const email = formData.email;
            const address = formData.address;
            const phone = formData.phone;
            const imageFile  = formData.image; // File object

            if (!imageFile || typeof imageFile.name !== 'string') {
              throw new Error('Invalid file upload');
            }
                  // Create a unique folder name based on a random number and email
          const randomNumber = Math.floor(Math.random() * 100000);
          const folderName = `${randomNumber}-${email}`;
          const uploadDir = path.join(process.cwd(), 'public', 'uploads', folderName);
                // Ensure the directory exists
          await fs.mkdir(uploadDir, { recursive: true });

          // Save the file
          const filePath = path.join(uploadDir, imageFile.name);
          const buffer = await imageFile.arrayBuffer();
          await fs.writeFile(filePath, Buffer.from(buffer));

          // Generate the file URL
          const fileUrl = `https://remix-app-88og.onrender.com/uploads/${folderName}/${imageFile.name}`;

          // Save the form data to MongoDB, including the file URL
          const data = { name, email, address, phone, imageUrl: fileUrl };
          const result = await insertMongoData(data);

          // Return success response
          return json({ success: true, insertedId: result.insertedId, fileUrl }, { headers });

        } catch (error) {
            console.error('Error inserting data:', error);
            return json({ success: false, message: 'Error inserting data' }, { status: 500, headers });
        }
    }
}
